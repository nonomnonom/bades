---
paths:
  - "packages/server/src/engine/metadata-modules/**/*.ts"
  - "packages/server/src/engine/workspace-manager/workspace-migration/**/*.ts"
---

# Creating a Syncable Entity

This is the high-level guide for adding a new syncable metadata entity to the
current server codebase.

## Use This Rule For

- New metadata entities that extend `SyncableEntity`
- Changes that need flat-entity registrations
- Workspace migration builder/runner work
- New metadata API exposure and integration tests

## Workflow

Follow the dedicated skills in order:

1. `@syncable-entity-types-and-constants`
2. `@syncable-entity-cache-and-transform`
3. `@syncable-entity-builder-and-validation`
4. `@syncable-entity-runner-and-actions`
5. `@syncable-entity-integration`
6. `@syncable-entity-testing`

## Main Locations

- Shared metadata names:
  `packages/shared/src/metadata/all-metadata-name.constant.ts`
- Metadata modules:
  `packages/server/src/engine/metadata-modules/**`
- Flat-entity registries:
  `packages/server/src/engine/metadata-modules/flat-entity/constant/**`
- Workspace migration builder:
  `packages/server/src/engine/workspace-manager/workspace-migration/workspace-migration-builder/**`
- Workspace migration runner:
  `packages/server/src/engine/workspace-manager/workspace-migration/workspace-migration-runner/**`
- Build orchestrator:
  `packages/server/src/engine/workspace-manager/workspace-migration/services/workspace-migration-build-orchestrator.service.ts`

## Principles

- Follow existing metadata-module patterns before inventing a new structure.
- Use `shared/metadata` and other current shared import surfaces instead of old
  package names.
- Validators should return structured validation errors rather than throw for
  normal business-rule failures.
- Do not forget orchestrator and module wiring.
- If the entity introduces user-facing defaults, labels, demo records, or seed
  content, keep that surface aligned with Bades terminology and avoid generic
  CRM carryover.
