import { FieldDateDisplayFormat } from '@/object-record/record-field/ui/types/FieldMetadata';
export const getDisplayFormatLabel = (
  displayFormat: FieldDateDisplayFormat,
) => {
  switch (displayFormat) {
    case FieldDateDisplayFormat.CUSTOM:
      return `Kustom`;
    case FieldDateDisplayFormat.RELATIVE:
      return `Relatif`;
    case FieldDateDisplayFormat.USER_SETTINGS:
      return `Bawaan`;
    default:
      return '';
  }
};
