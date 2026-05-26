import { renderHook } from '@testing-library/react';

import { useResolveDefaultEmailRecipient } from '@/activities/emails/hooks/useResolveDefaultEmailRecipient';
import { CoreObjectNameSingular } from 'shared/types';

const mockUseFindOneRecord = jest.fn();
const mockUseFindManyRecords = jest.fn();

jest.mock('@/object-record/hooks/useFindOneRecord', () => ({
  useFindOneRecord: (args: unknown) => mockUseFindOneRecord(args),
}));

jest.mock('@/object-record/hooks/useFindManyRecords', () => ({
  useFindManyRecords: (args: unknown) => mockUseFindManyRecords(args),
}));

describe('useResolveDefaultEmailRecipient', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseFindOneRecord.mockReturnValue({
      record: null,
      loading: false,
    });
    mockUseFindManyRecords.mockReturnValue({
      records: [],
      loading: false,
    });
  });

  it('should return the penduduk primary email for a Penduduk record', () => {
    mockUseFindOneRecord.mockImplementation(
      (args: { objectNameSingular: string }) => {
        if (args.objectNameSingular === 'penduduk') {
          return {
            record: { emails: { primaryEmail: 'penduduk@example.com' } },
            loading: false,
          };
        }

        return { record: null, loading: false };
      },
    );

    const { result } = renderHook(() =>
      useResolveDefaultEmailRecipient({
        objectNameSingular: 'penduduk',
        recordId: 'penduduk-id',
      }),
    );

    expect(result.current.defaultTo).toBe('penduduk@example.com');
    expect(result.current.loading).toBe(false);
  });

  it('should return the first keluarga employee email for a Keluarga record', () => {
    mockUseFindManyRecords.mockReturnValue({
      records: [{ emails: { primaryEmail: 'employee@keluarga.com' } }],
      loading: false,
    });

    const { result } = renderHook(() =>
      useResolveDefaultEmailRecipient({
        objectNameSingular: 'keluarga',
        recordId: 'keluarga-id',
      }),
    );

    expect(result.current.defaultTo).toBe('employee@keluarga.com');
  });

  it('should return the peluang point of contact email', () => {
    mockUseFindOneRecord.mockImplementation(
      (args: { objectNameSingular: string }) => {
        if (args.objectNameSingular === 'peluang') {
          return {
            record: {
              pointOfContact: {
                emails: { primaryEmail: 'contact@opp.com' },
              },
            },
            loading: false,
          };
        }

        return { record: null, loading: false };
      },
    );

    const { result } = renderHook(() =>
      useResolveDefaultEmailRecipient({
        objectNameSingular: 'peluang',
        recordId: 'opp-id',
      }),
    );

    expect(result.current.defaultTo).toBe('contact@opp.com');
  });

  it('should return empty string for unknown object types', () => {
    const { result } = renderHook(() =>
      useResolveDefaultEmailRecipient({
        objectNameSingular: 'customObject',
        recordId: 'some-id',
      }),
    );

    expect(result.current.defaultTo).toBe('');
    expect(result.current.loading).toBe(false);
  });

  it('should return empty string when recordId is null', () => {
    const { result } = renderHook(() =>
      useResolveDefaultEmailRecipient({
        objectNameSingular: 'penduduk',
        recordId: null,
      }),
    );

    expect(result.current.defaultTo).toBe('');
  });

  it('should report loading when the relevant query is in flight', () => {
    mockUseFindOneRecord.mockImplementation(
      (args: { objectNameSingular: string }) => {
        if (args.objectNameSingular === 'penduduk') {
          return { record: null, loading: true };
        }

        return { record: null, loading: false };
      },
    );

    const { result } = renderHook(() =>
      useResolveDefaultEmailRecipient({
        objectNameSingular: 'penduduk',
        recordId: 'penduduk-id',
      }),
    );

    expect(result.current.loading).toBe(true);
  });

  it('should pass skip=true to queries for non-matching object types', () => {
    renderHook(() =>
      useResolveDefaultEmailRecipient({
        objectNameSingular: 'penduduk',
        recordId: 'penduduk-id',
      }),
    );

    // Penduduk query should NOT be skipped
    const personCall = mockUseFindOneRecord.mock.calls.find(
      (call: { objectNameSingular: string }[]) =>
        call[0].objectNameSingular === 'penduduk',
    );

    expect(personCall?.[0].skip).toBe(false);

    // Peluang query SHOULD be skipped
    const oppCall = mockUseFindOneRecord.mock.calls.find(
      (call: { objectNameSingular: string }[]) =>
        call[0].objectNameSingular === 'peluang',
    );

    expect(oppCall?.[0].skip).toBe(true);

    // Keluarga daftarPenduduk query SHOULD be skipped
    expect(mockUseFindManyRecords.mock.calls[0][0].skip).toBe(true);
  });
});
