export type GeoMapMapboxSuggestContextLayer = {
  name?: string;
  country_code?: string;
};

export type GeoMapMapboxSuggestContext = {
  country?: GeoMapMapboxSuggestContextLayer;
  region?: GeoMapMapboxSuggestContextLayer;
  postcode?: GeoMapMapboxSuggestContextLayer;
  place?: GeoMapMapboxSuggestContextLayer;
  locality?: GeoMapMapboxSuggestContextLayer;
  street?: GeoMapMapboxSuggestContextLayer;
  address?: GeoMapMapboxSuggestContextLayer;
};

export type GeoMapMapboxSuggestFeature = {
  name: string;
  mapbox_id: string;
  full_address?: string;
  place_formatted?: string;
  address?: string;
};

export type GeoMapMapboxSuggestResponse = {
  suggestions?: GeoMapMapboxSuggestFeature[];
};

export type GeoMapMapboxRetrieveFeature = {
  geometry?: {
    coordinates?: [number, number];
  };
  properties?: {
    name?: string;
    full_address?: string;
    place_formatted?: string;
    address?: string;
    coordinates?: {
      latitude?: number;
      longitude?: number;
    };
    context?: GeoMapMapboxSuggestContext;
  };
};

export type GeoMapMapboxRetrieveResponse = {
  features?: GeoMapMapboxRetrieveFeature[];
};

export type GeoMapMapboxForwardFeature = {
  geometry?: {
    coordinates?: [number, number];
  };
  properties?: {
    name?: string;
    full_address?: string;
    place_formatted?: string;
    address?: string;
    coordinates?: {
      latitude?: number;
      longitude?: number;
    };
    context?: GeoMapMapboxSuggestContext;
  };
};

export type GeoMapMapboxForwardResponse = {
  features?: GeoMapMapboxForwardFeature[];
};
