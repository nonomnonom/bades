import { isNonEmptyArray } from 'shared/utils';

import { type GeoMapAutocompleteSanitizedResult } from 'src/engine/core-modules/geo-map/types/geo-map-autocomplete-sanitized-result.type';
import { type GeoMapMapboxSuggestFeature } from 'src/engine/core-modules/geo-map/types/geo-map-mapbox-suggest.type';

export const sanitizeMapboxSuggestResults = (
  suggestions: GeoMapMapboxSuggestFeature[],
): GeoMapAutocompleteSanitizedResult[] => {
  if (!isNonEmptyArray(suggestions)) return [];

  return suggestions.map((suggestion) => {
    const formattedAddress = [suggestion.address, suggestion.place_formatted]
      .filter(Boolean)
      .join(', ');

    return {
      text: suggestion.full_address ?? (formattedAddress || suggestion.name),
      placeId: suggestion.mapbox_id,
    };
  });
};
