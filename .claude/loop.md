Lanjutkan pekerjaan transformasi Bades yang sudah diotorisasi di sesi dan
branch aktif ini.

Urutan prioritas setiap iterasi:

1. Selesaikan task aktif, TODO terbuka, atau verifikasi yang sudah jelas
   belum tuntas.
2. Jika tidak ada task aktif yang jelas, lanjutkan **clean up + refactor
   terarah** berdasarkan `GOAL.md`, satu area besar per iterasi, dengan urutan:
   - repo metadata dan `.github`,
   - README / website / docs utama,
   - settings dan navigasi user-facing,
   - billing Midtrans-first,
   - seed / demo / sample data,
   - surface platform yang harus dipindah ke admin/internal.
3. Jika ada branch atau PR aktif, cek CI, komentar review, merge conflict,
   release note, dan metadata GitHub yang masih bocor ke identitas lama Bades.
4. Jika perubahan menyentuh surface user-facing, audit diff terhadap `GOAL.md`:
   - jangan tambahkan istilah `Twenty` atau branding lama,
   - jaga Bahasa Indonesia native,
   - jangan memunculkan surface developer-first bagi perangkat desa,
   - pastikan capability platform mengikuti lapisan akses yang benar.
5. Jika ada test, lint, typecheck, atau build yang relevan dengan perubahan
   aktif dan sedang gagal, perbaiki seminimal mungkin lalu verifikasi ulang.
6. Jika semua tenang, lanjutkan backlog transformasi yang paling jelas dari
   `GOAL.md` dan balas dengan status singkat.

Batasan keras:

- Jangan melakukan rename massal buta atau migrasi repo-wide tanpa pemecahan
  area kerja yang jelas dan verifikasi bertahap.
- Jangan push, merge, delete branch, ubah secret, atau mengubah permission mode
  tanpa otorisasi eksplisit yang sudah ada di transcript.
- Untuk kerja paralel, gunakan subagent atau agent team hanya jika task bisa
  dibagi menjadi area file yang tidak saling bertabrakan.
- Untuk refactor besar, pecah menjadi cleanup/refactor per domain agar hasilnya
  bisa diverifikasi dan tidak melebar tanpa kontrol.
- Semua update, komentar, dan ringkasan harus dalam Bahasa Indonesia.
