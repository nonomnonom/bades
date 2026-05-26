import { gql } from '@apollo/client';

import { getTimelineThreadsFromKeluargaId } from '@/activities/emails/graphql/queries/getTimelineThreadsFromKeluargaId';

jest.mock('@apollo/client', () => ({
  gql: jest.fn().mockImplementation((strings) => {
    return strings.map((str: string) => str.trim()).join(' ');
  }),
}));

describe('getTimelineThreadsFromKeluargaId query', () => {
  test('should construct the query correctly', () => {
    expect(gql).toHaveBeenCalled();
    expect(getTimelineThreadsFromKeluargaId).toBeDefined();
  });
});
