type RumahTanggaDataSeed = {
  id: string;
  nomorRumahTangga: string;
  namaKepalaRumahTangga: string;
  alamat: string;
  jumlahAnggota: number;
  statusEkonomi: string;
  keterangan: string;
  position: number;
};

export const RUMAH_TANGGA_DATA_SEED_COLUMNS: (keyof RumahTanggaDataSeed)[] = [
  'id',
  'nomorRumahTangga',
  'namaKepalaRumahTangga',
  'alamat',
  'jumlahAnggota',
  'statusEkonomi',
  'keterangan',
  'position',
];

// prettier-ignore
export const RUMAH_TANGGA_DATA_SEED_IDS = {
  RT_KK_1: '20202020-e101-41e7-8c72-ba44072a4c58',
  RT_KK_2: '20202020-e102-4b3d-a89c-7f6c30df998a',
  RT_KK_3: '20202020-e103-422c-8fcf-5b7496f94975',
  RT_KK_4: '20202020-e104-41d6-87a9-7add07bebfd8',
  RT_KK_5: '20202020-e105-422b-9cb2-5f8382a56877',
  RT_KK_6: '20202020-e106-4644-867d-e8e1851b3ee8',
  RT_KK_7: '20202020-e107-4c51-aa03-c4cd2423d7cb',
  RT_KK_8: '20202020-e108-48ec-97c0-dbbfcbe8df1b',
};

export const RUMAH_TANGGA_DATA_SEEDS: RumahTanggaDataSeed[] = [
  {
    id: RUMAH_TANGGA_DATA_SEED_IDS.RT_KK_1,
    nomorRumahTangga: 'RT/2024/001',
    namaKepalaRumahTangga: 'Ahmad Pratama',
    alamat: 'Jl. Desa Sukamaju No. 1, RT 001/RW 001, Dusun Krajan',
    jumlahAnggota: 4,
    statusEkonomi: 'SEJAHTERA_II',
    keterangan: 'Rumah tangga dengan usaha warung kelontong',
    position: 0,
  },
  {
    id: RUMAH_TANGGA_DATA_SEED_IDS.RT_KK_2,
    nomorRumahTangga: 'RT/2024/002',
    namaKepalaRumahTangga: 'Budi Santoso',
    alamat: 'Jl. Mekar Sari No. 5, RT 001/RW 003, Dusun Mekar Sari',
    jumlahAnggota: 3,
    statusEkonomi: 'SEJAHTERA_III',
    keterangan: 'Pegawai negeri, rumah milik sendiri',
    position: 1,
  },
  {
    id: RUMAH_TANGGA_DATA_SEED_IDS.RT_KK_3,
    nomorRumahTangga: 'RT/2024/003',
    namaKepalaRumahTangga: 'Siti Nurhaliza',
    alamat: 'Jl. Raya Desa No. 10, RT 003/RW 002, Dusun Krajan',
    jumlahAnggota: 2,
    statusEkonomi: 'PRA_SEJAHTERA',
    keterangan: 'Janda dengan satu anak, penerima PKH',
    position: 2,
  },
  {
    id: RUMAH_TANGGA_DATA_SEED_IDS.RT_KK_4,
    nomorRumahTangga: 'RT/2024/004',
    namaKepalaRumahTangga: 'Suparman',
    alamat: 'Jl. Tegal Asri No. 12, RT 001/RW 004, Dusun Tegal Asri',
    jumlahAnggota: 5,
    statusEkonomi: 'SEJAHTERA_I',
    keterangan: 'Petani penggarap sawah',
    position: 3,
  },
  {
    id: RUMAH_TANGGA_DATA_SEED_IDS.RT_KK_5,
    nomorRumahTangga: 'RT/2024/005',
    namaKepalaRumahTangga: 'Hj. Maemunah',
    alamat: 'Jl. Krajan No. 22, RT 002/RW 001, Dusun Krajan',
    jumlahAnggota: 3,
    statusEkonomi: 'SEJAHTERA_III_PLUS',
    keterangan: 'Pemilik toko sembako besar di pasar desa',
    position: 4,
  },
  {
    id: RUMAH_TANGGA_DATA_SEED_IDS.RT_KK_6,
    nomorRumahTangga: 'RT/2024/006',
    namaKepalaRumahTangga: 'Karyono',
    alamat: 'Jl. Mekar Sari No. 18, RT 001/RW 003, Dusun Mekar Sari',
    jumlahAnggota: 6,
    statusEkonomi: 'PRA_SEJAHTERA',
    keterangan: 'Buruh tani, calon penerima BLT DD',
    position: 5,
  },
  {
    id: RUMAH_TANGGA_DATA_SEED_IDS.RT_KK_7,
    nomorRumahTangga: 'RT/2024/007',
    namaKepalaRumahTangga: 'Rusmini',
    alamat: 'Jl. Tegal Asri No. 7, RT 001/RW 004, Dusun Tegal Asri',
    jumlahAnggota: 4,
    statusEkonomi: 'SEJAHTERA_II',
    keterangan: 'Wirausaha jahit pakaian',
    position: 6,
  },
  {
    id: RUMAH_TANGGA_DATA_SEED_IDS.RT_KK_8,
    nomorRumahTangga: 'RT/2024/008',
    namaKepalaRumahTangga: 'H. Sukardi',
    alamat: 'Jl. Krajan No. 3, RT 001/RW 001, Dusun Krajan',
    jumlahAnggota: 5,
    statusEkonomi: 'SEJAHTERA_III',
    keterangan: 'Tokoh masyarakat, pensiunan guru',
    position: 7,
  },
];
