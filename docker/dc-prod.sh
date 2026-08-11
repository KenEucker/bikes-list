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

install_hint() {
    echo "  sudo apt-get update && sudo apt-get install -y docker-compose-plugin" >&2
    echo "If that package is unavailable (Docker installed from Ubuntu's docker.io" >&2
    echo "rather than Docker's apt repo), install the plugin binary directly:" >&2
    echo "  https://docs.docker.com/compose/install/linux/#install-the-plugin-manually" >&2
}

if docker compose version >/dev/null 2>&1; then
    exec docker compose -f "$FILE" "$@"
elif command -v docker-compose >/dev/null 2>&1; then
    # Compose v1 (Python) cannot parse this file: it uses the v2-only env_file
    # long syntax (path:/required:).  Fail loudly rather than emit a confusing
    # "invalid type, it should be a string" schema error.
    case "$(docker-compose version --short 2>/dev/null)" in
        1.*)
            echo "Error: found Compose v1 (docker-compose $(docker-compose version --short))." >&2
            echo "docker-compose.prod.yml requires Compose v2. Install the v2 plugin:" >&2
            install_hint
            exit 1
            ;;
    esac
    exec docker-compose -f "$FILE" "$@"
else
    echo "Error: neither 'docker compose' (v2 plugin) nor 'docker-compose' found." >&2
    install_hint
    exit 1
fi
