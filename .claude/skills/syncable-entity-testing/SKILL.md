---
name: syncable-entity-testing
description: Add unit and integration coverage for syncable entities using the current test structure in packages/server. Use when validating new metadata entities, migration builders, runner handlers, or end-to-end workspace-migration behavior.
---

# Syncable Entity: Testing

Testing is required before considering a new syncable entity done.

## Main Locations

- Integration suites:
  `packages/server/test/integration/metadata/suites/**`
- Server unit/spec tests:
  `packages/server/src/**/*.spec.ts`

## Required Coverage

1. Failing validation scenarios.
2. Successful create/update/delete scenarios.
3. Relation and identifier edge cases.
4. Any workspace-migration orchestration behavior introduced by the entity.

## Useful Commands

```bash
# Single integration suite
cd packages/server && bunx jest test/integration/metadata/suites/my-entity --config=./jest-integration.config.ts

# Single integration file
cd packages/server && bunx jest test/integration/metadata/suites/my-entity/failing-my-entity-creation.integration-spec.ts --config=./jest-integration.config.ts

# Full integration run with DB reset
bunx nx run server:test:integration:with-db-reset
```

## Principles

- Match existing metadata integration test patterns before inventing new
  helpers.
- Prefer adding to the nearest suite over creating isolated one-off utilities.
