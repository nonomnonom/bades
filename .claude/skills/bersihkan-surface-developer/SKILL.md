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
   - sederhanakan untuk public/admin,
   - pindahkan ke admin-only,
   - pindahkan ke internal-team-only,
   - sembunyikan dari surface utama,
   - atau tulis ulang copy agar lebih non-teknis.
3. Cek dampaknya ke navigasi, permission, empty state, dan docs yang terkait.

## Prinsip keputusan

- Pengguna utama adalah perangkat desa non-teknis.
- Jika sebuah flow terasa lebih cocok untuk developer daripada operator desa,
  perlakukan itu sebagai debt pada produk utama.
- Tidak semua capability teknis harus dihapus; sebagian bisa tetap hidup bila
  dipetakan ulang ke lapisan admin terkontrol atau internal tim Bades.
- Saat cleanup, utamakan tugas administratif desa di atas extensibility
  platform.
