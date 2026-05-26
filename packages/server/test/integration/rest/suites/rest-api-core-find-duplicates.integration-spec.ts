import { TEST_KELUARGA_1_ID } from 'test/integration/constants/test-keluarga-ids.constants';
import {
  TEST_PENDUDUK_1_ID,
  TEST_PENDUDUK_2_ID,
  TEST_PENDUDUK_3_ID,
} from 'test/integration/constants/test-penduduk-ids.constants';
import { makeRestAPIRequest } from 'test/integration/rest/utils/make-rest-api-request.util';
import { deleteAllRecords } from 'test/integration/utils/delete-all-records';

describe('Core REST API Find Duplicates endpoint', () => {
  beforeAll(async () => {
    await deleteAllRecords('penduduk');
    await deleteAllRecords('keluarga');

    await makeRestAPIRequest({
      method: 'post',
      path: '/daftarKeluarga',
      body: {
        id: TEST_KELUARGA_1_ID,
        nomorKk: '3201010101000001',
      },
    }).expect(201);

    // Dua penduduk dengan NIK berbeda tapi namaLengkap sama → dianggap duplikat
    await makeRestAPIRequest({
      method: 'post',
      path: '/batch/daftarPenduduk',
      body: [
        {
          id: TEST_PENDUDUK_1_ID,
          kartuKeluargaId: TEST_KELUARGA_1_ID,
          namaLengkap: {
            firstName: 'Budi',
            lastName: 'Santoso',
          },
        },
        {
          id: TEST_PENDUDUK_2_ID,
          kartuKeluargaId: TEST_KELUARGA_1_ID,
          namaLengkap: {
            firstName: 'Budi',
            lastName: 'Santoso',
          },
        },
        {
          id: TEST_PENDUDUK_3_ID,
          kartuKeluargaId: TEST_KELUARGA_1_ID,
          namaLengkap: {
            firstName: 'Siti',
            lastName: 'Rahayu',
          },
        },
      ],
    }).expect(201);
  });

  it('should retrieve duplicates by object data', async () => {
    const response = await makeRestAPIRequest({
      method: 'post',
      path: `/daftarPenduduk/duplicates`,
      body: {
        data: [
          {
            namaLengkap: {
              firstName: 'Budi',
              lastName: 'Santoso',
            },
          },
        ],
      },
    }).expect(200);

    const data = response.body.data;

    expect(data.length).toBe(1);
    const duplicatesInfo = data[0];

    expect(duplicatesInfo.totalCount).toBe(2);
    expect(duplicatesInfo.pendudukDuplicates.length).toBe(2);

    const [pendudukDuplicated1, pendudukDuplicated2] =
      duplicatesInfo.pendudukDuplicates;

    expect(pendudukDuplicated1.id).toBe(TEST_PENDUDUK_1_ID);
    expect(pendudukDuplicated2.id).toBe(TEST_PENDUDUK_2_ID);
  });

  it('should retrieve duplicates by ids', async () => {
    const response = await makeRestAPIRequest({
      method: 'post',
      path: `/daftarPenduduk/duplicates`,
      body: {
        ids: [TEST_PENDUDUK_1_ID],
      },
    }).expect(200);

    const data = response.body.data;

    expect(data.length).toBe(1);
    const duplicatesInfo = data[0];

    expect(duplicatesInfo.totalCount).toBe(1);
    expect(duplicatesInfo.pendudukDuplicates.length).toBe(1);

    const [pendudukDuplicated] = duplicatesInfo.pendudukDuplicates;

    expect(pendudukDuplicated.id).toBe(TEST_PENDUDUK_2_ID);
  });

  it('should not provide wrong duplicates', async () => {
    const response = await makeRestAPIRequest({
      method: 'post',
      path: `/daftarPenduduk/duplicates`,
      body: {
        data: [
          {
            namaLengkap: {
              firstName: 'Tidak',
              lastName: 'Ada',
            },
          },
        ],
      },
    }).expect(200);

    const data = response.body.data;

    expect(data.length).toBe(1);
    const duplicatesInfo = data[0];

    expect(duplicatesInfo.totalCount).toBe(0);
    expect(duplicatesInfo.pendudukDuplicates.length).toBe(0);
  });

  it('should return 400 error when empty object data provided', async () => {
    const response = await makeRestAPIRequest({
      method: 'post',
      path: `/daftarPenduduk/duplicates`,
      body: {
        data: [],
      },
    }).expect(400);

    expect(response.body.messages[0]).toContain(
      'The "data" condition can not be empty when "ids" input not provided',
    );
    expect(response.body.error).toBe('BadRequestException');
  });

  it('should return empty result when empty ids provided', async () => {
    const response = await makeRestAPIRequest({
      method: 'post',
      path: `/daftarPenduduk/duplicates`,
      body: {
        ids: [],
      },
    }).expect(200);

    expect(response.body.data.length).toBe(0);
  });

  it('should return 400 error when ids and data are provided', async () => {
    const response = await makeRestAPIRequest({
      method: 'post',
      path: `/daftarPenduduk/duplicates`,
      body: {
        data: [],
        ids: [],
      },
    }).expect(400);

    expect(response.body.messages[0]).toContain(
      'You cannot provide both "data" and "ids" arguments',
    );
    expect(response.body.error).toBe('BadRequestException');
  });

  it('should support depth 0 parameter', async () => {
    const response = await makeRestAPIRequest({
      method: 'post',
      path: `/daftarPenduduk/duplicates?depth=0`,
      body: {
        data: [
          {
            namaLengkap: {
              firstName: 'Budi',
              lastName: 'Santoso',
            },
          },
        ],
      },
    }).expect(200);

    const data = response.body.data;

    expect(data.length).toBe(1);
    const duplicatesInfo = data[0];

    const [pendudukDuplicated1, pendudukDuplicated2] =
      duplicatesInfo.pendudukDuplicates;

    expect(pendudukDuplicated1.kartuKeluargaId).toBe(TEST_KELUARGA_1_ID);
    expect(pendudukDuplicated1.kartuKeluarga).not.toBeDefined();
    expect(pendudukDuplicated2.kartuKeluargaId).toBe(TEST_KELUARGA_1_ID);
    expect(pendudukDuplicated2.kartuKeluarga).not.toBeDefined();
  });

  it('should support depth 1 parameter', async () => {
    const response = await makeRestAPIRequest({
      method: 'post',
      path: `/daftarPenduduk/duplicates?depth=1`,
      body: {
        data: [
          {
            namaLengkap: {
              firstName: 'Budi',
              lastName: 'Santoso',
            },
          },
        ],
      },
    }).expect(200);

    const data = response.body.data;

    expect(data.length).toBe(1);
    const duplicatesInfo = data[0];

    const [pendudukDuplicated1, pendudukDuplicated2] =
      duplicatesInfo.pendudukDuplicates;

    expect(pendudukDuplicated1.kartuKeluarga).toBeDefined();
    expect(pendudukDuplicated1.kartuKeluarga.id).toBe(TEST_KELUARGA_1_ID);
    expect(pendudukDuplicated1.kartuKeluarga.daftarPenduduk).not.toBeDefined();

    expect(pendudukDuplicated2.kartuKeluarga).toBeDefined();
    expect(pendudukDuplicated2.kartuKeluarga.id).toBe(TEST_KELUARGA_1_ID);
    expect(pendudukDuplicated2.kartuKeluarga.daftarPenduduk).not.toBeDefined();
  });

  it('should not support depth 2 parameter', async () => {
    await makeRestAPIRequest({
      method: 'post',
      path: `/daftarPenduduk/duplicates?depth=2`,
      body: {
        data: [
          {
            namaLengkap: {
              firstName: 'Budi',
              lastName: 'Santoso',
            },
          },
        ],
      },
    }).expect(400);
  });
});
