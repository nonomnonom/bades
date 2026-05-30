import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

type KeluargaDataSeed = {
  id: string;
  nomorKk: string;
  namaKepalaKeluarga: string;
  tanggalPembuatan: string;
  alamatAddressStreet1: string;
  rt: string;
  rw: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  jumlahAnggota: number;
  kodePos: string;
  klasifikasiKeluarga: string;
  createdBySource: string;
  createdByWorkspaceMemberId: string;
  createdByName: string;
  position: number;
};

export const KELUARGA_DATA_SEED_COLUMNS: (keyof KeluargaDataSeed)[] = [
  'id',
  'nomorKk',
  'namaKepalaKeluarga',
  'tanggalPembuatan',
  'alamatAddressStreet1',
  'rt',
  'rw',
  'desa',
  'kecamatan',
  'kabupaten',
  'jumlahAnggota',
  'kodePos',
  'klasifikasiKeluarga',
  'createdBySource',
  'createdByWorkspaceMemberId',
  'createdByName',
  'position',
];

// prettier-ignore
export const KELUARGA_DATA_SEED_IDS = {
  KK_1: '20202020-c101-41e7-8c72-ba44072a4c58',
  KK_2: '20202020-c102-4b3d-a89c-7f6c30df998a',
  KK_3: '20202020-c103-422c-8fcf-5b7496f94975',
};

const KADES_USER_ID = WORKSPACE_MEMBER_DATA_SEED_IDS.KADES;

export const KELUARGA_DATA_SEEDS: KeluargaDataSeed[] = [
  {
    id: KELUARGA_DATA_SEED_IDS.KK_1,
    nomorKk: '3201234567890000',
    namaKepalaKeluarga: 'Ahmad Pratama',
    tanggalPembuatan: '2020-01-15',
    alamatAddressStreet1: 'Jl. Desa Sukamaju No. 1',
    rt: '001',
    rw: '002',
    desa: 'Sukamaju',
    kecamatan: 'Cibaregbeg',
    kabupaten: 'Bandung',
    jumlahAnggota: 4,
    kodePos: '40353',
    klasifikasiKeluarga: 'KS3',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    position: 0,
  },
  {
    id: KELUARGA_DATA_SEED_IDS.KK_2,
    nomorKk: '3201234567890001',
    namaKepalaKeluarga: 'Budi Santoso',
    tanggalPembuatan: '2020-03-20',
    alamatAddressStreet1: 'Jl. Desa Mekar Sari No. 5',
    rt: '003',
    rw: '004',
    desa: 'Mekar Sari',
    kecamatan: 'Cibaregbeg',
    kabupaten: 'Bandung',
    jumlahAnggota: 3,
    kodePos: '40353',
    klasifikasiKeluarga: 'KS3_PLUS',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    position: 1,
  },
  {
    id: KELUARGA_DATA_SEED_IDS.KK_3,
    nomorKk: '3201234567890002',
    namaKepalaKeluarga: 'Siti Nurhaliza',
    tanggalPembuatan: '2021-06-10',
    alamatAddressStreet1: 'Jl. Raya Desa No. 10',
    rt: '002',
    rw: '002',
    desa: 'Sukamaju',
    kecamatan: 'Cibaregbeg',
    kabupaten: 'Bandung',
    jumlahAnggota: 2,
    kodePos: '40353',
    klasifikasiKeluarga: 'KS1',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    position: 2,
  },
];
