---
paths:
  - ".github/**"
  - "packages/website/**"
  - "packages/docs/**"
  - "package.json"
  - "README.md"
  - "docs/**"
---

# Docs And Website Cleanup

Gunakan rule ini saat menyentuh website, docs, release notes, README, dan
konten publik yang masih tersisa.

## Default Sikap

- `website` dan `docs` bukan stream pengembangan aktif Bades.
- Arah default pada area ini adalah **hapus, arsipkan, matikan, atau bersihkan**,
  bukan memperkaya surface publik lama.
- Jika sebuah perubahan di area ini tidak membantu penghapusan surface lama,
  pemutusan branding lama, atau pengalihan fokus ke aplikasi inti, pertanyakan
  dulu apakah perubahan itu perlu dilakukan.

## Narasi Publik

- Ceritakan Bades sebagai produk yang berdiri sendiri untuk administrasi desa
  Indonesia.
- Posisikan Bades sebagai layanan SaaS swasta yang terkelola, bukan produk
  self-hosting-first atau distribusi komunitas yang berpusat pada instalasi
  mandiri.
- Asal-usul teknis dari Twenty boleh disebut hanya jika konteksnya memang
  migrasi, provenance, atau kompatibilitas upstream.
- Karena repo ini private, jangan pertahankan cerita sejarah awal Bades/Twenty
  sebagai narasi utama pada README, docs utama, release note, atau metadata
  publik.
- Jangan menulis narasi yang membuat pembaca merasa ini hanya "Twenty versi
  rename".
- Jangan jadikan setup infra, deployment manual, atau workflow engineer sebagai
  jalur utama yang ditonjolkan pada surface publik repo, website, atau docs.
- Jika halaman atau konten publik tidak lagi dibutuhkan, lebih baik dihapus
  atau diarsipkan daripada dirombak menjadi surface marketing baru.

## Bahasa dan Terminologi

- Pakai Bahasa Indonesia native untuk konten yang memang ditujukan ke pengguna
  Indonesia.
- Hindari istilah CRM dan developer-platform sebagai headline utama,
  value proposition, atau contoh workflow.

## Asset dan Contoh

- Screenshot, contoh data, release copy, dan demo story harus konsisten dengan
  identitas Bades.
- Kalau ada contoh lama yang masih terasa seperti SaaS/CRM generik, anggap itu
  backlog pembersihan, bukan referensi yang dipertahankan.
- Saat menghapus surface docs/website, pastikan link, metadata, nav, dan asset
  yang menunjuk ke sana ikut dirapikan agar tidak meninggalkan jejak rusak.
