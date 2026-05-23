import { FieldDateDisplayFormat } from '@/object-record/record-field/ui/types/FieldMetadata';
import { t } from '~/utils/i18n/badesI18n';

export const getDisplayFormatLabel = (
  displayFormat: FieldDateDisplayFormat,
) => {
  switch (displayFormat) {
    case FieldDateDisplayFormat.CUSTOM:
      return t`Kustom`;
    case FieldDateDisplayFormat.RELATIVE:
      return t`Relatif`;
    case FieldDateDisplayFormat.USER_SETTINGS:
      return t`Bawaan`;
    default:
      return '';
  }
};
