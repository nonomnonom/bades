import { randomUUID } from 'node:crypto';

import { PENDUDUK_GQL_FIELDS } from 'test/integration/constants/penduduk-gql-fields.constants';
import { createOneOperationFactory } from 'test/integration/graphql/utils/create-one-operation-factory.util';
import { deleteOneOperationFactory } from 'test/integration/graphql/utils/delete-one-operation-factory.util';
import { makeGraphqlAPIRequestWithApiKey } from 'test/integration/graphql/utils/make-graphql-api-request-with-api-key.util';
import { makeGraphqlAPIRequestWithGuestRole } from 'test/integration/graphql/utils/make-graphql-api-request-with-guest-role.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';

import { ErrorCode } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import { PermissionsExceptionMessage } from 'src/engine/metadata-modules/permissions/permissions.exception';

describe('deleteOneObjectRecordsPermissions', () => {
  describe('permissions V2 enabled', () => {
    const pendudukId = randomUUID();

    beforeAll(async () => {
      const createOnePendudukRecordOperation = createOneOperationFactory({
        objectMetadataSingularName: 'penduduk',
        gqlFields: PENDUDUK_GQL_FIELDS,
        data: {
          id: pendudukId,
        },
      });

      await makeGraphqlAPIRequest(createOnePendudukRecordOperation);
    });

    it('should throw a permission error when user does not have permission (guest role)', async () => {
      const pendudukId = randomUUID();
      const createGraphqlOperation = createOneOperationFactory({
        objectMetadataSingularName: 'penduduk',
        gqlFields: PENDUDUK_GQL_FIELDS,
        data: {
          id: pendudukId,
        },
      });

      await makeGraphqlAPIRequest(createGraphqlOperation);

      const deleteGraphqlOperation = deleteOneOperationFactory({
        objectMetadataSingularName: 'penduduk',
        gqlFields: PENDUDUK_GQL_FIELDS,
        recordId: pendudukId,
      });

      const response = await makeGraphqlAPIRequestWithGuestRole(
        deleteGraphqlOperation,
      );

      expect(response.body.data).toStrictEqual({ deletePenduduk: null });
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toBe(
        PermissionsExceptionMessage.PERMISSION_DENIED,
      );
      expect(response.body.errors[0].extensions.code).toBe(ErrorCode.FORBIDDEN);
    });

    it('should delete an object record when user has permission (admin role)', async () => {
      const pendudukId = randomUUID();
      const createGraphqlOperation = createOneOperationFactory({
        objectMetadataSingularName: 'penduduk',
        gqlFields: PENDUDUK_GQL_FIELDS,
        data: {
          id: pendudukId,
        },
      });

      await makeGraphqlAPIRequest(createGraphqlOperation);

      const deleteGraphqlOperation = deleteOneOperationFactory({
        objectMetadataSingularName: 'penduduk',
        gqlFields: PENDUDUK_GQL_FIELDS,
        recordId: pendudukId,
      });

      const response = await makeGraphqlAPIRequest(deleteGraphqlOperation);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.deletePenduduk).toBeDefined();
      expect(response.body.data.deletePenduduk.id).toBe(pendudukId);
    });

    it('should delete an object record when executed by api key', async () => {
      const pendudukId = randomUUID();
      const createGraphqlOperation = createOneOperationFactory({
        objectMetadataSingularName: 'penduduk',
        gqlFields: PENDUDUK_GQL_FIELDS,
        data: {
          id: pendudukId,
        },
      });

      await makeGraphqlAPIRequest(createGraphqlOperation);

      const deleteGraphqlOperation = deleteOneOperationFactory({
        objectMetadataSingularName: 'penduduk',
        gqlFields: PENDUDUK_GQL_FIELDS,
        recordId: pendudukId,
      });

      const response = await makeGraphqlAPIRequestWithApiKey(
        deleteGraphqlOperation,
      );

      expect(response.body.data).toBeDefined();
      expect(response.body.data.deletePenduduk).toBeDefined();
      expect(response.body.data.deletePenduduk.id).toBe(pendudukId);
    });
  });
});
