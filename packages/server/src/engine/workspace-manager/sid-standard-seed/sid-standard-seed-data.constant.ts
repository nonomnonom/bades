// Bades SID Standard Data Seed — sample record minimal yang ditanam ke
// setiap workspace baru agar operator desa tidak melihat tabel kosong saat
// pertama kali masuk. 2-3 record per object, hanya field primitif (TEXT,
// SELECT, DATE, NUMBER, CURRENCY/LINK terdekomposisi) tanpa relasi FK
// supaya seed tahan terhadap urutan migrasi workspace.
//
// IDs memakai prefix namespace `30303030-` agar mudah dibedakan dari record
// produksi (dan dari `20202020-` yang dipakai dev-seeder workspace dev).
//
// Operator desa bebas menghapus record contoh ini — tujuannya hanya untuk
// memberi onboarding visual, bukan data referensi tetap.
//
// CATATAN PENTING: setiap baris WAJIB menyertakan kolom ACTOR composite
// (`createdByName`, `updatedByName`) karena migration runner Bades meng-set
// NOT NULL pada keduanya. Helper `withActorAudit()` di bawah menyalin
// default `'System'` + source `'MANUAL'` ke setiap row supaya tidak terlupa.

const ACTOR_AUDIT_COLUMNS = [
  'createdBySource',
  'createdByName',
  'updatedBySource',
  'updatedByName',
];

const ACTOR_AUDIT_DEFAULTS = {
  createdBySource: 'MANUAL',
  createdByName: 'System',
  updatedBySource: 'MANUAL',
  updatedByName: 'System',
};

const withActorAudit = <T extends Record<string, unknown>>(rows: T[]): T[] =>
  rows.map((row) => ({ ...ACTOR_AUDIT_DEFAULTS, ...row }) as T);

export type SidStandardDataSeed = {
  tableName: string;
  columns: string[];
  rows: Record<string, unknown>[];
};

export const SID_STANDARD_DATA_SEEDS: SidStandardDataSeed[] = [
  {
    tableName: '_wilayah',
    columns: ['id', 'name', 'position', ...ACTOR_AUDIT_COLUMNS],
    rows: withActorAudit([
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
    ]),
  },
  {
    tableName: '_penduduk',
    columns: [
      'id',
      'name',
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
      ...ACTOR_AUDIT_COLUMNS,
    ],
    rows: withActorAudit([
      {
        id: '30303030-0001-4000-8000-000000000001',
        name: 'Budi Santoso',
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
        name: 'Siti Aminah',
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
        name: 'Andi Santoso',
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
    ]),
  },
  {
    tableName: '_keluarga',
    columns: [
      'id',
      'name',
      'nomorKk',
      'alamat',
      'position',
      ...ACTOR_AUDIT_COLUMNS,
    ],
    rows: withActorAudit([
      {
        id: '30303030-0002-4000-8000-000000000001',
        name: 'KK 3201010101010001 - Keluarga Anggrek',
        nomorKk: '3201010101010001',
        alamat: 'Jl. Mawar No. 12, RT 01 / RW 01, Dusun Krajan',
        position: 0,
      },
      {
        id: '30303030-0002-4000-8000-000000000002',
        name: 'KK 3201010101010004 - Keluarga Melati',
        nomorKk: '3201010101010004',
        alamat: 'Jl. Melati No. 5, RT 01 / RW 01, Dusun Krajan',
        position: 1,
      },
    ]),
  },
  {
    tableName: '_jabatan',
    columns: [
      'id',
      'name',
      'namaJabatan',
      'tipeJabatan',
      'tugasPokok',
      'position',
      ...ACTOR_AUDIT_COLUMNS,
    ],
    rows: withActorAudit([
      {
        id: '30303030-0003-4000-8000-000000000001',
        name: 'Kepala Desa',
        namaJabatan: 'Kepala Desa',
        tipeJabatan: 'KEPALA_DESA',
        tugasPokok:
          'Memimpin penyelenggaraan pemerintahan desa, pembangunan, dan pelayanan masyarakat.',
        position: 0,
      },
      {
        id: '30303030-0003-4000-8000-000000000002',
        name: 'Sekretaris Desa',
        namaJabatan: 'Sekretaris Desa',
        tipeJabatan: 'SEKRETARIS',
        tugasPokok:
          'Membantu Kepala Desa dalam bidang administrasi pemerintahan.',
        position: 1,
      },
      {
        id: '30303030-0003-4000-8000-000000000003',
        name: 'Kepala Dusun Krajan',
        namaJabatan: 'Kepala Dusun Krajan',
        tipeJabatan: 'KEPALA_DUSUN',
        tugasPokok:
          'Membantu Kepala Desa dalam pelaksanaan tugas di wilayah Dusun Krajan.',
        position: 2,
      },
    ]),
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
      ...ACTOR_AUDIT_COLUMNS,
    ],
    rows: withActorAudit([
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
    ]),
  },
  {
    tableName: '_suratKeluar',
    columns: [
      'id',
      'name',
      'arahSurat',
      'asalSurat',
      'nomorSurat',
      'tanggalSurat',
      'perihal',
      'tujuan',
      'klasifikasi',
      'penandatangan',
      'position',
      ...ACTOR_AUDIT_COLUMNS,
    ],
    rows: withActorAudit([
      {
        id: '30303030-0005-4000-8000-000000000001',
        name: '470/001/DS/2025',
        arahSurat: 'KELUAR',
        asalSurat: null,
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
        name: '470/002/DS/2025',
        arahSurat: 'KELUAR',
        asalSurat: null,
        nomorSurat: '470/002/DS/2025',
        tanggalSurat: '2025-02-01',
        perihal: 'Undangan Musyawarah Desa',
        tujuan: 'Seluruh Perangkat Desa',
        klasifikasi: 'SEGERA',
        penandatangan: 'Sekretaris Desa',
        position: 1,
      },
      {
        id: '30303030-0005-4000-8000-000000000003',
        name: '001/KEC/2025',
        arahSurat: 'MASUK',
        asalSurat: 'Kecamatan Sukamaju',
        nomorSurat: '001/KEC/2025',
        tanggalSurat: '2025-03-05',
        perihal: 'Edaran Kecamatan tentang Musrenbangdes',
        tujuan: 'Kepala Desa',
        klasifikasi: 'BIASA',
        penandatangan: 'Camat',
        position: 2,
      },
    ]),
  },
  {
    tableName: '_programBantuan',
    // Field metadata Bades tidak memiliki `tahunAnggaran` — gunakan
    // `tanggalMulai`/`tanggalSelesai` untuk rentang program, dan
    // `jumlahPenerima`/`nilaiPerOrang` untuk indikator kasar.
    // `nilaiPerOrang` adalah composite CURRENCY: didekomposisi jadi
    // `nilaiPerOrangAmountMicros` (BigInt, 1 IDR = 1_000_000 micros) +
    // `nilaiPerOrangCurrencyCode`.
    columns: [
      'id',
      'name',
      'namaProgram',
      'jenisBantuan',
      'sumberDana',
      'jumlahPenerima',
      'nilaiPerOrangAmountMicros',
      'nilaiPerOrangCurrencyCode',
      'tanggalMulai',
      'tanggalSelesai',
      'status',
      'position',
      ...ACTOR_AUDIT_COLUMNS,
    ],
    rows: withActorAudit([
      {
        id: '30303030-0006-4000-8000-000000000001',
        name: 'BLT Dana Desa 2025',
        namaProgram: 'BLT Dana Desa 2025',
        jenisBantuan: 'BLT',
        sumberDana: 'Dana Desa',
        jumlahPenerima: 25,
        nilaiPerOrangAmountMicros: 300000000000,
        nilaiPerOrangCurrencyCode: 'IDR',
        tanggalMulai: '2025-01-01',
        tanggalSelesai: '2025-12-31',
        status: 'PELAKSANAAN',
        position: 0,
      },
      {
        id: '30303030-0006-4000-8000-000000000002',
        name: 'Bantuan Sembako Lansia',
        namaProgram: 'Bantuan Sembako Lansia',
        jenisBantuan: 'BPNT',
        sumberDana: 'APBDes',
        jumlahPenerima: 15,
        nilaiPerOrangAmountMicros: 150000000000,
        nilaiPerOrangCurrencyCode: 'IDR',
        tanggalMulai: '2025-03-01',
        tanggalSelesai: '2025-06-30',
        status: 'PERENCANAAN',
        position: 1,
      },
    ]),
  },
  {
    tableName: '_penerimaBantuan',
    // Field `jumlahDiterima` adalah composite CURRENCY: terdekomposisi jadi
    // `jumlahDiterimaAmountMicros` + `jumlahDiterimaCurrencyCode`. Field
    // status di Bades adalah `statusPenerimaan`, bukan `status` generik.
    columns: [
      'id',
      'name',
      'namaPenerima',
      'nik',
      'tanggalTerima',
      'jumlahDiterimaAmountMicros',
      'jumlahDiterimaCurrencyCode',
      'statusPenerimaan',
      'position',
      ...ACTOR_AUDIT_COLUMNS,
    ],
    rows: withActorAudit([
      {
        id: '30303030-0007-4000-8000-000000000001',
        name: 'Budi Santoso - BLT 2025',
        namaPenerima: 'Budi Santoso',
        nik: '3201010101010001',
        tanggalTerima: '2025-01-20',
        jumlahDiterimaAmountMicros: 300000000000,
        jumlahDiterimaCurrencyCode: 'IDR',
        statusPenerimaan: 'TERVERIFIKASI',
        position: 0,
      },
      {
        id: '30303030-0007-4000-8000-000000000002',
        name: 'Siti Aminah - BLT 2025',
        namaPenerima: 'Siti Aminah',
        nik: '3201010101010002',
        tanggalTerima: '2025-02-20',
        jumlahDiterimaAmountMicros: 300000000000,
        jumlahDiterimaCurrencyCode: 'IDR',
        statusPenerimaan: 'TERVERIFIKASI',
        position: 1,
      },
    ]),
  },
  {
    tableName: '_asetDesa',
    // Skema Bades: `jenisAset` (bukan `jenis`), `nilaiAset` CURRENCY
    // composite (didekomposisi jadi `nilaiAsetAmountMicros` +
    // `nilaiAsetCurrencyCode`), `kondisi` tetap field SELECT terpisah,
    // dan `statusPengelolaan` (rename dari `status` generik) sesuai
    // Permendagri 1/2016 (Aktif Dipakai / Tidak Dipakai / Dipinjamkan /
    // Disewakan / Dilepas).
    columns: [
      'id',
      'name',
      'kodeAset',
      'namaAset',
      'jenisAset',
      'lokasi',
      'tahunPerolehan',
      'asalPerolehan',
      'nilaiAsetAmountMicros',
      'nilaiAsetCurrencyCode',
      'kondisi',
      'statusPengelolaan',
      'position',
      ...ACTOR_AUDIT_COLUMNS,
    ],
    rows: withActorAudit([
      {
        id: '30303030-0008-4000-8000-000000000001',
        name: 'Kantor Balai Desa',
        kodeAset: 'AST/2020/001',
        namaAset: 'Kantor Balai Desa',
        jenisAset: 'BANGUNAN',
        lokasi: 'Jl. Raya Desa No. 1',
        tahunPerolehan: '2020',
        asalPerolehan: 'APBDES',
        nilaiAsetAmountMicros: 450000000000000,
        nilaiAsetCurrencyCode: 'IDR',
        kondisi: 'BAIK',
        statusPengelolaan: 'AKTIF',
        position: 0,
      },
      {
        id: '30303030-0008-4000-8000-000000000002',
        name: 'Motor Operasional Desa',
        kodeAset: 'AST/2022/002',
        namaAset: 'Motor Operasional Desa',
        jenisAset: 'KENDARAAN',
        lokasi: 'Garasi Balai Desa',
        tahunPerolehan: '2022',
        asalPerolehan: 'BANTUAN_PEMERINTAH',
        nilaiAsetAmountMicros: 18000000000000,
        nilaiAsetCurrencyCode: 'IDR',
        kondisi: 'BAIK',
        statusPengelolaan: 'AKTIF',
        position: 1,
      },
      {
        id: '30303030-0008-4000-8000-000000000003',
        name: 'Komputer Sekretariat',
        kodeAset: 'AST/2024/003',
        namaAset: 'Komputer Sekretariat',
        jenisAset: 'PERALATAN',
        lokasi: 'Ruang Sekretaris Desa',
        tahunPerolehan: '2024',
        asalPerolehan: 'APBDES',
        nilaiAsetAmountMicros: 7500000000000,
        nilaiAsetCurrencyCode: 'IDR',
        kondisi: 'BAIK',
        statusPengelolaan: 'AKTIF',
        position: 2,
      },
    ]),
  },
];
