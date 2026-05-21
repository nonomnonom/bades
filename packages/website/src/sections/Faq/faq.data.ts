import { msg } from '@lingui/core/macro';
import type { MessageDescriptor } from '@lingui/core';

export type FaqQuestionType = {
  question: MessageDescriptor;
  answer: MessageDescriptor;
};

export const FAQ_QUESTIONS: FaqQuestionType[] = [
  {
    question: msg`Apakah Bades.id benar-benar open-source?`,
    answer: msg`Ya. Bades.id adalah Sistem Informasi Desa (SID) open source di GitHub. Anda bisa self-host untuk sepenuhnya memiliki infrastruktur Anda, atau menjalankannya di cloud kami yang dikelola untuk setup zero-ops.`,
  },
  {
    question: msg`Berapa lama untuk memulai?`,
    answer: msg`Daftar Cloud dalam waktu kurang dari satu menit dan mulai percobaan 30 hari. Untuk implementasi yang lebih besar, Paket Onboarding 4 jam atau partner bersertifikasi kami membuat Anda aktif dalam 1-2 minggu.`,
  },
  {
    question: msg`Bisakah saya migrasi dari sistem administrasi desa lain?`,
    answer: msg`Ya. Impor data Anda melalui CSV, atau gunakan API kami untuk 50.000+ rekaman. Partner kami dapat menangani migrasi lengkap untuk Anda.`,
  },
  {
    question: msg`Apakah saya butuh developer untuk menyesuaikan Bades.id?`,
    answer: msg`Tidak. Bangun object kustom, kolom, tampilan, dan workflow no-code langsung dari Settings. Tanpa batas, tanpa biaya tambahan.`,
  },
  {
    question: msg`Bisakah developer memperluas Bades.id dengan kode?`,
    answer: msg`Ya, dengan framework Apps kami. Buat ekstensi dengan \`npx create-bades-app\` dan kirim object kustom, fungsi logika server-side, komponen React yang ditampilkan di UI Bades.id, skill dan agent AI, tampilan, dan navigasi, semuanya dalam TypeScript, dapat di-deploy ke desa mana pun.`,
  },
  {
    question: msg`Apakah Bades.id bekerja dengan Claude, ChatGPT, dan Cursor?`,
    answer: msg`Ya. Setiap workspace Cloud dilengkapi server MCP native. Hubungkan asisten AI Anda melalui OAuth dan ia dapat membaca dan menulis data administrasi desa Anda dalam bahasa alami.`,
  },
  {
    question: msg`Berapa harga Bades.id?`,
    answer: msg`Cloud Pro adalah Rp 90.000/user/bulan (tahunan). Organization adalah Rp 190.000/user/bulan dan membuka SSO dan row-level permissions untuk desa yang membutuhkan kontrol akses lebih detail.`,
  },
];
