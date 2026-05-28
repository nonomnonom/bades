---
paths:
  - "packages/server/src/**/*.entity.ts"
  - "packages/server/src/database/commands/upgrade-version-command/**/*.ts"
---

# Server Upgrade Commands

The server package uses upgrade commands instead of relying only on raw TypeORM
migrations.

Reference: `packages/server/docs/UPGRADE_COMMANDS.md`

## Key Commands

```bash
bunx nx run server:database:migrate
bunx nx run server:database:init
bunx nx run server:database:reset
bunx nx run server:database:migrate:generate --name <name> --type <fast|slow>
```

## Rules

- When a `packages/server/src/**/*.entity.ts` change affects schema shape,
  evaluate whether a new instance command is required.
- Keep committed commands reversible and do not rewrite old command history
  casually.
- Fast commands are for schema-first changes.
- Slow commands are for heavier or staged data backfills.
- Workspace commands should be used when logic must iterate across workspaces,
  not just mutate instance-level schema.
