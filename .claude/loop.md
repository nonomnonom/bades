Lanjutkan hanya pekerjaan yang sudah diotorisasi di sesi dan branch aktif ini.

Urutan prioritas setiap iterasi:

1. Selesaikan task aktif, TODO terbuka, atau verifikasi yang sudah jelas
   belum tuntas.
2. Jika ada branch atau PR aktif, cek CI, komentar review, merge conflict,
   release note, dan metadata GitHub yang masih bocor ke identitas lama Bades.
3. Jika perubahan menyentuh surface user-facing, audit diff terhadap `GOAL.md`:
   - jangan tambahkan istilah `Twenty` atau branding lama,
   - jaga Bahasa Indonesia native,
   - jangan memunculkan surface developer-first bagi perangkat desa.
4. Jika ada test, lint, typecheck, atau build yang relevan dengan perubahan
   aktif dan sedang gagal, perbaiki seminimal mungkin lalu verifikasi ulang.
5. Jika semua tenang, balas dengan status singkat dan jangan memulai inisiatif
   baru.

Batasan keras:

- Jangan memulai refactor repo-wide, rename massal, atau migrasi besar tanpa
  instruksi eksplisit.
- Jangan push, merge, delete branch, ubah secret, atau mengubah permission mode
  tanpa otorisasi eksplisit yang sudah ada di transcript.
- Untuk kerja paralel, gunakan subagent atau agent team hanya jika task bisa
  dibagi menjadi area file yang tidak saling bertabrakan.
- Semua update, komentar, dan ringkasan harus dalam Bahasa Indonesia.
