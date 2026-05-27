# Bades Claude Rules

These rules are the project-scoped guidance Claude Code should follow in this
repository. They are written to match the current Bades codebase.

## Rule Set

- `architecture.md` - Current monorepo structure and technical boundaries
- `code-style.md` - Shared coding conventions
- `creating-syncable-entity.md` - Syncable entity creation workflow
- `feedback-incorporation.md` - Guidelines for incorporating user feedback
- `file-structure.md` - Package and directory layout guidance
- `github-actions-security.md` - GitHub Actions security best practices
- `naming-conventions.md` - File naming, symbol naming, suffixes, and unused-code hygiene
- `nx-rules.md` - Nx targets and workspace patterns
- `react-doctor-workflow.md` - Path-scoped React quality check workflow with the `react-doctor` skill
- `react-general-guidelines.md` - React component patterns
- `react-state-management.md` - Jotai patterns used in the frontend
- `server-migrations.md` - Upgrade command workflow for the server package
- `testing-guidelines.md` - Practical unit/integration test guidance
- `typescript-guidelines.md` - TypeScript expectations
- `sdk-esm-dependencies.md` - Dual-format package dependency guidance

## How Rules Load

- Rules without frontmatter are always on.
- Rules with `paths:` frontmatter load when matching files enter context.
- Path-scoped rules sebaiknya tetap sempit agar hanya masuk context saat
  dibutuhkan.

## Maintenance Standard

If a rule mentions a stale package name, wrong Nx target, deprecated library,
or public-facing legacy CRM language without technical justification, update
the rule before relying on it.
