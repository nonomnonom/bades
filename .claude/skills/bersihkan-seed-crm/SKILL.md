---
name: bersihkan-seed-crm
description: Use when replacing CRM-style seed data, fixtures, stories, and examples with Indonesian village-administration data that matches Bades.
---

Gunakan skill ini saat membersihkan sample data lama yang masih berbau CRM atau
SaaS generik.

## Fokus cleanup

- Seed, fixture, story, demo workspace, dan contoh record.
- Nama object, relasi contoh, placeholder record, institusi contoh, dan narasi
  yang masih mengikuti pola upstream CRM.

## Langkah kerja

1. Identifikasi contoh data yang masih terasa seperti sales atau SaaS.
2. Ganti dengan domain Bades yang relevan:
   - penduduk,
   - keluarga,
   - wilayah,
   - layanan surat,
   - bantuan,
   - kelembagaan,
   - aset,
   - kegiatan desa.
3. Pastikan nama orang, lembaga, dan wilayah terasa natural untuk Indonesia.
4. Cek apakah relasi contoh tetap masuk akal setelah diganti.

## Prinsip data contoh

- Jangan sekadar rename perusahaan jadi desa; ubah konteks record-nya juga.
- Contoh data harus membantu orang membayangkan pekerjaan administrasi desa
  nyata.
- Jika area yang disentuh belum punya model contoh yang kuat, usulkan padanan
  Bades yang paling dekat dengan fitur tersebut.
