# ===========================================================================
# Dependency stages
# ===========================================================================

FROM node:24.15.0-alpine3.23@sha256:d1b3b4da11eefd5941e7f0b9cf17783fc99d9c6fc34884a665f40a06dbdfc94f AS front-deps

WORKDIR /app

COPY ./package.json ./yarn.lock ./.yarnrc.yml ./tsconfig.base.json ./nx.json /app/
COPY ./.yarn/releases /app/.yarn/releases
COPY ./.yarn/patches /app/.yarn/patches

COPY ./packages/ui/package.json /app/packages/ui/
COPY ./packages/shared/package.json /app/packages/shared/
COPY ./packages/front/package.json /app/packages/front/
COPY ./packages/front-component-renderer/package.json /app/packages/front-component-renderer/
COPY ./packages/sdk/package.json /app/packages/sdk/
COPY ./packages/client-sdk/package.json /app/packages/client-sdk/

RUN yarn workspaces focus bades front front-component-renderer ui shared sdk client-sdk && yarn cache clean && npx nx reset


FROM node:24.15.0-alpine3.23@sha256:d1b3b4da11eefd5941e7f0b9cf17783fc99d9c6fc34884a665f40a06dbdfc94f AS server-deps

WORKDIR /app

COPY ./package.json ./yarn.lock ./.yarnrc.yml ./tsconfig.base.json ./nx.json /app/
COPY ./.yarn/releases /app/.yarn/releases
COPY ./.yarn/patches /app/.yarn/patches

COPY ./packages/emails/package.json /app/packages/emails/
COPY ./packages/server/package.json /app/packages/server/
COPY ./packages/server/patches /app/packages/server/patches
COPY ./packages/shared/package.json /app/packages/shared/
COPY ./packages/client-sdk/package.json /app/packages/client-sdk/

RUN yarn workspaces focus bades server emails shared client-sdk && yarn cache clean && npx nx reset


FROM server-deps AS bades-server-build

COPY ./packages/emails /app/packages/emails
COPY ./packages/shared /app/packages/shared
COPY ./packages/client-sdk /app/packages/client-sdk
COPY ./packages/server /app/packages/server

RUN npx nx run server:build

# Clean server build output (type declarations and compiled tests are not needed at runtime;
# source maps are kept because bades-infra extracts them from the image for Sentry uploads)
RUN find /app/packages/server/dist -name '*.d.ts' -delete \
 && rm -rf /app/packages/server/dist/packages/server/test

RUN yarn workspaces focus --production emails shared client-sdk server


FROM front-deps AS bades-front-build

COPY ./packages/front /app/packages/front
COPY ./packages/front-component-renderer /app/packages/front-component-renderer
COPY ./packages/ui /app/packages/ui
COPY ./packages/shared /app/packages/shared
COPY ./packages/sdk /app/packages/sdk
COPY ./packages/client-sdk /app/packages/client-sdk
# To skip the memory-intensive frontend build, pre-build on the host:
#   npx nx build front
# The check below will use packages/front/build/ if it already exists.
RUN if [ -d /app/packages/front/build ]; then \
      echo "Using pre-built frontend from host"; \
    else \
      NODE_OPTIONS="--max-old-space-size=8192" npx nx build front; \
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
COPY --chown=1000 --from=bades-server-build /app/package.json /app/yarn.lock /app/.yarnrc.yml /app/
COPY --chown=1000 --from=bades-server-build /app/tsconfig.base.json /app/nx.json /app/
COPY --chown=1000 --from=bades-server-build /app/.yarn /app/.yarn
COPY --chown=1000 --from=bades-server-build /app/node_modules /app/node_modules

# Server package (compiled dist + package.json only, no src/)
COPY --chown=1000 --from=bades-server-build /app/packages/server/package.json /app/packages/server/
COPY --chown=1000 --from=bades-server-build /app/packages/server/dist /app/packages/server/dist
COPY --chown=1000 --from=bades-server-build /app/packages/server/patches /app/packages/server/patches

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

CMD ["node", "dist/main"]
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
RUN yarn workspaces focus bades front front-component-renderer ui shared sdk client-sdk

CMD ["npx", "nx", "run", "front:start"]


# ===========================================================================
# Target: bades (server + frontend)
#   docker build --target bades -f Dockerfile .
# ===========================================================================

FROM bades-server AS bades

COPY --chown=1000 --from=bades-front-build /app/packages/front/build /app/packages/server/dist/front

LABEL org.opencontainers.image.description="Bades image with backend and frontend."


# ===========================================================================
# Target: bades-aws (server + frontend + aws-cli)
#   docker build --target bades-aws -f Dockerfile .
# ===========================================================================

FROM bades AS bades-aws

USER root
RUN apk add --no-cache aws-cli
USER 1000
