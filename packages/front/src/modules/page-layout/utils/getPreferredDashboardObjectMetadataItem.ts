import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';

export const getPreferredDashboardObjectMetadataItem = (
  readableObjectMetadataItems: EnrichedObjectMetadataItem[],
): EnrichedObjectMetadataItem | undefined => {
  const pendudukObjectMetadataItem = readableObjectMetadataItems.find(
    (objectMetadataItem) => objectMetadataItem.nameSingular === 'penduduk',
  );

  if (pendudukObjectMetadataItem) {
    return pendudukObjectMetadataItem;
  }

  return [...readableObjectMetadataItems].sort((first, second) =>
    first.labelPlural.localeCompare(second.labelPlural),
  )[0];
};
