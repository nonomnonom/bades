import { randomUUID } from 'crypto';

import { default as request } from 'supertest';
import { PENDUDUK_GQL_FIELDS } from 'test/integration/constants/penduduk-gql-fields.constants';
import { createCustomRoleWithObjectPermissions } from 'test/integration/graphql/utils/create-custom-role-with-object-permissions.util';
import { createOneOperationFactory } from 'test/integration/graphql/utils/create-one-operation-factory.util';
import { deleteRole } from 'test/integration/graphql/utils/delete-one-role.util';
import { findManyOperationFactory } from 'test/integration/graphql/utils/find-many-operation-factory.util';
import { findOneOperationFactory } from 'test/integration/graphql/utils/find-one-operation-factory.util';
import { makeGraphqlAPIRequestWithMemberRole as makeGraphqlAPIRequestWithJony } from 'test/integration/graphql/utils/make-graphql-api-request-with-member-role.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { updateWorkspaceMemberRole } from 'test/integration/graphql/utils/update-workspace-member-role.util';

import { ErrorCode } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import { PermissionsExceptionMessage } from 'src/engine/metadata-modules/permissions/permissions.exception';
import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

const client = request(`http://localhost:${APP_PORT}`);

describe('permissionsOnRelations', () => {
  let originalMemberRoleId: string;
  let customRoleId: string;
  const pendudukId = randomUUID();

  beforeAll(async () => {
    // Ambil ID role Member asli untuk dipulihkan setelah pengujian
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

    // Buat record keluarga (pengganti company) sebagai induk relasi
    const keluargaId = randomUUID();
    const graphqlOperationForKeluargaCreation = createOneOperationFactory({
      objectMetadataSingularName: 'keluarga',
      gqlFields: `
          nomorKk
        `,
      data: {
        id: keluargaId,
        nomorKk: '3201010101010001',
      },
    });

    await makeGraphqlAPIRequest(graphqlOperationForKeluargaCreation);

    // Buat record penduduk (pengganti person) yang terhubung ke keluarga
    const graphqlOperationForPendudukCreation = createOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      data: {
        id: pendudukId,
        namaLengkap: {
          firstName: 'Siti',
        },
        tempatLahir: 'Bandung',
        kartuKeluargaId: keluargaId,
      },
    });

    await makeGraphqlAPIRequest(graphqlOperationForPendudukCreation);
  });

  afterAll(async () => {
    const restoreMemberRoleQuery = {
      query: `
          mutation UpdateWorkspaceMemberRole {
            updateWorkspaceMemberRole(
              workspaceMemberId: "${WORKSPACE_MEMBER_DATA_SEED_IDS.SEKDES}"
              roleId: "${originalMemberRoleId}"
            ) {
              id
            }
          }
        `,
    };

    await client
      .post('/metadata')
      .set('Authorization', `Bearer ${APPLE_JANE_ADMIN_ACCESS_TOKEN}`)
      .send(restoreMemberRoleQuery);
  });

  afterEach(async () => {
    await deleteRole(client, customRoleId);
  });

  it('should throw permission error when querying penduduk with keluarga relation without keluarga read permission', async () => {
    // Buat role dengan izin baca penduduk saja, tanpa izin baca keluarga
    const { roleId } = await createCustomRoleWithObjectPermissions({
      label: 'PendudukOnlyRole',
      canReadPenduduk: true,
      canReadKeluarga: false,
    });

    customRoleId = roleId;

    await updateWorkspaceMemberRole({
      client,
      roleId: customRoleId,
      workspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.SEKDES,
    });

    // Query yang menyertakan relasi keluarga
    const graphqlOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: `
          id
          tempatLahir
          pekerjaan
          kartuKeluarga {
            id
            nomorKk
          }
        `,
    });

    const response = await makeGraphqlAPIRequestWithJony(graphqlOperation);

    // Query harus gagal ketika mencoba mengakses relasi keluarga tanpa izin
    expect(response.body.errors[0].message).toBe(
      PermissionsExceptionMessage.PERMISSION_DENIED,
    );
    expect(response.body.errors[0].extensions.code).toBe(ErrorCode.FORBIDDEN);
  });

  it('should successfully query penduduk with keluarga relation when having both permissions', async () => {
    // Buat role dengan izin baca penduduk dan keluarga
    const { roleId } = await createCustomRoleWithObjectPermissions({
      label: 'PendudukAndKeluargaRole',
      canReadPenduduk: true,
      canReadKeluarga: true,
    });

    customRoleId = roleId;

    await updateWorkspaceMemberRole({
      client,
      roleId: customRoleId,
      workspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.SEKDES,
    });

    // Query yang menyertakan relasi keluarga
    const graphqlOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: `
          id
          tempatLahir
          pekerjaan
          kartuKeluarga {
            id
            nomorKk
          }
        `,
    });

    const response = await makeGraphqlAPIRequestWithJony(graphqlOperation);

    // Query harus berhasil
    expect(response.body.data).toBeDefined();
    expect(response.body.data.daftarPenduduk).toBeDefined();
    const penduduk = response.body.data.daftarPenduduk.edges[0].node;

    expect(penduduk.kartuKeluarga).toBeDefined();
    expect(response.body.error).toBeUndefined();
  });

  it('nested relations - should throw permission error when querying nested programBantuan relation without programBantuan read permission', async () => {
    // User punya izin baca penduduk dan keluarga, tapi tidak punya izin baca programBantuan

    const { roleId } = await createCustomRoleWithObjectPermissions({
      label: 'PendudukKeluargaOnlyRole',
      canReadPenduduk: true,
      canReadKeluarga: true,
      canReadProgramBantuan: false,
    });

    customRoleId = roleId;

    await updateWorkspaceMemberRole({
      client,
      roleId: customRoleId,
      workspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.SEKDES,
    });

    // Query dengan nested relation ke programBantuan melalui keluarga
    const graphqlOperation = findOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: `
          id
          tempatLahir
          pekerjaan
          kartuKeluarga {
            id
            nomorKk
            daftarProgramBantuan {
              edges {
                node {
                  namaProgram
                }
              }
            }
          }
        `,
      filter: {
        id: {
          eq: pendudukId,
        },
      },
    });

    const response = await makeGraphqlAPIRequestWithJony(graphqlOperation);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe(
      PermissionsExceptionMessage.PERMISSION_DENIED,
    );
    expect(response.body.errors[0].extensions.code).toBe(ErrorCode.FORBIDDEN);
  });
});
