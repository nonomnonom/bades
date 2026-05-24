#!/usr/bin/env bash
# setup-zero-downtime.sh
#
# Jalankan SEKALI di EC2 (ssh ubuntu@bades.id) untuk:
#   1. Install plugin docker-rollout (swap container baru sebelum stop lama)
#   2. Patch Caddyfile: tambah retry + active health-check supaya selama
#      container restart, Caddy retry 30 detik alih-alih lempar 502
#   3. Reload Caddy
#
# Idempotent: aman dijalankan ulang.

set -euo pipefail

COMPOSE_DIR="${COMPOSE_DIR:-/home/ubuntu}"
CADDYFILE="${CADDYFILE:-${COMPOSE_DIR}/Caddyfile}"

echo "==> [1/3] Install docker-rollout plugin (jika belum ada)"
PLUGIN_DIR="${HOME}/.docker/cli-plugins"
PLUGIN_BIN="${PLUGIN_DIR}/docker-rollout"
if [ ! -x "${PLUGIN_BIN}" ]; then
  mkdir -p "${PLUGIN_DIR}"
  curl -fsSL https://raw.githubusercontent.com/Wowu/docker-rollout/master/docker-rollout \
    -o "${PLUGIN_BIN}"
  chmod +x "${PLUGIN_BIN}"
  echo "    docker-rollout terinstall di ${PLUGIN_BIN}"
else
  echo "    docker-rollout sudah ada, skip"
fi
sudo docker rollout --help >/dev/null 2>&1 && echo "    plugin OK"

echo "==> [2/3] Patch Caddyfile: tambah retry + active health-check"
if [ ! -f "${CADDYFILE}" ]; then
  echo "    Caddyfile tidak ditemukan di ${CADDYFILE} — set env CADDYFILE=/path/ke/Caddyfile"
  exit 1
fi

cp "${CADDYFILE}" "${CADDYFILE}.bak.$(date +%s)"
echo "    backup: ${CADDYFILE}.bak.*"

# Sisipkan opsi retry di setiap blok `reverse_proxy server:3000` yang belum punya
# `lb_try_duration`. Pakai Python untuk parsing yang andal terhadap blok.
python3 - "${CADDYFILE}" <<'PY'
import re, sys, pathlib

path = pathlib.Path(sys.argv[1])
text = path.read_text()

retry_block = """    health_uri /healthz
    health_interval 5s
    health_timeout 3s
    lb_try_duration 30s
    lb_try_interval 1s
    fail_duration 10s"""

# Cari `reverse_proxy server:3000` baik inline maupun blok
pattern = re.compile(
    r'reverse_proxy\s+server:3000\s*(\{[^}]*\})?',
    re.MULTILINE | re.DOTALL,
)

def replace(match: re.Match) -> str:
    block = match.group(1) or ''
    if 'lb_try_duration' in block:
        return match.group(0)  # sudah dipatch
    if block:
        inner = block.strip().lstrip('{').rstrip('}').strip()
        merged = inner + '\n' + retry_block if inner else retry_block
        return f'reverse_proxy server:3000 {{\n{merged}\n}}'
    return f'reverse_proxy server:3000 {{\n{retry_block}\n}}'

new = pattern.sub(replace, text)
if new == text:
    print('    Caddyfile sudah punya retry config — skip')
else:
    path.write_text(new)
    print('    Caddyfile dipatch')
PY

echo "==> [3/3] Validate & reload Caddy"
sudo docker compose --env-file "${COMPOSE_DIR}/.env" -f "${COMPOSE_DIR}/docker-compose.yml" \
  exec -T caddy caddy validate --config /etc/caddy/Caddyfile
sudo docker compose --env-file "${COMPOSE_DIR}/.env" -f "${COMPOSE_DIR}/docker-compose.yml" \
  exec -T caddy caddy reload --config /etc/caddy/Caddyfile

echo
echo "Setup selesai. Deploy berikutnya akan zero-downtime via docker rollout + Caddy retry."
