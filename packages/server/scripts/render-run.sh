#!/bin/sh
export PG_DATABASE_URL=postgres://postgres:postgres@$PG_DATABASE_HOST:$PG_DATABASE_PORT/default
node dist/src/database/scripts/setup-db.js && node dist/src/command/command run-instance-commands --force --include-slow
node dist/src/main
