# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bades.id adalah Sistem Informasi Desa (SID) native Indonesia, dirancang untuk perangkat desa Indonesia: operator desa, admin layanan, sekretariat desa, dan pihak terkait administrasi warga.

Bahasa default proyek adalah **Bahasa Indonesia native** untuk produk, dokumentasi, komentar, test, fixture, seed, dan penamaan domain bisnis. Bahasa Inggris hanya untuk keyword bahasa pemrograman, nama API framework/library, dan kontrak teknis eksternal.

## Key Commands

```bash
# Start all (frontend + backend + worker)
yarn start

# Start individual apps
npx nx start front
npx nx start server
npx nx run server:worker

# Build
npx nx build shared && npx nx build front && npx nx build server

# Testing
npx jest packages/front/src/path/to/file.test.tsx --config=packages/front/jest.config.mjs
npx jest packages/server/src/path/to/file.spec.ts --config=packages/server/jest.config.mjs
cd packages/server && npx jest test/integration/path/to/file.integration-spec.ts --config=./jest-integration.config.ts
npx nx test front
npx nx test server
npx nx run server:test:integration:with-db-reset

# Code quality
npx nx lint:diff-with-main front --configuration=fix
npx nx lint:diff-with-main server --configuration=fix
npx nx lint:diff-with-main front
npx nx lint:diff-with-main server
npx nx typecheck front
npx nx typecheck server
npx nx fmt front
npx nx fmt server

# Database
npx nx run server:database:reset
npx nx run server:database:init
npx nx run server:database:migrate
npx nx run server:database:migrate:generate --name <name> --type <fast|slow>

# GraphQL (front only, regenerate when schema changes)
npx nx run front:graphql:generate
npx nx run front:graphql:generate --configuration=metadata
```

## Architecture

### Stack
- Frontend: React 18, TypeScript, Jotai, Linaria, Vite, Apollo Client
- Backend: NestJS, TypeORM, PostgreSQL, Redis, GraphQL Yoga
- Monorepo: Nx workspace with Yarn 4

### Core Packages
```
packages/
- front          # Main product UI
- server         # API, workers, commands, migrations
- shared         # Metadata constants, helpers (shared/metadata, shared/utils)
- ui             # Shared component/design-system layer
- emails         # Email rendering/templates
- utils          # Repo utilities and scripts
- sdk            # Bades SDK
- client-sdk     # Client SDK
- e2e-testing    # E2E tests
- front-component-renderer
- oxlint-rules   # Custom lint rules
- docker         # Docker artifacts (Dockerfile, docker-compose.yml, Makefile)
```

### Frontend Layout (`packages/front/src/`)
```
modules/      # Product features and workflows
pages/        # Route-level pages
generated/    # Generated GraphQL/types artifacts
testing/      # Test helpers and mock data
utils/        # Shared frontend helpers
```

### Backend Layout (`packages/server/src/`)
```
engine/       # Core platform, metadata, workspace migration
modules/      # Feature modules outside the engine tree
database/     # DB scripts, upgrade commands, migrations
utils/        # Shared backend helpers
command/      # Command entrypoints
```

## Code Conventions

### TypeScript
- Prefer `type` over `interface` unless extending third-party interfaces
- Avoid `any`
- Use string unions over enums unless GraphQL or platform APIs require enums
- Use strict TypeScript; be explicit about types in public APIs

### React Components
- Functional components only, named exports only
- Use `createAtomState`, `createAtomSelector`, `createAtomFamilyState` from `@/ui/utilities/state/jotai/utils/` for Jotai state
- Styling: Linaria (`@linaria/react`, `@linaria/core`), not styled-components
- Props suffix: `*Props`

### Naming
- Directories: `kebab-case`
- React components, providers, stories: `PascalCase.tsx`
- Hooks: `camelCase` with `use*` prefix
- Services, constants, utils: `kebab-case` or standard suffixes
- Test files: `*.test.ts(x)` (frontend), `*.spec.ts` (backend), `*.integration-spec.ts` (integration)

### Imports
- Frontend: `@/` aliases for app-local imports
- Server: `src/` aliases
- Cross-package: `shared/metadata`, `shared/utils`, `ui`

## Database & Migrations

Server uses upgrade commands instead of relying only on TypeORM migrations:
- `fast` type: schema-first changes
- `slow` type: heavier or staged data backfills
- Workspace commands for logic that iterates across workspaces

When changing `*.entity.ts`, evaluate whether a new instance command is required. Keep committed commands reversible.

## Testing

- Test behavior, not implementation details
- Frontend: Testing Library + `@testing-library/user-event`; query by role, text, or label
- Backend: `packages/server/jest.config.mjs` for unit tests, `jest-integration.config.ts` for integration

## Language

- Default: Bahasa Indonesia for business-domain naming, comments, test names, fixtures
- English only for: language syntax, framework APIs, external schemas, unavoidable legacy compatibility
- Do not introduce new Lingui/i18n wiring; treat remaining i18n infrastructure as legacy debt
- User-facing copy should feel natural in Bahasa Indonesia, not machine-translated

## What to Avoid

- Do not introduce `styled-components` (use Linaria instead)
- Do not grow `website` or `docs` as active surfaces
- Do not leave unused locals, unused parameters, or dead imports
- Do not add new public-facing references to legacy product naming
- Do not use default exports
