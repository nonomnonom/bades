import {
  buildAddressGeocodeQuery,
  hasValidAddressCoordinates,
  mergeGeocodedCoordinatesIntoAddress,
  needsAddressGeocoding,
} from 'src/engine/core-modules/geo-map/utils/build-address-geocode-query.util';

describe('buildAddressGeocodeQuery', () => {
  it('should join alamat teks menjadi query geocode', () => {
    const query = buildAddressGeocodeQuery({
      addressStreet1: 'Jl. Merdeka No. 1',
      addressCity: 'Sukamaju',
      addressState: 'Jawa Tengah',
      addressCountry: 'ID',
    });

    expect(query).toBe('Jl. Merdeka No. 1, Sukamaju, Jawa Tengah, ID');
  });

  it('should return null when no address text parts exist', () => {
    expect(
      buildAddressGeocodeQuery({
        addressLat: null,
        addressLng: null,
      }),
    ).toBeNull();
  });
});

describe('hasValidAddressCoordinates', () => {
  it('should return true for valid coordinates', () => {
    expect(
      hasValidAddressCoordinates({
        addressLat: -7.41,
        addressLng: 110.61,
      }),
    ).toBe(true);
  });

  it('should return false for Null Island', () => {
    expect(
      hasValidAddressCoordinates({
        addressLat: 0,
        addressLng: 0,
      }),
    ).toBe(false);
  });

  it('should return false when coordinates are missing', () => {
    expect(hasValidAddressCoordinates({})).toBe(false);
  });
});

describe('needsAddressGeocoding', () => {
  it('should return true when address text exists but coordinates are invalid', () => {
    expect(
      needsAddressGeocoding({
        addressStreet1: 'Jl. Merdeka',
        addressLat: null,
        addressLng: null,
      }),
    ).toBe(true);
  });

  it('should return false when valid coordinates already exist', () => {
    expect(
      needsAddressGeocoding({
        addressStreet1: 'Jl. Merdeka',
        addressLat: -7.41,
        addressLng: 110.61,
      }),
    ).toBe(false);
  });
});

describe('mergeGeocodedCoordinatesIntoAddress', () => {
  it('should merge lat/lng into address composite', () => {
    expect(
      mergeGeocodedCoordinatesIntoAddress({
        addressValue: { addressStreet1: 'Jl. Merdeka' },
        lat: -7.41,
        lng: 110.61,
      }),
    ).toEqual({
      addressStreet1: 'Jl. Merdeka',
      addressLat: -7.41,
      addressLng: 110.61,
    });
  });
});
