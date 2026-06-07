# Makefile for building and running Bades Docker containers.
# Jalankan dari repo root: make -C packages/bades-docker <target>
#
# Optional make variables:
# PLATFORM - defaults to 'linux/amd64'
# TAG      - defaults to 'latest'
#
# Example: make -C packages/bades-docker prod-build
# Example: make -C packages/bades-docker PLATFORM=linux/aarch64 TAG=my-tag prod-build

PLATFORM ?= linux/amd64
TAG ?= latest
COMPOSE_DEV = docker compose -f docker-compose.dev.yml
COMPOSE_PROD = docker compose -f docker-compose.prod.yml

# =============================================================================
# Production Image Building
# =============================================================================

prod-build:
	@cd ../.. && docker build --target bades -f ./packages/bades-docker/bades/Dockerfile --platform $(PLATFORM) --tag bades:$(TAG) . && cd -

prod-run:
	@docker run -d -p 3000:3000 --name bades bades:$(TAG)

# =============================================================================
# Compose stacks
# =============================================================================

stack-up:
	@cd ../.. && docker compose -f packages/bades-docker/docker-compose.yml up -d

stack-down:
	@cd ../.. && docker compose -f packages/bades-docker/docker-compose.yml down

prod-up:
	@cd ../.. && docker compose -f packages/bades-docker/docker-compose.prod.yml --env-file .env -p bades-prod up -d

prod-down:
	@cd ../.. && docker compose -f packages/bades-docker/docker-compose.prod.yml --env-file .env -p bades-prod down

# =============================================================================
# Local Development Infrastructure
# Prefer: bash packages/utils/setup-dev-env.sh
# =============================================================================

dev-infra-up:
	@cd ../.. && docker compose -f packages/bades-docker/docker-compose.dev.yml up -d

dev-infra-down:
	@cd ../.. && docker compose -f packages/bades-docker/docker-compose.dev.yml down

dev-bootstrap:
	@cd ../.. && bash packages/utils/setup-dev-env.sh
