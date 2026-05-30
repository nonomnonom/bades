import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

type AsetDesaDataSeed = {
  id: string;
  namaAset: string;
  jenisAset: string;
  kodeAset: string;
  lokasi: string;
  nilaiAsetAmountMicros: number;
  nilaiAsetCurrencyCode: string;
  tahunPerolehan: string;
  kondisi: string;
  statusPengelolaan: string;
  keterangan: string;
  createdBySource: string;
  createdByWorkspaceMemberId: string;
  createdByName: string;
  updatedBySource: string;
  updatedByWorkspaceMemberId: string;
  updatedByName: string;
  position: number;
};

export const ASET_DESA_DATA_SEED_COLUMNS: (keyof AsetDesaDataSeed)[] = [
  'id',
  'namaAset',
  'jenisAset',
  'kodeAset',
  'lokasi',
  'nilaiAsetAmountMicros',
  'nilaiAsetCurrencyCode',
  'tahunPerolehan',
  'kondisi',
  'statusPengelolaan',
  'keterangan',
  'createdBySource',
  'createdByWorkspaceMemberId',
  'createdByName',
  'updatedBySource',
  'updatedByWorkspaceMemberId',
  'updatedByName',
  'position',
];

// IDs unik untuk aset desa — prefix e001..e004 agar tidak bertabrakan dengan
// program-bantuan yang menggunakan prefix d001..d003
export const ASET_DESA_DATA_SEED_IDS = {
  ASET_1: '20202020-e001-41e7-8c72-ba44072a4c58',
  ASET_2: '20202020-e002-4b3d-a89c-7f6c30df998a',
  ASET_3: '20202020-e003-422c-8fcf-5b7496f94975',
  ASET_4: '20202020-e004-4e9a-9fcf-5b7496f94976',
};

const KADES_USER_ID = WORKSPACE_MEMBER_DATA_SEED_IDS.KADES;

export const ASET_DESA_DATA_SEEDS: AsetDesaDataSeed[] = [
  {
    id: ASET_DESA_DATA_SEED_IDS.ASET_1,
    namaAset: 'Tanah Kantor Desa',
    jenisAset: 'TANAH',
    kodeAset: '01.01.01',
    lokasi: 'Jl. Desa Sukamaju No. 1',
    nilaiAsetAmountMicros: 500000000000000,
    nilaiAsetCurrencyCode: 'IDR',
    tahunPerolehan: '2018',
    kondisi: 'BAIK',
    statusPengelolaan: 'AKTIF',
    keterangan: 'Tanah seluas 500m2 dengan Sertifikat',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 0,
  },
  {
    id: ASET_DESA_DATA_SEED_IDS.ASET_2,
    namaAset: 'Gedung Kantor Desa',
    jenisAset: 'BANGUNAN',
    kodeAset: '01.01.02',
    lokasi: 'Jl. Desa Sukamaju No. 1',
    nilaiAsetAmountMicros: 350000000000000,
    nilaiAsetCurrencyCode: 'IDR',
    tahunPerolehan: '2019',
    kondisi: 'BAIK',
    statusPengelolaan: 'AKTIF',
    keterangan: 'Gedung 2 lantai luas 200m2',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 1,
  },
  {
    id: ASET_DESA_DATA_SEED_IDS.ASET_3,
    namaAset: 'Toyota Avanza',
    jenisAset: 'KENDARAAN',
    kodeAset: '02.01.01',
    lokasi: 'Kantor Desa',
    nilaiAsetAmountMicros: 180000000000000,
    nilaiAsetCurrencyCode: 'IDR',
    tahunPerolehan: '2020',
    kondisi: 'BAIK',
    statusPengelolaan: 'AKTIF',
    keterangan: 'Kendaraan operasional desa',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 2,
  },
  {
    id: ASET_DESA_DATA_SEED_IDS.ASET_4,
    namaAset: 'Komputer PC',
    jenisAset: 'PERALATAN',
    kodeAset: '03.01.01',
    lokasi: 'Kantor Desa',
    nilaiAsetAmountMicros: 15000000000000,
    nilaiAsetCurrencyCode: 'IDR',
    tahunPerolehan: '2021',
    kondisi: 'RUSAK_RINGAN',
    statusPengelolaan: 'TIDAK_DIPAKAI',
    keterangan: 'Unit PC untuk administrasi',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 3,
  },
];
