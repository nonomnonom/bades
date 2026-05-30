import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

type ProgramBantuanDataSeed = {
  id: string;
  namaProgram: string;
  jenisBantuan: string;
  sumberDana: string;
  jumlahPenerima: number;
  nilaiPerOrangAmountMicros: number;
  nilaiPerOrangCurrencyCode: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: string;
  keterangan: string;
  createdBySource: string;
  createdByWorkspaceMemberId: string;
  createdByName: string;
  updatedBySource: string;
  updatedByWorkspaceMemberId: string;
  updatedByName: string;
  position: number;
};

export const PROGRAM_BANTUAN_DATA_SEED_COLUMNS: (keyof ProgramBantuanDataSeed)[] =
  [
    'id',
    'namaProgram',
    'jenisBantuan',
    'sumberDana',
    'jumlahPenerima',
    'nilaiPerOrangAmountMicros',
    'nilaiPerOrangCurrencyCode',
    'tanggalMulai',
    'tanggalSelesai',
    'status',
    'keterangan',
    'createdBySource',
    'createdByWorkspaceMemberId',
    'createdByName',
    'updatedBySource',
    'updatedByWorkspaceMemberId',
    'updatedByName',
    'position',
  ];

export const PROGRAM_BANTUAN_DATA_SEED_IDS = {
  PROG_1: '20202020-d001-41e7-8c72-ba44072a4c58',
  PROG_2: '20202020-d002-4b3d-a89c-7f6c30df998a',
  PROG_3: '20202020-d003-422c-8fcf-5b7496f94975',
};

const KADES_USER_ID = WORKSPACE_MEMBER_DATA_SEED_IDS.KADES;

export const PROGRAM_BANTUAN_DATA_SEEDS: ProgramBantuanDataSeed[] = [
  {
    id: PROGRAM_BANTUAN_DATA_SEED_IDS.PROG_1,
    namaProgram: 'Bantuan Langsung Tunai - Dana Desa',
    jenisBantuan: 'BLT',
    sumberDana: 'Dana Desa',
    jumlahPenerima: 25,
    nilaiPerOrangAmountMicros: 300000000000,
    nilaiPerOrangCurrencyCode: 'IDR',
    tanggalMulai: '2024-01-01',
    tanggalSelesai: '2024-12-31',
    status: 'SELESAI',
    keterangan: 'BLT DD tahun 2024',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 0,
  },
  {
    id: PROGRAM_BANTUAN_DATA_SEED_IDS.PROG_2,
    namaProgram: 'Bantuan Paket Sembako',
    jenisBantuan: 'BPNT',
    sumberDana: 'Kemensos',
    jumlahPenerima: 40,
    nilaiPerOrangAmountMicros: 200000000000,
    nilaiPerOrangCurrencyCode: 'IDR',
    tanggalMulai: '2024-02-01',
    tanggalSelesai: '2024-11-30',
    status: 'PELAKSANAAN',
    keterangan: 'BPNT melalui e-Warong',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 1,
  },
  {
    id: PROGRAM_BANTUAN_DATA_SEED_IDS.PROG_3,
    namaProgram: 'Program Keluarga Harapan',
    jenisBantuan: 'PKH',
    sumberDana: 'Kemensos',
    jumlahPenerima: 15,
    nilaiPerOrangAmountMicros: 500000000000,
    nilaiPerOrangCurrencyCode: 'IDR',
    tanggalMulai: '2024-01-01',
    tanggalSelesai: '2024-12-31',
    status: 'PELAKSANAAN',
    keterangan: 'PKH tahap 1 dan 2',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 2,
  },
];
