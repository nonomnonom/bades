import { renderHook, waitFor } from '@testing-library/react';
import { type ReactNode } from 'react';

import { RecordComponentInstanceContextsWrapper } from '@/object-record/components/RecordComponentInstanceContextsWrapper';
import { RecordGroupContext } from '@/object-record/record-group/states/context/RecordGroupContext';
import { useRecordIndexTableQuery } from '@/object-record/record-index/hooks/useRecordIndexTableQuery';
import { RecordTableComponentInstance } from '@/object-record/record-table/components/RecordTableComponentInstance';

import { RecordTableContextProvider } from '@/object-record/record-table/components/RecordTableContextProvider';
import { ViewComponentInstanceContext } from '@/views/states/contexts/ViewComponentInstanceContext';
import { type MockedResponse } from '@apollo/client/testing';
import gql from 'graphql-tag';
import { QUERY_DEFAULT_LIMIT_RECORDS } from 'shared/constants';
import { getRecordFromRecordNode } from '@/object-record/cache/utils/getRecordFromRecordNode';
import { getJestMetadataAndApolloMocksWrapper } from '~/testing/jest/getJestMetadataAndApolloMocksWrapper';
import { JestRecordIndexContextProviderWrapper } from '~/testing/jest/JestRecordIndexContextProviderWrapper';
import { mockedPendudukRecords } from '~/testing/mock-data/generated/data/penduduk/mock-penduduk-data';
import { generateMockRecordConnection } from '~/testing/utils/generateMockRecordConnection';
import { getMockObjectMetadataItemOrThrow } from '~/testing/utils/getMockObjectMetadataItemOrThrow';

const recordTableId = 'daftarPenduduk';
const objectNameSingular = 'penduduk';
const mockPendudukObjectMetadataItem =
  getMockObjectMetadataItemOrThrow('penduduk');

const flatPendudukRecords = mockedPendudukRecords.map((record) =>
  getRecordFromRecordNode({ recordNode: record }),
);

const ObjectNamePluralSetter = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

const mocks: MockedResponse[] = [
  {
    request: {
      query: gql`
        query FindManyDaftarPenduduk(
          $filter: PendudukFilterInput
          $orderBy: [PendudukOrderByInput]
          $lastCursor: String
          $limit: Int
          $offset: Int
        ) {
          daftarPenduduk(
            filter: $filter
            orderBy: $orderBy
            first: $limit
            after: $lastCursor
            offset: $offset
          ) {
            edges {
              node {
                __typename
                createdAt
                deletedAt
                id
                name {
                  firstName
                  lastName
                }
                noteTargets {
                  edges {
                    node {
                      __typename
                      id
                      note {
                        __typename
                        id
                        title
                      }
                    }
                  }
                }
                position
                taskTargets {
                  edges {
                    node {
                      __typename
                      id
                      task {
                        __typename
                        id
                        title
                      }
                    }
                  }
                }
                updatedAt
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
      `,
      variables: {
        filter: {},
        orderBy: [{ position: 'AscNullsFirst' }],
        limit: QUERY_DEFAULT_LIMIT_RECORDS,
      },
    },
    result: jest.fn(() => ({
      data: {
        daftarPenduduk: generateMockRecordConnection({
          objectNameSingular: 'penduduk',
          records: flatPendudukRecords,
        }),
      },
    })),
  },
];

const HookMockWrapper = getJestMetadataAndApolloMocksWrapper({
  apolloMocks: mocks,
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'default',
  }),
}));

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <HookMockWrapper>
      <ViewComponentInstanceContext.Provider
        value={{ instanceId: 'instanceId' }}
      >
        <RecordComponentInstanceContextsWrapper
          componentInstanceId={recordTableId}
        >
          <JestRecordIndexContextProviderWrapper
            objectMetadataItem={mockPendudukObjectMetadataItem}
          >
            <RecordTableContextProvider
              objectNameSingular={objectNameSingular}
              recordTableId={recordTableId}
              viewBarId="instanceId"
            >
              <ObjectNamePluralSetter>
                <RecordTableComponentInstance recordTableId={recordTableId}>
                  <RecordGroupContext.Provider
                    value={{ recordGroupId: 'default' }}
                  >
                    {children}
                  </RecordGroupContext.Provider>
                </RecordTableComponentInstance>
              </ObjectNamePluralSetter>
            </RecordTableContextProvider>
          </JestRecordIndexContextProviderWrapper>
        </RecordComponentInstanceContextsWrapper>
      </ViewComponentInstanceContext.Provider>
    </HookMockWrapper>
  );
};

describe('useRecordIndexTableQuery', () => {
  it('should fetch', async () => {
    const { result } = renderHook(
      () => {
        const { records } = useRecordIndexTableQuery(objectNameSingular);

        return {
          records,
        };
      },
      {
        wrapper: Wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.records).toHaveLength(flatPendudukRecords.length);
    });
  });
});
