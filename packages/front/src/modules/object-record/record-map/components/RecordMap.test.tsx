import { render, screen } from '@testing-library/react';

import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { RecordMap } from '@/object-record/record-map/components/RecordMap';
import { RecordMapContextProvider } from '@/object-record/record-map/contexts/RecordMapContext';
import { useMapboxAccessToken } from '@/object-record/record-map/hooks/useMapboxAccessToken';
import { recordMapFieldMetadataIdState } from '@/object-record/record-map/states/recordMapFieldMetadataIdState';
import { jotaiStore } from '@/ui/utilities/state/jotai/jotaiStore';

jest.mock('@/object-record/hooks/useFindManyRecords', () => ({
  useFindManyRecords: jest.fn(),
}));

jest.mock('@/object-record/record-map/hooks/useMapboxAccessToken', () => ({
  useMapboxAccessToken: jest.fn(),
}));

jest.mock('mapbox-gl');

const mockUseFindManyRecords = useFindManyRecords as jest.Mock;
const mockUseMapboxAccessToken = useMapboxAccessToken as jest.Mock;

const MOCK_LABEL_FIELD_ID = 'field-label-1';
const MOCK_ADDRESS_FIELD_ID = 'field-address-1';

type MockField = {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
};

type ObjectMetadataOverrides = {
  fields?: MockField[];
};

const defaultFields: MockField[] = [
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
];

const createObjectMetadataItem = (overrides: ObjectMetadataOverrides = {}) =>
  ({
    id: 'object-keluarga-1',
    nameSingular: 'keluarga',
    namePlural: 'daftarKeluarga',
    labelIdentifierFieldMetadataId: MOCK_LABEL_FIELD_ID,
    fields: overrides.fields ?? defaultFields,
    readableFields: [],
    updatableFields: [],
    indexMetadatas: [],
  }) as any;

const renderRecordMap = (overrides: ObjectMetadataOverrides = {}) =>
  render(
    <RecordMapContextProvider
      value={{
        viewBarInstanceId: 'test-view-bar',
        objectNameSingular: 'keluarga',
        objectMetadataItem: createObjectMetadataItem(overrides),
        objectPermissions: {
          canReadObjectRecords: true,
          canUpdateObjectRecords: true,
          canSoftDeleteObjectRecords: true,
          canDestroyObjectRecords: true,
          objectMetadataId: 'object-keluarga-1',
        },
      }}
    >
      <RecordMap />
    </RecordMapContextProvider>,
  );

const setMapboxAccessTokenMock = ({
  accessToken = '',
  hasValidAccessToken = false,
  isClientConfigLoaded = true,
}: {
  accessToken?: string;
  hasValidAccessToken?: boolean;
  isClientConfigLoaded?: boolean;
}) => {
  mockUseMapboxAccessToken.mockReturnValue({
    accessToken,
    hasValidAccessToken,
    isClientConfigLoaded,
  });
};

describe('RecordMap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jotaiStore.set(recordMapFieldMetadataIdState.atom, null);
    setMapboxAccessTokenMock({ accessToken: '', hasValidAccessToken: false });
  });

  it('should show loading state while client config is not loaded', () => {
    setMapboxAccessTokenMock({ isClientConfigLoaded: false });
    mockUseFindManyRecords.mockReturnValue({ records: [], loading: false });

    renderRecordMap();

    expect(screen.getByText('Memuat konfigurasi peta…')).toBeInTheDocument();
  });

  it('should show empty state when Mapbox token is not set', () => {
    setMapboxAccessTokenMock({ accessToken: '', hasValidAccessToken: false });
    mockUseFindManyRecords.mockReturnValue({ records: [], loading: false });

    renderRecordMap();

    expect(screen.getByText('Tidak ada token Mapbox')).toBeInTheDocument();
    expect(screen.getByText(/MAPBOX_ACCESS_TOKEN/i)).toBeInTheDocument();
  });

  it('should show empty state when object has no ADDRESS field', () => {
    setMapboxAccessTokenMock({
      accessToken: 'pk.test-token',
      hasValidAccessToken: true,
    });
    mockUseFindManyRecords.mockReturnValue({ records: [], loading: false });

    renderRecordMap({
      fields: [
        {
          id: MOCK_LABEL_FIELD_ID,
          name: 'nomorKartuKeluarga',
          type: 'TEXT',
          isActive: true,
        },
      ],
    });

    expect(screen.getByText('Tidak ada kolom alamat')).toBeInTheDocument();
  });

  it('should show empty state when records exist but no coordinates', () => {
    setMapboxAccessTokenMock({
      accessToken: 'pk.test-token',
      hasValidAccessToken: true,
    });
    mockUseFindManyRecords.mockReturnValue({
      records: [
        { id: 'r1', address: null },
        { id: 'r2', address: { addressLat: null, addressLng: null } },
      ],
      loading: false,
    });

    renderRecordMap();

    expect(screen.getByText('Tidak ada data lokasi')).toBeInTheDocument();
  });

  it('should show loading overlay when records are being fetched', () => {
    setMapboxAccessTokenMock({
      accessToken: 'pk.test-token',
      hasValidAccessToken: true,
    });
    mockUseFindManyRecords.mockReturnValue({ records: [], loading: true });

    renderRecordMap();

    expect(screen.getByText('Memuat peta...')).toBeInTheDocument();
  });
});
