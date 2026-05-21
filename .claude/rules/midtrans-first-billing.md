---
paths:
  - "packages/front/**/billing/**"
  - "packages/front/**/payment/**"
  - "packages/front/**/checkout/**"
  - "packages/server/**/billing/**"
  - "packages/server/**/payment/**"
  - "packages/server/**/checkout/**"
  - "packages/website/**/billing/**"
  - "packages/website/**/payment/**"
  - "packages/website/**/checkout/**"
  - "packages/website/src/app/api/enterprise/**"
  - "packages/emails/**"
  - "docs/**"
---

# Midtrans First Billing

Gunakan rule ini saat menyentuh billing, checkout, payment gateway, enterprise
billing surface, redirect pembayaran, notifikasi pembayaran, email pembayaran,
atau cleanup referensi Stripe.

## Arah Default

- Untuk Bades, anggap **Midtrans** sebagai arah pembayaran utama.
- Jika task menyentuh surface publik pembayaran, jangan menambah atau
  mempertahankan narasi **Stripe-first** tanpa alasan kompatibilitas yang
  benar-benar jelas.
- Prioritaskan asumsi merchant Indonesia, transaksi `IDR`, dan metode bayar
  lokal seperti VA, QRIS, dan e-wallet.

## Surface Yang Harus Dijaga

- Copy billing, checkout, status pembayaran, settings pembayaran, dan email
  pembayaran harus terasa Indonesia-first dan tidak terasa seperti integrasi
  SaaS luar yang belum dimigrasikan.
- Env example, docs operasional, dan release note pembayaran jangan
  mengarahkan user ke Stripe sebagai jalur utama baru.
- Jika masih ada field atau identifier legacy seperti `stripeCustomerId`,
  perlakukan itu sebagai boundary internal sementara, bukan bahasa surface
  publik.

## Workflow Claude

- Saat task menyentuh area ini, gunakan skill `migrasi-midtrans`.
- Audit terlebih dulu apakah perubahan:
  - mengganti surface Stripe ke Midtrans,
  - hanya mempertahankan compatibility layer internal,
  - atau masih meninggalkan debt yang harus dicatat jelas.
- Jangan rename brutal identifier billing legacy tanpa rencana migrasi data.
