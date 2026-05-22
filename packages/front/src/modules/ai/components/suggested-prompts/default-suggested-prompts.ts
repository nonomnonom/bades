import type { MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import {
  type IconComponent,
  IconLayoutDashboard,
  IconPlus,
  IconSettingsAutomation,
} from 'ui/display';

export type SuggestedPrompt = {
  id: string;
  label: MessageDescriptor;
  Icon: IconComponent;
  prefillPrompts: MessageDescriptor[];
};

export const DEFAULT_SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    id: 'dashboard',
    label: msg`Buat dasbor`,
    Icon: IconLayoutDashboard,
    prefillPrompts: [
      msg`Buat dasbor dengan grafik permohonan layanan berdasarkan tahapan (Menunggu, Diproses, Selesai, Ditolak) untuk bulan ini, dan tabel 10 permohonan terbuka terbaru dengan nama pemohon, jenis layanan, dan tanggal penyelesaian yang diharapkan.`,
      msg`Buat dasbor yang menampilkan: (1) total permohonan layanan per tahapan selama 3 bulan terakhir, (2) jumlah layanan selesai vs ditolak per bulan, (3) rata-rata waktu pemrosesan. Gunakan tahapan layanan standar kami.`,
      msg`Saya butuh dasbor layanan warga: jumlah permohonan baru per jenis bulan ini, berapa yang sudah diproses, dan tingkat penyelesaian per jenis. Sertakan tabel sederhana dan diagram batang.`,
    ],
  },
  {
    id: 'workflow',
    label: msg`Buat alur kerja`,
    Icon: IconSettingsAutomation,
    prefillPrompts: [
      msg`Ketika tahapan permohonan layanan berubah menjadi Selesai, buat tugas yang ditugaskan kepada petugas yang menangani permohonan tersebut, jatuh tempo 7 hari setelah tanggal penyelesaian, dengan judul "Tindak lanjut kepuasan" dan nama warga di deskripsi.`,
      msg`Ketika permohonan layanan baru dibuat dengan jenis "Surat Keterangan Domisili", tugaskan ke petugas desa yang sektornya sesuai dengan RT warga; jika tidak ada yang cocok, tugaskan ke sekretaris desa.`,
      msg`Ketika permohonan layanan dengan prioritas "Mendesak" diperbarui tahapan atau prioritasnya, kirim notifikasi ke saluran admin dengan nama permohonan, nama warga, tahapan baru, prioritas, dan petugas.`,
    ],
  },
  {
    id: 'record',
    label: msg`Buat data`,
    Icon: IconPlus,
    prefillPrompts: [
      msg`Tambahkan warga baru yang sedang kami proses dokumennya (contoh: nama, NIK, alamat). Detail: `,
      msg`Buat permohonan layanan baru dan hubungkan ke data warga. Detail: `,
      msg`Catat permohonan layanan baru (nama warga, jenis layanan, status, perkiraan tanggal selesai). Detail: `,
    ],
  },
];
