import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { FieldMetadataType } from '~/generated-metadata/graphql';

// TODO: Refactor with composite filters
export const getAdvancedFilterInputPlaceholderText = (
  fieldMetadataItem: FieldMetadataItem,
) => {
  switch (fieldMetadataItem.type) {
    case FieldMetadataType.TEXT:
    case FieldMetadataType.ADDRESS:
    case FieldMetadataType.LINKS:
    case FieldMetadataType.EMAILS:
    case FieldMetadataType.NUMERIC:
    case FieldMetadataType.RATING:
    case FieldMetadataType.PHONES:
    case FieldMetadataType.ARRAY:
    case FieldMetadataType.FULL_NAME:
      return `Masukkan nilai untuk ${fieldMetadataItem.label}`;
    case FieldMetadataType.NUMBER:
      return 'Masukkan angka';
    case FieldMetadataType.DATE:
    case FieldMetadataType.DATE_TIME:
      return 'Masukkan tanggal';
    case FieldMetadataType.ACTOR:
      return 'Pilih pelaku';
    case FieldMetadataType.RELATION:
      return `Pilih ${fieldMetadataItem.relation?.targetObjectMetadata.nameSingular}`;
    case FieldMetadataType.SELECT:
    case FieldMetadataType.MULTI_SELECT:
      return `Pilih ${fieldMetadataItem.label}`;

    default:
      return 'Masukkan nilai';
  }
};
