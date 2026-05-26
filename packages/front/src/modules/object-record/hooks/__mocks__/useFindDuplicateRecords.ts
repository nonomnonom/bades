import { PENDUDUK_FRAGMENT_WITH_DEPTH_ZERO_RELATIONS } from '@/object-record/hooks/__mocks__/pendudukFragments';
import { gql } from '@apollo/client';
import { mockedPendudukRecords } from '~/testing/mock-data/generated/data/penduduk/mock-penduduk-data';

const pendudukMock = [...mockedPendudukRecords];

export const query = gql`
  query FindDuplicatePenduduk($ids: [UUID!]!) {
    pendudukDuplicates(ids: $ids) {
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

export const variables = {
  ids: ['6205681e-7c11-40b4-9e32-f523dbe54590'],
};

export const responseData = {
  pendudukDuplicates: [
    {
      edges: [
        {
          node: { ...pendudukMock[0], updatedAt: '' },
          cursor: 'cursor1',
        },
        {
          node: { ...pendudukMock[1], updatedAt: '' },
          cursor: 'cursor2',
        },
      ],
      pageInfo: {
        hasNextPage: false,
        startCursor: 'cursor1',
        endCursor: 'cursor2',
      },
    },
  ],
};
