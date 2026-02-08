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

# Install PHP dependencies if needed (fresh clone or volume overwrote vendor)
# --no-plugins avoids "cannot find tmp-*.zip" race (installer plugin Promise handling bug)
if [ ! -f "vendor/autoload.php" ] && [ -f "composer.json" ]; then
  composer install --no-interaction --prefer-dist --no-plugins
fi

# --- Config: avoid cached config so APP_DOMAIN/SESSION_DOMAIN are used (local) ---
if [ "${APP_ENV:-}" = "local" ] && [ -f "artisan" ]; then
  php artisan config:clear 2>/dev/null || true
fi

# --- APP_KEY: persist in .app_key, export to env. Never modify .env (avoids duplicates/corruption). ---
mkdir -p storage/app
has_valid_key() {
  [ -s "$APP_KEY_FILE" ] 2>/dev/null && head -1 "$APP_KEY_FILE" | grep -q '^base64:'
}
# 1) Container env (docker-compose) has key: save to .app_key
if [ -n "${APP_KEY:-}" ] && [ "$APP_KEY" = "base64:"* ]; then
  echo "$APP_KEY" > "$APP_KEY_FILE"
  echo "Saved APP_KEY from environment to $APP_KEY_FILE"
fi
# 2) .env has valid key but .app_key doesn't: copy to .app_key (one-time, key:generate wrote it)
if [ ! -s "$APP_KEY_FILE" ] 2>/dev/null && [ -f .env ]; then
  KEY=$(grep '^APP_KEY=base64:' .env 2>/dev/null | head -1 | cut -d= -f2- | tr -d '\n\r')
  if [ -n "$KEY" ]; then
    echo "$KEY" > "$APP_KEY_FILE"
    echo "Copied APP_KEY from .env to $APP_KEY_FILE"
  fi
fi
# 3) Still no key: generate one and save to .app_key (never modify .env to avoid duplicates)
if ! has_valid_key; then
  unset APP_KEY
  NEW_KEY=$(php artisan key:generate --show)
  echo "$NEW_KEY" > "$APP_KEY_FILE"
  export APP_KEY="$NEW_KEY"
  echo "Generated APP_KEY ($NEW_KEY) and saved to $APP_KEY_FILE"
fi
# 4) Export for PHP (Laravel reads from getenv first; .env is never modified by us)
if has_valid_key; then
  export APP_KEY=$(cat "$APP_KEY_FILE" | tr -d '\n\r')
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

