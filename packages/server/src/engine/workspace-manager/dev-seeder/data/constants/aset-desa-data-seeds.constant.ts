type AsetDesaDataSeed = {
  id: string;
  namaAset: string;
  jenisAset: string;
  kodeAset: string;
  lokasi: string;
  nilaiAset: number;
  tahunPerolehan: string;
  status: string;
  keterangan: string;
  position: number;
};

export const ASET_DESA_DATA_SEED_COLUMNS: (keyof AsetDesaDataSeed)[] = [
  'id',
  'namaAset',
  'jenisAset',
  'kodeAset',
  'lokasi',
  'nilaiAset',
  'tahunPerolehan',
  'status',
  'keterangan',
  'position',
];

export const ASET_DESA_DATA_SEED_IDS = {
  ASET_1: '20202020-d001-41e7-8c72-ba44072a4c58',
  ASET_2: '20202020-d002-4b3d-a89c-7f6c30df998a',
  ASET_3: '20202020-d003-422c-8fcf-5b7496f94975',
  ASET_4: '20202020-d004-4e9a-9fcf-5b7496f94976',
};

export const ASET_DESA_DATA_SEEDS: AsetDesaDataSeed[] = [
  {
    id: ASET_DESA_DATA_SEED_IDS.ASET_1,
    namaAset: 'Tanah Kantor Desa',
    jenisAset: 'TANAH',
    kodeAset: '01.01.01',
    lokasi: 'Jl. Desa Sukamaju No. 1',
    nilaiAset: 500000000,
    tahunPerolehan: '2018',
    status: 'BAGUS',
    keterangan: 'Tanah seluas 500m2 dengan Sertifikat',
    position: 0,
  },
  {
    id: ASET_DESA_DATA_SEED_IDS.ASET_2,
    namaAset: 'Gedung Kantor Desa',
    jenisAset: 'BANGUNAN',
    kodeAset: '01.01.02',
    lokasi: 'Jl. Desa Sukamaju No. 1',
    nilaiAset: 350000000,
    tahunPerolehan: '2019',
    status: 'BAGUS',
    keterangan: 'Gedung 2 lantai luas 200m2',
    position: 1,
  },
  {
    id: ASET_DESA_DATA_SEED_IDS.ASET_3,
    namaAset: 'Toyota Avanza',
    jenisAset: 'KENDARAAN',
    kodeAset: '02.01.01',
    lokasi: 'Kantor Desa',
    nilaiAset: 180000000,
    tahunPerolehan: '2020',
    status: 'BAGUS',
    keterangan: 'Kendaraan operasional desa',
    position: 2,
  },
  {
    id: ASET_DESA_DATA_SEED_IDS.ASET_4,
    namaAset: 'Komputer PC',
    jenisAset: 'PERALATAN',
    kodeAset: '03.01.01',
    lokasi: 'Kantor Desa',
    nilaiAset: 15000000,
    tahunPerolehan: '2021',
    status: 'RUSAK_RINGAN',
    keterangan: '��kah PC untuk administrasi',
    position: 3,
  },
];
