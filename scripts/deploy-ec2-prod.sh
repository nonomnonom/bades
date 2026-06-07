#!/usr/bin/env bash
# Deploy Bades ke EC2 produksi — pull image GHCR, tanpa build di VPS.
# Prasyarat: clone repo + .env di repo root.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
COMPOSE_FILE="${REPO_ROOT}/packages/bades-docker/docker-compose.prod.yml"
ENV_FILE="${REPO_ROOT}/.env"
IMAGE="${BADES_IMAGE:-ghcr.io/nonomnonom/bades:latest}"

cd "${REPO_ROOT}"

echo "== Deploy Bades $(date -Is) =="
echo "Image: ${IMAGE}"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "ERROR: ${ENV_FILE} tidak ditemukan"
  exit 1
fi

if grep -q '^BADES_IMAGE=' "${ENV_FILE}"; then
  sed -i "s|^BADES_IMAGE=.*|BADES_IMAGE=${IMAGE}|" "${ENV_FILE}"
else
  echo "BADES_IMAGE=${IMAGE}" >> "${ENV_FILE}"
fi

echo "Login GHCR jika image private: echo \$GITHUB_TOKEN | docker login ghcr.io -u USER --password-stdin"
docker pull "${IMAGE}"

docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" -p bades-prod up -d --force-recreate server worker

echo "Waiting for server health..."
server_healthy=false
for _ in $(seq 1 24); do
  if docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" -p bades-prod exec -T server \
    curl -fsS http://127.0.0.1:3000/healthz >/dev/null 2>&1; then
    echo "Server healthy"
    server_healthy=true
    break
  fi
  sleep 10
done

if [[ "${server_healthy}" != "true" ]]; then
  echo "ERROR: Server tidak healthy setelah 240 detik"
  docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" -p bades-prod logs server --tail 100
  exit 1
fi

if ! docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" -p bades-prod exec -T server \
  node dist/command/command run-instance-commands --force; then
  echo "ERROR: run-instance-commands gagal"
  exit 1
fi

docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" -p bades-prod ps
echo "Deploy selesai: ${IMAGE}"
