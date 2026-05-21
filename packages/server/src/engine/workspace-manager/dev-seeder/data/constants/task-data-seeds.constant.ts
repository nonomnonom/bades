import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

type TaskDataSeed = {
  id: string;
  position: number;
  title: string;
  bodyV2Blocknote: string;
  bodyV2Markdown: string;
  status: string;
  dueAt: string | null;
  assigneeId: string;
  createdBySource: string;
  createdByWorkspaceMemberId: string;
  createdByName: string;
  updatedBySource: string;
  updatedByWorkspaceMemberId: string;
  updatedByName: string;
};

export const TASK_DATA_SEED_COLUMNS: (keyof TaskDataSeed)[] = [
  'id',
  'position',
  'title',
  'bodyV2Blocknote',
  'bodyV2Markdown',
  'status',
  'dueAt',
  'assigneeId',
  'createdBySource',
  'createdByWorkspaceMemberId',
  'createdByName',
  'updatedBySource',
  'updatedByWorkspaceMemberId',
  'updatedByName',
];

// Generate all task IDs
const GENERATE_TASK_IDS = (): Record<string, string> => {
  const TASK_IDS: Record<string, string> = {};

  // Person tasks (ID_1 to ID_1200)
  for (let INDEX = 1; INDEX <= 1200; INDEX++) {
    const HEX_INDEX = INDEX.toString(16).padStart(4, '0');

    TASK_IDS[`ID_${INDEX}`] = `20202020-${HEX_INDEX}-4e7c-8001-123456789def`;
  }

  // Company tasks (ID_1201 to ID_1800)
  for (let INDEX = 1201; INDEX <= 1800; INDEX++) {
    const HEX_INDEX = INDEX.toString(16).padStart(4, '0');

    TASK_IDS[`ID_${INDEX}`] = `20202020-${HEX_INDEX}-4e7c-9001-123456789def`;
  }

  return TASK_IDS;
};

export const TASK_DATA_SEED_IDS = GENERATE_TASK_IDS();

// Tugas perangkat desa terkait warga/penduduk
const PERSON_TASK_TEMPLATES = [
  {
    title: 'Verifikasi data KTP warga',
    body: 'Periksa kelengkapan dan keabsahan data KTP warga sesuai data kependudukan.',
    status: 'TODO',
    daysFromNow: 3,
  },
  {
    title: 'Proses surat keterangan domisili',
    body: 'Siapkan dan tandatangani surat keterangan domisili untuk keperluan warga.',
    status: 'IN_PROGRESS',
    daysFromNow: 2,
  },
  {
    title: 'Verifikasi data kartu keluarga',
    body: 'Cek data anggota keluarga dan validasi dengan data di sistem.',
    status: 'TODO',
    daysFromNow: 5,
  },
  {
    title: 'Pembaruan status perkawinan',
    body: 'Update data status perkawinan warga berdasarkan akta nikah/cerai yang diserahkan.',
    status: 'TODO',
    daysFromNow: 4,
  },
  {
    title: 'Konfirmasi data pendidikan warga',
    body: 'Verifikasi tingkat pendidikan terakhir warga untuk keperluan statistik desa.',
    status: 'DONE',
    daysFromNow: null,
  },
  {
    title: 'Proses pindah datang',
    body: 'Rekam data warga pindah datang dari desa lain ke dalam sistem.',
    status: 'IN_PROGRESS',
    daysFromNow: 3,
  },
  {
    title: 'Penerbitan surat pengantar SKCK',
    body: 'Buat surat pengantar dari kepala desa untuk keperluan pembuatan SKCK di kepolisian.',
    status: 'TODO',
    daysFromNow: 1,
  },
  {
    title: 'Update data pekerjaan warga',
    body: 'Perbarui informasi pekerjaan warga dalam database kependudukan desa.',
    status: 'TODO',
    daysFromNow: 7,
  },
];

// Tugas perangkat desa terkait lembaga/organisasi
const COMPANY_TASK_TEMPLATES = [
  {
    title: 'Koordinasi dengan BPD',
    body: 'Jadwalkan rapat koordinasi dengan Badan Permusyawaratan Desa untuk pembahasan anggaran.',
    status: 'IN_PROGRESS',
    daysFromNow: 7,
  },
  {
    title: 'Laporan bulanan BUMDES',
    body: 'Kumpulkan dan verifikasi laporan keuangan bulanan Badan Usaha Milik Desa.',
    status: 'TODO',
    daysFromNow: 10,
  },
  {
    title: 'Koordinasi Posyandu',
    body: 'Koordinasi jadwal dan kebutuhan logistik Posyandu bulan berikutnya.',
    status: 'TODO',
    daysFromNow: 5,
  },
  {
    title: 'Persiapan musyawarah desa',
    body: 'Siapkan agenda, undangan, dan dokumen pendukung untuk musyawarah desa.',
    status: 'IN_PROGRESS',
    daysFromNow: 14,
  },
  {
    title: 'Review proposal bantuan sosial',
    body: 'Telaah dan validasi daftar penerima bantuan sosial dari lembaga terkait.',
    status: 'TODO',
    daysFromNow: 6,
  },
  {
    title: 'Koordinasi PKK',
    body: 'Sinkronisasi program PKK dengan agenda pemberdayaan masyarakat desa.',
    status: 'DONE',
    daysFromNow: null,
  },
  {
    title: 'Evaluasi program PNPM',
    body: 'Evaluasi pelaksanaan program pemberdayaan masyarakat dan capaian target.',
    status: 'TODO',
    daysFromNow: 21,
  },
  {
    title: 'Audit anggaran desa',
    body: 'Persiapkan dokumen untuk audit penggunaan Dana Desa dan APBDes.',
    status: 'IN_PROGRESS',
    daysFromNow: 12,
  },
];

// Helper function to get random workspace member
const GET_RANDOM_ASSIGNEE = (): string => {
  const MEMBERS = [
    WORKSPACE_MEMBER_DATA_SEED_IDS.KADES,
    WORKSPACE_MEMBER_DATA_SEED_IDS.SEKDES,
    WORKSPACE_MEMBER_DATA_SEED_IDS.KAUR,
  ];

  return MEMBERS[Math.floor(Math.random() * MEMBERS.length)];
};

// Helper function to format due date
const FORMAT_DUE_DATE = (daysFromNow: number | null): string | null => {
  if (daysFromNow === null) return null;

  const DATE = new Date();

  DATE.setDate(DATE.getDate() + daysFromNow);

  return DATE.toISOString();
};

// Generate task data seeds
const GENERATE_TASK_SEEDS = (): TaskDataSeed[] => {
  const TASK_SEEDS: TaskDataSeed[] = [];

  // Person tasks (ID_1 to ID_1200)
  for (let INDEX = 1; INDEX <= 1200; INDEX++) {
    const TEMPLATE_INDEX = (INDEX - 1) % PERSON_TASK_TEMPLATES.length;
    const TEMPLATE = PERSON_TASK_TEMPLATES[TEMPLATE_INDEX];

    TASK_SEEDS.push({
      id: TASK_DATA_SEED_IDS[`ID_${INDEX}`],
      position: INDEX,
      title: TEMPLATE.title,
      bodyV2Blocknote: JSON.stringify([
        {
          id: `block-${INDEX}`,
          type: 'paragraph',
          props: {
            textColor: 'default',
            backgroundColor: 'default',
            textAlignment: 'left',
          },
          content: [{ type: 'text', text: TEMPLATE.body, styles: {} }],
          children: [],
        },
      ]),
      bodyV2Markdown: TEMPLATE.body,
      status: TEMPLATE.status,
      dueAt: FORMAT_DUE_DATE(TEMPLATE.daysFromNow),
      assigneeId: GET_RANDOM_ASSIGNEE(),
      createdBySource: 'MANUAL',
      createdByWorkspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.KADES,
      createdByName: 'Drs. H. Abdullah',
      updatedBySource: 'MANUAL',
      updatedByWorkspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.KADES,
      updatedByName: 'Drs. H. Abdullah',
    });
  }

  // Company tasks (ID_1201 to ID_1800)
  for (let INDEX = 1201; INDEX <= 1800; INDEX++) {
    const TEMPLATE_INDEX = (INDEX - 1201) % COMPANY_TASK_TEMPLATES.length;
    const TEMPLATE = COMPANY_TASK_TEMPLATES[TEMPLATE_INDEX];

    TASK_SEEDS.push({
      id: TASK_DATA_SEED_IDS[`ID_${INDEX}`],
      position: INDEX,
      title: TEMPLATE.title,
      bodyV2Blocknote: JSON.stringify([
        {
          id: `block-${INDEX}`,
          type: 'paragraph',
          props: {
            textColor: 'default',
            backgroundColor: 'default',
            textAlignment: 'left',
          },
          content: [{ type: 'text', text: TEMPLATE.body, styles: {} }],
          children: [],
        },
      ]),
      bodyV2Markdown: TEMPLATE.body,
      status: TEMPLATE.status,
      dueAt: FORMAT_DUE_DATE(TEMPLATE.daysFromNow),
      assigneeId: GET_RANDOM_ASSIGNEE(),
      createdBySource: 'MANUAL',
      createdByWorkspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.KADES,
      createdByName: 'Drs. H. Abdullah',
      updatedBySource: 'MANUAL',
      updatedByWorkspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.KADES,
      updatedByName: 'Drs. H. Abdullah',
    });
  }

  return TASK_SEEDS;
};

export const TASK_DATA_SEEDS = GENERATE_TASK_SEEDS();
