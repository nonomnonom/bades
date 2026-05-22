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
- For user-facing copy, use Lingui macros instead of raw hard-coded strings
  when the text belongs in the localization pipeline.
