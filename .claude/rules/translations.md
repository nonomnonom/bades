---
paths:
  - "packages/front/src/locales/**"
  - "packages/front/src/**/*.po"
  - "packages/front/src/**/translate*.py"
  - "packages/front/src/**/*.tsx"
  - "packages/front/src/**/*.ts"
  - "packages/server/src/**/*.ts"
---

# Translation Guidelines

## Source of Truth

- This repo uses **Lingui**, not `react-i18next`.
- Frontend text commonly uses `@lingui/react/macro`.
- Shared/backend user-friendly messages commonly use `@lingui/core/macro`.
- Catalogs are stored as `.po` files, including `packages/front/src/locales/id-ID.po`.

## Product Direction

- Bades user-facing surfaces should prefer **natural Bahasa Indonesia**.
- Avoid mixed-language copy that still feels like an imported CRM product.
- Do not add new public-facing references to Twenty unless the task is
  explicitly about technical compatibility or migration.

## Patterns

```tsx
import { Trans, useLingui } from '@lingui/react/macro';

export const Example = () => {
  const { t } = useLingui();

  return (
    <>
      <h1><Trans>Profil</Trans></h1>
      <button>{t`Simpan perubahan`}</button>
    </>
  );
};
```

```ts
import { msg } from '@lingui/core/macro';

export const userFriendlyMessage = msg`Data tidak dapat diproses.`;
```

## Workflow

```bash
npx nx run front:lingui:extract
npx nx run front:lingui:compile
npx nx run server:lingui:extract
npx nx run server:lingui:compile
```

## Practical Rules

- Use Lingui macros instead of hard-coded helper wrappers.
- Keep terminology consistent across seed data, labels, onboarding, and empty
  states.
- If a string is clearly user-facing, translate it in the same change unless
  there is a documented reason not to.
