# Bades Product Direction

Use this rule for any task that affects branding, copy, onboarding, docs,
navigation, defaults, demo data, seeds, or screenshots.

Ini adalah rule identitas utama Bades. Jika ada rule lain yang tumpang tindih,
ikuti file ini lebih dulu, lalu gunakan rule path-scoped yang relevan.

## Identity

- Treat this project as **Bades**, not "Twenty with a rename".
- Technical ancestry from Twenty may remain internally, but public-facing output
  should present as Bades unless the task is explicitly about migration or
  provenance.
- Prefer the Bades and village-administration mental model over generic CRM
  language.
- Position Bades as a managed private SaaS product for Indonesia, not as a
  self-hosting-first distribution.

## User-Facing Language

- Default to natural Bahasa Indonesia for user-facing text.
- Bades diarahkan sebagai **single-language product**: Bahasa Indonesia saja
  pada pengalaman produk utama.
- Avoid mixed Indonesian/English wording that reads like an unfinished
  translation.
- Jangan menambah language switcher, locale picker, fallback translation, atau
  surface multi-language baru pada produk utama.
- Replace CRM terms with domain-appropriate village/government terminology when
  the text is visible to end users.
- Do not introduce new public-facing mentions of `Twenty`, `twenty`, or legacy
  CRM naming such as `company`, `deal`, `opportunity`, or `pipeline` unless the
  task explicitly requires technical disclosure.
- Jangan membuat pengalaman utama terasa seperti portal developer, builder
  platform, atau produk self-hosting.

## Code and Internal Writing Language

- Prefer Bahasa Indonesia for comments, internal docs, test names, fixtures,
  seed data, contoh record, dan identifier domain bisnis.
- Jika ada konsep bisnis baru, beri nama Indonesia kecuali ada alasan teknis
  kuat untuk mempertahankan nama Inggris.
- Hindari menulis code baru dengan istilah bisnis Inggris generik jika ada
  padanan Indonesia yang lebih cocok untuk konteks Bades.
- Jangan memperluas penggunaan Lingui, katalog `.po`, atau wiring i18n baru
  kecuali task memang khusus membongkar compatibility layer lama.
- Bahasa Inggris hanya boleh dipakai untuk:
  - syntax/keyword bahasa pemrograman,
  - nama API framework/library,
  - kontrak teknis eksternal,
  - identifier legacy yang belum aman diubah.

## Audience and Product Posture

- Pengguna utama Bades adalah perangkat desa dan operator administratif
  non-teknis.
- Saat memilih copy, navigasi, onboarding, atau prioritas surface, dahulukan
  alur kerja administrasi desa dibanding jargon SaaS generik atau workflow
  engineering.
- Jika sebuah surface mengasumsikan user paham credential, endpoint, schema,
  webhook, SDK, atau deployment, perlakukan itu sebagai debt pada produk utama
  kecuali surface itu memang jelas admin/internal-only.

## Data and Defaults

- Seed data, empty states, onboarding, demo records, sample institutions, and
  screenshots should feel native to Indonesian village administration.
- If an example or default still feels like a CRM artifact, consider it debt.
- When changing labels or examples, prefer Bades/SID-oriented records over
  neutral SaaS placeholders.

## Safe Internal Exceptions

- Internal package names, command names, or compatibility identifiers may remain
  in legacy form if changing them would be risky.
- Those exceptions must stay behind technical boundaries and should not leak
  into product copy, release notes, email subjects, or docs screenshots.
- Legacy self-hosting or open-source distribution artifacts may temporarily
  remain internally, but they should not dominate public product positioning.
