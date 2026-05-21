# Bades Claude Rules

These rules are the project-scoped guidance Claude Code should follow in this
repository. They are written to match the current Bades codebase and the
product direction in `GOAL.md`.

## Rule Set

- `bades-product-direction.md` - Always-on product identity and anti-leak rules
- `architecture.md` - Current monorepo structure and technical boundaries
- `code-style.md` - Shared coding conventions
- `file-structure.md` - Package and directory layout guidance
- `nx-rules.md` - Nx targets and workspace patterns
- `server-migrations.md` - Upgrade command workflow for the server package
- `translations.md` - Lingui and Indonesian-first localization workflow
- `testing-guidelines.md` - Practical unit/integration test guidance
- `changelog-process.md` - Release content workflow for `packages/website`
- `react-general-guidelines.md` - React component patterns
- `react-state-management.md` - Jotai patterns used in the frontend
- `typescript-guidelines.md` - TypeScript expectations
- `sdk-esm-dependencies.md` - Dual-format package dependency guidance

## How Rules Load

- Rules without frontmatter are always on.
- Rules with `paths:` frontmatter load when matching files enter context.
- Product direction in `bades-product-direction.md` should be treated as global
  guidance whenever work touches user-facing behavior, branding, docs, or seed
  data.

## Maintenance Standard

If a rule mentions a stale package name, wrong Nx target, deprecated library,
or public-facing Twenty language without technical justification, update the
rule before relying on it.
