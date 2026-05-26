import { randomUUID } from 'node:crypto';

import { PENDUDUK_GQL_FIELDS } from 'test/integration/constants/penduduk-gql-fields.constants';
import { createManyOperationFactory } from 'test/integration/graphql/utils/create-many-operation-factory.util';
import { deleteManyOperationFactory } from 'test/integration/graphql/utils/delete-many-operation-factory.util';
import { makeGraphqlAPIRequestWithGuestRole } from 'test/integration/graphql/utils/make-graphql-api-request-with-guest-role.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { restoreManyOperationFactory } from 'test/integration/graphql/utils/restore-many-operation-factory.util';

import { ErrorCode } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import { PermissionsExceptionMessage } from 'src/engine/metadata-modules/permissions/permissions.exception';

describe('restoreManyObjectRecordsPermissions', () => {
  const pendudukId1 = randomUUID();
  const pendudukId2 = randomUUID();

  beforeAll(async () => {
    // Buat record penduduk
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

    // Hapus (soft-delete) record penduduk
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

    await makeGraphqlAPIRequest(deleteGraphqlOperation);
  });

  it('should throw a permission error when user does not have permission (guest role)', async () => {
    const graphqlOperation = restoreManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        id: {
          in: [pendudukId1, pendudukId2],
        },
      },
    });

    const response = await makeGraphqlAPIRequestWithGuestRole(graphqlOperation);

    expect(response.body.data).toStrictEqual({ restoreDaftarPenduduk: null });
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe(
      PermissionsExceptionMessage.PERMISSION_DENIED,
    );
    expect(response.body.errors[0].extensions.code).toBe(ErrorCode.FORBIDDEN);
  });

  it('should restore multiple object records when user has permission (admin role)', async () => {
    const graphqlOperation = restoreManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        id: {
          in: [pendudukId1, pendudukId2],
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.restoreDaftarPenduduk).toBeDefined();
    expect(response.body.data.restoreDaftarPenduduk).toHaveLength(2);
    expect(
      response.body.data.restoreDaftarPenduduk.map((penduduk: { id: string }) => penduduk.id),
    ).toEqual(expect.arrayContaining([pendudukId1, pendudukId2]));
  });
});
