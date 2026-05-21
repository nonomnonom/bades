import { MESSAGE_THREAD_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/message-thread-data-seeds.constant';

type MessageDataSeed = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  receivedAt: Date;
  text: string;
  subject: string;
  messageThreadId: string;
  headerMessageId: string;
};

export const MESSAGE_DATA_SEED_COLUMNS: (keyof MessageDataSeed)[] = [
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'receivedAt',
  'text',
  'subject',
  'messageThreadId',
  'headerMessageId',
];

const GENERATE_MESSAGE_IDS = (): Record<string, string> => {
  const MESSAGE_IDS: Record<string, string> = {};

  for (let INDEX = 1; INDEX <= 600; INDEX++) {
    const HEX_INDEX = INDEX.toString(16).padStart(4, '0');

    MESSAGE_IDS[`ID_${INDEX}`] = `20202020-${HEX_INDEX}-4e7c-8001-123456789bcd`;
  }

  return MESSAGE_IDS;
};

export const MESSAGE_DATA_SEED_IDS = GENERATE_MESSAGE_IDS();

const EMAIL_TEMPLATES = [
  {
    subject: 'Permohonan Surat Keterangan Domisili',
    text: 'Yth. Bapak/Ibu Kepala Desa,\n\nDengan hormat, saya yang bertanda tangan di bawah ini mengajukan permohonan surat keterangan domisili untuk keperluan administrasi. Saya telah menetap di desa ini selama lebih dari 2 tahun.\n\nDemikian permohonan ini saya sampaikan. Atas perhatian dan bantuannya saya ucapkan terima kasih.\n\nHormat saya',
  },
  {
    subject: 'Pemberitahuan Jadwal Posyandu',
    text: 'Kepada Yth. Warga Desa,\n\nDengan hormat, kami memberitahukan bahwa kegiatan Posyandu bulan ini akan dilaksanakan pada hari Kamis mendatang pukul 08.00 - 11.00 WIB di Balai RW.\n\nMohon kehadiran seluruh ibu hamil, ibu menyusui, dan balita untuk hadir tepat waktu.\n\nAtas perhatiannya kami ucapkan terima kasih.\n\nKader Posyandu Desa',
  },
  {
    subject: 'Undangan Musyawarah Desa',
    text: 'Yth. Bapak/Ibu Warga Desa,\n\nDalam rangka membahas Rencana Kerja Pemerintah Desa tahun mendatang, dengan hormat kami mengundang Bapak/Ibu untuk hadir dalam Musyawarah Desa yang akan dilaksanakan:\n\nHari/Tanggal : [Tanggal]\nWaktu : 09.00 WIB - selesai\nTempat : Balai Desa\n\nMengingat pentingnya acara ini, kehadiran Bapak/Ibu sangat kami harapkan.\n\nKepala Desa',
  },
  {
    subject: 'Laporan Penggunaan Dana Desa',
    text: 'Kepada Yth. Warga Desa,\n\nDengan ini kami menyampaikan laporan realisasi penggunaan Dana Desa Triwulan I:\n\n- Pembangunan jalan rabat beton: Rp 85.000.000\n- Perbaikan irigasi pertanian: Rp 35.000.000\n- Kegiatan posyandu dan kesehatan: Rp 15.000.000\n- Pemberdayaan ekonomi warga: Rp 25.000.000\n\nLaporan lengkap dapat dilihat di papan pengumuman kantor desa.\n\nSekretaris Desa',
  },
  {
    subject: 'Pengumuman Bantuan Sosial',
    text: 'Kepada Yth. Warga Desa,\n\nDengan hormat kami informasikan bahwa pencairan bantuan sosial Program Keluarga Harapan (PKH) akan dilaksanakan minggu depan.\n\nBagi warga yang terdaftar sebagai penerima manfaat, harap membawa:\n1. KTP asli\n2. Kartu PKH\n3. Buku rekening\n\nInformasi lebih lanjut dapat ditanyakan di kantor desa.\n\nPemerintah Desa',
  },
  {
    subject: 'Tindak Lanjut Permohonan KTP',
    text: 'Yth. Bapak/Ibu,\n\nMenindaklanjuti permohonan KTP yang Bapak/Ibu ajukan, kami informasikan bahwa dokumen sedang dalam proses di Dinas Kependudukan dan Pencatatan Sipil Kabupaten.\n\nPerkiraan waktu selesai adalah 14 hari kerja sejak tanggal pengajuan. Kami akan menghubungi Bapak/Ibu apabila KTP telah selesai dan dapat diambil.\n\nTerima kasih atas kesabaran Bapak/Ibu.\n\nOperator Kependudukan Desa',
  },
  {
    subject: 'Undangan Gotong Royong',
    text: 'Kepada Yth. Bapak/Ibu Warga,\n\nDalam rangka menjaga kebersihan dan keindahan lingkungan desa, kami mengundang seluruh warga untuk berpartisipasi dalam kegiatan Gotong Royong:\n\nHari : Minggu\nPukul : 07.00 - 10.00 WIB\nLokasi : Jalan Utama Desa dan Area Pemakaman\n\nMohon membawa peralatan kebersihan masing-masing.\n\nKetua RW',
  },
  {
    subject: 'Pemberitahuan Pelatihan Keterampilan',
    text: 'Yth. Warga Desa yang Terhormat,\n\nKami dengan senang hati mengumumkan program pelatihan keterampilan gratis yang diselenggarakan oleh Pemerintah Desa bekerja sama dengan Dinas Tenaga Kerja:\n\nJenis Pelatihan : Kerajinan Batik dan Olahan Pangan\nWaktu : [Tanggal] pkl 08.00-16.00 WIB\nTempat : Balai Desa\nPeserta : Maksimal 30 orang\n\nPendaftaran di kantor desa, kuota terbatas.\n\nSeksi Pemberdayaan Masyarakat',
  },
  {
    subject: 'Informasi Program BPNT',
    text: 'Yth. Penerima Manfaat BPNT,\n\nKami informasikan bahwa bantuan pangan non-tunai (BPNT) bulan ini telah siap dicairkan. Untuk pengambilan, silakan menuju e-warong terdekat dengan membawa:\n\n1. KTP\n2. Kartu Keluarga\n3. Kartu Keluarga Sejahtera (KKS)\n\nWaktu pencairan: Senin - Sabtu, pukul 08.00 - 15.00 WIB.\n\nTerima kasih.\n\nPendamping PKH Desa',
  },
  {
    subject: 'Laporan Kunjungan Lapangan',
    text: 'Kepada Yth. Kepala Desa,\n\nDengan hormat, kami laporkan hasil kunjungan lapangan yang telah dilaksanakan hari ini:\n\n1. Kondisi jalan desa RT 003: perlu perbaikan segera\n2. Saluran irigasi RW 002: tersumbat, perlu pembersihan\n3. Lampu jalan RT 005: 3 unit mati\n4. MCK umum RW 001: kondisi baik\n\nDemikian laporan ini kami sampaikan untuk ditindaklanjuti.\n\nStaf Teknis Desa',
  },
  {
    subject: 'Undangan Rapat Koordinasi RT/RW',
    text: 'Yth. Bapak/Ibu Ketua RT dan RW,\n\nDengan hormat, kami mengundang Bapak/Ibu untuk hadir dalam Rapat Koordinasi Pengurus RT/RW yang akan dilaksanakan:\n\nHari/Tanggal : [Tanggal]\nPukul : 19.30 WIB\nTempat : Kantor Desa\nAgenda : Persiapan HUT Kemerdekaan RI dan pembahasan program desa\n\nMengingat pentingnya rapat ini, kehadiran Bapak/Ibu sangat diharapkan.\n\nKepala Desa',
  },
  {
    subject: 'Notifikasi Pembaruan Data Kependudukan',
    text: 'Kepada Yth. Bapak/Ibu,\n\nDengan hormat, kami menginformasikan bahwa data kependudukan Bapak/Ibu telah berhasil diperbarui dalam sistem administrasi desa.\n\nApabila terdapat ketidaksesuaian data, silakan menghubungi operator kependudukan di kantor desa pada jam kerja (Senin-Jumat, 08.00-14.00 WIB).\n\nDemikian pemberitahuan ini kami sampaikan.\n\nOperator Kependudukan Desa',
  },
];

const GENERATE_MESSAGE_SEEDS = (): MessageDataSeed[] => {
  const MESSAGE_SEEDS: MessageDataSeed[] = [];

  const THREAD_IDS = Object.keys(MESSAGE_THREAD_DATA_SEED_IDS).map(
    (key) =>
      MESSAGE_THREAD_DATA_SEED_IDS[
        key as keyof typeof MESSAGE_THREAD_DATA_SEED_IDS
      ],
  );

  for (let INDEX = 1; INDEX <= 600; INDEX++) {
    const TEMPLATE_INDEX = (INDEX - 1) % EMAIL_TEMPLATES.length;
    const TEMPLATE = EMAIL_TEMPLATES[TEMPLATE_INDEX];

    const THREAD_INDEX = Math.floor((INDEX - 1) / 2);
    const THREAD_ID = THREAD_IDS[THREAD_INDEX % THREAD_IDS.length];

    const NOW = new Date();
    const RANDOM_DAYS_OFFSET = Math.floor(Math.random() * 90);
    const MESSAGE_DATE = new Date(
      NOW.getTime() - RANDOM_DAYS_OFFSET * 24 * 60 * 60 * 1000,
    );

    MESSAGE_DATE.setHours(
      8 + Math.floor(Math.random() * 8),
      Math.floor(Math.random() * 60),
      0,
      0,
    );

    MESSAGE_SEEDS.push({
      id: MESSAGE_DATA_SEED_IDS[`ID_${INDEX}`],
      createdAt: MESSAGE_DATE,
      updatedAt: MESSAGE_DATE,
      deletedAt: null,
      receivedAt: MESSAGE_DATE,
      text: TEMPLATE.text,
      subject: TEMPLATE.subject,
      messageThreadId: THREAD_ID,
      headerMessageId: `${INDEX.toString(16).padStart(8, '0')}-${MESSAGE_DATE.getTime().toString(16)}`,
    });
  }

  return MESSAGE_SEEDS;
};

export const MESSAGE_DATA_SEEDS = GENERATE_MESSAGE_SEEDS();
