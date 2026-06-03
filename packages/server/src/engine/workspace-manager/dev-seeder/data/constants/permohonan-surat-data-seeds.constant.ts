import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';
import { PENDUDUK_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/penduduk-data-seeds.constant';

type PermohonanSuratDataSeed = {
  id: string;
  nomorPermohonan: string;
  tanggalPermohonan: string;
  status: string;
  jenisLayanan: string;
  keperluan: string;
  catatan: string;
  tanggalSelesai: string | null;
  pendudukId: string;
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
    'jenisLayanan',
    'keperluan',
    'catatan',
    'tanggalSelesai',
    'pendudukId',
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
  PMHONAN_4: '20202020-b004-5000-8090-ca44072b5001',
  PMHONAN_5: '20202020-b005-6000-90a0-db55082c6002',
  PMHONAN_6: '20202020-b006-7000-a0b0-ec66193d7003',
};

const KADES_USER_ID = WORKSPACE_MEMBER_DATA_SEED_IDS.KADES;

export const PERMOHONAN_SURAT_DATA_SEEDS: PermohonanSuratDataSeed[] = [
  {
    id: PERMOHONAN_SURAT_DATA_SEED_IDS.PMHONAN_1,
    nomorPermohonan: 'SURAT/2024/001',
    tanggalPermohonan: '2024-01-15',
    status: 'SELESAI',
    jenisLayanan: 'DOMISILI',
    keperluan: 'Administrasi sekolah anak',
    catatan: 'Surat selesai dibuat',
    tanggalSelesai: '2024-01-17',
    pendudukId: PENDUDUK_DATA_SEED_IDS.ID_1,
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
    jenisLayanan: 'SKTM',
    keperluan: 'Berkas administratif BLT',
    catatan: 'Menunggu verifikasi data',
    tanggalSelesai: null,
    pendudukId: PENDUDUK_DATA_SEED_IDS.ID_4,
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
    jenisLayanan: 'PENGANTAR_NIKAH',
    keperluan: 'Izin pesta pernikahan',
    catatan: '',
    tanggalSelesai: null,
    pendudukId: PENDUDUK_DATA_SEED_IDS.ID_6,
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 2,
  },
  {
    id: PERMOHONAN_SURAT_DATA_SEED_IDS.PMHONAN_4,
    nomorPermohonan: 'SURAT/2024/004',
    tanggalPermohonan: '2024-04-05',
    status: 'SELESAI',
    jenisLayanan: 'USAHA',
    keperluan: 'Surat Keterangan Usaha untuk pengajuan KUR',
    catatan: 'Diproses 1 hari kerja',
    tanggalSelesai: '2024-04-07',
    pendudukId: PENDUDUK_DATA_SEED_IDS.ID_5,
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 3,
  },
  {
    id: PERMOHONAN_SURAT_DATA_SEED_IDS.PMHONAN_5,
    nomorPermohonan: 'SURAT/2024/005',
    tanggalPermohonan: '2024-05-10',
    status: 'DITOLAK',
    jenisLayanan: 'SKCK',
    keperluan: 'Pengantar SKCK untuk melamar PNS',
    catatan: 'Berkas tidak lengkap - KTP belum update',
    tanggalSelesai: null,
    pendudukId: PENDUDUK_DATA_SEED_IDS.ID_10,
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 4,
  },
  {
    id: PERMOHONAN_SURAT_DATA_SEED_IDS.PMHONAN_6,
    nomorPermohonan: 'SURAT/2024/006',
    tanggalPermohonan: '2024-05-20',
    status: 'MENUNGGU',
    jenisLayanan: 'SKTM',
    keperluan: 'SKTM untuk keringanan biaya pengobatan',
    catatan: '',
    tanggalSelesai: null,
    pendudukId: PENDUDUK_DATA_SEED_IDS.ID_4,
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 5,
  },
];
