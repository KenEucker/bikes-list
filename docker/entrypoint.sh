#!/bin/bash
set -e

cd /var/www/html

# ---------------------------------------------------------------------------
# Generate the Composer autoloader.
#
# The Dockerfile installs vendor deps with --no-autoloader (a common Docker
# optimisation that lets us cache the vendor layer independently of app code).
# We finish the job here by dumping an optimised autoloader now that the full
# source tree is present.
# ---------------------------------------------------------------------------
if [ -f "composer.json" ] && [ -d "vendor" ] && [ ! -f "vendor/autoload.php" ]; then
    echo "Generating optimised autoloader..."
    composer dump-autoload --optimize --no-interaction 2>&1
fi

# ---------------------------------------------------------------------------
# Artisan bootstrapping
# ---------------------------------------------------------------------------
HAS_ARTISAN=false
if [ -f "artisan" ] && [ -f "vendor/autoload.php" ]; then
    HAS_ARTISAN=true

    # Clear stale caches from the image build
    rm -f bootstrap/cache/services.php bootstrap/cache/packages.php bootstrap/cache/config.php 2>/dev/null || true

    php artisan package:discover --ansi 2>&1 || true
    php artisan config:clear 2>&1 || true
fi

# ---------------------------------------------------------------------------
# Wait for the database
# ---------------------------------------------------------------------------
if [ "$HAS_ARTISAN" = true ]; then
    echo "Waiting for database connection..."
    for i in {1..30}; do
        if php artisan db:show > /dev/null 2>&1; then
            echo "Database is ready!"
            break
        fi
        echo "Attempt $i/30: Waiting for database..."
        sleep 2
    done
fi

# ---------------------------------------------------------------------------
# Run migrations (app/admin only, not worker)
# ---------------------------------------------------------------------------
if [ "$HAS_ARTISAN" = true ] && [ "$APP_RUNTIME" != "worker" ]; then
    MIGRATE_LOCK="/tmp/migrate.lock"
    for i in {1..60}; do
        if (set -C; echo $$ > "$MIGRATE_LOCK" 2>/dev/null); then
            trap "rm -f $MIGRATE_LOCK" EXIT
            echo "Running migrations..."
            php artisan migrate --force 2>&1 || true
            rm -f "$MIGRATE_LOCK"
            break
        else
            sleep 1
        fi
    done
fi

# ---------------------------------------------------------------------------
# Ensure storage & cache are writable by www-data (PHP-FPM user)
# ---------------------------------------------------------------------------
mkdir -p storage/framework/{views,cache,sessions} storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# ---------------------------------------------------------------------------
# Start the requested service
# ---------------------------------------------------------------------------
case "$APP_RUNTIME" in
    worker)
        if [ "$HAS_ARTISAN" != true ]; then
            echo "Error: Cannot start worker without artisan and vendor directory."
            exit 1
        fi
        echo "Starting queue worker..."
        exec php artisan queue:work --verbose --tries=3 --timeout=90
        ;;
    admin|consumer)
        echo "Starting PHP-FPM (runtime: $APP_RUNTIME)..."
        exec php-fpm
        ;;
    *)
        echo "Unknown APP_RUNTIME: $APP_RUNTIME"
        exit 1
        ;;
esac
