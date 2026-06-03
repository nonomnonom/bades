import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';
import { PENDUDUK_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/penduduk-data-seeds.constant';
import { WILAYAH_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/wilayah-data-seeds.constant';

type JabatanDataSeed = {
  id: string;
  namaJabatan: string;
  tipeJabatan: string;
  tugasPokok: string;
  nomorSk: string;
  tanggalSk: string;
  tanggalMulai: string;
  tanggalAkhir: string | null;
  statusAktif: boolean;
  pendudukId: string | null;
  wilayahId: string | null;
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
  'nomorSk',
  'tanggalSk',
  'tanggalMulai',
  'tanggalAkhir',
  'statusAktif',
  'pendudukId',
  'wilayahId',
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
    namaJabatan: 'Kepala Desa',
    tipeJabatan: 'KEPALA_DESA',
    tugasPokok:
      'Memimpin penyelenggaraan pemerintahan desa, pembangunan, dan pelayanan masyarakat.',
    nomorSk: 'SK/001/DS/2021',
    tanggalSk: '2021-03-01',
    tanggalMulai: '2021-03-01',
    tanggalAkhir: '2027-03-01',
    statusAktif: true,
    pendudukId: PENDUDUK_DATA_SEED_IDS.ID_1,
    wilayahId: null,
    keterangan: 'Kepala Desa Sukamaju, masa jabatan 2021-2027',
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
    namaJabatan: 'Sekretaris Desa',
    tipeJabatan: 'SEKRETARIS',
    tugasPokok: 'Membantu Kepala Desa dalam bidang administrasi pemerintahan.',
    nomorSk: 'SK/002/DS/2021',
    tanggalSk: '2021-03-01',
    tanggalMulai: '2021-03-01',
    tanggalAkhir: '2027-03-01',
    statusAktif: true,
    pendudukId: PENDUDUK_DATA_SEED_IDS.ID_5,
    wilayahId: null,
    keterangan: 'Sekretaris Desa Sukamaju',
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
    namaJabatan: 'Kepala Urusan Keuangan',
    tipeJabatan: 'KAUR',
    tugasPokok:
      'Membantu Sekretaris Desa dalam urusan keuangan dan administrasi keuangan desa.',
    nomorSk: 'SK/003/DS/2021',
    tanggalSk: '2021-03-15',
    tanggalMulai: '2021-03-15',
    tanggalAkhir: '2027-03-15',
    statusAktif: true,
    pendudukId: PENDUDUK_DATA_SEED_IDS.ID_6,
    wilayahId: null,
    keterangan: 'Kaur Keuangan Desa Sukamaju',
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
    namaJabatan: 'Kepala Seksi Pemerintahan',
    tipeJabatan: 'KASI',
    tugasPokok:
      'Membantu Sekretaris Desa dalam urusan pemerintahan dan pelayanan masyarakat.',
    nomorSk: 'SK/004/DS/2021',
    tanggalSk: '2021-03-15',
    tanggalMulai: '2021-03-15',
    tanggalAkhir: '2027-03-15',
    statusAktif: true,
    pendudukId: PENDUDUK_DATA_SEED_IDS.ID_8,
    wilayahId: null,
    keterangan: 'Kasi Pemerintahan Desa Sukamaju',
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
    namaJabatan: 'Kepala Dusun Krajan',
    tipeJabatan: 'KEPALA_DUSUN',
    tugasPokok:
      'Membantu Kepala Desa dalam pelaksanaan tugas di wilayah Dusun Krajan.',
    nomorSk: 'SK/005/DS/2021',
    tanggalSk: '2021-04-01',
    tanggalMulai: '2021-04-01',
    tanggalAkhir: '2027-04-01',
    statusAktif: true,
    pendudukId: null,
    wilayahId: WILAYAH_DATA_SEED_IDS.DUSUN_1,
    keterangan: 'Kepala Dusun Krajan',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 4,
  },
];
