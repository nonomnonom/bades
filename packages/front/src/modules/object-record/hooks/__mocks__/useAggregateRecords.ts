import { gql } from '@apollo/client';

export const AGGREGATE_QUERY = gql`
  query AggregateDaftarProgramBantuan($filter: ProgramBantuanFilterInput) {
    daftarProgramBantuan(filter: $filter) {
      totalCount
      sumAmount
      avgAmount
    }
  }
`;

export const mockResponse = {
  daftarProgramBantuan: {
    totalCount: 42,
    sumAmount: 1000000,
    avgAmount: 23800,
  },
};
