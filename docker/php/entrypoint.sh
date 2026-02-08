#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html

# Ensure PHP upload limits are comfortably above our 10MB
# application-level limit so we can show a clear error.
cat > /usr/local/etc/php/conf.d/99-uploads.ini <<'EOF'
upload_max_filesize=12M
post_max_size=12M
EOF

# Persisted APP_KEY path (survives restarts; sessions stay valid)
APP_KEY_FILE="storage/app/.app_key"

# --- Bootstrap .env: ALWAYS rebuild from clean .env.example + root .env overrides ---
# This runs on EVERY container start so corruption can never accumulate.
# The root project dir is mounted read-only at /var/project by docker-compose.
if [ -f ".env.example" ]; then
  if [ -f "/var/project/.env" ]; then
    # Parse both files, merge (root overrides win), write a clean .env with no duplicates.
    php -r '
      function p($f) {
        $v = [];
        foreach (explode("\n", str_replace(["\r\n","\r"], "\n", @file_get_contents($f) ?: "")) as $l) {
          $l = trim($l);
          if ($l === "" || $l[0] === "#") continue;
          if (preg_match("/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/", $l, $m)) $v[$m[1]] = $m[2];
        }
        return $v;
      }
      $m = array_replace(p($argv[1]), p($argv[2]));
      ksort($m);
      $o = "";
      foreach ($m as $k => $v) $o .= "$k=$v\n";
      file_put_contents($argv[3], $o, LOCK_EX);
    ' -- .env.example /var/project/.env .env
    echo "Built .env: merged .env.example + root .env overrides (clean, no duplicates)."
  else
    cp .env.example .env
    echo "Built .env from .env.example (no root .env found)."
  fi
elif [ ! -f ".env" ]; then
  touch .env
fi

# Install PHP dependencies if needed (fresh clone or volume overwrote vendor).
# Only ONE process must run composer at a time: app and queue share the same volume,
# so concurrent composer installs overwrite each other's temp zips (0-byte/corrupted).
# Use an atomic mkdir lock (no extra packages); --no-plugins avoids plugin Promise race.
COMPOSER_LOCK_DIR="/var/www/html/.composer-install.lock"
if [ -f "composer.json" ] && [ ! -f "vendor/autoload.php" ]; then
  WAIT_END=$(($(date +%s) + 600))
  while [ $(date +%s) -lt "$WAIT_END" ]; do
    [ -f vendor/autoload.php ] && break
    if mkdir "$COMPOSER_LOCK_DIR" 2>/dev/null; then
      trap 'rmdir "$COMPOSER_LOCK_DIR" 2>/dev/null' EXIT
      if [ ! -f vendor/autoload.php ]; then
        echo "Installing Composer dependencies (this container holds the lock)..."
        composer install --no-interaction --prefer-dist --no-plugins
      fi
      rmdir "$COMPOSER_LOCK_DIR" 2>/dev/null
      break
    fi
    echo "Waiting for another container to finish composer install..."
    sleep 5
  done
  if [ ! -f vendor/autoload.php ]; then
    echo "Error: composer install did not complete in time or failed." >&2
    exit 1
  fi
  echo "Composer dependencies ready."
fi

# --- Config: avoid cached config so APP_DOMAIN/SESSION_DOMAIN are used (local) ---
if [ "${APP_ENV:-}" = "local" ] && [ -f "artisan" ]; then
  php artisan config:clear 2>/dev/null || true
fi

# Wait for Postgres first so key:generate can boot Laravel without connection errors
if [ -n "${DB_HOST:-}" ]; then
  echo "Waiting for Postgres at ${DB_HOST}:${DB_PORT:-5432}..."
  PG_WAIT_END=$(($(date +%s) + 120))
  until pg_isready -h "${DB_HOST}" -p "${DB_PORT:-5432}" -U "${DB_USERNAME:-laravel}" >/dev/null 2>&1; do
    if [ $(date +%s) -ge "$PG_WAIT_END" ]; then
      echo "Warning: Postgres not ready after 120s, continuing anyway."
      break
    fi
    sleep 2
  done
fi

# --- APP_KEY: generate if missing so the app always has a key at container creation ---
mkdir -p storage/app
has_valid_key() {
  [ -s "$APP_KEY_FILE" ] 2>/dev/null && head -1 "$APP_KEY_FILE" | grep -q '^base64:'
}
# 1) Container env has key: save to .app_key
if [ -n "${APP_KEY:-}" ] && [ "$APP_KEY" = "base64:"* ]; then
  echo "$APP_KEY" > "$APP_KEY_FILE"
  echo "Saved APP_KEY from environment to $APP_KEY_FILE"
fi
# 2) .env has valid key but .app_key doesn't: copy to .app_key
if [ ! -s "$APP_KEY_FILE" ] 2>/dev/null && [ -f .env ]; then
  KEY=$(grep '^APP_KEY=base64:' .env 2>/dev/null | head -1 | cut -d= -f2- | tr -d '\n\r') || true
  if [ -n "$KEY" ]; then
    echo "$KEY" > "$APP_KEY_FILE"
    echo "Copied APP_KEY from .env to $APP_KEY_FILE"
  fi
fi
# 3) No key yet: generate one at container creation (retry a few times)
if ! has_valid_key; then
  unset APP_KEY
  NEW_KEY=""
  for attempt in 1 2 3 4 5; do
    if NEW_KEY=$(php artisan key:generate --show 2>/dev/null); then
      break
    fi
    echo "key:generate attempt $attempt failed, retrying in 2s..."
    sleep 2
  done
  if [ -n "$NEW_KEY" ] && [ "$NEW_KEY" = "base64:"* ]; then
    echo "$NEW_KEY" > "$APP_KEY_FILE"
    export APP_KEY="$NEW_KEY"
    # Persist to .env so it survives and is visible (append if APP_KEY line missing)
    if [ -f .env ] && ! grep -q '^APP_KEY=base64:' .env 2>/dev/null; then
      echo "APP_KEY=$NEW_KEY" >> .env
    fi
    echo "Generated APP_KEY and saved to $APP_KEY_FILE and .env"
  else
    echo "Error: Could not generate APP_KEY. Set APP_KEY=base64:... in .env or environment." >&2
    exit 1
  fi
fi
# 4) Export for PHP
if has_valid_key; then
  export APP_KEY=$(cat "$APP_KEY_FILE" | tr -d '\n\r')
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
  php artisan migrate --force --ansi || echo "Warning: migrate failed, continuing."
  php artisan db:seed --force --ansi || echo "Warning: db:seed failed, continuing."
fi

# Build frontend only in the app container (queue skips this)
if [ "${RUN_MIGRATIONS:-true}" = "true" ] && [ -f "package.json" ]; then
  echo "Building frontend assets..."
  mkdir -p public/build
  # Clean node_modules to avoid ENOTEMPTY/caniuse-lite issues when host dir is mounted
  rm -rf node_modules
  (npm install --no-audit --no-fund && npm run build) || echo "Warning: npm build failed, continuing."
  echo "Frontend build complete."
  if [ "${VITE_WATCH:-0}" = "1" ]; then
    echo "Starting Vite in watch mode (rebuilds on frontend changes)..."
    npm run build:watch &
  fi
fi

# Queue container must run the CMD (e.g. queue:work); app container runs php-fpm
if [ "${APP_RUNTIME:-}" = "worker" ]; then
  exec "$@"
else
  exec php-fpm
fi

