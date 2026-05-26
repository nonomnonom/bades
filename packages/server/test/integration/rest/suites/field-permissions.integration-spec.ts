import gql from 'graphql-tag';
import { TEST_KELUARGA_1_ID } from 'test/integration/constants/test-keluarga-ids.constants';
import { TEST_PENDUDUK_1_ID } from 'test/integration/constants/test-penduduk-ids.constants';
import { upsertFieldPermissions } from 'test/integration/graphql/utils/upsert-field-permissions.util';
import { upsertRowLevelPermissionPredicates } from 'test/integration/metadata/suites/row-level-permission-predicate/utils/upsert-row-level-permission-predicates.util';
import { makeMetadataAPIRequest } from 'test/integration/metadata/suites/utils/make-metadata-api-request.util';
import { makeRestAPIRequest } from 'test/integration/rest/utils/make-rest-api-request.util';
import { generateRecordName } from 'test/integration/utils/generate-record-name';
import { RowLevelPermissionPredicateOperand } from 'shared/types';

describe('Restricted fields', () => {
  let pendudukTempatLahir: string;
  let memberRoleId: string;
  let pendudukObjectId: string;
  // Field `tempatLahir` (TEXT) dipakai sebagai field terbatas utama
  // menggantikan `emails` (EMAILS composite) yang tidak ada di SID.
  let tempatLahirFieldId: string;
  // Field `nik` (TEXT) dipakai sebagai field terbatas sekunder
  // menggantikan `phones` (PHONES composite) yang tidak ada di SID.
  let nikFieldId: string;

  beforeAll(async () => {
    pendudukTempatLahir = generateRecordName(TEST_PENDUDUK_1_ID);

    // Buat keluarga sebagai parent record penduduk
    await makeRestAPIRequest({
      method: 'post',
      path: '/keluargas',
      body: {
        id: TEST_KELUARGA_1_ID,
        nomorKk: '3578012345678901',
        alamat: 'Jl. Raya Desa No. 1, Surabaya',
      },
    });

    // Buat penduduk dengan field yang akan diuji pembatasannya
    await makeRestAPIRequest({
      method: 'post',
      path: '/penduduks',
      body: {
        id: TEST_PENDUDUK_1_ID,
        tempatLahir: pendudukTempatLahir,
        nik: '3578011234567890',
        kartuKeluargaId: TEST_KELUARGA_1_ID,
      },
    });

    // Ambil metadata ID object penduduk
    const getObjectMetadataOperation = {
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

    const objectMetadataResponse = await makeMetadataAPIRequest(
      getObjectMetadataOperation,
    );
    const objects = objectMetadataResponse.body.data.objects.edges;

    pendudukObjectId = objects.find(
      (obj: any) => obj.node.nameSingular === 'penduduk',
    )?.node.id;

    // Ambil metadata ID field tempatLahir dan nik
    const getFieldMetadataOperation = {
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

    const fieldMetadataResponse = await makeMetadataAPIRequest(
      getFieldMetadataOperation,
    );
    const fields = fieldMetadataResponse.body.data.fields.edges;

    tempatLahirFieldId = fields.find(
      (field: any) =>
        field.node.name === 'tempatLahir' &&
        field.node.object.nameSingular === 'penduduk',
    ).node.id;

    nikFieldId = fields.find(
      (field: any) =>
        field.node.name === 'nik' &&
        field.node.object.nameSingular === 'penduduk',
    ).node.id;

    // Ambil ID role Member
    const getRolesOperation = {
      query: gql`
        query {
          getRoles {
            id
            label
          }
        }
      `,
    };

    const rolesResponse = await makeMetadataAPIRequest(getRolesOperation);

    memberRoleId = rolesResponse.body.data.getRoles.find(
      (role: any) => role.label === 'Member',
    )?.id;

    // Batasi hak baca field `tempatLahir` untuk role Member
    await upsertFieldPermissions({
      roleId: memberRoleId,
      fieldPermissions: [
        {
          objectMetadataId: pendudukObjectId,
          fieldMetadataId: tempatLahirFieldId,
          canReadFieldValue: false,
          canUpdateFieldValue: null,
        },
      ],
    });
  });

  it('should hide fields when user has restricted read permissions - findOne', async () => {
    await makeRestAPIRequest({
      method: 'get',
      path: `/penduduks/${TEST_PENDUDUK_1_ID}`,
      bearer: APPLE_JONY_MEMBER_ACCESS_TOKEN,
    })
      .expect(200)
      .expect((res) => {
        const penduduk = res.body.data.penduduk;

        expect(penduduk).toBeDefined();
        expect(penduduk.id).toBeDefined();
        // tempatLahir dibatasi — harus disembunyikan dari respons
        expect(penduduk.tempatLahir).toBeUndefined();
      });
  });

  describe('updateOne', () => {
    it('should hide fields in the response when user has restricted read permissions', async () => {
      // Batasi hak baca field `nik`
      await upsertFieldPermissions({
        roleId: memberRoleId,
        fieldPermissions: [
          {
            objectMetadataId: pendudukObjectId,
            fieldMetadataId: nikFieldId,
            canReadFieldValue: false,
            canUpdateFieldValue: null,
          },
        ],
      });

      await makeRestAPIRequest({
        method: 'patch',
        path: `/penduduks/${TEST_PENDUDUK_1_ID}`,
        bearer: APPLE_JONY_MEMBER_ACCESS_TOKEN,
        body: {
          namaLengkap: {
            firstName: 'Budi',
          },
        },
      })
        .expect(200)
        .expect((res) => {
          const updatedPenduduk = res.body.data.updatePenduduk;

          expect(updatedPenduduk.namaLengkap.firstName).toBe('Budi');
          // nik dibatasi — harus disembunyikan dari respons
          expect(updatedPenduduk.nik).toBeUndefined();
        });
    });

    it('should block update when user tries to update non-updatable field', async () => {
      // Batasi hak update field `nik`
      await upsertFieldPermissions({
        roleId: memberRoleId,
        fieldPermissions: [
          {
            objectMetadataId: pendudukObjectId,
            fieldMetadataId: nikFieldId,
            canReadFieldValue: null,
            canUpdateFieldValue: false,
          },
        ],
      });

      await makeRestAPIRequest({
        method: 'patch',
        path: `/penduduks/${TEST_PENDUDUK_1_ID}`,
        bearer: APPLE_JONY_MEMBER_ACCESS_TOKEN,
        body: {
          nik: '3578019999999999',
        },
      })
        .expect(400)
        .expect((res) => {
          expect(res.body.messages[0]).toContain(
            'Entity performing the request does not have permission',
          );
        });
    });

    it('should allow update when user has no restricted update permissions', async () => {
      // Hapus pembatasan field `nik`
      await upsertFieldPermissions({
        roleId: memberRoleId,
        fieldPermissions: [
          {
            objectMetadataId: pendudukObjectId,
            fieldMetadataId: nikFieldId,
            canReadFieldValue: null,
            canUpdateFieldValue: null,
          },
        ],
      });

      await makeRestAPIRequest({
        method: 'patch',
        path: `/penduduks/${TEST_PENDUDUK_1_ID}`,
        bearer: APPLE_JONY_MEMBER_ACCESS_TOKEN,
        body: {
          tempatLahir: 'Malang',
        },
      })
        .expect(200)
        .expect((res) => {
          const updatedPenduduk = res.body.data.updatePenduduk;

          expect(updatedPenduduk.tempatLahir).toBe('Malang');
        });
    });
  });

  describe('createOne', () => {
    it('should block create when restricted field is not in any RLS predicate', async () => {
      await upsertFieldPermissions({
        roleId: memberRoleId,
        fieldPermissions: [
          {
            objectMetadataId: pendudukObjectId,
            fieldMetadataId: nikFieldId,
            canReadFieldValue: null,
            canUpdateFieldValue: false,
          },
        ],
      });

      await makeRestAPIRequest({
        method: 'post',
        path: `/penduduks`,
        bearer: APPLE_JONY_MEMBER_ACCESS_TOKEN,
        body: {
          nik: '3578010000000001',
        },
      })
        .expect(400)
        .expect((res) => {
          expect(res.body.messages[0]).toContain(
            'Entity performing the request does not have permission',
          );
        });
    });

    it('should allow create when restricted field is referenced in an RLS predicate', async () => {
      await upsertFieldPermissions({
        roleId: memberRoleId,
        fieldPermissions: [
          {
            objectMetadataId: pendudukObjectId,
            fieldMetadataId: nikFieldId,
            canReadFieldValue: null,
            canUpdateFieldValue: false,
          },
        ],
      });

      await upsertRowLevelPermissionPredicates({
        input: {
          roleId: memberRoleId,
          objectMetadataId: pendudukObjectId,
          predicates: [
            {
              fieldMetadataId: nikFieldId,
              operand: RowLevelPermissionPredicateOperand.IS_NOT_EMPTY,
            },
          ],
          predicateGroups: [],
        },
      });

      await makeRestAPIRequest({
        method: 'post',
        path: `/penduduks`,
        bearer: APPLE_JONY_MEMBER_ACCESS_TOKEN,
        body: {
          nik: '3578010000000002',
        },
      })
        .expect(201)
        .expect((res) => {
          const createdPenduduk = res.body.data.createPenduduk;

          expect(createdPenduduk).toBeDefined();
          expect(createdPenduduk.nik).toBe('3578010000000002');
        });

      await upsertRowLevelPermissionPredicates({
        input: {
          roleId: memberRoleId,
          objectMetadataId: pendudukObjectId,
          predicates: [],
          predicateGroups: [],
        },
      });
    });

    it('should allow create when user has no restricted update permissions', async () => {
      await upsertFieldPermissions({
        roleId: memberRoleId,
        fieldPermissions: [
          {
            objectMetadataId: pendudukObjectId,
            fieldMetadataId: nikFieldId,
            canReadFieldValue: null,
            canUpdateFieldValue: null,
          },
          {
            objectMetadataId: pendudukObjectId,
            fieldMetadataId: tempatLahirFieldId,
            canReadFieldValue: false,
            canUpdateFieldValue: null,
          },
        ],
      });

      await makeRestAPIRequest({
        method: 'post',
        path: `/penduduks`,
        bearer: APPLE_JONY_MEMBER_ACCESS_TOKEN,
        body: {
          tempatLahir: 'Depok',
        },
      })
        .expect(201)
        .expect((res) => {
          const createdPenduduk = res.body.data.createPenduduk;

          expect(createdPenduduk).toBeDefined();
          // tempatLahir dibatasi read — harus disembunyikan dari respons
          expect(createdPenduduk.tempatLahir).toBeUndefined();
        });
    });
  });

  describe('createMany', () => {
    it('should block createMany when restricted field is not in any RLS predicate', async () => {
      await upsertFieldPermissions({
        roleId: memberRoleId,
        fieldPermissions: [
          {
            objectMetadataId: pendudukObjectId,
            fieldMetadataId: nikFieldId,
            canReadFieldValue: null,
            canUpdateFieldValue: false,
          },
        ],
      });

      await makeRestAPIRequest({
        method: 'post',
        path: `/batch/penduduks`,
        bearer: APPLE_JONY_MEMBER_ACCESS_TOKEN,
        body: [
          {
            nik: '3578010000000010',
          },
        ],
      })
        .expect(400)
        .expect((res) => {
          expect(res.body.messages[0]).toContain(
            'Entity performing the request does not have permission',
          );
        });
    });

    it('should allow createMany when restricted field is referenced in an RLS predicate', async () => {
      await upsertFieldPermissions({
        roleId: memberRoleId,
        fieldPermissions: [
          {
            objectMetadataId: pendudukObjectId,
            fieldMetadataId: nikFieldId,
            canReadFieldValue: null,
            canUpdateFieldValue: false,
          },
        ],
      });

      await upsertRowLevelPermissionPredicates({
        input: {
          roleId: memberRoleId,
          objectMetadataId: pendudukObjectId,
          predicates: [
            {
              fieldMetadataId: nikFieldId,
              operand: RowLevelPermissionPredicateOperand.IS_NOT_EMPTY,
            },
          ],
          predicateGroups: [],
        },
      });

      await makeRestAPIRequest({
        method: 'post',
        path: `/batch/penduduks`,
        bearer: APPLE_JONY_MEMBER_ACCESS_TOKEN,
        body: [
          {
            nik: '3578010000000011',
          },
        ],
      })
        .expect(201)
        .expect((res) => {
          const createdPenduduks = res.body.data.createPenduduks;

          expect(createdPenduduks).toHaveLength(1);
          expect(createdPenduduks[0].nik).toBe('3578010000000011');
        });

      await upsertRowLevelPermissionPredicates({
        input: {
          roleId: memberRoleId,
          objectMetadataId: pendudukObjectId,
          predicates: [],
          predicateGroups: [],
        },
      });
    });

    it('should allow createMany when user has no restricted update permissions', async () => {
      await upsertFieldPermissions({
        roleId: memberRoleId,
        fieldPermissions: [
          {
            objectMetadataId: pendudukObjectId,
            fieldMetadataId: nikFieldId,
            canReadFieldValue: null,
            canUpdateFieldValue: null,
          },
          {
            objectMetadataId: pendudukObjectId,
            fieldMetadataId: tempatLahirFieldId,
            canReadFieldValue: false,
            canUpdateFieldValue: null,
          },
        ],
      });

      await makeRestAPIRequest({
        method: 'post',
        path: `/batch/penduduks`,
        bearer: APPLE_JONY_MEMBER_ACCESS_TOKEN,
        body: [
          {
            tempatLahir: 'Bekasi',
          },
          {
            tempatLahir: 'Tangerang',
          },
        ],
      })
        .expect(201)
        .expect((res) => {
          const createdPenduduks = res.body.data.createPenduduks;

          expect(createdPenduduks).toHaveLength(2);
          // tempatLahir dibatasi read — harus disembunyikan dari respons
          expect(createdPenduduks[0].tempatLahir).toBeUndefined();
          expect(createdPenduduks[1].tempatLahir).toBeUndefined();
        });
    });
  });
});
