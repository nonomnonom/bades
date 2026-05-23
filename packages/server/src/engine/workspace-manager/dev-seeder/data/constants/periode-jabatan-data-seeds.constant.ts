type PeriodeJabatanDataSeed = {
  id: string;
  namaPejabat: string;
  namaJabatan: string;
  tanggalMulai: string;
  tanggalSelesai: string | null;
  nomorSk: string;
  statusPeriode: string;
  keterangan: string;
  position: number;
};

export const PERIODE_JABATAN_DATA_SEED_COLUMNS: (keyof PeriodeJabatanDataSeed)[] = [
  'id',
  'namaPejabat',
  'namaJabatan',
  'tanggalMulai',
  'tanggalSelesai',
  'nomorSk',
  'statusPeriode',
  'keterangan',
  'position',
];

// prettier-ignore
export const PERIODE_JABATAN_DATA_SEED_IDS = {
  PJ_1: '20202020-f101-41e7-8c72-ba44072a4c58',
  PJ_2: '20202020-f102-4b3d-a89c-7f6c30df998a',
  PJ_3: '20202020-f103-422c-8fcf-5b7496f94975',
  PJ_4: '20202020-f104-41d6-87a9-7add07bebfd8',
  PJ_5: '20202020-f105-422b-9cb2-5f8382a56877',
  PJ_6: '20202020-f106-4644-867d-e8e1851b3ee8',
};

export const PERIODE_JABATAN_DATA_SEEDS: PeriodeJabatanDataSeed[] = [
  {
    id: PERIODE_JABATAN_DATA_SEED_IDS.PJ_1,
    namaPejabat: 'Drs. H. Abdullah',
    namaJabatan: 'Kepala Desa',
    tanggalMulai: '2021-08-01',
    tanggalSelesai: null,
    nomorSk: 'SK/BUP/2021/045',
    statusPeriode: 'AKTIF',
    keterangan: 'Periode kepemimpinan 2021-2027',
    position: 0,
  },
  {
    id: PERIODE_JABATAN_DATA_SEED_IDS.PJ_2,
    namaPejabat: 'Sugiono',
    namaJabatan: 'Sekretaris Desa',
    tanggalMulai: '2021-09-15',
    tanggalSelesai: null,
    nomorSk: 'SK/KADES/2021/008',
    statusPeriode: 'AKTIF',
    keterangan: 'PNS yang ditempatkan sebagai Sekdes',
    position: 1,
  },
  {
    id: PERIODE_JABATAN_DATA_SEED_IDS.PJ_3,
    namaPejabat: 'Siti Aminah',
    namaJabatan: 'Kaur Keuangan',
    tanggalMulai: '2022-01-10',
    tanggalSelesai: null,
    nomorSk: 'SK/KADES/2022/002',
    statusPeriode: 'AKTIF',
    keterangan: 'Kaur Keuangan aktif, mengelola APBDes',
    position: 2,
  },
  {
    id: PERIODE_JABATAN_DATA_SEED_IDS.PJ_4,
    namaPejabat: 'Budi Santoso',
    namaJabatan: 'Kasi Pemerintahan',
    tanggalMulai: '2022-01-10',
    tanggalSelesai: null,
    nomorSk: 'SK/KADES/2022/003',
    statusPeriode: 'AKTIF',
    keterangan: 'Kasi Pemerintahan, menangani administrasi kependudukan',
    position: 3,
  },
  {
    id: PERIODE_JABATAN_DATA_SEED_IDS.PJ_5,
    namaPejabat: 'Rohman',
    namaJabatan: 'Kasi Kesejahteraan',
    tanggalMulai: '2018-03-01',
    tanggalSelesai: '2021-12-31',
    nomorSk: 'SK/KADES/2018/011',
    statusPeriode: 'SELESAI',
    keterangan: 'Selesai masa jabatan, pensiun normal',
    position: 4,
  },
  {
    id: PERIODE_JABATAN_DATA_SEED_IDS.PJ_6,
    namaPejabat: 'Ahmad Rivai',
    namaJabatan: 'Kepala Dusun Krajan',
    tanggalMulai: '2021-10-01',
    tanggalSelesai: null,
    nomorSk: 'SK/KADES/2021/014',
    statusPeriode: 'AKTIF',
    keterangan: 'Kepala Dusun Krajan, dusun pusat desa',
    position: 5,
  },
];
