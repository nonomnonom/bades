---
name: syncable-entity-runner-and-actions
description: Implement migration action handlers and runner-layer execution for syncable entities in packages/server. Use when adding create, update, or delete handlers for the workspace-migration runner.
---

# Syncable Entity: Runner and Actions

This step executes the actions built by the builder layer.

## Main Locations

- Runner action handlers:
  `packages/server/src/engine/workspace-manager/workspace-migration/workspace-migration-runner/action-handlers`
- Runner registry and module wiring:
  `packages/server/src/engine/workspace-manager/workspace-migration/workspace-migration-runner/**`

## Required Work

1. Implement create, update, and delete handlers.
2. Convert universal flat entities into the shape needed by persistence code.
3. Reuse existing helper utilities for relation resolution, JSONB handling, and
   optimistic map application when available.
4. Register the handlers in the runner module/registry.

## Principles

- Match the action-handler conventions already used by nearby metadata entities.
- Keep runner logic focused on execution, not on duplicating validator rules.
