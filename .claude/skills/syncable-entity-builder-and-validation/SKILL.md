---
name: syncable-entity-builder-and-validation
description: Implement validation services and migration action builders for syncable entities in packages/server. Use when adding business-rule validation, uniqueness checks, foreign-key validation, or workspace-migration action builders.
---

# Syncable Entity: Builder and Validation

This step comes after types/constants and cache/transform work.

## Main Locations

- Validators:
  `packages/server/src/engine/workspace-manager/workspace-migration/workspace-migration-builder/validators/services`
- Builders:
  `packages/server/src/engine/workspace-manager/workspace-migration/workspace-migration-builder/builders`
- Orchestrator:
  `packages/server/src/engine/workspace-manager/workspace-migration/services/workspace-migration-build-orchestrator.service.ts`

## Rules

- Validators should return structured errors instead of throwing for normal
  validation failures.
- Validators should work against optimistic maps and should not mutate them.
- Prefer indexed lookups/maps over `Object.values(...).find(...)` scans.
- Builder output should match the action patterns already used by existing
  metadata entities.

## Critical Step

Wire the new builder into the workspace migration build orchestrator. This is
the step most likely to be missed.
