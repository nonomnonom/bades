# Code Style Guidelines

## Defaults

- Use named exports.
- Prefer `type` over `interface` unless extending third-party interfaces.
- Avoid `any`.
- Prefer descriptive names over abbreviations.
- Do not leave unused locals, unused parameters, or dead imports in edited code.
- Keep comments short and explain intent, not syntax.

## Repo-Specific Patterns

- Frontend styling should follow Linaria conventions already used in `ui` and
  `front`.
- Do not introduce new Lingui-based localization wiring, translation catalogs,
  or i18n wrappers unless the task is explicitly about removing or isolating
  legacy localization debt.
- When shared helpers already exist, prefer those imports over custom local
  reimplementation.
- Comments, test names, fixtures, docs internal, and business-domain naming
  should default to Bahasa Indonesia.
- Follow `naming-conventions.md` for file naming, symbol naming, and suffix
  patterns.

```typescript
import { isDefined } from 'shared/utils';
```

## User-Facing Work

- For labels, helper text, empty states, and notifications, prefer Bades
  wording and Indonesian-first copy.
- Treat new public-facing Twenty references as regressions unless the task is
  explicitly technical.

## Language Constraint

- Use English only when required by language syntax, framework APIs, external
  schemas, or unavoidable compatibility surfaces.
- If an English identifier must remain for compatibility, keep surrounding
  comments, docs, tests, and examples in Bahasa Indonesia.
