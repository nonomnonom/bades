import { SHARED_PEOPLE_AVATAR_URLS } from '@/content/site/asset-paths';
import type {
  RecordPageDefinition,
  RowDef,
} from '@/sections/AppPreview/types/app-preview-data';

export const NEW_TASK_ROWS: RowDef[] = [
  {
    id: 'task-surat-domisili',
    cells: {
      title: {
        type: 'text',
        value: 'Proses Surat Domisili - Budi Santoso',
        shortLabel: 'S',
        tone: 'teal',
      },
      assignee: {
        type: 'person',
        name: 'Ahmad Hidayat',
        tone: 'gray',
        kind: 'person',
        avatarUrl: SHARED_PEOPLE_AVATAR_URLS.darioAmodei,
      },
      dueDate: { type: 'text', value: '21 Mei 2026' },
      relatedTo: {
        type: 'entity',
        name: 'Budi Santoso',
        domain: 'Penduduk',
      },
      status: { type: 'tag', value: 'Menunggu' },
    },
  },
  {
    id: 'task-sktm',
    cells: {
      title: {
        type: 'text',
        value: 'Verifikasi SKTM - Siti Rahayu',
        shortLabel: 'V',
        tone: 'teal',
      },
      assignee: {
        type: 'person',
        name: 'Dewi Lestari',
        tone: 'teal',
        kind: 'person',
        avatarUrl: SHARED_PEOPLE_AVATAR_URLS.stewartButterfield,
      },
      dueDate: { type: 'text', value: '22 Mei 2026' },
      relatedTo: {
        type: 'entity',
        name: 'Siti Rahayu',
        domain: 'Penduduk',
      },
      status: { type: 'tag', value: 'Dalam Proses' },
    },
  },
  {
    id: 'task-bantuan',
    cells: {
      title: {
        type: 'text',
        value: 'Cek Data Penerima BLT-DD',
        shortLabel: 'C',
        tone: 'teal',
      },
      assignee: {
        type: 'person',
        name: 'Hendra Wijaya',
        tone: 'purple',
        kind: 'person',
        avatarUrl: SHARED_PEOPLE_AVATAR_URLS.dylanField,
      },
      dueDate: { type: 'text', value: '23 Mei 2026' },
      relatedTo: {
        type: 'entity',
        name: 'Program BLT-DD',
        domain: 'Bantuan',
      },
      status: { type: 'tag', value: 'Menunggu' },
    },
  },
  {
    id: 'task-posyandu',
    cells: {
      title: {
        type: 'text',
        value: 'Input Data Balita - Posyandu Mawar',
        shortLabel: 'I',
        tone: 'teal',
      },
      assignee: {
        type: 'person',
        name: 'Nur Hidayati',
        tone: 'gray',
        kind: 'person',
        avatarUrl: SHARED_PEOPLE_AVATAR_URLS.ivanZhao,
      },
      dueDate: { type: 'text', value: '24 Mei 2026' },
      relatedTo: {
        type: 'entity',
        name: 'Posyandu Mawar',
        domain: 'Kesehatan',
      },
      status: { type: 'tag', value: 'Selesai' },
    },
  },
];

export const NEW_COMPANY_ROW: RowDef = {
  id: 'desa-sukamaju',
  cells: {
    company: { type: 'entity', name: 'Desa Sukamaju', domain: 'sukamaju.desa.id' },
    url: { type: 'link', value: 'sukamaju.desa.id' },
    createdBy: {
      type: 'person',
      name: 'Admin Desa',
      tone: 'gray',
      kind: 'system',
      shortLabel: 'AD',
    },
    address: { type: 'text', value: 'Jl. Desa No. 1, Kec. Contoh' },
    accountOwner: {
      type: 'person',
      name: 'Kepala Desa',
      tone: 'amber',
      kind: 'person',
      avatarUrl: SHARED_PEOPLE_AVATAR_URLS.samAltman,
    },
    icp: { type: 'boolean', value: true },
    arr: { type: 'number', value: 'Rp 500.000.000' },
    linkedin: { type: 'link', value: 'desa-sukamaju' },
    industry: { type: 'tag', value: 'Pemerintahan Desa' },
    mainContact: {
      type: 'person',
      name: ' Drs. H. Abdullah',
      shortLabel: 'A',
      tone: 'amber',
      kind: 'person',
      avatarUrl: SHARED_PEOPLE_AVATAR_URLS.samAltman,
    },
    employees: { type: 'number', value: '15' },
    opportunities: { type: 'relation', items: [] },
    added: { type: 'text', value: 'Baru saja' },
  },
};

export const NEW_PERSON_ROW: RowDef = {
  id: 'budi-santoso',
  cells: {
    name: {
      type: 'person',
      name: 'Budi Santoso',
      tone: 'amber',
      kind: 'person',
      avatarUrl: SHARED_PEOPLE_AVATAR_URLS.samAltman,
    },
    company: { type: 'entity', name: 'Desa Sukamaju', domain: 'sukamaju.desa.id' },
    email: { type: 'link', value: 'budi.santoso@email.com' },
    phone: { type: 'text', value: '+62 812 3456 7890' },
    jobTitle: { type: 'text', value: 'Penduduk' },
    city: { type: 'text', value: 'Kota Contoh' },
    linkedin: { type: 'link', value: 'budi-santoso' },
    added: { type: 'text', value: 'Baru saja' },
  },
};

export const PROMPT_OPTIONS = [
  {
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    label: 'Tambah penduduk baru',
    navSteps: [
      { at: 0.25, target: 'Penduduk' },
      { at: 0.65, target: 'Keluarga' },
    ],
    response:
      'Menambahkan Budi Santoso sebagai penduduk baru. NIK: 1234567890123456, alamat: Jl. Merdeka No. 10, RT 003/RW 001, Desa Sukamaju. Data penduduk berhasil disimpan.',
  },
  {
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    label: 'Cari permohonan surat hari ini',
    navSteps: [{ at: 0.3, target: 'Surat' }],
    response:
      'Ditemukan 5 permohonan surat hari ini: 2 Surat Domisili, 1 SKTM, 1 Surat Pengantar Nikah, dan 1 Surat Keterangan Usaha. Status: 3 Menunggu, 2 Dalam Proses.',
  },
  {
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
    label: 'Buat laporan bulanan',
    navSteps: [{ at: 0.3, target: 'Laporan' }],
    response:
      'Membuat laporan bulanan Mei 2026. Ringkasan: 45 permohonan surat diproses, 120 penduduk baru terdaftar, 15 bantuan sosial disalurkan, 8 kegiatan desa dilaksanakan.',
  },
  {
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    label: 'Tampilkan data posyandu',
    navSteps: [{ at: 0.3, target: 'Kesehatan' }],
    response:
      'Data Posyandu Desa Sukamaju: 85 balita terdaftar, 12 ibu hamil, 4 kader kesehatan. Jadwal posyandu berikutnya: Minggu, 25 Mei 2026 di Balai Desa.',
  },
  {
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15 1.65 1.65 0 003 14.08V14a2 2 0 014 0v.09" />
      </svg>
    ),
    label: 'Cek status bantuan sosial',
    navSteps: [{ at: 0.4, target: 'Bantuan' }],
    response:
      'Status Bantuan Sosial Desa Sukamaju: BLT-DD aktif untuk 25 keluarga, PKH mencakup 12 KPM, BPNT melayani 8 penerima. Total dana tersalurkan: Rp 187.500.000.',
  },
];

export const QONTO_RECORD_PAGE: RecordPageDefinition = {
  type: 'record',
  header: {
    title: 'Desa Sukamaju',
    count: 12,
  },
  record: {
    logoDomain: 'sukamaju.desa.id',
    name: 'Desa Sukamaju',
    createdAt: 'Dibuat 4 jam yang lalu',
    fields: [
      { icon: 'link', label: 'Website', value: 'sukamaju.desa.id' },
      {
        icon: 'user',
        label: 'Kepala Desa',
        value: 'Drs. H. Abdullah',
        avatarUrl: SHARED_PEOPLE_AVATAR_URLS.philSchiller,
      },
      {
        icon: 'mapPin',
        label: 'Alamat',
        value: 'Jl. Desa No. 1, Kec. Contoh, Kab. Contoh',
      },
      { icon: 'check', label: 'Status', value: '✓ Aktif' },
      { icon: 'currency', label: 'Anggaran', value: 'Rp 500.000.000' },
      {
        icon: 'linkedin',
        label: 'Linkedin',
        value: 'linkedin.com/company/desa-sukamaju',
      },
      { icon: 'twitter', label: 'Twitter', value: '@desasukamaju' },
    ],
    moreCount: 12,
    relations: [
      {
        title: 'Dusun',
        items: [{ name: 'Dusun Utama', domain: 'sukamaju.desa.id' }],
      },
      {
        title: 'Permohonan',
        items: [{ name: 'Surat Domisili', domain: 'sukamaju.desa.id' }],
      },
      {
        title: 'Penduduk',
        count: 1250,
        items: [
          {
            name: 'Budi Santoso',
            avatarUrl: SHARED_PEOPLE_AVATAR_URLS.alexandreProt,
          },
          {
            name: 'Siti Rahayu',
            avatarUrl: SHARED_PEOPLE_AVATAR_URLS.steveAnavi,
          },
        ],
      },
    ],
  },
  notes: [
    {
      id: 'logged-call',
      title: 'Rapat Bulanan (Admin Desa ↔ BPD)',
      body: 'Pembahasan年终 laporan APBDes dan persiapan audit. ACTION: Perbaiki格式 laporan keuangan desa. Assign ke Kaur Keuangan.',
      relation: {
        name: 'Nur Hidayati',
        avatarUrl: SHARED_PEOPLE_AVATAR_URLS.alexandreProt,
      },
    },
    {
      id: 'follow-up',
      title: 'Follow-up data penduduk',
      body: 'Verifikasi ulang data penduduk yang belum sinkron dengan Dukcapil. Pastikan NIK dan KK sesuai.',
    },
    {
      id: 'third-note',
      title: 'Catatan ketiga',
      body: 'Koordinasikan jadwal posyandu bulan depan dengan Puskesmas. Perlu增加了 jadwal untuk dusun terpencil.',
    },
  ],
};