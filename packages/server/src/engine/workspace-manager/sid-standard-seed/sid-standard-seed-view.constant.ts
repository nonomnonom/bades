// Bades SID Standard View — daftar field yang VISIBLE secara default di view
// utama tiap object SID. Field di luar daftar ini disembunyikan agar tabel
// awal tidak overwhelming untuk operator desa.
//
// Engine auto-create default view dengan semua field visible saat object
// dibuat. Service ini hanya men-toggle isVisible=false untuk field non-
// curated lewat raw UPDATE ke core."viewField" — operator tetap bisa
// menampilkan kembali lewat menu kolom di UI.

export type SidStandardViewConfig = {
  // nameSingular dari custom object SID (mis. 'penduduk').
  objectNameSingular: string;
  // Field-field yang TETAP terlihat di view default. Field lain di-hide.
  visibleFieldNames: string[];
};

export const SID_STANDARD_VIEW_CONFIGS: SidStandardViewConfig[] = [
  {
    objectNameSingular: 'wilayah',
    visibleFieldNames: ['name'],
  },
  {
    objectNameSingular: 'penduduk',
    visibleFieldNames: [
      'nik',
      'namaLengkap',
      'jenisKelamin',
      'tanggalLahir',
      'statusHidup',
      'agama',
      'statusPerkawinan',
    ],
  },
  {
    objectNameSingular: 'keluarga',
    visibleFieldNames: ['nomorKk', 'alamat'],
  },
  {
    objectNameSingular: 'jabatan',
    visibleFieldNames: ['namaJabatan', 'tipeJabatan'],
  },
  {
    objectNameSingular: 'permohonanSurat',
    visibleFieldNames: [
      'nomorPermohonan',
      'tanggalPermohonan',
      'status',
      'keperluan',
      'tanggalSelesai',
    ],
  },
  {
    objectNameSingular: 'suratKeluar',
    visibleFieldNames: [
      'arahSurat',
      'nomorSurat',
      'tanggalSurat',
      'perihal',
      'tujuan',
      'klasifikasi',
      'penandatangan',
    ],
  },
  {
    objectNameSingular: 'programBantuan',
    visibleFieldNames: [
      'namaProgram',
      'jenisBantuan',
      'tahunAnggaran',
      'sumberDana',
      'status',
    ],
  },
  {
    objectNameSingular: 'penerimaBantuan',
    visibleFieldNames: ['tanggalTerima', 'jumlahDiterima', 'status'],
  },
  {
    objectNameSingular: 'asetDesa',
    visibleFieldNames: [
      'kodeAset',
      'namaAset',
      'jenis',
      'kondisi',
      'tahunPerolehan',
      'nilaiPerolehan',
      'lokasi',
    ],
  },
];
