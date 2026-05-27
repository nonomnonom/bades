import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const KELUARGA_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Nomor KK',
    name: 'nomorKk',
    description: 'Nomor Kartu Keluarga',
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
    description: 'Tanggal KK dibuat',
  },
  {
    type: FieldMetadataType.ADDRESS,
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
    description:
      'Klasifikasi sosial-ekonomi keluarga (KS1/KS2/KS3/Plus sesuai indikator BPS)',
    options: [
      { label: 'KS1 (Miskin)', value: 'KS1', position: 0, color: 'red' },
      {
        label: 'KS2 (Hampir Miskin)',
        value: 'KS2',
        position: 1,
        color: 'orange',
      },
      { label: 'KS3 (Menengah)', value: 'KS3', position: 2, color: 'yellow' },
      { label: 'KS3+ (Mampu)', value: 'KS3_PLUS', position: 3, color: 'green' },
    ],
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Jenis Rumah',
    name: 'jenisRumah',
    description: 'Jenis bangunan tempat tinggal',
    options: [
      { label: 'Permanen', value: 'PERMANEN', position: 0, color: 'green' },
      {
        label: 'Semi Permanen',
        value: 'SEMI_PERMANEN',
        position: 1,
        color: 'yellow',
      },
      {
        label: 'Tidak Permanen',
        value: 'TIDAK_PERMANEN',
        position: 2,
        color: 'red',
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
        color: 'green',
      },
      { label: 'Sewa', value: 'SEWA', position: 1, color: 'blue' },
      { label: 'Kontrak', value: 'KONTRAK', position: 2, color: 'orange' },
      {
        label: 'Numpang/Menumpang',
        value: 'NUMPANG',
        position: 3,
        color: 'gray',
      },
      { label: 'Lainnya', value: 'LAINNYA', position: 4, color: 'purple' },
    ],
  },
  {
    type: FieldMetadataType.CURRENCY,
    label: 'Pendapatan Bulanan',
    name: 'pendapatanBulanan',
    description: 'Estimasi pendapatan bulanan keluarga (Rupiah)',
  },
  // Indikator Pendataan Keluarga BPS
  {
    type: FieldMetadataType.SELECT,
    label: 'Sumber Air Bersih',
    name: 'sumberAir',
    description: 'Sumber air bersih utama keluarga',
    options: [
      { label: 'PDAM/Ledeng', value: 'PDAM', position: 0, color: 'blue' },
      { label: 'Sumur Bor', value: 'SUMUR_BOR', position: 1, color: 'sky' },
      {
        label: 'Sumur Gali',
        value: 'SUMUR_GALI',
        position: 2,
        color: 'turquoise',
      },
      { label: 'Mata Air', value: 'MATA_AIR', position: 3, color: 'green' },
      { label: 'Air Hujan', value: 'AIR_HUJAN', position: 4, color: 'gray' },
      { label: 'Lainnya', value: 'LAINNYA', position: 5, color: 'orange' },
    ],
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Sumber Listrik',
    name: 'sumberListrik',
    description: 'Sumber penerangan utama keluarga',
    options: [
      { label: 'PLN', value: 'PLN', position: 0, color: 'yellow' },
      { label: 'Non-PLN', value: 'NON_PLN', position: 1, color: 'orange' },
      {
        label: 'Tanpa Listrik',
        value: 'TANPA_LISTRIK',
        position: 2,
        color: 'gray',
      },
    ],
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Fasilitas Sanitasi',
    name: 'sanitasi',
    description: 'Fasilitas tempat buang air besar utama',
    options: [
      { label: 'Sendiri', value: 'SENDIRI', position: 0, color: 'green' },
      { label: 'Bersama', value: 'BERSAMA', position: 1, color: 'turquoise' },
      { label: 'Umum (MCK)', value: 'UMUM', position: 2, color: 'blue' },
      { label: 'Tidak Ada', value: 'TIDAK_ADA', position: 3, color: 'red' },
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
        color: 'orange',
      },
      {
        label: 'Minyak Tanah',
        value: 'MINYAK_TANAH',
        position: 1,
        color: 'yellow',
      },
      { label: 'Kayu Bakar', value: 'KAYU_BAKAR', position: 2, color: 'sky' },
      { label: 'Listrik', value: 'LISTRIK', position: 3, color: 'blue' },
      { label: 'Lainnya', value: 'LAINNYA', position: 4, color: 'gray' },
    ],
  },
];
