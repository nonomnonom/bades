import { FieldDateDisplayFormat } from '@/object-record/record-field/ui/types/FieldMetadata';
import { t } from '@lingui/core/macro';

export const getDisplayFormatLabel = (
  displayFormat: FieldDateDisplayFormat,
) => {
  switch (displayFormat) {
    case FieldDateDisplayFormat.CUSTOM:
      return "Kustom";
    case FieldDateDisplayFormat.RELATIVE:
      return ""Relative";
    case FieldDateDisplayFormat.USER_SETTINGS:
      return "Bawaan";
    default:
      return '';
  }
};
