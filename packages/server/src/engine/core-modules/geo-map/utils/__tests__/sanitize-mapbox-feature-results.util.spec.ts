import { sanitizeMapboxFeatureResults } from 'src/engine/core-modules/geo-map/utils/sanitize-mapbox-feature-results.util';

describe('sanitizeMapboxFeatureResults', () => {
  it('should return empty object when feature is undefined', () => {
    expect(sanitizeMapboxFeatureResults(undefined)).toEqual({});
  });

  it('should map retrieve feature to address fields', () => {
    const result = sanitizeMapboxFeatureResults({
      geometry: {
        coordinates: [106.8456, -6.2088],
      },
      properties: {
        name: 'Monas',
        address: 'Jl. Medan Merdeka Barat',
        context: {
          country: {
            name: 'Indonesia',
            country_code: 'ID',
          },
          region: {
            name: 'DKI Jakarta',
          },
          place: {
            name: 'Jakarta Pusat',
          },
          postcode: {
            name: '10110',
          },
        },
      },
    });

    expect(result).toEqual({
      street: 'Jl. Medan Merdeka Barat',
      city: 'Jakarta Pusat',
      state: 'DKI Jakarta',
      postcode: '10110',
      country: 'ID',
      location: {
        lng: 106.8456,
        lat: -6.2088,
      },
    });
  });
});
