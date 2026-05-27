---
name: syncable-entity-integration
description: Wire syncable entity services, builders, validators, handlers, and API exposure into the current NestJS modules in packages/server. Use when the technical pieces exist but the new entity is not fully integrated.
---

# Syncable Entity: Integration

Use this after the builder and runner layers exist.

## Main Areas

- Metadata module for the entity under
  `packages/server/src/engine/metadata-modules/**`
- Workspace migration builder module
- Workspace migration runner module
- Resolver/service exposure for metadata APIs if applicable

## Checklist

- Register validator and builder providers.
- Register runner action handlers.
- Ensure the entity is included in the relevant metadata module exports.
- Add resolver/service exposure only where existing patterns require it.
- Confirm no user-facing labels or defaults reintroduce stale legacy CRM
  wording.
