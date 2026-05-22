# File Structure Guidelines

## Frontend Layout

```text
packages/front/src/
|- modules/      # Product features and workflows
|- pages/        # Route-level pages
|- generated/    # Generated GraphQL/types artifacts
|- locales/      # Legacy translation catalogs if not yet removed
|- testing/      # Test helpers and mock data
`- utils/        # Shared frontend helpers
```

## Backend Layout

```text
packages/server/src/
|- engine/       # Core platform, metadata, workspace migration
|- modules/      # Feature modules outside the engine tree
|- database/     # DB scripts, upgrade commands, migrations
|- utils/        # Shared backend helpers
`- command/      # Command entrypoints
```

## Naming and Exports

- Use `kebab-case` for directories.
- Follow repo naming conventions for files:
  React component files in `front` and `ui` are commonly `PascalCase.tsx`,
  while hooks commonly use `camelCase` with a `use*` prefix.
  Non-component technical files often use suffix patterns such as
  `*.service.ts`, `*.constant.ts`, and `*.util.ts`.
- Prefer named exports.
- Keep related tests close to the package conventions already in use:
  frontend commonly uses `*.test.ts(x)`, backend commonly uses `*.spec.ts`,
  integration uses `*.integration-spec.ts`.

## Imports

- Frontend commonly uses `@/` aliases for app-local imports.
- Server code commonly uses `src/` aliases.
- Cross-package shared imports should use published workspace entry points such
  as `shared/metadata`, `shared/utils`, or `ui`.
- Do not introduce `styled-components`; follow existing Linaria imports such as
  `@linaria/react` and `@linaria/core`.

## Practical Limits

- Split large components or services when responsibilities start to blur.
- Prefer adding focused utilities or hooks over growing one file into multiple
  concerns.
- Match the surrounding package conventions before introducing a new structure.
