Lanjutkan transformasi Bades secara **otonom** pada sesi dan branch aktif ini.

Jangan menunggu user memecah task. Jika tidak ada task aktif yang eksplisit,
**pilih sendiri** task berikutnya dari `GOAL.md`, `CLAUDE.md`, diff branch, CI,
TODO terdekat, dan area produk yang paling jelas nilainya.

## Arah utama

Fokus aktif Bades saat ini adalah:

1. `engine`
2. `server worker`
3. `front aplikasi platform`

`website` dan `docs` **bukan stream pengembangan aktif**. Sentuh area itu
hanya jika perlu:
- menghapus surface lama,
- mengarsipkan/mematikan bagian yang tidak lagi jadi fokus,
- atau memutus kebocoran branding/arah produk yang menghambat area inti.

## Pola kerja setiap iterasi

1. Cek dulu apakah ada pekerjaan setengah jalan di transcript, diff, test
   gagal, review comment, atau CI merah. Jika ada, lanjutkan itu sampai tuntas.
2. Jika tidak ada task aktif yang jelas, **buat sendiri task kerja internal**
   yang kecil tapi bernilai, lalu langsung eksekusi. Jangan minta user
   menuliskan subtasks untukmu.
3. Ambil **satu slice yang bisa diverifikasi** per iterasi:
   - satu bug,
   - satu refactor terarah,
   - satu cleanup surface,
   - satu migrasi kecil,
   - atau satu gap verifikasi yang nyata.
4. Implementasikan end-to-end pada slice itu:
   - baca konteks file yang relevan,
   - ubah kode,
   - sesuaikan test/fixture/copy/config bila perlu,
   - jalankan verifikasi yang relevan,
   - rapikan hasil.
5. Setelah slice itu selesai, jangan berhenti. Pilih slice berikutnya yang
   masih paling bernilai dan lanjutkan.

## Prioritas pemilihan task

Urutkan pilihan kerja seperti ini:

1. pekerjaan aktif yang belum selesai
2. test/lint/typecheck/build yang merah akibat perubahan aktif
3. kebocoran arah produk terhadap `GOAL.md` pada `engine`, `server worker`,
   atau `front`
4. surface developer-first yang masih bocor ke user-facing product
5. billing Midtrans-first pada area aplikasi inti
6. seed/demo/sample data yang masih warisan lama
7. baru setelah itu cleanup repo metadata, website, atau docs bila memang
   masih relevan

## Aturan otonomi

- Jangan berhenti hanya untuk bertanya "lanjut?" atau "mau saya kerjakan apa?".
- Ambil asumsi paling masuk akal dan lanjutkan.
- Jika ada beberapa opsi teknis yang masuk akal, pilih yang:
  - paling kecil blast radius-nya,
  - paling mudah diverifikasi,
  - paling selaras dengan `GOAL.md`.
- Jika buntu pada satu jalur, debug sendiri. Jika tetap buntu, pindah ke task
  bernilai lain yang tidak terblokir.
- Tanyakan ke user **hanya** jika:
  - butuh secret/credential yang tidak ada,
  - harus melakukan aksi destruktif/irreversible,
  - ada konflik requirement yang benar-benar mengubah arsitektur,
  - atau perubahan menyentuh data/infra produksi nyata.

## Aturan kualitas

- Semua update, komentar, dan ringkasan dalam **Bahasa Indonesia**.
- Jangan bocorkan branding `Twenty` atau istilah CRM generik ke surface baru.
- Jangan membuat surface makin developer-first untuk perangkat desa.
- Jangan memperluas task kecil menjadi migrasi repo-wide tanpa alasan kuat.
- Untuk refactor besar, pecah menjadi langkah kecil yang bisa diverifikasi satu
  per satu.

## Aturan verifikasi

- Setiap iterasi harus mengusahakan bukti selesai, bukan hanya klaim selesai.
- Jalankan verifikasi yang paling relevan dan paling sempit lebih dulu:
  - test file/folder yang disentuh,
  - lint diff atau project terkait,
  - typecheck package terkait,
  - build bila perubahan memang membutuhkannya.
- Jika ada kegagalan, perbaiki dulu sebelum mengklaim selesai.
- Jika ada kegagalan lama yang tidak terkait, pisahkan dengan jelas mana yang
  berasal dari perubahan aktif dan mana yang pre-existing.

## Definisi selesai per iterasi

Sebuah iterasi dianggap selesai hanya jika:

1. ada perubahan nyata atau keputusan teknis yang dibuktikan,
2. verifikasi relevan sudah dijalankan atau blocker-nya konkret,
3. tidak ada next step obvious pada slice yang sama yang sengaja ditinggal.

## Kapan berhenti

Jika berjalan lewat `/loop`, teruskan pekerjaan otonom selama masih ada task
bernilai yang bisa diambil dari area fokus. Berhenti sendiri hanya jika:

- target goal yang aktif sudah terbukti tercapai, atau
- tidak ada lagi pekerjaan bermakna yang bisa dikerjakan tanpa input user.

Saat memberi status, ringkas saja:
- apa yang baru dikerjakan,
- apa hasil verifikasinya,
- apa task berikutnya yang langsung akan diambil.
