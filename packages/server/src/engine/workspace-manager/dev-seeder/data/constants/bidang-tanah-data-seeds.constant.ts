type BidangTanahDataSeed = {
  id: string;
  nomorPersil: string;
  luas: number;
  jenisHak: string;
  nomorSertifikat: string | null;
  pemilik: string;
  alamat: string;
  penggunaan: string;
  keterangan: string;
  position: number;
};

export const BIDANG_TANAH_DATA_SEED_COLUMNS: (keyof BidangTanahDataSeed)[] = [
  'id',
  'nomorPersil',
  'luas',
  'jenisHak',
  'nomorSertifikat',
  'pemilik',
  'alamat',
  'penggunaan',
  'keterangan',
  'position',
];

// prettier-ignore
export const BIDANG_TANAH_DATA_SEED_IDS = {
  BT_1: '20202020-f301-41e7-8c72-ba44072a4c58',
  BT_2: '20202020-f302-4b3d-a89c-7f6c30df998a',
  BT_3: '20202020-f303-422c-8fcf-5b7496f94975',
  BT_4: '20202020-f304-41d6-87a9-7add07bebfd8',
  BT_5: '20202020-f305-422b-9cb2-5f8382a56877',
  BT_6: '20202020-f306-4644-867d-e8e1851b3ee8',
};

export const BIDANG_TANAH_DATA_SEEDS: BidangTanahDataSeed[] = [
  {
    id: BIDANG_TANAH_DATA_SEED_IDS.BT_1,
    nomorPersil: 'PRS/2024/001',
    luas: 1200,
    jenisHak: 'TANAH_KAS_DESA',
    nomorSertifikat: 'SHM.001/Desa-Sukamaju/2010',
    pemilik: 'Pemerintah Desa',
    alamat: 'Jl. Balai Desa No. 1, Dusun Krajan',
    penggunaan: 'FASILITAS_UMUM',
    keterangan: 'Tanah kas desa untuk lokasi Kantor Desa dan Balai Pertemuan',
    position: 0,
  },
  {
    id: BIDANG_TANAH_DATA_SEED_IDS.BT_2,
    nomorPersil: 'PRS/2024/002',
    luas: 3500,
    jenisHak: 'TANAH_BENGKOK',
    nomorSertifikat: null,
    pemilik: 'Pemerintah Desa',
    alamat: 'Blok Sawah Barat, Dusun Mekar Sari',
    penggunaan: 'PERTANIAN',
    keterangan:
      'Tanah bengkok untuk Kepala Desa, digarap dengan sistem bagi hasil',
    position: 1,
  },
  {
    id: BIDANG_TANAH_DATA_SEED_IDS.BT_3,
    nomorPersil: 'PRS/2024/003',
    luas: 450,
    jenisHak: 'HM',
    nomorSertifikat: 'SHM.0123/Sukamaju/2018',
    pemilik: 'Ahmad Pratama',
    alamat: 'Jl. Desa Sukamaju No. 1, RT 001/RW 001, Dusun Krajan',
    penggunaan: 'PEMUKIMAN',
    keterangan: 'Tanah hak milik warga, dipakai sebagai rumah tinggal',
    position: 2,
  },
  {
    id: BIDANG_TANAH_DATA_SEED_IDS.BT_4,
    nomorPersil: 'PRS/2024/004',
    luas: 2800,
    jenisHak: 'BELUM_BERSERTIFIKAT',
    nomorSertifikat: null,
    pemilik: 'Suparman',
    alamat: 'Blok Sawah Timur, Dusun Tegal Asri',
    penggunaan: 'PERTANIAN',
    keterangan: 'Tanah girik milik warga, sedang diajukan PTSL',
    position: 3,
  },
  {
    id: BIDANG_TANAH_DATA_SEED_IDS.BT_5,
    nomorPersil: 'PRS/2024/005',
    luas: 800,
    jenisHak: 'TANAH_TITISARA',
    nomorSertifikat: 'SHM.045/Desa-Sukamaju/2012',
    pemilik: 'Pemerintah Desa',
    alamat: 'Jl. Pasar Desa No. 5, Dusun Krajan',
    penggunaan: 'KOMERSIAL',
    keterangan: 'Tanah titisara, disewakan sebagai kios pasar desa',
    position: 4,
  },
  {
    id: BIDANG_TANAH_DATA_SEED_IDS.BT_6,
    nomorPersil: 'PRS/2024/006',
    luas: 1500,
    jenisHak: 'HM',
    nomorSertifikat: 'SHM.0789/Sukamaju/2020',
    pemilik: 'Hj. Maemunah',
    alamat: 'Jl. Krajan No. 22, Dusun Krajan',
    penggunaan: 'KOMERSIAL',
    keterangan: 'Tanah hak milik warga, dipakai untuk toko sembako besar',
    position: 5,
  },
];
