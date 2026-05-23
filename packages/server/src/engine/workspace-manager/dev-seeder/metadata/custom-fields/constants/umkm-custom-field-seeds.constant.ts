import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const UMKM_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Usaha',
    name: 'namaUsaha',
    description: 'Nama UMKM',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Jenis Usaha',
    name: 'jenisUsaha',
    description: 'Jenis usaha',
    options: [
      { label: 'Produksi', value: 'PRODUKSI', position: 0 },
      { label: 'Jasa', value: 'JASA', position: 1 },
      { label: 'Perdagangan', value: 'PERDAGANGAN', position: 2 },
      { label: 'Pertanian', value: 'PERTANIAN', position: 3 },
      { label: 'Peternakan', value: 'PETERNAKAN', position: 4 },
      { label: 'Perikanan', value: 'PERIKANAN', position: 5 },
      { label: 'Kerajinan', value: 'KERAJINAN', position: 6 },
      { label: 'Lainnya', value: 'LAINNYA', position: 7 },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Pemilik',
    name: 'namaPemilik',
    description: 'Nama pemilik usaha',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Alamat',
    name: 'alamat',
    description: 'Alamat usaha',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'No. Registrasi',
    name: 'noRegistrasi',
    description: 'Nomor registrasi usaha',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Tenaga Kerja',
    name: 'tenagaKerja',
    description: 'Jumlah tenaga kerja',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Kontak',
    name: 'kontak',
    description: 'Nomor kontak',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keterangan',
    name: 'keterangan',
    description: 'Keterangan tambahan',
  },
];
