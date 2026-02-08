FROM php:8.4-fpm-alpine

WORKDIR /var/www/html

RUN apk add --no-cache \
        bash \
        curl \
        freetype-dev \
        git \
        icu-dev \
        libjpeg-turbo-dev \
        libpng-dev \
        libwebp-dev \
        libzip-dev \
        nodejs \
        npm \
        postgresql-client \
        postgresql-dev \
        unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install \
        gd \
        intl \
        pdo_pgsql \
        pgsql \
        zip

# Use Composer 2.9+ to avoid tmp zip extraction race with plugins (Promise handling)
COPY --from=composer:2.9 /usr/bin/composer /usr/bin/composer

# Pre-build frontend assets so the image has a fallback when manifest is missing at runtime
# Install PHP deps first so vendor/tightenco/ziggy exists (app.js imports it)
COPY laravel/composer.json laravel/composer.lock ./
COPY laravel/app ./app
COPY laravel/bootstrap ./bootstrap
COPY laravel/config ./config
COPY laravel/database ./database
# --no-plugins avoids "cannot find tmp-*.zip" race when installer plugins don't await download Promise
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist --no-plugins

COPY laravel/package.json laravel/package-lock.json* laravel/vite.config.js laravel/tailwind.config.js laravel/postcss.config.js laravel/jsconfig.json ./
COPY laravel/resources ./resources
COPY laravel/public ./public
RUN if [ -f package.json ]; then \
      npm install --no-audit --no-fund && npm run build && cp -r public/build /tmp/vite-build; \
    fi

# Copy city seed data into image so entrypoint can place it under mounted app dir
COPY docs/locations.json /tmp/locations.json

COPY docker/php/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

