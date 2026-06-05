import { addressCompositeType } from 'shared/types';

const ADDRESS_TEXT_PROPERTY_NAMES = addressCompositeType.properties
  .filter(
    (property) =>
      property.name !== 'addressLat' && property.name !== 'addressLng',
  )
  .map((property) => property.name);

export type AddressCompositeValue = Record<string, unknown>;

export const buildAddressGeocodeQuery = (
  addressValue: AddressCompositeValue,
): string | null => {
  const addressParts = ADDRESS_TEXT_PROPERTY_NAMES.map(
    (propertyName) => addressValue[propertyName],
  ).filter(
    (value): value is string =>
      typeof value === 'string' && value.trim().length > 0,
  );

  if (addressParts.length === 0) {
    return null;
  }

  return addressParts.join(', ');
};

export const hasValidAddressCoordinates = (
  addressValue: AddressCompositeValue,
): boolean => {
  const lat = addressValue.addressLat;
  const lng = addressValue.addressLng;

  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return false;
  }

  const parsedLat = typeof lat === 'number' ? lat : Number(lat);
  const parsedLng = typeof lng === 'number' ? lng : Number(lng);

  if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) {
    return false;
  }

  return !(parsedLat === 0 && parsedLng === 0);
};

export const needsAddressGeocoding = (
  addressValue: AddressCompositeValue,
): boolean => {
  return (
    buildAddressGeocodeQuery(addressValue) !== null &&
    !hasValidAddressCoordinates(addressValue)
  );
};

export const mergeGeocodedCoordinatesIntoAddress = ({
  addressValue,
  lat,
  lng,
}: {
  addressValue: AddressCompositeValue;
  lat: number;
  lng: number;
}): AddressCompositeValue => ({
  ...addressValue,
  addressLat: lat,
  addressLng: lng,
});
