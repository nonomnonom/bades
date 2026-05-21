# Bades Claude Rules

These rules are the project-scoped guidance Claude Code should follow in this
repository. They are written to match the current Bades codebase and the
product direction in `GOAL.md`.

Autonomous workflow helpers for this repo also live in:

- `.claude/agents/` - reusable subagent and agent-team teammate roles
- `.claude/loop.md` - default maintenance prompt for bare `/loop`

## Rule Set

- `bades-product-direction.md` - Always-on product identity and anti-leak rules
- `goal-gatekeeping-workflow.md` - Always-on workflow rule for checking each active task against `GOAL.md`
- `bahasa-indonesia-total.md` - Always-on Indonesia-first writing rules
- `anti-brand-leak.md` - Always-on forbidden brand and CRM term guardrails
- `non-technical-product.md` - Always-on product guardrails for non-technical users
- `architecture.md` - Current monorepo structure and technical boundaries
- `code-style.md` - Shared coding conventions
- `file-structure.md` - Package and directory layout guidance
- `naming-conventions.md` - File naming, symbol naming, suffixes, and unused-code hygiene
- `nx-rules.md` - Nx targets and workspace patterns
- `server-migrations.md` - Upgrade command workflow for the server package
- `front-user-surface.md` - Path-scoped guidance for UI, settings, and navigation surfaces
- `docs-and-website-branding.md` - Path-scoped branding guidance for docs and website work
- `midtrans-first-billing.md` - Path-scoped billing and payment guidance for Midtrans-first migration work
- `ai-single-model.md` - Path-scoped guidance for single-model AI surfaces and routing
- `platform-internal-bades.md` - Path-scoped guidance for app system, marketplace, API/webhook, and internal-platform boundaries
- `seed-desa-indonesia.md` - Path-scoped rules for seed data, fixtures, stories, and examples
- `translations.md` - Lingui and Indonesian-first localization workflow
- `testing-guidelines.md` - Practical unit/integration test guidance
- `changelog-process.md` - Release content workflow for `packages/website`
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
- `bahasa-indonesia-total.md`, `anti-brand-leak.md`, and
  `non-technical-product.md` are the core Bades identity rules and should win
  over stale upstream habits.
- `goal-gatekeeping-workflow.md` is the core workflow rule that prevents drift
  when a task is technically valid but product-directionally wrong.

## Maintenance Standard

If a rule mentions a stale package name, wrong Nx target, deprecated library,
or public-facing Twenty language without technical justification, update the
rule before relying on it.
