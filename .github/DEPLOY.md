# Deploy Bades — Docker

Stack runtime Bades pakai Docker. Semua artefak di `packages/docker/`.

> Catatan: ini repo privat tim Bades. Panduan ini untuk operator internal.
> Infrastruktur hosting (cloud provider, VM, dll) belum difinalkan — yang
> di-dokumentasikan di sini adalah cara menjalankan image production Docker
> di host manapun.

---

## Prasyarat

- Docker Engine 24+ dan Docker Compose plugin v2
- 4 GB RAM minimum untuk host (server + worker + db + redis)

## Lokal — build image

```bash
# Dari root repo
make -C packages/docker prod-build
# atau langsung
docker build --target bades \
  -f packages/docker/bades/Dockerfile \
  --tag bades:latest .
```

Verifikasi:

```bash
docker images bades
```

## Lokal — jalankan stack penuh

```bash
cd packages/docker
cp .env.example .env
# Isi minimal: APP_SECRET, ENCRYPTION_KEY (openssl rand -base64 32)
# Untuk dev sederhana, biarkan PG_DATABASE_PASSWORD default 'postgres'.

docker compose up -d
docker compose ps
```

Health check:

```bash
curl http://localhost:3000/healthz
# Expected: {"status":"ok"}
```

Server log:

```bash
docker compose logs -f server
```

## Dev — hanya Postgres + Redis (kerja dari source)

```bash
docker compose -f packages/docker/docker-compose.dev.yml up -d
# Lalu di terminal lain
yarn start  # server + front dari source
```

## Database migrate

Saat first run, server di compose otomatis run migrations. Manual override:

```bash
docker compose exec server yarn database:migrate
```

Reset DB (dev only — destruktif):

```bash
docker compose exec server yarn database:reset
```

## Update image

```bash
# Build versi baru
make -C packages/docker prod-build TAG=v1.0.1

# Restart container
TAG=v1.0.1 docker compose up -d --no-deps server worker
```

## Rollback

```bash
TAG=v1.0.0 docker compose up -d --no-deps server worker
```

## Backup database

```bash
docker compose exec -T db pg_dumpall -U postgres > backup-$(date +%F).sql
# Restore
docker compose exec -T db psql -U postgres < backup-YYYY-MM-DD.sql
```

## Production deployment

Setup production di host Docker (VM cloud / bare metal):

1. Clone repo ke host
2. `cp packages/docker/.env.example packages/docker/.env` dan isi nilai
   produksi (DB password kuat, ENCRYPTION_KEY random, SERVER_URL domain
   nyata, dll)
3. `cd packages/docker && docker compose up -d`
4. Reverse proxy host (Caddy / Nginx / Traefik) → `http://localhost:3000`
   untuk HTTPS

Saat infrastruktur final dipilih, tambah dokumentasi provisioning di
sini.

## Troubleshooting

**Container restart loop**: cek `docker compose logs server` — biasanya
`APP_SECRET` / `ENCRYPTION_KEY` belum di-set di `.env`.

**Healthz 503**: tunggu ~60 detik untuk migrate selesai. Cek log
migrate: `docker compose logs server | grep migration`.

**Out of memory build**: butuh minimal 6 GB RAM saat yarn install
(turunkan dengan `DOCKER_BUILDKIT=1` + multistage caching).

**Postgres data hilang setelah `docker compose down -v`**: flag `-v`
menghapus volumes. Untuk stop tanpa wipe, pakai `docker compose down`
saja (tanpa `-v`).
