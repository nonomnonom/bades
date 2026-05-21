import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

type PendudukDataSeed = {
  id: string;
  nik: string;
  nomorKk: string;
  namaLengkapFirstName: string;
  namaLengkapLastName: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  agama: string;
  statusPerkawinan: string;
  pendidikan: string;
  pekerjaan: string;
  golonganDarah: string;
  kewarganegaraan: string;
  alamatAddressStreet1: string;
  alamatAddressCity: string;
  alamatAddressCountry: string;
  rt: string;
  rw: string;
  dusun: string;
  statusHubunganKeluarga: string;
  tipeWarga: string;
  statusHidup: string;
  nikAyah: string;
  nikIbu: string;
  createdBySource: string;
  createdByWorkspaceMemberId: string;
  createdByName: string;
  updatedBySource: string;
  updatedByWorkspaceMemberId: string;
  updatedByName: string;
  position: number;
};

export const PENDUDUK_DATA_SEED_COLUMNS: (keyof PendudukDataSeed)[] = [
  'id',
  'nik',
  'nomorKk',
  'namaLengkapFirstName',
  'namaLengkapLastName',
  'tempatLahir',
  'tanggalLahir',
  'jenisKelamin',
  'agama',
  'statusPerkawinan',
  'pendidikan',
  'pekerjaan',
  'golonganDarah',
  'kewarganegaraan',
  'alamatAddressStreet1',
  'alamatAddressCity',
  'alamatAddressCountry',
  'rt',
  'rw',
  'dusun',
  'statusHubunganKeluarga',
  'tipeWarga',
  'statusHidup',
  'nikAyah',
  'nikIbu',
  'createdBySource',
  'createdByWorkspaceMemberId',
  'createdByName',
  'updatedBySource',
  'updatedByWorkspaceMemberId',
  'updatedByName',
  'position',
];

// prettier-ignore
export const PENDUDUK_DATA_SEED_IDS = {
  ID_1: '20202020-c305-41e7-8c72-ba44072a4c58',
  ID_2: '20202020-c225-4b3d-a89c-7f6c30df998a',
  ID_3: '20202020-c8b0-422c-8fcf-5b7496f94975',
  ID_4: '20202020-caf7-41d6-87a9-7add07bebfd8',
  ID_5: '20202020-c19d-422b-9cb2-5f8382a56877',
  ID_6: '20202020-c39c-4644-867d-e8e1851b3ee8',
  ID_7: '20202020-c0eb-4c51-aa03-c4cd2423d7cb',
  ID_8: '20202020-c9b5-48ec-97c0-dbbfcbe8df1b',
  ID_9: '20202020-c89d-44f9-ac9c-25e462460cb0',
  ID_10: '20202020-c377-4693-a2d9-89dc9188a1dc',
};

const KADES_USER_ID = WORKSPACE_MEMBER_DATA_SEED_IDS.KADES;

export const PENDUDUK_DATA_SEEDS: PendudukDataSeed[] = [
  {
    id: PENDUDUK_DATA_SEED_IDS.ID_1,
    nik: '3201234567890001',
    nomorKk: '3201234567890000',
    namaLengkapFirstName: 'Ahmad',
    namaLengkapLastName: 'Pratama',
    tempatLahir: 'Bandung',
    tanggalLahir: '1985-03-15',
    jenisKelamin: 'LAKI_LAKI',
    agama: 'ISLAM',
    statusPerkawinan: 'KAWIN',
    pendidikan: 'S1',
    pekerjaan: 'Petani',
    golonganDarah: 'O',
    kewarganegaraan: 'WNI',
    alamatAddressStreet1: 'Jl. Desa Sukamaju No. 1',
    alamatAddressCity: 'Sukamaju',
    alamatAddressCountry: 'Indonesia',
    rt: '001',
    rw: '002',
    dusun: 'Dusun Utama',
    statusHubunganKeluarga: 'KEPALA_KELUARGA',
    tipeWarga: 'TETAP',
    statusHidup: 'HIDUP',
    nikAyah: '3201234567890005',
    nikIbu: '3201234567890006',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 0,
  },
  {
    id: PENDUDUK_DATA_SEED_IDS.ID_2,
    nik: '3201234567890002',
    nomorKk: '3201234567890000',
    namaLengkapFirstName: 'Siti',
    namaLengkapLastName: 'Nurhaliza',
    tempatLahir: 'Bandung',
    tanggalLahir: '1987-07-22',
    jenisKelamin: 'PEREMPUAN',
    agama: 'ISLAM',
    statusPerkawinan: 'KAWIN',
    pendidikan: 'SMA',
    pekerjaan: 'Ibu Rumah Tangga',
    golonganDarah: 'A',
    kewarganegaraan: 'WNI',
    alamatAddressStreet1: 'Jl. Desa Sukamaju No. 1',
    alamatAddressCity: 'Sukamaju',
    alamatAddressCountry: 'Indonesia',
    rt: '001',
    rw: '002',
    dusun: 'Dusun Utama',
    statusHubunganKeluarga: 'ISTRI',
    tipeWarga: 'TETAP',
    statusHidup: 'HIDUP',
    nikAyah: '3201234567890007',
    nikIbu: '3201234567890008',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 1,
  },
  {
    id: PENDUDUK_DATA_SEED_IDS.ID_3,
    nik: '3201234567890003',
    nomorKk: '3201234567890000',
    namaLengkapFirstName: 'Rizki',
    namaLengkapLastName: 'Pratama',
    tempatLahir: 'Bandung',
    tanggalLahir: '2010-11-08',
    jenisKelamin: 'LAKI_LAKI',
    agama: 'ISLAM',
    statusPerkawinan: 'BELUM_KAWIN',
    pendidikan: 'SMP',
    pekerjaan: 'Pelajar',
    golonganDarah: 'AB',
    kewarganegaraan: 'WNI',
    alamatAddressStreet1: 'Jl. Desa Sukamaju No. 1',
    alamatAddressCity: 'Sukamaju',
    alamatAddressCountry: 'Indonesia',
    rt: '001',
    rw: '002',
    dusun: 'Dusun Utama',
    statusHubunganKeluarga: 'ANAK',
    tipeWarga: 'TETAP',
    statusHidup: 'HIDUP',
    nikAyah: '3201234567890001',
    nikIbu: '3201234567890002',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 2,
  },
  {
    id: PENDUDUK_DATA_SEED_IDS.ID_4,
    nik: '3201234567890004',
    nomorKk: '3201234567890001',
    namaLengkapFirstName: 'Budi',
    namaLengkapLastName: 'Santoso',
    tempatLahir: 'Sukabumi',
    tanggalLahir: '1970-05-30',
    jenisKelamin: 'LAKI_LAKI',
    agama: 'KRISTEN',
    statusPerkawinan: 'KAWIN',
    pendidikan: 'S2',
    pekerjaan: 'Kepala Desa',
    golonganDarah: 'B',
    kewarganegaraan: 'WNI',
    alamatAddressStreet1: 'Jl. Desa Mekar Sari No. 5',
    alamatAddressCity: 'Mekar Sari',
    alamatAddressCountry: 'Indonesia',
    rt: '003',
    rw: '004',
    dusun: 'Dusun Mekar',
    statusHubunganKeluarga: 'KEPALA_KELUARGA',
    tipeWarga: 'TETAP',
    statusHidup: 'HIDUP',
    nikAyah: '3201234567890010',
    nikIbu: '3201234567890011',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 3,
  },
  {
    id: PENDUDUK_DATA_SEED_IDS.ID_5,
    nik: '3201234567890005',
    nomorKk: '3201234567890002',
    namaLengkapFirstName: 'Dewi',
    namaLengkapLastName: 'Kusuma',
    tempatLahir: 'Garut',
    tanggalLahir: '1995-09-12',
    jenisKelamin: 'PEREMPUAN',
    agama: 'ISLAM',
    statusPerkawinan: 'BELUM_KAWIN',
    pendidikan: 'D3',
    pekerjaan: 'Perawat Desa',
    golonganDarah: 'O',
    kewarganegaraan: 'WNI',
    alamatAddressStreet1: 'Jl. Raya Desa No. 10',
    alamatAddressCity: 'Sukamaju',
    alamatAddressCountry: 'Indonesia',
    rt: '002',
    rw: '002',
    dusun: 'Dusun Selatan',
    statusHubunganKeluarga: 'ANAK',
    tipeWarga: 'TETAP',
    statusHidup: 'HIDUP',
    nikAyah: '3201234567890015',
    nikIbu: '3201234567890016',
    createdBySource: 'API',
    createdByWorkspaceMemberId: KADES_USER_ID,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'API',
    updatedByWorkspaceMemberId: KADES_USER_ID,
    updatedByName: 'Drs. H. Abdullah',
    position: 4,
  },
];