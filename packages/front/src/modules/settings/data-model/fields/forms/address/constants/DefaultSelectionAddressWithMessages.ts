import { msg } from '~/utils/i18n/badesI18n';
import { DEFAULT_VISIBLE_ADDRESS_SUBFIELDS } from 'shared/constants';
import { type AllowedAddressSubField } from 'shared/types';

export const DEFAULT_SELECTION_ADDRESS_WITH_MESSAGES: {
  value: AllowedAddressSubField;
  label: ReturnType<typeof msg>;
}[] = DEFAULT_VISIBLE_ADDRESS_SUBFIELDS.map((value) => ({
  value,
  label: {
    addressStreet1: msg`Alamat 1`,
    addressStreet2: msg`Alamat 2`,
    addressCity: msg`Kota`,
    addressState: msg`Provinsi`,
    addressPostcode: msg`Kode Pos`,
    addressCountry: msg`Negara`,
  }[value],
}));
