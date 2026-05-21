import { msg } from '@lingui/core/macro';

import type { FeatureTileType } from '@/sections/Feature';
import { ContactsVisual } from '@/sections/Feature/visuals/ContactsVisual';
import { DashboardVisual } from '@/sections/Feature/visuals/DashboardVisual';
import { EmailsVisual } from '@/sections/Feature/visuals/EmailsVisual';
import { FilesVisual } from '@/sections/Feature/visuals/FilesVisual';
import { ImportVisual } from '@/sections/Feature/visuals/ImportVisual';
import { PipelineVisual } from '@/sections/Feature/visuals/PipelineVisual';
import { TasksVisual } from '@/sections/Feature/visuals/TasksVisual';

export const FEATURE_TILES: FeatureTileType[] = [
  {
    category: msg`Laporan & Dasbor`,
    heading: msg`Metrik yang benar-benar bisa dipercaya.`,
    description: msg`Buat dasbor khusus dari data desa yang langsung diperbarui. Agregasikan apa saja — warga, layanan, aktivitas — menjadi grafik yang mudah dibaca oleh petugas desa.`,
    visual: DashboardVisual,
    bullets: [
      {
        icon: 'check',
        text: msg`Widget agregat, batang, garis, pie, dan pengukur`,
      },
      { icon: 'search', text: msg`Metrik tersaring dari objek data apa pun` },
      { icon: 'check', text: msg`Data diperbarui secara langsung` },
    ],
  },
  {
    category: msg`Agenda & Aktivitas`,
    heading: msg`Konteks tersimpan bersama datanya.`,
    description: msg`Buat agenda, tetapkan penanggungjawab, dan lampirkan catatan langsung dari rekaman data mana pun. Tanpa berpindah tab, tanpa konteks yang hilang.`,
    visual: TasksVisual,
    bullets: [
      { icon: 'check', text: msg`Buat agenda dari rekaman data` },
      { icon: 'users', text: msg`Tetapkan penanggungjawab dan batas waktu` },
      { icon: 'edit', text: msg`Catatan lengkap terlampir pada rekaman` },
    ],
  },
  {
    category: msg`Email & Kalender`,
    heading: msg`Setiap percakapan tersimpan di tempat yang tepat.`,
    description: msg`Hubungkan akun Google atau Microsoft dan lihat email serta jadwal yang otomatis tertaut ke rekaman warga desa.`,
    visual: EmailsVisual,
    bullets: [
      { icon: 'check', text: msg`Hubungkan akun Google atau Microsoft` },
      {
        icon: 'search',
        text: msg`Email dan jadwal tertaut ke rekaman warga`,
      },
      { icon: 'book', text: msg`Riwayat komunikasi lengkap dalam satu tempat` },
    ],
  },
  {
    category: msg`Warga & Keluarga`,
    heading: msg`Jaringan data warga terpetakan lengkap.`,
    description: msg`Field khusus, relasi antardata, dan lini waktu terpadu untuk setiap warga dan keluarga di desa Anda.`,
    visual: ContactsVisual,
    bullets: [
      { icon: 'edit', text: msg`Field dan relasi data yang dapat dikustomisasi` },
      {
        icon: 'book',
        text: msg`Lini waktu terpadu (email, jadwal, agenda, catatan, berkas)`,
      },
      {
        icon: 'search',
        text: msg`Aktivitas komunikasi pada setiap rekaman warga`,
      },
    ],
  },
  {
    category: msg`Alur Permohonan Layanan`,
    heading: msg`Permohonan yang bergerak sendiri.`,
    description: msg`Tahapan layanan yang dapat dikustomisasi, papan seret-dan-lepas, serta pelacakan langsung agar alur permohonan mencerminkan kondisi nyata di desa.`,
    visual: PipelineVisual,
    bullets: [
      { icon: 'edit', text: msg`Tahapan layanan sesuai proses desa Anda` },
      { icon: 'check', text: msg`Seret permohonan antar tahapan layanan` },
      { icon: 'tag', text: msg`Lacak tanggal pengajuan dan penyelesaian` },
    ],
  },
  {
    category: msg`Berkas & Lampiran`,
    heading: msg`Lampiran tanpa kekacauan.`,
    description: msg`Unggah, ganti nama, pratinjau, dan kelola berkas langsung pada rekaman data. Setiap dokumen tersimpan di tempat yang seharusnya.`,
    visual: FilesVisual,
    bullets: [
      { icon: 'check', text: msg`Unggah banyak berkas pada satu rekaman` },
      { icon: 'edit', text: msg`Ganti nama, unduh, dan hapus lampiran` },
      {
        icon: 'eye',
        text: msg`Pratinjau langsung untuk jenis berkas yang didukung`,
      },
    ],
  },
  {
    category: msg`Impor Data`,
    heading: msg`Dari CSV ke Data Desa dalam hitungan menit.`,
    description: msg`Impor data dengan pemetaan field, termasuk relasi antardata. Ekspor kapan saja — data Anda selalu milik Anda.`,
    visual: ImportVisual,
    bullets: [
      { icon: 'check', text: msg`Alur impor data CSV` },
      {
        icon: 'code',
        text: msg`Pemetaan kolom ke field (termasuk relasi)`,
      },
      { icon: 'check', text: msg`Ekspor CSV kapan saja` },
    ],
  },
];
