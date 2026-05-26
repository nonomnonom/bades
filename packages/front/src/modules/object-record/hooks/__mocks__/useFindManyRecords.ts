import { gql } from '@apollo/client';

import { PENDUDUK_FRAGMENT_WITH_DEPTH_ZERO_RELATIONS } from '@/object-record/hooks/__mocks__/pendudukFragments';

export const query = gql`
  query FindManyDaftarPenduduk(
    $filter: PendudukFilterInput
    $orderBy: PendudukOrderByInput
    $lastCursor: String
    $limit: Int
  ) {
    daftarPenduduk(
      filter: $filter
      orderBy: $orderBy
      first: $limit
      after: $lastCursor
    ) {
      edges {
        node {
          ${PENDUDUK_FRAGMENT_WITH_DEPTH_ZERO_RELATIONS}
        }
        cursor
      }
      pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;

export const variables = { limit: 60, filter: undefined, orderBy: undefined };

export const responseData = {
  id: '',
};
