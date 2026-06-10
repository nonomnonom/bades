import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/sid-standard-seed/constants/types/field-metadata-seed.type';

export const KELUARGA_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Nomor KK',
    name: 'nomorKk',
    description: 'Nomor Kartu Keluarga (16 digit)',
    isUnique: true,
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
    description: 'Tanggal KK diterbitkan',
  },
  {
    type: FieldMetadataType.ADDRESS,
    label: 'Alamat',
    name: 'alamat',
    description: 'Alamat lengkap domisili keluarga (jalan, desa/kel, kecamatan, kab/kota, kode pos)',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Jumlah Anggota',
    name: 'jumlahAnggota',
    description: 'Jumlah anggota keluarga',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Klasifikasi Keluarga',
    name: 'klasifikasiKeluarga',
    description:
      'Klasifikasi sosial-ekonomi keluarga (KS1/KS2/KS3/Plus sesuai indikator BPS)',
    options: [
      { label: 'KS1 (Miskin)', value: 'KS1', position: 0 },
      {
        label: 'KS2 (Hampir Miskin)',
        value: 'KS2',
        position: 1,
      },
      {
        label: 'KS3 (Menengah)',
        value: 'KS3',
        position: 2,
      },
      {
        label: 'KS3+ (Mampu)',
        value: 'KS3_PLUS',
        position: 3,
      },
    ],
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Jenis Rumah',
    name: 'jenisRumah',
    description: 'Jenis bangunan tempat tinggal',
    options: [
      { label: 'Permanen', value: 'PERMANEN', position: 0 },
      {
        label: 'Semi Permanen',
        value: 'SEMI_PERMANEN',
        position: 1,
      },
      {
        label: 'Tidak Permanen',
        value: 'TIDAK_PERMANEN',
        position: 2,
      },
    ],
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Status Kepemilikan Rumah',
    name: 'statusKepemilikanRumah',
    description: 'Status kepemilikan tempat tinggal',
    options: [
      {
        label: 'Milik Sendiri',
        value: 'MILIK_SENDIRI',
        position: 0,
      },
      { label: 'Sewa', value: 'SEWA', position: 1 },
      { label: 'Kontrak', value: 'KONTRAK', position: 2 },
      {
        label: 'Numpang/Menumpang',
        value: 'NUMPANG',
        position: 3,
      },
      { label: 'Lainnya', value: 'LAINNYA', position: 4 },
    ],
  },
  {
    type: FieldMetadataType.CURRENCY,
    label: 'Pendapatan Bulanan',
    name: 'pendapatanBulanan',
    description: 'Estimasi pendapatan bulanan keluarga (Rupiah)',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Sumber Air Bersih',
    name: 'sumberAir',
    description: 'Sumber air bersih utama keluarga',
    options: [
      { label: 'PDAM/Ledeng', value: 'PDAM', position: 0 },
      { label: 'Sumur Bor', value: 'SUMUR_BOR', position: 1 },
      {
        label: 'Sumur Gali',
        value: 'SUMUR_GALI',
        position: 2,
      },
      { label: 'Mata Air', value: 'MATA_AIR', position: 3 },
      { label: 'Air Hujan', value: 'AIR_HUJAN', position: 4 },
      { label: 'Lainnya', value: 'LAINNYA', position: 5 },
    ],
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Sumber Listrik',
    name: 'sumberListrik',
    description: 'Sumber penerangan utama keluarga',
    options: [
      { label: 'PLN', value: 'PLN', position: 0 },
      { label: 'Non-PLN', value: 'NON_PLN', position: 1 },
      {
        label: 'Tanpa Listrik',
        value: 'TANPA_LISTRIK',
        position: 2,
      },
    ],
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Fasilitas Sanitasi',
    name: 'sanitasi',
    description: 'Fasilitas tempat buang air besar utama',
    options: [
      { label: 'Sendiri', value: 'SENDIRI', position: 0 },
      { label: 'Bersama', value: 'BERSAMA', position: 1 },
      { label: 'Umum (MCK)', value: 'UMUM', position: 2 },
      { label: 'Tidak Ada', value: 'TIDAK_ADA', position: 3 },
    ],
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Bahan Bakar Memasak',
    name: 'bahanBakarMemasak',
    description: 'Bahan bakar utama untuk memasak',
    options: [
      {
        label: 'Gas Elpiji',
        value: 'GAS_ELPIJI',
        position: 0,
      },
      {
        label: 'Minyak Tanah',
        value: 'MINYAK_TANAH',
        position: 1,
      },
      { label: 'Kayu Bakar', value: 'KAYU_BAKAR', position: 2 },
      { label: 'Listrik', value: 'LISTRIK', position: 3 },
      { label: 'Lainnya', value: 'LAINNYA', position: 4 },
    ],
  },
];
