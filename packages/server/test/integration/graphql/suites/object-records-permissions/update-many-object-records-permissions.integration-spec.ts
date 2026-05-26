import { randomUUID } from 'node:crypto';

import { PENDUDUK_GQL_FIELDS } from 'test/integration/constants/penduduk-gql-fields.constants';
import { createManyOperationFactory } from 'test/integration/graphql/utils/create-many-operation-factory.util';
import { makeGraphqlAPIRequestWithApiKey } from 'test/integration/graphql/utils/make-graphql-api-request-with-api-key.util';
import { makeGraphqlAPIRequestWithGuestRole } from 'test/integration/graphql/utils/make-graphql-api-request-with-guest-role.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { updateManyOperationFactory } from 'test/integration/graphql/utils/update-many-operation-factory.util';
import { deleteRecordsByIds } from 'test/integration/utils/delete-records-by-ids';

import { ErrorCode } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import { PermissionsExceptionMessage } from 'src/engine/metadata-modules/permissions/permissions.exception';

describe('updateManyObjectRecordsPermissions', () => {
  let createdPendudukIds: string[] = [];

  afterEach(async () => {
    if (createdPendudukIds.length > 0) {
      await deleteRecordsByIds('penduduk', createdPendudukIds);
      createdPendudukIds = [];
    }
  });

  it('should throw a permission error when user does not have permission (guest role)', async () => {
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
    createdPendudukIds.push(pendudukId1, pendudukId2);

    const updateGraphqlOperation = updateManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        id: {
          in: [pendudukId1, pendudukId2],
        },
      },
      data: {
        tempatLahir: 'Bandung',
      },
    });

    const response = await makeGraphqlAPIRequestWithGuestRole(
      updateGraphqlOperation,
    );

    expect(response.body.data).toStrictEqual({ updatePenduduks: null });
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe(
      PermissionsExceptionMessage.PERMISSION_DENIED,
    );
    expect(response.body.errors[0].extensions.code).toBe(ErrorCode.FORBIDDEN);
  });

  it('should update multiple object records when user has permission (admin role)', async () => {
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
    createdPendudukIds.push(pendudukId1, pendudukId2);

    const updateGraphqlOperation = updateManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        id: {
          in: [pendudukId1, pendudukId2],
        },
      },
      data: {
        tempatLahir: 'Surabaya',
      },
    });

    const response = await makeGraphqlAPIRequest(updateGraphqlOperation);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.updatePenduduks).toBeDefined();
    expect(response.body.data.updatePenduduks).toHaveLength(2);
    expect(response.body.data.updatePenduduks[0].id).toBe(pendudukId1);
    expect(response.body.data.updatePenduduks[1].id).toBe(pendudukId2);
    expect(response.body.data.updatePenduduks[0].tempatLahir).toBe('Surabaya');
    expect(response.body.data.updatePenduduks[1].tempatLahir).toBe('Surabaya');
  });

  it('should update multiple object records when executed by api key', async () => {
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
    createdPendudukIds.push(pendudukId1, pendudukId2);

    const updateGraphqlOperation = updateManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        id: {
          in: [pendudukId1, pendudukId2],
        },
      },
      data: {
        tempatLahir: 'Yogyakarta',
      },
    });

    const response = await makeGraphqlAPIRequestWithApiKey(
      updateGraphqlOperation,
    );

    expect(response.body.data).toBeDefined();
    expect(response.body.data.updatePenduduks).toBeDefined();
    expect(response.body.data.updatePenduduks).toHaveLength(2);
    expect(response.body.data.updatePenduduks[0].id).toBe(pendudukId1);
    expect(response.body.data.updatePenduduks[1].id).toBe(pendudukId2);
    expect(response.body.data.updatePenduduks[0].tempatLahir).toBe(
      'Yogyakarta',
    );
    expect(response.body.data.updatePenduduks[1].tempatLahir).toBe(
      'Yogyakarta',
    );
  });
});
