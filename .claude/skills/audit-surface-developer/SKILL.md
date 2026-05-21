---
name: audit-surface-developer
description: Use when reviewing whether Bades still exposes developer-centric features such as API keys, webhooks, playgrounds, SDK surfaces, or technical workflows to non-technical village users.
---

Audit apakah sebuah area produk masih terlalu teknis untuk pengguna utama
Bades.

## Fokus audit

- Menu, settings, onboarding, docs pengguna, dan halaman yang terlihat user.
- Fitur atau copy yang mengasumsikan user paham token, endpoint, credential,
  schema, webhook, query, SDK, atau deployment.

## Langkah kerja

1. Identifikasi surface yang disentuh perubahan.
2. Nilai apakah surface itu membantu pekerjaan administratif desa atau justru
   mendorong workflow developer.
3. Tandai mana yang harus:
   - tetap public tetapi harus disederhanakan,
   - dipindah ke area admin terkontrol,
   - dipindah ke internal tim Bades,
   - disembunyikan dari surface utama,
   - atau diubah bahasanya agar non-teknis.

## Output yang diharapkan

- Ringkasan risiko produk non-teknis.
- Daftar surface yang masih developer-centric.
- Rekomendasi lapisan akses yang benar: public, admin, atau internal.
- Rekomendasi pembersihan paling prioritas.
