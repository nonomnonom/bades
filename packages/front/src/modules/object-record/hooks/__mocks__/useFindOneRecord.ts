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
  nomorKk: '3201010101010001',
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
  alamat: {
    addressLine1: 'Jl. Raya Desa No. 5',
    addressLine2: null,
    city: 'Bangli',
    country: 'Indonesia',
    postalCode: '80619',
    state: 'Bali',
  },
  rt: '01',
  rw: '01',
  dusun: 'Dusun Selatan',
  statusHubunganKeluarga: 'KEPALA_KELUARGA',
  tipeWarga: 'TETAP',
  statusHidup: 'HIDUP',
  nikAyah: '3201011501800002',
  nikIbu: '3201011501800003',
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
