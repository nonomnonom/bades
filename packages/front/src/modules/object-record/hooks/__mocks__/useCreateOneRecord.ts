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
  nomorKk: '3201010101010002',
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
  alamat: {
    addressLine1: 'Jl. Monkey Forest No. 12',
    addressLine2: null,
    city: 'Ubud',
    country: 'Indonesia',
    postalCode: '80571',
    state: 'Bali',
  },
  rt: '02',
  rw: '01',
  dusun: 'Dusun Utara',
  statusHubunganKeluarga: 'ANAK',
  tipeWarga: 'TETAP',
  statusHidup: 'HIDUP',
  nikAyah: '3201011501800001',
  nikIbu: '3201011501800005',
  foto: { primaryLinkUrl: '', primaryLinkLabel: null },
  kartuKeluargaId: 'a0abbb63-34ed-4a16-89f5-f549ac55d0f9',
  keluarga: {
    __typename: 'Keluarga',
    id: 'a0abbb63-34ed-4a16-89f5-f549ac55d0f9',
    nomorKk: '3201010101010001',
    alamat: 'Jl. Mawar No. 3, RT 01/RW 01, Desa Mekarsari',
    jumlahAnggota: 4,
    kecamatan: 'Cisarua',
    klasifikasiKeluarga: 'SEJAHTERA_1',
  },
};
