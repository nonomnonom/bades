# Makefile for building and running Bades docker containers.
# Set the tag and/or target build platform using make command-line variables assignments.
#
# Optional make variables:
# PLATFORM - defaults to 'linux/amd64'
# TAG      - defaults to 'latest'
#
# Example: make prod-build
# Example: make PLATFORM=linux/aarch64 TAG=my-tag prod-build
# Example: make postgres-on-docker (for local development)

PLATFORM ?= linux/amd64
TAG ?= latest
DOCKER_NETWORK=bades_network

# =============================================================================
# Production Image Building
# =============================================================================

prod-build:
	@docker build --target bades -f ./Dockerfile --platform $(PLATFORM) --tag bades:$(TAG) .

prod-run:
	@docker run -d -p 3000:3000 --name bades bades:$(TAG)

prod-postgres-run:
	@docker run -d -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres --name bades-postgres bades-postgres:$(TAG)

# =============================================================================
# Local Development Services
# Run these from the repository root: make <target>
# =============================================================================

ensure-docker-network:
	docker network inspect $(DOCKER_NETWORK) >/dev/null 2>&1 || docker network create $(DOCKER_NETWORK)

postgres-on-docker: ensure-docker-network
	docker run -d --network $(DOCKER_NETWORK) \
	--name bades_pg \
	-e POSTGRES_USER=postgres \
	-e POSTGRES_PASSWORD=postgres \
	-e ALLOW_NOSSL=true \
	-v bades_db_data:/var/lib/postgresql/data \
	-p 5432:5432 \
	postgres:16
	@echo "Waiting for PostgreSQL to be ready..."
	@until docker exec bades_pg psql -U postgres -d postgres \
		-c 'SELECT pg_is_in_recovery();' 2>/dev/null | grep -q 'f'; do \
		sleep 1; \
	done
	docker exec bades_pg psql -U postgres -d postgres \
		-c "CREATE DATABASE \"default\" WITH OWNER postgres;" \
		-c "CREATE DATABASE \"test\" WITH OWNER postgres;"

redis-on-docker: ensure-docker-network
	docker run -d --network $(DOCKER_NETWORK) --name bades_redis -p 6379:6379 redis/redis-stack-server:latest
