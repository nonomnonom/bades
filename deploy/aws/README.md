# Deploy Bades di AWS EC2 (Docker Compose)

Panduan singkat untuk menjalankan stack lengkap (server + worker + Postgres + Redis) di satu instance EC2.

## Prasyarat

- EC2 Amazon Linux 2023, min. 4 GB RAM (mis. `c7i-flex.large`)
- Security group: port **22**, **3000** (dan **80/443** jika pakai reverse proxy)
- Key pair SSH (`bades-ec2`)
- Image GHCR: `ghcr.io/nonomnonom/bades:latest`

## Quick start

```bash
# Dari laptop — copy file deploy ke EC2
scp -i ~/.ssh/bades-ec2 -r docker-compose.yml deploy ec2-user@108.136.142.44:/opt/bades/

# SSH ke EC2
ssh -i ~/.ssh/bades-ec2 ec2-user@108.136.142.44

# Install Docker + jalankan stack
cd /opt/bades
sudo cp deploy/aws/.env.example .env
# Edit .env: OPENROUTER_API_KEY, SERVER_URL (domain), password jika perlu
sudo bash deploy/aws/setup-ec2.sh
```

Atau manual:

```bash
cd /opt/bades
docker compose -f docker-compose.yml -f deploy/aws/docker-compose.prod.yml pull
docker compose -f docker-compose.yml -f deploy/aws/docker-compose.prod.yml up -d
curl http://127.0.0.1:3000/healthz
```

## Update image

```bash
cd /opt/bades
docker compose -f docker-compose.yml -f deploy/aws/docker-compose.prod.yml pull
docker compose -f docker-compose.yml -f deploy/aws/docker-compose.prod.yml up -d
```

## Perintah operasional

```bash
# Log
docker compose -f docker-compose.yml -f deploy/aws/docker-compose.prod.yml logs -f server

# Reseed workspace SID
docker compose -f docker-compose.yml -f deploy/aws/docker-compose.prod.yml exec server \
  bun run command:prod workspace:reseed:sid-standard --workspace-id <UUID>

# Backup DB
docker compose -f docker-compose.yml -f deploy/aws/docker-compose.prod.yml exec -T db \
  pg_dumpall -U postgres > backup-$(date +%F).sql
```

## TLS / domain

Pasang Caddy atau nginx di host sebagai reverse proxy ke `127.0.0.1:3000`, lalu set `SERVER_URL` dan `FRONTEND_URL` ke `https://domain-anda`.

## GHCR private

Jika pull gagal 401:

```bash
export GITHUB_TOKEN=ghp_...
export GITHUB_USER=nonomnonom
echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_USER" --password-stdin
```
