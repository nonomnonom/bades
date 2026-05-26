import { gql } from '@apollo/client';

import { getTimelineThreadsFromPendudukId } from '@/activities/emails/graphql/queries/getTimelineThreadsFromPendudukId';

jest.mock('@apollo/client', () => ({
  gql: jest.fn().mockImplementation((strings) => {
    return strings.map((str: string) => str.trim()).join(' ');
  }),
}));

describe('getTimelineThreadsFromPendudukId query', () => {
  test('should construct the query correctly', () => {
    expect(gql).toHaveBeenCalled();
    expect(getTimelineThreadsFromPendudukId).toBeDefined();
  });
});
