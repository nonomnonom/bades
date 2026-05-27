import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

type JabatanDataSeed = {
  id: string;
  namaJabatan: string;
  tipeJabatan: string;
  tugasPokok: string;
  keterangan: string;
  createdBySource: string;
  createdByWorkspaceMemberId: string;
  createdByName: string;
  updatedBySource: string;
  updatedByWorkspaceMemberId: string;
  updatedByName: string;
  position: number;
};

export const JABATAN_DATA_SEED_COLUMNS: (keyof JabatanDataSeed)[] = [
  'id',
  'namaJabatan',
  'tipeJabatan',
  'tugasPokok',
  'keterangan',
  'createdBySource',
  'createdByWorkspaceMemberId',
  'createdByName',
  'updatedBySource',
  'updatedByWorkspaceMemberId',
  'updatedByName',
  'position',
];

export const JABATAN_DATA_SEED_IDS = {
  JBT_1: '20202020-c001-41e7-8c72-ba44072a4c58',
  JBT_2: '20202020-c002-4b3d-a89c-7f6c30df998a',
  JBT_3: '20202020-c003-422c-8fcf-5b7496f94975',
  JBT_4: '20202020-c004-4e9a-9fcf-5b7496f94976',
  JBT_5: '20202020-c005-5f0b-5acd-6c7507f05078',
};

const KADES_USER_ID = WORKSPACE_MEMBER_DATA_SEED_IDS.KADES;

export const JABATAN_DATA_SEEDS: JabatanDataSeed[] = [
  {
    id: JABATAN_DATA_SEED_IDS.JBT_1,
    namaJabatan: 'Drs. H. Abdullah',
    tipeJabatan: 'KEPALA_DESA',
    tugasPokok: 'Memimpin pelaksanaan Pemerintahan Desa',
    keterangan: 'Kepala Desa masa jabatan 2021-2027',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 0,
  },
  {
    id: JABATAN_DATA_SEED_IDS.JBT_2,
    namaJabatan: 'Sugiono',
    tipeJabatan: 'SEKRETARIS',
    tugasPokok: 'Melaksanakan urusan ketatausahaan dan umum',
    keterangan: 'Sekretaris Desa',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 1,
  },
  {
    id: JABATAN_DATA_SEED_IDS.JBT_3,
    namaJabatan: 'Siti Aminah',
    tipeJabatan: 'KAUR',
    tugasPokok: 'Melaksanakan urusan keuangan dan perencanaan',
    keterangan: 'Kaur Keuangan',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 2,
  },
  {
    id: JABATAN_DATA_SEED_IDS.JBT_4,
    namaJabatan: 'Budi Santoso',
    tipeJabatan: 'KASI',
    tugasPokok: 'Melaksanakan urusan pemerintahan dan pembangunan',
    keterangan: 'Kasi Pemerintahan',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 3,
  },
  {
    id: JABATAN_DATA_SEED_IDS.JBT_5,
    namaJabatan: 'Ahmad Rivai',
    tipeJabatan: 'KEPALA_DUSUN',
    tugasPokok: 'Membantu Kepala Desa dalam urusan dusun',
    keterangan: 'Kepala Dusun Utama',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 4,
  },
];
