# Deploy Bades

Bades dijalankan sebagai satu image Docker yang dipakai oleh dua service
runtime: `server` (server + frontend) dan `worker` (background jobs,
command beda). Image resmi di-build oleh workflow `build-image.yaml` dan
dipublikasikan ke GHCR: `ghcr.io/<owner>/bades`. Tag yang tersedia:
`latest`, commit SHA pendek, dan tag rilis `vX.Y.Z`.

Repo ini tidak lagi memaketkan flow deploy ke server tertentu. Operator
internal memilih platform sendiri (Railway, Render, VPS, dsb) dan
menjalankan image yang sama lewat Docker Compose atau platform setara.

> Pola deploy (mengikuti Twenty Railway template): satu image, dua service
> (server + worker) + Postgres + Redis. Cocok untuk platform managed
> (Railway/Render) maupun host Docker mandiri.

---

## Prasyarat

- Docker Engine 24+ dan Docker Compose plugin v2
- 4 GB RAM minimum untuk host (server + worker + db + redis)

## Build image lokal

```bash
make prod-build
# atau langsung
docker build --target bades -f Dockerfile --tag bades:latest .
```

Image yang sama dipakai oleh service `server` dan `worker` di Docker
Compose — bedanya hanya command (`worker` pakai `yarn worker:prod`).

## Jalankan stack lewat Docker Compose

```bash
cp .env.example .env
# Isi minimal:
#   ENCRYPTION_KEY    (openssl rand -base64 32)
#   APP_SECRET        (openssl rand -base64 32)
#   SERVER_URL        (URL publik instance, atau http://localhost:3000)

docker compose up -d
docker compose ps
curl http://localhost:3000/healthz   # ekspektasi: {"status":"ok"}
```

Service yang jalan: `server`, `worker`, `db` (Postgres 16), `redis`.

### Dev — hanya Postgres + Redis

Untuk kerja dari source, hidupkan service infra saja:

```bash
docker compose up -d db redis
yarn start
```

## Deploy ke Railway (atau platform serupa)

1. Buat project baru di Railway.
2. Tambah service Postgres dan Redis dari plugin Railway.
3. Tambah service aplikasi `server` dari image
   `ghcr.io/<owner>/bades:latest` (atau build dari Dockerfile repo dengan
   target `bades`).
4. Set environment variable mengikuti `.env.example`:
   - `PG_DATABASE_URL` -> URL Postgres dari plugin Railway
   - `REDIS_URL` -> URL Redis dari plugin Railway
   - `SERVER_URL` -> URL publik Railway
   - `ENCRYPTION_KEY`, `APP_SECRET` -> hasil `openssl rand -base64 32`
   - `STORAGE_TYPE=local` untuk awal, atau `s3` + kredensial S3
5. Tambah service `worker` dari **image yang sama**
   (`ghcr.io/<owner>/bades:latest`), override command jadi
   `yarn worker:prod`, dan set `DISABLE_DB_MIGRATIONS=true` +
   `DISABLE_CRON_JOBS_REGISTRATION=true`.
6. Expose service server di port 3000.

## Update image

```bash
# Tarik image terbaru di host Docker
docker compose pull
docker compose up -d
```

Untuk pinned version:

```bash
TAG=v1.0.1 docker compose up -d
```

## Database migrate

Server menjalankan migrasi otomatis saat startup. Manual override:

```bash
docker compose exec server yarn database:migrate
```

Reset DB (destruktif, dev only):

```bash
docker compose exec server yarn database:reset
```

## Backup database

```bash
docker compose exec -T db pg_dumpall -U postgres > backup-$(date +%F).sql
# Restore
docker compose exec -T db psql -U postgres < backup-YYYY-MM-DD.sql
```

## Recovery workspace kosong — workspace:reseed:sid-standard

Jika sebuah workspace tampil kosong (0 record, objek SID tidak muncul),
gunakan command ini untuk menjalankan ulang seed SID standar tanpa
menghapus data yang sudah ada.

**Kapan dipakai:**
- Workspace baru kosong karena INSERT data silent-fail (mismatch kolom/enum
  yang sudah di-fix, tapi workspace sudah terlanjur dibuat).
- Workspace lama yang dibuat sebelum SID standard ditambahkan ke flow init.
- Pasca-upgrade ketika `seedSidStandardData` belum pernah berjalan untuk
  workspace tertentu.

**Cara invoke dari container:**

```bash
# Satu workspace (paling umum untuk recovery)
docker compose exec server yarn command:prod workspace:reseed:sid-standard \
  --workspace-id <UUID>

# Semua workspace aktif/suspended sekaligus
docker compose exec server yarn command:prod workspace:reseed:sid-standard

# Cek dulu tanpa eksekusi (dry run)
docker compose exec server yarn command:prod workspace:reseed:sid-standard \
  --workspace-id <UUID> --dry-run
```

Command ini idempotent: objek yang sudah ada di-skip, record yang sudah ada
tidak digandakan (`ON CONFLICT DO NOTHING`). Aman dijalankan ulang.

**Urutan langkah yang dijalankan:**
1. Seed objek + field metadata SID standar (skip yang sudah ada)
2. Insert sample record contoh ke schema workspace (ON CONFLICT DO NOTHING)
3. Sembunyikan field non-curated dari tampilan default

## Troubleshooting

**Container restart loop**: cek `docker compose logs server` — biasanya
`APP_SECRET` / `ENCRYPTION_KEY` belum di-set di `.env`.

**Healthz 503**: tunggu ~60 detik untuk migrate selesai. Cek log
migrate: `docker compose logs server | grep migration`.

**Postgres data hilang setelah `docker compose down -v`**: flag `-v`
menghapus volumes. Untuk stop tanpa wipe, pakai `docker compose down`
saja (tanpa `-v`).
