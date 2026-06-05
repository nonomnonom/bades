import { renderHook } from '@testing-library/react';
import { Provider as JotaiProvider } from 'jotai';

import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { useRelevantRecordsGqlFields } from '@/object-record/record-field/hooks/useRelevantRecordsGqlFields';
import { useFindManyRecordIndexTableParams } from '@/object-record/record-index/hooks/useFindManyRecordIndexTableParams';
import { useRecordIndexContextOrThrow } from '@/object-record/record-index/contexts/RecordIndexContext';
import { RecordMapContextProvider } from '@/object-record/record-map/contexts/RecordMapContext';
import {
  MAP_RECORD_LIMIT,
  useRecordMapRecords,
} from '@/object-record/record-map/hooks/useRecordMapRecords';
import { jotaiStore } from '@/ui/utilities/state/jotai/jotaiStore';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useGetCurrentViewOnly } from '@/views/hooks/useGetCurrentViewOnly';

jest.mock('@/object-record/hooks/useFindManyRecords', () => ({
  useFindManyRecords: jest.fn(),
}));

jest.mock(
  '@/object-record/record-index/hooks/useFindManyRecordIndexTableParams',
  () => ({
    useFindManyRecordIndexTableParams: jest.fn(),
  }),
);

jest.mock('@/object-record/record-index/contexts/RecordIndexContext', () => ({
  useRecordIndexContextOrThrow: jest.fn(),
}));

jest.mock(
  '@/object-record/record-field/hooks/useRelevantRecordsGqlFields',
  () => ({
    useRelevantRecordsGqlFields: jest.fn(),
  }),
);

jest.mock('@/views/hooks/useGetCurrentViewOnly', () => ({
  useGetCurrentViewOnly: jest.fn(),
}));

jest.mock(
  '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue',
  () => ({
    useAtomComponentStateValue: jest.fn(),
  }),
);

const mockUseFindManyRecords = useFindManyRecords as jest.Mock;
const mockUseFindManyRecordIndexTableParams =
  useFindManyRecordIndexTableParams as jest.Mock;
const mockUseRecordIndexContextOrThrow =
  useRecordIndexContextOrThrow as jest.Mock;
const mockUseRelevantRecordsGqlFields =
  useRelevantRecordsGqlFields as jest.Mock;
const mockUseGetCurrentViewOnly = useGetCurrentViewOnly as jest.Mock;
const mockUseAtomComponentStateValue = useAtomComponentStateValue as jest.Mock;

const MOCK_RECORD_INDEX_ID = 'test-record-index';
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
    mockUseRecordIndexContextOrThrow.mockReturnValue({
      recordIndexId: MOCK_RECORD_INDEX_ID,
    });
    mockUseFindManyRecordIndexTableParams.mockReturnValue({
      filter: { and: [{ field: 'status', operator: 'eq', value: 'active' }] },
      orderBy: [{ field: 'createdAt', direction: 'DescNullsLast' }],
    });
    mockUseRelevantRecordsGqlFields.mockReturnValue({
      id: true,
      address: true,
    });
    mockUseGetCurrentViewOnly.mockReturnValue({ currentView: null });
    mockUseAtomComponentStateValue.mockReturnValue(null);
  });

  it('should pass ViewBar filter and orderBy to useFindManyRecords', () => {
    mockUseFindManyRecords.mockReturnValue({
      records: [],
      loading: false,
      totalCount: 0,
    });

    renderHook(() => useRecordMapRecords(), {
      wrapper: createWrapper(),
    });

    expect(mockUseFindManyRecordIndexTableParams).toHaveBeenCalledWith(
      'keluarga',
      MOCK_RECORD_INDEX_ID,
    );
    expect(mockUseFindManyRecords).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: {
          and: [{ field: 'status', operator: 'eq', value: 'active' }],
        },
        orderBy: [{ field: 'createdAt', direction: 'DescNullsLast' }],
        limit: MAP_RECORD_LIMIT,
        objectNameSingular: 'keluarga',
      }),
    );
  });

  it('should return empty mapMarkers when no address field exists', () => {
    mockUseFindManyRecords.mockReturnValue({
      records: [],
      loading: false,
      totalCount: 0,
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
      totalCount: 2,
    });

    const { result } = renderHook(() => useRecordMapRecords(), {
      wrapper: createWrapper(),
    });

    expect(result.current.mapMarkers).toHaveLength(2);
    expect(result.current.totalCount).toBe(2);
    expect(result.current.mapMarkers[0]).toEqual({
      id: 'record-1',
      name: 'KK001',
      lat: -6.2088,
      lng: 106.8456,
      category: null,
    });
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
      ],
      loading: false,
      totalCount: 2,
    });

    const { result } = renderHook(() => useRecordMapRecords(), {
      wrapper: createWrapper(),
    });

    expect(result.current.mapMarkers).toHaveLength(1);
    expect(result.current.mapMarkers[0].id).toBe('record-1');
  });

  it('should respect component state override for address field', () => {
    const secondAddressFieldId = 'field-address-2';
    const secondAddressFieldName = 'alamatKantor';

    mockUseAtomComponentStateValue.mockReturnValue(secondAddressFieldId);
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
      totalCount: 1,
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
    expect(result.current.mapMarkers[0]).toEqual({
      id: 'record-1',
      name: 'KK001',
      lat: -7.42,
      lng: 110.62,
      category: null,
    });
  });

  it('should prefer currentView.mapFieldMetadataId over first ADDRESS field', () => {
    const secondAddressFieldId = 'field-address-2';
    const secondAddressFieldName = 'alamatKantor';

    mockUseGetCurrentViewOnly.mockReturnValue({
      currentView: {
        type: 'MAP',
        mapFieldMetadataId: secondAddressFieldId,
      },
    });
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
      totalCount: 1,
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
    expect(result.current.mapMarkers[0]?.lat).toBe(-7.42);
  });
});
