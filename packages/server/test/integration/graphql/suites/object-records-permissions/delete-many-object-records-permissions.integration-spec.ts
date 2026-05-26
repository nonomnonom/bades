import { randomUUID } from 'node:crypto';

import { PENDUDUK_GQL_FIELDS } from 'test/integration/constants/penduduk-gql-fields.constants';
import { createManyOperationFactory } from 'test/integration/graphql/utils/create-many-operation-factory.util';
import { deleteManyOperationFactory } from 'test/integration/graphql/utils/delete-many-operation-factory.util';
import { makeGraphqlAPIRequestWithApiKey } from 'test/integration/graphql/utils/make-graphql-api-request-with-api-key.util';
import { makeGraphqlAPIRequestWithGuestRole } from 'test/integration/graphql/utils/make-graphql-api-request-with-guest-role.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { deleteRecordsByIds } from 'test/integration/utils/delete-records-by-ids';

import { ErrorCode } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import { PermissionsExceptionMessage } from 'src/engine/metadata-modules/permissions/permissions.exception';

describe('deleteManyObjectRecordsPermissions', () => {
  let createdPendudukIds: string[] = [];

  afterEach(async () => {
    if (createdPendudukIds.length > 0) {
      await deleteRecordsByIds('penduduk', createdPendudukIds);
      createdPendudukIds = [];
    }
  });

  it('should throw a permission error when user does not have permission (guest role)', async () => {
    const graphqlOperation = deleteManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        id: {
          in: [randomUUID(), randomUUID()],
        },
      },
    });

    const response = await makeGraphqlAPIRequestWithGuestRole(graphqlOperation);

    expect(response.body.data).toStrictEqual({ deleteDaftarPenduduk: null });
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe(
      PermissionsExceptionMessage.PERMISSION_DENIED,
    );
    expect(response.body.errors[0].extensions.code).toBe(ErrorCode.FORBIDDEN);
  });

  it('should delete multiple object records when user has permission (admin role)', async () => {
    const pendudukId1 = randomUUID();
    const pendudukId2 = randomUUID();

    const createGraphqlOperation = createManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      data: [
        {
          id: pendudukId1,
        },
        {
          id: pendudukId2,
        },
      ],
    });

    await makeGraphqlAPIRequest(createGraphqlOperation);
    createdPendudukIds.push(pendudukId1, pendudukId2);

    const deleteGraphqlOperation = deleteManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        id: {
          in: [pendudukId1, pendudukId2],
        },
      },
    });

    const response = await makeGraphqlAPIRequest(deleteGraphqlOperation);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.deleteDaftarPenduduk).toBeDefined();
    expect(response.body.data.deleteDaftarPenduduk).toHaveLength(2);
    expect(response.body.data.deleteDaftarPenduduk).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: pendudukId1 }),
        expect.objectContaining({ id: pendudukId2 }),
      ]),
    );
  });

  it('should delete multiple object records when executed by api key', async () => {
    const pendudukId1 = randomUUID();
    const pendudukId2 = randomUUID();

    const createGraphqlOperation = createManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      data: [
        {
          id: pendudukId1,
        },
        {
          id: pendudukId2,
        },
      ],
    });

    await makeGraphqlAPIRequest(createGraphqlOperation);
    createdPendudukIds.push(pendudukId1, pendudukId2);

    const deleteGraphqlOperation = deleteManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        id: {
          in: [pendudukId1, pendudukId2],
        },
      },
    });

    const response = await makeGraphqlAPIRequestWithApiKey(
      deleteGraphqlOperation,
    );

    expect(response.body.data).toBeDefined();
    expect(response.body.data.deleteDaftarPenduduk).toBeDefined();
    expect(response.body.data.deleteDaftarPenduduk).toHaveLength(2);
    expect(response.body.data.deleteDaftarPenduduk).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: pendudukId1 }),
        expect.objectContaining({ id: pendudukId2 }),
      ]),
    );
  });
});
