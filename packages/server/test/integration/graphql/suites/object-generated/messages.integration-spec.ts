import { MESSAGE_GQL_FIELDS } from 'test/integration/constants/message-gql-fields.constants';
import { findManyOperationFactory } from 'test/integration/graphql/utils/find-many-operation-factory.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';

describe('messagesResolver (e2e)', () => {
  it('should find many messages', async () => {
    const graphqlOperation = findManyOperationFactory({
      objectMetadataSingularName: 'message',
      objectMetadataPluralName: 'messages',
      gqlFields: MESSAGE_GQL_FIELDS,
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    const data = response.body.data.messages;

    expect(data).toBeDefined();
    expect(Array.isArray(data.edges)).toBe(true);
  });
});
