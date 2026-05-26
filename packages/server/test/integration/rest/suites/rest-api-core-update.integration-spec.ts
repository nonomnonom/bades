import { TEST_KELUARGA_1_ID } from 'test/integration/constants/test-keluarga-ids.constants';
import {
  NOT_EXISTING_TEST_PENDUDUK_ID,
  TEST_PENDUDUK_1_ID,
} from 'test/integration/constants/test-penduduk-ids.constants';
import { makeRestAPIRequest } from 'test/integration/rest/utils/make-rest-api-request.util';
import { deleteAllRecords } from 'test/integration/utils/delete-all-records';
import { generateRecordName } from 'test/integration/utils/generate-record-name';

describe('Core REST API Update One endpoint', () => {
  const updatedData = {
    namaLengkap: {
      firstName: 'Budi',
      lastName: 'Santoso',
    },
    tempatLahir: generateRecordName(TEST_PENDUDUK_1_ID),
  };

  beforeAll(async () => {
    await deleteAllRecords('penduduk');
    await makeRestAPIRequest({
      method: 'post',
      path: '/daftarKeluarga',
      body: {
        id: TEST_KELUARGA_1_ID,
        nomorKk: '3201234567890000',
      },
    });
    await makeRestAPIRequest({
      method: 'post',
      path: `/daftarPenduduk`,
      body: {
        id: TEST_PENDUDUK_1_ID,
        kartuKeluargaId: TEST_KELUARGA_1_ID,
      },
    });
  });

  it('should update an existing penduduk (namaLengkap and tempatLahir)', async () => {
    const response = await makeRestAPIRequest({
      method: 'patch',
      path: `/daftarPenduduk/${TEST_PENDUDUK_1_ID}`,
      body: updatedData,
    });

    expect(response.status).toBe(200);

    const updatedPenduduk = response.body.data.updatePenduduk;

    expect(updatedPenduduk.id).toBe(TEST_PENDUDUK_1_ID);
    expect(updatedPenduduk.namaLengkap.firstName).toBe(
      updatedData.namaLengkap.firstName,
    );
    expect(updatedPenduduk.namaLengkap.lastName).toBe(
      updatedData.namaLengkap.lastName,
    );
    expect(updatedPenduduk.tempatLahir).toBe(updatedData.tempatLahir);
    expect(updatedPenduduk.kartuKeluargaId).toBe(TEST_KELUARGA_1_ID);
  });

  it('should support depth 0 parameter', async () => {
    await makeRestAPIRequest({
      method: 'patch',
      path: `/daftarPenduduk/${TEST_PENDUDUK_1_ID}?depth=0`,
      body: updatedData,
    })
      .expect(200)
      .expect((res) => {
        const updatedPenduduk = res.body.data.updatePenduduk;

        expect(updatedPenduduk.kartuKeluargaId).toBeDefined();
        expect(updatedPenduduk.kartuKeluarga).not.toBeDefined();
      });
  });

  it('should support depth 1 parameter', async () => {
    await makeRestAPIRequest({
      method: 'patch',
      path: `/daftarPenduduk/${TEST_PENDUDUK_1_ID}?depth=1`,
      body: updatedData,
    })
      .expect(200)
      .expect((res) => {
        const updatedPenduduk = res.body.data.updatePenduduk;

        expect(updatedPenduduk.kartuKeluarga).toBeDefined();
        expect(updatedPenduduk.kartuKeluarga.anggota).not.toBeDefined();
      });
  });

  it('should support depth 2 parameter', async () => {
    await makeRestAPIRequest({
      method: 'patch',
      path: `/daftarPenduduk/${TEST_PENDUDUK_1_ID}?depth=2`,
      body: updatedData,
    }).expect(400);
  });

  it('should return a EntityNotFoundError when trying to update a non-existing penduduk', async () => {
    const response = await makeRestAPIRequest({
      method: 'patch',
      path: `/daftarPenduduk/${NOT_EXISTING_TEST_PENDUDUK_ID}`,
    });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('NotFoundException');
    expect(response.body.messages[0]).toBe('Record not found');
  });
});
