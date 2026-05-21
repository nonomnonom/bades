---
name: known-debt
description: Error TypeScript pre-existing dan debt copy di luar scope yang ditemukan saat rebrand website Bades
metadata:
  type: project
---

Error TypeScript pre-existing di `packages/website/src/lib/halftone/utils/exporters.ts` baris 150: nama fungsi `getBades.idReactHeaderComment` mengandung titik yang tidak valid sebagai identifier TypeScript. Error ini sudah ada sebelum sesi rebrand.

**Why:** Kemungkinan hasil rename otomatis yang tidak memeriksa validitas identifier. Ini bukan dari file dalam scope rebrand website.

**How to apply:** Jika menjalankan `npx nx typecheck website` dan melihat error di `exporters.ts`, abaikan sebagai debt pre-existing. Error hanya dari file itu, tidak ada error baru dari file yang disentuh dalam scope rebrand.

Debt copy di luar scope yang ditemukan (tidak disentuh, perlu dimasukkan ke backlog):
- `packages/website/src/sections/Faq` — kemungkinan masih berisi FAQ berbahasa Inggris (tidak dicek, di luar scope)
- `packages/website/src/content/site/` — data `testimonials.data.ts` (home) berisi copy yang belum diperiksa
- `packages/website/src/app/[locale]/product/three-cards.data.ts` — tidak masuk scope tapi ada di folder product
