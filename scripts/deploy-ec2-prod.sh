#!/usr/bin/env bash
# Deploy Bades ke EC2 produksi — pull image GHCR, tanpa build/clone di VPS.
# Prasyarat: .env + docker-compose.prod.yml + Caddyfile di /home/ubuntu
set -euo pipefail

cd /home/ubuntu
IMAGE="${BADES_IMAGE:-ghcr.io/nonomnonom/bades:latest}"

echo "== Deploy Bades $(date -Is) =="
echo "Image: ${IMAGE}"

if [[ ! -f .env ]]; then
  echo "ERROR: /home/ubuntu/.env tidak ditemukan"
  exit 1
fi

if grep -q '^BADES_IMAGE=' .env; then
  sed -i "s|^BADES_IMAGE=.*|BADES_IMAGE=${IMAGE}|" .env
else
  echo "BADES_IMAGE=${IMAGE}" >> .env
fi

docker pull "${IMAGE}"

docker compose -f docker-compose.prod.yml --env-file .env -p bades-prod up -d --force-recreate server worker

echo "Waiting for server health..."
for _ in $(seq 1 24); do
  if docker compose -f docker-compose.prod.yml --env-file .env -p bades-prod exec -T server \
    curl -fsS http://127.0.0.1:3000/healthz >/dev/null 2>&1; then
    echo "Server healthy"
    break
  fi
  sleep 10
done

docker compose -f docker-compose.prod.yml --env-file .env -p bades-prod exec -T server \
  node dist/command/command run-instance-commands --force || true

docker compose -f docker-compose.prod.yml --env-file .env -p bades-prod ps
echo "Deploy selesai: ${IMAGE}"
