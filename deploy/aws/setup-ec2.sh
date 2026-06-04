#!/usr/bin/env bash
# Setup host EC2 Amazon Linux 2023 untuk menjalankan Bades via Docker Compose.
# Jalankan sebagai root atau dengan sudo:
#   curl -fsSL ... | bash
#   atau: sudo bash deploy/aws/setup-ec2.sh

set -euo pipefail

BADES_DIR="${BADES_DIR:-/opt/bades}"
COMPOSE_FILES="-f docker-compose.yml -f deploy/aws/docker-compose.prod.yml"

echo "==> Install Docker (Amazon Linux 2023)"
if ! command -v docker >/dev/null 2>&1; then
  dnf update -y
  dnf install -y docker
  systemctl enable docker
  systemctl start docker
  usermod -aG docker ec2-user || true
fi

if ! docker compose version >/dev/null 2>&1; then
  dnf install -y docker-compose-plugin 2>/dev/null || {
    mkdir -p /usr/local/lib/docker/cli-plugins
    curl -SL "https://github.com/docker/compose/releases/download/v2.32.4/docker-compose-linux-x86_64" \
      -o /usr/local/lib/docker/cli-plugins/docker-compose
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
  }
fi

echo "==> Siapkan direktori ${BADES_DIR}"
mkdir -p "${BADES_DIR}"
cd "${BADES_DIR}"

if [[ ! -f .env ]]; then
  echo "==> Generate .env dari template"
  cp deploy/aws/.env.example .env
  PUBLIC_IP=$(curl -fsS -H "X-aws-ec2-metadata-token: $(curl -fsS -X PUT http://169.254.169.254/latest/api/token -H 'X-aws-ec2-metadata-token-ttl-seconds: 60')" \
    http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || hostname -I | awk '{print $1}')
  sed -i "s|SERVER_URL=.*|SERVER_URL=http://${PUBLIC_IP}:3000|" .env
  sed -i "s|FRONTEND_URL=.*|FRONTEND_URL=http://${PUBLIC_IP}:3000|" .env
  PG_PASS="$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 32)"
  REDIS_PASS="$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 32)"
  ENC_KEY="$(openssl rand -base64 32)"
  APP_SEC="$(openssl rand -base64 32)"
  sed -i "s|PG_DATABASE_PASSWORD=.*|PG_DATABASE_PASSWORD=${PG_PASS}|" .env
  sed -i "s|REDIS_PASSWORD=.*|REDIS_PASSWORD=${REDIS_PASS}|" .env
  sed -i "s|ENCRYPTION_KEY=.*|ENCRYPTION_KEY=${ENC_KEY}|" .env
  sed -i "s|APP_SECRET=.*|APP_SECRET=${APP_SEC}|" .env
  cat >> .env <<'EOF'
AI_MODEL_PREFERENCES={"disabledModels":[],"recommendedModels":["openrouter/tencent/hy3-preview"],"defaultFastModels":["openrouter/tencent/hy3-preview"],"defaultSmartModels":["openrouter/tencent/hy3-preview"]}
EOF
  chmod 600 .env
  echo "    .env dibuat — edit OPENROUTER_API_KEY dan SERVER_URL domain jika perlu."
fi

echo "==> Login GHCR (opsional, skip jika image public)"
if [[ -n "${GITHUB_TOKEN:-}" ]]; then
  echo "${GITHUB_TOKEN}" | docker login ghcr.io -u "${GITHUB_USER:-nonomnonom}" --password-stdin
fi

echo "==> Pull image & start stack"
docker compose ${COMPOSE_FILES} pull
docker compose ${COMPOSE_FILES} up -d

echo "==> Tunggu healthcheck..."
for i in $(seq 1 60); do
  if curl -sf http://127.0.0.1:3000/healthz >/dev/null 2>&1; then
    echo "Bades OK: http://${PUBLIC_IP:-127.0.0.1}:3000/healthz"
    exit 0
  fi
  sleep 5
done

echo "Healthcheck belum OK — cek: docker compose ${COMPOSE_FILES} logs server"
exit 1
