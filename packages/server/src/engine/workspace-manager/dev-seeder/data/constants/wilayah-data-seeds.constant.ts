type WilayahDataSeed = {
  id: string;
  namaWilayah: string;
  jenisWilayah: string;
  kode: string;
  keterangan: string;
  position: number;
};

export const WILAYAH_DATA_SEED_COLUMNS: (keyof WilayahDataSeed)[] = [
  'id',
  'namaWilayah',
  'jenisWilayah',
  'kode',
  'keterangan',
  'position',
];

// prettier-ignore
export const WILAYAH_DATA_SEED_IDS = {
  // Dusun
  DUSUN_1: '20202020-d101-41e7-8c72-ba44072a4c58',
  DUSUN_2: '20202020-d102-4b3d-a89c-7f6c30df998a',
  DUSUN_3: '20202020-d103-422c-8fcf-5b7496f94975',
  // RW
  RW_1: '20202020-d201-41d6-87a9-7add07bebfd8',
  RW_2: '20202020-d202-422b-9cb2-5f8382a56877',
  RW_3: '20202020-d203-4644-867d-e8e1851b3ee8',
  RW_4: '20202020-d204-4c51-aa03-c4cd2423d7cb',
  // RT
  RT_1: '20202020-d301-48ec-97c0-dbbfcbe8df1b',
  RT_2: '20202020-d302-44f9-ac9c-25e462460cb0',
  RT_3: '20202020-d303-4693-a2d9-89dc9188a1dc',
  RT_4: '20202020-d304-4123-b0a1-2a3b4c5d6e7f',
  RT_5: '20202020-d305-4234-c1b2-3b4c5d6e7f80',
};

export const WILAYAH_DATA_SEEDS: WilayahDataSeed[] = [
  // Dusun (3) — unit teritori paling atas di bawah desa
  {
    id: WILAYAH_DATA_SEED_IDS.DUSUN_1,
    namaWilayah: 'Dusun Krajan',
    jenisWilayah: 'DUSUN',
    kode: '01',
    keterangan: 'Dusun pusat Desa Sukamaju, kantor desa berada di sini',
    position: 0,
  },
  {
    id: WILAYAH_DATA_SEED_IDS.DUSUN_2,
    namaWilayah: 'Dusun Mekar Sari',
    jenisWilayah: 'DUSUN',
    kode: '02',
    keterangan: 'Dusun bagian utara Desa Sukamaju',
    position: 1,
  },
  {
    id: WILAYAH_DATA_SEED_IDS.DUSUN_3,
    namaWilayah: 'Dusun Tegal Asri',
    jenisWilayah: 'DUSUN',
    kode: '03',
    keterangan: 'Dusun bagian selatan, sebagian besar lahan pertanian',
    position: 2,
  },
  // RW (4) — anak dari Dusun
  {
    id: WILAYAH_DATA_SEED_IDS.RW_1,
    namaWilayah: 'RW 001',
    jenisWilayah: 'RW',
    kode: '001',
    keterangan: 'RW di Dusun Krajan',
    position: 3,
  },
  {
    id: WILAYAH_DATA_SEED_IDS.RW_2,
    namaWilayah: 'RW 002',
    jenisWilayah: 'RW',
    kode: '002',
    keterangan: 'RW di Dusun Krajan',
    position: 4,
  },
  {
    id: WILAYAH_DATA_SEED_IDS.RW_3,
    namaWilayah: 'RW 003',
    jenisWilayah: 'RW',
    kode: '003',
    keterangan: 'RW di Dusun Mekar Sari',
    position: 5,
  },
  {
    id: WILAYAH_DATA_SEED_IDS.RW_4,
    namaWilayah: 'RW 004',
    jenisWilayah: 'RW',
    kode: '004',
    keterangan: 'RW di Dusun Tegal Asri',
    position: 6,
  },
  // RT (5) — anak dari RW
  {
    id: WILAYAH_DATA_SEED_IDS.RT_1,
    namaWilayah: 'RT 001',
    jenisWilayah: 'RT',
    kode: '001',
    keterangan: 'RT di RW 001 Dusun Krajan',
    position: 7,
  },
  {
    id: WILAYAH_DATA_SEED_IDS.RT_2,
    namaWilayah: 'RT 002',
    jenisWilayah: 'RT',
    kode: '002',
    keterangan: 'RT di RW 001 Dusun Krajan',
    position: 8,
  },
  {
    id: WILAYAH_DATA_SEED_IDS.RT_3,
    namaWilayah: 'RT 003',
    jenisWilayah: 'RT',
    kode: '003',
    keterangan: 'RT di RW 002 Dusun Krajan',
    position: 9,
  },
  {
    id: WILAYAH_DATA_SEED_IDS.RT_4,
    namaWilayah: 'RT 001',
    jenisWilayah: 'RT',
    kode: '001',
    keterangan: 'RT di RW 003 Dusun Mekar Sari',
    position: 10,
  },
  {
    id: WILAYAH_DATA_SEED_IDS.RT_5,
    namaWilayah: 'RT 001',
    jenisWilayah: 'RT',
    kode: '001',
    keterangan: 'RT di RW 004 Dusun Tegal Asri',
    position: 11,
  },
];
