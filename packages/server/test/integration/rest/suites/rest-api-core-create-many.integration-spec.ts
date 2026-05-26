import { TEST_KELUARGA_1_ID } from 'test/integration/constants/test-keluarga-ids.constants';
import {
  TEST_PENDUDUK_1_ID,
  TEST_PENDUDUK_2_ID,
} from 'test/integration/constants/test-penduduk-ids.constants';
import { makeRestAPIRequest } from 'test/integration/rest/utils/make-rest-api-request.util';
import { deleteAllRecords } from 'test/integration/utils/delete-all-records';
import { FieldActorSource } from 'shared/types';

import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

describe('Core REST API Create Many endpoint', () => {
  beforeEach(async () => {
    await deleteAllRecords('penduduk');
    await makeRestAPIRequest({
      method: 'post',
      path: '/daftarKeluarga',
      body: {
        id: TEST_KELUARGA_1_ID,
        nomorKk: '3201010101000001',
      },
    });
  });

  it('should create many penduduk', async () => {
    const requestBody = [
      {
        id: TEST_PENDUDUK_1_ID,
      },
      {
        id: TEST_PENDUDUK_2_ID,
      },
    ];

    await makeRestAPIRequest({
      method: 'post',
      path: `/batch/daftarPenduduk`,
      body: requestBody,
    })
      .expect(201)
      .expect((res) => {
        const createdDaftarPenduduk = res.body.data.createDaftarPenduduk;

        expect(createdDaftarPenduduk.length).toBe(2);
        expect(createdDaftarPenduduk[0].id).toBe(TEST_PENDUDUK_1_ID);
        expect(createdDaftarPenduduk[0].createdBy.source).toBe(FieldActorSource.API);
        expect(createdDaftarPenduduk[0].createdBy.workspaceMemberId).toBe(null);

        expect(createdDaftarPenduduk[1].id).toBe(TEST_PENDUDUK_2_ID);
        expect(createdDaftarPenduduk[1].createdBy.source).toBe(FieldActorSource.API);
        expect(createdDaftarPenduduk[1].createdBy.workspaceMemberId).toBe(null);
      });
  });

  it('should create many penduduk with specific createdBy', async () => {
    const requestBody = [
      {
        id: TEST_PENDUDUK_1_ID,
        createdBy: {
          source: FieldActorSource.EMAIL,
        },
      },
      {
        id: TEST_PENDUDUK_2_ID,
        createdBy: {
          source: FieldActorSource.MANUAL,
        },
      },
    ];

    await makeRestAPIRequest({
      method: 'post',
      path: `/batch/daftarPenduduk`,
      body: requestBody,
    })
      .expect(201)
      .expect((res) => {
        const createdDaftarPenduduk = res.body.data.createDaftarPenduduk;

        expect(createdDaftarPenduduk[0].createdBy.source).toBe(FieldActorSource.EMAIL);
        expect(createdDaftarPenduduk[0].createdBy.workspaceMemberId).toBe(null);

        expect(createdDaftarPenduduk[1].createdBy.source).toBe(FieldActorSource.MANUAL);
        expect(createdDaftarPenduduk[1].createdBy.workspaceMemberId).toBe(null);
      });
  });

  it('should create many penduduk with MANUAL createdBy if user identified', async () => {
    const requestBody = [
      {
        id: TEST_PENDUDUK_1_ID,
      },
      {
        id: TEST_PENDUDUK_2_ID,
      },
    ];

    await makeRestAPIRequest({
      method: 'post',
      path: `/batch/daftarPenduduk`,
      body: requestBody,
      bearer: APPLE_JANE_ADMIN_ACCESS_TOKEN,
    })
      .expect(201)
      .expect((res) => {
        const createdDaftarPenduduk = res.body.data.createDaftarPenduduk;

        expect(createdDaftarPenduduk.length).toBe(2);

        expect(createdDaftarPenduduk[0].createdBy.source).toBe(FieldActorSource.MANUAL);
        expect(createdDaftarPenduduk[0].createdBy.workspaceMemberId).toBe(
          WORKSPACE_MEMBER_DATA_SEED_IDS.KADES,
        );

        expect(createdDaftarPenduduk[1].createdBy.source).toBe(FieldActorSource.MANUAL);
        expect(createdDaftarPenduduk[1].createdBy.workspaceMemberId).toBe(
          WORKSPACE_MEMBER_DATA_SEED_IDS.KADES,
        );
      });
  });

  it('should support depth 0 parameter', async () => {
    const requestBody = [
      {
        id: TEST_PENDUDUK_1_ID,
        kartuKeluargaId: TEST_KELUARGA_1_ID,
      },
      {
        id: TEST_PENDUDUK_2_ID,
        kartuKeluargaId: TEST_KELUARGA_1_ID,
      },
    ];

    await makeRestAPIRequest({
      method: 'post',
      path: `/batch/daftarPenduduk?depth=0`,
      body: requestBody,
    })
      .expect(201)
      .expect((res) => {
        const [createdPenduduk1, createdPenduduk2] =
          res.body.data.createDaftarPenduduk;

        expect(createdPenduduk1.kartuKeluargaId).toBeDefined();
        expect(createdPenduduk1.kartuKeluarga).not.toBeDefined();
        expect(createdPenduduk2.kartuKeluargaId).toBeDefined();
        expect(createdPenduduk2.kartuKeluarga).not.toBeDefined();
      });
  });

  it('should support depth 1 parameter', async () => {
    const requestBody = [
      {
        id: TEST_PENDUDUK_1_ID,
        kartuKeluargaId: TEST_KELUARGA_1_ID,
      },
      {
        id: TEST_PENDUDUK_2_ID,
        kartuKeluargaId: TEST_KELUARGA_1_ID,
      },
    ];

    await makeRestAPIRequest({
      method: 'post',
      path: `/batch/daftarPenduduk?depth=1`,
      body: requestBody,
    })
      .expect(201)
      .expect((res) => {
        const [createdPenduduk1, createdPenduduk2] =
          res.body.data.createDaftarPenduduk;

        expect(createdPenduduk1.kartuKeluarga).toBeDefined();
        expect(createdPenduduk1.kartuKeluarga.daftarPenduduk).not.toBeDefined();
        expect(createdPenduduk2.kartuKeluarga).toBeDefined();
        expect(createdPenduduk2.kartuKeluarga.daftarPenduduk).not.toBeDefined();
      });
  });

  it('should not support depth 2 parameter', async () => {
    const requestBody = [
      {
        id: TEST_PENDUDUK_1_ID,
        kartuKeluargaId: TEST_KELUARGA_1_ID,
      },
      {
        id: TEST_PENDUDUK_2_ID,
        kartuKeluargaId: TEST_KELUARGA_1_ID,
      },
    ];

    await makeRestAPIRequest({
      method: 'post',
      path: `/batch/daftarPenduduk?depth=2`,
      body: requestBody,
    }).expect(400);
  });

  it('should return a BadRequestException when trying to create a penduduk with an existing ID', async () => {
    const requestBody = [
      {
        id: TEST_PENDUDUK_1_ID,
      },
      {
        id: TEST_PENDUDUK_2_ID,
      },
    ];

    await makeRestAPIRequest({
      method: 'post',
      path: `/batch/daftarPenduduk`,
      body: requestBody,
    });

    await makeRestAPIRequest({
      method: 'post',
      path: `/batch/daftarPenduduk`,
      body: requestBody,
    })
      .expect(400)
      .expect((res) => {
        expect(res.body.messages[0]).toContain(
          `A duplicate entry was detected`,
        );
        expect(res.body.error).toBe('BadRequestException');
      });
  });
});
