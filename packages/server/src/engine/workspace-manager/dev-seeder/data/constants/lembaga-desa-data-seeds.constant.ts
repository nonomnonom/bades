import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

type LembagaDesaDataSeed = {
  id: string;
  namaLembaga: string;
  jenisLembaga: string;
  alamat: string;
  namaKetua: string;
  kontak: string;
  keterangan: string;
  position: number;
};

export const LEMBAGA_DESA_DATA_SEED_COLUMNS: (keyof LembagaDesaDataSeed)[] = [
  'id',
  'namaLembaga',
  'jenisLembaga',
  'alamat',
  'namaKetua',
  'kontak',
  'keterangan',
  'position',
];

export const LEMBAGA_DESA_DATA_SEED_IDS = {
  LEMBAGA_1: '20202020-e001-41e7-8c72-ba44072a4c58',
  LEMBAGA_2: '20202020-e002-4b3d-a89c-7f6c30df998a',
  LEMBAGA_3: '20202020-e003-422c-8fcf-5b7496f94975',
  LEMBAGA_4: '20202020-e004-4e9a-9fcf-5b7496f94976',
};

export const LEMBAGA_DESA_DATA_SEEDS: LembagaDesaDataSeed[] = [
  {
    id: LEMBAGA_DESA_DATA_SEED_IDS.LEMBAGA_1,
    namaLembaga: 'Badan Permusyawaratan Desa',
    jenisLembaga: 'BPD',
    alamat: 'Jl. Desa Sukamaju No. 1',
    namaKetua: 'H. Mahmud',
    kontak: '081234567890',
    keterangan: 'BPD Desa Sukamaju',
    position: 0,
  },
  {
    id: LEMBAGA_DESA_DATA_SEED_IDS.LEMBAGA_2,
    namaLembaga: 'Tim Penggerak PKK',
    jenisLembaga: 'PKK',
    alamat: 'Jl. Desa Sukamaju No. 2',
    namaKetua: 'Ibu Ratna',
    kontak: '081234567891',
    keterangan: 'PKK Desa Sukamaju',
    position: 1,
  },
  {
    id: LEMBAGA_DESA_DATA_SEED_IDS.LEMBAGA_3,
    namaLembaga: 'Karang Taruna Desa',
    jenisLembaga: 'KARANG_TARUNA',
    alamat: 'Jl. Desa Sukamaju No. 3',
    namaKetua: 'Dedi Kurniawan',
    kontak: '081234567892',
    keterangan: 'Organisasi pemuda desa',
    position: 2,
  },
  {
    id: LEMBAGA_DESA_DATA_SEED_IDS.LEMBAGA_4,
    namaLembaga: 'Posyandu Mekar',
    jenisLembaga: 'POSYANDU',
    alamat: 'Jl. Desa Sukamaju RT 001',
    namaKetua: 'Ibu Siti',
    kontak: '081234567893',
    keterangan: 'Posyandu Balita dan Lansia',
    position: 3,
  },
];
