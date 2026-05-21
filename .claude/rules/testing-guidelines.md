---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/*.spec.tsx"
  - "**/*.integration-spec.ts"
---

# Testing Guidelines

## Principles

- Test behavior, not implementation details.
- Use descriptive names in the form `should [behavior] when [condition]`.
- Prefer focused test-file runs during development.
- Clear mocks between tests.

## Frontend

- Use Testing Library and `@testing-library/user-event`.
- Query by role, text, or label before falling back to implementation details.
- When touching localized user-facing behavior, assert on the intended visible
  copy for that surface.

## Backend

- Use `packages/server/jest.config.mjs` for unit/spec tests.
- Use `packages/server/jest-integration.config.ts` for integration tests.
- For migration, metadata, or orchestration changes, add or update the nearest
  integration suite instead of relying only on unit coverage.

## Commands

```bash
# Frontend unit file
npx jest packages/front/src/path/to/file.test.tsx --config=packages/front/jest.config.mjs

# Backend unit file
npx jest packages/server/src/path/to/file.spec.ts --config=packages/server/jest.config.mjs

# Backend integration file or suite
cd packages/server && npx jest test/integration/path/to/file.integration-spec.ts --config=./jest-integration.config.ts

# Package-level suites
npx nx test front
npx nx test server
npx nx run server:test:integration:with-db-reset
```
