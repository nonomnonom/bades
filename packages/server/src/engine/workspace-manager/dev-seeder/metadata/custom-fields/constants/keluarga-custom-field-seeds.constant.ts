import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const KELUARGA_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Nomor KK',
    name: 'nomorKk',
    description: 'Nomor Kartu Keluarga',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Kepala Keluarga',
    name: 'namaKepalaKeluarga',
    description: 'Nama kepala keluarga',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Tanggal Pembuatan',
    name: 'tanggalPembuatan',
    description: 'Tanggal KK dibuat',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Alamat',
    name: 'alamat',
    description: 'Alamat lengkap keluarga',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'RT',
    name: 'rt',
    description: 'Rukun Tetangga',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'RW',
    name: 'rw',
    description: 'Rukun Warga',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Desa/Kelurahan',
    name: 'desa',
    description: 'Desa atau kelurahan',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Kecamatan',
    name: 'kecamatan',
    description: 'Kecamatan',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Kabupaten/Kota',
    name: 'kabupaten',
    description: 'Kabupaten atau kota',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Jumlah Anggota',
    name: 'jumlahAnggota',
    description: 'Jumlah anggota keluarga',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Kode Pos',
    name: 'kodePos',
    description: 'Kode pos',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Klasifikasi Keluarga',
    name: 'klasifikasiKeluarga',
    description: 'Klasifikasi berdasarkan status sosial',
    options: [
      { label: 'Miskin', value: 'MISKIN', position: 0 },
      { label: 'Menengah', value: 'MENENGAH', position: 1 },
      { label: 'Mampu', value: 'MAMPU', position: 2 },
    ],
  },
];