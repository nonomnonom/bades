# Bades Claude Rules

These rules are the project-scoped guidance Claude Code should follow in this
repository. They are written to match the current Bades codebase and the
product direction in `GOAL.md`.

Autonomous workflow helpers for this repo also live in:

- `.claude/agents/` - reusable subagent and agent-team teammate roles
- `.claude/loop.md` - default maintenance prompt for bare `/loop`

## Rule Set

- `bades-product-direction.md` - Always-on arah identitas, bahasa, audience, dan anti-leak utama
- `goal-gatekeeping-workflow.md` - Always-on workflow rule for checking each active task against `GOAL.md`
- `architecture.md` - Current monorepo structure and technical boundaries
- `code-style.md` - Shared coding conventions
- `file-structure.md` - Package and directory layout guidance
- `naming-conventions.md` - File naming, symbol naming, suffixes, and unused-code hygiene
- `nx-rules.md` - Nx targets and workspace patterns
- `server-migrations.md` - Upgrade command workflow for the server package
- `front-user-surface.md` - Path-scoped guidance for UI, settings, and navigation surfaces
- `docs-and-website-branding.md` - Path-scoped guidance untuk penghapusan, pengarsipan, dan pembersihan branding docs/website
- `midtrans-first-billing.md` - Path-scoped billing and payment guidance for Midtrans-first migration work
- `ai-single-model.md` - Path-scoped guidance for single-model AI surfaces and routing
- `platform-internal-bades.md` - Path-scoped guidance for app system, marketplace, API/webhook, and internal-platform boundaries
- `seed-desa-indonesia.md` - Path-scoped rules for seed data, fixtures, stories, and examples
- `testing-guidelines.md` - Practical unit/integration test guidance
- `react-general-guidelines.md` - React component patterns
- `react-state-management.md` - Jotai patterns used in the frontend
- `react-doctor-workflow.md` - Path-scoped React quality check workflow with the `react-doctor` skill
- `typescript-guidelines.md` - TypeScript expectations
- `sdk-esm-dependencies.md` - Dual-format package dependency guidance

## How Rules Load

- Rules without frontmatter are always on.
- Rules with `paths:` frontmatter load when matching files enter context.
- Product direction in `bades-product-direction.md` should be treated as global
  guidance whenever work touches user-facing behavior, branding, docs, or seed
  data.
- `goal-gatekeeping-workflow.md` defines how to apply `GOAL.md` per active
  task while staying autonomous when the direction is already clear.
- `bades-product-direction.md` adalah single source untuk identitas inti
  Bades.
- Path-scoped rules sebaiknya tetap sempit agar hanya masuk context saat
  dibutuhkan.

## Operator Heuristic

- Saat ragu, baca berurutan: `GOAL.md` -> `CLAUDE.md` ->
  `bades-product-direction.md`.
- Jangan menambah rule always-on baru jika isinya masih muat sebagai tambahan
  singkat ke `bades-product-direction.md` atau
  `goal-gatekeeping-workflow.md`.
- Jika sebuah rule jarang relevan, lebih baik jadikan path-scoped atau pindah
  ke skill daripada menambah beban context semua sesi.

## Maintenance Standard

If a rule mentions a stale package name, wrong Nx target, deprecated library,
or public-facing Twenty language without technical justification, update the
rule before relying on it.
