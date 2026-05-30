import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';
import { PROGRAM_BANTUAN_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/program-bantuan-data-seeds.constant';

type PenerimaBantuanDataSeed = {
  id: string;
  namaPenerima: string;
  nik: string;
  alamatAddressStreet1: string;
  statusPenerimaan: string;
  jumlahDiterimaAmountMicros: number;
  jumlahDiterimaCurrencyCode: string;
  programBantuanId: string;
  pendudukId: string;
  tanggalTerima: string;
  keterangan: string;
  createdBySource: string;
  createdByWorkspaceMemberId: string;
  createdByName: string;
  updatedBySource: string;
  updatedByWorkspaceMemberId: string;
  updatedByName: string;
  position: number;
};

export const PENERIMA_BANTUAN_DATA_SEED_COLUMNS: (keyof PenerimaBantuanDataSeed)[] =
  [
    'id',
    'namaPenerima',
    'nik',
    'alamatAddressStreet1',
    'statusPenerimaan',
    'jumlahDiterimaAmountMicros',
    'jumlahDiterimaCurrencyCode',
    'programBantuanId',
    'pendudukId',
    'tanggalTerima',
    'keterangan',
    'createdBySource',
    'createdByWorkspaceMemberId',
    'createdByName',
    'updatedBySource',
    'updatedByWorkspaceMemberId',
    'updatedByName',
    'position',
  ];

export const PENERIMA_BANTUAN_DATA_SEED_IDS = {
  PENERIMA_1: '20202020-f001-41e7-8c72-ba44072a4c58',
  PENERIMA_2: '20202020-f002-4b3d-a89c-7f6c30df998a',
  PENERIMA_3: '20202020-f003-422c-8fcf-5b7496f94975',
};

const KADES_USER_ID = WORKSPACE_MEMBER_DATA_SEED_IDS.KADES;

export const PENERIMA_BANTUAN_DATA_SEEDS: PenerimaBantuanDataSeed[] = [
  {
    id: PENERIMA_BANTUAN_DATA_SEED_IDS.PENERIMA_1,
    namaPenerima: 'Siti Nurhaliza',
    nik: '3201234567890002',
    alamatAddressStreet1: 'Jl. Desa Sukamaju No. 1',
    statusPenerimaan: 'TERVERIFIKASI',
    jumlahDiterimaAmountMicros: 300000000000,
    jumlahDiterimaCurrencyCode: 'IDR',
    programBantuanId: PROGRAM_BANTUAN_DATA_SEED_IDS.PROG_1,
    pendudukId: '20202020-0001-4000-8000-000000000003',
    tanggalTerima: '2024-01-15',
    keterangan: 'Penerima BLT DD',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 0,
  },
  {
    id: PENERIMA_BANTUAN_DATA_SEED_IDS.PENERIMA_2,
    namaPenerima: 'Dewi Kusuma',
    nik: '3201234567890005',
    alamatAddressStreet1: 'Jl. Raya Desa No. 10',
    statusPenerimaan: 'TERVERIFIKASI',
    jumlahDiterimaAmountMicros: 200000000000,
    jumlahDiterimaCurrencyCode: 'IDR',
    programBantuanId: PROGRAM_BANTUAN_DATA_SEED_IDS.PROG_2,
    pendudukId: '20202020-0001-4000-8000-000000000005',
    tanggalTerima: '2024-02-10',
    keterangan: 'Penerima BPNT',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 1,
  },
  {
    id: PENERIMA_BANTUAN_DATA_SEED_IDS.PENERIMA_3,
    namaPenerima: 'Juhairiah',
    nik: '3201234567890010',
    alamatAddressStreet1: 'Jl. Desa Mekar Sari No. 8',
    statusPenerimaan: 'MENUNGGU',
    jumlahDiterimaAmountMicros: 500000000000,
    jumlahDiterimaCurrencyCode: 'IDR',
    programBantuanId: PROGRAM_BANTUAN_DATA_SEED_IDS.PROG_3,
    pendudukId: '20202020-0001-4000-8000-000000000010',
    tanggalTerima: '2024-03-01',
    keterangan: 'Pendaftar baru PKH',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 2,
  },
];
