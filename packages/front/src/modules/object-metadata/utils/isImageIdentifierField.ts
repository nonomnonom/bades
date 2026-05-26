import { CoreObjectNameSingular } from 'shared/types';
import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';

export const isImageIdentifierField = ({
  fieldMetadataItem,
  objectMetadataItem,
}: {
  fieldMetadataItem: Pick<FieldMetadataItem, 'id' | 'name'>;
  objectMetadataItem: Pick<
    EnrichedObjectMetadataItem,
    'imageIdentifierFieldMetadataId' | 'nameSingular'
  >;
}) => {
  // Bades: cek imageIdentifierFieldMetadataId standar
  return (
    fieldMetadataItem.id === objectMetadataItem.imageIdentifierFieldMetadataId
  );
};
