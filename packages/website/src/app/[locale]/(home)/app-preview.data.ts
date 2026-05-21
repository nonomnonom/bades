import type {
  AppPreviewConfig,
  DashboardData,
  DashboardPageDefinition,
  KanbanPageDefinition,
  TablePageDefinition,
} from '@/sections/AppPreview';
import { SHARED_PEOPLE_AVATAR_URLS } from '@/content/site/asset-paths';

const PEOPLE_AVATAR_URLS = SHARED_PEOPLE_AVATAR_URLS;

const LAYANAN_DASHBOARD_DATA: DashboardData = {
  metrics: [
    {
      id: 'permohonan-baru',
      title: 'Permohonan Baru',
      value: '2.432',
    },
    {
      id: 'selesai-bulan-ini',
      title: 'Selesai Bulan Ini',
      value: '161',
    },
    {
      id: 'tingkat-penyelesaian',
      title: 'Penyelesaian %',
      value: '94,2%',
    },
  ],
  visitsChart: {
    alt: 'Grafik batang perbandingan permohonan layanan tahun ini dan tahun lalu',
    height: 1116,
    src: '/images/home/hero/sales-dashboard/visits.webp',
    width: 2316,
  },
  revenueChart: {
    alt: 'Grafik garis realisasi anggaran per bulan',
    height: 1116,
    src: '/images/home/hero/sales-dashboard/revenue.webp',
    width: 2316,
  },
  distributionChart: {
    alt: 'Diagram donat distribusi jenis layanan surat',
    height: 1116,
    src: '/images/home/hero/sales-dashboard/distribution.webp',
    width: 756,
  },
};

const LAYANAN_DASHBOARD_PAGE: DashboardPageDefinition = {
  type: 'dashboard',
  header: {
    title: 'Dasbor Layanan Desa',
  },
  dashboard: LAYANAN_DASHBOARD_DATA,
};

const PERMOHONAN_KANBAN_PAGE: KanbanPageDefinition = {
  type: 'kanban',
  header: {
    title: 'Permohonan Aktif',
  },
  lanes: [
    {
      id: 'diajukan',
      label: 'Diajukan',
      tone: 'pink',
      cards: [
        {
          id: 'budi-sk-domisili',
          title: 'SK Domisili',
          amount: 'NIK 3201010101010001',
          company: {
            type: 'entity',
            name: 'Budi Santoso',
            domain: 'desa-suka-maju.id',
          },
          accountOwner: {
            type: 'person',
            name: 'Sari Dewi',
            tone: 'gray',
            kind: 'person',
            avatarUrl: PEOPLE_AVATAR_URLS.darioAmodei,
          },
          rating: 2,
          date: '1 Jan 2024',
          mainContact: {
            type: 'person',
            name: 'Sari Dewi',
            shortLabel: 'S',
            tone: 'gray',
            kind: 'person',
            avatarUrl: PEOPLE_AVATAR_URLS.darioAmodei,
          },
          recordId: 'LAY-001',
        },
        {
          id: 'rina-sk-tidak-mampu',
          title: 'SK Tidak Mampu',
          amount: 'NIK 3201010202020002',
          company: {
            type: 'entity',
            name: 'Rina Wulandari',
            domain: 'desa-suka-maju.id',
          },
          accountOwner: {
            type: 'person',
            name: 'Ahmad Fauzi',
            tone: 'purple',
            kind: 'person',
            avatarUrl: PEOPLE_AVATAR_URLS.dylanField,
          },
          rating: 2,
          date: '12 Jan 2024',
          mainContact: {
            type: 'person',
            name: 'Ahmad Fauzi',
            shortLabel: 'A',
            tone: 'purple',
            kind: 'person',
            avatarUrl: PEOPLE_AVATAR_URLS.dylanField,
          },
          recordId: 'LAY-002',
        },
      ],
    },
    {
      id: 'diverifikasi',
      label: 'Diverifikasi',
      tone: 'purple',
      cards: [
        {
          id: 'joko-sk-usaha',
          title: 'SK Usaha',
          amount: 'NIK 3201010303030003',
          company: {
            type: 'entity',
            name: 'Joko Widodo',
            domain: 'desa-suka-maju.id',
          },
          accountOwner: {
            type: 'person',
            name: 'Siti Rahma',
            tone: 'gray',
            kind: 'person',
            avatarUrl: PEOPLE_AVATAR_URLS.ivanZhao,
          },
          rating: 4,
          date: '8 Jan 2024',
          mainContact: {
            type: 'person',
            name: 'Siti Rahma',
            shortLabel: 'S',
            tone: 'gray',
            kind: 'person',
            avatarUrl: PEOPLE_AVATAR_URLS.ivanZhao,
          },
          recordId: 'LAY-003',
        },
      ],
    },
    {
      id: 'disetujui',
      label: 'Disetujui',
      tone: 'blue',
      cards: [
        {
          id: 'heri-sk-kelahiran',
          title: 'SK Kelahiran',
          amount: 'NIK 3201010404040004',
          company: {
            type: 'entity',
            name: 'Heri Susanto',
            domain: 'desa-suka-maju.id',
          },
          accountOwner: {
            type: 'person',
            name: 'Dewi Lestari',
            tone: 'gray',
            kind: 'person',
            avatarUrl: PEOPLE_AVATAR_URLS.chrisWanstrath,
          },
          rating: 3,
          date: '14 Jan 2024',
          mainContact: {
            type: 'person',
            name: 'Dewi Lestari',
            shortLabel: 'D',
            tone: 'gray',
            kind: 'person',
            avatarUrl: PEOPLE_AVATAR_URLS.thomasDohmke,
          },
          recordId: 'LAY-004',
        },
        {
          id: 'yanti-sk-kematian',
          title: 'SK Keterangan Kematian',
          amount: 'NIK 3201010505050005',
          company: {
            type: 'entity',
            name: 'Yanti Kusuma',
            domain: 'desa-suka-maju.id',
          },
          accountOwner: {
            type: 'person',
            name: 'Rudi Hartono',
            tone: 'blue',
            kind: 'person',
            avatarUrl: PEOPLE_AVATAR_URLS.patrickCollison,
          },
          rating: 5,
          date: '17 Jan 2024',
          mainContact: {
            type: 'person',
            name: 'Rudi Hartono',
            shortLabel: 'R',
            tone: 'blue',
            kind: 'person',
            avatarUrl: PEOPLE_AVATAR_URLS.patrickCollison,
          },
          recordId: 'LAY-005',
        },
        {
          id: 'agus-sk-pindah',
          title: 'SK Pindah Domisili',
          amount: 'NIK 3201010606060006',
          company: {
            type: 'entity',
            name: 'Agus Priyanto',
            domain: 'desa-suka-maju.id',
          },
          accountOwner: {
            type: 'person',
            name: 'Nina Safitri',
            tone: 'pink',
            kind: 'person',
            avatarUrl: PEOPLE_AVATAR_URLS.joeGebbia,
          },
          rating: 3,
          date: '15 Jan 2024',
          mainContact: {
            type: 'person',
            name: 'Nina Safitri',
            shortLabel: 'N',
            tone: 'pink',
            kind: 'person',
            avatarUrl: PEOPLE_AVATAR_URLS.brianChesky,
          },
          recordId: 'LAY-006',
        },
      ],
    },
    {
      id: 'diterbitkan',
      label: 'Diterbitkan',
      tone: 'green',
      cards: [],
    },
    {
      id: 'ditolak',
      label: 'Ditolak',
      tone: 'gray',
      cards: [
        {
          id: 'imam-sk-kelakuan-baik',
          title: 'SK Kelakuan Baik',
          amount: 'NIK 3201010707070007',
          company: {
            type: 'entity',
            name: 'Imam Subagio',
            domain: 'desa-suka-maju.id',
          },
          accountOwner: {
            type: 'person',
            name: 'Laras Puspita',
            tone: 'amber',
            kind: 'person',
            avatarUrl: PEOPLE_AVATAR_URLS.benChestnut,
          },
          rating: 4,
          date: '23 Jan 2024',
          mainContact: {
            type: 'person',
            name: 'Laras Puspita',
            shortLabel: 'L',
            tone: 'amber',
            kind: 'person',
            avatarUrl: PEOPLE_AVATAR_URLS.anonymousLaura,
          },
          recordId: 'LAY-007',
        },
      ],
    },
  ],
};

function createTablePage({
  title,
  count,
  columns,
  rows,
}: {
  title: string;
  count: number;
  columns: TablePageDefinition['columns'];
  rows: TablePageDefinition['rows'];
}): TablePageDefinition {
  return {
    type: 'table',
    header: {
      title,
      count,
    },
    columns,
    rows,
  };
}

export const APP_PREVIEW_DATA: { visual: AppPreviewConfig } = {
  visual: {
    workspace: { icon: 'apple', name: 'Desa Suka Maju' },
    tableWidth: 1700,
    actions: ['Saring', 'Urutkan', 'Opsi'],
    favoritesNav: [
      {
        id: 'layanan-dashboard',
        label: 'Dasbor Layanan Desa',
        icon: { kind: 'avatar', label: 'L', tone: 'amber', shape: 'circle' },
        meta: 'Dasbor',
        page: LAYANAN_DASHBOARD_PAGE,
      },
    ],
    workspaceNav: [
      {
        id: 'penduduk',
        label: 'Penduduk',
        icon: { kind: 'tabler', name: 'buildingSkyscraper', tone: 'blue' },
        active: true,
        page: createTablePage({
          title: 'Semua Penduduk',
          count: 9,
          columns: [
            {
              id: 'penduduk',
              label: 'Nama Penduduk',
              width: 180,
              isFirstColumn: true,
            },
            { id: 'nik', label: 'NIK', width: 140 },
            { id: 'dibuatOleh', label: 'Diinput Oleh', width: 150 },
            { id: 'alamat', label: 'Alamat', width: 120 },
            { id: 'petugasLayanan', label: 'Petugas Layanan', width: 150 },
            { id: 'aktif', label: 'Aktif', width: 80 },
            { id: 'bantuan', label: 'Bantuan', width: 120, align: 'right' },
            { id: 'noHp', label: 'No. HP', width: 96 },
            { id: 'pekerjaan', label: 'Pekerjaan', width: 96 },
            { id: 'kontakUtama', label: 'Kontak Utama', width: 120 },
            { id: 'anggotaKK', label: 'Anggota KK', width: 120, align: 'right' },
            { id: 'permohonan', label: 'Permohonan', width: 122 },
            { id: 'terdaftar', label: 'Terdaftar', width: 120 },
          ],
          rows: [
            {
              id: 'budi-santoso',
              cells: {
                penduduk: {
                  type: 'entity',
                  name: 'Budi Santoso',
                  domain: 'desa-suka-maju.id',
                },
                nik: { type: 'link', value: '3201010101010001' },
                dibuatOleh: {
                  type: 'person',
                  name: 'Sari Dewi',
                  tone: 'gray',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.darioAmodei,
                },
                alamat: { type: 'text', value: 'Jl. Melati No. 12, RT 01/RW 02' },
                petugasLayanan: {
                  type: 'person',
                  name: 'Sari Dewi',
                  tone: 'gray',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.darioAmodei,
                },
                aktif: { type: 'boolean', value: true },
                bantuan: { type: 'number', value: 'Rp 500.000' },
                noHp: { type: 'link', value: '081234567890' },
                pekerjaan: { type: 'tag', value: 'Petani' },
                kontakUtama: {
                  type: 'person',
                  name: 'Sari Dewi',
                  shortLabel: 'S',
                  tone: 'gray',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.darioAmodei,
                },
                anggotaKK: { type: 'number', value: '4' },
                permohonan: {
                  type: 'relation',
                  items: [
                    {
                      name: 'SK Domisili',
                      shortLabel: 'SKD',
                      tone: 'blue',
                    },
                  ],
                },
                terdaftar: { type: 'text', value: '1 Jan 2024' },
              },
            },
            {
              id: 'rina-wulandari',
              cells: {
                penduduk: {
                  type: 'entity',
                  name: 'Rina Wulandari',
                  domain: 'desa-suka-maju.id',
                },
                nik: { type: 'link', value: '3201010202020002' },
                dibuatOleh: {
                  type: 'person',
                  name: 'Ahmad Fauzi',
                  tone: 'purple',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.reidHoffman,
                },
                alamat: { type: 'text', value: 'Jl. Mawar No. 5, RT 02/RW 01' },
                petugasLayanan: {
                  type: 'person',
                  name: 'Ahmad Fauzi',
                  tone: 'teal',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.ryanRoslansky,
                },
                aktif: { type: 'boolean', value: false },
                bantuan: { type: 'number', value: 'Rp 1.000.000' },
                noHp: { type: 'link', value: '082345678901' },
                pekerjaan: { type: 'tag', value: 'Ibu Rumah Tangga' },
                kontakUtama: {
                  type: 'person',
                  name: 'Ahmad Fauzi',
                  shortLabel: 'A',
                  tone: 'teal',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.ryanRoslansky,
                },
                anggotaKK: { type: 'number', value: '3' },
                permohonan: {
                  type: 'relation',
                  items: [
                    {
                      name: 'SK Tidak Mampu',
                      shortLabel: 'SKTM',
                      tone: 'purple',
                    },
                  ],
                },
                terdaftar: { type: 'text', value: '3 Jan 2024' },
              },
            },
            {
              id: 'joko-widodo',
              cells: {
                penduduk: {
                  type: 'entity',
                  name: 'Joko Widodo',
                  domain: 'desa-suka-maju.id',
                },
                nik: { type: 'link', value: '3201010303030003' },
                dibuatOleh: {
                  type: 'person',
                  name: 'Siti Rahma',
                  tone: 'teal',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.stewartButterfield,
                },
                alamat: { type: 'text', value: 'Jl. Kenanga No. 8, RT 03/RW 02' },
                petugasLayanan: {
                  type: 'person',
                  name: 'Siti Rahma',
                  tone: 'teal',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.stewartButterfield,
                },
                aktif: { type: 'boolean', value: true },
                bantuan: { type: 'number', value: 'Rp 2.300.000' },
                noHp: { type: 'link', value: '083456789012' },
                pekerjaan: { type: 'tag', value: 'Pedagang' },
                kontakUtama: {
                  type: 'person',
                  name: 'Dewi Lestari',
                  shortLabel: 'D',
                  tone: 'pink',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.anonymousIndira,
                },
                anggotaKK: { type: 'number', value: '5' },
                permohonan: {
                  type: 'relation',
                  items: [
                    {
                      name: 'SK Usaha',
                      shortLabel: 'SKU',
                      tone: 'teal',
                    },
                  ],
                },
                terdaftar: { type: 'text', value: '5 Jan 2024' },
              },
            },
            {
              id: 'heri-susanto',
              cells: {
                penduduk: {
                  type: 'entity',
                  name: 'Heri Susanto',
                  domain: 'desa-suka-maju.id',
                },
                nik: { type: 'link', value: '3201010404040004' },
                dibuatOleh: {
                  type: 'person',
                  name: 'Badan Simpeg',
                  tone: 'gray',
                  kind: 'api',
                  shortLabel: 'API',
                },
                alamat: { type: 'text', value: 'Jl. Anggrek No. 3, RT 01/RW 03' },
                petugasLayanan: {
                  type: 'person',
                  name: 'Dewi Lestari',
                  tone: 'gray',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.ivanZhao,
                },
                aktif: { type: 'boolean', value: false },
                bantuan: { type: 'number', value: 'Rp 750.000' },
                noHp: { type: 'link', value: '084567890123' },
                pekerjaan: { type: 'tag', value: 'Buruh' },
                kontakUtama: {
                  type: 'person',
                  name: 'Dewi Lestari',
                  shortLabel: 'D',
                  tone: 'gray',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.ivanZhao,
                },
                anggotaKK: { type: 'number', value: '2' },
                permohonan: {
                  type: 'relation',
                  items: [
                    {
                      name: 'SK Kelahiran',
                      shortLabel: 'SKL',
                      tone: 'gray',
                    },
                  ],
                },
                terdaftar: { type: 'text', value: '8 Jan 2024' },
              },
            },
            {
              id: 'yanti-kusuma',
              cells: {
                penduduk: {
                  type: 'entity',
                  name: 'Yanti Kusuma',
                  domain: 'desa-suka-maju.id',
                },
                nik: { type: 'link', value: '3201010505050005' },
                dibuatOleh: {
                  type: 'person',
                  name: 'Alur Otomatis',
                  tone: 'gray',
                  kind: 'workflow',
                  shortLabel: 'OT',
                },
                alamat: { type: 'text', value: 'Jl. Dahlia No. 17, RT 04/RW 01' },
                petugasLayanan: {
                  type: 'person',
                  name: 'Rudi Hartono',
                  tone: 'purple',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.dylanField,
                },
                aktif: { type: 'boolean', value: true },
                bantuan: { type: 'number', value: 'Rp 3.500.000' },
                noHp: { type: 'link', value: '085678901234' },
                pekerjaan: { type: 'tag', value: 'Wiraswasta' },
                kontakUtama: {
                  type: 'person',
                  name: 'Rudi Hartono',
                  shortLabel: 'R',
                  tone: 'purple',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.dylanField,
                },
                anggotaKK: { type: 'number', value: '6' },
                permohonan: {
                  type: 'relation',
                  items: [
                    {
                      name: 'SK Kematian',
                      shortLabel: 'SKK',
                      tone: 'purple',
                    },
                    { name: 'SK Domisili', shortLabel: 'SKD', tone: 'teal' },
                  ],
                },
                terdaftar: { type: 'text', value: '12 Jan 2024' },
              },
            },
            {
              id: 'agus-priyanto',
              cells: {
                penduduk: {
                  type: 'entity',
                  name: 'Agus Priyanto',
                  domain: 'desa-suka-maju.id',
                },
                nik: { type: 'link', value: '3201010606060006' },
                dibuatOleh: {
                  type: 'person',
                  name: 'Nina Safitri',
                  tone: 'gray',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.chrisWanstrath,
                },
                alamat: { type: 'text', value: 'Jl. Flamboyan No. 22, RT 02/RW 03' },
                petugasLayanan: {
                  type: 'person',
                  name: 'Nina Safitri',
                  tone: 'gray',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.thomasDohmke,
                },
                aktif: { type: 'boolean', value: true },
                bantuan: { type: 'number', value: 'Rp 900.000' },
                noHp: { type: 'link', value: '086789012345' },
                pekerjaan: { type: 'tag', value: 'Nelayan' },
                kontakUtama: {
                  type: 'person',
                  name: 'Nina Safitri',
                  shortLabel: 'N',
                  tone: 'gray',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.thomasDohmke,
                },
                anggotaKK: { type: 'number', value: '3' },
                permohonan: {
                  type: 'relation',
                  items: [
                    {
                      name: 'SK Pindah Domisili',
                      shortLabel: 'SKPD',
                      tone: 'blue',
                    },
                  ],
                },
                terdaftar: { type: 'text', value: '14 Jan 2024' },
              },
            },
            {
              id: 'siti-aminah',
              cells: {
                penduduk: {
                  type: 'entity',
                  name: 'Siti Aminah',
                  domain: 'desa-suka-maju.id',
                },
                nik: { type: 'link', value: '3201010707070007' },
                dibuatOleh: {
                  type: 'person',
                  name: 'Laras Puspita',
                  tone: 'pink',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.joeGebbia,
                },
                alamat: { type: 'text', value: 'Jl. Seruni No. 9, RT 03/RW 03' },
                petugasLayanan: {
                  type: 'person',
                  name: 'Laras Puspita',
                  tone: 'pink',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.brianChesky,
                },
                aktif: { type: 'boolean', value: true },
                bantuan: { type: 'number', value: 'Rp 4.200.000' },
                noHp: { type: 'link', value: '087890123456' },
                pekerjaan: { type: 'tag', value: 'Guru' },
                kontakUtama: {
                  type: 'person',
                  name: 'Laras Puspita',
                  shortLabel: 'L',
                  tone: 'pink',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.brianChesky,
                },
                anggotaKK: { type: 'number', value: '4' },
                permohonan: {
                  type: 'relation',
                  items: [
                    {
                      name: 'SK UMKM',
                      shortLabel: 'SKUM',
                      tone: 'pink',
                    },
                  ],
                },
                terdaftar: { type: 'text', value: '15 Jan 2024' },
              },
            },
            {
              id: 'imam-subagio',
              cells: {
                penduduk: {
                  type: 'entity',
                  name: 'Imam Subagio',
                  domain: 'desa-suka-maju.id',
                },
                nik: { type: 'link', value: '3201010808080008' },
                dibuatOleh: {
                  type: 'person',
                  name: 'Fajar Nugroho',
                  tone: 'blue',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.patrickCollison,
                },
                alamat: { type: 'text', value: 'Jl. Teratai No. 15, RT 01/RW 01' },
                petugasLayanan: {
                  type: 'person',
                  name: 'Fajar Nugroho',
                  tone: 'blue',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.patrickCollison,
                },
                aktif: { type: 'boolean', value: true },
                bantuan: { type: 'number', value: 'Rp 1.800.000' },
                noHp: { type: 'link', value: '088901234567' },
                pekerjaan: { type: 'tag', value: 'Tukang' },
                kontakUtama: {
                  type: 'person',
                  name: 'Fajar Nugroho',
                  shortLabel: 'F',
                  tone: 'blue',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.patrickCollison,
                },
                anggotaKK: { type: 'number', value: '5' },
                permohonan: {
                  type: 'relation',
                  items: [
                    {
                      name: 'SK Kelakuan Baik',
                      shortLabel: 'SKKB',
                      tone: 'purple',
                    },
                  ],
                },
                terdaftar: { type: 'text', value: '17 Jan 2024' },
              },
            },
            {
              id: 'endang-suryani',
              cells: {
                penduduk: {
                  type: 'entity',
                  name: 'Endang Suryani',
                  domain: 'desa-suka-maju.id',
                },
                nik: { type: 'link', value: '3201010909090009' },
                dibuatOleh: {
                  type: 'person',
                  name: 'Hendra Pratama',
                  tone: 'green',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.roelofBotha,
                },
                alamat: { type: 'text', value: 'Jl. Cempaka No. 6, RT 02/RW 02' },
                petugasLayanan: {
                  type: 'person',
                  name: 'Hendra Pratama',
                  tone: 'green',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.roelofBotha,
                },
                aktif: { type: 'boolean', value: false },
                bantuan: { type: 'number', value: 'Rp 6.000.000' },
                noHp: { type: 'link', value: '089012345678' },
                pekerjaan: { type: 'tag', value: 'PNS' },
                kontakUtama: {
                  type: 'person',
                  name: 'Hendra Pratama',
                  shortLabel: 'H',
                  tone: 'green',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.roelofBotha,
                },
                anggotaKK: { type: 'number', value: '3' },
                permohonan: {
                  type: 'relation',
                  items: [
                    {
                      name: 'SK Pensiun',
                      shortLabel: 'SKP',
                      tone: 'green',
                    },
                  ],
                },
                terdaftar: { type: 'text', value: '20 Jan 2024' },
              },
            },
            {
              id: 'wahyu-setiawan',
              cells: {
                penduduk: {
                  type: 'entity',
                  name: 'Wahyu Setiawan',
                  domain: 'desa-suka-maju.id',
                },
                nik: { type: 'link', value: '3201011010100010' },
                dibuatOleh: {
                  type: 'person',
                  name: 'Tia Rahayu',
                  tone: 'teal',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.peterReinhardt,
                },
                alamat: { type: 'text', value: 'Jl. Bougenville No. 11, RT 04/RW 02' },
                petugasLayanan: {
                  type: 'person',
                  name: 'Tia Rahayu',
                  tone: 'teal',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.peterReinhardt,
                },
                aktif: { type: 'boolean', value: true },
                bantuan: { type: 'number', value: 'Rp 2.750.000' },
                noHp: { type: 'link', value: '081012345678' },
                pekerjaan: { type: 'tag', value: 'Karyawan Swasta' },
                kontakUtama: {
                  type: 'person',
                  name: 'Tia Rahayu',
                  shortLabel: 'T',
                  tone: 'teal',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.peterReinhardt,
                },
                anggotaKK: { type: 'number', value: '4' },
                permohonan: {
                  type: 'relation',
                  items: [
                    {
                      name: 'SK Keterangan Kerja',
                      shortLabel: 'SKKK',
                      tone: 'teal',
                    },
                  ],
                },
                terdaftar: { type: 'text', value: '21 Jan 2024' },
              },
            },
            {
              id: 'ratna-sari',
              cells: {
                penduduk: {
                  type: 'entity',
                  name: 'Ratna Sari',
                  domain: 'desa-suka-maju.id',
                },
                nik: { type: 'link', value: '3201011111110011' },
                dibuatOleh: {
                  type: 'person',
                  name: 'Bambang Susilo',
                  tone: 'amber',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.benChestnut,
                },
                alamat: { type: 'text', value: 'Jl. Kamboja No. 4, RT 03/RW 01' },
                petugasLayanan: {
                  type: 'person',
                  name: 'Bambang Susilo',
                  tone: 'amber',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.benChestnut,
                },
                aktif: { type: 'boolean', value: false },
                bantuan: { type: 'number', value: 'Rp 1.250.000' },
                noHp: { type: 'link', value: '082012345678' },
                pekerjaan: { type: 'tag', value: 'Petani' },
                kontakUtama: {
                  type: 'person',
                  name: 'Bambang Susilo',
                  shortLabel: 'B',
                  tone: 'amber',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.anonymousLaura,
                },
                anggotaKK: { type: 'number', value: '5' },
                permohonan: {
                  type: 'relation',
                  items: [
                    {
                      name: 'SK Keterangan Lahir',
                      shortLabel: 'SKKL',
                      tone: 'amber',
                    },
                  ],
                },
                terdaftar: { type: 'text', value: '23 Jan 2024' },
              },
            },
            {
              id: 'dian-permatasari',
              cells: {
                penduduk: {
                  type: 'entity',
                  name: 'Dian Permatasari',
                  domain: 'desa-suka-maju.id',
                },
                nik: { type: 'link', value: '3201011212120012' },
                dibuatOleh: {
                  type: 'person',
                  name: 'Wisnu Adhi',
                  tone: 'purple',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.rayDamm,
                },
                alamat: { type: 'text', value: 'Jl. Tulip No. 7, RT 01/RW 04' },
                petugasLayanan: {
                  type: 'person',
                  name: 'Citra Dewi',
                  tone: 'purple',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.pingLi,
                },
                aktif: { type: 'boolean', value: true },
                bantuan: { type: 'number', value: 'Rp 5.800.000' },
                noHp: { type: 'link', value: '083012345678' },
                pekerjaan: { type: 'tag', value: 'Bidan' },
                kontakUtama: {
                  type: 'person',
                  name: 'Citra Dewi',
                  shortLabel: 'C',
                  tone: 'purple',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.pingLi,
                },
                anggotaKK: { type: 'number', value: '3' },
                permohonan: {
                  type: 'relation',
                  items: [
                    {
                      name: 'SK Bidan Desa',
                      shortLabel: 'SKBD',
                      tone: 'purple',
                    },
                  ],
                },
                terdaftar: { type: 'text', value: '24 Jan 2024' },
              },
            },
            {
              id: 'mulyono-hadisaputro',
              cells: {
                penduduk: {
                  type: 'entity',
                  name: 'Mulyono Hadisaputro',
                  domain: 'desa-suka-maju.id',
                },
                nik: { type: 'link', value: '3201011313130013' },
                dibuatOleh: {
                  type: 'person',
                  name: 'Sistem',
                  tone: 'gray',
                  kind: 'system',
                  shortLabel: 'SIS',
                },
                alamat: { type: 'text', value: 'Jl. Nusa Indah No. 19, RT 04/RW 04' },
                petugasLayanan: {
                  type: 'person',
                  name: 'Eko Saputro',
                  tone: 'gray',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.peterThiel,
                },
                aktif: { type: 'boolean', value: true },
                bantuan: { type: 'number', value: 'Rp 2.100.000' },
                noHp: { type: 'link', value: '084012345678' },
                pekerjaan: { type: 'tag', value: 'Kepala Dusun' },
                kontakUtama: {
                  type: 'person',
                  name: 'Eko Saputro',
                  shortLabel: 'E',
                  tone: 'gray',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.peterThiel,
                },
                anggotaKK: { type: 'number', value: '4' },
                permohonan: {
                  type: 'relation',
                  items: [
                    {
                      name: 'SK Perangkat Desa',
                      shortLabel: 'SKPD',
                      tone: 'gray',
                    },
                  ],
                },
                terdaftar: { type: 'text', value: '25 Jan 2024' },
              },
            },
            {
              id: 'nurul-hidayah',
              cells: {
                penduduk: {
                  type: 'entity',
                  name: 'Nurul Hidayah',
                  domain: 'desa-suka-maju.id',
                },
                nik: { type: 'link', value: '3201011414140014' },
                dibuatOleh: {
                  type: 'person',
                  name: 'Fitri Handayani',
                  tone: 'teal',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.sundarPichai,
                },
                alamat: { type: 'text', value: 'Jl. Asoka No. 2, RT 02/RW 04' },
                petugasLayanan: {
                  type: 'person',
                  name: 'Fitri Handayani',
                  tone: 'teal',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.sundarPichai,
                },
                aktif: { type: 'boolean', value: false },
                bantuan: { type: 'number', value: 'Rp 7.500.000' },
                noHp: { type: 'link', value: '085012345678' },
                pekerjaan: { type: 'tag', value: 'Guru Honorer' },
                kontakUtama: {
                  type: 'person',
                  name: 'Fitri Handayani',
                  shortLabel: 'F',
                  tone: 'teal',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.sundarPichai,
                },
                anggotaKK: { type: 'number', value: '2' },
                permohonan: {
                  type: 'relation',
                  items: [
                    {
                      name: 'SK Rekomendasi Beasiswa',
                      shortLabel: 'SKRB',
                      tone: 'teal',
                    },
                    { name: 'SK Domisili', shortLabel: 'SKD', tone: 'teal' },
                    { name: 'SK Tidak Mampu', shortLabel: 'SKTM', tone: 'teal' },
                  ],
                },
                terdaftar: { type: 'text', value: '1 Jan 2024 14.25' },
              },
            },
          ],
        }),
      },
      {
        id: 'warga',
        label: 'Warga',
        icon: { kind: 'tabler', name: 'user', tone: 'blue' },
        page: createTablePage({
          title: 'Semua Warga',
          count: 5,
          columns: [
            { id: 'nama', label: 'Nama', width: 180, isFirstColumn: true },
            { id: 'keluarga', label: 'Keluarga (KK)', width: 160 },
            { id: 'email', label: 'Email', width: 200 },
            { id: 'noHp', label: 'No. HP', width: 160 },
            { id: 'jabatan', label: 'Jabatan', width: 160 },
            { id: 'dusun', label: 'Dusun', width: 120 },
            { id: 'noHpWa', label: 'WhatsApp', width: 140 },
            { id: 'terdaftar', label: 'Terdaftar', width: 160 },
          ],
          rows: [
            {
              id: 'sari-dewi',
              cells: {
                nama: {
                  type: 'person',
                  name: 'Sari Dewi',
                  tone: 'gray',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.darioAmodei,
                },
                keluarga: {
                  type: 'entity',
                  name: 'KK Budi Santoso',
                  domain: 'desa-suka-maju.id',
                },
                email: { type: 'link', value: 'sari.dewi@gmail.com' },
                noHp: { type: 'text', value: '+62 812 3456 7890' },
                jabatan: { type: 'text', value: 'Operator Desa' },
                dusun: { type: 'text', value: 'Dusun Timur' },
                noHpWa: { type: 'link', value: '081234567890' },
                terdaftar: { type: 'text', value: '3 Jan 2024' },
              },
            },
            {
              id: 'ahmad-fauzi',
              cells: {
                nama: {
                  type: 'person',
                  name: 'Ahmad Fauzi',
                  tone: 'teal',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.ryanRoslansky,
                },
                keluarga: {
                  type: 'entity',
                  name: 'KK Ahmad Fauzi',
                  domain: 'desa-suka-maju.id',
                },
                email: { type: 'link', value: 'ahmad.fauzi@gmail.com' },
                noHp: { type: 'text', value: '+62 823 4567 8901' },
                jabatan: { type: 'text', value: 'Kepala RT 02' },
                dusun: { type: 'text', value: 'Dusun Barat' },
                noHpWa: { type: 'link', value: '082345678901' },
                terdaftar: { type: 'text', value: '28 Jan 2024' },
              },
            },
            {
              id: 'siti-rahma',
              cells: {
                nama: {
                  type: 'person',
                  name: 'Siti Rahma',
                  tone: 'teal',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.stewartButterfield,
                },
                keluarga: {
                  type: 'entity',
                  name: 'KK Siti Rahma',
                  domain: 'desa-suka-maju.id',
                },
                email: { type: 'link', value: 'siti.rahma@gmail.com' },
                noHp: { type: 'text', value: '+62 834 5678 9012' },
                jabatan: { type: 'text', value: 'Sekretaris Desa' },
                dusun: { type: 'text', value: 'Dusun Tengah' },
                noHpWa: { type: 'link', value: '083456789012' },
                terdaftar: { type: 'text', value: '18 Jan 2024' },
              },
            },
            {
              id: 'dewi-lestari',
              cells: {
                nama: {
                  type: 'person',
                  name: 'Dewi Lestari',
                  tone: 'gray',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.ivanZhao,
                },
                keluarga: {
                  type: 'entity',
                  name: 'KK Heri Susanto',
                  domain: 'desa-suka-maju.id',
                },
                email: { type: 'link', value: 'dewi.lestari@gmail.com' },
                noHp: { type: 'text', value: '+62 856 7890 1234' },
                jabatan: { type: 'text', value: 'Bendahara Desa' },
                dusun: { type: 'text', value: 'Dusun Selatan' },
                noHpWa: { type: 'link', value: '085678901234' },
                terdaftar: { type: 'text', value: '8 Jan 2024' },
              },
            },
            {
              id: 'rudi-hartono',
              cells: {
                nama: {
                  type: 'person',
                  name: 'Rudi Hartono',
                  tone: 'purple',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.dylanField,
                },
                keluarga: {
                  type: 'entity',
                  name: 'KK Rudi Hartono',
                  domain: 'desa-suka-maju.id',
                },
                email: { type: 'link', value: 'rudi.hartono@gmail.com' },
                noHp: { type: 'text', value: '+62 867 8901 2345' },
                jabatan: { type: 'text', value: 'Kaur Pemerintahan' },
                dusun: { type: 'text', value: 'Dusun Utara' },
                noHpWa: { type: 'link', value: '086789012345' },
                terdaftar: { type: 'text', value: '12 Jan 2024' },
              },
            },
          ],
        }),
      },
      {
        id: 'permohonan',
        label: 'Permohonan',
        icon: { kind: 'tabler', name: 'targetArrow', tone: 'red' },
        page: PERMOHONAN_KANBAN_PAGE,
      },
      {
        id: 'agenda',
        label: 'Agenda',
        icon: { kind: 'tabler', name: 'checkbox', tone: 'teal' },
        page: createTablePage({
          title: 'Semua Agenda',
          count: 2,
          columns: [
            { id: 'judul', label: 'Judul', width: 220, isFirstColumn: true },
            { id: 'penanggungjawab', label: 'Penanggungjawab', width: 160 },
            { id: 'batasWaktu', label: 'Batas Waktu', width: 160 },
            { id: 'terkait', label: 'Terkait', width: 160 },
            { id: 'status', label: 'Status', width: 140 },
          ],
          rows: [
            {
              id: 'kirim-undangan-musdes',
              cells: {
                judul: {
                  type: 'text',
                  value: 'Kirim undangan Musyawarah Desa',
                  shortLabel: 'K',
                  tone: 'teal',
                },
                penanggungjawab: {
                  type: 'person',
                  name: 'Sari Dewi',
                  tone: 'gray',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.darioAmodei,
                },
                batasWaktu: { type: 'text', value: '25 Okt 2024' },
                terkait: {
                  type: 'entity',
                  name: 'KK Budi Santoso',
                  domain: 'desa-suka-maju.id',
                },
                status: { type: 'tag', value: 'Belum Dikerjakan' },
              },
            },
            {
              id: 'tinjau-laporan-apbdes',
              cells: {
                judul: {
                  type: 'text',
                  value: 'Tinjau laporan realisasi APBDes',
                  shortLabel: 'T',
                  tone: 'teal',
                },
                penanggungjawab: {
                  type: 'person',
                  name: 'Dewi Lestari',
                  tone: 'teal',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.stewartButterfield,
                },
                batasWaktu: { type: 'text', value: '28 Okt 2024' },
                terkait: {
                  type: 'entity',
                  name: 'KK Joko Widodo',
                  domain: 'desa-suka-maju.id',
                },
                status: { type: 'tag', value: 'Sedang Dikerjakan' },
              },
            },
          ],
        }),
      },
      {
        id: 'catatan',
        label: 'Catatan',
        icon: { kind: 'tabler', name: 'notes', tone: 'teal' },
        page: createTablePage({
          title: 'Semua Catatan',
          count: 2,
          columns: [
            { id: 'judul', label: 'Judul', width: 240, isFirstColumn: true },
            { id: 'dibuatOleh', label: 'Dibuat Oleh', width: 160 },
            { id: 'terkait', label: 'Terkait', width: 160 },
            { id: 'ditambahkan', label: 'Ditambahkan', width: 180 },
          ],
          rows: [
            {
              id: 'catatan-musdes-rkpdes',
              cells: {
                judul: {
                  type: 'text',
                  value: 'Catatan Musyawarah Perencanaan RKPDes',
                  shortLabel: 'M',
                  tone: 'green',
                },
                dibuatOleh: {
                  type: 'person',
                  name: 'Dewi Lestari',
                  tone: 'gray',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.ivanZhao,
                },
                terkait: {
                  type: 'entity',
                  name: 'KK Joko Widodo',
                  domain: 'desa-suka-maju.id',
                },
                ditambahkan: { type: 'text', value: '2 Sep 2024' },
              },
            },
            {
              id: 'rapat-koordinasi-posyandu',
              cells: {
                judul: {
                  type: 'text',
                  value: 'Rapat koordinasi Posyandu Melati',
                  shortLabel: 'R',
                  tone: 'green',
                },
                dibuatOleh: {
                  type: 'person',
                  name: 'Rudi Hartono',
                  tone: 'purple',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.dylanField,
                },
                terkait: {
                  type: 'entity',
                  name: 'KK Yanti Kusuma',
                  domain: 'desa-suka-maju.id',
                },
                ditambahkan: { type: 'text', value: '18 Okt 2024' },
              },
            },
          ],
        }),
      },
      {
        id: 'dasbor',
        label: 'Dasbor',
        icon: { kind: 'tabler', name: 'layoutDashboard', tone: 'gray' },
        page: createTablePage({
          title: 'Semua Dasbor',
          count: 2,
          columns: [
            { id: 'nama', label: 'Nama', width: 240, isFirstColumn: true },
            { id: 'dibuatOleh', label: 'Dibuat Oleh', width: 160 },
            { id: 'terakhirDiedit', label: 'Terakhir Diedit', width: 160 },
          ],
          rows: [
            {
              id: 'dasbor-layanan-desa',
              cells: {
                nama: {
                  type: 'text',
                  value: 'Dasbor Layanan Desa',
                  shortLabel: 'L',
                  targetLabel: 'Dasbor Layanan Desa',
                  tone: 'amber',
                },
                dibuatOleh: {
                  type: 'person',
                  name: 'Sari Dewi',
                  tone: 'gray',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.darioAmodei,
                },
                terakhirDiedit: { type: 'text', value: '24 Okt 2024' },
              },
            },
            {
              id: 'status-permohonan',
              cells: {
                nama: {
                  type: 'text',
                  value: 'Status Alur Permohonan',
                  shortLabel: 'P',
                  tone: 'blue',
                },
                dibuatOleh: {
                  type: 'person',
                  name: 'Dewi Lestari',
                  tone: 'blue',
                  kind: 'person',
                  avatarUrl: PEOPLE_AVATAR_URLS.patrickCollison,
                },
                terakhirDiedit: { type: 'text', value: '19 Okt 2024' },
              },
            },
          ],
        }),
      },
      {
        id: 'alur-kerja',
        label: 'Alur Kerja',
        icon: { kind: 'tabler', name: 'settingsAutomation', tone: 'orange' },
        showChevron: true,
        items: [
          {
            id: 'alur-buat-kk-saat-tambah-warga',
            label: 'Buat data KK saat menambah warga baru',
            icon: {
              color: '#451E11',
              kind: 'avatar',
              label: 'K',
              tone: 'orange',
              shape: 'circle',
            },
            page: {
              type: 'workflow',
              header: {
                navbarActions: [
                  { icon: 'chevronDown', variant: 'icon' },
                  { icon: 'chevronUp', variant: 'icon' },
                  { icon: 'heart', variant: 'icon' },
                  { icon: 'playerPause', label: 'Nonaktifkan' },
                  { icon: 'repeat', label: 'Lihat Riwayat' },
                  { icon: 'plus', label: 'Tambah Node' },
                  { icon: 'dotsVertical', trailingLabel: '⌘K' },
                ],
                title: 'Buat data KK saat menambah warga baru',
              },
            },
          },
          {
            id: 'alur-kirim-notif-permohonan',
            label: 'Kirim notifikasi saat permohonan layanan disetujui',
            icon: {
              color: '#451E11',
              kind: 'avatar',
              label: 'N',
              tone: 'orange',
              shape: 'circle',
            },
            page: {
              type: 'workflow',
              header: {
                navbarActions: [
                  { icon: 'chevronDown', variant: 'icon' },
                  { icon: 'chevronUp', variant: 'icon' },
                  { icon: 'heart', variant: 'icon' },
                  { icon: 'playerPause', label: 'Nonaktifkan' },
                  { icon: 'repeat', label: 'Lihat Riwayat' },
                  { icon: 'plus', label: 'Tambah Node' },
                  { icon: 'dotsVertical', trailingLabel: '⌘K' },
                ],
                title: 'Kirim notifikasi saat permohonan layanan disetujui',
              },
              nodes: [
                {
                  id: 'trigger',
                  x: 415,
                  y: 60,
                  width: 200,
                  label: 'Pemicu',
                  title: 'Pemicu manual',
                  iconName: 'plug',
                },
                {
                  id: 'iterator',
                  x: 420,
                  y: 230,
                  width: 190,
                  label: 'Tindakan',
                  title: 'Iterator',
                  iconName: 'repeat',
                },
                {
                  id: 'kirim-email',
                  x: 590,
                  y: 340,
                  width: 200,
                  label: 'Tindakan',
                  title: 'Kirim Email',
                  iconName: 'mail',
                },
              ],
              edges: [
                { from: 'trigger', to: 'iterator', type: 'vertical' },
                {
                  from: 'iterator',
                  to: 'kirim-email',
                  type: 'loopRight',
                },
                {
                  from: 'kirim-email',
                  to: 'trigger',
                  type: 'loopBack',
                },
              ],
              branchLabels: [
                { x: 635, y: 248, text: 'ulang' },
                { x: 482, y: 318, text: 'selesai' },
              ],
              plusNode: { x: 515, y: 380 },
            },
          },
          {
            id: 'daftar-alur-kerja',
            label: 'Semua Alur Kerja',
            icon: { kind: 'tabler', name: 'settingsAutomation', tone: 'gray' },
            page: createTablePage({
              title: 'Semua Alur Kerja',
              count: 2,
              columns: [
                { id: 'nama', label: 'Nama', width: 240, isFirstColumn: true },
                { id: 'status', label: 'Status', width: 140 },
                { id: 'terakhirBerjalan', label: 'Terakhir Berjalan', width: 200 },
              ],
              rows: [
                {
                  id: 'buat-kk-saat-tambah-warga',
                  cells: {
                    nama: {
                      type: 'text',
                      value: 'Buat data KK saat menambah warga baru',
                      shortLabel: 'K',
                      targetLabel: 'Buat data KK saat menambah warga baru',
                      tone: 'orange',
                    },
                    status: { type: 'tag', value: 'Aktif' },
                    terakhirBerjalan: {
                      type: 'text',
                      value: '24 Okt 2024 10.00',
                    },
                  },
                },
                {
                  id: 'notif-permohonan',
                  cells: {
                    nama: {
                      type: 'text',
                      value: 'Notifikasi Permohonan Disetujui',
                      shortLabel: 'N',
                      tone: 'amber',
                    },
                    status: { type: 'tag', value: 'Tidak Aktif' },
                    terakhirBerjalan: {
                      type: 'text',
                      value: '20 Okt 2024 15.15',
                    },
                  },
                },
              ],
            }),
          },
          {
            id: 'riwayat-alur',
            label: 'Riwayat Alur Kerja',
            icon: { kind: 'tabler', name: 'playerPlay', tone: 'gray' },
            page: createTablePage({
              title: 'Semua Riwayat',
              count: 2,
              columns: [
                {
                  id: 'idRun',
                  label: 'ID Eksekusi',
                  width: 160,
                  isFirstColumn: true,
                },
                { id: 'alurKerja', label: 'Alur Kerja', width: 200 },
                { id: 'status', label: 'Status', width: 120 },
                { id: 'dimulaiPada', label: 'Dimulai Pada', width: 200 },
                { id: 'durasi', label: 'Durasi', width: 120 },
              ],
              rows: [
                {
                  id: 'run-12345',
                  cells: {
                    idRun: {
                      type: 'text',
                      value: 'run_12345',
                      shortLabel: 'R',
                      tone: 'amber',
                    },
                    alurKerja: {
                      type: 'text',
                      value: 'Penugasan Permohonan Baru',
                    },
                    status: { type: 'tag', value: 'Berhasil' },
                    dimulaiPada: {
                      type: 'text',
                      value: '24 Okt 2024 10.00',
                    },
                    durasi: { type: 'text', value: '2d' },
                  },
                },
                {
                  id: 'run-12346',
                  cells: {
                    idRun: {
                      type: 'text',
                      value: 'run_12346',
                      shortLabel: 'R',
                      tone: 'amber',
                    },
                    alurKerja: {
                      type: 'text',
                      value: 'Notifikasi Permohonan Disetujui',
                    },
                    status: { type: 'tag', value: 'Gagal' },
                    dimulaiPada: {
                      type: 'text',
                      value: '20 Okt 2024 15.15',
                    },
                    durasi: { type: 'text', value: '5d' },
                  },
                },
              ],
            }),
          },
          {
            id: 'versi-alur',
            label: 'Versi Alur Kerja',
            icon: { kind: 'tabler', name: 'versions', tone: 'gray' },
            page: createTablePage({
              title: 'Semua Versi',
              count: 2,
              columns: [
                {
                  id: 'versi',
                  label: 'Versi',
                  width: 120,
                  isFirstColumn: true,
                },
                { id: 'alurKerja', label: 'Alur Kerja', width: 200 },
                { id: 'diterbitkanPada', label: 'Diterbitkan Pada', width: 200 },
                { id: 'diterbitkanOleh', label: 'Diterbitkan Oleh', width: 160 },
              ],
              rows: [
                {
                  id: 'v2-penugasan',
                  cells: {
                    versi: {
                      type: 'text',
                      value: 'v2',
                      shortLabel: 'V',
                      tone: 'amber',
                    },
                    alurKerja: {
                      type: 'text',
                      value: 'Penugasan Permohonan Baru',
                    },
                    diterbitkanPada: {
                      type: 'text',
                      value: '15 Okt 2024 09.00',
                    },
                    diterbitkanOleh: {
                      type: 'person',
                      name: 'Sari Dewi',
                      shortLabel: 'S',
                      tone: 'gray',
                      kind: 'person',
                      avatarUrl: PEOPLE_AVATAR_URLS.ivanZhao,
                    },
                  },
                },
                {
                  id: 'v1-penugasan',
                  cells: {
                    versi: {
                      type: 'text',
                      value: 'v1',
                      shortLabel: 'V',
                      tone: 'amber',
                    },
                    alurKerja: {
                      type: 'text',
                      value: 'Penugasan Permohonan Baru',
                    },
                    diterbitkanPada: {
                      type: 'text',
                      value: '10 Sep 2024 13.00',
                    },
                    diterbitkanOleh: {
                      type: 'person',
                      name: 'Sari Dewi',
                      shortLabel: 'S',
                      tone: 'gray',
                      kind: 'person',
                      avatarUrl: PEOPLE_AVATAR_URLS.ivanZhao,
                    },
                  },
                },
              ],
            }),
          },
        ],
      },
      {
        id: 'buku-demo',
        label: 'Jadwalkan demo',
        href: 'https://cal.com/forms/f7841033-0a20-4958-8c92-4e34ec128a81',
        icon: {
          kind: 'brand',
          brand: 'bades',
          imageSrc: '/images/home/hero/bades-demo-logo.webp',
          overlay: 'link',
        },
      },
    ],
  },
};
