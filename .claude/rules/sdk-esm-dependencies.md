---
paths:
  - "packages/sdk/**"
  - "packages/create-twenty-app/**"
---

# SDK and Scaffolder Dependency Guidance

`packages/sdk` and `packages/create-twenty-app` need extra care because they
ship reusable artifacts that may be consumed outside this monorepo.

## Rules

- Prefer dependencies that behave correctly in ESM-aware builds.
- Be explicit about runtime dependencies instead of assuming monorepo-only
  resolution.
- When changing package exports, build and test the affected package directly.
- Preserve compatibility intentionally; do not rename or reshuffle exported
  entry points casually.
