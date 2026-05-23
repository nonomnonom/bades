type SumberDanaDataSeed = {
  id: string;
  kode: string;
  namaSumber: string;
  tahunAnggaran: number;
  pagu: number;
  keterangan: string;
  position: number;
};

export const SUMBER_DANA_DATA_SEED_COLUMNS: (keyof SumberDanaDataSeed)[] = [
  'id',
  'kode',
  'namaSumber',
  'tahunAnggaran',
  'pagu',
  'keterangan',
  'position',
];

// prettier-ignore
export const SUMBER_DANA_DATA_SEED_IDS = {
  SD_DD: '20202020-c101-41e7-8c72-ba44072a4c58',
  SD_ADD: '20202020-c102-4b3d-a89c-7f6c30df998a',
  SD_PAD: '20202020-c103-422c-8fcf-5b7496f94975',
  SD_BPROV: '20202020-c104-41d6-87a9-7add07bebfd8',
  SD_BKAB: '20202020-c105-422b-9cb2-5f8382a56877',
};

export const SUMBER_DANA_DATA_SEEDS: SumberDanaDataSeed[] = [
  {
    id: SUMBER_DANA_DATA_SEED_IDS.SD_DD,
    kode: 'DD',
    namaSumber: 'Dana Desa',
    tahunAnggaran: 2025,
    pagu: 980000000,
    keterangan: 'Transfer dari APBN melalui rekening kas desa',
    position: 0,
  },
  {
    id: SUMBER_DANA_DATA_SEED_IDS.SD_ADD,
    kode: 'ADD',
    namaSumber: 'Alokasi Dana Desa',
    tahunAnggaran: 2025,
    pagu: 520000000,
    keterangan: 'Bagian dari dana perimbangan kabupaten untuk desa',
    position: 1,
  },
  {
    id: SUMBER_DANA_DATA_SEED_IDS.SD_PAD,
    kode: 'PAD',
    namaSumber: 'Pendapatan Asli Desa',
    tahunAnggaran: 2025,
    pagu: 95000000,
    keterangan: 'Pendapatan dari aset desa, pasar desa, dan BUMDes',
    position: 2,
  },
  {
    id: SUMBER_DANA_DATA_SEED_IDS.SD_BPROV,
    kode: 'BPROV',
    namaSumber: 'Bantuan Keuangan Provinsi',
    tahunAnggaran: 2025,
    pagu: 80000000,
    keterangan: 'Bantuan keuangan dari Provinsi Jawa Barat',
    position: 3,
  },
  {
    id: SUMBER_DANA_DATA_SEED_IDS.SD_BKAB,
    kode: 'BKAB',
    namaSumber: 'Bantuan Keuangan Kabupaten',
    tahunAnggaran: 2025,
    pagu: 50000000,
    keterangan: 'Bantuan keuangan khusus dari Kabupaten',
    position: 4,
  },
];
