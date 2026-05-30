import { getLabelIdentifierFieldMetadataItem } from '@/object-metadata/utils/getLabelIdentifierFieldMetadataItem';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { useRecordMapContextOrThrow } from '@/object-record/record-map/contexts/RecordMapContext';
import { recordMapFieldMetadataIdState } from '@/object-record/record-map/states/recordMapFieldMetadataIdState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useMemo } from 'react';
import { isDefined } from 'shared/utils';

export type MapMarkerRecord = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

export const useRecordMapRecords = () => {
  const { objectNameSingular, objectMetadataItem } =
    useRecordMapContextOrThrow();

  const recordMapFieldMetadataId = useAtomStateValue(
    recordMapFieldMetadataIdState,
  );

  const addressFieldMetadataItem = useMemo(() => {
    if (isDefined(recordMapFieldMetadataId)) {
      return objectMetadataItem.fields.find(
        (field) => field.id === recordMapFieldMetadataId,
      );
    }
    return objectMetadataItem.fields.find(
      (field) => field.type === 'ADDRESS' && field.isActive,
    );
  }, [objectMetadataItem.fields, recordMapFieldMetadataId]);

  const { records, loading } = useFindManyRecords({
    objectNameSingular,
    skip: !isDefined(addressFieldMetadataItem),
  });

  const labelIdentifierFieldName = useMemo(() => {
    const labelField = getLabelIdentifierFieldMetadataItem(objectMetadataItem);
    return labelField?.name ?? 'id';
  }, [objectMetadataItem]);

  const mapMarkers: MapMarkerRecord[] = useMemo(() => {
    if (!isDefined(addressFieldMetadataItem)) {
      return [];
    }

    const fieldName = addressFieldMetadataItem.name;

    return records
      .map((record: Record<string, unknown>) => {
        const addressValue = record[fieldName] as Record<string, unknown> | null;
        if (!isDefined(addressValue)) {
          return null;
        }

        const lat = addressValue.addressLat as number | null;
        const lng = addressValue.addressLng as number | null;

        if (!isDefined(lat) || !isDefined(lng)) {
          return null;
        }

        const name =
          (record[labelIdentifierFieldName] as string) ?? record.id;

        return {
          id: record.id as string,
          name,
          lat,
          lng,
        } satisfies MapMarkerRecord;
      })
      .filter(isDefined);
  }, [records, addressFieldMetadataItem, labelIdentifierFieldName]);

  return {
    mapMarkers,
    loading,
    addressFieldMetadataItem,
    objectNameSingular,
  };
};
