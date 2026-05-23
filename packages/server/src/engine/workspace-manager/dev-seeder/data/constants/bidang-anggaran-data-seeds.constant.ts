type BidangAnggaranDataSeed = {
  id: string;
  kode: string;
  namaBidang: string;
  tahunAnggaran: number;
  paguAnggaran: number;
  keterangan: string;
  position: number;
};

export const BIDANG_ANGGARAN_DATA_SEED_COLUMNS: (keyof BidangAnggaranDataSeed)[] =
  [
    'id',
    'kode',
    'namaBidang',
    'tahunAnggaran',
    'paguAnggaran',
    'keterangan',
    'position',
  ];

// prettier-ignore
export const BIDANG_ANGGARAN_DATA_SEED_IDS = {
  BIDANG_1: '20202020-b101-41e7-8c72-ba44072a4c58',
  BIDANG_2: '20202020-b102-4b3d-a89c-7f6c30df998a',
  BIDANG_3: '20202020-b103-422c-8fcf-5b7496f94975',
  BIDANG_4: '20202020-b104-41d6-87a9-7add07bebfd8',
  BIDANG_5: '20202020-b105-422b-9cb2-5f8382a56877',
};

export const BIDANG_ANGGARAN_DATA_SEEDS: BidangAnggaranDataSeed[] = [
  {
    id: BIDANG_ANGGARAN_DATA_SEED_IDS.BIDANG_1,
    kode: '01',
    namaBidang: 'Penyelenggaraan Pemerintahan Desa',
    tahunAnggaran: 2025,
    paguAnggaran: 420000000,
    keterangan:
      'Belanja operasional kantor desa, penghasilan perangkat, dan tunjangan',
    position: 0,
  },
  {
    id: BIDANG_ANGGARAN_DATA_SEED_IDS.BIDANG_2,
    kode: '02',
    namaBidang: 'Pelaksanaan Pembangunan Desa',
    tahunAnggaran: 2025,
    paguAnggaran: 780000000,
    keterangan:
      'Belanja infrastruktur desa, sarana prasarana, dan fasilitas umum',
    position: 1,
  },
  {
    id: BIDANG_ANGGARAN_DATA_SEED_IDS.BIDANG_3,
    kode: '03',
    namaBidang: 'Pembinaan Kemasyarakatan',
    tahunAnggaran: 2025,
    paguAnggaran: 165000000,
    keterangan: 'Belanja kegiatan kemasyarakatan, pemuda, dan keagamaan',
    position: 2,
  },
  {
    id: BIDANG_ANGGARAN_DATA_SEED_IDS.BIDANG_4,
    kode: '04',
    namaBidang: 'Pemberdayaan Masyarakat',
    tahunAnggaran: 2025,
    paguAnggaran: 285000000,
    keterangan:
      'Belanja pelatihan, pemberdayaan ekonomi, dan kelompok masyarakat',
    position: 3,
  },
  {
    id: BIDANG_ANGGARAN_DATA_SEED_IDS.BIDANG_5,
    kode: '05',
    namaBidang: 'Penanggulangan Bencana, Darurat, dan Mendesak',
    tahunAnggaran: 2025,
    paguAnggaran: 75000000,
    keterangan: 'Belanja tak terduga untuk kebencanaan dan kondisi darurat',
    position: 4,
  },
];
