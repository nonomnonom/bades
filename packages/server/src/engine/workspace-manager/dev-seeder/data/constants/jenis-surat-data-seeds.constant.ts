import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

type JenisSuratDataSeed = {
  id: string;
  kodeSurat: string;
  namaSurat: string;
  deskripsi: string;
  kategori: string;
  biaya: number;
  isActive: boolean;
  position: number;
};

export const JENIS_SURAT_DATA_SEED_COLUMNS: (keyof JenisSuratDataSeed)[] = [
  'id',
  'kodeSurat',
  'namaSurat',
  'deskripsi',
  'kategori',
  'biaya',
  'isActive',
  'position',
];

// prettier-ignore
export const JENIS_SURAT_DATA_SEED_IDS = {
  SURAT_1: '20202020-s001-41e7-8c72-ba44072a4c58',
  SURAT_2: '20202020-s002-4b3d-a89c-7f6c30df998a',
  SURAT_3: '20202020-s003-422c-8fcf-5b7496f94975',
  SURAT_4: '20202020-s004-4e9a-9fcf-5b7496f94976',
  SURAT_5: '20202020-s005-5f0b-5acd-6c7507f05077',
};

export const JENIS_SURAT_DATA_SEEDS: JenisSuratDataSeed[] = [
  {
    id: JENIS_SURAT_DATA_SEED_IDS.SURAT_1,
    kodeSurat: 'KK-01',
    namaSurat: 'Kartu Keluarga',
    deskripsi: 'Surat pengantar kartu keluarga baru atau perubahan data',
    kategori: 'KEPENDUDUKAN',
    biaya: 0,
    isActive: true,
    position: 0,
  },
  {
    id: JENIS_SURAT_DATA_SEED_IDS.SURAT_2,
    kodeSurat: 'AKT-01',
    namaSurat: 'Akta Kelahiran',
    deskripsi: 'Surat pengantar pembuatan akta kelahiran',
    kategori: 'KEPENDUDUKAN',
    biaya: 0,
    isActive: true,
    position: 1,
  },
  {
    id: JENIS_SURAT_DATA_SEED_IDS.SURAT_3,
    kodeSurat: 'KTM-01',
    namaSurat: 'Keterangan Tidak Mampu',
    deskripsi: 'Surat keterangan tidak mampu untuk keperluan administrasi',
    kategori: 'KETERANGAN',
    biaya: 0,
    isActive: true,
    position: 2,
  },
  {
    id: JENIS_SURAT_DATA_SEED_IDS.SURAT_4,
    kodeSurat: 'DOM-01',
    namaSurat: 'Domisili',
    deskripsi: 'Surat keterangan domisili',
    kategori: 'KETERANGAN',
    biaya: 0,
    isActive: true,
    position: 3,
  },
  {
    id: JENIS_SURAT_DATA_SEED_IDS.SURAT_5,
    kodeSurat: 'GRM-01',
    namaSurat: 'Izin Keramaian',
    deskripsi: 'Surat izin pelaksanaan keramaian atau pesta',
    kategori: 'IZIN',
    biaya: 50000,
    isActive: true,
    position: 4,
  },
];