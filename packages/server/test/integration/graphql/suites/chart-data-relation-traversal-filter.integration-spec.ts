import gql from 'graphql-tag';
import request from 'supertest';
import { createManyOperationFactory } from 'test/integration/graphql/utils/create-many-operation-factory.util';
import { deleteManyOperationFactory } from 'test/integration/graphql/utils/delete-many-operation-factory.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { makeMetadataAPIRequest } from 'test/integration/metadata/suites/utils/make-metadata-api-request.util';
import { v4 as uuidv4 } from 'uuid';

const client = request(`http://localhost:${APP_PORT}`);

const TEST_KELUARGA_KK1_ID = '30303030-aaaa-4000-8000-000000000001';
const TEST_KELUARGA_KK2_ID = '30303030-aaaa-4000-8000-000000000002';
const TEST_PENDUDUK_KK1_ANGGOTA_1_ID = '30303030-bbbb-4000-8000-000000000001';
const TEST_PENDUDUK_KK1_ANGGOTA_2_ID = '30303030-bbbb-4000-8000-000000000002';
const TEST_PENDUDUK_KK2_ANGGOTA_1_ID = '30303030-bbbb-4000-8000-000000000003';
const SHARED_TEMPAT_LAHIR = 'chart-test-relation-traversal';
const ALL_TEST_PENDUDUK_IDS = [
  TEST_PENDUDUK_KK1_ANGGOTA_1_ID,
  TEST_PENDUDUK_KK1_ANGGOTA_2_ID,
  TEST_PENDUDUK_KK2_ANGGOTA_1_ID,
];
const ALL_TEST_KELUARGA_IDS = [TEST_KELUARGA_KK1_ID, TEST_KELUARGA_KK2_ID];

describe('BarChartData with relation-traversal filter (e2e)', () => {
  let pendudukObjectMetadataId: string | null = null;
  let pendudukIdFieldMetadataId: string | null = null;
  let pendudukTempatLahirFieldMetadataId: string | null = null;
  let pendudukKartuKeluargaFieldMetadataId: string | null = null;
  let keluargaAlamatFieldMetadataId: string | null = null;

  const lookupMetadataIds = async () => {
    const objectsResponse = await makeMetadataAPIRequest({
      query: gql`
        query Objects($filter: ObjectFilter!, $paging: CursorPaging!) {
          objects(filter: $filter, paging: $paging) {
            edges {
              node {
                id
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
      id: string;
      nameSingular: string;
      fieldsList: Array<{ id: string; name: string }>;
    }> = objectsResponse.body.data.objects.edges.map(
      (edge: { node: unknown }) => edge.node,
    );

    const pendudukObject = objects.find((o) => o.nameSingular === 'penduduk');
    const keluargaObject = objects.find((o) => o.nameSingular === 'keluarga');

    pendudukObjectMetadataId = pendudukObject?.id ?? null;
    pendudukIdFieldMetadataId =
      pendudukObject?.fieldsList.find((f) => f.name === 'id')?.id ?? null;
    pendudukTempatLahirFieldMetadataId =
      pendudukObject?.fieldsList.find((f) => f.name === 'tempatLahir')?.id ??
      null;
    pendudukKartuKeluargaFieldMetadataId =
      pendudukObject?.fieldsList.find((f) => f.name === 'kartuKeluarga')?.id ??
      null;
    keluargaAlamatFieldMetadataId =
      keluargaObject?.fieldsList.find((f) => f.name === 'alamat')?.id ?? null;

    if (
      !pendudukObjectMetadataId ||
      !pendudukIdFieldMetadataId ||
      !pendudukTempatLahirFieldMetadataId ||
      !pendudukKartuKeluargaFieldMetadataId ||
      !keluargaAlamatFieldMetadataId
    ) {
      throw new Error('Failed to resolve required metadata ids for chart test');
    }
  };

  const seedTestRecords = async () => {
    await makeGraphqlAPIRequest(
      createManyOperationFactory({
        objectMetadataSingularName: 'keluarga',
        objectMetadataPluralName: 'keluargas',
        gqlFields: 'id',
        data: [
          { id: TEST_KELUARGA_KK1_ID, nomorKk: '3201040000000001', alamat: 'KK Chart 001' },
          { id: TEST_KELUARGA_KK2_ID, nomorKk: '3201040000000002', alamat: 'KK Chart 002' },
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
            tempatLahir: SHARED_TEMPAT_LAHIR,
          },
          {
            id: TEST_PENDUDUK_KK1_ANGGOTA_2_ID,
            kartuKeluargaId: TEST_KELUARGA_KK1_ID,
            tempatLahir: SHARED_TEMPAT_LAHIR,
          },
          {
            id: TEST_PENDUDUK_KK2_ANGGOTA_1_ID,
            kartuKeluargaId: TEST_KELUARGA_KK2_ID,
            tempatLahir: SHARED_TEMPAT_LAHIR,
          },
        ],
        upsert: true,
      }),
    );
  };

  const queryBarChartCount = async (extraRecordFilters: object[] = []) => {
    const filterGroupId = uuidv4();
    const allRecordFilters = [
      {
        id: uuidv4(),
        type: 'TEXT',
        operand: 'CONTAINS',
        value: SHARED_TEMPAT_LAHIR,
        fieldMetadataId: pendudukTempatLahirFieldMetadataId,
        recordFilterGroupId: filterGroupId,
      },
      ...extraRecordFilters.map((filter) => ({
        ...filter,
        recordFilterGroupId: filterGroupId,
      })),
    ];

    const response = await client
      .post('/metadata')
      .set('Authorization', `Bearer ${APPLE_JANE_ADMIN_ACCESS_TOKEN}`)
      .send({
        query: `
          query BarChartData($input: BarChartDataInput!) {
            barChartData(input: $input) {
              data
              indexBy
              keys
            }
          }
        `,
        variables: {
          input: {
            objectMetadataId: pendudukObjectMetadataId,
            configuration: {
              configurationType: 'BAR_CHART',
              layout: 'VERTICAL',
              aggregateFieldMetadataId: pendudukIdFieldMetadataId,
              aggregateOperation: 'COUNT',
              primaryAxisGroupByFieldMetadataId: pendudukTempatLahirFieldMetadataId,
              primaryAxisOrderBy: 'VALUE_DESC',
              filter: {
                recordFilters: allRecordFilters,
                recordFilterGroups: [
                  { id: filterGroupId, logicalOperator: 'AND' },
                ],
              },
            },
          },
        },
      });

    expect(response.body.errors).toBeUndefined();
    const data: Array<Record<string, string | number>> =
      response.body.data.barChartData.data;
    const row = data.find((entry) => entry.tempatLahir === SHARED_TEMPAT_LAHIR);

    return typeof row?.id === 'number' ? row.id : 0;
  };

  beforeAll(async () => {
    await lookupMetadataIds();
    await seedTestRecords();
  });

  afterAll(async () => {
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

  it('should count all 3 test penduduk without a relation-traversal filter', async () => {
    const count = await queryBarChartCount();

    expect(count).toBe(3);
  });

  it('should apply a one-hop relation-traversal filter and only count penduduk from KK1', async () => {
    const count = await queryBarChartCount([
      {
        id: uuidv4(),
        type: 'TEXT',
        operand: 'CONTAINS',
        value: 'KK Chart 001',
        fieldMetadataId: pendudukKartuKeluargaFieldMetadataId,
        relationTargetFieldMetadataId: keluargaAlamatFieldMetadataId,
      },
    ]);

    expect(count).toBe(2);
  });
});
