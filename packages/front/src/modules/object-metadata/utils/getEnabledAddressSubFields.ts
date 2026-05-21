import { DEFAULT_VISIBLE_ADDRESS_SUBFIELDS } from 'shared/constants';
import {
  type AllowedAddressSubField,
  type FieldMetadataSettingsMapping,
  type FieldMetadataType,
} from 'shared/types';
import { isNonEmptyArray } from 'shared/utils';

export const getEnabledAddressSubFields = (
  settings:
    | FieldMetadataSettingsMapping[FieldMetadataType.ADDRESS]
    | null
    | undefined,
): readonly AllowedAddressSubField[] => {
  if (isNonEmptyArray(settings?.subFields)) {
    return settings.subFields;
  }
  return DEFAULT_VISIBLE_ADDRESS_SUBFIELDS;
};
