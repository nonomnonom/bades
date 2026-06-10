// Fragment GraphQL untuk object Penduduk (SID Bades).
// Mencerminkan schema field aktual dari penduduk-custom-field-seeds.constant.ts.
// Saat seed SID berubah, regenerate via:
//   packages/front/scripts/generate-mock-data.ts

export const PENDUDUK_FRAGMENT_WITH_DEPTH_ZERO_RELATIONS = `
      __typename
      createdAt
      createdBy {
        source
        workspaceMemberId
        name
        context
      }
      deletedAt
      email {
        primaryEmail
        additionalEmails
      }
      foto {
        fileId
        label
        extension
        url
      }
      golonganDarah
      id
      jenisKelamin
      kartuKeluargaId
      kewarganegaraan
      namaAyah
      namaIbu
      namaLengkap {
        firstName
        lastName
      }
      nik
      nikAyah
      nikIbu
      noAktaKelahiran
      noHp {
        primaryPhoneNumber
        primaryPhoneCountryCode
        primaryPhoneCallingCode
        additionalPhones
      }
      pekerjaan
      pendidikan
      penyandangDisabilitas
      position
      statusDasar
      statusHubunganKeluarga
      statusKependudukan
      statusPerkawinan
      tanggalLahir
      tanggalMeninggal
      tanggalSinkronisasiDukcapil
      tempatLahir
      updatedAt
      updatedBy {
        source
        workspaceMemberId
        name
        context
      }
      wilayahId
`;

export const PENDUDUK_FRAGMENT_WITH_DEPTH_ONE_RELATIONS = `
      __typename
      createdAt
      createdBy {
        source
        workspaceMemberId
        name
        context
      }
      deletedAt
      email {
        primaryEmail
        additionalEmails
      }
      foto {
        fileId
        label
        extension
        url
      }
      golonganDarah
      id
      jenisKelamin
      kartuKeluargaId
      kartuKeluarga {
        __typename
        id
        nomorKk
        namaKepalaKeluarga
        alamat {
          addressStreet1
          addressStreet2
          addressCity
          addressState
          addressPostcode
          addressCountry
          addressLat
          addressLng
        }
        jumlahAnggota
        klasifikasiKeluarga
      }
      kewarganegaraan
      namaAyah
      namaIbu
      namaLengkap {
        firstName
        lastName
      }
      nik
      nikAyah
      nikIbu
      noAktaKelahiran
      noHp {
        primaryPhoneNumber
        primaryPhoneCountryCode
        primaryPhoneCallingCode
        additionalPhones
      }
      pekerjaan
      pendidikan
      penyandangDisabilitas
      position
      statusDasar
      statusHubunganKeluarga
      statusKependudukan
      statusPerkawinan
      tanggalLahir
      tanggalMeninggal
      tanggalSinkronisasiDukcapil
      tempatLahir
      updatedAt
      updatedBy {
        source
        workspaceMemberId
        name
        context
      }
      wilayah {
        __typename
        id
        namaWilayah
        jenisWilayah
        kode
      }
      wilayahId
`;
