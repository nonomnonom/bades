---
paths:
  - "packages/sdk/**"
---

# SDK Dependency Guidance

`packages/sdk` needs extra care because it ships reusable artifacts that may be
consumed outside this monorepo. The legacy `packages/create-twenty-app`
scaffolder has been removed and should not be reintroduced.

## Rules

- Prefer dependencies that behave correctly in ESM-aware builds.
- Be explicit about runtime dependencies instead of assuming monorepo-only
  resolution.
- When changing package exports, build and test the affected package directly.
- Preserve compatibility intentionally; do not rename or reshuffle exported
  entry points casually.
