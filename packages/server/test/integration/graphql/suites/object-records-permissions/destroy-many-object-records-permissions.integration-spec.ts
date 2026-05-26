import { randomUUID } from 'node:crypto';

import { PENDUDUK_GQL_FIELDS } from 'test/integration/constants/penduduk-gql-fields.constants';
import { createManyOperationFactory } from 'test/integration/graphql/utils/create-many-operation-factory.util';
import { destroyManyOperationFactory } from 'test/integration/graphql/utils/destroy-many-operation-factory.util';
import { makeGraphqlAPIRequestWithGuestRole } from 'test/integration/graphql/utils/make-graphql-api-request-with-guest-role.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';

import { ErrorCode } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import { PermissionsExceptionMessage } from 'src/engine/metadata-modules/permissions/permissions.exception';

describe('destroyManyObjectRecordsPermissions', () => {
  it('should throw a permission error when user does not have permission (guest role)', async () => {
    const graphqlOperation = destroyManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        id: {
          in: [randomUUID(), randomUUID()],
        },
      },
    });

    const response = await makeGraphqlAPIRequestWithGuestRole(graphqlOperation);

    expect(response.body.data).toStrictEqual({ destroyPenduduks: null });
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe(
      PermissionsExceptionMessage.PERMISSION_DENIED,
    );
    expect(response.body.errors[0].extensions.code).toBe(ErrorCode.FORBIDDEN);
  });

  it('should destroy multiple object records when user has permission (admin role)', async () => {
    const pendudukId1 = randomUUID();
    const pendudukId2 = randomUUID();

    const createGraphqlOperation = createManyOperationFactory({
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

    await makeGraphqlAPIRequest(createGraphqlOperation);

    const graphqlOperation = destroyManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        id: {
          in: [pendudukId1, pendudukId2],
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.destroyPenduduks).toBeDefined();
    expect(response.body.data.destroyPenduduks).toHaveLength(2);
    expect(response.body.data.destroyPenduduks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: pendudukId1 }),
        expect.objectContaining({ id: pendudukId2 }),
      ]),
    );
  });
});
