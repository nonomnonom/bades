import { type CompositeFieldType } from '@/settings/data-model/types/CompositeFieldType';
import { FieldMetadataType } from 'shared/types';

export const COMPOSITE_FIELD_SUB_FIELD_LABELS: {
  [key in CompositeFieldType]: Record<string, string>;
} = {
  [FieldMetadataType.CURRENCY]: {
    amountMicros: 'Nominal',
    currencyCode: 'Mata Uang',
  },
  [FieldMetadataType.EMAILS]: {
    primaryEmail: 'Email Utama',
    additionalEmails: 'Email Tambahan',
  },
  [FieldMetadataType.LINKS]: {
    primaryLinkLabel: 'Label Tautan',
    primaryLinkUrl: 'URL Tautan',
    secondaryLinks: 'Tautan Sekunder',
  },
  [FieldMetadataType.PHONES]: {
    primaryPhoneNumber: 'Nomor Telepon Utama',
    primaryPhoneCountryCode: 'Kode Negara Telepon Utama',
    primaryPhoneCallingCode: 'Kode Panggil Telepon Utama',
    additionalPhones: 'Telepon Tambahan',
  },
  [FieldMetadataType.FULL_NAME]: {
    firstName: 'Nama Depan',
    lastName: 'Nama Belakang',
  },
  [FieldMetadataType.ADDRESS]: {
    addressStreet1: 'Alamat 1',
    addressStreet2: 'Alamat 2',
    addressCity: 'Kota',
    addressState: 'Provinsi',
    addressCountry: 'Negara',
    addressPostcode: 'Kode Pos',
    addressLat: 'Lintang',
    addressLng: 'Bujur',
  },
  [FieldMetadataType.ACTOR]: {
    source: 'Sumber',
    name: 'Nama',
    workspaceMemberId: 'Anggota Ruang Kerja',
    context: 'Konteks',
  },
  [FieldMetadataType.RICH_TEXT]: {
    blocknote: 'BlockNote',
    markdown: 'Markdown',
  },
};
