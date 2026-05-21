type UmkmDataSeed = {
  id: string;
  namaUsaha: string;
  jenisUsaha: string;
  namaPemilik: string;
  alamat: string;
  noRegistrasi: string;
  tenagaKerja: number;
  kontak: string;
  keterangan: string;
  position: number;
};

export const UMKM_DATA_SEED_COLUMNS: (keyof UmkmDataSeed)[] = [
  'id',
  'namaUsaha',
  'jenisUsaha',
  'namaPemilik',
  'alamat',
  'noRegistrasi',
  'tenagaKerja',
  'kontak',
  'keterangan',
  'position',
];

export const UMKM_DATA_SEED_IDS = {
  UMK_1: '20202020-u001-41e7-8c72-ba44072a4c58',
  UMK_2: '20202020-u002-4b3d-a89c-7f6c30df998a',
  UMK_3: '20202020-u003-422c-8fcf-5b7496f94975',
  UMK_4: '20202020-u004-4e9a-9fcf-5b7496f94976',
};

export const UMKM_DATA_SEEDS: UmkmDataSeed[] = [
  {
    id: UMKM_DATA_SEED_IDS.UMK_1,
    namaUsaha: 'Warung Makan Ibu Kasiah',
    jenisUsaha: 'PERDAGANGAN',
    namaPemilik: 'Kasiah',
    alamat: 'Jl. Desa Sukamaju No. 5',
    noRegistrasi: 'UMKM/2023/001',
    tenagaKerja: 2,
    kontak: '081234567801',
    keterangan: 'Warung makan prasmanan',
    position: 0,
  },
  {
    id: UMKM_DATA_SEED_IDS.UMK_2,
    namaUsaha: 'Kerajinan Bambu Jaya',
    jenisUsaha: 'KERAJINAN',
    namaPemilik: 'Hendra',
    alamat: 'Jl. Desa Mekar Sari No. 12',
    noRegistrasi: 'UMKM/2023/002',
    tenagaKerja: 5,
    kontak: '081234567802',
    keterangan: 'Pembuatan keranjang dan furniture bambu',
    position: 1,
  },
  {
    id: UMKM_DATA_SEED_IDS.UMK_3,
    namaUsaha: 'Ternak Ayam Petelur',
    jenisUsaha: 'PETERNAKAN',
    namaPemilik: 'Budi Santoso',
    alamat: 'Jl. Desa Sukamaju RT 003',
    noRegistrasi: 'UMKM/2023/003',
    tenagaKerja: 3,
    kontak: '081234567803',
    keterangan: 'Peternakan ayam petelur 500 ekor',
    position: 2,
  },
  {
    id: UMKM_DATA_SEED_IDS.UMK_4,
    namaUsaha: 'Kue Kering Manis',
    jenisUsaha: 'PRODUKSI',
    namaPemilik: 'Siti Aminah',
    alamat: 'Jl. Desa Sukamaju RT 002',
    noRegistrasi: 'UMKM/2023/004',
    tenagaKerja: 4,
    kontak: '081234567804',
    keterangan: 'Produksi kue kering untuk pasok supermarket',
    position: 3,
  },
];