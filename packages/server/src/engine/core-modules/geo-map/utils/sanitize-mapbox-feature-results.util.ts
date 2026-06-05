import { isDefined } from 'shared/utils';

import { type GeoMapAddressFields } from 'src/engine/core-modules/geo-map/types/geo-map-address-fields.type';
import {
  type GeoMapMapboxForwardFeature,
  type GeoMapMapboxRetrieveFeature,
} from 'src/engine/core-modules/geo-map/types/geo-map-mapbox-suggest.type';

type MapboxFeatureWithProperties =
  | GeoMapMapboxRetrieveFeature
  | GeoMapMapboxForwardFeature;

const resolveCoordinates = (
  feature: MapboxFeatureWithProperties,
): { lat: number; lng: number } | undefined => {
  const coordinates = feature.geometry?.coordinates;

  if (isDefined(coordinates) && coordinates.length === 2) {
    return { lng: coordinates[0], lat: coordinates[1] };
  }

  const latitude = feature.properties?.coordinates?.latitude;
  const longitude = feature.properties?.coordinates?.longitude;

  if (isDefined(latitude) && isDefined(longitude)) {
    return { lat: latitude, lng: longitude };
  }

  return undefined;
};

export const sanitizeMapboxFeatureResults = (
  feature: MapboxFeatureWithProperties | undefined,
): GeoMapAddressFields => {
  if (!isDefined(feature?.properties)) return {};

  const { properties } = feature;
  const context = properties.context;
  const location = resolveCoordinates(feature);

  const street =
    properties.address ??
    context?.address?.name ??
    context?.street?.name ??
    properties.name;

  return {
    street,
    city: context?.place?.name ?? context?.locality?.name,
    state: context?.region?.name,
    postcode: context?.postcode?.name,
    country: context?.country?.country_code,
    location,
  };
};
