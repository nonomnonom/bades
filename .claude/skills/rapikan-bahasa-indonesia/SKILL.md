---
name: rapikan-bahasa-indonesia
description: Use when cleaning up mixed-language wording, half-translated copy, English-heavy test names, fixtures, or business terms so Bades reads as native Bahasa Indonesia.
---

Gunakan skill ini untuk cleanup bahasa yang masih campur atau terasa terjemahan
mentah.

## Fokus cleanup

- Label, helper text, toast, modal, onboarding, email, docs, dan empty state
  yang masih campur Indonesia-Inggris.
- Nama test, fixture, story, seed, komentar, dan istilah domain bisnis yang
  masih terlalu English padahal tidak wajib.

## Langkah kerja

1. Tandai kata, kalimat, atau istilah yang terasa tidak natural.
2. Ganti dengan Bahasa Indonesia yang lebih wajar untuk konteks administrasi
   desa.
3. Pertahankan English hanya untuk:
   - keyword bahasa pemrograman,
   - API framework/library,
   - kontrak teknis eksternal,
   - identifier legacy yang belum aman diganti.
4. Cek konsistensi istilah setelah edit.

## Prinsip bahasa

- Pilih istilah yang dipahami operator desa, bukan istilah startup generik.
- Hindari terjemahan harfiah kalau hasilnya terasa asing.
- Kalau ada beberapa padanan, pilih yang paling jelas dan paling mudah dipakai
  lintas layar.
