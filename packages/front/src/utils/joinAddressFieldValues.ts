import { type FieldAddressValue } from '@/object-record/record-field/ui/types/FieldMetadata';
import { isNonEmptyString } from '@sniptt/guards';
import { type AllowedAddressSubField } from 'shared/types';

const formatAddressSubFieldValue = (
  subField: AllowedAddressSubField,
  value: FieldAddressValue[AllowedAddressSubField],
): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (subField === 'addressLat' || subField === 'addressLng') {
    const numericValue =
      typeof value === 'number' ? value : Number.parseFloat(String(value));

    if (!Number.isFinite(numericValue)) {
      return null;
    }

    return String(numericValue);
  }

  return isNonEmptyString(value) ? value : null;
};

export const joinAddressFieldValues = (
  fieldValue: FieldAddressValue,
  subFields: AllowedAddressSubField[],
) => {
  return subFields
    .map((subField) =>
      formatAddressSubFieldValue(subField, fieldValue[subField]),
    )
    .filter((value): value is string => value !== null)
    .join(',');
};
