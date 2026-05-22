import { t } from '~/utils/i18n/badesI18n';
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
      return t`Pilih tindakan saat nomor telepon diklik`;
    case FieldMetadataType.EMAILS:
      return t`Pilih tindakan saat email diklik`;
    case FieldMetadataType.LINKS:
      return t`Pilih tindakan saat tautan diklik`;
    default:
      assertUnreachable(fieldType, `Invalid field type: ${fieldType}`);
  }
};
