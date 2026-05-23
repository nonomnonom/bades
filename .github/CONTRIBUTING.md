# Kontribusi Internal Bades

Repositori ini adalah repo privat tim Bades. Tidak ada alur kontribusi
open-source, tidak ada fork-and-PR dari publik, dan tidak ada CLA.

Jika Anda anggota tim Bades, ikuti panduan internal berikut. Jika Anda
mendapatkan akses ke repo ini di luar tim, hubungi tim Bades terlebih dahulu
sebelum melakukan perubahan apa pun.

## Alur kerja internal

1. Buat branch baru dari `main` dengan nama yang deskriptif.
2. Lakukan perubahan sesuai arah produk di `GOAL.md` dan rule di
   `.claude/rules/`.
3. Jalankan lint, typecheck, dan test relevan secara lokal sebelum push.
4. Buka pull request ke `main`. Sertakan ringkasan singkat tentang dampak ke
   pengguna desa atau ke surface internal yang disentuh.
5. Tunggu review dari pemilik area terkait sebelum merge.

## Standar perubahan

- Bahasa pengalaman produk dan dokumentasi pengguna adalah Bahasa Indonesia
  native, bukan terjemahan setengah jadi.
- Bades adalah produk SaaS swasta terkelola untuk konteks desa Indonesia,
  bukan distribusi self-hosting komunitas. Surface publik harus mencerminkan
  itu.
- Identifier teknis legacy boleh tetap ada di kode internal jika mengubahnya
  berisiko, tetapi jangan biarkan bocor ke teks user-facing, email, judul,
  atau help text.

## Pelaporan masalah

- Bug fungsional dan permintaan fitur dicatat lewat tracker internal tim,
  bukan lewat issue publik di GitHub.
- Untuk kerentanan keamanan, ikuti `SECURITY.md`.
