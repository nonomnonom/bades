import { CALENDAR_EVENT_GQL_FIELDS } from 'test/integration/constants/calendar-event-gql-fields.constants';
import { findManyOperationFactory } from 'test/integration/graphql/utils/find-many-operation-factory.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';

describe('calendarEventsResolver (e2e)', () => {
  it('should find many calendarEvents', async () => {
    const graphqlOperation = findManyOperationFactory({
      objectMetadataSingularName: 'calendarEvent',
      objectMetadataPluralName: 'calendarEvents',
      gqlFields: CALENDAR_EVENT_GQL_FIELDS,
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    const data = response.body.data.calendarEvents;

    expect(data).toBeDefined();
    expect(Array.isArray(data.edges)).toBe(true);
  });
});
