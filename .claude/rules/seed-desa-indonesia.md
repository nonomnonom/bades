---
paths:
  - "packages/server/src/**/seed*/**"
  - "packages/server/src/**/seeder/**"
  - "packages/server/src/**/dev-seeder/**"
  - "packages/**/*.stories.ts"
  - "packages/**/*.stories.tsx"
  - "packages/**/__fixtures__/**"
  - "packages/**/fixtures/**"
  - "packages/website/**"
  - "packages/docs/**"
---

# Seed Desa Indonesia

Gunakan rule ini untuk seed, fixture, story, demo record, dan sample data.

## Prinsip Data Contoh

- Semua contoh data harus terasa seperti lingkungan administrasi desa
  Indonesia.
- Jangan pakai kembali sample CRM generik, nama perusahaan acak, pipeline
  sales, atau placeholder SaaS bawaan upstream.

## Bentuk Contoh Yang Diutamakan

- Warga, keluarga, wilayah, dusun, RT/RW, surat, program bantuan, aset desa,
  kelembagaan, dan kegiatan administratif.
- Nama orang, nama lembaga, nama wilayah, dan institusi contoh harus terasa
  natural untuk Indonesia.

## Aturan Praktis

- Storybook, fixture, dan seed harus ikut menjaga identitas Bades, bukan hanya
  runtime app utama.
- Jika contoh lama masih berbahasa Inggris atau terasa seperti CRM, perlakukan
  itu sebagai debt yang perlu dibersihkan saat area tersebut disentuh.
