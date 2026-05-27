import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

type PermohonanSuratDataSeed = {
  id: string;
  nomorPermohonan: string;
  tanggalPermohonan: string;
  status: string;
  keperluan: string;
  catatan: string;
  tanggalSelesai: string | null;
  createdBySource: string;
  createdByWorkspaceMemberId: string;
  createdByName: string;
  updatedBySource: string;
  updatedByWorkspaceMemberId: string;
  updatedByName: string;
  position: number;
};

export const PERMOHONAN_SURAT_DATA_SEED_COLUMNS: (keyof PermohonanSuratDataSeed)[] =
  [
    'id',
    'nomorPermohonan',
    'tanggalPermohonan',
    'status',
    'keperluan',
    'catatan',
    'tanggalSelesai',
    'createdBySource',
    'createdByWorkspaceMemberId',
    'createdByName',
    'updatedBySource',
    'updatedByWorkspaceMemberId',
    'updatedByName',
    'position',
  ];

// prettier-ignore
export const PERMOHONAN_SURAT_DATA_SEED_IDS = {
  PMHONAN_1: '20202020-b001-41e7-8c72-ba44072a4c58',
  PMHONAN_2: '20202020-b002-4b3d-a89c-7f6c30df998a',
  PMHONAN_3: '20202020-b003-422c-8fcf-5b7496f94975',
};

const KADES_USER_ID = WORKSPACE_MEMBER_DATA_SEED_IDS.KADES;

export const PERMOHONAN_SURAT_DATA_SEEDS: PermohonanSuratDataSeed[] = [
  {
    id: PERMOHONAN_SURAT_DATA_SEED_IDS.PMHONAN_1,
    nomorPermohonan: 'SURAT/2024/001',
    tanggalPermohonan: '2024-01-15',
    status: 'SELESAI',
    keperluan: 'Administrasi sekolah anak',
    catatan: 'Surat selesai dibuat',
    tanggalSelesai: '2024-01-17',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 0,
  },
  {
    id: PERMOHONAN_SURAT_DATA_SEED_IDS.PMHONAN_2,
    nomorPermohonan: 'SURAT/2024/002',
    tanggalPermohonan: '2024-02-20',
    status: 'DIPROSES',
    keperluan: 'Berkas administratif BLT',
    catatan: 'Menunggu verifikasi data',
    tanggalSelesai: null,
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 1,
  },
  {
    id: PERMOHONAN_SURAT_DATA_SEED_IDS.PMHONAN_3,
    nomorPermohonan: 'SURAT/2024/003',
    tanggalPermohonan: '2024-03-10',
    status: 'MENUNGGU',
    keperluan: 'Izin pesta pernikahan',
    catatan: '',
    tanggalSelesai: null,
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 2,
  },
];
