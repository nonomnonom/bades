# Bades Architecture

## Technical Stack

- Frontend: React 18, TypeScript, Jotai, Linaria, Vite, Apollo Client
- Backend: NestJS, TypeORM, PostgreSQL, Redis, GraphQL Yoga
- Monorepo tooling: Nx + Yarn 4
- Localization: Lingui with `.po` catalogs

## Repository Shape

```text
packages/
├── front
├── server
├── shared
├── ui
├── emails
├── website
├── docs
├── sdk
├── client-sdk
├── e2e-testing
├── utils
└── claude-skills
```

## Core Boundaries

- `packages/front` contains the main product UI and most user-facing copy.
- `packages/server` contains API code, workers, upgrade commands, metadata
  modules, workspace migration logic, and seed behavior.
- `packages/shared` exports reusable metadata constants, helpers, and shared
  runtime packages via import surfaces like `shared/metadata` and `shared/utils`.
- `packages/ui` is the shared component/design-system layer.
- `packages/website` contains release-note content and public marketing assets.

## Architectural Principles

- Keep public-facing Bades identity separate from risky legacy technical
  identifiers.
- Preserve engine-level compatibility where practical, but prefer Bades product
  semantics for UX, docs, and defaults.
- Follow existing package boundaries instead of creating ad hoc cross-package
  imports.
- When working in metadata or workspace migration code, use the existing flat
  entity and universal flat entity patterns instead of inventing parallel flows.
