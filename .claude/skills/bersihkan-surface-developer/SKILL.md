---
name: bersihkan-surface-developer
description: Use when removing, hiding, downgrading, or rewriting developer-centric menus, settings, docs, and workflows so Bades fits non-technical village users.
---

Gunakan skill ini untuk cleanup surface produk yang terlalu teknis.

## Fokus cleanup

- API key, webhook, token, SDK exposure, app platform, playground, query
  language, atau workflow lain yang terlalu developer-centric.
- Menu, settings, onboarding, dan docs pengguna yang mendorong user masuk ke
  konsep engineering.

## Langkah kerja

1. Temukan surface yang masih mengasumsikan user paham konsep teknis.
2. Tentukan tindakan paling aman:
   - hapus dari surface utama,
   - sembunyikan,
   - pindahkan ke area teknis terpisah,
   - atau tulis ulang copy agar lebih non-teknis.
3. Cek dampaknya ke navigasi, permission, empty state, dan docs yang terkait.

## Prinsip keputusan

- Pengguna utama adalah perangkat desa non-teknis.
- Jika sebuah flow terasa lebih cocok untuk developer daripada operator desa,
  perlakukan itu sebagai debt pada produk utama.
- Saat cleanup, utamakan tugas administratif desa di atas extensibility
  platform.
