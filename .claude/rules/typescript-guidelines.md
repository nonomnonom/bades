---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# TypeScript Guidelines

## Core Principles

- Gunakan TypeScript ketat dan eksplisit.
- Jangan gunakan `any` kecuali tidak ada jalan lain yang realistis.
- Gunakan `type` sebagai default; `interface` hanya saat memang perlu extend
  interface pihak ketiga.
- Gunakan string union daripada enum jika tidak ada kebutuhan kompatibilitas
  khusus.

## Naming dan shape

- Type props component gunakan suffix `Props`.
- Generic type harus deskriptif, misalnya `TData`, `TRecord`, `TContext`.
- Ikuti `naming-conventions.md` untuk nama file dan symbol.

## Inference

- Biarkan TypeScript menginfer tipe jika sudah jelas.
- Tulis tipe eksplisit untuk public API, return type yang penting, atau logika
  yang mudah ambigu.

## Unused code policy

- Jangan tinggalkan `unused local`.
- Jangan tinggalkan `unused parameter`.
- Jika parameter wajib ada untuk signature framework tetapi tidak dipakai, beri
  prefix `_` hanya bila memang perlu.
- Jangan menambah type, import, helper, atau constant yang akhirnya tidak
  dipakai di patch akhir.

## Reusable typing

- Gunakan utility type bawaan TypeScript bila cukup.
- Simpan type dekat dengan area pemakaian jika tidak dipakai lintas file.
- Export type hanya jika memang dipakai lintas modul.
