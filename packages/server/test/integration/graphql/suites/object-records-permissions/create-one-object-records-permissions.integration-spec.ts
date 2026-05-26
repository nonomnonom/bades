import { randomUUID } from 'node:crypto';

import { PENDUDUK_GQL_FIELDS } from 'test/integration/constants/penduduk-gql-fields.constants';
import { createOneOperationFactory } from 'test/integration/graphql/utils/create-one-operation-factory.util';
import { makeGraphqlAPIRequestWithApiKey } from 'test/integration/graphql/utils/make-graphql-api-request-with-api-key.util';
import { makeGraphqlAPIRequestWithGuestRole } from 'test/integration/graphql/utils/make-graphql-api-request-with-guest-role.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { deleteRecordsByIds } from 'test/integration/utils/delete-records-by-ids';

import { ErrorCode } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import { PermissionsExceptionMessage } from 'src/engine/metadata-modules/permissions/permissions.exception';

describe('createOneObjectRecordsPermissions', () => {
  let createdPendudukIds: string[] = [];

  afterEach(async () => {
    if (createdPendudukIds.length > 0) {
      await deleteRecordsByIds('penduduk', createdPendudukIds);
      createdPendudukIds = [];
    }
  });

  it('harus melempar error permission saat user tidak punya izin (guest role)', async () => {
    const graphqlOperation = createOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      data: {
        id: randomUUID(),
      },
    });

    const response = await makeGraphqlAPIRequestWithGuestRole(graphqlOperation);

    expect(response.body.data).toStrictEqual({ createPenduduk: null });
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe(
      PermissionsExceptionMessage.PERMISSION_DENIED,
    );
    expect(response.body.errors[0].extensions.code).toBe(ErrorCode.FORBIDDEN);
  });

  it('harus berhasil membuat record saat user punya izin (admin role)', async () => {
    const testPendudukId = randomUUID();
    const graphqlOperation = createOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      data: {
        id: testPendudukId,
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    createdPendudukIds.push(testPendudukId);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.createPenduduk).toBeDefined();
    expect(response.body.data.createPenduduk.id).toBe(testPendudukId);
  });

  it('harus berhasil membuat record saat dieksekusi via API key', async () => {
    const testPendudukId = randomUUID();
    const graphqlOperation = createOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      data: {
        id: testPendudukId,
      },
    });

    const response = await makeGraphqlAPIRequestWithApiKey(graphqlOperation);

    createdPendudukIds.push(testPendudukId);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.createPenduduk).toBeDefined();
    expect(response.body.data.createPenduduk.id).toBe(testPendudukId);
  });
});
