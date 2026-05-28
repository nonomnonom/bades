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
bunx nx start front
bunx nx build front
bunx nx test front
bunx nx lint front
bunx nx lint:diff-with-main front

# Backend
bunx nx start server
bunx nx run server:worker
bunx nx build server
bunx nx test server
bunx nx run server:test:integration:with-db-reset
bunx nx lint server
bunx nx lint:diff-with-main server

# Shared packages
bunx nx build shared
bunx nx build ui
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
