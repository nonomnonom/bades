import { FieldMetadataType } from 'shared/types';
import { assertUnreachable } from 'shared/utils';

export const getSettingsDataModelFieldOnClickActionDescription = (
  fieldType:
    | FieldMetadataType.PHONES
    | FieldMetadataType.EMAILS
    | FieldMetadataType.LINKS,
) => {
  switch (fieldType) {
    case FieldMetadataType.PHONES:
      return `Pilih tindakan saat nomor telepon diklik`;
    case FieldMetadataType.EMAILS:
      return `Pilih tindakan saat email diklik`;
    case FieldMetadataType.LINKS:
      return `Pilih tindakan saat tautan diklik`;
    default:
      assertUnreachable(fieldType, `Invalid field type: ${fieldType}`);
  }
};
