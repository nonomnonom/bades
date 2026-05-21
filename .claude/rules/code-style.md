# Code Style Guidelines

## Defaults

- Use named exports.
- Prefer `type` over `interface` unless extending third-party interfaces.
- Avoid `any`.
- Prefer descriptive names over abbreviations.
- Keep comments short and explain intent, not syntax.

## Repo-Specific Patterns

- Frontend styling should follow Linaria conventions already used in `ui` and
  `front`.
- Localization should use Lingui macros and utilities, not ad hoc string
  wrappers.
- When shared helpers already exist, prefer those imports over custom local
  reimplementation.

```typescript
import { isDefined } from 'shared/utils';
```

## User-Facing Work

- For labels, helper text, empty states, and notifications, prefer Bades
  wording and Indonesian-first copy.
- Treat new public-facing Twenty references as regressions unless the task is
  explicitly technical.
