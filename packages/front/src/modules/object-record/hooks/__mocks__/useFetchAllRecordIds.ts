import { type RecordGqlConnectionEdgesRequired } from '@/object-record/graphql/types/RecordGqlConnectionEdgesRequired';
import { gql } from '@apollo/client';

import { getRecordFromRecordNode } from '@/object-record/cache/utils/getRecordFromRecordNode';
import { mockedPendudukRecords } from '~/testing/mock-data/generated/data/penduduk/mock-penduduk-data';
import { generateMockRecordConnection } from '~/testing/utils/generateMockRecordConnection';

export const query = gql`
  query FindManyPenduduks(
    $filter: PendudukFilterInput
    $orderBy: [PendudukOrderByInput]
    $lastCursor: String
    $limit: Int
  ) {
    penduduks(
      filter: $filter
      orderBy: $orderBy
      first: $limit
      after: $lastCursor
    ) {
      edges {
        node {
          __typename
          id
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const mockPageSize = 2;

const flatPendudukRecords = mockedPendudukRecords.map((record) =>
  getRecordFromRecordNode({ recordNode: record }),
);

const baseConnection = generateMockRecordConnection({
  objectNameSingular: 'penduduk',
  records: flatPendudukRecords,
});

export const pendudukMockWithIdsOnly: RecordGqlConnectionEdgesRequired = {
  ...baseConnection,
  edges: baseConnection.edges.map((edge, index) => ({
    ...edge,
    cursor: `cursor-${index}`,
  })),
};

export const firstRequestLastCursor =
  pendudukMockWithIdsOnly.edges[mockPageSize].cursor;
export const secondRequestLastCursor =
  pendudukMockWithIdsOnly.edges[mockPageSize * 2].cursor;
export const thirdRequestLastCursor =
  pendudukMockWithIdsOnly.edges[mockPageSize * 3].cursor;

export const variablesFirstRequest = {
  filter: undefined,
  limit: mockPageSize,
  orderBy: undefined,
};

export const variablesSecondRequest = {
  filter: undefined,
  limit: mockPageSize,
  orderBy: undefined,
  lastCursor: firstRequestLastCursor,
};

export const variablesThirdRequest = {
  filter: undefined,
  limit: mockPageSize,
  orderBy: undefined,
  lastCursor: secondRequestLastCursor,
};

const paginateRequestResponse = (
  response: RecordGqlConnectionEdgesRequired,
  start: number,
  end: number,
  hasNextPage: boolean,
  totalCount: number,
) => {
  return {
    ...response,
    edges: [...response.edges.slice(start, end)],
    pageInfo: {
      ...response.pageInfo,
      startCursor: response.edges[start].cursor,
      endCursor: response.edges[end].cursor,
      hasNextPage,
    } satisfies RecordGqlConnectionEdgesRequired['pageInfo'],
    totalCount,
  };
};

export const responseFirstRequest = {
  penduduks: paginateRequestResponse(
    pendudukMockWithIdsOnly,
    0,
    mockPageSize,
    true,
    6,
  ),
};

export const responseSecondRequest = {
  penduduks: paginateRequestResponse(
    pendudukMockWithIdsOnly,
    mockPageSize,
    mockPageSize * 2,
    true,
    6,
  ),
};

export const responseThirdRequest = {
  penduduks: paginateRequestResponse(
    pendudukMockWithIdsOnly,
    mockPageSize * 2,
    mockPageSize * 3,
    false,
    6,
  ),
};
