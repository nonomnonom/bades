import { renderHook } from '@testing-library/react';
import { print } from 'graphql';

import { useUpdateManyRecordsMutation } from '@/object-record/hooks/useUpdateManyRecordsMutation';
import { getJestMetadataAndApolloMocksWrapper } from '~/testing/jest/getJestMetadataAndApolloMocksWrapper';

const expectedQueryTemplate = `
  mutation UpdateManyDaftarPenduduk($filter: PendudukFilterInput!, $data: PendudukUpdateInput!) {
    updateDaftarPenduduk(filter: $filter, data: $data) {
      id
    }
  }
`.replace(/\s/g, '');

const Wrapper = getJestMetadataAndApolloMocksWrapper({
  apolloMocks: [],
});

describe('useUpdateManyRecordsMutation', () => {
  it('should return a valid updateManyRecordsMutation', () => {
    const objectNameSingular = 'penduduk';

    const { result } = renderHook(
      () =>
        useUpdateManyRecordsMutation({
          objectNameSingular,
        }),
      {
        wrapper: Wrapper,
      },
    );

    const { updateManyRecordsMutation } = result.current;

    expect(updateManyRecordsMutation).toBeDefined();

    const printedReceivedQuery = print(updateManyRecordsMutation).replace(
      /\s/g,
      '',
    );

    expect(printedReceivedQuery).toEqual(expectedQueryTemplate);
  });
});
