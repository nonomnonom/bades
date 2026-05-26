import { renderHook } from '@testing-library/react';
import { act } from 'react';
import gql from 'graphql-tag';

import { spreadsheetImportDialogState } from '@/spreadsheet-import/states/spreadsheetImportDialogState';
import { useOpenObjectRecordsSpreadsheetImportDialog } from '@/object-record/spreadsheet-import/hooks/useOpenObjectRecordsSpreadsheetImportDialog';
import { jotaiStore } from '@/ui/utilities/state/jotai/jotaiStore';
import { getJestMetadataAndApolloMocksWrapper } from '~/testing/jest/getJestMetadataAndApolloMocksWrapper';

const KELUARGA_ID = 'cb2e9f4b-20c3-4759-9315-4ffeecfaf71a';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'cb2e9f4b-20c3-4759-9315-4ffeecfaf71a'),
}));

const mockBatchCreateManyRecords = jest.fn().mockResolvedValue([]);

jest.mock('@/object-record/hooks/useBatchCreateManyRecords', () => ({
  useBatchCreateManyRecords: () => ({
    batchCreateManyRecords: mockBatchCreateManyRecords,
  }),
}));

const mockResult = jest.fn(() => ({
  data: {
    createDaftarKeluarga: [
      {
        id: KELUARGA_ID,
        name: 'Keluarga Contoh',
        __typename: 'Keluarga',
      },
    ],
  },
}));

const keluargaMocks = [
  {
    request: {
      query: gql`
        mutation CreateDaftarKeluarga(
          $data: [KeluargaCreateInput!]!
          $upsert: Boolean
        ) {
          createDaftarKeluarga(data: $data, upsert: $upsert) {
            id
            name
            __typename
          }
        }
      `,
    },
    variableMatcher: () => true,
    result: mockResult,
  },
];

const fakeCsv = () => {
  const csvContent = 'name\nKeluarga Contoh';
  const blob = new Blob([csvContent], { type: 'text/csv' });
  return new File([blob], 'fakeData.csv', { type: 'text/csv' });
};

const Wrapper = getJestMetadataAndApolloMocksWrapper({
  apolloMocks: keluargaMocks,
});

describe('useOpenObjectRecordsSpreadsheetImportDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should open dialog and configure onSubmit function correctly', async () => {
    const { result } = renderHook(
      () => {
        const { openObjectRecordsSpreadsheetImportDialog } =
          useOpenObjectRecordsSpreadsheetImportDialog(
            'keluarga',
          );
        return {
          openObjectRecordsSpreadsheetImportDialog,
        };
      },
      { wrapper: Wrapper },
    );

    const spreadsheetImportDialog = jotaiStore.get(
      spreadsheetImportDialogState.atom,
    );

    expect(spreadsheetImportDialog.isOpen).toBe(false);
    expect(spreadsheetImportDialog.options).toBeNull();

    await act(async () => {
      result.current.openObjectRecordsSpreadsheetImportDialog();
    });

    const dialogAfterOpen = jotaiStore.get(spreadsheetImportDialogState.atom);

    expect(dialogAfterOpen.isOpen).toBe(true);
    expect(dialogAfterOpen.options).toHaveProperty('onSubmit');
    expect(dialogAfterOpen.options?.onSubmit).toBeInstanceOf(Function);
    expect(dialogAfterOpen.options).toHaveProperty('spreadsheetImportFields');
    expect(
      Array.isArray(dialogAfterOpen.options?.spreadsheetImportFields),
    ).toBe(true);
  });

  it('should call batchCreateManyRecords when onSubmit is executed', async () => {
    const { result } = renderHook(
      () => {
        const { openObjectRecordsSpreadsheetImportDialog } =
          useOpenObjectRecordsSpreadsheetImportDialog(
            'keluarga',
          );
        return {
          openObjectRecordsSpreadsheetImportDialog,
        };
      },
      { wrapper: Wrapper },
    );

    await act(async () => {
      result.current.openObjectRecordsSpreadsheetImportDialog();
    });

    const spreadsheetImportDialog = jotaiStore.get(
      spreadsheetImportDialogState.atom,
    );

    const submitData = {
      validStructuredRows: [
        {
          id: KELUARGA_ID,
          name: 'Keluarga Contoh',
        },
      ],
      invalidStructuredRows: [],
      allStructuredRows: [
        {
          id: KELUARGA_ID,
          name: 'Keluarga Contoh',
          __index: 'cbc3985f-dde9-46d1-bae2-c124141700ac',
        },
      ],
    };

    await act(async () => {
      await spreadsheetImportDialog.options?.onSubmit(submitData, fakeCsv());
    });

    expect(mockBatchCreateManyRecords).toHaveBeenCalledTimes(1);

    const callArgs = mockBatchCreateManyRecords.mock.calls[0][0];
    expect(callArgs).toHaveProperty('recordsToCreate');
    expect(callArgs).toHaveProperty('upsert', true);
    expect(Array.isArray(callArgs.recordsToCreate)).toBe(true);
    expect(callArgs.recordsToCreate).toHaveLength(1);

    const recordToCreate = callArgs.recordsToCreate[0];
    expect(recordToCreate).toHaveProperty('name', 'Keluarga Contoh');
  });
});
