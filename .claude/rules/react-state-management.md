---
paths:
  - "packages/front/src/**/*.ts"
  - "packages/front/src/**/*.tsx"
---

# React State Management

## Jotai Patterns Used Here

- Use `createAtomState` for keyed primitive/shared state.
- Use `createAtomSelector` for derived state.
- Use `createAtomFamilyState` for keyed collections.

```ts
import { createAtomState } from '@/ui/utilities/state/jotai/utils/createAtomState';
import { createAtomSelector } from '@/ui/utilities/state/jotai/utils/createAtomSelector';
import { createAtomFamilyState } from '@/ui/utilities/state/jotai/utils/createAtomFamilyState';
```

## Guidance

- Keep local UI state local when it does not need cross-tree access.
- Prefer normalized records/maps for larger collections.
- Avoid pushing purely local component concerns into global atoms.
