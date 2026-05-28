# ===========================================================================
# Dependency stages
# ===========================================================================

FROM node:24.15.0-alpine3.23@sha256:d1b3b4da11eefd5941e7f0b9cf17783fc99d9c6fc34884a665f40a06dbdfc94f AS bun-base

# Install Bun on top of Node 24 alpine. Node tetap runtime untuk `node dist/src/main`,
# Bun hanya menggantikan package manager (lebih cepat dari Yarn 4).
RUN apk add --no-cache curl bash libstdc++ unzip \
 && curl -fsSL https://bun.sh/install | bash -s "bun-v1.3.9" \
 && ln -s /root/.bun/bin/bun /usr/local/bin/bun \
 && ln -s /root/.bun/bin/bun /usr/local/bin/bunx \
 && bun --version


FROM bun-base AS front-deps

WORKDIR /app

COPY ./package.json ./bun.lock ./bunfig.toml ./tsconfig.base.json ./nx.json /app/
COPY ./patches /app/patches

COPY ./packages/ui/package.json /app/packages/ui/
COPY ./packages/shared/package.json /app/packages/shared/
COPY ./packages/front/package.json /app/packages/front/
COPY ./packages/front-component-renderer/package.json /app/packages/front-component-renderer/
COPY ./packages/sdk/package.json /app/packages/sdk/
COPY ./packages/client-sdk/package.json /app/packages/client-sdk/

RUN bun install --frozen-lockfile \
      --filter bades \
      --filter front \
      --filter front-component-renderer \
      --filter ui \
      --filter shared \
      --filter sdk \
      --filter client-sdk \
 && bunx nx reset


FROM bun-base AS server-deps

WORKDIR /app

COPY ./package.json ./bun.lock ./bunfig.toml ./tsconfig.base.json ./nx.json /app/
COPY ./patches /app/patches

COPY ./packages/emails/package.json /app/packages/emails/
COPY ./packages/server/package.json /app/packages/server/
COPY ./packages/shared/package.json /app/packages/shared/
COPY ./packages/client-sdk/package.json /app/packages/client-sdk/

RUN bun install --frozen-lockfile \
      --filter bades \
      --filter server \
      --filter emails \
      --filter shared \
      --filter client-sdk \
 && bunx nx reset


FROM server-deps AS bades-server-build

COPY ./packages/emails /app/packages/emails
COPY ./packages/shared /app/packages/shared
COPY ./packages/client-sdk /app/packages/client-sdk
COPY ./packages/server /app/packages/server

RUN bunx nx run server:build

# Clean server build output (type declarations and compiled tests are not needed at runtime;
# source maps are kept because bades-infra extracts them from the image for Sentry uploads)
RUN find /app/packages/server/dist -name '*.d.ts' -delete \
 && rm -rf /app/packages/server/dist/src/test

# Prune dev deps untuk runtime image. Bun belum punya equivalent persis `yarn workspaces focus --production`,
# tapi `bun install --production` melakukan hal sama (drop devDependencies).
RUN bun install --production --frozen-lockfile \
      --filter server \
      --filter emails \
      --filter shared \
      --filter client-sdk


FROM front-deps AS bades-front-build

COPY ./packages/front /app/packages/front
COPY ./packages/front-component-renderer /app/packages/front-component-renderer
COPY ./packages/ui /app/packages/ui
COPY ./packages/shared /app/packages/shared
COPY ./packages/sdk /app/packages/sdk
COPY ./packages/client-sdk /app/packages/client-sdk
# To skip the memory-intensive frontend build, pre-build on the host:
#   bunx nx build front
# The check below will use packages/front/build/ if it already exists.
RUN if [ -d /app/packages/front/build ]; then \
      echo "Using pre-built frontend from host"; \
    else \
      NODE_OPTIONS="--max-old-space-size=8192" bunx nx build front; \
    fi


# ===========================================================================
# Target: bades-server (server only, no frontend)
#   docker build --target bades-server -f Dockerfile .
# ===========================================================================

FROM node:24.15.0-alpine3.23@sha256:d1b3b4da11eefd5941e7f0b9cf17783fc99d9c6fc34884a665f40a06dbdfc94f AS bades-server

RUN apk add --no-cache curl jq postgresql-client

COPY ./entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
WORKDIR /app/packages/server

ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION

# Workspace root config
COPY --chown=1000 --from=bades-server-build /app/package.json /app/bun.lock /app/bunfig.toml /app/
COPY --chown=1000 --from=bades-server-build /app/tsconfig.base.json /app/nx.json /app/
COPY --chown=1000 --from=bades-server-build /app/patches /app/patches
COPY --chown=1000 --from=bades-server-build /app/node_modules /app/node_modules

# Server package (compiled dist + package.json only, no src/)
COPY --chown=1000 --from=bades-server-build /app/packages/server/package.json /app/packages/server/
COPY --chown=1000 --from=bades-server-build /app/packages/server/dist /app/packages/server/dist

# Workspace packages (dist + package.json; node_modules symlinks resolve to these)
COPY --chown=1000 --from=bades-server-build /app/packages/shared/package.json /app/packages/shared/
COPY --chown=1000 --from=bades-server-build /app/packages/shared/dist /app/packages/shared/dist
COPY --chown=1000 --from=bades-server-build /app/packages/emails/package.json /app/packages/emails/
COPY --chown=1000 --from=bades-server-build /app/packages/emails/dist /app/packages/emails/dist
COPY --chown=1000 --from=bades-server-build /app/packages/client-sdk/package.json /app/packages/client-sdk/
COPY --chown=1000 --from=bades-server-build /app/packages/client-sdk/dist /app/packages/client-sdk/dist

LABEL org.opencontainers.image.source=https://github.com/nonomnonom/bades
LABEL org.opencontainers.image.description="Bades server image (no frontend)."

RUN mkdir -p /app/.local-storage /app/packages/server/.local-storage && \
    chown 1000:1000 /app/.local-storage /app/packages/server/.local-storage

USER 1000

CMD ["node", "dist/src/main"]
ENTRYPOINT ["/app/entrypoint.sh"]


# ===========================================================================
# Target: bades-server-aws (server only + aws-cli, no frontend)
#   docker build --target bades-server-aws -f Dockerfile .
# ===========================================================================

FROM bades-server AS bades-server-aws

USER root
RUN apk add --no-cache aws-cli
USER 1000


# ===========================================================================
# Target: bades-front-dev (frontend dengan hot-reload untuk development)
#   docker build --target bades-front-dev -f Dockerfile .
# ===========================================================================

FROM front-deps AS bades-front-dev

COPY ./packages/front /app/packages/front
COPY ./packages/front-component-renderer /app/packages/front-component-renderer
COPY ./packages/ui /app/packages/ui
COPY ./packages/shared /app/packages/shared
COPY ./packages/sdk /app/packages/sdk
COPY ./packages/client-sdk /app/packages/client-sdk

WORKDIR /app

# Install all dependencies for hot-reload development
RUN bun install --frozen-lockfile \
      --filter bades \
      --filter front \
      --filter front-component-renderer \
      --filter ui \
      --filter shared \
      --filter sdk \
      --filter client-sdk

CMD ["bunx", "nx", "run", "front:start"]


# ===========================================================================
# Target: bades (server + frontend)
#   docker build --target bades -f Dockerfile .
# ===========================================================================

FROM bades-server AS bades

COPY --chown=1000 --from=bades-front-build /app/packages/front/build /app/packages/server/dist/src/front

LABEL org.opencontainers.image.description="Bades image with backend and frontend."


# ===========================================================================
# Target: bades-aws (server + frontend + aws-cli)
#   docker build --target bades-aws -f Dockerfile .
# ===========================================================================

FROM bades AS bades-aws

USER root
RUN apk add --no-cache aws-cli
USER 1000
