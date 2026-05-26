import { randomUUID } from 'node:crypto';

import { PENDUDUK_GQL_FIELDS } from 'test/integration/constants/penduduk-gql-fields.constants';
import { createManyOperationFactory } from 'test/integration/graphql/utils/create-many-operation-factory.util';
import { makeGraphqlAPIRequestWithApiKey } from 'test/integration/graphql/utils/make-graphql-api-request-with-api-key.util';
import { makeGraphqlAPIRequestWithGuestRole } from 'test/integration/graphql/utils/make-graphql-api-request-with-guest-role.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { deleteRecordsByIds } from 'test/integration/utils/delete-records-by-ids';

import { ErrorCode } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import { PermissionsExceptionMessage } from 'src/engine/metadata-modules/permissions/permissions.exception';

describe('createManyObjectRecordsPermissions', () => {
  let createdPendudukIds: string[] = [];

  afterEach(async () => {
    if (createdPendudukIds.length > 0) {
      await deleteRecordsByIds('penduduk', createdPendudukIds);
      createdPendudukIds = [];
    }
  });

  it('should throw a permission error when user does not have permission (guest role)', async () => {
    const graphqlOperation = createManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS,
      data: [
        {
          id: randomUUID(),
        },
        {
          id: randomUUID(),
        },
      ],
    });

    const response = await makeGraphqlAPIRequestWithGuestRole(graphqlOperation);

    expect(response.body.data).toStrictEqual({ createPenduduks: null });
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe(
      PermissionsExceptionMessage.PERMISSION_DENIED,
    );
    expect(response.body.errors[0].extensions.code).toBe(ErrorCode.FORBIDDEN);
  });

  it('should create multiple object records when user has permission (admin role)', async () => {
    const pendudukId1 = randomUUID();
    const pendudukId2 = randomUUID();

    const graphqlOperation = createManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
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

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    createdPendudukIds.push(pendudukId1, pendudukId2);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.createPenduduks).toBeDefined();
    expect(response.body.data.createPenduduks).toHaveLength(2);
    expect([
      response.body.data.createPenduduks[0].id,
      response.body.data.createPenduduks[1].id,
    ]).toContain(pendudukId1);
    expect([
      response.body.data.createPenduduks[0].id,
      response.body.data.createPenduduks[1].id,
    ]).toContain(pendudukId2);
  });

  it('should create multiple object records when executed by api key', async () => {
    const pendudukId1 = randomUUID();
    const pendudukId2 = randomUUID();

    const graphqlOperation = createManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
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

    const response = await makeGraphqlAPIRequestWithApiKey(graphqlOperation);

    createdPendudukIds.push(pendudukId1, pendudukId2);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.createPenduduks).toBeDefined();
    expect(response.body.data.createPenduduks).toHaveLength(2);
    expect(response.body.data.createPenduduks[0].id).toBe(pendudukId1);
    expect(response.body.data.createPenduduks[1].id).toBe(pendudukId2);
  });
});
