#!/bin/bash
set -e

echo "Setting up Bikeslist Platform..."

# Check if Laravel is already installed
if [ ! -f "artisan" ]; then
    echo "Installing Laravel..."
    composer create-project laravel/laravel . --prefer-dist --no-interaction || {
        echo "Laravel installation failed, initializing manually..."
        # Manual Laravel initialization if create-project fails
        composer require laravel/framework --no-interaction
        php artisan --version || echo "Artisan not available yet"
    }
fi

# Install/update dependencies
echo "Installing PHP dependencies..."
composer install --no-interaction

echo "Installing Node dependencies..."
npm install

# Generate app key if not set
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then
    echo "Generating application key..."
    php artisan key:generate --ansi || true
fi

# Build frontend assets
echo "Building frontend assets..."
npm run build || true

echo "Setup complete!"
