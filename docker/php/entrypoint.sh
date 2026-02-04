#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html

# Persisted APP_KEY path (survives restarts; sessions stay valid)
APP_KEY_FILE="storage/app/.app_key"

if [ ! -f ".env" ] && [ -f ".env.example" ]; then
  cp .env.example .env
fi
# If project root has a .env (e.g. /var/project/.env), merge it so root values override laravel/.env
if [ -f "/var/project/.env" ]; then
  cat /var/www/html/.env /var/project/.env > /tmp/env.merged && mv /tmp/env.merged /var/www/html/.env
fi

# Install PHP dependencies if needed (fresh clone)
if [ ! -f "vendor/autoload.php" ] && [ -f "composer.json" ]; then
  composer install --no-interaction --prefer-dist
fi

# --- Config: avoid cached config so APP_DOMAIN/SESSION_DOMAIN are used (local) ---
if [ "${APP_ENV:-}" = "local" ] && [ -f "artisan" ]; then
  php artisan config:clear 2>/dev/null || true
fi

# --- APP_KEY: persist across restarts so sessions stay valid ---
mkdir -p storage/app
has_valid_key_in_env() {
  [ -f .env ] && grep -q '^APP_KEY=base64:.' .env 2>/dev/null
}
# 1) Environment APP_KEY (e.g. from docker-compose) wins: persist to .env and .app_key
if [ -n "${APP_KEY:-}" ] && [ "$APP_KEY" = "base64:"* ]; then
  if ! has_valid_key_in_env; then
    if grep -q '^APP_KEY=' .env 2>/dev/null; then
      grep -v '^APP_KEY=' .env > .env.tmp && echo "APP_KEY=$APP_KEY" >> .env.tmp && mv .env.tmp .env
    else
      echo "APP_KEY=$APP_KEY" >> .env
    fi
    echo "Set APP_KEY from environment (session persistence)."
  fi
  echo "$APP_KEY" > "$APP_KEY_FILE"
fi
# 2) Restore from persisted file if .env still has no valid key
if [ -f "$APP_KEY_FILE" ] && [ -s "$APP_KEY_FILE" ]; then
  SAVED_KEY=$(cat "$APP_KEY_FILE" | tr -d '\n\r')
  if ! has_valid_key_in_env; then
    if [ -f .env ] && grep -q '^APP_KEY=' .env 2>/dev/null; then
      grep -v '^APP_KEY=' .env > .env.tmp && echo "APP_KEY=$SAVED_KEY" >> .env.tmp && mv .env.tmp .env
    else
      echo "APP_KEY=$SAVED_KEY" >> .env
    fi
    echo "Restored APP_KEY from $APP_KEY_FILE (session persistence)."
  fi
fi
# 3) If .env has a valid key, persist to .app_key for next restart
if has_valid_key_in_env; then
  grep '^APP_KEY=' .env | head -1 | cut -d= -f2- | tr -d '\n\r' > "$APP_KEY_FILE" 2>/dev/null || true
fi
# 4) If still no key, generate once and persist (so you don't have to log in again after restart)
if ! has_valid_key_in_env && [ ! -s "$APP_KEY_FILE" ] 2>/dev/null; then
  # Laravel refuses to run key:generate if APP_KEY is already in env (e.g. from .env). Remove it first.
  if [ -f .env ] && grep -q '^APP_KEY=' .env 2>/dev/null; then
    grep -v '^APP_KEY=' .env > .env.tmp && mv .env.tmp .env
  fi
  php artisan key:generate --force
  grep '^APP_KEY=' .env | head -1 | cut -d= -f2- | tr -d '\n\r' > "$APP_KEY_FILE" 2>/dev/null || true
  echo "Generated APP_KEY and saved to $APP_KEY_FILE (session persistence)."
fi

# Wait for Postgres
if [ -n "${DB_HOST:-}" ]; then
  echo "Waiting for Postgres at ${DB_HOST}:${DB_PORT:-5432}..."
  until pg_isready -h "${DB_HOST}" -p "${DB_PORT:-5432}" -U "${DB_USERNAME:-laravel}" >/dev/null 2>&1; do
    sleep 1
  done
fi

# Copy city seed JSON into app so CitySeeder can find it when only laravel is mounted
if [ -f /tmp/locations.json ]; then
  mkdir -p database/data
  if [ ! -f database/data/locations.json ]; then
    cp /tmp/locations.json database/data/
    echo "Copied locations.json to database/data/."
  fi
fi

# Run migrations + seed (idempotent) unless explicitly disabled
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  php artisan migrate --force --ansi
  php artisan db:seed --force --ansi
fi

# Build frontend only in the app container (queue skips this)
if [ "${RUN_MIGRATIONS:-true}" = "true" ] && [ -f "package.json" ]; then
  echo "Building frontend assets..."
  mkdir -p public/build
  # Clean node_modules to avoid ENOTEMPTY/caniuse-lite issues when host dir is mounted
  rm -rf node_modules
  npm install --no-audit --no-fund && npm run build
  echo "Frontend build complete."
  if [ "${VITE_WATCH:-0}" = "1" ]; then
    echo "Starting Vite in watch mode (rebuilds on frontend changes)..."
    npm run build:watch &
  fi
fi

exec php-fpm

