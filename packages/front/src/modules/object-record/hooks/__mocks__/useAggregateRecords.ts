import { gql } from '@apollo/client';

export const AGGREGATE_QUERY = gql`
  query AggregateProgramBantuans($filter: ProgramBantuanFilterInput) {
    programBantuans(filter: $filter) {
      totalCount
      sumAmount
      avgAmount
    }
  }
`;

export const mockResponse = {
  programBantuans: {
    totalCount: 42,
    sumAmount: 1000000,
    avgAmount: 23800,
  },
};
