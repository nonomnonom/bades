---
name: syncable-entity-cache-and-transform
description: Implement cache services and transform utilities for syncable entities using the current workspace-migration architecture in packages/server. Use when converting DTOs, metadata entities, and universal flat entities.
---

# Syncable Entity: Cache and Transform

This step comes after types and constants.

## Main Locations

- Metadata module code:
  `packages/server/src/engine/metadata-modules/**`
- Workspace migration universal flat entity code:
  `packages/server/src/engine/workspace-manager/workspace-migration/universal-flat-entity/**`

## Required Work

1. Create entity-to-flat conversion utilities.
2. Create DTO/input-to-universal-flat transformation utilities.
3. Create or update cache services used by workspace migration.
4. Resolve relation identifiers through the same patterns used by existing
   syncable entities.

## Principles

- Reuse existing migration helpers rather than inventing a parallel transform
  layer.
- Use shared helpers from `shared/*` instead of stale `twenty-shared/*`
  imports.
- Preserve deterministic transformations so validation and action building can
  compare entities reliably.
