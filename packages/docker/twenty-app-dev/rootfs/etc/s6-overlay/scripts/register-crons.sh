#!/bin/sh
set -e

echo "==> START Registering cron jobs"

cd /app/packages/server
yarn command:prod cron:register:all

echo "==> DONE"
