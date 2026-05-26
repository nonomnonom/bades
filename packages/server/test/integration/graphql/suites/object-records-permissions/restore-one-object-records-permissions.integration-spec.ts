import { randomUUID } from 'node:crypto';

import { PENDUDUK_GQL_FIELDS } from 'test/integration/constants/penduduk-gql-fields.constants';
import { createOneOperationFactory } from 'test/integration/graphql/utils/create-one-operation-factory.util';
import { deleteOneOperationFactory } from 'test/integration/graphql/utils/delete-one-operation-factory.util';
import { makeGraphqlAPIRequestWithGuestRole } from 'test/integration/graphql/utils/make-graphql-api-request-with-guest-role.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { restoreOneOperationFactory } from 'test/integration/graphql/utils/restore-one-operation-factory.util';

import { ErrorCode } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import { PermissionsExceptionMessage } from 'src/engine/metadata-modules/permissions/permissions.exception';

describe('restoreOneObjectRecordsPermissions', () => {
  const pendudukId = randomUUID();

  beforeAll(async () => {
    // Buat record penduduk
    const createGraphqlOperation = createOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      data: {
        id: pendudukId,
      },
    });

    await makeGraphqlAPIRequest(createGraphqlOperation);

    // Hapus (soft-delete) record penduduk
    const deleteGraphqlOperation = deleteOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      recordId: pendudukId,
    });

    await makeGraphqlAPIRequest(deleteGraphqlOperation);
  });

  it('should throw a permission error when user does not have permission (guest role)', async () => {
    const graphqlOperation = restoreOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      recordId: pendudukId,
    });

    const response = await makeGraphqlAPIRequestWithGuestRole(graphqlOperation);

    expect(response.body.data).toStrictEqual({ restorePenduduk: null });
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe(
      PermissionsExceptionMessage.PERMISSION_DENIED,
    );
    expect(response.body.errors[0].extensions.code).toBe(ErrorCode.FORBIDDEN);
  });

  it('should restore an object record when user has permission (admin role)', async () => {
    const graphqlOperation = restoreOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      recordId: pendudukId,
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.restorePenduduk).toBeDefined();
    expect(response.body.data.restorePenduduk.id).toBe(pendudukId);
  });
});
