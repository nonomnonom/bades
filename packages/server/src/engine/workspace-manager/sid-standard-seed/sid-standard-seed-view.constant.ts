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
//
// Jangan sertakan field sistem `name` bila labelIdentifier sudah field
// custom (namaAset, namaProgram, dll.) — kolom `name` duplikat memicu
// header tabel menampilkan dua kolom "Name" sebelum perbaikan UI.

export type SidStandardViewConfig = {
  // nameSingular dari custom object SID (mis. 'penduduk').
  objectNameSingular: string;
  // Field-field yang TETAP terlihat di view default. Field lain di-hide.
  visibleFieldNames: string[];
};

export const SID_STANDARD_VIEW_CONFIGS: SidStandardViewConfig[] = [
  {
    objectNameSingular: 'wilayah',
    visibleFieldNames: ['namaWilayah', 'jenisWilayah', 'kode', 'luasHektar'],
  },
  {
    objectNameSingular: 'penduduk',
    visibleFieldNames: [
      'namaLengkap',
      'nik',
      'jenisKelamin',
      'tanggalLahir',
      'statusPerkawinan',
      'agama',
      'pekerjaan',
      'pendidikan',
      'statusDasar',
      'statusKependudukan',
    ],
  },
  {
    objectNameSingular: 'keluarga',
    visibleFieldNames: [
      'nomorKk',
      'namaKepalaKeluarga',
      'alamat',
      'klasifikasiKeluarga',
      'jumlahAnggota',
    ],
  },
  {
    objectNameSingular: 'asetDesa',
    visibleFieldNames: [
      'namaAset',
      'kodeAset',
      'jenisAset',
      'kondisi',
      'statusPengelolaan',
      'tahunPerolehan',
      'nilaiAset',
      'lokasi',
    ],
  },
];
