import { act, renderHook } from '@testing-library/react';
import { Provider as JotaiProvider } from 'jotai';
import { type ReactNode } from 'react';

import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { jotaiStore } from '@/ui/utilities/state/jotai/jotaiStore';
import { useAtomFamilyStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilyStateValue';
import { useUpsertRecordsInStore } from '@/object-record/record-store/hooks/useUpsertRecordsInStore';

const Wrapper = ({ children }: { children: ReactNode }) => (
  <JotaiProvider store={jotaiStore}>{children}</JotaiProvider>
);

describe('useUpsertRecordsInStore', () => {
  it('should insert a new recordStore when no current recordStore exists', () => {
    const recordId = 'test-record-1';

    const { result } = renderHook(
      () => {
        const recordStore = useAtomFamilyStateValue(
          recordStoreFamilyState,
          recordId,
        );
        const { upsertRecordsInStore } = useUpsertRecordsInStore();

        return { recordStore, upsertRecordsInStore };
      },
      { wrapper: Wrapper },
    );

    expect(result.current.recordStore).toBeNull();

    act(() => {
      result.current.upsertRecordsInStore({
        partialRecords: [
          {
            id: recordId,
            __typename: 'Penduduk',
            name: 'Budi Santoso',
            email: 'budi@bades.id',
          },
        ],
      });
    });

    expect(result.current.recordStore).toEqual({
      id: recordId,
      __typename: 'Penduduk',
      name: 'Budi Santoso',
      email: 'budi@bades.id',
    });
  });

  it('should merge filtered partial recordStore with existing recordStore', () => {
    const recordId = 'test-record-2';

    const { result } = renderHook(
      () => {
        const recordStore = useAtomFamilyStateValue(
          recordStoreFamilyState,
          recordId,
        );
        const { upsertRecordsInStore } = useUpsertRecordsInStore();

        return { recordStore, upsertRecordsInStore };
      },
      { wrapper: Wrapper },
    );

    act(() => {
      result.current.upsertRecordsInStore({
        partialRecords: [
          {
            id: recordId,
            __typename: 'Penduduk',
            name: 'Budi Santoso',
            email: 'budi@bades.id',
          },
        ],
      });
    });

    expect(result.current.recordStore).toEqual({
      id: recordId,
      __typename: 'Penduduk',
      name: 'Budi Santoso',
      email: 'budi@bades.id',
    });

    act(() => {
      result.current.upsertRecordsInStore({
        partialRecords: [
          {
            id: recordId,
            __typename: 'Penduduk',
            name: 'Siti Maryam',
            phone: '123-456-7890',
          },
        ],
        recordGqlFields: {
          id: true,
          name: true,
        },
      });
    });

    expect(result.current.recordStore).toEqual({
      id: recordId,
      __typename: 'Penduduk',
      name: 'Siti Maryam',
      email: 'budi@bades.id',
    });
  });

  it('should not update when filtered values are deeply equal', () => {
    const recordId = 'test-record-3';

    const { result } = renderHook(
      () => {
        const recordStore = useAtomFamilyStateValue(
          recordStoreFamilyState,
          recordId,
        );
        const { upsertRecordsInStore } = useUpsertRecordsInStore();

        return { recordStore, upsertRecordsInStore };
      },
      { wrapper: Wrapper },
    );

    act(() => {
      result.current.upsertRecordsInStore({
        partialRecords: [
          {
            id: recordId,
            __typename: 'Penduduk',
            name: 'Budi Santoso',
            email: 'budi@bades.id',
          },
        ],
      });
    });

    const recordAfterFirstUpsert = result.current.recordStore;

    act(() => {
      result.current.upsertRecordsInStore({
        partialRecords: [
          {
            id: recordId,
            __typename: 'Penduduk',
            name: 'Budi Santoso',
            phone: '123-456-7890',
          },
        ],
        recordGqlFields: {
          id: true,
          name: true,
        },
      });
    });

    expect(result.current.recordStore).toBe(recordAfterFirstUpsert);
  });
});
