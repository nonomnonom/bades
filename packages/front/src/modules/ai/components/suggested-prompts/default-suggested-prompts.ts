import {
  type IconComponent,
  IconLayoutDashboard,
  IconPlus,
  IconSettingsAutomation,
} from 'ui/display';

export type SuggestedPrompt = {
  id: string;
  label: string;
  Icon: IconComponent;
  prefillPrompts: string[];
};

export const DEFAULT_SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    id: 'dashboard',
    label: `Buat dasbor`,
    Icon: IconLayoutDashboard,
    prefillPrompts: [
      `Buat dasbor yang menampilkan jumlah penduduk berdasarkan dusun, jenis kelamin, dan kelompok usia untuk bulan ini. Sertakan tabel ringkasan dan diagram batang.`,
      `Buat dasbor yang menampilkan: (1) total keluarga per klasifikasi ekonomi, (2) distribusi penduduk per wilayah, (3) ringkasan demografi. Gunakan data penduduk dan keluarga standar kami.`,
      `Saya butuh dasbor aset desa: jumlah aset per jenis, kondisi aset (Baik/Rusak), dan status pengelolaan. Sertakan tabel sederhana dan diagram batang.`,
    ],
  },
  {
    id: 'workflow',
    label: `Buat alur kerja`,
    Icon: IconSettingsAutomation,
    prefillPrompts: [
      `Ketika penduduk baru ditambahkan ke database, buat otomatis catatan selamat datang dan kirim notifikasi ke perangkat desa.`,
      `Ketika data keluarga baru ditambahkan, buat tugas verifikasi alamat dan jumlah anggota yang ditugaskan ke perangkat desa terkait.`,
      `Ketika aset desa berubah status pengelolaan dari AKTIF menjadi RUSAK, kirim notifikasi ke sekretaris desa dengan nama aset, kondisi, dan penanggung jawab.`,
    ],
  },
  {
    id: 'record',
    label: `Buat data`,
    Icon: IconPlus,
    prefillPrompts: [
      `Tambahkan warga baru yang sedang kami proses dokumennya (contoh: nama, NIK, alamat). Detail: `,
      `Catat data penduduk baru (NIK, nama, tanggal lahir, alamat). Detail: `,
      `Catat aset desa baru (nama, jenis, kondisi, lokasi). Detail: `,
    ],
  },
];
