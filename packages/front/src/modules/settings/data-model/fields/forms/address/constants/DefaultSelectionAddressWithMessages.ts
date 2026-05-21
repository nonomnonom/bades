import { msg } from '@lingui/core/macro';
import { DEFAULT_VISIBLE_ADDRESS_SUBFIELDS } from 'shared/constants';
import { type AllowedAddressSubField } from 'shared/types';

export const DEFAULT_SELECTION_ADDRESS_WITH_MESSAGES: {
  value: AllowedAddressSubField;
  label: ReturnType<typeof msg>;
}[] = DEFAULT_VISIBLE_ADDRESS_SUBFIELDS.map((value) => ({
  value,
  label: {
    addressStreet1: ""Address 1",
    addressStreet2: ""Address 2",
    addressCity: "Kota",
    addressState: "Negara bagian",
    addressPostcode: ""Postcode",
    addressCountry: "Negara",
  }[value],
}));
