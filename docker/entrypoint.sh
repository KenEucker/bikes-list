#!/bin/bash
set -e

cd /var/www/html

# Fix git ownership issue (if git repo exists)
if [ -d ".git" ]; then
    git config --global --add safe.directory /var/www/html || true
fi

# Run composer only under a shared lock so app and queue don't run it at once
# (concurrent runs corrupt temp zips → 0-byte/corrupted archives). --no-plugins avoids plugin race.
COMPOSER_LOCK_DIR="/var/www/html/.composer-install.lock"
run_composer_if_needed() {
    if [ ! -d "vendor" ] || [ ! -f "vendor/autoload.php" ]; then
        echo "Installing Composer dependencies..."
        composer install --no-interaction --no-security-blocking --no-plugins --prefer-dist || true
    elif [ -d "vendor" ] && [ -f "composer.json" ]; then
        echo "Ensuring all dependencies are installed..."
        composer install --no-interaction --no-security-blocking --no-plugins --prefer-dist || true
    fi
}
if [ -f "composer.json" ]; then
    WAIT_END=$(($(date +%s) + 600))
    while [ $(date +%s) -lt "$WAIT_END" ]; do
        if mkdir "$COMPOSER_LOCK_DIR" 2>/dev/null; then
            trap 'rmdir "$COMPOSER_LOCK_DIR" 2>/dev/null' EXIT
            run_composer_if_needed
            rmdir "$COMPOSER_LOCK_DIR" 2>/dev/null
            break
        fi
        [ -f "vendor/autoload.php" ] && break
        echo "Waiting for another container to finish composer install..."
        sleep 5
    done
    if [ ! -f "vendor/autoload.php" ] && [ ! -d "vendor" ]; then
        echo "Warning: composer install did not complete in time or failed. Continuing anyway..."
    fi
fi

# Check if artisan exists and vendor is available before trying to use artisan
HAS_ARTISAN=false
if [ -f "artisan" ] && [ -d "vendor" ]; then
    HAS_ARTISAN=true
    # Clear service discovery cache
    rm -f bootstrap/cache/services.php bootstrap/cache/packages.php bootstrap/cache/config.php 2>/dev/null || true
    
    # For admin runtime, skip package discovery entirely to avoid RouteServiceProvider errors
    # We'll manually create a services cache with only the providers we need
    if [ "$APP_RUNTIME" = "admin" ]; then
        # Skip package:discover for admin (it causes RouteServiceProvider errors)
        # Create a minimal services cache manually
        php -r "
        // Get default Laravel providers
        \$defaultProviders = require 'vendor/laravel/framework/src/Illuminate/Foundation/Application.php';
        // This is a workaround - just create empty cache and let Laravel discover on first request
        file_put_contents('bootstrap/cache/services.php', '<?php return [\"providers\" => [], \"eager\" => [], \"deferred\" => [], \"when\" => []];');
        " 2>/dev/null || true
    else
        php artisan package:discover --ansi || true
    fi
    php artisan config:clear || true
elif [ "$APP_RUNTIME" = "worker" ]; then
    echo "Error: Worker requires artisan and vendor directory. Please run 'composer install' first."
    exit 1
fi

# Wait for database to be ready (only if artisan exists)
if [ "$HAS_ARTISAN" = true ]; then
    echo "Waiting for database connection..."
    for i in {1..30}; do
        if php artisan db:show > /dev/null 2>&1 || php -r "try { new PDO('pgsql:host=db;port=5432', '${DB_USERNAME:-bikeslist}', '${DB_PASSWORD:-bikeslist}'); exit(0); } catch (Exception \$e) { exit(1); }" 2>/dev/null; then
            echo "Database is ready!"
            break
        fi
        echo "Attempt $i/30: Waiting for database..."
        sleep 2
    done
    
    # Run migrations (only in app container, not worker)
    # Use a lock file to prevent race conditions when multiple containers start
    if [ "$APP_RUNTIME" != "worker" ]; then
        MIGRATE_LOCK="/tmp/migrate.lock"
        # Try to acquire lock (wait up to 60 seconds)
        for i in {1..60}; do
            if (set -C; echo $$ > "$MIGRATE_LOCK" 2>/dev/null); then
                # Got the lock
                trap "rm -f $MIGRATE_LOCK" EXIT
                echo "Running migrations..."
                php artisan migrate --force || true
                rm -f "$MIGRATE_LOCK"
                break
            else
                # Lock exists, wait and retry
                sleep 1
            fi
        done
    fi
fi

# APP_KEY is set from env or .env at deploy time; do not run artisan key:generate here.

# Install and build frontend assets (only in app container, not worker)
# Temporarily disable exit on error for npm commands
if [ "$APP_RUNTIME" != "worker" ] && [ -f "package.json" ]; then
    set +e
    echo "Installing npm dependencies..."
    npm install --no-audit --no-fund
    NPM_INSTALL_STATUS=$?
    if [ $NPM_INSTALL_STATUS -ne 0 ]; then
        echo "Warning: npm install failed. Continuing anyway..."
    else
        echo "npm install completed successfully"
    fi
    
    # Build frontend assets if manifest doesn't exist
    if [ ! -f "public/build/manifest.json" ]; then
        echo "Building frontend assets (this may take 30-60 seconds)..."
        npm run build
        NPM_BUILD_STATUS=$?
        if [ $NPM_BUILD_STATUS -ne 0 ]; then
            echo "Warning: npm build failed. Continuing anyway..."
        else
            echo "npm build completed successfully"
        fi
    else
        echo "Frontend assets already built, skipping build step"
    fi
    set -e
fi

# Ensure storage and bootstrap/cache are writable by www-data.
# The setup steps above (composer, artisan, npm) run as root and may create
# files owned by root. PHP-FPM runs as www-data and needs write access.
mkdir -p storage/framework/{views,cache,sessions} storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Start services based on APP_RUNTIME
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
