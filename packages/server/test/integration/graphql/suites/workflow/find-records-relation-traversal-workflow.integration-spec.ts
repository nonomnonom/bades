import gql from 'graphql-tag';
import request from 'supertest';
import { createManyOperationFactory } from 'test/integration/graphql/utils/create-many-operation-factory.util';
import { deleteManyOperationFactory } from 'test/integration/graphql/utils/delete-many-operation-factory.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import {
  destroyWorkflowRun,
  runWorkflowVersion,
  waitForWorkflowCompletion,
} from 'test/integration/graphql/suites/workflow/utils/workflow-run-test.util';
import { makeMetadataAPIRequest } from 'test/integration/metadata/suites/utils/make-metadata-api-request.util';
import { v4 as uuidv4 } from 'uuid';

const client = request(`http://localhost:${APP_PORT}`);

const TEST_KELUARGA_KK1_ID = '30303030-eeee-4000-8000-000000000001';
const TEST_KELUARGA_KK2_ID = '30303030-eeee-4000-8000-000000000002';
const TEST_PENDUDUK_KK1_ANGGOTA_1_ID = '30303030-ffff-4000-8000-000000000001';
const TEST_PENDUDUK_KK1_ANGGOTA_2_ID = '30303030-ffff-4000-8000-000000000002';
const TEST_PENDUDUK_KK2_ANGGOTA_1_ID = '30303030-ffff-4000-8000-000000000003';
const ALL_TEST_PENDUDUK_IDS = [
  TEST_PENDUDUK_KK1_ANGGOTA_1_ID,
  TEST_PENDUDUK_KK1_ANGGOTA_2_ID,
  TEST_PENDUDUK_KK2_ANGGOTA_1_ID,
];
const ALL_TEST_KELUARGA_IDS = [TEST_KELUARGA_KK1_ID, TEST_KELUARGA_KK2_ID];

describe('FindRecords workflow action with relation-traversal filter (e2e)', () => {
  let createdWorkflowId: string | null = null;
  let createdWorkflowVersionId: string | null = null;
  let findRecordsStepId: string | null = null;
  let createdWorkflowRunId: string | null = null;
  let pendudukKartuKeluargaFieldMetadataId: string | null = null;
  let keluargaAlamatFieldMetadataId: string | null = null;

  const lookupFieldMetadataIds = async () => {
    const objectsResponse = await makeMetadataAPIRequest({
      query: gql`
        query Objects($filter: ObjectFilter!, $paging: CursorPaging!) {
          objects(filter: $filter, paging: $paging) {
            edges {
              node {
                nameSingular
                fieldsList {
                  id
                  name
                }
              }
            }
          }
        }
      `,
      variables: { paging: { first: 1000 }, filter: {} },
    });

    expect(objectsResponse.body.errors).toBeUndefined();

    const objects: Array<{
      nameSingular: string;
      fieldsList: Array<{ id: string; name: string }>;
    }> = objectsResponse.body.data.objects.edges.map(
      (edge: { node: unknown }) => edge.node,
    );

    const pendudukObject = objects.find((o) => o.nameSingular === 'penduduk');
    const keluargaObject = objects.find((o) => o.nameSingular === 'keluarga');

    pendudukKartuKeluargaFieldMetadataId =
      pendudukObject?.fieldsList.find((f) => f.name === 'kartuKeluarga')?.id ??
      null;
    keluargaAlamatFieldMetadataId =
      keluargaObject?.fieldsList.find((f) => f.name === 'alamat')?.id ?? null;

    if (
      !pendudukKartuKeluargaFieldMetadataId ||
      !keluargaAlamatFieldMetadataId
    ) {
      throw new Error(
        `Could not resolve required field metadata ids — penduduk.kartuKeluarga=${pendudukKartuKeluargaFieldMetadataId}, keluarga.alamat=${keluargaAlamatFieldMetadataId}`,
      );
    }
  };

  const seedTestRecords = async () => {
    await makeGraphqlAPIRequest(
      createManyOperationFactory({
        objectMetadataSingularName: 'keluarga',
        objectMetadataPluralName: 'keluargas',
        gqlFields: 'id',
        data: [
          {
            id: TEST_KELUARGA_KK1_ID,
            nomorKk: '3201070000000001',
            alamat: 'Dusun Workflow 001',
          },
          {
            id: TEST_KELUARGA_KK2_ID,
            nomorKk: '3201070000000002',
            alamat: 'Dusun Workflow 002',
          },
        ],
        upsert: true,
      }),
    );

    await makeGraphqlAPIRequest(
      createManyOperationFactory({
        objectMetadataSingularName: 'penduduk',
        objectMetadataPluralName: 'penduduks',
        gqlFields: 'id',
        data: [
          {
            id: TEST_PENDUDUK_KK1_ANGGOTA_1_ID,
            kartuKeluargaId: TEST_KELUARGA_KK1_ID,
            tempatLahir: 'workflow-test-kk1-anggota-1',
          },
          {
            id: TEST_PENDUDUK_KK1_ANGGOTA_2_ID,
            kartuKeluargaId: TEST_KELUARGA_KK1_ID,
            tempatLahir: 'workflow-test-kk1-anggota-2',
          },
          {
            id: TEST_PENDUDUK_KK2_ANGGOTA_1_ID,
            kartuKeluargaId: TEST_KELUARGA_KK2_ID,
            tempatLahir: 'workflow-test-kk2-anggota-1',
          },
        ],
        upsert: true,
      }),
    );
  };

  const buildWorkflow = async () => {
    const createWorkflowResponse = await client
      .post('/graphql')
      .set('Authorization', `Bearer ${APPLE_JANE_ADMIN_ACCESS_TOKEN}`)
      .send({
        query: `
          mutation CreateWorkflow {
            createWorkflow(data: { name: "Relation Traversal Find Records Test" }) {
              id
            }
          }
        `,
      });

    expect(createWorkflowResponse.body.errors).toBeUndefined();
    createdWorkflowId = createWorkflowResponse.body.data.createWorkflow.id;

    const getWorkflowResponse = await client
      .post('/graphql')
      .set('Authorization', `Bearer ${APPLE_JANE_ADMIN_ACCESS_TOKEN}`)
      .send({
        query: `
          query GetWorkflow($id: UUID!) {
            workflow(filter: { id: { eq: $id } }) {
              id
              versions { edges { node { id } } }
            }
          }
        `,
        variables: { id: createdWorkflowId },
      });

    createdWorkflowVersionId =
      getWorkflowResponse.body.data.workflow.versions.edges[0].node.id;

    await client
      .post('/graphql')
      .set('Authorization', `Bearer ${APPLE_JANE_ADMIN_ACCESS_TOKEN}`)
      .send({
        query: `
          mutation UpdateWorkflowVersion($id: UUID!, $data: WorkflowVersionUpdateInput!) {
            updateWorkflowVersion(id: $id, data: $data) { id }
          }
        `,
        variables: {
          id: createdWorkflowVersionId,
          data: {
            trigger: {
              name: 'Manual Trigger',
              type: 'MANUAL',
              settings: { outputSchema: {} },
              nextStepIds: [],
              position: { x: 0, y: 0 },
            },
          },
        },
      });

    const createStepResponse = await client
      .post('/graphql')
      .set('Authorization', `Bearer ${APPLE_JANE_ADMIN_ACCESS_TOKEN}`)
      .send({
        query: `
          mutation CreateWorkflowVersionStep($input: CreateWorkflowVersionStepInput!) {
            createWorkflowVersionStep(input: $input) { stepsDiff }
          }
        `,
        variables: {
          input: {
            workflowVersionId: createdWorkflowVersionId,
            stepType: 'FIND_RECORDS',
            parentStepId: 'trigger',
            position: { x: 200, y: 0 },
          },
        },
      });

    expect(createStepResponse.body.errors).toBeUndefined();

    const getVersionResponse = await client
      .post('/graphql')
      .set('Authorization', `Bearer ${APPLE_JANE_ADMIN_ACCESS_TOKEN}`)
      .send({
        query: `
          query GetWorkflowVersion($id: UUID!) {
            workflowVersion(filter: { id: { eq: $id } }) { steps }
          }
        `,
        variables: { id: createdWorkflowVersionId },
      });

    const steps = getVersionResponse.body.data.workflowVersion.steps;
    const findRecordsStep = steps.find(
      (step: { type: string }) => step.type === 'FIND_RECORDS',
    );

    expect(findRecordsStep).toBeDefined();
    findRecordsStepId = findRecordsStep.id;

    const filterGroupId = uuidv4();
    const filterId = uuidv4();

    const updateStepResponse = await client
      .post('/graphql')
      .set('Authorization', `Bearer ${APPLE_JANE_ADMIN_ACCESS_TOKEN}`)
      .send({
        query: `
          mutation UpdateWorkflowVersionStep($input: UpdateWorkflowVersionStepInput!) {
            updateWorkflowVersionStep(input: $input) { id }
          }
        `,
        variables: {
          input: {
            workflowVersionId: createdWorkflowVersionId,
            step: {
              ...findRecordsStep,
              settings: {
                ...findRecordsStep.settings,
                input: {
                  ...findRecordsStep.settings.input,
                  objectName: 'penduduk',
                  limit: 25,
                  filter: {
                    recordFilters: [
                      {
                        id: filterId,
                        type: 'TEXT',
                        label: 'Kartu Keluarga → Alamat',
                        value: 'Dusun Workflow 001',
                        operand: 'CONTAINS',
                        displayValue: 'Dusun Workflow 001',
                        fieldMetadataId: pendudukKartuKeluargaFieldMetadataId,
                        relationTargetFieldMetadataId:
                          keluargaAlamatFieldMetadataId,
                        recordFilterGroupId: filterGroupId,
                      },
                    ],
                    recordFilterGroups: [
                      { id: filterGroupId, logicalOperator: 'AND' },
                    ],
                  },
                },
              },
            },
          },
        },
      });

    expect(updateStepResponse.body.errors).toBeUndefined();

    const activateResponse = await client
      .post('/graphql')
      .set('Authorization', `Bearer ${APPLE_JANE_ADMIN_ACCESS_TOKEN}`)
      .send({
        query: `
          mutation ActivateWorkflowVersion($workflowVersionId: UUID!) {
            activateWorkflowVersion(workflowVersionId: $workflowVersionId)
          }
        `,
        variables: { workflowVersionId: createdWorkflowVersionId },
      });

    expect(activateResponse.body.errors).toBeUndefined();
  };

  beforeAll(async () => {
    await lookupFieldMetadataIds();
    await seedTestRecords();
    await buildWorkflow();
  });

  afterAll(async () => {
    if (createdWorkflowRunId) {
      await destroyWorkflowRun(createdWorkflowRunId);
    }
    if (createdWorkflowId) {
      await client
        .post('/graphql')
        .set('Authorization', `Bearer ${APPLE_JANE_ADMIN_ACCESS_TOKEN}`)
        .send({
          query: `mutation DestroyWorkflow($id: ID!) { destroyWorkflow(id: $id) { id } }`,
          variables: { id: createdWorkflowId },
        });
    }
    await makeGraphqlAPIRequest(
      deleteManyOperationFactory({
        objectMetadataSingularName: 'penduduk',
        objectMetadataPluralName: 'penduduks',
        gqlFields: 'id',
        filter: { id: { in: ALL_TEST_PENDUDUK_IDS } },
      }),
    );
    await makeGraphqlAPIRequest(
      deleteManyOperationFactory({
        objectMetadataSingularName: 'keluarga',
        objectMetadataPluralName: 'keluargas',
        gqlFields: 'id',
        filter: { id: { in: ALL_TEST_KELUARGA_IDS } },
      }),
    );
  });

  it('should apply a one-hop relation-traversal filter and return only matching records', async () => {
    const workflowRunId = await runWorkflowVersion({
      workflowVersionId: createdWorkflowVersionId!,
    });

    createdWorkflowRunId = workflowRunId;

    const workflowRun = await waitForWorkflowCompletion(workflowRunId);

    expect(workflowRun?.status).toBe('COMPLETED');
    expect(workflowRun?.state?.stepInfos?.[findRecordsStepId!]?.status).toBe(
      'SUCCESS',
    );

    const result = workflowRun?.state?.stepInfos?.[findRecordsStepId!]
      ?.result as
      | { all?: Array<{ id: string }>; totalCount?: number }
      | undefined;

    const returnedIds = (result?.all ?? []).map((record) => record.id);

    expect(returnedIds).toContain(TEST_PENDUDUK_KK1_ANGGOTA_1_ID);
    expect(returnedIds).toContain(TEST_PENDUDUK_KK1_ANGGOTA_2_ID);
    expect(returnedIds).not.toContain(TEST_PENDUDUK_KK2_ANGGOTA_1_ID);
  });
});
