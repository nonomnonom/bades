import { type msg } from '~/utils/i18n/badesI18n';
import { DEFAULT_VISIBLE_ADDRESS_SUBFIELDS } from 'shared/constants';
import { type AllowedAddressSubField } from 'shared/types';

export const DEFAULT_SELECTION_ADDRESS_WITH_MESSAGES: {
  value: AllowedAddressSubField;
  label: ReturnType<typeof msg>;
}[] = DEFAULT_VISIBLE_ADDRESS_SUBFIELDS.map((value) => ({
  value,
  label: {
    addressStreet1: `Alamat 1`,
    addressStreet2: `Alamat 2`,
    addressCity: `Kota`,
    addressState: `Provinsi`,
    addressPostcode: `Kode Pos`,
    addressCountry: `Negara`,
    addressLat: `Lintang (Lat)`,
    addressLng: `Bujur (Lng)`,
  }[value],
}));
