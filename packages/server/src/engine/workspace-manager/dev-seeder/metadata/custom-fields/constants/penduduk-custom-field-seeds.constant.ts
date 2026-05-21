import { FieldMetadataType } from 'shared/types';

import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const PENDUDUK_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'NIK',
    name: 'nik',
    description: 'Nomor Induk Kependudukan',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Nomor KK',
    name: 'nomorKk',
    description: 'Nomor Kartu Keluarga',
  },
  {
    type: FieldMetadataType.FULL_NAME,
    label: 'Nama Lengkap',
    name: 'namaLengkap',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Tempat Lahir',
    name: 'tempatLahir',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Tanggal Lahir',
    name: 'tanggalLahir',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Jenis Kelamin',
    name: 'jenisKelamin',
    options: [
      { label: 'Laki-laki', value: 'LAKI_LAKI', position: 0, color: 'blue' },
      { label: 'Perempuan', value: 'PEREMPUAN', position: 1, color: 'red' },
    ],
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Agama',
    name: 'agama',
    options: [
      { label: 'Islam', value: 'ISLAM', position: 0, color: 'blue' },
      { label: 'Kristen', value: 'KRISTEN', position: 1, color: 'red' },
      { label: 'Katholik', value: 'KATHOLIK', position: 2, color: 'green' },
      { label: 'Hindu', value: 'HINDU', position: 3, color: 'yellow' },
      { label: 'Buddha', value: 'BUDDHA', position: 4, color: 'purple' },
      { label: 'Konghucu', value: 'KONGHUCU', position: 5, color: 'orange' },
    ],
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Status Perkawinan',
    name: 'statusPerkawinan',
    options: [
      { label: 'Belum Kawin', value: 'BELUM_KAWIN', position: 0, color: 'blue' },
      { label: 'Kawin', value: 'KAWIN', position: 1, color: 'red' },
      { label: 'Cerai Hidup', value: 'CERAI_HIDUP', position: 2, color: 'green' },
      { label: 'Cerai Mati', value: 'CERAI_MATI', position: 3, color: 'yellow' },
    ],
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Pendidikan',
    name: 'pendidikan',
    options: [
      { label: 'Tidak/Belum Sekolah', value: 'TIDAK_SEKOLAH', position: 0, color: 'gray' },
      { label: 'SD/Sederajat', value: 'SD', position: 1, color: 'blue' },
      { label: 'SMP/Sederajat', value: 'SMP', position: 2, color: 'red' },
      { label: 'SMA/Sederajat', value: 'SMA', position: 3, color: 'green' },
      { label: 'D1', value: 'D1', position: 4, color: 'yellow' },
      { label: 'D2', value: 'D2', position: 5, color: 'purple' },
      { label: 'D3', value: 'D3', position: 6, color: 'orange' },
      { label: 'S1', value: 'S1', position: 7, color: 'cyan' },
      { label: 'S2', value: 'S2', position: 8, color: 'pink' },
      { label: 'S3', value: 'S3', position: 9, color: 'indigo' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Pekerjaan',
    name: 'pekerjaan',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Golongan Darah',
    name: 'golonganDarah',
    options: [
      { label: 'A', value: 'A', position: 0, color: 'red' },
      { label: 'B', value: 'B', position: 1, color: 'yellow' },
      { label: 'AB', value: 'AB', position: 2, color: 'purple' },
      { label: 'O', value: 'O', position: 3, color: 'blue' },
      { label: 'Tidak Tahu', value: 'TIDAK_TAHU', position: 4, color: 'gray' },
    ],
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Kewarganegaraan',
    name: 'kewarganegaraan',
    options: [
      { label: 'WNI', value: 'WNI', position: 0, color: 'blue' },
      { label: 'WNA', value: 'WNA', position: 1, color: 'red' },
    ],
  },
  {
    type: FieldMetadataType.ADDRESS,
    label: 'Alamat',
    name: 'alamat',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'RT',
    name: 'rt',
    description: 'Nomor RT',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'RW',
    name: 'rw',
    description: 'Nomor RW',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Dusun',
    name: 'dusun',
    description: 'Nama DBSusun',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Status Hubungan dalam Keluarga',
    name: 'statusHubunganKeluarga',
    options: [
      { label: 'Kepala Keluarga', value: 'KEPALA_KELUARGA', position: 0, color: 'blue' },
      { label: 'Suami', value: 'SUAMI', position: 1, color: 'red' },
      { label: 'Istri', value: 'ISTRI', position: 2, color: 'green' },
      { label: 'Anak', value: 'ANAK', position: 3, color: 'yellow' },
      { label: 'Menantu', value: 'MENANTU', position: 4, color: 'purple' },
      { label: 'Cucu', value: 'CUCU', position: 5, color: 'orange' },
      { label: 'Orang Tua', value: 'ORANG_TUA', position: 6, color: 'cyan' },
      { label: 'Mertua', value: 'MERTUA', position: 7, color: 'pink' },
      { label: 'Famili Lain', value: 'FAMILI_LAIN', position: 8, color: 'gray' },
      { label: 'Pembantu', value: 'PEMBANTU', position: 9, color: 'indigo' },
    ],
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Tipe Warga',
    name: 'tipeWarga',
    options: [
      { label: 'Tetap', value: 'TETAP', position: 0, color: 'blue' },
      { label: 'Tidak Tetap', value: 'TIDAK_TETAP', position: 1, color: 'red' },
    ],
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Status Hidup',
    name: 'statusHidup',
    options: [
      { label: 'Hidup', value: 'HIDUP', position: 0, color: 'green' },
      { label: 'Meninggal', value: 'MENINGGAL', position: 1, color: 'gray' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'NIK Ayah',
    name: 'nikAyah',
    description: 'NIK Ayah Kandung',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'NIK Ibu',
    name: 'nikIbu',
    description: 'NIK Ibu Kandung',
  },
  {
    type: FieldMetadataType.LINKS,
    label: 'Foto',
    name: 'foto',
    description: 'Link foto penduduk',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Tanggal Sinkronisasi Dukcapil',
    name: 'tanggalSinkronisasiDukcapil',
    description: 'Tanggal terakhir data disinkronkan dengan Dukcapil',
  },
];