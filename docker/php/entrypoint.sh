#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html

if [ ! -f ".env" ] && [ -f ".env.example" ]; then
  cp .env.example .env
fi

# Install PHP dependencies if needed (fresh clone)
if [ ! -f "vendor/autoload.php" ] && [ -f "composer.json" ]; then
  composer install --no-interaction --prefer-dist
fi

# Ensure app key exists
php artisan key:generate --force --ansi || true

# Wait for Postgres
if [ -n "${DB_HOST:-}" ]; then
  echo "Waiting for Postgres at ${DB_HOST}:${DB_PORT:-5432}..."
  until pg_isready -h "${DB_HOST}" -p "${DB_PORT:-5432}" -U "${DB_USERNAME:-laravel}" >/dev/null 2>&1; do
    sleep 1
  done
fi

# Run migrations + seed (idempotent)
php artisan migrate --force --ansi
php artisan db:seed --force --ansi

# Ensure Vite manifest exists: use pre-built assets from image or run build
if [ -f "package.json" ] && [ ! -f "public/build/manifest.json" ]; then
  if [ -d /tmp/vite-build ]; then
    echo "Using pre-built frontend assets from image."
    cp -r /tmp/vite-build public/build
  else
    echo "Building frontend assets..."
    mkdir -p public/build
    npm install --no-audit --no-fund && npm run build
    echo "Frontend build complete."
  fi
fi

exec php-fpm

