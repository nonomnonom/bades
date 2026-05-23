type PenerimaBantuanDataSeed = {
  id: string;
  namaPenerima: string;
  nik: string;
  alamat: string;
  statusPenerimaan: string;
  keterangan: string;
  position: number;
};

export const PENERIMA_BANTUAN_DATA_SEED_COLUMNS: (keyof PenerimaBantuanDataSeed)[] =
  [
    'id',
    'namaPenerima',
    'nik',
    'alamat',
    'statusPenerimaan',
    'keterangan',
    'position',
  ];

export const PENERIMA_BANTUAN_DATA_SEED_IDS = {
  PENERIMA_1: '20202020-f001-41e7-8c72-ba44072a4c58',
  PENERIMA_2: '20202020-f002-4b3d-a89c-7f6c30df998a',
  PENERIMA_3: '20202020-f003-422c-8fcf-5b7496f94975',
};

export const PENERIMA_BANTUAN_DATA_SEEDS: PenerimaBantuanDataSeed[] = [
  {
    id: PENERIMA_BANTUAN_DATA_SEED_IDS.PENERIMA_1,
    namaPenerima: 'Siti Nurhaliza',
    nik: '3201234567890002',
    alamat: 'Jl. Desa Sukamaju No. 1',
    statusPenerimaan: 'TERVERIFIKASI',
    keterangan: 'Penerima BLT DD',
    position: 0,
  },
  {
    id: PENERIMA_BANTUAN_DATA_SEED_IDS.PENERIMA_2,
    namaPenerima: 'Dewi Kusuma',
    nik: '3201234567890005',
    alamat: 'Jl. Raya Desa No. 10',
    statusPenerimaan: 'TERVERIFIKASI',
    keterangan: 'Penerima BPNT',
    position: 1,
  },
  {
    id: PENERIMA_BANTUAN_DATA_SEED_IDS.PENERIMA_3,
    namaPenerima: 'Juhairiah',
    nik: '3201234567890010',
    alamat: 'Jl. Desa Mekar Sari No. 8',
    statusPenerimaan: 'MENUNGGU',
    keterangan: 'Pendaftar baru PKH',
    position: 2,
  },
];
