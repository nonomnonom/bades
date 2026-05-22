---
paths:
  - "packages/front/src/**/*.tsx"
  - "packages/ui/src/**/*.tsx"
---

# React Guidelines

- Use functional components.
- Use named exports.
- Prefer event-driven state updates over effects for simple UI flows.
- Keep components focused; extract hooks when logic becomes reusable.
- Match the existing styling system in the package you are editing. In `front`
  and `ui`, that usually means Linaria rather than introducing a new styling
  library.
- Untuk copy user-facing, utamakan hasil akhir yang sederhana dan konsisten
  dengan produk single-language Bahasa Indonesia. Jangan menambah dependency
  baru ke pipeline i18n/Lingui.
