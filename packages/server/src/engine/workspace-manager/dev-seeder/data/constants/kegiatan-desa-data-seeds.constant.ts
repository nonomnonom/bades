type KegiatanDesaDataSeed = {
  id: string;
  namaKegiatan: string;
  jenisKegiatan: string;
  tanggalKegiatan: string;
  lokasi: string;
  penanggungJawab: string;
  jumlahPeserta: number;
  status: string;
  keterangan: string;
  position: number;
};

export const KEGIATAN_DESA_DATA_SEED_COLUMNS: (keyof KegiatanDesaDataSeed)[] = [
  'id',
  'namaKegiatan',
  'jenisKegiatan',
  'tanggalKegiatan',
  'lokasi',
  'penanggungJawab',
  'jumlahPeserta',
  'status',
  'keterangan',
  'position',
];

// prettier-ignore
export const KEGIATAN_DESA_DATA_SEED_IDS = {
  KD_1: '20202020-f401-41e7-8c72-ba44072a4c58',
  KD_2: '20202020-f402-4b3d-a89c-7f6c30df998a',
  KD_3: '20202020-f403-422c-8fcf-5b7496f94975',
  KD_4: '20202020-f404-41d6-87a9-7add07bebfd8',
  KD_5: '20202020-f405-422b-9cb2-5f8382a56877',
};

export const KEGIATAN_DESA_DATA_SEEDS: KegiatanDesaDataSeed[] = [
  {
    id: KEGIATAN_DESA_DATA_SEED_IDS.KD_1,
    namaKegiatan: 'Musrenbang Desa Tahun Anggaran 2026',
    jenisKegiatan: 'MUSRENBANG',
    tanggalKegiatan: '2026-01-15T08:00:00.000Z',
    lokasi: 'Balai Desa Sukamaju',
    penanggungJawab: 'Sugiono (Sekretaris Desa)',
    jumlahPeserta: 85,
    status: 'SELESAI',
    keterangan: 'Musrenbang penetapan prioritas pembangunan RKP Desa 2026',
    position: 0,
  },
  {
    id: KEGIATAN_DESA_DATA_SEED_IDS.KD_2,
    namaKegiatan: 'Gotong Royong Pembersihan Sungai Desa',
    jenisKegiatan: 'GOTONG_ROYONG',
    tanggalKegiatan: '2026-04-12T06:30:00.000Z',
    lokasi: 'Aliran Sungai Cikuda, Dusun Mekar Sari',
    penanggungJawab: 'Ahmad Rivai (Kepala Dusun Krajan)',
    jumlahPeserta: 60,
    status: 'SELESAI',
    keterangan: 'Pembersihan endapan sungai jelang musim hujan',
    position: 1,
  },
  {
    id: KEGIATAN_DESA_DATA_SEED_IDS.KD_3,
    namaKegiatan: 'Peringatan Hari Kemerdekaan RI ke-81',
    jenisKegiatan: 'HARI_BESAR',
    tanggalKegiatan: '2026-08-17T07:00:00.000Z',
    lokasi: 'Lapangan Desa Sukamaju',
    penanggungJawab: 'Karang Taruna Tunas Muda',
    jumlahPeserta: 350,
    status: 'DIRENCANAKAN',
    keterangan: 'Upacara bendera dan lomba rakyat tujuh belasan',
    position: 2,
  },
  {
    id: KEGIATAN_DESA_DATA_SEED_IDS.KD_4,
    namaKegiatan: 'Rapat Koordinasi BPD dan Pemdes Bulanan',
    jenisKegiatan: 'RAPAT_KOORDINASI',
    tanggalKegiatan: '2026-05-20T13:00:00.000Z',
    lokasi: 'Ruang Rapat Kantor Desa',
    penanggungJawab: 'Drs. H. Abdullah (Kepala Desa)',
    jumlahPeserta: 18,
    status: 'BERLANGSUNG',
    keterangan: 'Rakor evaluasi realisasi APBDes triwulan kedua',
    position: 3,
  },
  {
    id: KEGIATAN_DESA_DATA_SEED_IDS.KD_5,
    namaKegiatan: 'Penyuluhan Pencegahan Stunting',
    jenisKegiatan: 'PENYULUHAN',
    tanggalKegiatan: '2026-06-10T09:00:00.000Z',
    lokasi: 'Balai Dusun Krajan',
    penanggungJawab: 'Siti Aminah (Kaur Keuangan, koordinator program)',
    jumlahPeserta: 75,
    status: 'DIRENCANAKAN',
    keterangan: 'Sosialisasi ibu hamil dan kader Posyandu bersama Puskesmas',
    position: 4,
  },
];
