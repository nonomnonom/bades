import { TEST_KELUARGA_1_ID } from 'test/integration/constants/test-keluarga-ids.constants';
import {
  NOT_EXISTING_TEST_PENDUDUK_ID,
  TEST_PENDUDUK_1_ID,
} from 'test/integration/constants/test-penduduk-ids.constants';
import { makeRestAPIRequest } from 'test/integration/rest/utils/make-rest-api-request.util';
import { deleteAllRecords } from 'test/integration/utils/delete-all-records';
import { generateRecordName } from 'test/integration/utils/generate-record-name';

describe('Core REST API Find One endpoint', () => {
  let pendudukTempatLahir: string;

  beforeAll(async () => {
    await deleteAllRecords('penduduk');
    await deleteAllRecords('keluarga');

    pendudukTempatLahir = generateRecordName(TEST_PENDUDUK_1_ID);

    await makeRestAPIRequest({
      method: 'post',
      path: '/daftarKeluarga',
      body: {
        id: TEST_KELUARGA_1_ID,
        nomorKk: '3201010101000001',
      },
    });

    await makeRestAPIRequest({
      method: 'post',
      path: '/daftarPenduduk',
      body: {
        id: TEST_PENDUDUK_1_ID,
        tempatLahir: pendudukTempatLahir,
        kartuKeluargaId: TEST_KELUARGA_1_ID,
      },
    });
  });

  it('should retrieve a penduduk by ID', async () => {
    await makeRestAPIRequest({
      method: 'get',
      path: `/daftarPenduduk/${TEST_PENDUDUK_1_ID}`,
    })
      .expect(200)
      .expect((res) => {
        const penduduk = res.body.data.penduduk;

        expect(penduduk).not.toBeNull();
        expect(penduduk.id).toBe(TEST_PENDUDUK_1_ID);
        expect(penduduk.tempatLahir).toBe(pendudukTempatLahir);
      });
  });

  it('should return 404 error when trying to retrieve a non-existing penduduk', async () => {
    const response = await makeRestAPIRequest({
      method: 'get',
      path: `/daftarPenduduk/${NOT_EXISTING_TEST_PENDUDUK_ID}`,
    });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('NotFoundException');
    expect(response.body.messages[0]).toBe('Record not found');
  });

  it('should return 400 error when trying to retrieve with malformed uuid', async () => {
    await makeRestAPIRequest({
      method: 'get',
      path: `/daftarPenduduk/malformed-uuid`,
    })
      .expect(400)
      .expect((res) => {
        expect(res.body.messages[0]).toContain(
          "'malformed-uuid' is not a valid UUID",
        );
        expect(res.body.error).toBe('BadRequestException');
      });
  });

  it('should support depth 0 parameter', async () => {
    await makeRestAPIRequest({
      method: 'get',
      path: `/daftarPenduduk/${TEST_PENDUDUK_1_ID}?depth=0`,
    })
      .expect(200)
      .expect((res) => {
        const penduduk = res.body.data.penduduk;

        expect(penduduk).toBeDefined();
        expect(penduduk.kartuKeluargaId).toBeDefined();
        expect(penduduk.kartuKeluarga).not.toBeDefined();
      });
  });

  it('should support depth 1 parameter', async () => {
    await makeRestAPIRequest({
      method: 'get',
      path: `/daftarPenduduk/${TEST_PENDUDUK_1_ID}?depth=1`,
    })
      .expect(200)
      .expect((res) => {
        const penduduk = res.body.data.penduduk;

        expect(penduduk.kartuKeluarga).toBeDefined();
        // Bades: composite domainName/linkedinLink tidak ada di objek keluarga SID
        expect(penduduk.kartuKeluarga.nomorKk).toBeDefined();
        expect(penduduk.kartuKeluarga.daftarPenduduk).not.toBeDefined();
      });
  });

  it('should not support depth 2 parameter', async () => {
    await makeRestAPIRequest({
      method: 'get',
      path: `/daftarPenduduk/${TEST_PENDUDUK_1_ID}?depth=2`,
    }).expect(400);
  });
});
