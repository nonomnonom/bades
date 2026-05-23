type PosyanduDataSeed = {
  id: string;
  namaPosyandu: string;
  kader: string;
  jadwalRutin: string;
  lokasi: string;
  jumlahBalita: number;
  jumlahIbuHamil: number;
  jumlahLansia: number;
  keterangan: string;
  position: number;
};

export const POSYANDU_DATA_SEED_COLUMNS: (keyof PosyanduDataSeed)[] = [
  'id',
  'namaPosyandu',
  'kader',
  'jadwalRutin',
  'lokasi',
  'jumlahBalita',
  'jumlahIbuHamil',
  'jumlahLansia',
  'keterangan',
  'position',
];

// prettier-ignore
export const POSYANDU_DATA_SEED_IDS = {
  PSY_1: '20202020-f201-41e7-8c72-ba44072a4c58',
  PSY_2: '20202020-f202-4b3d-a89c-7f6c30df998a',
  PSY_3: '20202020-f203-422c-8fcf-5b7496f94975',
  PSY_4: '20202020-f204-41d6-87a9-7add07bebfd8',
};

export const POSYANDU_DATA_SEEDS: PosyanduDataSeed[] = [
  {
    id: POSYANDU_DATA_SEED_IDS.PSY_1,
    namaPosyandu: 'Posyandu Melati 1',
    kader: 'Ibu Sri Wahyuni',
    jadwalRutin: 'Setiap Selasa Pekan ke-2',
    lokasi: 'Balai Dusun Krajan',
    jumlahBalita: 42,
    jumlahIbuHamil: 6,
    jumlahLansia: 18,
    keterangan: 'Posyandu terpadu balita, ibu hamil, dan lansia di Dusun Krajan',
    position: 0,
  },
  {
    id: POSYANDU_DATA_SEED_IDS.PSY_2,
    namaPosyandu: 'Posyandu Mawar 2',
    kader: 'Ibu Hartini',
    jadwalRutin: 'Setiap Kamis Pekan ke-1',
    lokasi: 'Rumah Kader RT 003/RW 002',
    jumlahBalita: 35,
    jumlahIbuHamil: 4,
    jumlahLansia: 22,
    keterangan: 'Layanan rutin penimbangan balita dan imunisasi dasar',
    position: 1,
  },
  {
    id: POSYANDU_DATA_SEED_IDS.PSY_3,
    namaPosyandu: 'Posyandu Anggrek 3',
    kader: 'Ibu Sumiati',
    jadwalRutin: 'Setiap Rabu Pekan ke-3',
    lokasi: 'Balai Dusun Mekar Sari',
    jumlahBalita: 28,
    jumlahIbuHamil: 3,
    jumlahLansia: 15,
    keterangan: 'Fokus pemantauan tumbuh kembang balita stunting',
    position: 2,
  },
  {
    id: POSYANDU_DATA_SEED_IDS.PSY_4,
    namaPosyandu: 'Posyandu Kenanga 4',
    kader: 'Ibu Marlina',
    jadwalRutin: 'Setiap Jumat Pekan ke-2',
    lokasi: 'Balai Dusun Tegal Asri',
    jumlahBalita: 31,
    jumlahIbuHamil: 5,
    jumlahLansia: 20,
    keterangan: 'Kolaborasi dengan bidan desa untuk kelas ibu hamil',
    position: 3,
  },
];
