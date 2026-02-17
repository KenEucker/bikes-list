#!/bin/sh
# Certbot entrypoint: auto-provisions certs on first run, then renews every 12h.
set -e
trap exit TERM

CERT_PATH="/etc/letsencrypt/live/bikeslist.org"
DOMAIN="bikeslist.org"

needs_cert() {
    # No cert at all
    [ ! -f "$CERT_PATH/fullchain.pem" ] && return 0
    # Cert is the self-signed placeholder (issuer CN matches the domain itself)
    openssl x509 -in "$CERT_PATH/fullchain.pem" -noout -issuer 2>/dev/null \
        | grep -q "CN=$DOMAIN" && return 0
    return 1
}

if needs_cert; then
    echo "No real certificate found for $DOMAIN."

    if [ -z "$CERTBOT_EMAIL" ]; then
        echo "ERROR: Set CERTBOT_EMAIL in .env for automatic cert provisioning."
        echo "Falling back to renewal loop (will work once certs exist)."
    else
        # Wait for Nginx to be up and serving ACME challenges on port 80
        echo "Waiting 30s for Nginx to start..."
        sleep 30

        echo "Requesting certificate from Let's Encrypt..."
        # Remove the self-signed placeholder so certbot can write fresh files
        rm -rf "$CERT_PATH"
        rm -rf /etc/letsencrypt/archive/bikeslist.org
        rm -rf /etc/letsencrypt/renewal/bikeslist.org.conf

        # Webroot only supports specific domains, not wildcards.
        # Request certs for the known domains Nginx serves.
        certbot certonly --webroot -w /var/www/certbot \
            --email "$CERTBOT_EMAIL" \
            --agree-tos --no-eff-email --non-interactive \
            --cert-name "$DOMAIN" \
            -d "$DOMAIN" \
            -d "admin.$DOMAIN" \
            || echo "certbot failed — will retry on next container restart."
    fi
fi

# Renewal loop
while :; do
    certbot renew
    sleep 12h &
    wait $!
done
