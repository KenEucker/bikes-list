FROM caddy:2-builder AS builder

RUN GOMEMLIMIT=512MiB xcaddy build \
    --with github.com/caddy-dns/digitalocean

FROM caddy:2

COPY --from=builder /usr/bin/caddy /usr/bin/caddy
