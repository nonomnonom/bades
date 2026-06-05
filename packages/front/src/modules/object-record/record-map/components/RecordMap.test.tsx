import { render, screen } from '@testing-library/react';

import { RecordMap } from '@/object-record/record-map/components/RecordMap';
import { RecordMapContextProvider } from '@/object-record/record-map/contexts/RecordMapContext';
import {
  MAP_RECORD_LIMIT,
  useRecordMapRecords,
} from '@/object-record/record-map/hooks/useRecordMapRecords';
import { useMapboxAccessToken } from '@/object-record/record-map/hooks/useMapboxAccessToken';
import { useMapboxStandardStyle } from '@/object-record/record-map/hooks/useMapboxStandardStyle';
import { useOpenRecordFromIndexView } from '@/object-record/record-index/hooks/useOpenRecordFromIndexView';

jest.mock('@/object-record/record-map/hooks/useRecordMapRecords', () => ({
  ...jest.requireActual('@/object-record/record-map/hooks/useRecordMapRecords'),
  useRecordMapRecords: jest.fn(),
}));

jest.mock('@/object-record/record-map/hooks/useMapboxAccessToken', () => ({
  useMapboxAccessToken: jest.fn(),
}));

jest.mock('@/object-record/record-map/hooks/useMapboxStandardStyle', () => ({
  useMapboxStandardStyle: jest.fn(),
}));

jest.mock(
  '@/object-record/record-index/hooks/useOpenRecordFromIndexView',
  () => ({
    useOpenRecordFromIndexView: jest.fn(),
  }),
);

jest.mock('mapbox-gl');

const mockUseRecordMapRecords = useRecordMapRecords as jest.Mock;
const mockUseMapboxAccessToken = useMapboxAccessToken as jest.Mock;
const mockUseMapboxStandardStyle = useMapboxStandardStyle as jest.Mock;
const mockUseOpenRecordFromIndexView = useOpenRecordFromIndexView as jest.Mock;

const MOCK_LABEL_FIELD_ID = 'field-label-1';
const MOCK_ADDRESS_FIELD_ID = 'field-address-1';

const defaultFields = [
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

const createObjectMetadataItem = (fields = defaultFields) =>
  ({
    id: 'object-keluarga-1',
    nameSingular: 'keluarga',
    namePlural: 'daftarKeluarga',
    labelIdentifierFieldMetadataId: MOCK_LABEL_FIELD_ID,
    fields,
    readableFields: [],
    updatableFields: [],
    indexMetadatas: [],
  }) as any;

const renderRecordMap = (fields = defaultFields) =>
  render(
    <RecordMapContextProvider
      value={{
        viewBarInstanceId: 'test-view-bar',
        objectNameSingular: 'keluarga',
        objectMetadataItem: createObjectMetadataItem(fields),
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
    mockUseMapboxStandardStyle.mockReturnValue(
      'mapbox://styles/mapbox/light-v11',
    );
    mockUseOpenRecordFromIndexView.mockReturnValue({
      openRecordFromIndexView: jest.fn(),
    });
    setMapboxAccessTokenMock({ accessToken: '', hasValidAccessToken: false });
    mockUseRecordMapRecords.mockReturnValue({
      mapMarkers: [],
      loading: false,
      totalCount: 0,
      addressFieldMetadataItem: defaultFields[1],
      categoryFieldMetadataItem: null,
      objectNameSingular: 'keluarga',
    });
  });

  it('should show loading state while client config is not loaded', () => {
    setMapboxAccessTokenMock({ isClientConfigLoaded: false });

    renderRecordMap();

    expect(screen.getByText('Memuat konfigurasi peta…')).toBeInTheDocument();
  });

  it('should show empty state when Mapbox token is not set', () => {
    setMapboxAccessTokenMock({ accessToken: '', hasValidAccessToken: false });

    renderRecordMap();

    expect(screen.getByText('Tidak ada token Mapbox')).toBeInTheDocument();
  });

  it('should show empty state when object has no ADDRESS field', () => {
    setMapboxAccessTokenMock({
      accessToken: 'pk.test-token',
      hasValidAccessToken: true,
    });
    mockUseRecordMapRecords.mockReturnValue({
      mapMarkers: [],
      loading: false,
      totalCount: 0,
      addressFieldMetadataItem: undefined,
      categoryFieldMetadataItem: null,
      objectNameSingular: 'keluarga',
    });

    renderRecordMap([
      {
        id: MOCK_LABEL_FIELD_ID,
        name: 'nomorKartuKeluarga',
        type: 'TEXT',
        isActive: true,
      },
    ]);

    expect(screen.getByText('Tidak ada kolom alamat')).toBeInTheDocument();
  });

  it('should show empty state when records exist but no coordinates', () => {
    setMapboxAccessTokenMock({
      accessToken: 'pk.test-token',
      hasValidAccessToken: true,
    });

    renderRecordMap();

    expect(screen.getByText('Tidak ada data lokasi')).toBeInTheDocument();
  });

  it('should show limit banner when totalCount exceeds MAP_RECORD_LIMIT', () => {
    setMapboxAccessTokenMock({
      accessToken: 'pk.test-token',
      hasValidAccessToken: true,
    });
    mockUseRecordMapRecords.mockReturnValue({
      mapMarkers: [
        {
          id: 'record-1',
          name: 'KK001',
          lat: -7.41,
          lng: 110.61,
          category: null,
        },
      ],
      loading: false,
      totalCount: MAP_RECORD_LIMIT + 1,
      addressFieldMetadataItem: defaultFields[1],
      categoryFieldMetadataItem: null,
      objectNameSingular: 'keluarga',
    });

    renderRecordMap();

    expect(
      screen.getByText(/Menampilkan 3\.000 dari 3\.001 record/i),
    ).toBeInTheDocument();
  });

  it('should show loading overlay when records are being fetched', () => {
    setMapboxAccessTokenMock({
      accessToken: 'pk.test-token',
      hasValidAccessToken: true,
    });
    mockUseRecordMapRecords.mockReturnValue({
      mapMarkers: [],
      loading: true,
      totalCount: 0,
      addressFieldMetadataItem: defaultFields[1],
      categoryFieldMetadataItem: null,
      objectNameSingular: 'keluarga',
    });

    renderRecordMap();

    expect(screen.getByText('Memuat peta...')).toBeInTheDocument();
  });
});
