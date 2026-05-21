type ProgramBantuanDataSeed = {
  id: string;
  namaProgram: string;
  jenisBantuan: string;
  sumberDana: string;
  jumlahPenerima: number;
  nilaiPerOrang: number;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: string;
  keterangan: string;
  position: number;
};

export const PROGRAM_BANTUAN_DATA_SEED_COLUMNS: (keyof ProgramBantuanDataSeed)[] = [
  'id',
  'namaProgram',
  'jenisBantuan',
  'sumberDana',
  'jumlahPenerima',
  'nilaiPerOrang',
  'tanggalMulai',
  'tanggalSelesai',
  'status',
  'keterangan',
  'position',
];

export const PROGRAM_BANTUAN_DATA_SEED_IDS = {
  PROG_1: '20202020-g001-41e7-8c72-ba44072a4c58',
  PROG_2: '20202020-g002-4b3d-a89c-7f6c30df998a',
  PROG_3: '20202020-g003-422c-8fcf-5b7496f94975',
};

export const PROGRAM_BANTUAN_DATA_SEEDS: ProgramBantuanDataSeed[] = [
  {
    id: PROGRAM_BANTUAN_DATA_SEED_IDS.PROG_1,
    namaProgram: 'Bantuan Langsung Tunai - Dana Desa',
    jenisBantuan: 'BLT',
    sumberDana: 'Dana Desa',
    jumlahPenerima: 25,
    nilaiPerOrang: 300000,
    tanggalMulai: '2024-01-01',
    tanggalSelesai: '2024-12-31',
    status: 'SELESAI',
    keterangan: 'BLT DD tahun 2024',
    position: 0,
  },
  {
    id: PROGRAM_BANTUAN_DATA_SEED_IDS.PROG_2,
    namaProgram: 'Bantuan Paket Sembako',
    jenisBantuan: 'BPNT',
    sumberDana: 'Kemensos',
    jumlahPenerima: 40,
    nilaiPerOrang: 200000,
    tanggalMulai: '2024-02-01',
    tanggalSelesai: '2024-11-30',
    status: 'PELAKSANAAN',
    keterangan: 'BPNT melalui e-Warong',
    position: 1,
  },
  {
    id: PROGRAM_BANTUAN_DATA_SEED_IDS.PROG_3,
    namaProgram: 'Program Keluarga Harapan',
    jenisBantuan: 'PKH',
    sumberDana: 'Kemensos',
    jumlahPenerima: 15,
    nilaiPerOrang: 500000,
    tanggalMulai: '2024-01-01',
    tanggalSelesai: '2024-12-31',
    status: 'PELAKSANAAN',
    keterangan: 'PKH tahap 1 dan 2',
    position: 2,
  },
];