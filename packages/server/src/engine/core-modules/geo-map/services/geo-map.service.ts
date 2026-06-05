import { Injectable } from '@nestjs/common';

import { isNonEmptyString } from '@sniptt/guards';
import { isDefined } from 'shared/utils';

import { type GeoMapAddressFields } from 'src/engine/core-modules/geo-map/types/geo-map-address-fields.type';
import { type GeoMapAutocompleteSanitizedResult } from 'src/engine/core-modules/geo-map/types/geo-map-autocomplete-sanitized-result.type';
import {
  type GeoMapMapboxForwardResponse,
  type GeoMapMapboxRetrieveResponse,
  type GeoMapMapboxSuggestResponse,
} from 'src/engine/core-modules/geo-map/types/geo-map-mapbox-suggest.type';
import { sanitizeMapboxFeatureResults } from 'src/engine/core-modules/geo-map/utils/sanitize-mapbox-feature-results.util';
import { sanitizeMapboxSuggestResults } from 'src/engine/core-modules/geo-map/utils/sanitize-mapbox-suggest-results.util';
import { SecureHttpClientService } from 'src/engine/core-modules/secure-http-client/secure-http-client.service';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

const MAPBOX_SEARCH_BOX_BASE_URL = 'https://api.mapbox.com/search/searchbox/v1';

@Injectable()
export class GeoMapService {
  private mapboxAccessToken: string | undefined;

  constructor(
    private readonly badesConfigService: BadesConfigService,
    private readonly secureHttpClientService: SecureHttpClientService,
  ) {
    this.mapboxAccessToken = this.badesConfigService.get('MAPBOX_ACCESS_TOKEN');
  }

  public isGeocodingEnabled(): boolean {
    return isNonEmptyString(this.mapboxAccessToken);
  }

  public async getAutoCompleteAddress(
    address: string,
    token: string,
    country?: string,
    isFieldCity?: boolean,
  ): Promise<GeoMapAutocompleteSanitizedResult[] | undefined> {
    if (!this.isGeocodingEnabled() || !isNonEmptyString(address?.trim())) {
      return [];
    }

    const params = new URLSearchParams({
      q: address.trim(),
      session_token: token,
      access_token: this.mapboxAccessToken!,
      language: 'id',
      limit: '5',
    });

    if (isNonEmptyString(country)) {
      params.set('country', country.toUpperCase());
    }

    if (isDefined(isFieldCity) && isFieldCity === true) {
      params.set('types', 'place,city,locality');
    }

    const httpClient = this.secureHttpClientService.getHttpClient();
    const result = await httpClient.get<GeoMapMapboxSuggestResponse>(
      `${MAPBOX_SEARCH_BOX_BASE_URL}/suggest?${params.toString()}`,
    );

    return sanitizeMapboxSuggestResults(result.data.suggestions ?? []);
  }

  public async getAddressDetails(
    placeId: string,
    token: string,
  ): Promise<GeoMapAddressFields | undefined> {
    if (!this.isGeocodingEnabled() || !isNonEmptyString(placeId)) {
      return {};
    }

    const params = new URLSearchParams({
      session_token: token,
      access_token: this.mapboxAccessToken!,
    });

    const httpClient = this.secureHttpClientService.getHttpClient();
    const encodedPlaceId = encodeURIComponent(placeId);
    const result = await httpClient.get<GeoMapMapboxRetrieveResponse>(
      `${MAPBOX_SEARCH_BOX_BASE_URL}/retrieve/${encodedPlaceId}?${params.toString()}`,
    );

    return sanitizeMapboxFeatureResults(result.data.features?.[0]);
  }

  // Forward geocode untuk backfill koordinat dari teks alamat (tanpa session).
  public async geocodeAddressFromText(
    address: string,
    country?: string,
  ): Promise<GeoMapAddressFields | undefined> {
    if (!this.isGeocodingEnabled() || !isNonEmptyString(address?.trim())) {
      return undefined;
    }

    const params = new URLSearchParams({
      q: address.trim(),
      access_token: this.mapboxAccessToken!,
      language: 'id',
      limit: '1',
    });

    if (isNonEmptyString(country)) {
      params.set('country', country.toUpperCase());
    }

    const httpClient = this.secureHttpClientService.getHttpClient();
    const result = await httpClient.get<GeoMapMapboxForwardResponse>(
      `${MAPBOX_SEARCH_BOX_BASE_URL}/forward?${params.toString()}`,
    );

    return sanitizeMapboxFeatureResults(result.data.features?.[0]);
  }
}
