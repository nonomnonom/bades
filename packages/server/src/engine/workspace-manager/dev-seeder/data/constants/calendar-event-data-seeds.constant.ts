type CalendarEventDataSeed = {
  id: string;
  title: string;
  isCanceled: boolean;
  isFullDay: boolean;
  startsAt: string;
  endsAt: string;
  externalCreatedAt: string;
  externalUpdatedAt: string;
  description: string;
  location: string;
  iCalUid: string;
  conferenceSolution: string;
  conferenceLinkPrimaryLinkLabel: string;
  conferenceLinkPrimaryLinkUrl: string;
};

export const CALENDAR_EVENT_DATA_SEED_COLUMNS: (keyof CalendarEventDataSeed)[] =
  [
    'id',
    'title',
    'isCanceled',
    'isFullDay',
    'startsAt',
    'endsAt',
    'externalCreatedAt',
    'externalUpdatedAt',
    'description',
    'location',
    'iCalUid',
    'conferenceSolution',
    'conferenceLinkPrimaryLinkLabel',
    'conferenceLinkPrimaryLinkUrl',
  ];

const GENERATE_CALENDAR_EVENT_IDS = (): Record<string, string> => {
  const CALENDAR_EVENT_IDS: Record<string, string> = {};

  for (let INDEX = 1; INDEX <= 800; INDEX++) {
    const HEX_INDEX = INDEX.toString(16).padStart(4, '0');

    CALENDAR_EVENT_IDS[`ID_${INDEX}`] =
      `20202020-${HEX_INDEX}-4e7c-8001-123456789cde`;
  }

  return CALENDAR_EVENT_IDS;
};

export const CALENDAR_EVENT_DATA_SEED_IDS = GENERATE_CALENDAR_EVENT_IDS();

const EVENT_TEMPLATES = [
  {
    title: 'Musyawarah Desa',
    description:
      'Musyawarah desa untuk membahas rencana pembangunan dan program kerja desa.',
    isFullDay: false,
    duration: 120,
    locations: ['Balai Desa', 'Aula Kecamatan', 'Pendopo Desa'],
    conferenceSolution: 'WhatsApp',
  },
  {
    title: 'Rapat Koordinasi Perangkat Desa',
    description:
      'Koordinasi rutin perangkat desa untuk evaluasi program dan sinkronisasi kegiatan.',
    isFullDay: false,
    duration: 60,
    locations: ['Kantor Desa', 'Ruang Rapat Desa'],
    conferenceSolution: 'WhatsApp',
  },
  {
    title: 'Posyandu Bulanan',
    description:
      'Pelayanan posyandu bulanan untuk pemantauan tumbuh kembang balita dan kesehatan ibu hamil.',
    isFullDay: false,
    duration: 180,
    locations: ['Posyandu Dusun Utama', 'Balai RW', 'Rumah Kader'],
    conferenceSolution: '',
  },
  {
    title: 'Pertemuan PKK',
    description:
      'Pertemuan rutin PKK untuk pemberdayaan kesejahteraan keluarga dan program sosial.',
    isFullDay: false,
    duration: 90,
    locations: ['Balai Desa', 'Rumah Ketua PKK', 'Aula Kelurahan'],
    conferenceSolution: '',
  },
  {
    title: 'Rapat BPD',
    description:
      'Rapat Badan Permusyawaratan Desa untuk pembahasan peraturan desa dan APBDes.',
    isFullDay: false,
    duration: 120,
    locations: ['Kantor BPD', 'Balai Desa', 'Ruang Rapat'],
    conferenceSolution: '',
  },
  {
    title: 'Gotong Royong Desa',
    description:
      'Kegiatan gotong royong membersihkan dan memperbaiki fasilitas umum desa.',
    isFullDay: true,
    duration: 480,
    locations: ['Jalan Desa', 'Area Pemakaman', 'Saluran Irigasi'],
    conferenceSolution: '',
  },
  {
    title: 'Sosialisasi Program Pemerintah',
    description:
      'Sosialisasi program bantuan sosial dan kebijakan pemerintah kepada warga desa.',
    isFullDay: false,
    duration: 90,
    locations: ['Balai Desa', 'Masjid', 'Aula RT'],
    conferenceSolution: 'WhatsApp',
  },
  {
    title: 'Pelatihan Keterampilan Warga',
    description:
      'Pelatihan keterampilan untuk meningkatkan kapasitas dan ekonomi warga desa.',
    isFullDay: false,
    duration: 180,
    locations: ['Balai Pelatihan', 'Kantor Desa', 'Gedung Serbaguna'],
    conferenceSolution: '',
  },
  {
    title: 'Rapat Karang Taruna',
    description:
      'Rapat rutin Karang Taruna untuk merencanakan kegiatan kepemudaan desa.',
    isFullDay: false,
    duration: 90,
    locations: ['Sekretariat Karang Taruna', 'Balai Desa', 'Lapangan'],
    conferenceSolution: 'WhatsApp',
  },
  {
    title: 'Kunjungan Pejabat Kecamatan',
    description:
      'Kunjungan dan inspeksi pejabat kecamatan ke desa untuk monitoring program.',
    isFullDay: false,
    duration: 120,
    locations: ['Kantor Desa', 'Balai Desa', 'Lokasi Proyek'],
    conferenceSolution: '',
  },
  {
    title: 'Musrenbang Desa',
    description:
      'Musyawarah Rencana Pembangunan Desa untuk menyusun RKP Desa tahun berikutnya.',
    isFullDay: true,
    duration: 480,
    locations: ['Balai Desa', 'Aula Kecamatan'],
    conferenceSolution: '',
  },
  {
    title: 'Rapat BUMDES',
    description:
      'Rapat pengurus Badan Usaha Milik Desa untuk evaluasi keuangan dan rencana pengembangan.',
    isFullDay: false,
    duration: 90,
    locations: ['Kantor BUMDES', 'Balai Desa', 'Ruang Rapat'],
    conferenceSolution: 'WhatsApp',
  },
];

const GENERATE_CALENDAR_EVENT_SEEDS = (): CalendarEventDataSeed[] => {
  const CALENDAR_EVENT_SEEDS: CalendarEventDataSeed[] = [];

  for (let INDEX = 1; INDEX <= 800; INDEX++) {
    const TEMPLATE_INDEX = (INDEX - 1) % EVENT_TEMPLATES.length;
    const TEMPLATE = EVENT_TEMPLATES[TEMPLATE_INDEX];

    const NOW = new Date();
    const RANDOM_DAYS_OFFSET = Math.floor(Math.random() * 365) - 182;
    const EVENT_DATE = new Date(
      NOW.getTime() + RANDOM_DAYS_OFFSET * 24 * 60 * 60 * 1000,
    );

    const START_HOUR = 8 + Math.floor(Math.random() * 8);
    const START_MINUTE = Math.floor(Math.random() * 4) * 15;

    const START_TIME = new Date(EVENT_DATE);

    START_TIME.setHours(START_HOUR, START_MINUTE, 0, 0);

    const END_TIME = new Date(START_TIME);

    if (TEMPLATE.isFullDay) {
      END_TIME.setDate(END_TIME.getDate() + 1);
      END_TIME.setHours(0, 0, 0, 0);
    } else {
      END_TIME.setMinutes(END_TIME.getMinutes() + TEMPLATE.duration);
    }

    const LOCATION =
      TEMPLATE.locations[INDEX % TEMPLATE.locations.length];

    const IS_CANCELLED = INDEX % 20 === 0;

    CALENDAR_EVENT_SEEDS.push({
      id: CALENDAR_EVENT_DATA_SEED_IDS[`ID_${INDEX}`],
      title: TEMPLATE.title,
      isCanceled: IS_CANCELLED,
      isFullDay: TEMPLATE.isFullDay,
      startsAt: START_TIME.toISOString(),
      endsAt: END_TIME.toISOString(),
      externalCreatedAt: new Date(
        START_TIME.getTime() - 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      externalUpdatedAt: new Date(
        START_TIME.getTime() - 24 * 60 * 60 * 1000,
      ).toISOString(),
      description: TEMPLATE.description,
      location: LOCATION,
      iCalUid: `acara${INDEX}@kalender.bades.id`,
      conferenceSolution: TEMPLATE.conferenceSolution,
      conferenceLinkPrimaryLinkLabel: '',
      conferenceLinkPrimaryLinkUrl: '',
    });
  }

  return CALENDAR_EVENT_SEEDS;
};

export const CALENDAR_EVENT_DATA_SEEDS = GENERATE_CALENDAR_EVENT_SEEDS();
