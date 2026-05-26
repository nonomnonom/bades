import { gql } from '@apollo/client';
import { renderHook, waitFor } from '@testing-library/react';

import { type RecordGqlFields } from '@/object-record/graphql/record-gql-fields/types/RecordGqlFields';
import { setTestObjectMetadataItemsInMetadataStore } from '~/testing/utils/setTestObjectMetadataItemsInMetadataStore';
import { type RecordGqlOperationSignature } from 'shared/types';
import { useCombinedFindManyRecords } from '@/object-record/multiple-objects/hooks/useCombinedFindManyRecords';
import { useGenerateCombinedFindManyRecordsQuery } from '@/object-record/multiple-objects/hooks/useGenerateCombinedFindManyRecordsQuery';
import { jotaiStore } from '@/ui/utilities/state/jotai/jotaiStore';
import { getJestMetadataAndApolloMocksWrapper } from '~/testing/jest/getJestMetadataAndApolloMocksWrapper';
import { getTestEnrichedObjectMetadataItemsMock } from '~/testing/utils/getTestEnrichedObjectMetadataItemsMock';

jest.mock(
  '@/object-record/multiple-objects/hooks/useGenerateCombinedFindManyRecordsQuery',
  () => ({
    useGenerateCombinedFindManyRecordsQuery: jest.fn(),
  }),
);

const mockQuery = gql`
  query CombinedFindManyRecords(
    $filterPenduduk: PendudukFilterInput
    $filterKeluarga: KeluargaFilterInput
    $orderByPenduduk: [PendudukOrderByInput]
    $orderByKeluarga: [KeluargaOrderByInput]
    $firstPenduduk: Int
    $lastPenduduk: Int
    $afterPenduduk: String
    $beforePenduduk: String
    $firstKeluarga: Int
    $lastKeluarga: Int
    $afterKeluarga: String
    $beforeKeluarga: String
    $limitPenduduk: Int
    $limitKeluarga: Int
  ) {
    daftarPenduduk(
      filter: $filterPenduduk
      orderBy: $orderByPenduduk
      first: $firstPenduduk
      after: $afterPenduduk
      last: $lastPenduduk
      before: $beforePenduduk
      limit: $limitPenduduk
    ) {
      edges {
        node {
          __typename
          id
          name {
            firstName
            lastName
          }
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
    daftarKeluarga(
      filter: $filterKeluarga
      orderBy: $orderByKeluarga
      first: $firstKeluarga
      after: $afterKeluarga
      last: $lastKeluarga
      before: $beforeKeluarga
      limit: $limitKeluarga
    ) {
      edges {
        node {
          __typename
          id
          name
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

type RenderUseCombinedFindManyRecordsHookParams = {
  operationSignatures: RecordGqlOperationSignature[];
  mockVariables?: Record<string, any>;
  mockResponseData?: Record<string, any>;
  skip?: boolean;
  expectedResult?: Record<string, any>;
  mockQueryResult?: any;
};

const renderUseCombinedFindManyRecordsHook = async ({
  operationSignatures,
  mockVariables = {},
  mockResponseData,
  skip = false,
  expectedResult = {},
  mockQueryResult = mockQuery,
}: RenderUseCombinedFindManyRecordsHookParams) => {
  (useGenerateCombinedFindManyRecordsQuery as jest.Mock).mockReturnValue(
    mockQueryResult,
  );

  const mocks = [
    {
      request: {
        query: mockQuery,
        variables: mockVariables,
      },
      result: {
        data: mockResponseData,
      },
    },
  ];

  setTestObjectMetadataItemsInMetadataStore(
    jotaiStore,
    getTestEnrichedObjectMetadataItemsMock(),
  );

  const { result } = renderHook(
    () =>
      useCombinedFindManyRecords({
        operationSignatures,
        skip,
      }),
    {
      wrapper: getJestMetadataAndApolloMocksWrapper({ apolloMocks: mocks }),
    },
  );

  expect(result.current.loading).toBe(!skip);
  expect(result.current.result).toEqual({});

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.result).toEqual(expectedResult);

  return result;
};

describe('useCombinedFindManyRecords', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return records for multiple objects', async () => {
    const mockResponseData = {
      daftarPenduduk: {
        edges: [
          {
            node: {
              __typename: 'Penduduk',
              id: '1',
              name: {
                firstName: 'Budi',
                lastName: 'Saputra',
              },
            },
            cursor: 'cursor1',
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: 'cursor1',
          endCursor: 'cursor1',
        },
        totalCount: 1,
      },
      daftarKeluarga: {
        edges: [
          {
            node: {
              __typename: 'Keluarga',
              id: '1',
              name: 'Bades',
            },
            cursor: 'cursor1',
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: 'cursor1',
          endCursor: 'cursor1',
        },
        totalCount: 1,
      },
    };

    await renderUseCombinedFindManyRecordsHook({
      operationSignatures: [
        {
          objectNameSingular: 'penduduk',
          fields: {
            id: true,
            name: {
              firstName: true,
              lastName: true,
            },
          } satisfies RecordGqlFields,
          variables: {},
        },
        {
          objectNameSingular: 'keluarga',
          fields: {
            id: true,
            name: true,
          } satisfies RecordGqlFields,
          variables: {},
        },
      ],
      mockResponseData,
      expectedResult: {
        daftarPenduduk: [
          {
            __typename: 'Penduduk',
            id: '1',
            name: {
              firstName: 'Budi',
              lastName: 'Saputra',
            },
          },
        ],
        daftarKeluarga: [
          {
            __typename: 'Keluarga',
            id: '1',
            name: 'Bades',
          },
        ],
      },
    });
  });

  it('should handle forward pagination with after cursor and first limit', async () => {
    const mockResponseData = {
      daftarPenduduk: {
        edges: [
          {
            node: {
              __typename: 'Penduduk',
              id: '1',
              name: {
                firstName: 'Budi',
                lastName: 'Saputra',
              },
            },
            cursor: 'cursor1',
          },
        ],
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: true,
          startCursor: 'cursor1',
          endCursor: 'cursor1',
        },
        totalCount: 10,
      },
    };

    await renderUseCombinedFindManyRecordsHook({
      operationSignatures: [
        {
          objectNameSingular: 'penduduk',
          fields: {
            id: true,
            name: {
              firstName: true,
              lastName: true,
            },
          } satisfies RecordGqlFields,
          variables: {
            limit: 1,
            cursorFilter: {
              cursor: 'previousCursor',
              cursorDirection: 'after',
            },
          },
        },
      ],
      mockVariables: {
        firstPenduduk: 1,
        afterPenduduk: 'previousCursor',
      },
      mockResponseData,
      expectedResult: {
        daftarPenduduk: [
          {
            __typename: 'Penduduk',
            id: '1',
            name: {
              firstName: 'Budi',
              lastName: 'Saputra',
            },
          },
        ],
      },
    });
  });

  it('should handle backward pagination with before cursor and last limit', async () => {
    const mockResponseData = {
      daftarPenduduk: {
        edges: [
          {
            node: {
              __typename: 'Penduduk',
              id: '2',
              name: {
                firstName: 'Siti',
                lastName: 'Santoso',
              },
            },
            cursor: 'cursor2',
          },
        ],
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: true,
          startCursor: 'cursor2',
          endCursor: 'cursor2',
        },
        totalCount: 10,
      },
    };

    await renderUseCombinedFindManyRecordsHook({
      operationSignatures: [
        {
          objectNameSingular: 'penduduk',
          fields: {
            id: true,
            name: {
              firstName: true,
              lastName: true,
            },
          } satisfies RecordGqlFields,
          variables: {
            limit: 1,
            cursorFilter: {
              cursor: 'nextCursor',
              cursorDirection: 'before',
            },
          },
        },
      ],
      mockVariables: {
        lastPenduduk: 1,
        beforePenduduk: 'nextCursor',
      },
      mockResponseData,
      expectedResult: {
        daftarPenduduk: [
          {
            __typename: 'Penduduk',
            id: '2',
            name: {
              firstName: 'Siti',
              lastName: 'Santoso',
            },
          },
        ],
      },
    });
  });

  it('should handle limit-based pagination without cursor', async () => {
    const mockResponseData = {
      daftarPenduduk: {
        edges: [
          {
            node: {
              __typename: 'Penduduk',
              id: '3',
              name: {
                firstName: 'Aisyah',
                lastName: 'Jaya',
              },
            },
            cursor: 'cursor3',
          },
        ],
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
          startCursor: 'cursor3',
          endCursor: 'cursor3',
        },
        totalCount: 10,
      },
    };

    await renderUseCombinedFindManyRecordsHook({
      operationSignatures: [
        {
          objectNameSingular: 'penduduk',
          fields: {
            id: true,
            name: {
              firstName: true,
              lastName: true,
            },
          } satisfies RecordGqlFields,
          variables: {
            limit: 1,
          },
        },
      ],
      mockVariables: {
        limitPenduduk: 1,
      },
      mockResponseData,
      expectedResult: {
        daftarPenduduk: [
          {
            __typename: 'Penduduk',
            id: '3',
            name: {
              firstName: 'Aisyah',
              lastName: 'Jaya',
            },
          },
        ],
      },
    });
  });

  it('should handle multiple objects with different pagination strategies', async () => {
    const mockResponseData = {
      daftarPenduduk: {
        edges: [
          {
            node: {
              __typename: 'Penduduk',
              id: '1',
              name: {
                firstName: 'Budi',
                lastName: 'Saputra',
              },
            },
            cursor: 'cursor1',
          },
        ],
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
          startCursor: 'cursor1',
          endCursor: 'cursor1',
        },
        totalCount: 10,
      },
      daftarKeluarga: {
        edges: [
          {
            node: {
              __typename: 'Keluarga',
              id: '1',
              name: 'Bades',
            },
            cursor: 'cursor1',
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: 'cursor1',
          endCursor: 'cursor1',
        },
        totalCount: 1,
      },
    };

    await renderUseCombinedFindManyRecordsHook({
      operationSignatures: [
        {
          objectNameSingular: 'penduduk',
          fields: {
            id: true,
            name: {
              firstName: true,
              lastName: true,
            },
          } satisfies RecordGqlFields,
          variables: {
            limit: 1,
            cursorFilter: {
              cursor: 'previousCursor',
              cursorDirection: 'after',
            },
          },
        },
        {
          objectNameSingular: 'keluarga',
          fields: {
            id: true,
            name: true,
          } satisfies RecordGqlFields,
          variables: {
            limit: 1,
          },
        },
      ],
      mockVariables: {
        firstPenduduk: 1,
        afterPenduduk: 'previousCursor',
        limitKeluarga: 1,
      },
      mockResponseData,
      expectedResult: {
        daftarPenduduk: [
          {
            __typename: 'Penduduk',
            id: '1',
            name: {
              firstName: 'Budi',
              lastName: 'Saputra',
            },
          },
        ],
        daftarKeluarga: [
          {
            __typename: 'Keluarga',
            id: '1',
            name: 'Bades',
          },
        ],
      },
    });
  });

  it('should handle empty operation signatures', async () => {
    await renderUseCombinedFindManyRecordsHook({
      operationSignatures: [],
      mockResponseData: {},
      expectedResult: {},
    });
  });

  it('should handle skip flag', async () => {
    await renderUseCombinedFindManyRecordsHook({
      operationSignatures: [
        {
          objectNameSingular: 'penduduk',
          fields: {
            id: true,
          } satisfies RecordGqlFields,
          variables: {},
        },
      ],
      skip: true,
      mockResponseData: {},
      expectedResult: {},
    });
  });
});
