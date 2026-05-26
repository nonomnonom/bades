import { randomUUID } from 'crypto';

import gql from 'graphql-tag';
import request from 'supertest';
import { createCustomRoleWithObjectPermissions } from 'test/integration/graphql/utils/create-custom-role-with-object-permissions.util';
import { createManyOperationFactory } from 'test/integration/graphql/utils/create-many-operation-factory.util';
import { createOneOperationFactory } from 'test/integration/graphql/utils/create-one-operation-factory.util';
import { deleteRole } from 'test/integration/graphql/utils/delete-one-role.util';
import { makeGraphqlAPIRequestWithMemberRole } from 'test/integration/graphql/utils/make-graphql-api-request-with-member-role.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { updateManyOperationFactory } from 'test/integration/graphql/utils/update-many-operation-factory.util';
import { updateOneOperationFactory } from 'test/integration/graphql/utils/update-one-operation-factory.util';
import { updateWorkspaceMemberRole } from 'test/integration/graphql/utils/update-workspace-member-role.util';
import { upsertFieldPermissions } from 'test/integration/graphql/utils/upsert-field-permissions.util';
import { upsertRowLevelPermissionPredicates } from 'test/integration/metadata/suites/row-level-permission-predicate/utils/upsert-row-level-permission-predicates.util';
import { makeMetadataAPIRequest } from 'test/integration/metadata/suites/utils/make-metadata-api-request.util';
import { RowLevelPermissionPredicateOperand } from 'shared/types';

import { ErrorCode } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import { PermissionsExceptionMessage } from 'src/engine/metadata-modules/permissions/permissions.exception';
import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

const client = request(`http://localhost:${APP_PORT}`);

// GQL fields keluarga dengan field `alamat` (pengganti company.employees)
const KELUARGA_GQL_FIELDS_WITH_ALAMAT = `
      id
      nomorKk
      alamat
`;

// GQL fields keluarga tanpa field terbatas
const KELUARGA_GQL_FIELDS_WITHOUT_ALAMAT = `
      id
      nomorKk
`;

const expectPermissionDeniedError = (response: any) => {
  expect(response.body.errors).toBeDefined();
  expect(response.body.errors.length).toBeGreaterThan(0);
  expect(response.body.errors[0].message).toBe(
    PermissionsExceptionMessage.PERMISSION_DENIED,
  );
  expect(response.body.errors[0].extensions.code).toBe(ErrorCode.FORBIDDEN);
};

const expectAlamatIsAccessible = ({
  response,
  operationName,
  expectedAlamat,
}: {
  response: any;
  operationName: 'createDaftarKeluarga' | 'createKeluarga';
  expectedAlamat: string;
}) => {
  expect(response.body.errors).toBeUndefined();
  expect(response.body.data).toBeDefined();

  const result =
    operationName === 'createKeluarga'
      ? response.body.data[operationName]
      : response.body.data[operationName]?.[0];

  expect(result).toBeDefined();
  expect(result.alamat).toBe(expectedAlamat);
};

describe('Field update permissions restrictions', () => {
  let testKeluargaId: string;
  let customRoleId: string;
  let keluargaObjectId: string;
  let restrictedKeluargaFieldId: string;
  let originalMemberRoleId: string;

  // Batasi hak update ke field `alamat` pada keluarga (setara employees di company CRM)
  const restrictUpdateAccessToKeluargaAlamat = async (
    roleId: string,
    keluargaObjId: string,
    fieldId: string,
  ) => {
    await upsertFieldPermissions({
      roleId,
      fieldPermissions: [
        {
          objectMetadataId: keluargaObjId,
          fieldMetadataId: fieldId,
          canUpdateFieldValue: false,
        },
      ],
    });
  };

  // Batasi hak baca ke field `alamat` pada keluarga
  const restrictReadAccessToKeluargaAlamat = async (
    roleId: string,
    keluargaObjId: string,
    fieldId: string,
  ) => {
    await upsertFieldPermissions({
      roleId,
      fieldPermissions: [
        {
          objectMetadataId: keluargaObjId,
          fieldMetadataId: fieldId,
          canReadFieldValue: false,
        },
      ],
    });
  };

  beforeAll(async () => {
    // Ambil ID role Member asli untuk dipulihkan setelah suite selesai
    const getRolesQuery = {
      query: `
        query GetRoles {
          getRoles {
            id
            label
          }
        }
      `,
    };
    const rolesResponse = await client
      .post('/metadata')
      .set('Authorization', `Bearer ${APPLE_JANE_ADMIN_ACCESS_TOKEN}`)
      .send(getRolesQuery);

    originalMemberRoleId = rolesResponse.body.data.getRoles.find(
      (role: any) => role.label === 'Member',
    ).id;

    // Buat record keluarga untuk dipakai dalam test update/read permission
    testKeluargaId = randomUUID();

    const createKeluargaOp = createOneOperationFactory({
      objectMetadataSingularName: 'keluarga',
      gqlFields: 'id nomorKk alamat',
      data: {
        id: testKeluargaId,
        nomorKk: '3578019876543210',
        alamat: 'Jl. Sudirman No. 20, Jakarta',
      },
    });

    await makeGraphqlAPIRequest(createKeluargaOp);

    // Ambil metadata ID object dan field
    const getObjectMetadataOp = {
      query: gql`
        query {
          objects(paging: { first: 1000 }) {
            edges {
              node {
                id
                nameSingular
              }
            }
          }
        }
      `,
    };
    const objectMetadataResponse =
      await makeMetadataAPIRequest(getObjectMetadataOp);
    const objects = objectMetadataResponse.body.data.objects.edges;

    keluargaObjectId = objects.find(
      (obj: any) => obj.node.nameSingular === 'keluarga',
    ).node.id;

    const getFieldMetadataOp = {
      query: gql`
        query {
          fields(paging: { first: 1000 }) {
            edges {
              node {
                id
                name
                object {
                  nameSingular
                }
              }
            }
          }
        }
      `,
    };
    const fieldMetadataResponse =
      await makeMetadataAPIRequest(getFieldMetadataOp);
    const fields = fieldMetadataResponse.body.data.fields.edges;

    restrictedKeluargaFieldId = fields.find(
      (field: any) =>
        field.node.name === 'alamat' &&
        field.node.object.nameSingular === 'keluarga',
    ).node.id;
  });

  afterAll(async () => {
    // Pulihkan role Member asli
    const restoreMemberRoleQuery = {
      query: `
        mutation UpdateWorkspaceMemberRole {
          updateWorkspaceMemberRole(
            workspaceMemberId: "${WORKSPACE_MEMBER_DATA_SEED_IDS.SEKDES}"
            roleId: "${originalMemberRoleId}"
          ) { id }
        }
      `,
    };

    await client
      .post('/metadata')
      .set('Authorization', `Bearer ${APPLE_JANE_ADMIN_ACCESS_TOKEN}`)
      .send(restoreMemberRoleQuery);
  });

  beforeEach(async () => {
    const { roleId } = await createCustomRoleWithObjectPermissions({
      label: 'KeluargaPendudukRole',
      canReadKeluarga: true,
      canReadPenduduk: true,
      hasAllObjectRecordsReadPermission: true,
      canUpdateKeluarga: true,
      canUpdatePenduduk: true,
      canUpdateProgramBantuan: true,
    });

    customRoleId = roleId;
    await updateWorkspaceMemberRole({
      client,
      roleId: customRoleId,
      workspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.SEKDES,
    });
  });

  afterEach(async () => {
    if (customRoleId) {
      await deleteRole(client, customRoleId);
      customRoleId = '';
    }
  });

  // describe('should throw an error if updating a restricted field', () => {
  //   beforeEach(async () => {
  //     await restrictUpdateAccessToKeluargaAlamat(
  //       customRoleId,
  //       keluargaObjectId,
  //       restrictedKeluargaFieldId,
  //     );
  //   });

  //   it('1. updateMany with restricted field', async () => {
  //     const graphqlOperation = updateManyOperationFactory({
  //       objectMetadataSingularName: 'keluarga',
  //       objectMetadataPluralName: 'daftarKeluarga',
  //       gqlFields: KELUARGA_GQL_FIELDS_WITH_ALAMAT,
  //       data: { alamat: 'Jl. Baru No. 99' },
  //     });

  //     const response =
  //       await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

  //     expectPermissionDeniedError(response);
  //   });

  //   it('2. updateOne with restricted field', async () => {
  //     const graphqlOperation = updateOneOperationFactory({
  //       objectMetadataSingularName: 'keluarga',
  //       gqlFields: KELUARGA_GQL_FIELDS_WITH_ALAMAT,
  //       recordId: testKeluargaId,
  //       data: { alamat: 'Jl. Baru No. 99' },
  //     });

  //     const response =
  //       await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

  //     expectPermissionDeniedError(response);
  //   });
  // });

  // describe('should succeed if updating non-restricted fields', () => {
  //   beforeEach(async () => {
  //     await restrictUpdateAccessToKeluargaAlamat(
  //       customRoleId,
  //       keluargaObjectId,
  //       restrictedKeluargaFieldId,
  //     );
  //   });

  //   it('1. updateMany with non-restricted field', async () => {
  //     const graphqlOperation = updateManyOperationFactory({
  //       objectMetadataSingularName: 'keluarga',
  //       objectMetadataPluralName: 'daftarKeluarga',
  //       gqlFields: KELUARGA_GQL_FIELDS_WITHOUT_ALAMAT,
  //       data: { nomorKk: '3578019999999999' },
  //     });

  //     const response =
  //       await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

  //     expect(response.body.errors).toBeUndefined();
  //     expect(response.body.data).toBeDefined();
  //     expect(response.body.data.updateDaftarKeluarga[0].nomorKk).toBe('3578019999999999');
  //   });

  //   it('2. updateOne with non-restricted field', async () => {
  //     const graphqlOperation = updateOneOperationFactory({
  //       objectMetadataSingularName: 'keluarga',
  //       gqlFields: KELUARGA_GQL_FIELDS_WITHOUT_ALAMAT,
  //       recordId: testKeluargaId,
  //       data: { nomorKk: '3578019999999998' },
  //     });

  //     const response =
  //       await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

  //     expect(response.body.errors).toBeUndefined();
  //     expect(response.body.data).toBeDefined();
  //     expect(response.body.data.updateKeluarga.nomorKk).toBe('3578019999999998');
  //   });
  // });

  describe('should allow alamat field when creating if field is in RLS predicate', () => {
    beforeEach(async () => {
      await restrictUpdateAccessToKeluargaAlamat(
        customRoleId,
        keluargaObjectId,
        restrictedKeluargaFieldId,
      );

      await upsertRowLevelPermissionPredicates({
        input: {
          roleId: customRoleId,
          objectMetadataId: keluargaObjectId,
          predicates: [
            {
              fieldMetadataId: restrictedKeluargaFieldId,
              operand: RowLevelPermissionPredicateOperand.IS_NOT_EMPTY,
            },
          ],
          predicateGroups: [],
        },
      });
    });

    afterEach(async () => {
      await upsertRowLevelPermissionPredicates({
        input: {
          roleId: customRoleId,
          objectMetadataId: keluargaObjectId,
          predicates: [],
          predicateGroups: [],
        },
      });
    });

    it('1. createMany with restricted field in RLS predicate', async () => {
      const graphqlOperation = createManyOperationFactory({
        objectMetadataSingularName: 'keluarga',
        objectMetadataPluralName: 'daftarKeluarga',
        gqlFields: KELUARGA_GQL_FIELDS_WITH_ALAMAT,
        data: [
          {
            id: randomUUID(),
            nomorKk: '3578011111111111',
            alamat: 'Jl. Ahmad Yani No. 3, Malang',
          },
          {
            id: randomUUID(),
            nomorKk: '3578011111111112',
            alamat: 'Jl. Pemuda No. 7, Semarang',
          },
        ],
      });

      const response =
        await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

      expectAlamatIsAccessible({
        response,
        operationName: 'createDaftarKeluarga',
        expectedAlamat: 'Jl. Ahmad Yani No. 3, Malang',
      });
    });

    it('2. createOne with restricted field in RLS predicate', async () => {
      const graphqlOperation = createOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: KELUARGA_GQL_FIELDS_WITH_ALAMAT,
        data: {
          id: randomUUID(),
          nomorKk: '3578011111111113',
          alamat: 'Jl. Veteran No. 15, Surabaya',
        },
      });

      const response =
        await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

      expectAlamatIsAccessible({
        response,
        operationName: 'createKeluarga',
        expectedAlamat: 'Jl. Veteran No. 15, Surabaya',
      });
    });
  });

  describe('should block read-restricted field in update operation responses', () => {
    beforeEach(async () => {
      await restrictReadAccessToKeluargaAlamat(
        customRoleId,
        keluargaObjectId,
        restrictedKeluargaFieldId,
      );
    });

    it('1. updateMany requesting restricted field in response', async () => {
      const graphqlOperation = updateManyOperationFactory({
        objectMetadataSingularName: 'keluarga',
        objectMetadataPluralName: 'daftarKeluarga',
        gqlFields: KELUARGA_GQL_FIELDS_WITH_ALAMAT,
        data: { nomorKk: '3578019876543211' },
        filter: { id: { eq: testKeluargaId } },
      });

      const response =
        await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

      expectPermissionDeniedError(response);
    });

    it('2. updateOne requesting restricted field in response', async () => {
      const graphqlOperation = updateOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: KELUARGA_GQL_FIELDS_WITH_ALAMAT,
        recordId: testKeluargaId,
        data: { nomorKk: '3578019876543212' },
      });

      const response =
        await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

      expectPermissionDeniedError(response);
    });
  });

  describe('should succeed if not requesting restricted fields in update operations', () => {
    beforeEach(async () => {
      await restrictUpdateAccessToKeluargaAlamat(
        customRoleId,
        keluargaObjectId,
        restrictedKeluargaFieldId,
      );
    });

    it('1. updateMany not requesting restricted field in response', async () => {
      const graphqlOperation = updateManyOperationFactory({
        objectMetadataSingularName: 'keluarga',
        objectMetadataPluralName: 'daftarKeluarga',
        gqlFields: KELUARGA_GQL_FIELDS_WITHOUT_ALAMAT,
        data: { nomorKk: '3578019876500001' },
        filter: { id: { eq: testKeluargaId } },
      });

      const response =
        await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data).toBeDefined();
      expect(response.body.data.updateDaftarKeluarga[0].nomorKk).toBe(
        '3578019876500001',
      );
    });

    it('2. updateOne not requesting restricted field in response', async () => {
      const graphqlOperation = updateOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: KELUARGA_GQL_FIELDS_WITHOUT_ALAMAT,
        recordId: testKeluargaId,
        data: { nomorKk: '3578019876500002' },
      });

      const response =
        await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data).toBeDefined();
      expect(response.body.data.updateKeluarga.nomorKk).toBe(
        '3578019876500002',
      );
    });
  });
});
