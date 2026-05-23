type KegiatanAnggaranDataSeed = {
  id: string;
  kode: string;
  namaKegiatan: string;
  namaBidang: string;
  namaSumberDana: string;
  paguKegiatan: number;
  tahunAnggaran: number;
  status: string;
  keterangan: string;
  position: number;
};

export const KEGIATAN_ANGGARAN_DATA_SEED_COLUMNS: (keyof KegiatanAnggaranDataSeed)[] = [
  'id',
  'kode',
  'namaKegiatan',
  'namaBidang',
  'namaSumberDana',
  'paguKegiatan',
  'tahunAnggaran',
  'status',
  'keterangan',
  'position',
];

// prettier-ignore
export const KEGIATAN_ANGGARAN_DATA_SEED_IDS = {
  KEG_1: '20202020-c201-41e7-8c72-ba44072a4c58',
  KEG_2: '20202020-c202-4b3d-a89c-7f6c30df998a',
  KEG_3: '20202020-c203-422c-8fcf-5b7496f94975',
  KEG_4: '20202020-c204-41d6-87a9-7add07bebfd8',
  KEG_5: '20202020-c205-422b-9cb2-5f8382a56877',
  KEG_6: '20202020-c206-4644-867d-e8e1851b3ee8',
};

export const KEGIATAN_ANGGARAN_DATA_SEEDS: KegiatanAnggaranDataSeed[] = [
  {
    id: KEGIATAN_ANGGARAN_DATA_SEED_IDS.KEG_1,
    kode: '01.01.01',
    namaKegiatan: 'Penyediaan Penghasilan Tetap Kepala Desa dan Perangkat',
    namaBidang: 'Penyelenggaraan Pemerintahan Desa',
    namaSumberDana: 'Alokasi Dana Desa',
    paguKegiatan: 312000000,
    tahunAnggaran: 2025,
    status: 'PELAKSANAAN',
    keterangan: 'Penghasilan tetap dan tunjangan perangkat desa setahun',
    position: 0,
  },
  {
    id: KEGIATAN_ANGGARAN_DATA_SEED_IDS.KEG_2,
    kode: '01.02.05',
    namaKegiatan: 'Penyelenggaraan Musyawarah Desa',
    namaBidang: 'Penyelenggaraan Pemerintahan Desa',
    namaSumberDana: 'Alokasi Dana Desa',
    paguKegiatan: 28000000,
    tahunAnggaran: 2025,
    status: 'PELAKSANAAN',
    keterangan: 'Musdes, Musrenbangdes, dan rapat BPD',
    position: 1,
  },
  {
    id: KEGIATAN_ANGGARAN_DATA_SEED_IDS.KEG_3,
    kode: '02.01.03',
    namaKegiatan: 'Pembangunan/Rehab Jalan Rabat Beton Dusun Krajan',
    namaBidang: 'Pelaksanaan Pembangunan Desa',
    namaSumberDana: 'Dana Desa',
    paguKegiatan: 285000000,
    tahunAnggaran: 2025,
    status: 'PELAKSANAAN',
    keterangan: 'Rabat beton 320 meter Jl. Krajan dari simpang sampai sawah',
    position: 2,
  },
  {
    id: KEGIATAN_ANGGARAN_DATA_SEED_IDS.KEG_4,
    kode: '02.03.02',
    namaKegiatan: 'Pembangunan Sumur Bor Air Bersih Dusun Tegal Asri',
    namaBidang: 'Pelaksanaan Pembangunan Desa',
    namaSumberDana: 'Dana Desa',
    paguKegiatan: 145000000,
    tahunAnggaran: 2025,
    status: 'RENCANA',
    keterangan: 'Sumur bor + tandon air untuk 4 RT Dusun Tegal Asri',
    position: 3,
  },
  {
    id: KEGIATAN_ANGGARAN_DATA_SEED_IDS.KEG_5,
    kode: '03.04.02',
    namaKegiatan: 'Penyelenggaraan Posyandu',
    namaBidang: 'Pembinaan Kemasyarakatan',
    namaSumberDana: 'Dana Desa',
    paguKegiatan: 42000000,
    tahunAnggaran: 2025,
    status: 'PELAKSANAAN',
    keterangan: 'Operasional Posyandu balita dan lansia setahun',
    position: 4,
  },
  {
    id: KEGIATAN_ANGGARAN_DATA_SEED_IDS.KEG_6,
    kode: '04.02.01',
    namaKegiatan: 'Pelatihan Pengelolaan BUMDes',
    namaBidang: 'Pemberdayaan Masyarakat',
    namaSumberDana: 'Bantuan Keuangan Provinsi',
    paguKegiatan: 35000000,
    tahunAnggaran: 2025,
    status: 'SELESAI',
    keterangan: 'Pelatihan tata kelola BUMDes Sukamaju Mandiri',
    position: 5,
  },
];
