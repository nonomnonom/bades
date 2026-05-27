// Bades SID Standard View — daftar field yang VISIBLE secara default di view
// utama tiap object SID. Field di luar daftar ini disembunyikan agar tabel
// awal tidak overwhelming untuk operator desa.
//
// Engine auto-create default view dengan semua field visible saat object
// dibuat. Service ini hanya men-toggle isVisible=false untuk field non-
// curated lewat raw UPDATE ke core."viewField" — operator tetap bisa
// menampilkan kembali lewat menu kolom di UI.
//
// CATATAN: nama field di sini WAJIB match dengan `name` di custom-field
// seeds. Field yang sudah di-rename atau dihapus tidak akan match → view
// default jadi kosong dan tabel tampil tanpa kolom data.

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
      'name',
      'nik',
      'jenisKelamin',
      'tanggalLahir',
      'statusHidup',
      'agama',
      'statusPerkawinan',
    ],
  },
  {
    objectNameSingular: 'keluarga',
    visibleFieldNames: ['name', 'nomorKk', 'alamat'],
  },
  {
    objectNameSingular: 'jabatan',
    visibleFieldNames: ['name', 'namaJabatan', 'tipeJabatan'],
  },
  {
    objectNameSingular: 'permohonanSurat',
    visibleFieldNames: [
      'name',
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
      'name',
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
      'name',
      'namaProgram',
      'jenisBantuan',
      'sumberDana',
      'tanggalMulai',
      'tanggalSelesai',
      'status',
    ],
  },
  {
    objectNameSingular: 'penerimaBantuan',
    visibleFieldNames: [
      'name',
      'namaPenerima',
      'nik',
      'tanggalTerima',
      'statusPenerimaan',
    ],
  },
  {
    objectNameSingular: 'asetDesa',
    visibleFieldNames: [
      'name',
      'kodeAset',
      'namaAset',
      'jenisAset',
      'kondisi',
      'statusPengelolaan',
      'tahunPerolehan',
      'lokasi',
    ],
  },
];
