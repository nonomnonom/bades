// Bades SID Standard Data Seed — sample record minimal yang ditanam ke
// setiap workspace baru agar operator desa tidak melihat tabel kosong saat
// pertama kali masuk. 2-3 record per object, hanya field primitif (TEXT,
// SELECT, DATE, NUMBER) tanpa relasi FK supaya seed tahan terhadap urutan
// migrasi workspace.
//
// IDs memakai prefix namespace `30303030-` agar mudah dibedakan dari record
// produksi (dan dari `20202020-` yang dipakai dev-seeder workspace dev).
//
// Operator desa bebas menghapus record contoh ini — tujuannya hanya untuk
// memberi onboarding visual, bukan data referensi tetap.

export type SidStandardDataSeed = {
  tableName: string;
  columns: string[];
  rows: Record<string, unknown>[];
};

export const SID_STANDARD_DATA_SEEDS: SidStandardDataSeed[] = [
  {
    tableName: '_wilayah',
    columns: ['id', 'name', 'position'],
    rows: [
      {
        id: '30303030-0000-4000-8000-000000000001',
        name: 'Dusun Krajan',
        position: 0,
      },
      {
        id: '30303030-0000-4000-8000-000000000002',
        name: 'RW 01',
        position: 1,
      },
      {
        id: '30303030-0000-4000-8000-000000000003',
        name: 'RT 01',
        position: 2,
      },
    ],
  },
  {
    tableName: '_penduduk',
    columns: [
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
      'pekerjaan',
      'pendidikan',
      'kewarganegaraan',
      'statusHidup',
      'position',
    ],
    rows: [
      {
        id: '30303030-0001-4000-8000-000000000001',
        nik: '3201010101010001',
        nomorKk: '3201010101010001',
        namaLengkapFirstName: 'Budi',
        namaLengkapLastName: 'Santoso',
        tempatLahir: 'Bogor',
        tanggalLahir: '1980-05-15',
        jenisKelamin: 'LAKI_LAKI',
        agama: 'ISLAM',
        statusPerkawinan: 'KAWIN',
        pekerjaan: 'PETANI',
        pendidikan: 'SMA',
        kewarganegaraan: 'WNI',
        statusHidup: 'HIDUP',
        position: 0,
      },
      {
        id: '30303030-0001-4000-8000-000000000002',
        nik: '3201010101010002',
        nomorKk: '3201010101010001',
        namaLengkapFirstName: 'Siti',
        namaLengkapLastName: 'Aminah',
        tempatLahir: 'Bogor',
        tanggalLahir: '1985-08-20',
        jenisKelamin: 'PEREMPUAN',
        agama: 'ISLAM',
        statusPerkawinan: 'KAWIN',
        pekerjaan: 'IBU_RUMAH_TANGGA',
        pendidikan: 'SMP',
        kewarganegaraan: 'WNI',
        statusHidup: 'HIDUP',
        position: 1,
      },
      {
        id: '30303030-0001-4000-8000-000000000003',
        nik: '3201010101010003',
        nomorKk: '3201010101010001',
        namaLengkapFirstName: 'Andi',
        namaLengkapLastName: 'Santoso',
        tempatLahir: 'Bogor',
        tanggalLahir: '2010-03-10',
        jenisKelamin: 'LAKI_LAKI',
        agama: 'ISLAM',
        statusPerkawinan: 'BELUM_KAWIN',
        pekerjaan: 'PELAJAR',
        pendidikan: 'SD',
        kewarganegaraan: 'WNI',
        statusHidup: 'HIDUP',
        position: 2,
      },
    ],
  },
  {
    tableName: '_keluarga',
    columns: ['id', 'nomorKk', 'alamat', 'position'],
    rows: [
      {
        id: '30303030-0002-4000-8000-000000000001',
        nomorKk: '3201010101010001',
        alamat: 'Jl. Mawar No. 12, RT 01 / RW 01, Dusun Krajan',
        position: 0,
      },
      {
        id: '30303030-0002-4000-8000-000000000002',
        nomorKk: '3201010101010004',
        alamat: 'Jl. Melati No. 5, RT 01 / RW 01, Dusun Krajan',
        position: 1,
      },
    ],
  },
  {
    tableName: '_jabatan',
    columns: ['id', 'namaJabatan', 'tipeJabatan', 'tugasPokok', 'position'],
    rows: [
      {
        id: '30303030-0003-4000-8000-000000000001',
        namaJabatan: 'Kepala Desa',
        tipeJabatan: 'KEPALA_DESA',
        tugasPokok:
          'Memimpin penyelenggaraan pemerintahan desa, pembangunan, dan pelayanan masyarakat.',
        position: 0,
      },
      {
        id: '30303030-0003-4000-8000-000000000002',
        namaJabatan: 'Sekretaris Desa',
        tipeJabatan: 'SEKRETARIS',
        tugasPokok:
          'Membantu Kepala Desa dalam bidang administrasi pemerintahan.',
        position: 1,
      },
      {
        id: '30303030-0003-4000-8000-000000000003',
        namaJabatan: 'Kepala Dusun Krajan',
        tipeJabatan: 'KEPALA_DUSUN',
        tugasPokok:
          'Membantu Kepala Desa dalam pelaksanaan tugas di wilayah Dusun Krajan.',
        position: 2,
      },
    ],
  },
  {
    tableName: '_permohonanSurat',
    columns: [
      'id',
      'nomorPermohonan',
      'tanggalPermohonan',
      'status',
      'keperluan',
      'catatan',
      'position',
    ],
    rows: [
      {
        id: '30303030-0004-4000-8000-000000000001',
        nomorPermohonan: 'LYN/2025/001',
        tanggalPermohonan: '2025-01-10',
        status: 'SELESAI',
        keperluan: 'Pengantar SKCK untuk lamaran kerja',
        catatan: 'Surat telah diterbitkan',
        position: 0,
      },
      {
        id: '30303030-0004-4000-8000-000000000002',
        nomorPermohonan: 'LYN/2025/002',
        tanggalPermohonan: '2025-02-15',
        status: 'DIPROSES',
        keperluan: 'Surat Keterangan Tidak Mampu untuk beasiswa',
        catatan: 'Menunggu verifikasi data',
        position: 1,
      },
    ],
  },
  {
    tableName: '_suratKeluar',
    columns: [
      'id',
      'nomorSurat',
      'tanggalSurat',
      'perihal',
      'tujuan',
      'klasifikasi',
      'penandatangan',
      'position',
    ],
    rows: [
      {
        id: '30303030-0005-4000-8000-000000000001',
        nomorSurat: '470/001/DS/2025',
        tanggalSurat: '2025-01-15',
        perihal: 'Pengantar SKCK',
        tujuan: 'Polsek Kecamatan',
        klasifikasi: 'BIASA',
        penandatangan: 'Kepala Desa',
        position: 0,
      },
      {
        id: '30303030-0005-4000-8000-000000000002',
        nomorSurat: '470/002/DS/2025',
        tanggalSurat: '2025-02-01',
        perihal: 'Undangan Musyawarah Desa',
        tujuan: 'Seluruh Perangkat Desa',
        klasifikasi: 'SEGERA',
        penandatangan: 'Sekretaris Desa',
        position: 1,
      },
    ],
  },
  {
    tableName: '_programBantuan',
    columns: [
      'id',
      'namaProgram',
      'jenisBantuan',
      'tahunAnggaran',
      'sumberDana',
      'status',
      'position',
    ],
    rows: [
      {
        id: '30303030-0006-4000-8000-000000000001',
        namaProgram: 'BLT Dana Desa 2025',
        jenisBantuan: 'TUNAI',
        tahunAnggaran: '2025',
        sumberDana: 'Dana Desa',
        status: 'BERJALAN',
        position: 0,
      },
      {
        id: '30303030-0006-4000-8000-000000000002',
        namaProgram: 'Bantuan Sembako Lansia',
        jenisBantuan: 'SEMBAKO',
        tahunAnggaran: '2025',
        sumberDana: 'APBDes',
        status: 'PERENCANAAN',
        position: 1,
      },
    ],
  },
  {
    tableName: '_penerimaBantuan',
    columns: ['id', 'tanggalTerima', 'jumlahDiterima', 'status', 'position'],
    rows: [
      {
        id: '30303030-0007-4000-8000-000000000001',
        tanggalTerima: '2025-01-20',
        jumlahDiterima: 300000,
        status: 'DITERIMA',
        position: 0,
      },
      {
        id: '30303030-0007-4000-8000-000000000002',
        tanggalTerima: '2025-02-20',
        jumlahDiterima: 300000,
        status: 'DITERIMA',
        position: 1,
      },
    ],
  },
  {
    tableName: '_asetDesa',
    columns: [
      'id',
      'kodeAset',
      'namaAset',
      'jenis',
      'lokasi',
      'tahunPerolehan',
      'asalPerolehan',
      'nilaiPerolehan',
      'kondisi',
      'position',
    ],
    rows: [
      {
        id: '30303030-0008-4000-8000-000000000001',
        kodeAset: 'AST/2020/001',
        namaAset: 'Kantor Balai Desa',
        jenis: 'BANGUNAN',
        lokasi: 'Jl. Raya Desa No. 1',
        tahunPerolehan: 2020,
        asalPerolehan: 'APBDes',
        nilaiPerolehan: 450000000,
        kondisi: 'BAIK',
        position: 0,
      },
      {
        id: '30303030-0008-4000-8000-000000000002',
        kodeAset: 'AST/2022/002',
        namaAset: 'Motor Operasional Desa',
        jenis: 'KENDARAAN',
        lokasi: 'Garasi Balai Desa',
        tahunPerolehan: 2022,
        asalPerolehan: 'Bantuan Pemerintah',
        nilaiPerolehan: 18000000,
        kondisi: 'BAIK',
        position: 1,
      },
      {
        id: '30303030-0008-4000-8000-000000000003',
        kodeAset: 'AST/2024/003',
        namaAset: 'Komputer Sekretariat',
        jenis: 'PERALATAN',
        lokasi: 'Ruang Sekretaris Desa',
        tahunPerolehan: 2024,
        asalPerolehan: 'APBDes',
        nilaiPerolehan: 7500000,
        kondisi: 'BAIK',
        position: 2,
      },
    ],
  },
];
