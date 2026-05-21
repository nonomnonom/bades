import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

type NoteDataSeed = {
  id: string;
  position: number;
  title: string;
  bodyV2Blocknote: string;
  bodyV2Markdown: string;
  createdBySource: string;
  createdByWorkspaceMemberId: string;
  createdByName: string;
  createdByContext: string | null;
  updatedBySource: string;
  updatedByWorkspaceMemberId: string;
  updatedByName: string;
};

export const NOTE_DATA_SEED_COLUMNS: (keyof NoteDataSeed)[] = [
  'id',
  'position',
  'title',
  'bodyV2Blocknote',
  'bodyV2Markdown',
  'createdBySource',
  'createdByWorkspaceMemberId',
  'createdByName',
  'createdByContext',
  'updatedBySource',
  'updatedByWorkspaceMemberId',
  'updatedByName',
];

const GENERATE_NOTE_IDS = (): Record<string, string> => {
  const NOTE_IDS: Record<string, string> = {};

  for (let INDEX = 1; INDEX <= 1200; INDEX++) {
    const HEX_INDEX = INDEX.toString(16).padStart(4, '0');

    NOTE_IDS[`ID_${INDEX}`] = `20202020-${HEX_INDEX}-4e7c-8001-123456789abc`;
  }

  for (let INDEX = 1201; INDEX <= 1800; INDEX++) {
    const HEX_INDEX = INDEX.toString(16).padStart(4, '0');

    NOTE_IDS[`ID_${INDEX}`] = `20202020-${HEX_INDEX}-4e7c-9001-123456789abc`;
  }

  return NOTE_IDS;
};

export const NOTE_DATA_SEED_IDS = GENERATE_NOTE_IDS();

// Catatan terkait warga/penduduk
const PERSON_NOTE_TEMPLATES = [
  {
    title: 'Catatan Kunjungan Rumah',
    content:
      'Telah dilakukan kunjungan rumah untuk verifikasi data kependudukan. Kondisi keluarga baik, data sesuai dengan dokumen yang ada.',
  },
  {
    title: 'Permohonan Surat Keterangan',
    content:
      'Warga mengajukan permohonan surat keterangan tidak mampu untuk keperluan beasiswa. Berkas persyaratan sudah lengkap.',
  },
  {
    title: 'Catatan Kesehatan Warga',
    content:
      'Berdasarkan data Posyandu, kondisi gizi keluarga dalam kategori baik. Perlu pemantauan lanjutan untuk balita.',
  },
  {
    title: 'Laporan Perubahan Data',
    content:
      'Warga melaporkan perubahan alamat tempat tinggal. Data sudah diperbarui sesuai surat keterangan pindah.',
  },
  {
    title: 'Catatan Bantuan Sosial',
    content:
      'Keluarga ini terdaftar sebagai penerima manfaat program bantuan sosial. Verifikasi lapangan sudah selesai dilakukan.',
  },
  {
    title: 'Catatan Musyawarah RT',
    content:
      'Warga berpartisipasi aktif dalam musyawarah RT. Menyampaikan aspirasi terkait perbaikan jalan lingkungan.',
  },
  {
    title: 'Pembaruan Dokumen Kependudukan',
    content:
      'Dokumen KTP dan KK sudah diperbarui. Foto terbaru dan tanda tangan digital sudah terekam dalam sistem.',
  },
  {
    title: 'Catatan Program Pemberdayaan',
    content:
      'Warga mengikuti pelatihan keterampilan dari program pemberdayaan masyarakat. Progres sangat baik.',
  },
];

// Catatan terkait lembaga/organisasi desa
const COMPANY_NOTE_TEMPLATES = [
  {
    title: 'Rapat Koordinasi Lembaga',
    content:
      'Koordinasi antar lembaga desa berjalan lancar. Disepakati jadwal kegiatan bersama untuk kuartal berikutnya.',
  },
  {
    title: 'Evaluasi Program Kerja',
    content:
      'Evaluasi program kerja menunjukkan capaian 85% dari target yang ditetapkan. Perlu percepatan di beberapa item.',
  },
  {
    title: 'Laporan Kegiatan Sosial',
    content:
      'Kegiatan bakti sosial bersama lembaga berjalan sukses. Total warga yang dilayani mencapai 120 KK.',
  },
  {
    title: 'Catatan Penggunaan Dana',
    content:
      'Realisasi penggunaan dana kegiatan sesuai rencana anggaran. Dokumen pertanggungjawaban sudah lengkap.',
  },
  {
    title: 'Koordinasi Program Desa',
    content:
      'Sinkronisasi program antar lembaga sudah dilakukan. Tidak ada tumpang tindih kegiatan pada bulan depan.',
  },
  {
    title: 'Penilaian Kinerja Lembaga',
    content:
      'Berdasarkan indikator kinerja, lembaga ini masuk kategori aktif dan produktif dalam mendukung program desa.',
  },
  {
    title: 'Rencana Program Tahun Depan',
    content:
      'Usulan program tahun depan sudah disampaikan. Fokus pada pemberdayaan ekonomi dan peningkatan infrastruktur.',
  },
  {
    title: 'Catatan Pengaduan Masyarakat',
    content:
      'Pengaduan warga terkait layanan sudah ditindaklanjuti. Respons positif dari masyarakat terhadap penyelesaian.',
  },
];

// Generate note data seeds
const GENERATE_NOTE_SEEDS = (): NoteDataSeed[] => {
  const NOTE_SEEDS: NoteDataSeed[] = [];

  // Person notes (ID_1 to ID_1200)
  for (let INDEX = 1; INDEX <= 1200; INDEX++) {
    const TEMPLATE_INDEX = (INDEX - 1) % PERSON_NOTE_TEMPLATES.length;
    const TEMPLATE = PERSON_NOTE_TEMPLATES[TEMPLATE_INDEX];

    NOTE_SEEDS.push({
      id: NOTE_DATA_SEED_IDS[`ID_${INDEX}`],
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
          content: [{ type: 'text', text: TEMPLATE.content, styles: {} }],
          children: [],
        },
      ]),
      bodyV2Markdown: TEMPLATE.content,
      createdBySource: 'MANUAL',
      createdByWorkspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.KADES,
      createdByName: 'Drs. H. Abdullah',
      createdByContext: null,
      updatedBySource: 'MANUAL',
      updatedByWorkspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.KADES,
      updatedByName: 'Drs. H. Abdullah',
    });
  }

  // Company notes (ID_1201 to ID_1800)
  for (let INDEX = 1201; INDEX <= 1800; INDEX++) {
    const TEMPLATE_INDEX = (INDEX - 1201) % COMPANY_NOTE_TEMPLATES.length;
    const TEMPLATE = COMPANY_NOTE_TEMPLATES[TEMPLATE_INDEX];

    NOTE_SEEDS.push({
      id: NOTE_DATA_SEED_IDS[`ID_${INDEX}`],
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
          content: [{ type: 'text', text: TEMPLATE.content, styles: {} }],
          children: [],
        },
      ]),
      bodyV2Markdown: TEMPLATE.content,
      createdBySource: 'MANUAL',
      createdByWorkspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.KADES,
      createdByName: 'Drs. H. Abdullah',
      createdByContext: null,
      updatedBySource: 'MANUAL',
      updatedByWorkspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.KADES,
      updatedByName: 'Drs. H. Abdullah',
    });
  }

  return NOTE_SEEDS;
};

export const NOTE_DATA_SEEDS = GENERATE_NOTE_SEEDS();
