import { Injectable } from '@nestjs/common';

import { FieldMetadataType } from 'shared/types';
import { isDefined } from 'shared/utils';

import { GeoMapService } from 'src/engine/core-modules/geo-map/services/geo-map.service';
import {
  buildAddressGeocodeQuery,
  mergeGeocodedCoordinatesIntoAddress,
  needsAddressGeocoding,
  type AddressCompositeValue,
} from 'src/engine/core-modules/geo-map/utils/build-address-geocode-query.util';
import { WorkspaceManyOrAllFlatEntityMapsCacheService } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { buildObjectIdByNameMaps } from 'src/engine/metadata-modules/flat-object-metadata/utils/build-object-id-by-name-maps.util';

type RecordInput = Record<string, unknown>;

@Injectable()
export class AddressGeocodeOnSaveService {
  constructor(
    private readonly geoMapService: GeoMapService,
    private readonly workspaceManyOrAllFlatEntityMapsCacheService: WorkspaceManyOrAllFlatEntityMapsCacheService,
  ) {}

  async enrichRecordWithGeocodedAddresses({
    workspaceId,
    objectNameSingular,
    record,
  }: {
    workspaceId: string;
    objectNameSingular: string;
    record: RecordInput;
  }): Promise<RecordInput> {
    if (!this.geoMapService.isGeocodingEnabled()) {
      return record;
    }

    const addressFieldNames = await this.getAddressFieldNamesForObject({
      workspaceId,
      objectNameSingular,
    });

    if (addressFieldNames.length === 0) {
      return record;
    }

    let enrichedRecord = record;

    for (const fieldName of addressFieldNames) {
      const addressValue = enrichedRecord[fieldName];

      if (!isDefined(addressValue) || typeof addressValue !== 'object') {
        continue;
      }

      const addressCompositeValue = addressValue as AddressCompositeValue;

      if (!needsAddressGeocoding(addressCompositeValue)) {
        continue;
      }

      const queryText = buildAddressGeocodeQuery(addressCompositeValue);

      if (!isDefined(queryText)) {
        continue;
      }

      const countryCode =
        typeof addressCompositeValue.addressCountry === 'string'
          ? addressCompositeValue.addressCountry
          : 'ID';

      const geocoded = await this.geoMapService.geocodeAddressFromText(
        queryText,
        countryCode,
      );

      const lat = geocoded?.location?.lat;
      const lng = geocoded?.location?.lng;

      if (lat === undefined || lng === undefined) {
        continue;
      }

      enrichedRecord = {
        ...enrichedRecord,
        [fieldName]: mergeGeocodedCoordinatesIntoAddress({
          addressValue: addressCompositeValue,
          lat,
          lng,
        }),
      };
    }

    return enrichedRecord;
  }

  async enrichRecordsWithGeocodedAddresses({
    workspaceId,
    objectNameSingular,
    records,
  }: {
    workspaceId: string;
    objectNameSingular: string;
    records: RecordInput[];
  }): Promise<RecordInput[]> {
    const enrichedRecords: RecordInput[] = [];

    for (const record of records) {
      enrichedRecords.push(
        await this.enrichRecordWithGeocodedAddresses({
          workspaceId,
          objectNameSingular,
          record,
        }),
      );
    }

    return enrichedRecords;
  }

  private async getAddressFieldNamesForObject({
    workspaceId,
    objectNameSingular,
  }: {
    workspaceId: string;
    objectNameSingular: string;
  }): Promise<string[]> {
    const { flatObjectMetadataMaps, flatFieldMetadataMaps } =
      await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps(
        {
          workspaceId,
          flatMapsKeys: ['flatObjectMetadataMaps', 'flatFieldMetadataMaps'],
        },
      );

    if (
      !isDefined(flatObjectMetadataMaps) ||
      !isDefined(flatFieldMetadataMaps)
    ) {
      return [];
    }

    const { idByNameSingular } = buildObjectIdByNameMaps(
      flatObjectMetadataMaps,
    );
    const objectMetadataId = idByNameSingular[objectNameSingular];

    if (!isDefined(objectMetadataId)) {
      return [];
    }

    return Object.values(flatFieldMetadataMaps.byUniversalIdentifier)
      .filter(
        (field): field is FlatFieldMetadata =>
          isDefined(field) &&
          field.objectMetadataId === objectMetadataId &&
          field.type === FieldMetadataType.ADDRESS &&
          field.isActive,
      )
      .map((field) => field.name);
  }
}
