import { randomUUID } from 'node:crypto';

import { PENDUDUK_GQL_FIELDS } from 'test/integration/constants/penduduk-gql-fields.constants';
import { createOneOperationFactory } from 'test/integration/graphql/utils/create-one-operation-factory.util';
import { findOneOperationFactory } from 'test/integration/graphql/utils/find-one-operation-factory.util';
import { makeGraphqlAPIRequestWithApiKey } from 'test/integration/graphql/utils/make-graphql-api-request-with-api-key.util';
import { makeGraphqlAPIRequestWithGuestRole } from 'test/integration/graphql/utils/make-graphql-api-request-with-guest-role.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { updateOneOperationFactory } from 'test/integration/graphql/utils/update-one-operation-factory.util';

import { ErrorCode } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import { PermissionsExceptionMessage } from 'src/engine/metadata-modules/permissions/permissions.exception';

describe('updateOneObjectRecordsPermissions', () => {
  const testPendudukId = randomUUID();
  let messageId: string;
  let originalMessageText: string;

  beforeAll(async () => {
    // Buat record penduduk untuk dipakai dalam test update
    const createPendudukOperation = createOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      data: {
        id: testPendudukId,
        tempatLahir: 'Surabaya',
      },
    });

    await makeGraphqlAPIRequest(createPendudukOperation);

    const findAllMessagesOperation = findOneOperationFactory({
      objectMetadataSingularName: 'message',
      gqlFields: `
        id
        text
      `,
      filter: {
        subject: {
          eq: 'Meeting Request',
        },
      },
    });

    const findAllMessagesResponse = await makeGraphqlAPIRequest(
      findAllMessagesOperation,
    );

    messageId = findAllMessagesResponse.body.data.message.id;
    originalMessageText = findAllMessagesResponse.body.data.message.text;
  });

  afterAll(async () => {
    const updateMessageOperation = updateOneOperationFactory({
      objectMetadataSingularName: 'message',
      gqlFields: 'id',
      recordId: messageId,
      data: {
        text: originalMessageText,
      },
    });

    await makeGraphqlAPIRequest(updateMessageOperation);
  });

  it('harus melempar error permission saat user tidak punya izin (guest role)', async () => {
    const graphqlOperation = updateOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      recordId: testPendudukId,
      data: {
        tempatLahir: 'Bandung',
      },
    });

    const response = await makeGraphqlAPIRequestWithGuestRole(graphqlOperation);

    expect(response.body.data).toStrictEqual({ updatePenduduk: null });
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe(
      PermissionsExceptionMessage.PERMISSION_DENIED,
    );
    expect(response.body.errors[0].extensions.code).toBe(ErrorCode.FORBIDDEN);
  });

  it('harus mengizinkan update object system record meski tanpa izin update (guest role)', async () => {
    const graphqlOperation = updateOneOperationFactory({
      objectMetadataSingularName: 'message',
      gqlFields: `
          id
          text
        `,
      recordId: messageId,
      data: {
        text: 'Baik, terima kasih!',
      },
    });

    const response = await makeGraphqlAPIRequestWithGuestRole(graphqlOperation);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.updateMessage).toBeDefined();
    expect(response.body.data.updateMessage.id).toBe(messageId);
    expect(response.body.data.updateMessage.text).toBe('Baik, terima kasih!');
  });

  it('harus berhasil update record saat user punya izin (admin role)', async () => {
    const graphqlOperation = updateOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      recordId: testPendudukId,
      data: {
        tempatLahir: 'Yogyakarta',
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.updatePenduduk).toBeDefined();
    expect(response.body.data.updatePenduduk.id).toBe(testPendudukId);
    expect(response.body.data.updatePenduduk.tempatLahir).toBe('Yogyakarta');
  });

  it('harus berhasil update record saat dieksekusi via API key', async () => {
    const graphqlOperation = updateOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      recordId: testPendudukId,
      data: {
        tempatLahir: 'Medan',
      },
    });

    const response = await makeGraphqlAPIRequestWithApiKey(graphqlOperation);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.updatePenduduk).toBeDefined();
    expect(response.body.data.updatePenduduk.id).toBe(testPendudukId);
    expect(response.body.data.updatePenduduk.tempatLahir).toBe('Medan');
  });
});
