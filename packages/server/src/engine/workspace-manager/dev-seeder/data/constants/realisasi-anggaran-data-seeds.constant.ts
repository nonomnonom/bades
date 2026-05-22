type RealisasiAnggaranDataSeed = {
  id: string;
  tahunAnggaran: string;
  kodeRekening: string;
  namaKegiatan: string;
  volume: number;
  satuan: string;
  anggaran: number;
 realisasi: number;
  sisa: number;
  tanggalRealisasi: string;
  keterangan: string;
  position: number;
};

export const REALISASI_ANGGARAN_DATA_SEED_COLUMNS: (keyof RealisasiAnggaranDataSeed)[] = [
  'id',
  'tahunAnggaran',
  'kodeRekening',
  'namaKegiatan',
  'volume',
  'satuan',
  'anggaran',
  'realisasi',
  'sisa',
  'tanggalRealisasi',
  'keterangan',
  'position',
];

export const REALISASI_ANGGARAN_DATA_SEED_IDS = {
  REAL_1: '20202020-ab01-41e7-8c72-ba44072a4c58',
  REAL_2: '20202020-ab02-4b3d-a89c-7f6c30df998a',
  REAL_3: '20202020-ab03-422c-8fcf-5b7496f94975',
};

export const REALISASI_ANGGARAN_DATA_SEEDS: RealisasiAnggaranDataSeed[] = [
  {
    id: REALISASI_ANGGARAN_DATA_SEED_IDS.REAL_1,
    tahunAnggaran: '2024',
    kodeRekening: '5.1.2',
    namaKegiatan: 'Pembangunan Jalan Desa',
    volume: 500,
    satuan: 'meter',
    anggaran: 200000000,
   realisasi: 195000000,
    sisa: 5000000,
    tanggalRealisasi: '2024-06-15',
    keterangan: 'Pembangunan jalan hotmix',
    position: 0,
  },
  {
    id: REALISASI_ANGGARAN_DATA_SEED_IDS.REAL_2,
    tahunAnggaran: '2024',
    kodeRekening: '5.1.2',
    namaKegiatan: 'Pembangunan Saluran Air',
    volume: 300,
    satuan: 'meter',
    anggaran: 150000000,
   realisasi: 148000000,
    sisa: 2000000,
    tanggalRealisasi: '2024-07-20',
    keterangan: 'Saluran irigasi',
    position: 1,
  },
  {
    id: REALISASI_ANGGARAN_DATA_SEED_IDS.REAL_3,
    tahunAnggaran: '2024',
    kodeRekening: '5.1.3',
    namaKegiatan: 'Bantuan Langsung Tunai',
    volume: 50,
    satuan: 'keluarga',
    anggaran: 50000000,
   realisasi: 50000000,
    sisa: 0,
    tanggalRealisasi: '2024-03-10',
    keterangan: 'BLT DD bulan Januari-Maret',
    position: 2,
  },
];