---
paths:
  - "nx.json"
  - "packages/**/project.json"
  - "workspace.json"
---

# Nx Guidelines

## Common Targets

```bash
# Frontend
npx nx start front
npx nx build front
npx nx test front
npx nx lint front
npx nx lint:diff-with-main front

# Backend
npx nx start server
npx nx run server:worker
npx nx build server
npx nx test server
npx nx run server:test:integration:with-db-reset
npx nx lint server
npx nx lint:diff-with-main server

# Shared packages
npx nx build shared
npx nx build ui
```

## Preferred Workflow

- Prefer `lint:diff-with-main` before full-package lint runs.
- Use explicit project names that exist in this repo such as `front`, `server`,
  `shared`, `ui`, dan `sdk`.
- Perlakukan `website` dan `docs` sebagai proyek legacy; jangan menjadikannya
  contoh default workflow baru.
- Check each package `project.json` instead of assuming target names.

## Notes

- `front` and `server` are the main app targets; `twenty-front` and
  `twenty-server` are stale names in this repo context.
- Some packages still have legacy product naming in filesystem paths or package
  names, but Nx project names should be taken from their current `project.json`.
