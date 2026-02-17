# Bikeslist Platform Implementation Notes

## Overview

This document provides instructions for running and developing the Bikeslist platform locally using Docker.

## Prerequisites

- Docker and Docker Compose installed
- Make (optional, for using Makefile commands)

## Quick Start

### 1. Environment Setup

Copy the example environment file:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration, particularly:
- Database credentials
- DigitalOcean Spaces credentials (if using)
- Meilisearch key

### 2. Build and Start Services

```bash
# Build Docker images
docker-compose build

# Install dependencies first (recommended)
docker-compose run --rm app composer install
docker-compose run --rm app npm install

# Start all services
docker-compose up -d

# Or use Makefile
make build
make install-deps  # Install dependencies
make up
```

**Note:** If you start containers without installing dependencies first, the entrypoint will attempt to install them automatically, but this may cause initial startup delays.

### 3. Install Dependencies

**Important:** Dependencies must be installed before starting the containers, or the entrypoint will install them automatically on first startup.

```bash
# Option 1: Install before starting (recommended)
docker-compose run --rm app composer install
docker-compose run --rm app npm install

# Option 2: Install after containers are running
docker-compose exec app composer install
docker-compose exec app npm install

# Or use Makefile
make install-deps
```

**Note:** The entrypoint script will automatically install Composer dependencies if the `vendor` directory doesn't exist, but it's better to install them explicitly first.

### 4. Generate Application Key

```bash
docker-compose exec app php artisan key:generate
```

### 5. Run Migrations

```bash
docker-compose exec app php artisan migrate
```

### 6. Build Frontend Assets

```bash
docker-compose exec app npm run build
```

## Running Services

### Web Application

The application runs on:
- Consumer: `http://bikeslist.org` (or `http://localhost`)
- Admin: `http://admin.bikeslist.org`
- Region subdomains: `http://{region}.bikeslist.org`

### Simulating Subdomains Locally

Add entries to `/etc/hosts`:
```
127.0.0.1 bikeslist.org
127.0.0.1 admin.bikeslist.org
127.0.0.1 sf.bikeslist.org
127.0.0.1 denver.bikeslist.org
```

### Services

- **Database (PostgreSQL)**: `localhost:5432`
- **Redis**: `localhost:6379`
- **Meilisearch**: `http://localhost:7700`
- **Mailpit**: `http://localhost:8025` (web UI) and `localhost:1025` (SMTP)

## Running Workers

Queue workers process background jobs (image processing, indexing, spam checks):

```bash
# Start worker container
docker-compose up -d worker

# Or run worker manually
docker-compose exec app php artisan queue:work
```

## Development Workflow

### Running Tests

```bash
docker-compose exec app php artisan test
```

### Viewing Logs

```bash
# Application logs
docker-compose logs -f app

# Worker logs
docker-compose logs -f worker

# All services
docker-compose logs -f
```

### Accessing Container Shell

```bash
docker-compose exec app bash
# Or use Makefile
make shell
```

### Running Artisan Commands

```bash
docker-compose exec app php artisan <command>
# Or use Makefile
make composer ARGS="<command>"
```

### Frontend Development

For hot-reloading during development:

```bash
docker-compose exec app npm run dev
```

## Runtime Modes

The application supports multiple runtime modes via `APP_RUNTIME` environment variable:

- `consumer` - Consumer web application (default)
- `admin` - Admin web application
- `worker` - Queue worker process

Set in `.env`:
```env
APP_RUNTIME=consumer
```

## Environment Variables

Key environment variables:

- `APP_RUNTIME` - Runtime mode (consumer/admin/worker)
- `SESSION_DOMAIN` - Session cookie domain (`.bikeslist.org` for consumer, `admin.bikeslist.org` for admin)
- `DB_*` - Database configuration
- `REDIS_*` - Redis configuration
- `AWS_*` - DigitalOcean Spaces configuration
- `MEILISEARCH_*` - Meilisearch configuration

## Testing Magic Links

Magic link emails are sent to Mailpit. Access the Mailpit web UI at `http://localhost:8025` to view and click magic links.

## Troubleshooting

### Database Connection Issues

Ensure the database container is running:
```bash
docker-compose ps db
```

Wait for database to be ready:
```bash
docker-compose exec app php artisan db:show
```

### Permission Issues

Fix storage permissions:
```bash
docker-compose exec app chmod -R 755 storage bootstrap/cache
```

### Clear Cache

```bash
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan route:clear
docker-compose exec app php artisan view:clear
```

## Production Deployment

For production:

1. Use the production Dockerfile (multi-stage build)
2. Set `APP_ENV=production`
3. Set `APP_DEBUG=false`
4. Configure proper session domains
5. Set up proper SSL/TLS certificates
6. Configure DigitalOcean Spaces credentials
7. Set up proper queue workers (supervisor or similar)

## Architecture Notes

- **Consumer Runtime**: Handles `bikeslist.org` and `*.bikeslist.org` subdomains
- **Admin Runtime**: Handles `admin.bikeslist.org` only
- **Worker Runtime**: Processes background jobs
- All runtimes share the same codebase but are controlled via `APP_RUNTIME`
- Sessions are isolated between consumer and admin via different cookie domains
