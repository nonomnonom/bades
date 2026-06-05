import { FieldMetadataType } from 'shared/types';

import { AddressGeocodeOnSaveService } from 'src/engine/core-modules/geo-map/services/address-geocode-on-save.service';
import { GeoMapService } from 'src/engine/core-modules/geo-map/services/geo-map.service';
import { WorkspaceManyOrAllFlatEntityMapsCacheService } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service';

describe('AddressGeocodeOnSaveService', () => {
  const geoMapService = {
    isGeocodingEnabled: jest.fn(),
    geocodeAddressFromText: jest.fn(),
  } as unknown as GeoMapService;

  const workspaceManyOrAllFlatEntityMapsCacheService = {
    getOrRecomputeManyOrAllFlatEntityMaps: jest.fn(),
  } as unknown as WorkspaceManyOrAllFlatEntityMapsCacheService;

  const service = new AddressGeocodeOnSaveService(
    geoMapService,
    workspaceManyOrAllFlatEntityMapsCacheService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should skip geocoding when geocoding is disabled', async () => {
    (geoMapService.isGeocodingEnabled as jest.Mock).mockReturnValue(false);

    const record = {
      alamat: {
        addressStreet1: 'Jl. Merdeka',
        addressLat: null,
        addressLng: null,
      },
    };

    await expect(
      service.enrichRecordWithGeocodedAddresses({
        workspaceId: 'workspace-1',
        objectNameSingular: 'keluarga',
        record,
      }),
    ).resolves.toBe(record);

    expect(geoMapService.geocodeAddressFromText).not.toHaveBeenCalled();
  });

  it('should geocode ADDRESS field when text exists and coordinates are missing', async () => {
    (geoMapService.isGeocodingEnabled as jest.Mock).mockReturnValue(true);
    (
      workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps as jest.Mock
    ).mockResolvedValue({
      flatObjectMetadataMaps: {
        byUniversalIdentifier: {
          'object-uni-1': {
            id: 'object-1',
            nameSingular: 'keluarga',
            namePlural: 'daftarKeluarga',
          },
        },
      },
      flatFieldMetadataMaps: {
        byId: {
          'field-1': {
            id: 'field-1',
            objectMetadataId: 'object-1',
            name: 'alamat',
            type: FieldMetadataType.ADDRESS,
            isActive: true,
          },
        },
      },
    });
    (geoMapService.geocodeAddressFromText as jest.Mock).mockResolvedValue({
      location: { lat: -7.41, lng: 110.61 },
    });

    const result = await service.enrichRecordWithGeocodedAddresses({
      workspaceId: 'workspace-1',
      objectNameSingular: 'keluarga',
      record: {
        alamat: {
          addressStreet1: 'Jl. Merdeka',
          addressCountry: 'ID',
          addressLat: null,
          addressLng: null,
        },
      },
    });

    expect(geoMapService.geocodeAddressFromText).toHaveBeenCalledWith(
      expect.stringContaining('Jl. Merdeka'),
      'ID',
    );
    expect(result.alamat).toEqual(
      expect.objectContaining({
        addressLat: -7.41,
        addressLng: 110.61,
      }),
    );
  });
});
