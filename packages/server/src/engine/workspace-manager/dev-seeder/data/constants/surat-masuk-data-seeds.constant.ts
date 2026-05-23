type SuratMasukDataSeed = {
  id: string;
  nomorAgenda: string;
  tanggalDiterima: string;
  nomorSurat: string;
  tanggalSurat: string;
  pengirim: string;
  perihal: string;
  klasifikasi: string;
  disposisiKe: string;
  keterangan: string;
  position: number;
};

export const SURAT_MASUK_DATA_SEED_COLUMNS: (keyof SuratMasukDataSeed)[] = [
  'id',
  'nomorAgenda',
  'tanggalDiterima',
  'nomorSurat',
  'tanggalSurat',
  'pengirim',
  'perihal',
  'klasifikasi',
  'disposisiKe',
  'keterangan',
  'position',
];

// prettier-ignore
export const SURAT_MASUK_DATA_SEED_IDS = {
  SM_1: '20202020-a201-41e7-8c72-ba44072a4c58',
  SM_2: '20202020-a202-4b3d-a89c-7f6c30df998a',
  SM_3: '20202020-a203-422c-8fcf-5b7496f94975',
  SM_4: '20202020-a204-41d6-87a9-7add07bebfd8',
  SM_5: '20202020-a205-422b-9cb2-5f8382a56877',
  SM_6: '20202020-a206-4644-867d-e8e1851b3ee8',
};

export const SURAT_MASUK_DATA_SEEDS: SuratMasukDataSeed[] = [
  {
    id: SURAT_MASUK_DATA_SEED_IDS.SM_1,
    nomorAgenda: 'AGD/2025/001',
    tanggalDiterima: '2025-01-08',
    nomorSurat: '005/45/CAM/2025',
    tanggalSurat: '2025-01-06',
    pengirim: 'Kantor Camat Sukamaju',
    perihal: 'Undangan Rapat Koordinasi Camat',
    klasifikasi: 'SEGERA',
    disposisiKe: 'Kepala Desa',
    keterangan: 'Rapat koordinasi kecamatan triwulan I',
    position: 0,
  },
  {
    id: SURAT_MASUK_DATA_SEED_IDS.SM_2,
    nomorAgenda: 'AGD/2025/002',
    tanggalDiterima: '2025-01-15',
    nomorSurat: '900/112/PMD/2025',
    tanggalSurat: '2025-01-13',
    pengirim: 'Dinas PMD Kabupaten',
    perihal: 'Pemberitahuan Pencairan Dana Desa Tahap I',
    klasifikasi: 'BIASA',
    disposisiKe: 'Kaur Keuangan',
    keterangan: 'Pencairan DD tahap I tahun 2025',
    position: 1,
  },
  {
    id: SURAT_MASUK_DATA_SEED_IDS.SM_3,
    nomorAgenda: 'AGD/2025/003',
    tanggalDiterima: '2025-01-22',
    nomorSurat: '440/87/DINKES/2025',
    tanggalSurat: '2025-01-20',
    pengirim: 'Dinas Kesehatan Kabupaten',
    perihal: 'Jadwal Posyandu Lansia Tahun 2025',
    klasifikasi: 'BIASA',
    disposisiKe: 'Kasi Kesejahteraan',
    keterangan: 'Penetapan jadwal Posyandu lansia per dusun',
    position: 2,
  },
  {
    id: SURAT_MASUK_DATA_SEED_IDS.SM_4,
    nomorAgenda: 'AGD/2025/004',
    tanggalDiterima: '2025-02-03',
    nomorSurat: '331/154/PERTANIAN/2025',
    tanggalSurat: '2025-02-01',
    pengirim: 'Dinas Pertanian Provinsi Jawa Barat',
    perihal: 'Sosialisasi Program Bantuan Pupuk Subsidi',
    klasifikasi: 'BIASA',
    disposisiKe: 'Kasi Kesejahteraan',
    keterangan: 'Sosialisasi pupuk subsidi musim tanam 2025',
    position: 3,
  },
  {
    id: SURAT_MASUK_DATA_SEED_IDS.SM_5,
    nomorAgenda: 'AGD/2025/005',
    tanggalDiterima: '2025-02-18',
    nomorSurat: '700/22/INSPEKTORAT/2025',
    tanggalSurat: '2025-02-15',
    pengirim: 'Inspektorat Kabupaten',
    perihal: 'Pemberitahuan Audit Reguler APBDes 2024',
    klasifikasi: 'RAHASIA',
    disposisiKe: 'Sekretaris Desa',
    keterangan: 'Audit reguler keuangan desa, persiapan dokumen',
    position: 4,
  },
  {
    id: SURAT_MASUK_DATA_SEED_IDS.SM_6,
    nomorAgenda: 'AGD/2025/006',
    tanggalDiterima: '2025-03-05',
    nomorSurat: '005/78/BPD/2025',
    tanggalSurat: '2025-03-04',
    pengirim: 'BPD Desa Sukamaju',
    perihal: 'Permohonan Audiensi Pembahasan RKPDes',
    klasifikasi: 'BIASA',
    disposisiKe: 'Kepala Desa',
    keterangan: 'BPD minta audiensi sebelum musrenbangdes',
    position: 5,
  },
];
