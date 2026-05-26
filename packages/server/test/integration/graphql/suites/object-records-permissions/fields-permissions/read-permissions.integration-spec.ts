import { randomUUID } from 'crypto';

import gql from 'graphql-tag';
import request from 'supertest';
import { createCustomRoleWithObjectPermissions } from 'test/integration/graphql/utils/create-custom-role-with-object-permissions.util';
import { createManyOperationFactory } from 'test/integration/graphql/utils/create-many-operation-factory.util';
import { createOneOperationFactory } from 'test/integration/graphql/utils/create-one-operation-factory.util';
import { deleteManyOperationFactory } from 'test/integration/graphql/utils/delete-many-operation-factory.util';
import { deleteOneOperationFactory } from 'test/integration/graphql/utils/delete-one-operation-factory.util';
import { deleteRole } from 'test/integration/graphql/utils/delete-one-role.util';
import { findManyOperationFactory } from 'test/integration/graphql/utils/find-many-operation-factory.util';
import { findOneOperationFactory } from 'test/integration/graphql/utils/find-one-operation-factory.util';
import { makeGraphqlAPIRequestWithMemberRole } from 'test/integration/graphql/utils/make-graphql-api-request-with-member-role.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { updateManyOperationFactory } from 'test/integration/graphql/utils/update-many-operation-factory.util';
import { updateOneOperationFactory } from 'test/integration/graphql/utils/update-one-operation-factory.util';
import { updateWorkspaceMemberRole } from 'test/integration/graphql/utils/update-workspace-member-role.util';
import { upsertFieldPermissions } from 'test/integration/graphql/utils/upsert-field-permissions.util';
import { makeMetadataAPIRequest } from 'test/integration/metadata/suites/utils/make-metadata-api-request.util';

import { ErrorCode } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import { PermissionsExceptionMessage } from 'src/engine/metadata-modules/permissions/permissions.exception';
import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

const client = request(`http://localhost:${APP_PORT}`);

// GQL fields keluarga dengan relasi daftarPenduduk dan tempatLahir (setara company+daftarPenduduk.city)
const KELUARGA_GQL_FIELDS_WITH_PENDUDUK_TEMPAT_LAHIR = `
      id
      nomorKk
      daftarPenduduk {
        edges {
          node {
            id
            namaLengkap {
              firstName
              lastName
            }
            tempatLahir
          }
        }
      }
`;

// GQL fields keluarga dengan field `alamat` (field teks terbatas yang diuji RBAC-nya)
const KELUARGA_GQL_FIELDS_WITH_ALAMAT = `
      id
      nomorKk
      alamat
      daftarPenduduk {
        edges {
          node {
            id
            namaLengkap {
              firstName
              lastName
            }
          }
        }
      }
`;

// GQL fields keluarga tanpa field terbatas (alamat dan tempatLahir dihilangkan)
const KELUARGA_GQL_FIELDS_WITHOUT_ALAMAT_AND_WITHOUT_PENDUDUK_TEMPAT_LAHIR = `
      id
      nomorKk
      daftarPenduduk {
        edges {
          node {
            id
            namaLengkap {
              firstName
              lastName
            }
          }
        }
      }
`;

// GQL fields aggregate keluarga atas tempatLahir di relasi daftarPenduduk
const KELUARGA_GQL_FIELDS_WITH_PENDUDUK_TEMPAT_LAHIR_AGGREGATE = `
      id
      nomorKk
      daftarPenduduk {
        percentageEmptyTempatLahir
      }
`;

const expectNoGraphQLErrors = (response: any) => {
  expect(response.body.errors).toBeUndefined();
  expect(response.body.data).toBeDefined();
};

const expectPermissionDeniedError = (response: any) => {
  expect(response.body.errors).toBeDefined();
  expect(response.body.errors.length).toBeGreaterThan(0);
  expect(response.body.errors[0].message).toBe(
    PermissionsExceptionMessage.PERMISSION_DENIED,
  );
  expect(response.body.errors[0].extensions.code).toBe(ErrorCode.FORBIDDEN);
};

describe('Field permissions restrictions', () => {
  let testKeluargaId: string;
  let testPendudukId: string;
  let customRoleId: string;
  let keluargaObjectId: string;
  let pendudukObjectId: string;
  let restrictedKeluargaFieldId: string;
  let restrictedPendudukFieldId: string;
  let originalMemberRoleId: string;

  // Batasi akses ke field `alamat` pada keluarga (setara employees di company CRM)
  const restrictAccessToKeluargaAlamat = async (
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

  // Batasi akses ke field `tempatLahir` pada penduduk (setara city di person CRM)
  const restrictAccessToPendudukTempatLahir = async (
    roleId: string,
    pendudukObjId: string,
    fieldId: string,
  ) => {
    await upsertFieldPermissions({
      roleId,
      fieldPermissions: [
        {
          objectMetadataId: pendudukObjId,
          fieldMetadataId: fieldId,
          canUpdateFieldValue: false,
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

    // Buat record keluarga dan penduduk untuk dipakai dalam test
    testKeluargaId = randomUUID();
    testPendudukId = randomUUID();

    const createKeluargaOp = createOneOperationFactory({
      objectMetadataSingularName: 'keluarga',
      gqlFields: 'id nomorKk',
      data: {
        id: testKeluargaId,
        nomorKk: '3578012345678901',
        alamat: 'Jl. Pahlawan No. 10, Surabaya',
      },
    });

    await makeGraphqlAPIRequest(createKeluargaOp);

    const createPendudukOperation = createOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: 'id tempatLahir',
      data: {
        id: testPendudukId,
        tempatLahir: 'Surabaya',
        kartuKeluargaId: testKeluargaId,
      },
    });

    await makeGraphqlAPIRequest(createPendudukOperation);

    // Ambil metadata ID object dan field yang diperlukan
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
    pendudukObjectId = objects.find(
      (obj: any) => obj.node.nameSingular === 'penduduk',
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
    restrictedPendudukFieldId = fields.find(
      (field: any) =>
        field.node.name === 'tempatLahir' &&
        field.node.object.nameSingular === 'penduduk',
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

  describe('should allow restricted fields to be read', () => {
    beforeEach(async () => {
      await restrictAccessToKeluargaAlamat(
        customRoleId,
        keluargaObjectId,
        restrictedKeluargaFieldId,
      );
    });

    it('1. findMany', async () => {
      const graphqlOperation = findManyOperationFactory({
        objectMetadataSingularName: 'keluarga',
        objectMetadataPluralName: 'daftarKeluarga',
        gqlFields: KELUARGA_GQL_FIELDS_WITH_ALAMAT,
      });
      const response =
        await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

      expectNoGraphQLErrors(response);
      expect(
        response.body.data.daftarKeluarga.edges[0].node.alamat,
      ).toBeDefined();
    });

    it('2. findOne', async () => {
      const graphqlOperation = findOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: KELUARGA_GQL_FIELDS_WITH_ALAMAT,
        filter: { id: { eq: testKeluargaId } },
      });
      const response =
        await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

      expectNoGraphQLErrors(response);
      expect(response.body.data.keluarga.alamat).toBeDefined();
    });

    it('3. updateMany', async () => {
      const graphqlOperation = updateManyOperationFactory({
        objectMetadataSingularName: 'keluarga',
        objectMetadataPluralName: 'daftarKeluarga',
        gqlFields: KELUARGA_GQL_FIELDS_WITH_ALAMAT,
        filter: { id: { eq: testKeluargaId } },
        data: { nomorKk: '3578012345678902' },
      });

      const response =
        await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

      expectPermissionDeniedError(response);
    });

    it('4. updateOne', async () => {
      const graphqlOperation = updateOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: KELUARGA_GQL_FIELDS_WITH_ALAMAT,
        recordId: testKeluargaId,
        data: { nomorKk: '3578012345678903' },
      });

      const response =
        await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

      expectPermissionDeniedError(response);
    });

    it('5. createMany', async () => {
      const graphqlOperation = createManyOperationFactory({
        objectMetadataSingularName: 'keluarga',
        objectMetadataPluralName: 'daftarKeluarga',
        gqlFields: KELUARGA_GQL_FIELDS_WITH_ALAMAT,
        data: [
          {
            id: randomUUID(),
            nomorKk: '3578012345670001',
            alamat: 'Jl. Merdeka No. 1, Jakarta',
          },
          {
            id: randomUUID(),
            nomorKk: '3578012345670002',
            alamat: 'Jl. Diponegoro No. 5, Bandung',
          },
        ],
      });

      const response =
        await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

      expectPermissionDeniedError(response);
    });

    it('5. createOne', async () => {
      const graphqlOperation = createOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: KELUARGA_GQL_FIELDS_WITH_ALAMAT,
        data: {
          id: randomUUID(),
          nomorKk: '3578012345670003',
          alamat: 'Jl. Gatot Subroto No. 9, Semarang',
        },
      });

      const response =
        await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

      expectPermissionDeniedError(response);
    });

    it('6. deleteMany', async () => {
      const graphqlOperation = deleteManyOperationFactory({
        objectMetadataSingularName: 'keluarga',
        objectMetadataPluralName: 'daftarKeluarga',
        gqlFields: KELUARGA_GQL_FIELDS_WITH_ALAMAT,
        filter: { id: { eq: testKeluargaId } },
      });

      const response =
        await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

      expectPermissionDeniedError(response);
    });

    it('7. deleteOne', async () => {
      const graphqlOperation = deleteOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: KELUARGA_GQL_FIELDS_WITH_ALAMAT,
        recordId: testKeluargaId,
      });

      const response =
        await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

      expectPermissionDeniedError(response);
    });
  });

  it('2. should allow a restricted field of a related object to be read', async () => {
    await restrictAccessToPendudukTempatLahir(
      customRoleId,
      pendudukObjectId,
      restrictedPendudukFieldId,
    );
    const graphqlOperation = findManyOperationFactory({
      objectMetadataSingularName: 'keluarga',
      objectMetadataPluralName: 'daftarKeluarga',
      gqlFields: KELUARGA_GQL_FIELDS_WITH_PENDUDUK_TEMPAT_LAHIR,
    });
    const response =
      await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

    expectNoGraphQLErrors(response);
    expect(
      response.body.data.daftarKeluarga.edges[0].node.daftarPenduduk.edges[0].node
        .tempatLahir,
    ).toBeDefined();
  });

  it('3. should succeed if restricted fields exist but are not requested', async () => {
    await restrictAccessToKeluargaAlamat(
      customRoleId,
      keluargaObjectId,
      restrictedKeluargaFieldId,
    );
    await restrictAccessToPendudukTempatLahir(
      customRoleId,
      pendudukObjectId,
      restrictedPendudukFieldId,
    );

    // Query TIDAK meminta field yang dibatasi
    const graphqlOperation = findManyOperationFactory({
      objectMetadataSingularName: 'keluarga',
      objectMetadataPluralName: 'daftarKeluarga',
      gqlFields:
        KELUARGA_GQL_FIELDS_WITHOUT_ALAMAT_AND_WITHOUT_PENDUDUK_TEMPAT_LAHIR,
    });
    const response =
      await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.daftarKeluarga.edges[0].node.id).toBeDefined();
  });

  describe('Aggregate operations', () => {
    it('1. should allow aggregate over a restricted field', async () => {
      await restrictAccessToKeluargaAlamat(
        customRoleId,
        keluargaObjectId,
        restrictedKeluargaFieldId,
      );

      // Query meminta aggregate dari field yang dibatasi
      const graphqlOperation = {
        query: gql`
          query DaftarKeluarga {
            daftarKeluarga {
              countEmptyAlamat
            }
          }
        `,
      };
      const response =
        await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

      expectNoGraphQLErrors(response);
      expect(response.body.data.daftarKeluarga.countEmptyAlamat).toBeDefined();
    });

    it('2. should allow aggregate over a restricted field on a related object', async () => {
      await restrictAccessToPendudukTempatLahir(
        customRoleId,
        pendudukObjectId,
        restrictedPendudukFieldId,
      );

      // Query meminta aggregate dari field terbatas pada object relasi
      const graphqlOperation = findManyOperationFactory({
        objectMetadataSingularName: 'keluarga',
        objectMetadataPluralName: 'daftarKeluarga',
        gqlFields: KELUARGA_GQL_FIELDS_WITH_PENDUDUK_TEMPAT_LAHIR_AGGREGATE,
      });
      const response =
        await makeGraphqlAPIRequestWithMemberRole(graphqlOperation);

      expectNoGraphQLErrors(response);
      expect(
        response.body.data.daftarKeluarga.edges[0].node.daftarPenduduk
          .percentageEmptyTempatLahir,
      ).toBeDefined();
    });
  });
});
