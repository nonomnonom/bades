import {
  NOT_EXISTING_TEST_PENDUDUK_ID,
  TEST_PENDUDUK_1_ID,
} from 'test/integration/constants/test-penduduk-ids.constants';
import { makeRestAPIRequest } from 'test/integration/rest/utils/make-rest-api-request.util';
import { deleteAllRecords } from 'test/integration/utils/delete-all-records';

describe('Core REST API Delete One endpoint', () => {
  beforeAll(async () => {
    await deleteAllRecords('penduduk');
  });

  beforeEach(async () => {
    await makeRestAPIRequest({
      method: 'post',
      path: `/penduduks`,
      body: {
        id: TEST_PENDUDUK_1_ID,
      },
    });
  });

  it('should delete one penduduk', async () => {
    await makeRestAPIRequest({
      method: 'delete',
      path: `/penduduks/${TEST_PENDUDUK_1_ID}`,
    })
      .expect(200)
      .expect((res) =>
        expect(res.body.data.deletePenduduk).toEqual({ id: TEST_PENDUDUK_1_ID }),
      );
  });

  it('should return a EntityNotFoundError when trying to delete a non-existing penduduk', async () => {
    const response = await makeRestAPIRequest({
      method: 'delete',
      path: `/penduduks/${NOT_EXISTING_TEST_PENDUDUK_ID}`,
    });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('NotFoundException');
    expect(response.body.messages[0]).toBe('Record not found');
  });
});

describe('Core REST API Delete Many endpoint', () => {
  beforeAll(async () => {
    await deleteAllRecords('penduduk');
  });

  it('should require filters for bulk delete operations', async () => {
    const response = await makeRestAPIRequest({
      method: 'delete',
      path: `/penduduks?soft_delete=true`,
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('BadRequestException');
    expect(response.body.messages[0]).toContain(
      'Filters are mandatory for bulk delete operations',
    );
  });
});

describe('Core REST API Destroy Many endpoint', () => {
  beforeAll(async () => {
    await deleteAllRecords('penduduk');
  });

  it('should require filters for bulk destroy operations', async () => {
    const response = await makeRestAPIRequest({
      method: 'delete',
      path: `/penduduks?soft_delete=false`,
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('BadRequestException');
    expect(response.body.messages[0]).toContain(
      'Filters are mandatory for bulk destroy operations',
    );
  });
});
