# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

Project-level Claude settings live in `.claude/settings.json`, and the response
language for this repository is intentionally set to Indonesian.

## Project Overview

Bades is an Indonesian village information system built on top of a forked
Twenty engine. Treat this repository as **Bades-first**:

- Public-facing product identity is **Bades**, not Twenty.
- Bahasa default proyek adalah **Bahasa Indonesia native** untuk produk,
  dokumentasi, komentar, test, fixture, seed, contoh data, dan penamaan
  konsep bisnis.
- Bades diposisikan sebagai **produk SaaS swasta terkelola** untuk konteks
  Indonesia, bukan self-hosting-first product untuk end user.
- AI user-facing di Bades harus terasa seperti **satu model operasional**,
  tanpa pemilih model atau label provider yang diekspos ke user akhir.
- Internal compatibility layers may still reference legacy Twenty naming, but
  those identifiers must not leak into user-visible surfaces unless the task is
  explicitly about migration or upstream compatibility.

Read [GOAL.md](D:/bades/GOAL.md) before making product-facing changes.
Treat `GOAL.md` as the primary product source of truth for any task that can
affect branding, language, seed data, user-facing behavior, docs, or domain
terminology.

## Key Commands

### Development
```bash
# Start frontend + backend + worker
yarn start

# Start individual apps
npx nx start front
npx nx start server
npx nx run server:worker
```

### Testing
```bash
# Fastest: run a single frontend or server unit test file
npx jest packages/front/src/path/to/file.test.tsx --config=packages/front/jest.config.mjs
npx jest packages/server/src/path/to/file.spec.ts --config=packages/server/jest.config.mjs

# Project test suites
npx nx test front
npx nx test server
npx nx run server:test:integration:with-db-reset

# Integration tests directly from the server package
cd packages/server && npx jest test/integration/path/to/file.integration-spec.ts --config=./jest-integration.config.ts
```

### Code Quality
```bash
# Prefer diff-based linting first
npx nx lint:diff-with-main front
npx nx lint:diff-with-main server
npx nx lint:diff-with-main front --configuration=fix
npx nx lint:diff-with-main server --configuration=fix

# Full lint
npx nx lint front
npx nx lint server

# Typecheck
npx nx typecheck front
npx nx typecheck server

# Format
npx nx fmt front
npx nx fmt server
```

### Build
```bash
# Shared is a common dependency for app builds
npx nx build shared
npx nx build front
npx nx build server
```

### Database and Migrations
```bash
npx nx run server:database:reset
npx nx run server:database:init
npx nx run server:database:migrate
npx nx run server:database:migrate:generate --name <name> --type <fast|slow>
```

### GraphQL and Localization
```bash
npx nx run front:graphql:generate
npx nx run front:graphql:generate --configuration=metadata

npx nx run front:lingui:extract
npx nx run front:lingui:compile
npx nx run server:lingui:extract
npx nx run server:lingui:compile
```

## Architecture Overview

### Stack
- Frontend: React 18, TypeScript, Jotai, Linaria, Vite, Apollo Client
- Backend: NestJS, TypeORM, PostgreSQL, Redis, GraphQL Yoga
- Monorepo: Nx workspace with Yarn 4
- Localization: Lingui with `.po` catalogs

### Key Packages
```text
packages/
- front                  # Main Bades frontend
- server                 # Main API, worker, commands, migrations
- shared                 # Shared types, metadata, helpers
- ui                     # Shared UI primitives
- emails                 # Email rendering/templates
- website                # Marketing website and release content
- docs                   # Documentation sources
- sdk                    # App SDK and CLI support
- client-sdk             # Generated/API client assets
- e2e-testing            # End-to-end tests
- utils                  # Repo utilities and scripts
- claude-skills          # Additional Claude-facing assets
- create-twenty-app      # Scaffolding package still carrying legacy naming
```

### Product Direction Rules
- Keep the engine and extensibility model intact unless the task requires a
  deliberate engine change.
- Prefer Bades terminology and village-administration concepts over CRM/SaaS
  language in user-facing work.
- Treat Bahasa Indonesia as the default language for comments, tests, fixtures,
  docs, examples, and business-domain identifiers whenever practical.
- For seed data, demo content, docs screenshots, onboarding copy, and examples,
  treat old Twenty defaults as debt to be removed.
- When technical identifiers still use legacy names, isolate them to internal
  code paths and avoid leaking them into titles, labels, emails, or help text.

## Frontend Conventions

- Functional components only.
- Named exports only.
- Prefer `type` over `interface` unless extending third-party types.
- Prefer string unions over enums except where GraphQL or existing platform
  APIs require enums.
- Use Lingui macros (`Trans`, `msg`, `useLingui`) for translatable UI text.
- Follow existing Linaria patterns in `packages/ui` and `packages/front`;
  do not introduce `styled-components`.
- Use the Jotai helper utilities already in the repo such as
  `createAtomState`, `createAtomSelector`, and `createAtomFamilyState`.
- Use Bahasa Indonesia for business-facing identifiers, comments, test names,
  fixtures, and examples unless English is required by an external API,
  framework convention, or compatibility constraint.

## Backend Conventions

- Workspace migration and syncable-entity work lives under
  `packages/server/src/engine/workspace-manager/workspace-migration`.
- Metadata entities and flat-entity registries live under
  `packages/server/src/engine/metadata-modules`.
- Shared metadata constants are sourced from `shared/metadata`.
- When changing `*.entity.ts` files, assess whether a new instance command is
  required and keep committed command history reversible.

## Development Workflow

### Before Making Changes
1. Read `GOAL.md` for product-facing work.
2. Check for an existing `.claude/rules/*` rule or `.claude/skills/*` skill that
   applies to the area you are touching. For parallel or autonomous work, also
   check `.claude/agents/*` and `.claude/loop.md`.
   Prioritize the Bades core rules: `bahasa-indonesia-total.md`,
   `anti-brand-leak.md`, `non-technical-product.md`, and
   `goal-gatekeeping-workflow.md`.
3. Prefer diff-based linting and focused test runs before broader suites.
4. Regenerate GraphQL or localization artifacts when the change requires it.
5. Avoid introducing new public-facing references to Twenty unless the task is
   specifically about migration, provenance, or upstream compatibility.
6. Evaluate the task against `GOAL.md` on the files and surfaces being touched.
   Do not treat that as permission to do unrelated repo-wide cleanup.
7. Default to autonomous execution when the goal direction is clear. Raise a
   question only when ambiguity materially changes the approach or could cause a
   risky regression.
8. If the task changes React UI files in `front`, `ui`, or `website`, use the
   `react-doctor` workflow as part of closing verification.
9. If the task touches billing, checkout, payment notifications, enterprise
   billing APIs, or Stripe cleanup, use the `migrasi-midtrans` skill and the
   `midtrans-first-billing.md` rule as the default workflow.
10. If the task touches AI chat, AI settings, agent surfaces, or model
    selection/routing, use the `ai-single-model.md` rule and keep the user
    experience single-model.

### Localization Rules
- User-facing Bades UI should be Bahasa Indonesia native by default.
- Avoid mixed-language copy, comments, tests, or examples that feel like an
  unfinished translation.
- Use English only for language keywords, framework/library APIs, external
  contracts, or unavoidable legacy compatibility.

## Dev Environment Setup

Use the repo setup script:

```bash
bash packages/utils/setup-dev-env.sh
```

Common flags:
- `--docker`
- `--down`
- `--reset`

The script is intended to start PostgreSQL and Redis, create local databases,
and copy `.env` files for `front` and `server`.

## Important Files
- `GOAL.md` - Bades product direction and rebrand guardrails
- `nx.json` - Nx workspace configuration
- `package.json` - Root workspace definitions and scripts
- `.mcp.json` - Project-scoped MCP servers
- `.claude/rules/` - Project rules for Claude Code
- `.claude/skills/` - Project-specific Claude Code skills
- `.claude/agents/` - Project subagents and teammate role definitions
- `.claude/loop.md` - Default autonomous maintenance prompt for bare `/loop`
