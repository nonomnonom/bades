type SuratKeluarDataSeed = {
  id: string;
  nomorSurat: string;
  tanggalSurat: string;
  perihal: string;
  tujuan: string;
  klasifikasi: string;
  penandatangan: string;
  keterangan: string;
  position: number;
};

export const SURAT_KELUAR_DATA_SEED_COLUMNS: (keyof SuratKeluarDataSeed)[] = [
  'id',
  'nomorSurat',
  'tanggalSurat',
  'perihal',
  'tujuan',
  'klasifikasi',
  'penandatangan',
  'keterangan',
  'position',
];

// prettier-ignore
export const SURAT_KELUAR_DATA_SEED_IDS = {
  SK_1: '20202020-a101-41e7-8c72-ba44072a4c58',
  SK_2: '20202020-a102-4b3d-a89c-7f6c30df998a',
  SK_3: '20202020-a103-422c-8fcf-5b7496f94975',
  SK_4: '20202020-a104-41d6-87a9-7add07bebfd8',
  SK_5: '20202020-a105-422b-9cb2-5f8382a56877',
  SK_6: '20202020-a106-4644-867d-e8e1851b3ee8',
};

export const SURAT_KELUAR_DATA_SEEDS: SuratKeluarDataSeed[] = [
  {
    id: SURAT_KELUAR_DATA_SEED_IDS.SK_1,
    nomorSurat: '470/001/SK/2025',
    tanggalSurat: '2025-01-12',
    perihal: 'Pengantar Surat Keterangan Domisili',
    tujuan: 'Kantor Camat Sukamaju',
    klasifikasi: 'BIASA',
    penandatangan: 'Drs. H. Abdullah',
    keterangan: 'Surat pengantar untuk warga Ahmad Pratama',
    position: 0,
  },
  {
    id: SURAT_KELUAR_DATA_SEED_IDS.SK_2,
    nomorSurat: '141/002/SK/2025',
    tanggalSurat: '2025-01-20',
    perihal: 'Undangan Musyawarah Desa',
    tujuan: 'BPD dan Lembaga Kemasyarakatan Desa',
    klasifikasi: 'SEGERA',
    penandatangan: 'Drs. H. Abdullah',
    keterangan: 'Undangan Musdes pembahasan APBDes 2025',
    position: 1,
  },
  {
    id: SURAT_KELUAR_DATA_SEED_IDS.SK_3,
    nomorSurat: '900/003/SK/2025',
    tanggalSurat: '2025-02-05',
    perihal: 'Laporan Realisasi Dana Desa Triwulan IV 2024',
    tujuan: 'Dinas PMD Kabupaten',
    klasifikasi: 'BIASA',
    penandatangan: 'Sugiono',
    keterangan: 'Laporan realisasi DD ditandatangani Sekdes',
    position: 2,
  },
  {
    id: SURAT_KELUAR_DATA_SEED_IDS.SK_4,
    nomorSurat: '331/004/SK/2025',
    tanggalSurat: '2025-02-18',
    perihal: 'Permohonan Bantuan Bibit Pertanian',
    tujuan: 'Dinas Pertanian Kabupaten',
    klasifikasi: 'BIASA',
    penandatangan: 'Drs. H. Abdullah',
    keterangan: 'Permohonan bibit padi untuk kelompok tani Dusun Tegal Asri',
    position: 3,
  },
  {
    id: SURAT_KELUAR_DATA_SEED_IDS.SK_5,
    nomorSurat: '005/005/SK/2025',
    tanggalSurat: '2025-03-01',
    perihal: 'Surat Keputusan Pengangkatan Kasi Pelayanan',
    tujuan: 'Yang bersangkutan',
    klasifikasi: 'RAHASIA',
    penandatangan: 'Drs. H. Abdullah',
    keterangan: 'SK internal pengangkatan perangkat desa',
    position: 4,
  },
  {
    id: SURAT_KELUAR_DATA_SEED_IDS.SK_6,
    nomorSurat: '470/006/SK/2025',
    tanggalSurat: '2025-03-15',
    perihal: 'Surat Keterangan Tidak Mampu',
    tujuan: 'RSUD Kabupaten',
    klasifikasi: 'BIASA',
    penandatangan: 'Drs. H. Abdullah',
    keterangan: 'SKTM untuk warga Karyono, rujukan RSUD',
    position: 5,
  },
];
