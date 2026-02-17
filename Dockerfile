# Multi-stage build for Bikeslist Platform
#
# The Laravel application lives in the laravel/ subdirectory.
# The build copies from laravel/ into the container's /var/www/html.

# Stage 1: Base PHP image with system dependencies
FROM php:8.4-fpm AS base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    postgresql-client \
    libpq-dev \
    && docker-php-ext-install pdo_pgsql pgsql mbstring exif pcntl bcmath gd zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Node.js LTS
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Stage 2: Install Composer dependencies
FROM base AS vendor

COPY laravel/composer.json laravel/composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Stage 3: Build frontend assets
FROM base AS frontend

COPY laravel/package.json laravel/package-lock.json ./
RUN npm ci

COPY laravel/ .
RUN npm run build

# Stage 4: Runtime image
FROM base AS runtime

# Copy Composer dependencies
COPY --from=vendor /var/www/html/vendor ./vendor

# Copy application code from laravel/ subdirectory
COPY laravel/ .

# Copy built assets
COPY --from=frontend /var/www/html/public/build ./public/build

# Ensure storage directory structure exists (contents excluded by .dockerignore)
RUN mkdir -p /var/www/html/storage/framework/{views,cache,sessions,testing} \
    && mkdir -p /var/www/html/storage/logs \
    && mkdir -p /var/www/html/bootstrap/cache

# Set permissions - use 775 so www-data group can also write
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Copy entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose PHP-FPM port (Caddy reverse-proxies to this)
EXPOSE 9000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
