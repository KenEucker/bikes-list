# Multi-stage build for Bikeslist Platform
# Stage 1: Base PHP image with system dependencies
FROM php:8.3-fpm AS base

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
    nginx \
    supervisor \
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

COPY composer.json composer.lock* ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Stage 3: Build frontend assets
FROM base AS frontend

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 4: Runtime image
FROM base AS runtime

# Copy Composer dependencies
COPY --from=vendor /var/www/html/vendor ./vendor

# Copy application code
COPY . .

# Copy built assets
COPY --from=frontend /var/www/html/public/build ./public/build

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Copy entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Copy Nginx configuration
COPY docker/nginx.conf /etc/nginx/sites-available/default

# Expose port
EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
