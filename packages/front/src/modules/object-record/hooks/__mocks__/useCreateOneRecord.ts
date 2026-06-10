import { gql } from '@apollo/client';

import { PENDUDUK_FRAGMENT_WITH_DEPTH_ONE_RELATIONS } from '@/object-record/hooks/__mocks__/pendudukFragments';

export const query = gql`
  mutation CreateOnePenduduk($input: PendudukCreateInput!) {
    createPenduduk(data: $input) {
      ${PENDUDUK_FRAGMENT_WITH_DEPTH_ONE_RELATIONS}
    }
  }
`;

export const responseData = {
  __typename: 'Penduduk',
  id: 'b2abbb63-34ed-4a16-89f5-f549ac55d0f9',
  createdAt: '2025-01-15T08:00:00.000Z',
  createdBy: null,
  updatedAt: '2025-01-15T08:00:00.000Z',
  updatedBy: null,
  deletedAt: null,
  nik: '3201011501800004',
  namaLengkap: { firstName: 'Ketut', lastName: 'Wira' },
  tempatLahir: 'Gianyar',
  tanggalLahir: '1990-03-10',
  jenisKelamin: 'LAKI_LAKI',
  agama: 'HINDU',
  statusPerkawinan: 'BELUM_KAWIN',
  pendidikan: 'SMA',
  pekerjaan: 'PEDAGANG',
  golonganDarah: 'A',
  kewarganegaraan: 'WNI',
  statusHubunganKeluarga: 'ANAK',
  statusKependudukan: 'MENETAP',
  statusDasar: 'HIDUP',
  nikAyah: '3201011501800001',
  nikIbu: '3201011501800005',
  namaAyah: 'Wayan Sutrisna',
  namaIbu: 'Ni Luh Sukerti',
  noAktaKelahiran: 'AKT/1990/000023',
  penyandangDisabilitas: 'TIDAK_ADA',
  noHp: { primaryPhoneNumber: '081234567898', primaryPhoneCountryCode: 'ID' },
  email: { primaryEmail: 'ketut.wira@example.com' },
  foto: { fileId: null, label: null, extension: null, url: null },
  wilayahId: 'a0abbb63-34ed-4a16-89f5-f549ac55d0f8',
  wilayah: {
    __typename: 'Wilayah',
    id: 'a0abbb63-34ed-4a16-89f5-f549ac55d0f8',
    namaWilayah: 'RT 02',
    jenisWilayah: 'RT',
    kode: '002',
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
