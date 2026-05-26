export const PENDUDUK_FRAGMENT_WITH_DEPTH_ZERO_RELATIONS = `
      __typename
      id
      createdAt
      createdBy {
        source
        workspaceMemberId
        name
        context
      }
      updatedAt
      updatedBy {
        source
        workspaceMemberId
        name
        context
      }
      deletedAt
      nik
      nomorKk
      namaLengkap {
        firstName
        lastName
      }
      tempatLahir
      tanggalLahir
      jenisKelamin
      agama
      statusPerkawinan
      pendidikan
      pekerjaan
      golonganDarah
      kewarganegaraan
      alamat {
        addressLine1
        addressLine2
        city
        country
        postalCode
        state
      }
      rt
      rw
      dusun
      statusHubunganKeluarga
      tipeWarga
      statusHidup
      nikAyah
      nikIbu
      foto {
        primaryLinkUrl
        primaryLinkLabel
      }
      kartuKeluargaId
      keluarga {
        __typename
        id
        nomorKk
      }
`;

export const PENDUDUK_FRAGMENT_WITH_DEPTH_ONE_RELATIONS = `
      __typename
      id
      createdAt
      createdBy {
        source
        workspaceMemberId
        name
        context
      }
      updatedAt
      updatedBy {
        source
        workspaceMemberId
        name
        context
      }
      deletedAt
      nik
      nomorKk
      namaLengkap {
        firstName
        lastName
      }
      tempatLahir
      tanggalLahir
      jenisKelamin
      agama
      statusPerkawinan
      pendidikan
      pekerjaan
      golonganDarah
      kewarganegaraan
      alamat {
        addressLine1
        addressLine2
        city
        country
        postalCode
        state
      }
      rt
      rw
      dusun
      statusHubunganKeluarga
      tipeWarga
      statusHidup
      nikAyah
      nikIbu
      foto {
        primaryLinkUrl
        primaryLinkLabel
      }
      kartuKeluargaId
      keluarga {
        __typename
        id
        nomorKk
        alamat
        jumlahAnggota
        kecamatan
        klasifikasiKeluarga
      }
`;
