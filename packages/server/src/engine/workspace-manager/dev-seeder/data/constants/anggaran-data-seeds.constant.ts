import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

type AnggaranDataSeed = {
  id: string;
  tahunAnggaran: string;
  jenisAnggaran: string;
  kodeRekening: string;
  namaAnggaran: string;
  jumlahAnggaran: number;
  sumberDana: string;
  keterangan: string;
  position: number;
};

export const ANGGARAN_DATA_SEED_COLUMNS: (keyof AnggaranDataSeed)[] = [
  'id',
  'tahunAnggaran',
  'jenisAnggaran',
  'kodeRekening',
  'namaAnggaran',
  'jumlahAnggaran',
  'sumberDana',
  'keterangan',
  'position',
];

export const ANGGARAN_DATA_SEED_IDS = {
  ANG_1: '20202020-a001-41e7-8c72-ba44072a4c58',
  ANG_2: '20202020-a002-4b3d-a89c-7f6c30df998a',
  ANG_3: '20202020-a003-422c-8fcf-5b7496f94975',
  ANG_4: '20202020-a004-4e9a-9fcf-5b7496f94976',
  ANG_5: '20202020-a005-5f0b-5acd-6c7507f05078',
};

export const ANGGARAN_DATA_SEEDS: AnggaranDataSeed[] = [
  {
    id: ANGGARAN_DATA_SEED_IDS.ANG_1,
    tahunAnggaran: '2024',
    jenisAnggaran: 'PENDAPATAN',
    kodeRekening: '4.1.1',
    namaAnggaran: 'Pendapatan Asli Desa',
    jumlahAnggaran: 150000000,
    sumberDana: 'PAD',
    keterangan: 'Pendapatan asli desa dari hasil usaha',
    position: 0,
  },
  {
    id: ANGGARAN_DATA_SEED_IDS.ANG_2,
    tahunAnggaran: '2024',
    jenisAnggaran: 'PENDAPATAN',
    kodeRekening: '4.1.2',
    namaAnggaran: 'Dana Desa',
    jumlahAnggaran: 850000000,
    sumberDana: 'APBN',
    keterangan: 'Dana desa dari pemerintah pusat',
    position: 1,
  },
  {
    id: ANGGARAN_DATA_SEED_IDS.ANG_3,
    tahunAnggaran: '2024',
    jenisAnggaran: 'BELANJA',
    kodeRekening: '5.1.1',
    namaAnggaran: 'Belanja Pegawai',
    jumlahAnggaran: 240000000,
    sumberDana: 'Dana Desa',
    keterangan: 'Gaji dan tunjangan perangkat desa',
    position: 2,
  },
  {
    id: ANGGARAN_DATA_SEED_IDS.ANG_4,
    tahunAnggaran: '2024',
    jenisAnggaran: 'BELANJA',
    kodeRekening: '5.1.2',
    namaAnggaran: 'Belanja Pembangunan',
    jumlahAnggaran: 500000000,
    sumberDana: 'Dana Desa',
    keterangan: 'Pembangunan infrastruktur desa',
    position: 3,
  },
  {
    id: ANGGARAN_DATA_SEED_IDS.ANG_5,
    tahunAnggaran: '2024',
    jenisAnggaran: 'BELANJA',
    kodeRekening: '5.1.3',
    namaAnggaran: 'Belanja Bantuan Sosial',
    jumlahAnggaran: 100000000,
    sumberDana: 'Dana Desa',
    keterangan: 'Bantuan sosial kepada masyarakat',
    position: 4,
  },
];
