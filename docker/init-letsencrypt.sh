#!/usr/bin/env bash
# First-time Let's Encrypt certificate setup for bikeslist.org.
#
# Run ONCE on the droplet before starting the full stack:
#   sudo ./docker/init-letsencrypt.sh
#
# After this, certs auto-renew via the certbot container.

set -euo pipefail

DOMAINS="bikeslist.org *.bikeslist.org"
EMAIL="${CERTBOT_EMAIL:-}"
COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"
CERT_PATH="/etc/letsencrypt/live/bikeslist.org"

if [ -z "$EMAIL" ]; then
    echo "Set CERTBOT_EMAIL before running: export CERTBOT_EMAIL=you@example.com"
    exit 1
fi

echo "==> Creating dummy certificate so nginx can start..."
docker compose $COMPOSE_FILES run --rm --entrypoint "\
    mkdir -p $CERT_PATH && \
    openssl req -x509 -nodes -days 1 -newkey rsa:2048 \
        -keyout $CERT_PATH/privkey.pem \
        -out $CERT_PATH/fullchain.pem \
        -subj '/CN=localhost'" certbot

echo "==> Starting nginx-proxy..."
docker compose $COMPOSE_FILES up -d web

echo "==> Removing dummy certificate..."
docker compose $COMPOSE_FILES run --rm --entrypoint "\
    rm -rf /etc/letsencrypt/live/bikeslist.org && \
    rm -rf /etc/letsencrypt/archive/bikeslist.org && \
    rm -rf /etc/letsencrypt/renewal/bikeslist.org.conf" certbot

echo "==> Requesting real certificate from Let's Encrypt..."
docker compose $COMPOSE_FILES run --rm certbot certonly \
    --webroot -w /var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d bikeslist.org \
    -d "*.bikeslist.org"

echo "==> Reloading nginx..."
docker compose $COMPOSE_FILES exec web nginx -s reload

echo "==> Done! Certs will auto-renew via the certbot container."
