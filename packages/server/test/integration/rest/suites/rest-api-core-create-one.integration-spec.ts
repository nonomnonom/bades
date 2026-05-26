import { TEST_KELUARGA_1_ID } from 'test/integration/constants/test-keluarga-ids.constants';
import { TEST_PENDUDUK_1_ID } from 'test/integration/constants/test-penduduk-ids.constants';
import { makeRestAPIRequest } from 'test/integration/rest/utils/make-rest-api-request.util';
import { deleteAllRecords } from 'test/integration/utils/delete-all-records';
import { generateRecordName } from 'test/integration/utils/generate-record-name';
import { FieldActorSource } from 'shared/types';

import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

describe('Core REST API Create One endpoint', () => {
  beforeEach(async () => {
    await deleteAllRecords('penduduk');
    await deleteAllRecords('keluarga');
    await makeRestAPIRequest({
      method: 'post',
      path: '/keluargas',
      body: {
        id: TEST_KELUARGA_1_ID,
        nomorKk: '3201234567890000',
      },
    });
    // Catatan: relasi penduduk → keluarga melalui junction field 'anggota' (ONE_TO_MANY).
    // Field di penduduk yang mengacu keluarga adalah 'kartuKeluargaId' (dari targetFieldLabel
    // 'Kartu Keluarga' yang di-camelCase oleh engine → 'kartuKeluarga').
    // Test depth menggunakan nama field yang di-generate dinamis ini.
  });

  afterAll(async () => {
    await deleteAllRecords('penduduk');
    await deleteAllRecords('keluarga');
  });

  it('harus membuat penduduk baru', async () => {
    const tempatLahir = generateRecordName(TEST_PENDUDUK_1_ID);
    const requestBody = {
      id: TEST_PENDUDUK_1_ID,
      tempatLahir,
      kartuKeluargaId: TEST_KELUARGA_1_ID,
    };

    await makeRestAPIRequest({
      method: 'post',
      path: `/penduduks`,
      body: requestBody,
    })
      .expect(201)
      .expect((res) => {
        const createdPenduduk = res.body.data.createPenduduk;

        expect(createdPenduduk.id).toBe(TEST_PENDUDUK_1_ID);
        expect(createdPenduduk.tempatLahir).toBe(tempatLahir);
        expect(createdPenduduk.createdBy.source).toBe(FieldActorSource.API);
        expect(createdPenduduk.createdBy.workspaceMemberId).toBe(null);
      });
  });

  it('harus membuat penduduk baru dengan createdBy spesifik', async () => {
    const tempatLahir = generateRecordName(TEST_PENDUDUK_1_ID);
    const requestBody = {
      id: TEST_PENDUDUK_1_ID,
      tempatLahir,
      kartuKeluargaId: TEST_KELUARGA_1_ID,
      createdBy: {
        source: FieldActorSource.EMAIL,
      },
    };

    await makeRestAPIRequest({
      method: 'post',
      path: `/penduduks`,
      body: requestBody,
    })
      .expect(201)
      .expect((res) => {
        const createdPenduduk = res.body.data.createPenduduk;

        expect(createdPenduduk.createdBy.source).toBe(FieldActorSource.EMAIL);
        expect(createdPenduduk.createdBy.workspaceMemberId).toBe(null);
      });
  });

  it('harus membuat penduduk dengan createdBy MANUAL jika user teridentifikasi', async () => {
    const tempatLahir = generateRecordName(TEST_PENDUDUK_1_ID);
    const requestBody = {
      id: TEST_PENDUDUK_1_ID,
      tempatLahir,
      kartuKeluargaId: TEST_KELUARGA_1_ID,
    };

    await makeRestAPIRequest({
      method: 'post',
      path: `/penduduks`,
      body: requestBody,
      bearer: APPLE_JANE_ADMIN_ACCESS_TOKEN,
    })
      .expect(201)
      .expect((res) => {
        const createdPenduduk = res.body.data.createPenduduk;

        expect(createdPenduduk.createdBy.source).toBe(FieldActorSource.MANUAL);
        expect(createdPenduduk.createdBy.workspaceMemberId).toBe(
          WORKSPACE_MEMBER_DATA_SEED_IDS.KADES,
        );
      });
  });

  it('harus mendukung parameter depth 0', async () => {
    const tempatLahir = generateRecordName(TEST_PENDUDUK_1_ID);
    const requestBody = {
      id: TEST_PENDUDUK_1_ID,
      tempatLahir,
      kartuKeluargaId: TEST_KELUARGA_1_ID,
    };

    await makeRestAPIRequest({
      method: 'post',
      path: `/penduduks?depth=0`,
      body: requestBody,
    })
      .expect(201)
      .expect((res) => {
        const createdPenduduk = res.body.data.createPenduduk;

        expect(createdPenduduk.kartuKeluargaId).toBeDefined();
        expect(createdPenduduk.kartuKeluarga).not.toBeDefined();
      });
  });

  it('harus mendukung parameter depth 1', async () => {
    const tempatLahir = generateRecordName(TEST_PENDUDUK_1_ID);
    const requestBody = {
      id: TEST_PENDUDUK_1_ID,
      tempatLahir,
      kartuKeluargaId: TEST_KELUARGA_1_ID,
    };

    await makeRestAPIRequest({
      method: 'post',
      path: `/penduduks?depth=1`,
      body: requestBody,
    })
      .expect(201)
      .expect((res) => {
        const createdPenduduk = res.body.data.createPenduduk;

        expect(createdPenduduk.kartuKeluarga).toBeDefined();
        expect(createdPenduduk.kartuKeluarga.nomorKk).toBe('3201234567890000');
        expect(createdPenduduk.kartuKeluarga.anggota).not.toBeDefined();
      });
  });

  it('harus tidak mendukung parameter depth 2', async () => {
    const tempatLahir = generateRecordName(TEST_PENDUDUK_1_ID);
    const requestBody = {
      id: TEST_PENDUDUK_1_ID,
      tempatLahir,
      kartuKeluargaId: TEST_KELUARGA_1_ID,
    };

    await makeRestAPIRequest({
      method: 'post',
      path: `/penduduks?depth=2`,
      body: requestBody,
    }).expect(400);
  });

  it('harus mengembalikan BadRequestException saat membuat penduduk dengan ID yang sudah ada', async () => {
    const tempatLahir = generateRecordName(TEST_PENDUDUK_1_ID);
    const requestBody = {
      id: TEST_PENDUDUK_1_ID,
      tempatLahir,
    };

    await makeRestAPIRequest({
      method: 'post',
      path: `/penduduks`,
      body: requestBody,
    });

    await makeRestAPIRequest({
      method: 'post',
      path: `/penduduks`,
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

  it('harus mengembalikan BadRequestException saat membuat programBantuan dengan enum tidak valid', async () => {
    const requestBody = {
      status: 'NILAI_ENUM_TIDAK_VALID',
    };

    await makeRestAPIRequest({
      method: 'post',
      path: `/programBantuans`,
      body: requestBody,
    })
      .expect(400)
      .expect((res) => {
        expect(res.body.messages[0]).toMatch(
          /Invalid value "NILAI_ENUM_TIDAK_VALID" for field "status"/,
        );
        expect(res.body.error).toBe('BadRequestException');
      });
  });
});
