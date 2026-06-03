import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

type SuratKeluarDataSeed = {
  id: string;
  arahSurat: string;
  asalSurat: string | null;
  nomorSurat: string;
  tanggalSurat: string;
  perihal: string;
  tujuan: string;
  klasifikasi: string;
  penandatangan: string;
  keterangan: string;
  createdBySource: string;
  createdByWorkspaceMemberId: string;
  createdByName: string;
  updatedBySource: string;
  updatedByWorkspaceMemberId: string;
  updatedByName: string;
  position: number;
};

export const SURAT_KELUAR_DATA_SEED_COLUMNS: (keyof SuratKeluarDataSeed)[] = [
  'id',
  'arahSurat',
  'asalSurat',
  'nomorSurat',
  'tanggalSurat',
  'perihal',
  'tujuan',
  'klasifikasi',
  'penandatangan',
  'keterangan',
  'createdBySource',
  'createdByWorkspaceMemberId',
  'createdByName',
  'updatedBySource',
  'updatedByWorkspaceMemberId',
  'updatedByName',
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
  // Surat Masuk
  SM_1: '20202020-a107-5124-9d84-ca44072b5e01',
  SM_2: '20202020-a108-6125-0e95-db55082c6f12',
};

const KADES_USER_ID = WORKSPACE_MEMBER_DATA_SEED_IDS.KADES;

export const SURAT_KELUAR_DATA_SEEDS: SuratKeluarDataSeed[] = [
  {
    id: SURAT_KELUAR_DATA_SEED_IDS.SK_1,
    arahSurat: 'KELUAR',
    asalSurat: null,
    nomorSurat: '470/001/SK/2025',
    tanggalSurat: '2025-01-12',
    perihal: 'Pengantar Surat Keterangan Domisili',
    tujuan: 'Kantor Camat Sukamaju',
    klasifikasi: 'BIASA',
    penandatangan: 'Drs. H. Abdullah',
    keterangan: 'Surat pengantar untuk warga Ahmad Pratama',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 0,
  },
  {
    id: SURAT_KELUAR_DATA_SEED_IDS.SK_2,
    arahSurat: 'KELUAR',
    asalSurat: null,
    nomorSurat: '141/002/SK/2025',
    tanggalSurat: '2025-01-20',
    perihal: 'Undangan Musyawarah Desa',
    tujuan: 'BPD dan Lembaga Kemasyarakatan Desa',
    klasifikasi: 'SEGERA',
    penandatangan: 'Drs. H. Abdullah',
    keterangan: 'Undangan Musdes pembahasan APBDes 2025',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 1,
  },
  {
    id: SURAT_KELUAR_DATA_SEED_IDS.SK_3,
    arahSurat: 'KELUAR',
    asalSurat: null,
    nomorSurat: '900/003/SK/2025',
    tanggalSurat: '2025-02-05',
    perihal: 'Laporan Realisasi Dana Desa Triwulan IV 2024',
    tujuan: 'Dinas PMD Kabupaten',
    klasifikasi: 'BIASA',
    penandatangan: 'Sugiono',
    keterangan: 'Laporan realisasi DD ditandatangani Sekdes',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 2,
  },
  {
    id: SURAT_KELUAR_DATA_SEED_IDS.SK_4,
    arahSurat: 'KELUAR',
    asalSurat: null,
    nomorSurat: '331/004/SK/2025',
    tanggalSurat: '2025-02-18',
    perihal: 'Permohonan Bantuan Bibit Pertanian',
    tujuan: 'Dinas Pertanian Kabupaten',
    klasifikasi: 'BIASA',
    penandatangan: 'Drs. H. Abdullah',
    keterangan: 'Permohonan bibit padi untuk kelompok tani Dusun Tegal Asri',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 3,
  },
  {
    id: SURAT_KELUAR_DATA_SEED_IDS.SK_5,
    arahSurat: 'KELUAR',
    asalSurat: null,
    nomorSurat: '005/005/SK/2025',
    tanggalSurat: '2025-03-01',
    perihal: 'Surat Keputusan Pengangkatan Kasi Pelayanan',
    tujuan: 'Yang bersangkutan',
    klasifikasi: 'RAHASIA',
    penandatangan: 'Drs. H. Abdullah',
    keterangan: 'SK internal pengangkatan perangkat desa',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 4,
  },
  {
    id: SURAT_KELUAR_DATA_SEED_IDS.SK_6,
    arahSurat: 'KELUAR',
    asalSurat: null,
    nomorSurat: '470/006/SK/2025',
    tanggalSurat: '2025-03-15',
    perihal: 'Surat Keterangan Tidak Mampu',
    tujuan: 'RSUD Kabupaten',
    klasifikasi: 'BIASA',
    penandatangan: 'Drs. H. Abdullah',
    keterangan: 'SKTM untuk warga Karyono, rujukan RSUD',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 5,
  },
  // Surat Masuk — arahSurat = 'MASUK', asalSurat diisi instansi pengirim
  {
    id: SURAT_KELUAR_DATA_SEED_IDS.SM_1,
    arahSurat: 'MASUK',
    asalSurat: 'Kecamatan Cibaregbeg',
    nomorSurat: '001/KEC/2025',
    tanggalSurat: '2025-02-01',
    perihal: 'Edaran Kecamatan tentang Musrenbangdes 2025',
    tujuan: 'Kepala Desa Sukamaju',
    klasifikasi: 'BIASA',
    penandatangan: 'Camat Cibaregbeg',
    keterangan: 'Edaran musrenbang dari kecamatan',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 6,
  },
  {
    id: SURAT_KELUAR_DATA_SEED_IDS.SM_2,
    arahSurat: 'MASUK',
    asalSurat: 'Dinas Pemberdayaan Masyarakat dan Desa Kab.',
    nomorSurat: '100/DPMD/2025',
    tanggalSurat: '2025-03-10',
    perihal: 'Undangan Bimtek Pengelolaan Keuangan Desa',
    tujuan: 'Sekretaris Desa',
    klasifikasi: 'SEGERA',
    penandatangan: 'Kepala DPMD',
    keterangan: 'Undangan bimtek untuk Sekdes dan Kaur Keuangan',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 7,
  },
];
