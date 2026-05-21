---
paths:
  - "packages/front/src/modules/ai/**"
  - "packages/front/src/pages/settings/ai/**"
  - "packages/front/src/modules/app/components/SettingsRoutes.tsx"
  - "packages/front/src/modules/command-menu-item/engine-command/**"
  - "packages/server/src/engine/metadata-modules/ai/**"
  - "packages/server/src/engine/workspace-manager/twenty-standard-application/utils/agent-metadata/**"
---

# AI Single Model

Gunakan rule ini saat menyentuh surface AI, agent, settings AI, atau routing
model di Bades.

## Prinsip Dasar

- Pengalaman AI user-facing harus terasa seperti **satu kapabilitas tunggal**,
  bukan katalog model.
- Model operasional utama diarahkan ke `tencent/hy3-preview` via OpenRouter.
- User akhir tidak perlu melihat pemilih model, daftar model, label provider,
  atau pembandingan model.
- Jika routing, fallback, atau preference model masih ada di backend, itu adalah
  detail internal tim Bades, bukan bagian dari UX utama.

## Akses dan Surface

- Jangan tampilkan dropdown model di chat, agent, atau settings user-facing.
- Jangan tampilkan perbandingan model, provider name, family label, atau mode
  pemilihan model kepada user akhir.
- Jika ada halaman settings AI atau admin AI yang masih menampilkan beberapa
  model, perlakukan itu sebagai debt migrasi menuju single-model surface.

## Workflow Claude

- Saat file yang disentuh berkaitan dengan AI model selection, prioritaskan
  penghapusan choice UI sebelum copy polish.
- Jika perubahan menyentuh agent metadata, chat request, atau AI settings,
  pastikan request default memakai satu model operasional yang konsisten.
- Jika ada sisa multi-model warisan Twenty, anggap sebagai debt dan ratakan
  sampai surface user tidak lagi melihat pilihan model.
