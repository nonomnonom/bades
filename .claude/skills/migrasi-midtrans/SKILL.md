---
name: migrasi-midtrans
description: Use when migrating Bades billing, checkout, payment notifications, or Stripe-based payment flows to Midtrans, or when auditing Stripe references that should become Midtrans-first.
---

# Migrasi Midtrans

Gunakan skill ini saat pekerjaan menyentuh billing, checkout, payment gateway,
notifikasi pembayaran, atau cleanup referensi Stripe di Bades.

## Arah default Bades

- Untuk Bades, anggap **Midtrans** sebagai arah pembayaran utama.
- Default pilihan integrasi adalah **Snap**, karena satu integrasi dapat
  membuka banyak metode pembayaran lokal dalam satu checkout surface.
- Gunakan **Core API** hanya jika task memang butuh kontrol UI/flow yang lebih
  rendah dari Snap.

## Fakta penting dari docs Midtrans

- Ambil **Client Key** dan **Server Key** dari MAP di `Settings > Access Keys`.
- `Client Key` dipakai untuk kebutuhan client-side, sedangkan `Server Key`
  dipakai untuk API call server-side dan verifikasi transaksi.
- Midtrans mendukung **HTTP notification** untuk update status transaksi ke
  backend merchant.
- Verifikasi notifikasi wajib dilakukan. Menurut docs Midtrans, `signature_key`
  dihitung dari `SHA512(order_id + status_code + gross_amount + ServerKey)`.
- Alternatif verifikasi adalah **GET Status API** atau helper resmi Midtrans.
- Notification URL harus bisa menerima request langsung, tidak boleh memakai IP
  address, dan sebaiknya tidak memakai port aneh.

## Checklist migrasi dari Stripe

1. Audit surface Stripe yang disentuh task:
   - env var,
   - route checkout/portal/status,
   - DTO / schema / field name,
   - settings billing,
   - docs, email, release note, dan copy UI.
2. Tentukan mana yang:
   - diganti ke Midtrans sekarang,
   - dipertahankan sementara sebagai compatibility layer internal,
   - atau dihapus dari surface publik.
3. Untuk flow baru, prioritaskan:
   - transaksi `IDR`,
   - metode bayar lokal Indonesia,
   - notifikasi server-to-server Midtrans,
   - bahasa UI Indonesia.
4. Jangan percaya callback frontend mentah; verifikasi status transaksi ke
   Midtrans sebelum mengambil aksi finansial.
5. Jika ada istilah seperti `stripeCustomerId` atau `stripePriceId`, jangan
   rename brutal tanpa rencana migrasi data; isolasikan dulu sebagai debt bila
   perlu.

## Output yang diharapkan

- perubahan code atau audit yang jelas menuju Midtrans-first,
- daftar referensi Stripe yang masih tersisa,
- tradeoff kompatibilitas yang belum bisa dibersihkan sekarang,
- verifikasi flow Midtrans yang relevan dengan task.

## Referensi docs

- `https://docs.midtrans.com/llms.txt`
- `https://docs.midtrans.com/docs/snap-preparation`
- `https://docs.midtrans.com/docs/snap`
- `https://docs.midtrans.com/docs/https-notification-webhooks`
- `https://docs.midtrans.com/docs/whats-the-difference-between-server-key-and-client-key-how-do-i-access-them`
