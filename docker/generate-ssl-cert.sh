#!/usr/bin/env bash
# Generate a self-signed SSL certificate for the nginx-proxy.
# In production, replace these with Cloudflare Origin Certificates.
#
# Usage: ./docker/generate-ssl-cert.sh [output_dir]
#   output_dir defaults to docker/ssl

set -euo pipefail

DIR="${1:-$(dirname "$0")/ssl}"
mkdir -p "$DIR"

if [ -f "$DIR/cert.pem" ] && [ -f "$DIR/key.pem" ]; then
    echo "SSL certs already exist in $DIR — skipping generation."
    echo "Delete them first if you want to regenerate."
    exit 0
fi

openssl req -x509 -nodes -days 3650 \
    -newkey rsa:2048 \
    -keyout "$DIR/key.pem" \
    -out "$DIR/cert.pem" \
    -subj "/CN=bikeslist.org" \
    -addext "subjectAltName=DNS:bikeslist.org,DNS:*.bikeslist.org,DNS:localhost"

echo "Self-signed cert generated in $DIR"
echo "  cert: $DIR/cert.pem"
echo "  key:  $DIR/key.pem"
