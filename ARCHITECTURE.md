# Arsitektur Bades - Dokumentasi DevOps & Build System

> Dokumentasi ini dihasilkan dari analisis otomatis terhadap codebase. Terakhir di-generate: 2026-05-30.

## Daftar Isi

1. [Build Pipeline Architecture](#1-build-pipeline-architecture)
2. [Docker Deployment Strategy](#2-docker-deployment-strategy)
3. [Nx Workspace Organization](#3-nx-workspace-organization)
4. [CI/CD Flow](#4-cicd-flow)
5. [Development Workflow](#5-development-workflow)
6. [Dependency Graph](#6-dependency-graph)

---

## 1. Build Pipeline Architecture

### 1.1 Urutan Build

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BUILD PIPELINE                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   [shared] ──► [ui] ──► [sdk] ──► [client-sdk] ──► [server] ──► [front]
│      │                                      │                        │
│      │                                      └──► [emails] ──────────┘
│      │                                                              │
│      └──────────────────────► [oxlint-rules] (lint dependency)      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Build Commands

```bash
# Build semua packages
bunx nx run-many -t build -p shared emails ui sdk server front client-sdk front-component-renderer

# Build per package
bunx nx build shared
bunx nx build ui
bunx nx build sdk
bunx nx build server
bunx nx build front
```

### 1.3 Build Optimization Strategies

| Strategy | Description |
|----------|-------------|
| **Topological Sort** | `dependsOn: ["^build"]` memastikan dependencies build duluan |
| **Nx Cache** | Build artifacts di-cache per project |
| **Production Input** | Build tidak recalculate saat test/storybook files berubah |
| **Memory Optimization** | `NODE_OPTIONS="--max-old-space-size=8192"` untuk frontend build |

### 1.4 Build Artifacts

| Package | Output Location | Special Handling |
|---------|----------------|-----------------|
| `server` | `packages/server/dist/` | Copy client-sdk, seed-dependencies, seed-project |
| `front` | `packages/front/build/` | Pre-built support dari host |
| `shared` | `packages/shared/dist/` | 40+ sub-entry points via barrel generation |
| `ui` | `packages/ui/dist/` | 20+ sub-entry points via barrel generation |

---

## 2. Docker Deployment Strategy

### 2.1 Multi-Stage Build Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         DOCKER BUILD TARGETS                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────────────────────┐ │
│  │  bun-base   │────►│ front-deps  │────►│    bades-front-build       │ │
│  │ (Node+Bun)  │     │             │     │    (Vite + React)          │ │
│  └─────────────┘     └─────────────┘     └─────────────────────────────┘ │
│         │                                                           │     │
│         │           ┌─────────────┐     ┌─────────────────────────┐ │     │
│         └──────────►│ server-deps  │────►│  bades-server-build     │ │     │
│                     │              │     │  (NestJS + TypeORM)     │ │     │
│                     └─────────────┘     └─────────────────────────┘ │     │
│                                                              │       │     │
│  ┌──────────────────────────────────────────────────────────┴──────┐ │     │
│  │                                                                  │ │     │
│  │   ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐    │ │     │
│  │   │bades-server │    │bades-front- │    │      bades      │    │ │     │
│  │   │(API only)   │    │    dev      │    │(Server+Front)  │    │ │     │
│  │   └─────────────┘    └─────────────┘    └─────────────────┘    │ │     │
│  │        │                                           │            │ │     │
│  │        │    ┌─────────────┐                       │            │ │     │
│  │        └───►│bades-server-│                       │            │ │     │
│  │             │    aws      │                       │            │ │     │
│  │             └─────────────┘    ┌─────────────┐   │            │ │     │
│  │                                 │ bades-aws   │◄──┘            │ │     │
│  │                                 │(Full+AWS)  │                 │ │     │
│  │                                 └─────────────┘                 │ │     │
│  └────────────────────────────────────────────────────────────────┘ │     │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Build Targets

| Target | Use Case | Size | Includes |
|--------|----------|------|----------|
| `bades-server` | API-only deployment | Small | NestJS backend |
| `bades-server-aws` | AWS-integrated deployment | Medium | + AWS CLI |
| `bades-front-dev` | Local development | Large | Hot-reload enabled |
| `bades` | **Standard production** | Medium | Server + Frontend |
| `bades-aws` | Full AWS deployment | Large | + AWS CLI |

### 2.3 Docker Compose Services

```yaml
┌─────────────────────────────────────────────────────────────────────┐
│                     DOCKER COMPOSE ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌──────────┐     ┌──────────┐     ┌──────────┐                   │
│   │  server  │────►│   redis  │     │    db    │                   │
│   │ :3000    │     │  :6379   │     │  :5432   │                   │
│   └────┬─────┘     └──────────┘     └──────────┘                   │
│        │                                                           │
│        │ Healthcheck: curl http://localhost:3000/healthz          │
│        │ Port: 3000                                                │
│        │ Volumes: server-local-data                                │
│                                                                      │
│   ┌──────────┐                                                      │
│   │  worker  │                                                      │
│   │ (queue)  │──── Depends on: server, redis, db                    │
│   └──────────┘     Command: node dist/src/queue-worker/queue-worker│
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.4 Environment Variables

| Category | Variables |
|----------|-----------|
| **Database** | `PG_DATABASE_URL` |
| **Redis** | `REDIS_URL` |
| **Server** | `NODE_PORT`, `SERVER_URL` |
| **Storage** | `STORAGE_TYPE`, `STORAGE_S3_*` |
| **Encryption** | `ENCRYPTION_KEY`, `FALLBACK_ENCRYPTION_KEY` |
| **AI** | `OPENROUTER_API_KEY`, `AI_MODEL_PREFERENCES` |
| **Multi-tenant** | `IS_MULTIWORKSPACE_ENABLED`, `IS_WORKSPACE_CREATION_LIMITED_TO_SERVER_ADMINS` |
| **Frontend** | `FRONTEND_URL`, `DEFAULT_SUBDOMAIN` |

### 2.5 Security Hardening

- **Non-root user**: Container runs as `USER 1000`
- **No secrets in image**: Passwords from env vars or secrets files
- **Minimal base image**: Alpine Linux (~150MB vs ~900MB Debian)
- **Healthchecks**: Automatic service monitoring
- **ENTRYPOINT wrapper**: `/app/entrypoint.sh` script

---

## 3. Nx Workspace Organization

### 3.1 Package Structure

```
packages/
├── front/                    # React + Vite frontend (scope:frontend)
├── server/                   # NestJS backend (scope:backend)
├── shared/                   # Metadata constants, helpers (scope:shared)
├── ui/                       # Design system (scope:shared)
├── sdk/                      # Bades SDK (scope:sdk)
├── client-sdk/               # Client SDK (scope:sdk)
├── emails/                   # Email templates (scope:backend)
├── oxlint-rules/             # Custom lint plugin (scope:shared)
└── front-component-renderer/ # Component renderer (scope:frontend)
```

### 3.2 Nx Target Defaults

```json
{
  "build": {
    "cache": true,
    "inputs": ["^production", "production"],
    "dependsOn": ["^build"]
  },
  "start": {
    "cache": false,
    "dependsOn": ["^build"]
  },
  "lint": {
    "executor": "nx:run-commands",
    "cache": true,
    "dependsOn": ["^build", "oxlint-rules:build"]
  },
  "typecheck": {
    "executor": "nx:run-commands",
    "cache": true,
    "dependsOn": ["^build"]
  },
  "test": {
    "executor": "@nx/jest:jest",
    "cache": true,
    "dependsOn": ["^build"]
  }
}
```

### 3.3 Named Inputs Strategy

```json
"production": [
  "default",
  "excludeStories",   // *.stories.tsx, __stories__/
  "excludeTests",     // *.test.ts, *.spec.ts, *.integration-spec.ts
  "!{projectRoot}/**/__mocks__/*",
  "!{projectRoot}/**/testing/*"
]
```

**Benefits:**
- Build cache tidak invalid saat test files berubah
- Storybook changes tidak trigger rebuild
- Mock files bukan validasi build

### 3.4 Cache Locations

| Cache Type | Location |
|------------|----------|
| Build | `{projectRoot}/dist` |
| Jest | `../../.cache/jest/{projectRoot}` |
| Prettier | `../../.cache/prettier/{projectRoot}` |
| oxlint | `oxlint-rules:build` output |

---

## 4. CI/CD Flow

### 4.1 End-to-End Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CI PIPELINE                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────┐    ┌─────────┐    ┌────────────┐    ┌───────────┐              │
│  │   PR    │───►│  Build  │───►│    Lint    │───►│ Typecheck │              │
│  │ Push    │    │ (20m)   │    │   (15m)    │    │   (15m)   │              │
│  └─────────┘    └─────────┘    └────────────┘    └───────────┘              │
│                                              │                               │
│                                              ▼                               │
│                                       ┌───────────┐                          │
│                                       │   Test    │                          │
│                                       │ Unit (20m)│                          │
│                                       └───────────┘                          │
│                                              │                               │
│                                              ▼                               │
│                                 ┌─────────────────────┐                     │
│                                 │ Integration Tests   │                     │
│                                 │  + DB Reset (45m)   │                     │
│                                 └─────────────────────┘                     │
│                                              │                               │
│                                              ▼                               │
│                                       ┌───────────┐                          │
│                                       │  ✅ PASS  │                          │
│                                       └───────────┘                          │
│                                              │                               │
└──────────────────────────────────────────────┼───────────────────────────────┘
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DEPLOY PIPELINE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐    ┌────────────────┐    ┌──────────────┐                 │
│  │   Tag v*    │───►│ Build & Push   │───►│  Deploy to   │                 │
│  │ Push to main │    │ Image to GHCR  │    │ Railway/etc  │                 │
│  └─────────────┘    └────────────────┘    └──────────────┘                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Quality Gates

| Gate | Tool | Timeout | Description |
|------|------|---------|-------------|
| 1 | **Build** | 20m | Compile semua packages |
| 2 | **Lint** | 15m | oxlint + prettier check |
| 3 | **Typecheck** | 15m | TypeScript strict mode |
| 4 | **Unit Tests** | 20m | Jest dengan coverage |
| 5 | **Integration** | 45m | Full stack + DB reset |

### 4.3 Docker Image Build

```bash
# Build target standard (server + frontend)
docker build --target bades -f Dockerfile .

# Build target server-only (API)
docker build --target bades-server -f Dockerfile .

# Build dengan custom tag
docker build --target bades -f Dockerfile -t my-registry/bades:custom-tag .
```

### 4.4 GitHub Actions Cache

| Cache Type | Backend | Mode |
|------------|---------|------|
| Docker layers | `type=gha` | `mode=max` (semua layers) |
| Nx build | GitHub Actions cache | Per project |
| Jest | Directory cache | Per project |
| Prettier | File cache | Metadata-based |

### 4.5 Image Tags

| Trigger | Tag | Example |
|---------|-----|---------|
| Default branch | `latest` | `ghcr.io/nonomnonom/bades:latest` |
| Tag push | `v*.*.*` | `ghcr.io/nonomnonom/bades:v1.2.3` |
| Commit SHA | `sha-{short}` | `ghcr.io/nonomnonom/bades:sha-abc1234` |

---

## 5. Development Workflow

### 5.1 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/nonomnonom/bades.git
cd bades

# 2. Install dependencies (Bun)
bun install

# 3. Setup environment
bunx nx reset:env server
bunx nx reset:env front

# 4. Start development
bun start              # Start semua (frontend + backend + worker)
# atau
bunx nx start front    # Frontend only
bunx nx start server  # Backend only
```

### 5.2 Hot Reload Development

```bash
# Frontend dengan HMR (hot module replacement)
bunx nx start front

# Backend dengan watch mode
bunx nx start server

# Queue worker dengan watch mode
bunx nx run server:worker
```

### 5.3 Docker Development

```bash
# Start semua services via Docker Compose
docker-compose up

# Start dengan custom image
BADES_IMAGE=ghcr.io/nonomnonom/bades:latest docker-compose up

# Start server-only (API)
docker-compose up server

# Development dengan hot-reload container
docker build --target bades-front-dev -f Dockerfile -t bades:dev .
docker run -v $(pwd)/packages/front:/app/packages/front bades:dev
```

### 5.4 Database Operations

```bash
# Initialize database
bunx nx run server:database:init

# Run migrations
bunx nx run server:database:migrate

# Reset database (with seed)
bunx nx run server:database:reset

# Reset database (no seed)
bunx nx run server:database:reset --configuration=no-seed

# Generate migration
bunx nx run server:database:migrate:generate --name <name>
```

### 5.5 Code Quality

```bash
# Lint changed files dari main branch
bunx nx lint:diff-with-main front --configuration=fix
bunx nx lint:diff-with-main server --configuration=fix

# Full lint
bunx nx lint front
bunx nx lint server

# Typecheck
bunx nx typecheck front
bunx nx typecheck server

# Tests
bunx nx test front
bunx nx test server

# Integration tests (with DB reset)
bunx nx run server:test:integration:with-db-reset
```

---

## 6. Dependency Graph

### 6.1 Full Package Dependencies

```
                          ┌─────────────────────────────────────────┐
                          │            EXTERNAL DEPENDENCIES          │
                          │  PostgreSQL 16 │ Redis │ ClickHouse 25   │
                          └─────────────────────────────────────────┘
                                             │
                                             │ runtime
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                           PACKAGE DEPENDENCY GRAPH                             │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   ┌─────────────┐                                                               │
│   │   shared   │  ← Metadata constants, helpers                                │
│   │ (no deps)  │    shared/metadata, shared/utils                              │
│   └──────┬─────┘                                                               │
│          │                                                                     │
│          ▼                                                                     │
│   ┌─────────────┐                                                               │
│   │     ui     │  ← Design system components                                   │
│   │  depends:  │                                                               │
│   │   shared   │                                                               │
│   └──────┬─────┘                                                               │
│          │                                                                     │
│          ▼                                                                     │
│   ┌─────────────┐         ┌─────────────┐                                       │
│   │    sdk     │◄────────│client-sdk   │                                       │
│   │  depends:  │         │  depends:   │                                       │
│   │   shared   │         │   shared    │                                       │
│   └──────┬─────┘         └──────┬──────┘                                       │
│          │                     │                                               │
│          │     ┌───────────────┴───────────────┐                               │
│          │     │                               │                               │
│          ▼     ▼                               ▼                               │
│   ┌─────────────┐                     ┌─────────────┐                           │
│   │   server    │                     │    front    │                           │
│   │  depends:   │                     │  depends:   │                           │
│   │  - shared   │                     │  - shared   │                           │
│   │  - client-sdk                    │  - ui       │                           │
│   │  - emails   │                     │  - sdk      │                           │
│   │  - front    │                     │  - client-sdk                      │
│   └──────┬─────┘                     └──────┬─────┘                           │
│          │                               │                                   │
│          │     ┌─────────────────────────┴─────────┐                         │
│          │     │                                   │                         │
│          ▼     ▼                                   ▼                         │
│   ┌─────────────┐                         ┌─────────────┐                     │
│   │   emails    │                         │ front-      │                     │
│   │  depends:   │                         │ component-  │                     │
│   │   shared    │                         │ renderer    │                     │
│   └─────────────┘                         │  depends:  │                     │
│                                          │   shared   │                     │
│                                          └─────────────┘                     │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐ │
│   │                     SPECIAL DEPENDENCIES                                 │ │
│   │                                                                          │ │
│   │   oxlint-rules ────────────────────────────────────────────────────────►│ │
│   │   (Nx plugin untuk lint, tidak di-import sebagai library)                │ │
│   │                                                                          │ │
│   └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
└────────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Build Order (Topological Sort)

```
Step 1: shared
Step 2: ui, oxlint-rules
Step 3: sdk, client-sdk, emails
Step 4: server, front, front-component-renderer
```

Nx `dependsOn: ["^build"]` secara otomatis menghitung urutan ini.

---

## 7. Key Insights

### 7.1 Mengapa Alpine Linux?

- **Size**: ~150MB vs ~900MB untuk Debian-based images
- **Security**: Built-in vulnerability scanning, minimal attack surface
- **Speed**: Pertumbuhan image lebih cepat

### 7.2 Mengapa Bun?

- **Speed**: Install 10x lebih cepat dari npm/yarn
- **Workspace**: Native `--filter` untuk monorepo
- **Production prune**: `bun install --production` drop devDependencies

### 7.3 Mengapa Multiple Build Targets?

- ** Flexibility**: API-only vs full-stack deployment
- **AWS variants**: deployments yang butuh AWS CLI
- **Dev variant**: Hot-reload untuk development

### 7.4 Mengapa oxlint-rules sebagai Dependency khusus?

- oxlint adalah custom lint plugin yang di-build sebagai Nx plugin
- Tidak di-import sebagai library biasa
-butuh build terlebih dahulu sebelum lint job bisa run

### 7.5 Mengapa ClickHouse?

- Analytics/event tracking dengan OLAP queries
- Billing system butuh agregasi data yang tidak cocok di PostgreSQL
- High-volume event storage

---

## 8. Quick Reference

### 8.1 Common Commands

```bash
# Development
bun start                          # Start semua services
bunx nx start front                # Frontend only
bunx nx start server              # Backend only

# Build
bunx nx build front
bunx nx build server

# Tests
bunx nx test front
bunx nx test server
bunx nx run server:test:integration:with-db-reset

# Code Quality
bunx nx lint:diff-with-main front --configuration=fix
bunx nx lint:diff-with-main server --configuration=fix

# Docker
docker build --target bades -f Dockerfile .
docker-compose up
docker-compose up server worker
```

### 8.2 Environment Variables (.env)

```bash
# Database
PG_DATABASE_URL=postgres://user:pass@host:5432/db

# Redis
REDIS_URL=redis://host:6379

# Server
NODE_PORT=3000
SERVER_URL=https://api.example.com

# Storage
STORAGE_TYPE=local  # atau s3
STORAGE_S3_REGION=ap-southeast-1
STORAGE_S3_NAME=bucket-name
STORAGE_S3_ENDPOINT=https://s3.ap-southeast-1.amazonaws.com

# Security
ENCRYPTION_KEY=your-32-char-key
FALLBACK_ENCRYPTION_KEY=fallback-key
APP_SECRET=app-secret

# AI
OPENROUTER_API_KEY=sk-or-...

# Multi-tenant
IS_MULTIWORKSPACE_ENABLED=true
IS_WORKSPACE_CREATION_LIMITED_TO_SERVER_ADMINS=false

# Frontend
FRONTEND_URL=http://localhost:3000
DEFAULT_SUBDOMAIN=app
```

### 8.3 Ports

| Service | Port | Description |
|---------|------|-------------|
| server | 3000 | Main API server |
| postgres | 5432 | PostgreSQL database |
| redis | 6379 | Redis cache |
| clickhouse | 8123, 9000 | ClickHouse (HTTP + Native) |
| storybook | 6006, 6007 | Storybook instances |

---

*Dokumentasi ini di-generate secara otomatis dari analisis codebase. Untuk update terbaru,jalankan ulang analisis dengan team agent.*
