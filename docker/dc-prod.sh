#!/usr/bin/env sh
# Compose wrapper for the production stack.
#
# Servers vary: some have the Compose v2 plugin ("docker compose"), some only
# the standalone binary ("docker-compose").  Pick whichever is present so the
# npm run prod:* scripts work either way.
#
# Usage: sh docker/dc-prod.sh up -d --build
set -e

FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"

if docker compose version >/dev/null 2>&1; then
    exec docker compose -f "$FILE" "$@"
elif command -v docker-compose >/dev/null 2>&1; then
    exec docker-compose -f "$FILE" "$@"
else
    echo "Error: neither 'docker compose' (v2 plugin) nor 'docker-compose' found." >&2
    echo "Install the Compose v2 plugin: https://docs.docker.com/compose/install/linux/" >&2
    exit 1
fi
