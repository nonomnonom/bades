import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { getEnabledAddressSubFields } from '@/object-metadata/utils/getEnabledAddressSubFields';
import { resolveAddressSortSubField } from '@/object-metadata/utils/resolveAddressSortSubField';
import { resolvePrimaryFullNameSortSubField } from '@/object-metadata/utils/resolvePrimaryFullNameSortSubField';
import { useLingui } from '~/utils/i18n/badesI18n';
import { ALLOWED_FULL_NAME_SORT_SUBFIELDS } from 'shared/constants';
import {
  type AllowedAddressSubField,
  type AllowedFullNameSortSubField,
  type FieldMetadataSettingsMapping,
} from 'shared/types';
import { FieldMetadataType } from '~/generated-metadata/graphql';

export type SortSubFieldChoice = {
  value: string;
  label: string;
};

export type SortSubFieldChoices = {
  options: SortSubFieldChoice[];
  selectedValue: string;
  selectedLabel: string;
};

export const useSortSubFieldChoicesForField = ({
  fieldMetadataItem,
  primaryCompositeSubField,
}: {
  fieldMetadataItem: Pick<FieldMetadataItem, 'type' | 'settings'>;
  primaryCompositeSubField: string | null | undefined;
}): SortSubFieldChoices | undefined => {
  const { t } = useLingui();

  if (fieldMetadataItem.type === FieldMetadataType.FULL_NAME) {
    const labels: Record<AllowedFullNameSortSubField, string> = {
      firstName: t`Nama depan`,
      lastName: t`Nama belakang`,
    };
    const selectedValue = resolvePrimaryFullNameSortSubField({
      requestedPrimarySubField: primaryCompositeSubField,
    });
    return {
      options: ALLOWED_FULL_NAME_SORT_SUBFIELDS.map((value) => ({
        value,
        label: labels[value],
      })),
      selectedValue,
      selectedLabel: labels[selectedValue],
    };
  }

  if (fieldMetadataItem.type === FieldMetadataType.ADDRESS) {
    const labels: Record<AllowedAddressSubField, string> = {
      addressStreet1: t`Alamat 1`,
      addressStreet2: t`Alamat 2`,
      addressCity: t`Kota`,
      addressState: t`Provinsi`,
      addressPostcode: t`Kode pos`,
      addressCountry: t`Negara`,
      addressLat: t`Lintang`,
      addressLng: t`Bujur`,
    };
    const addressSettings = fieldMetadataItem.settings as
      | FieldMetadataSettingsMapping[FieldMetadataType.ADDRESS]
      | null
      | undefined;
    const selectedValue = resolveAddressSortSubField({
      settings: addressSettings,
      primaryCompositeSubField,
    });
    return {
      options: getEnabledAddressSubFields(addressSettings).map((value) => ({
        value,
        label: labels[value],
      })),
      selectedValue,
      selectedLabel: labels[selectedValue],
    };
  }

  return undefined;
};
