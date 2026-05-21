---
paths:
  - "packages/server/src/engine/metadata-modules/**/*.ts"
  - "packages/server/src/engine/workspace-manager/workspace-migration/**/*.ts"
---

# Creating a New Syncable Entity - Main Guide

This is the main guide for creating **syncable entities** in Twenty's workspace migration architecture.

## Documentation Structure

This main guide provides a high-level overview and navigation hub.

**âš¡ Skills** (`.claude/skills/syncable-entity-*/SKILL.md`) - Concise, action-oriented implementation guides for each step. Reference these when creating a new syncable entity.

**When to use:**
- Start here for architecture overview and workflow
- Reference specific skills (`@syncable-entity-types-and-constants`) when implementing each step

## What is a Syncable Entity?

A syncable entity is a metadata entity that:
- Has a **`universalIdentifier`**: A unique identifier used for syncing entities across workspaces/applications
- Has an **`applicationId`**: Links the entity to an application (Standard or Custom applications)
- Participates in the **workspace migration system**: Can be created, updated, and deleted through the migration pipeline
- Is **cached as a flat entity**: Denormalized representation for efficient validation and change detection

Examples: `skill`, `agent`, `view`, `viewField`, `role`, `pageLayout`, etc.

## Architecture Overview

```
Input DTO â†’ Transform â†’ Universal Flat Entity â†’ Builder/Validator â†’ Runner â†’ Database
                              â†“
                        Cache Service
```

**Key Components:**
- **TypeORM Entity**: Database model extending `SyncableEntity`
- **Flat Entity**: Denormalized type (no relations, dates as strings) - for caching
- **Universal Flat Entity**: Flat entity with foreign keys mapped to universal identifiers - for migrations
- **Transform Utils**: Convert DTOs to universal flat entities
- **Builder/Validator**: Validate and create migration actions
- **Runner**: Execute actions against the database

## Implementation Steps

Follow these skills in order:

### 1ï¸âƒ£ **Foundation: Types & Constants** â†’ `@syncable-entity-types-and-constants`

**What:** Define all types, entities, and register in central constants

**Tasks:**
- Create TypeORM entity (extends `SyncableEntity`)
- Define flat entity types
- Define action types (universal + flat)
- Register in 5 central constants

**Why first:** Everything else depends on these types

---

### 2ï¸âƒ£ **Data Layer: Cache & Transform** â†’ `@syncable-entity-cache-and-transform`

**What:** Handle conversion between different representations

**Tasks:**
- Create cache service
- Create entity-to-flat conversion
- Create input transform utils
- Handle foreign key resolution

**Dependencies:** Requires Step 1

---

### 3ï¸âƒ£ **Business Logic: Builder & Validation** â†’ `@syncable-entity-builder-and-validation`

**What:** Validate business rules and create actions

**Tasks:**
- Create validator service (never throws, never mutates)
- Create builder service
- Wire into orchestrator (âš ï¸ critical!)

**Dependencies:** Requires Steps 1-2

---

### 4ï¸âƒ£ **Execution: Runner & Actions** â†’ `@syncable-entity-runner-and-actions`

**What:** Execute migration actions against the database

**Tasks:**
- Create action handlers (create/update/delete)
- Implement transpilation methods
- Create universal-to-flat conversion utilities

**Dependencies:** Requires Steps 1-3

---

### 5ï¸âƒ£ **Assembly: Integration** â†’ `@syncable-entity-integration`

**What:** Wire everything together

**Tasks:**
- Register in 3 NestJS modules
- Create service and resolver layers
- Use exception interceptor

**Dependencies:** Requires Steps 1-4

---

### 6ï¸âƒ£ **Testing: Integration Tests** (**MANDATORY**) â†’ `@syncable-entity-testing`

**What:** Comprehensive test suite

**Tasks:**
- Create test utilities
- Write failing tests (all validator exceptions)
- Write successful tests (all CRUD operations)
- Use snapshot testing

**Dependencies:** Requires all previous steps

---

## Quick Reference

### Multi-Agent Workflow

For parallel development:
1. **Agent 1** (Foundation): Complete Step 1 first - unblocks everyone
2. **Agent 2** (Cache): Can start immediately after Step 1
3. **Agent 3** (Builder): Can work in parallel with Agent 4 after Step 1
4. **Agent 4** (Runner): Can work in parallel with Agent 3 after Step 1
5. **Agent 5** (Integration): Assembles everything after Steps 2-4

### Key Design Principles

| Layer | Responsibility | Can Throw? | Can Mutate? |
|-------|---------------|------------|-------------|
| Transform Utils | Data transformation | Yes (input validation) | N/A (creates new) |
| Validator | Business rule validation | **No** (returns errors) | **No** |
| Builder | Action creation | **No** (returns errors) | **No** |
| Runner | Database operations | Yes (DB errors) | Yes (via TypeORM) |

### Common Pitfalls

âš ï¸ **Most Commonly Forgotten:**
1. Wiring builder in orchestrator service
2. Registering in all 3 modules (builder, validators, action handlers)
3. Setting `universalIdentifier` correctly in entity-to-flat conversion

âš ï¸ **Common Mistakes:**
1. Using regular IDs instead of universal identifiers in transform utils
2. Throwing exceptions in validators/builders
3. Mutating entity maps in validators/builders
4. Forgetting to handle JSONB properties with `SerializedRelation`

### File Locations

```
packages/twenty-shared/src/metadata/
â””â”€â”€ all-metadata-name.constant.ts

packages/twenty-server/src/engine/metadata-modules/
â”œâ”€â”€ my-entity/                           # Step 1
â”‚   â””â”€â”€ entities/
â”œâ”€â”€ flat-my-entity/                      # Steps 1-2
â”‚   â”œâ”€â”€ types/
â”‚   â”œâ”€â”€ constants/
â”‚   â”œâ”€â”€ services/
â”‚   â””â”€â”€ utils/
â””â”€â”€ flat-entity/constant/                # Step 1 (central registries)
    â”œâ”€â”€ all-entity-properties-configuration-by-metadata-name.constant.ts
    â”œâ”€â”€ all-one-to-many-metadata-relations.constant.ts
    â”œâ”€â”€ all-many-to-one-metadata-foreign-key.constant.ts
    â””â”€â”€ all-many-to-one-metadata-relations.constant.ts

packages/twenty-server/src/engine/workspace-manager/workspace-migration/
â”œâ”€â”€ workspace-migration-builder/         # Step 3
â”‚   â”œâ”€â”€ builders/my-entity/
â”‚   â””â”€â”€ validators/services/
â””â”€â”€ workspace-migration-runner/          # Step 4
    â””â”€â”€ action-handlers/my-entity/
```

### Complete Checklist

Before considering complete:
- [ ] All 6 guides completed
- [ ] TypeORM entity extends `SyncableEntity`
- [ ] All constants registered (5 central registries)
- [ ] Cache service with correct decorator
- [ ] Transform utils return universal flat entities
- [ ] Validator never throws/mutates
- [ ] Builder wired in orchestrator (âš ï¸ critical!)
- [ ] All 3 action handlers implemented
- [ ] All 3 modules updated
- [ ] **Integration tests written (MANDATORY)**
- [ ] **All failing scenarios covered**
- [ ] **All successful use cases tested**

---

## Need Help?

Reference the appropriate skill for step-by-step guidance:
- `@syncable-entity-types-and-constants` - Types, entities, constants
- `@syncable-entity-cache-and-transform` - Cache & transform
- `@syncable-entity-builder-and-validation` - Builder & validation
- `@syncable-entity-runner-and-actions` - Runner & actions
- `@syncable-entity-integration` - Integration & wiring
- `@syncable-entity-testing` - Testing patterns

