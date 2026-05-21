# Non Technical Product

Gunakan rule ini untuk fitur, navigasi, onboarding, settings, docs pengguna,
dan keputusan product-facing lain.

## Prinsip Utama

- Pengguna utama Bades adalah perangkat desa dan operator administratif
  non-teknis.
- Produk akhir harus terasa seperti alat kerja administrasi desa, bukan
  platform developer.
- Produk boleh tetap punya karakter SaaS modern, tetapi tidak boleh terasa
  seperti engineering platform untuk end user.

## Guardrail Produk

- Hindari mempromosikan API key, webhook, SDK exposure, app platform,
  playground, query language, atau konsep engineering lain sebagai pengalaman
  produk utama.
- Jika sistem aplikasi atau extensibility masih dipertahankan, posisikan itu
  sebagai kapabilitas internal tim Bades, bukan workflow self-service untuk
  pengguna akhir.
- Jangan mendorong asumsi self-hosting, setup infra manual, atau workflow
  deployment teknis sebagai jalur utama pengguna.
- Kalau fitur teknis masih ada di engine, utamakan sembunyikan, pisahkan,
  atau turunkan prioritasnya dari surface utama pengguna.
- Navigasi, onboarding, dan settings harus memandu tugas administratif, bukan
  integrasi teknis manual.

## Cara Menilai Keputusan

- Jika sebuah menu atau flow mengasumsikan user paham credential, endpoint,
  schema, token, atau deployment, perlakukan itu sebagai debt produk utama.
- Jika sebuah docs page, onboarding flow, atau repo surface mengarahkan user ke
  self-hosting atau operasi infra sebagai asumsi utama, perlakukan itu sebagai
  drift dari arah produk Bades.
- Jika sebuah flow memosisikan app system sebagai fitur yang bisa dirakit
  sendiri oleh perangkat desa, perlakukan itu sebagai drift dari arah produk
  Bades.
- Saat memilih istilah, layout, atau prioritas halaman, dahulukan pekerjaan
  administrasi desa: data warga, layanan surat, program bantuan, keuangan, dan
  kelembagaan desa.
