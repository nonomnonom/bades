import { randomUUID } from 'crypto';

import gql from 'graphql-tag';
import { KELUARGA_GQL_FIELDS } from 'test/integration/constants/keluarga-gql-fields.constants';
import { createOneOperationFactory } from 'test/integration/graphql/utils/create-one-operation-factory.util';
import { destroyOneOperationFactory } from 'test/integration/graphql/utils/destroy-one-operation-factory.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { findManyObjectMetadata } from 'test/integration/metadata/suites/object-metadata/utils/find-many-object-metadata.util';
import { createOneRole } from 'test/integration/metadata/suites/role/utils/create-one-role.util';
import { deleteOneRole } from 'test/integration/metadata/suites/role/utils/delete-one-role.util';
import { findOneRoleByLabel } from 'test/integration/metadata/suites/role/utils/find-one-role-by-label.util';
import { updateWorkspaceMemberRole } from 'test/integration/metadata/suites/role/utils/update-workspace-member-role.util';
import { upsertRowLevelPermissionPredicates } from 'test/integration/metadata/suites/row-level-permission-predicate/utils/upsert-row-level-permission-predicates.util';
import { jestExpectToBeDefined } from 'test/utils/jest-expect-to-be-defined.util.test';
import { RowLevelPermissionPredicateOperand } from 'shared/types';

import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

const FILTER_2020 = {
  and: [
    { createdAt: { gte: '2020-01-01T00:00:00.000Z' } },
    { createdAt: { lte: '2020-03-03T23:59:59.999Z' } },
  ],
};

// Bades: test RLS pada group-by menggunakan objek `keluarga` (Kartu Keluarga)
// sebagai pengganti `company` dari CRM warisan. Filter RLS diset pada
// field `alamat` (TEXT bebas) — `nomorKk` adalah identifier 16-digit numerik
// per Permendagri 109/2019, jadi tidak cocok untuk CONTAINS predicate.
describe('group-by with records respects row-level permission predicates', () => {
  const testKeluargaId1 = randomUUID();
  const testKeluargaId2 = randomUUID();
  let customRoleId: string;
  let originalMemberRoleId: string;
  let keluargaObjectMetadataId: string;
  let keluargaAlamatFieldMetadataId: string;

  beforeAll(async () => {
    const { objects } = await findManyObjectMetadata({
      expectToFail: false,
      input: {
        filter: {},
        paging: { first: 1000 },
      },
      gqlFields: `
        id
        nameSingular
        fieldsList {
          id
          name
        }
      `,
    });

    jestExpectToBeDefined(objects);

    const keluargaObjectMetadata = objects.find(
      (object: { nameSingular: string }) => object.nameSingular === 'keluarga',
    );

    jestExpectToBeDefined(keluargaObjectMetadata);
    keluargaObjectMetadataId = keluargaObjectMetadata.id;

    const alamatField = keluargaObjectMetadata.fieldsList?.find(
      (field: { name: string }) => field.name === 'alamat',
    );

    jestExpectToBeDefined(alamatField);
    keluargaAlamatFieldMetadataId = alamatField.id;

    const memberRole = await findOneRoleByLabel({ label: 'Member' });

    originalMemberRoleId = memberRole.id;

    const { data: roleData } = await createOneRole({
      expectToFail: false,
      input: {
        label: 'RLS GroupBy Test Role',
        description: 'Role untuk test RLS group-by dengan objek keluarga',
        icon: 'IconSettings',
        canUpdateAllSettings: false,
        canAccessAllTools: true,
        canReadAllObjectRecords: true,
        canUpdateAllObjectRecords: true,
        canSoftDeleteAllObjectRecords: false,
        canDestroyAllObjectRecords: false,
        canBeAssignedToUsers: true,
        canBeAssignedToAgents: false,
        canBeAssignedToApiKeys: false,
      },
    });

    customRoleId = roleData?.createOneRole?.id;
    jestExpectToBeDefined(customRoleId);

    // Set RLS predicate: hanya keluarga yang alamat mengandung 'Terlihat' yang visible
    await upsertRowLevelPermissionPredicates({
      expectToFail: false,
      input: {
        roleId: customRoleId,
        objectMetadataId: keluargaObjectMetadataId,
        predicates: [
          {
            fieldMetadataId: keluargaAlamatFieldMetadataId,
            operand: RowLevelPermissionPredicateOperand.CONTAINS,
            value: 'Terlihat',
          },
        ],
        predicateGroups: [],
      },
    });

    await updateWorkspaceMemberRole({
      input: {
        roleId: customRoleId,
        workspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.SEKDES,
      },
      expectToFail: false,
    });

    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: KELUARGA_GQL_FIELDS,
        data: {
          id: testKeluargaId1,
          nomorKk: '3201050000000001', alamat: 'Dusun Terlihat',
          createdAt: '2020-02-05T08:00:00.000Z',
        },
      }),
    );

    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: KELUARGA_GQL_FIELDS,
        data: {
          id: testKeluargaId2,
          nomorKk: '3201050000000002', alamat: 'Dusun Tersembunyi',
          createdAt: '2020-02-05T08:00:00.000Z',
        },
      }),
    );
  });

  afterAll(async () => {
    await updateWorkspaceMemberRole({
      input: {
        workspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.SEKDES,
        roleId: originalMemberRoleId,
      },
      expectToFail: false,
    });

    for (const id of [testKeluargaId1, testKeluargaId2]) {
      await makeGraphqlAPIRequest(
        destroyOneOperationFactory({
          objectMetadataSingularName: 'keluarga',
          gqlFields: 'id',
          recordId: id,
        }),
      );
    }

    if (customRoleId) {
      await deleteOneRole({
        expectToFail: false,
        input: { idToDelete: customRoleId },
      });
    }
  });

  it('filters records in group-by results based on RLS predicates', async () => {
    const response = await makeGraphqlAPIRequest(
      {
        query: gql`
          query DaftarKeluargaGroupBy(
            $groupBy: [KeluargaGroupByInput!]!
            $filter: KeluargaFilterInput
            $limit: Int
          ) {
            keluargasGroupBy(
              groupBy: $groupBy
              filter: $filter
              limit: $limit
            ) {
              groupByDimensionValues
              edges {
                node {
                  nomorKk
                  alamat
                }
              }
            }
          }
        `,
        variables: {
          groupBy: [{ createdAt: { granularity: 'MONTH' } }],
          filter: FILTER_2020,
          limit: 10,
        },
      },
      APPLE_JONY_MEMBER_ACCESS_TOKEN,
    );

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data).toBeDefined();

    const groups = response.body.data.keluargasGroupBy;

    const allRecords = groups.flatMap(
      (group: { edges: { node: { nomorKk: string; alamat: string } }[] }) =>
        group.edges.map(
          (edge: { node: { nomorKk: string; alamat: string } }) => edge.node,
        ),
    );

    const visibleRecords = allRecords.filter(
      (record: { alamat: string }) => record.alamat === 'Dusun Terlihat',
    );
    const hiddenRecords = allRecords.filter(
      (record: { alamat: string }) =>
        record.alamat === 'Dusun Tersembunyi',
    );

    expect(visibleRecords).toHaveLength(1);
    expect(hiddenRecords).toHaveLength(0);
  });
});
