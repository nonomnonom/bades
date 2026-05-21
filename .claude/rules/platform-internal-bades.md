---
paths:
  - "packages/front/src/modules/app/components/SettingsRoutes.tsx"
  - "packages/front/src/pages/settings/applications/**"
  - "packages/front/src/pages/settings/application-registrations/**"
  - "packages/front/src/pages/settings/developers/**"
  - "packages/front/src/pages/settings/lab/**"
  - "packages/front/src/pages/settings/logic-functions/**"
  - "packages/front/src/pages/settings/playground/**"
  - "packages/front/src/pages/settings/admin-panel/**"
  - "packages/front/src/modules/marketplace/**"
  - "packages/front/src/modules/applications/**"
  - "packages/front/src/modules/logic-functions/**"
  - "packages/server/src/engine/core-modules/application/**"
  - "packages/server/src/engine/core-modules/api-key/**"
  - "packages/server/src/engine/core-modules/app-token/**"
  - "packages/server/src/engine/core-modules/open-api/**"
  - "packages/server/src/engine/core-modules/logic-function/**"
  - "packages/server/src/engine/core-modules/tool/**"
  - "packages/server/src/engine/core-modules/tool-provider/**"
  - "packages/server/src/engine/core-modules/billing-webhook/**"
  - "packages/server/src/engine/metadata-modules/webhook/**"
  - "packages/docs/developers/extend/**"
  - "packages/docs/developers/self-host/**"
  - "packages/docs/user-guide/workflows/how-tos/connect-to-other-tools/**"
---

# Platform Internal Bades

Gunakan rule ini saat menyentuh surface aplikasi/platform, extensibility, API,
webhook, marketplace, logic functions, playground, atau capability sejenis.

## Prinsip Dasar

- Capability engine boleh tetap hidup, tetapi jangan otomatis dibiarkan tetap
  public.
- Setiap perubahan pada area ini harus menilai **siapa audience yang benar**:
  operator desa, admin terkontrol, atau internal tim Bades.
- Default arah Bades: capability platform yang terlalu teknis harus dipindah ke
  lapisan yang lebih dalam, bukan dipoles tipis lalu tetap diekspos ke semua
  user.

## Matriks Akses

- **Operator desa / public surface**
  - Jangan tampilkan: application registry, marketplace publishing, raw API
    docs, playground, logic-function builder, atau konsep developer lain.
- **Admin terkontrol**
  - Boleh ada hanya jika benar-benar dibutuhkan operasional:
    akses integrasi, event integrasi, AI otomasi terbatas, billing operasional,
    dan konfigurasi yang masih bisa dipahami admin non-engineer.
- **Internal tim Bades**
  - Tempat yang tepat untuk: app system, publishing flow, application
    registration, release/update tooling, marketplace backend, playground,
    logic-function framework, dan extensibility engine yang dalam.

## Keputusan Produk

- Jika menemukan `Applications`, `Application Registrations`, `Marketplace`,
  `Playground`, `API & Webhooks`, `Lab`, atau surface serupa, jangan asumsikan
  semuanya tetap ada di settings utama.
- Nilai tiap capability dengan tiga opsi:
  - sederhanakan untuk admin,
  - pindahkan ke internal-only,
  - atau sembunyikan dari surface utama sampai arsitektur barunya siap.
- Jangan memosisikan app system sebagai marketplace terbuka atau builder bebas
  untuk pengguna akhir.
- Jangan memosisikan API key dan webhook sebagai pengalaman developer portal
  generik; arahkan ke use case integrasi yang terkontrol.

## Workflow Claude

- Saat mengubah area ini, prioritaskan **boundary cleanup** dan **access-layer
  refactor** sebelum copy polish.
- Jika rename teknis berisiko, dahulukan:
  - pemindahan navigasi,
  - penyederhanaan entry point,
  - perubahan label/audience,
  - dan isolasi capability ke admin/internal area.
- Catat debt jika capability internal masih harus hidup, tetapi jangan biarkan
  surface user akhir tetap terasa seperti platform engineer.
