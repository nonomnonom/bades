# Bades Docker

Struktur mengikuti `packages/twenty-docker/` di Twenty CRM — **semua artefak Docker ada di sini**, bukan di repo root.

| Path | Pemakaian |
|------|-----------|
| `docker-compose.dev.yml` | Postgres + Redis — native dev via `packages/utils/setup-dev-env.sh` |
| `docker-compose.yml` | Stack GHCR (server + worker + db + redis) |
| `docker-compose.prod.yml` | Produksi VPS + Caddy TLS |
| `.env.example` | Env stack GHCR |
| `.env.production.vps.example` | Env template VPS (Caddy + TRUST_PROXY) |
| `bades/Dockerfile` | Image runtime (target `bades`, `bades-server`, …) |
| `bades/entrypoint.sh` | Migrasi DB + cron saat container start |
| `caddy/Caddyfile` | Reverse proxy produksi (Cloudflare DNS) |
| `caddy/Dockerfile` | Build Caddy + plugin Cloudflare (opsional) |
| `Makefile` | `prod-build`, `stack-up`, `dev-infra-up`, … |

## Dev infra (Postgres + Redis)

```bash
bash packages/utils/setup-dev-env.sh
# atau
make -C packages/bades-docker dev-infra-up
```

## Stack GHCR lokal

```bash
cp packages/bades-docker/.env.example .env
docker compose -f packages/bades-docker/docker-compose.yml up -d
```

## Build image

```bash
make -C packages/bades-docker prod-build
# atau
docker build --target bades -f packages/bades-docker/bades/Dockerfile .
```

## Produksi VPS

```bash
cp packages/bades-docker/.env.production.vps.example .env
docker compose -f packages/bades-docker/docker-compose.prod.yml --env-file .env -p bades-prod up -d
bash scripts/deploy-ec2-prod.sh   # rolling update server+worker
```

Yang tetap di repo root: `.dockerignore` (build context monorepo).
