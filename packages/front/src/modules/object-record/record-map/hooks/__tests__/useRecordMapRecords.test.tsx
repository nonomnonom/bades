import { renderHook } from '@testing-library/react';
import { Provider as JotaiProvider } from 'jotai';

import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { RecordMapContextProvider } from '@/object-record/record-map/contexts/RecordMapContext';
import { useRecordMapRecords } from '@/object-record/record-map/hooks/useRecordMapRecords';
import { recordMapFieldMetadataIdState } from '@/object-record/record-map/states/recordMapFieldMetadataIdState';
import { jotaiStore } from '@/ui/utilities/state/jotai/jotaiStore';

jest.mock('@/object-record/hooks/useFindManyRecords', () => ({
  useFindManyRecords: jest.fn(),
}));

const mockUseFindManyRecords = useFindManyRecords as jest.Mock;

const MOCK_ADDRESS_FIELD_ID = 'field-address-1';
const MOCK_LABEL_FIELD_ID = 'field-label-1';

const createObjectMetadataItem = (
  overrides?: Partial<{
    fields: Array<{
      id: string;
      name: string;
      type: string;
      isActive: boolean;
    }>;
  }>,
) =>
  ({
    id: 'object-keluarga-1',
    nameSingular: 'keluarga',
    namePlural: 'daftarKeluarga',
    labelIdentifierFieldMetadataId: MOCK_LABEL_FIELD_ID,
    fields: overrides?.fields ?? [
      {
        id: MOCK_LABEL_FIELD_ID,
        name: 'nomorKartuKeluarga',
        type: 'TEXT',
        isActive: true,
      },
      {
        id: MOCK_ADDRESS_FIELD_ID,
        name: 'address',
        type: 'ADDRESS',
        isActive: true,
      },
    ],
    readableFields: [],
    updatableFields: [],
    indexMetadatas: [],
  }) as any;

const createWrapper =
  (overrides?: {
    objectMetadataItem?: ReturnType<typeof createObjectMetadataItem>;
  }) =>
  ({ children }: { children: React.ReactNode }) => (
    <JotaiProvider store={jotaiStore}>
      <RecordMapContextProvider
        value={{
          viewBarInstanceId: 'test-view-bar',
          objectNameSingular: 'keluarga',
          objectMetadataItem:
            overrides?.objectMetadataItem ?? createObjectMetadataItem(),
          objectPermissions: {
            canReadObjectRecords: true,
            canUpdateObjectRecords: true,
            canSoftDeleteObjectRecords: true,
            canDestroyObjectRecords: true,
            objectMetadataId: 'object-keluarga-1',
          },
        }}
      >
        {children}
      </RecordMapContextProvider>
    </JotaiProvider>
  );

describe('useRecordMapRecords', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jotaiStore.set(recordMapFieldMetadataIdState.atom, null);
  });

  it('should return empty mapMarkers when no address field exists', () => {
    mockUseFindManyRecords.mockReturnValue({
      records: [],
      loading: false,
    });

    const { result } = renderHook(() => useRecordMapRecords(), {
      wrapper: createWrapper({
        objectMetadataItem: createObjectMetadataItem({
          fields: [
            {
              id: MOCK_LABEL_FIELD_ID,
              name: 'nomorKartuKeluarga',
              type: 'TEXT',
              isActive: true,
            },
          ],
        }),
      }),
    });

    expect(result.current.mapMarkers).toEqual([]);
    expect(result.current.addressFieldMetadataItem).toBeUndefined();
    expect(result.current.loading).toBe(false);
  });

  it('should return mapMarkers for records with valid address coordinates', () => {
    mockUseFindManyRecords.mockReturnValue({
      records: [
        {
          id: 'record-1',
          nomorKartuKeluarga: 'KK001',
          address: { addressLat: -6.2088, addressLng: 106.8456 },
        },
        {
          id: 'record-2',
          nomorKartuKeluarga: 'KK002',
          address: { addressLat: -6.3, addressLng: 106.7 },
        },
      ],
      loading: false,
    });

    const { result } = renderHook(() => useRecordMapRecords(), {
      wrapper: createWrapper(),
    });

    expect(result.current.mapMarkers).toHaveLength(2);
    expect(result.current.mapMarkers[0]).toEqual({
      id: 'record-1',
      name: 'KK001',
      lat: -6.2088,
      lng: 106.8456,
      category: null,
    });
    expect(result.current.mapMarkers[1]).toEqual({
      id: 'record-2',
      name: 'KK002',
      lat: -6.3,
      lng: 106.7,
      category: null,
    });
    expect(result.current.loading).toBe(false);
  });

  it('should filter out records without lat/lng coordinates', () => {
    mockUseFindManyRecords.mockReturnValue({
      records: [
        {
          id: 'record-1',
          nomorKartuKeluarga: 'KK001',
          address: { addressLat: -6.2088, addressLng: 106.8456 },
        },
        {
          id: 'record-2',
          nomorKartuKeluarga: 'KK002',
          address: null,
        },
        {
          id: 'record-3',
          nomorKartuKeluarga: 'KK003',
          address: { addressLat: null, addressLng: null },
        },
      ],
      loading: false,
    });

    const { result } = renderHook(() => useRecordMapRecords(), {
      wrapper: createWrapper(),
    });

    expect(result.current.mapMarkers).toHaveLength(1);
    expect(result.current.mapMarkers[0].id).toBe('record-1');
  });

  it('should return loading state while records are being fetched', () => {
    mockUseFindManyRecords.mockReturnValue({
      records: [],
      loading: true,
    });

    const { result } = renderHook(() => useRecordMapRecords(), {
      wrapper: createWrapper(),
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.mapMarkers).toEqual([]);
  });

  it('should filter out coordinates outside valid WGS84 range', () => {
    mockUseFindManyRecords.mockReturnValue({
      records: [
        {
          id: 'record-valid',
          nomorKartuKeluarga: 'KK-VALID',
          address: { addressLat: -7.4, addressLng: 110.6 },
        },
        {
          id: 'record-corrupt',
          nomorKartuKeluarga: 'KK-BAD',
          address: { addressLat: 999, addressLng: 999 },
        },
        {
          id: 'record-zero',
          nomorKartuKeluarga: 'KK-ZERO',
          address: { addressLat: 0, addressLng: 0 },
        },
      ],
      loading: false,
    });

    const { result } = renderHook(() => useRecordMapRecords(), {
      wrapper: createWrapper(),
    });

    expect(result.current.mapMarkers).toHaveLength(2);
    expect(result.current.mapMarkers.map((m) => m.id)).toEqual([
      'record-valid',
      'record-zero',
    ]);
  });

  it('should respect recordMapFieldMetadataIdState override', () => {
    const secondAddressFieldId = 'field-address-2';
    const secondAddressFieldName = 'alamatKantor';

    mockUseFindManyRecords.mockReturnValue({
      records: [
        {
          id: 'record-1',
          nomorKartuKeluarga: 'KK001',
          address: { addressLat: -7.4, addressLng: 110.6 },
          [secondAddressFieldName]: {
            addressLat: -7.42,
            addressLng: 110.62,
          },
        },
      ],
      loading: false,
    });

    // Override ke field ADDRESS kedua.
    jotaiStore.set(recordMapFieldMetadataIdState.atom, secondAddressFieldId);

    const { result } = renderHook(() => useRecordMapRecords(), {
      wrapper: createWrapper({
        objectMetadataItem: createObjectMetadataItem({
          fields: [
            {
              id: MOCK_LABEL_FIELD_ID,
              name: 'nomorKartuKeluarga',
              type: 'TEXT',
              isActive: true,
            },
            {
              id: MOCK_ADDRESS_FIELD_ID,
              name: 'address',
              type: 'ADDRESS',
              isActive: true,
            },
            {
              id: secondAddressFieldId,
              name: secondAddressFieldName,
              type: 'ADDRESS',
              isActive: true,
            },
          ],
        }),
      }),
    });

    expect(result.current.addressFieldMetadataItem?.id).toBe(
      secondAddressFieldId,
    );
    expect(result.current.mapMarkers).toHaveLength(1);
    expect(result.current.mapMarkers[0]).toEqual({
      id: 'record-1',
      name: 'KK001',
      lat: -7.42,
      lng: 110.62,
      category: null,
    });
  });
});
