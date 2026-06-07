# Caddy + plugin Cloudflare DNS — base Debian Bookworm (bukan Alpine).
FROM golang:1.24-bookworm AS builder

RUN apt-get update \
    && apt-get install -y --no-install-recommends git ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN go install github.com/caddyserver/xcaddy/cmd/xcaddy@v0.4.4

ARG CADDY_VERSION=v2.9.1
RUN xcaddy build "${CADDY_VERSION}" --with github.com/caddy-dns/cloudflare

FROM debian:bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates wget \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/bin/caddy /usr/bin/caddy

ENV XDG_CONFIG_HOME=/config \
    XDG_DATA_HOME=/data

EXPOSE 80 443 443/udp 2019

ENTRYPOINT ["caddy"]
CMD ["run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
