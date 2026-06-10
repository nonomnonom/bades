import { gql } from '@apollo/client';

import { PENDUDUK_FRAGMENT_WITH_DEPTH_ONE_RELATIONS } from '@/object-record/hooks/__mocks__/pendudukFragments';

export const query = gql`
  query FindOnePenduduk($objectRecordId: UUID!) {
    penduduk(filter: { id: { eq: $objectRecordId } }) {
      ${PENDUDUK_FRAGMENT_WITH_DEPTH_ONE_RELATIONS}
    }
  }
`;

export const variables = {
  objectRecordId: '6205681e-7c11-40b4-9e32-f523dbe54590',
};

export const responseData = {
  __typename: 'Penduduk',
  id: '6205681e-7c11-40b4-9e32-f523dbe54590',
  createdAt: '2025-01-15T08:00:00.000Z',
  createdBy: null,
  updatedAt: '2025-01-15T08:00:00.000Z',
  updatedBy: null,
  deletedAt: null,
  nik: '3201011501800001',
  namaLengkap: { firstName: 'Made', lastName: 'Sutrisna' },
  tempatLahir: 'Denpasar',
  tanggalLahir: '1985-06-20',
  jenisKelamin: 'LAKI_LAKI',
  agama: 'HINDU',
  statusPerkawinan: 'KAWIN',
  pendidikan: 'S1',
  pekerjaan: 'PETANI',
  golonganDarah: 'O',
  kewarganegaraan: 'WNI',
  statusHubunganKeluarga: 'KEPALA_KELUARGA',
  statusKependudukan: 'MENETAP',
  statusDasar: 'HIDUP',
  nikAyah: '3201015507100001',
  nikIbu: '3201016002150001',
  namaAyah: 'Wayan Sutrisna',
  namaIbu: 'Ni Luh Sukerti',
  noAktaKelahiran: 'AKT/1985/000012',
  penyandangDisabilitas: 'TIDAK_ADA',
  noHp: { primaryPhoneNumber: '081234567890', primaryPhoneCountryCode: 'ID' },
  email: { primaryEmail: 'made.sutrisna@example.com' },
  foto: { fileId: null, label: null, extension: null, url: null },
  wilayahId: 'a0abbb63-34ed-4a16-89f5-f549ac55d0f8',
  wilayah: {
    __typename: 'Wilayah',
    id: 'a0abbb63-34ed-4a16-89f5-f549ac55d0f8',
    namaWilayah: 'RT 01',
    jenisWilayah: 'RT',
    kode: '001',
  },
  kartuKeluargaId: 'a0abbb63-34ed-4a16-89f5-f549ac55d0f9',
  kartuKeluarga: {
    __typename: 'Keluarga',
    id: 'a0abbb63-34ed-4a16-89f5-f549ac55d0f9',
    nomorKk: '3201010101010001',
    namaKepalaKeluarga: 'Made Sutrisna',
    alamat: {
      addressStreet1: 'Jl. Mawar No. 3, Dusun Selatan',
      addressCity: 'Bangli',
      addressState: 'Bali',
      addressPostcode: '80619',
      addressCountry: 'Indonesia',
    },
    jumlahAnggota: 4,
    klasifikasiKeluarga: 'KS3',
  },
};
