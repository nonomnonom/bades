import { getLabelIdentifierFieldMetadataItem } from '@/object-metadata/utils/getLabelIdentifierFieldMetadataItem';
import { getLabelIdentifierFieldValue } from '@/object-metadata/utils/getLabelIdentifierFieldValue';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { useRelevantRecordsGqlFields } from '@/object-record/record-field/hooks/useRelevantRecordsGqlFields';
import { useFindManyRecordIndexTableParams } from '@/object-record/record-index/hooks/useFindManyRecordIndexTableParams';
import { useRecordIndexContextOrThrow } from '@/object-record/record-index/contexts/RecordIndexContext';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { useRecordMapContextOrThrow } from '@/object-record/record-map/contexts/RecordMapContext';
import { recordMapFieldMetadataIdComponentState } from '@/object-record/record-map/states/recordMapFieldMetadataIdComponentState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useGetCurrentViewOnly } from '@/views/hooks/useGetCurrentViewOnly';
import { useMemo } from 'react';
import { isDefined } from 'shared/utils';
import { canBeCastAsNumberOrNull } from '~/utils/cast-as-number-or-null';

export const MAP_RECORD_LIMIT = 3000;

export type MapMarkerRecord = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string | null;
};

const SKIP_NULL_ISLAND = true;

const isNullIsland = (lat: number, lng: number): boolean =>
  lat === 0 && lng === 0;

const coerceCoordinate = (value: unknown): number | null => {
  if (!canBeCastAsNumberOrNull(value as string | number | null | undefined)) {
    return null;
  }

  if (value === null || value === undefined || value === '') {
    return null;
  }

  return typeof value === 'number' ? value : Number(value);
};

const isValidCoordinate = (
  lat: unknown,
  lng: unknown,
): { lat: number; lng: number } | null => {
  const parsedLat = coerceCoordinate(lat);
  const parsedLng = coerceCoordinate(lng);

  if (parsedLat === null || parsedLng === null) {
    return null;
  }

  if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) {
    return null;
  }
  if (
    parsedLat < -90 ||
    parsedLat > 90 ||
    parsedLng < -180 ||
    parsedLng > 180
  ) {
    return null;
  }
  if (SKIP_NULL_ISLAND && isNullIsland(parsedLat, parsedLng)) {
    return null;
  }

  return { lat: parsedLat, lng: parsedLng };
};

export const useRecordMapRecords = () => {
  const { objectNameSingular, objectMetadataItem } =
    useRecordMapContextOrThrow();
  const { recordIndexId } = useRecordIndexContextOrThrow();
  const { currentView } = useGetCurrentViewOnly();

  const recordMapFieldMetadataId = useAtomComponentStateValue(
    recordMapFieldMetadataIdComponentState,
    recordIndexId,
  );

  const viewMapFieldMetadataId =
    currentView?.type === 'MAP' ? currentView.mapFieldMetadataId : null;

  const addressFieldMetadataItem = useMemo(() => {
    if (isDefined(recordMapFieldMetadataId)) {
      return objectMetadataItem.fields.find(
        (field) => field.id === recordMapFieldMetadataId,
      );
    }
    if (isDefined(viewMapFieldMetadataId)) {
      return objectMetadataItem.fields.find(
        (field) => field.id === viewMapFieldMetadataId,
      );
    }
    return objectMetadataItem.fields.find(
      (field) => field.type === 'ADDRESS' && field.isActive,
    );
  }, [
    objectMetadataItem.fields,
    recordMapFieldMetadataId,
    viewMapFieldMetadataId,
  ]);

  const categoryFieldMetadataItem = useMemo(() => {
    return (
      objectMetadataItem.fields.find(
        (field) =>
          field.type === 'SELECT' &&
          field.isActive &&
          field.name !== 'id' &&
          field.name !== 'position',
      ) ?? null
    );
  }, [objectMetadataItem.fields]);

  const tableParams = useFindManyRecordIndexTableParams(
    objectNameSingular,
    recordIndexId,
  );

  const recordGqlFields = useRelevantRecordsGqlFields({
    objectMetadataItem,
    additionalFieldMetadataId: addressFieldMetadataItem?.id ?? null,
  });

  const { records, loading, totalCount } = useFindManyRecords({
    ...tableParams,
    objectNameSingular,
    skip: !isDefined(addressFieldMetadataItem),
    limit: MAP_RECORD_LIMIT,
    recordGqlFields,
  });

  const labelIdentifierFieldMetadataItem = useMemo(
    () => getLabelIdentifierFieldMetadataItem(objectMetadataItem),
    [objectMetadataItem],
  );

  const mapMarkers: MapMarkerRecord[] = useMemo(() => {
    if (!isDefined(addressFieldMetadataItem)) {
      return [];
    }

    const fieldName = addressFieldMetadataItem.name;
    const categoryFieldName = categoryFieldMetadataItem?.name ?? null;

    return records
      .map((record: Record<string, unknown>) => {
        const addressValue = record[fieldName] as Record<
          string,
          unknown
        > | null;
        if (!isDefined(addressValue)) {
          return null;
        }

        const lat = addressValue.addressLat;
        const lng = addressValue.addressLng;

        const validCoords = isValidCoordinate(lat, lng);

        if (!validCoords) {
          return null;
        }

        const name =
          getLabelIdentifierFieldValue(
            record as ObjectRecord,
            labelIdentifierFieldMetadataItem,
          ).trim() || String(record.id);

        const category =
          categoryFieldName !== null
            ? ((record[categoryFieldName] as string | null) ?? null)
            : null;

        return {
          id: record.id as string,
          name,
          lat: validCoords.lat,
          lng: validCoords.lng,
          category,
        } satisfies MapMarkerRecord;
      })
      .filter(isDefined);
  }, [
    records,
    addressFieldMetadataItem,
    labelIdentifierFieldMetadataItem,
    categoryFieldMetadataItem,
  ]);

  return {
    mapMarkers,
    loading,
    totalCount,
    addressFieldMetadataItem,
    categoryFieldMetadataItem,
    objectNameSingular,
  };
};
