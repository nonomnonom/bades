import { TEST_KELUARGA_1_ID } from 'test/integration/constants/test-keluarga-ids.constants';
import {
  TEST_PENDUDUK_1_ID,
  TEST_PENDUDUK_2_ID,
  TEST_PENDUDUK_3_ID,
  TEST_PENDUDUK_4_ID,
} from 'test/integration/constants/test-penduduk-ids.constants';
import { makeRestAPIRequest } from 'test/integration/rest/utils/make-rest-api-request.util';
import { deleteAllRecords } from 'test/integration/utils/delete-all-records';
import { generateRecordName } from 'test/integration/utils/generate-record-name';

describe('Core REST API Find Many endpoint', () => {
  const testPendudukIds = [
    TEST_PENDUDUK_1_ID,
    TEST_PENDUDUK_2_ID,
    TEST_PENDUDUK_3_ID,
    TEST_PENDUDUK_4_ID,
  ];
  const testPendudukTempatLahirs: Record<string, string> = {};

  beforeAll(async () => {
    await deleteAllRecords('penduduk');

    await makeRestAPIRequest({
      method: 'post',
      path: '/daftarKeluarga',
      body: {
        id: TEST_KELUARGA_1_ID,
        nomorKk: '3201010101000001',
      },
    });

    let index = 0;

    for (const pendudukId of testPendudukIds) {
      const tempatLahir = generateRecordName(pendudukId);

      testPendudukTempatLahirs[pendudukId] = tempatLahir;

      await makeRestAPIRequest({
        method: 'post',
        path: '/daftarPenduduk',
        body: {
          id: pendudukId,
          tempatLahir: tempatLahir,
          position: index,
          kartuKeluargaId: TEST_KELUARGA_1_ID,
        },
      });

      index++;
    }
  });

  it('should retrieve all daftarPenduduk with pagination metadata', async () => {
    const response = await makeRestAPIRequest({
      method: 'get',
      path: '/daftarPenduduk',
    });

    expect(response.status).toBe(200);

    const daftarPenduduk = response.body.data.daftarPenduduk;
    const pageInfo = response.body.pageInfo;
    const totalCount = response.body.totalCount;

    expect(daftarPenduduk).not.toBeNull();
    expect(Array.isArray(daftarPenduduk)).toBe(true);
    expect(daftarPenduduk.length).toBeGreaterThanOrEqual(testPendudukIds.length);

    // Periksa bahwa penduduk uji disertakan dalam hasil
    for (const pendudukId of testPendudukIds) {
      // @ts-expect-error legacy noImplicitAny
      const penduduk = daftarPenduduk.find((p) => p.id === pendudukId);

      expect(penduduk).toBeDefined();
      expect(penduduk.tempatLahir).toBe(testPendudukTempatLahirs[pendudukId]);
    }

    // Periksa metadata pagination
    expect(pageInfo).toBeDefined();
    expect(pageInfo.startCursor).toBeDefined();
    expect(pageInfo.endCursor).toBeDefined();
    expect(typeof totalCount).toBe('number');
    expect(totalCount).toEqual(testPendudukIds.length);
    expect(response.body.pageInfo.hasNextPage).toBe(false);
  });

  it('should limit results based on the limit parameter', async () => {
    const limit = testPendudukIds.length - 1;
    const response = await makeRestAPIRequest({
      method: 'get',
      path: `/daftarPenduduk?limit=${limit}`,
    }).expect(200);

    const daftarPenduduk = response.body.data.daftarPenduduk;

    expect(daftarPenduduk).not.toBeNull();
    expect(Array.isArray(daftarPenduduk)).toBe(true);
    expect(daftarPenduduk.length).toEqual(limit);
    expect(response.body.totalCount).toEqual(testPendudukIds.length);
    expect(response.body.pageInfo.hasNextPage).toBe(true);
  });

  it('should return filtered totalCount', async () => {
    const response = await makeRestAPIRequest({
      method: 'get',
      path: `/daftarPenduduk?filter=position[lte]:1`,
    }).expect(200);

    const daftarPenduduk = response.body.data.daftarPenduduk;

    expect(daftarPenduduk).not.toBeNull();
    expect(Array.isArray(daftarPenduduk)).toBe(true);
    expect(daftarPenduduk.length).toEqual(2);
    expect(response.body.totalCount).toEqual(2);
    expect(response.body.pageInfo.hasNextPage).toBe(false);
  });

  it('should filter results based on filter parameters', async () => {
    const response = await makeRestAPIRequest({
      method: 'get',
      path: '/daftarPenduduk?filter=position[lt]:2',
    }).expect(200);

    const filteredDaftarPenduduk = response.body.data.daftarPenduduk;

    expect(filteredDaftarPenduduk).toBeDefined();
    expect(Array.isArray(filteredDaftarPenduduk)).toBe(true);
    expect(filteredDaftarPenduduk.length).toBe(2);
  });

  it('should support cursor-based pagination with starting_after', async () => {
    const initialResponse = await makeRestAPIRequest({
      method: 'get',
      path: '/daftarPenduduk?limit=2',
    }).expect(200);

    const daftarPenduduk = initialResponse.body.data.daftarPenduduk;
    const startCursor = initialResponse.body.pageInfo.startCursor;

    expect(daftarPenduduk).toBeDefined();
    expect(daftarPenduduk.length).toBe(2);
    expect(startCursor).toBeDefined();

    const nextPageResponse = await makeRestAPIRequest({
      method: 'get',
      path: `/daftarPenduduk?starting_after=${startCursor}&limit=1`,
    }).expect(200);

    const nextPageDaftarPenduduk = nextPageResponse.body.data.daftarPenduduk;

    expect(nextPageDaftarPenduduk).toBeDefined();
    expect(nextPageDaftarPenduduk.length).toBe(1);
    expect(nextPageDaftarPenduduk[0].id).toBe(daftarPenduduk[1].id);
  });

  it('should support cursor-based pagination with ending_before', async () => {
    const initialResponse = await makeRestAPIRequest({
      method: 'get',
      path: '/daftarPenduduk?limit=4',
    }).expect(200);

    const daftarPenduduk = initialResponse.body.data.daftarPenduduk;
    const endCursor = initialResponse.body.pageInfo.endCursor;

    expect(daftarPenduduk).toBeDefined();
    expect(daftarPenduduk.length).toBe(4);
    expect(endCursor).toBeDefined();

    const nextPageResponse = await makeRestAPIRequest({
      method: 'get',
      path: `/daftarPenduduk?ending_before=${endCursor}&limit=2`,
    }).expect(200);

    const nextPageDaftarPenduduk = nextPageResponse.body.data.daftarPenduduk;

    expect(nextPageDaftarPenduduk).toBeDefined();
    expect(nextPageDaftarPenduduk.length).toBe(2);
    expect(nextPageDaftarPenduduk[0].id).toBe(daftarPenduduk[1].id);
    expect(nextPageDaftarPenduduk[1].id).toBe(daftarPenduduk[2].id);
  });

  it('should support ordering Asc of results', async () => {
    const ascResponse = await makeRestAPIRequest({
      method: 'get',
      path: '/daftarPenduduk?order_by=position[AscNullsLast]',
    }).expect(200);

    const ascDaftarPenduduk = ascResponse.body.data.daftarPenduduk;

    expect(ascDaftarPenduduk).toEqual(
      [...ascDaftarPenduduk].sort((a, b) => a.position - b.position),
    );
  });

  it('should support filtering on a relation field id', async () => {
    const response = await makeRestAPIRequest({
      method: 'get',
      path: `/daftarPenduduk?filter=kartuKeluargaId[in]:["${TEST_KELUARGA_1_ID}"]`,
    }).expect(200);

    const filteredDaftarPenduduk = response.body.data.daftarPenduduk;

    expect(filteredDaftarPenduduk.length).toBeGreaterThan(0);
  });

  // TODO: Refacto-common - Uncomment setelah https://github.com/twentyhq/core-team-issues/issues/1627 selesai
  //   it('should fail to filter on a relation field name', async () => {
  //     const response = await makeRestAPIRequest({
  //       method: 'get',
  //       path: `/daftarPenduduk?filter=kartuKeluarga[in]:["${TEST_KELUARGA_1_ID}"]`,
  //     });
  //     expect(response.body).toMatchInlineSnapshot(`
  // {
  //   "error": "BadRequestException",
  //   "messages": [
  //     "field 'kartuKeluarga' does not exist in 'penduduk' object",
  //   ],
  //   "statusCode": 400,
  // }
  // `);
  //   });

  it('should support ordering Desc of results', async () => {
    const descResponse = await makeRestAPIRequest({
      method: 'get',
      path: '/daftarPenduduk?order_by=position[DescNullsLast]',
    }).expect(200);

    const descDaftarPenduduk = descResponse.body.data.daftarPenduduk;

    expect(descDaftarPenduduk).toEqual(
      [...descDaftarPenduduk].sort((a, b) => -(a.position - b.position)),
    );
  });

  it('should support pagination with ordering', async () => {
    const descResponse = await makeRestAPIRequest({
      method: 'get',
      path: '/daftarPenduduk?order_by=position[DescNullsLast]&limit=2',
    }).expect(200);

    const descDaftarPenduduk = descResponse.body.data.daftarPenduduk;
    const endingBefore = descResponse.body.pageInfo.endCursor;
    const lastPosition = descDaftarPenduduk[descDaftarPenduduk.length - 1].position;

    expect(descResponse.body.pageInfo.hasNextPage).toBe(true);
    expect(descDaftarPenduduk.length).toEqual(2);
    expect(lastPosition).toEqual(2);

    const descResponseWithPaginationResponse = await makeRestAPIRequest({
      method: 'get',
      path: `/daftarPenduduk?order_by=position[DescNullsLast]&limit=2&starting_after=${endingBefore}`,
    }).expect(200);

    const descResponseWithPagination =
      descResponseWithPaginationResponse.body.data.daftarPenduduk;

    expect(descResponseWithPagination.length).toEqual(2);
    expect(descResponseWithPagination[0].position).toEqual(lastPosition - 1);
  });

  it('should handle invalid cursor gracefully', async () => {
    const response = await makeRestAPIRequest({
      method: 'get',
      path: '/daftarPenduduk?starting_after=invalid-cursor',
    });

    expect(response.body.error).toBe('BadRequestException');
    expect(response.body.messages[0]).toContain('Invalid cursor');
  });

  it('should combine filtering, ordering, and pagination', async () => {
    const response = await makeRestAPIRequest({
      method: 'get',
      path: '/daftarPenduduk?filter=position[gt]:0&order_by=tempatLahir[AscNullsFirst]&limit=2',
    }).expect(200);

    const daftarPenduduk = response.body.data.daftarPenduduk;

    const pageInfo = response.body.pageInfo;

    expect(daftarPenduduk).toBeDefined();
    expect(daftarPenduduk.length).toBeLessThanOrEqual(2);
    expect(pageInfo).toBeDefined();

    expect(daftarPenduduk).toEqual(
      [...daftarPenduduk].sort((a, b) => a.tempatLahir - b.tempatLahir),
    );
  });

  it('should should throw an error when trying to order by a composite field', async () => {
    // Bades: namaLengkap adalah field FULL_NAME (composite) — order_by tidak didukung
    await makeRestAPIRequest({
      method: 'get',
      path: '/daftarPenduduk?order_by=namaLengkap[AscNullsLast]',
    }).expect(400);
  });

  it('should support depth 0 parameter', async () => {
    const response = await makeRestAPIRequest({
      method: 'get',
      path: '/daftarPenduduk?depth=0',
    }).expect(200);

    const daftarPenduduk = response.body.data.daftarPenduduk;

    expect(daftarPenduduk).toBeDefined();

    const penduduk = daftarPenduduk[0];

    expect(penduduk).toBeDefined();
    expect(penduduk.kartuKeluargaId).toBeDefined();
    expect(penduduk.kartuKeluarga).not.toBeDefined();
  });

  it('should support depth 1 parameter', async () => {
    const response = await makeRestAPIRequest({
      method: 'get',
      path: '/daftarPenduduk?depth=1',
    }).expect(200);

    const daftarPenduduk = response.body.data.daftarPenduduk;

    const penduduk = daftarPenduduk[0];

    expect(penduduk.kartuKeluarga).toBeDefined();
    // Bades: composite domainName/linkedinLink tidak ada di objek keluarga SID
    expect(penduduk.kartuKeluarga.nomorKk).toBeDefined();

    expect(penduduk.kartuKeluarga.daftarPenduduk).not.toBeDefined();
  });

  it('should not support depth 2 parameter', async () => {
    await makeRestAPIRequest({
      method: 'get',
      path: '/daftarPenduduk?depth=2',
    }).expect(400);
  });
});
