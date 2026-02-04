# Subdomain login (main site + city subdomains)

The app is configured for **localhost**: use **http://localhost** and **http://dubai.localhost** (and other city subdomains). The session cookie is set with `Domain=.localhost` so login can span main site and subdomains where the browser allows it.

## Using localhost

- Main site: **http://localhost**
- City subdomains: **http://dubai.localhost**, **http://buenosaires.localhost**, etc.

No `/etc/hosts` changes are required for `*.localhost`; most systems resolve it to 127.0.0.1.

If you get 419 on subdomain login or get logged out on every restart: rebuild the app image so the entrypoint runs the latest logic, then clear site cookies once:

```bash
docker compose build --no-cache app && docker compose up -d
```

Then clear cookies for `localhost` (and any subdomains) in your browser and log in again.

## Env vars and .env files

`APP_URL`, `APP_DOMAIN`, and `SESSION_DOMAIN` are read from the environment and default to localhost when unset:

- `APP_URL` → default `http://localhost`
- `APP_DOMAIN` → default empty (session uses `.localhost`)
- `SESSION_DOMAIN` → default `.localhost`

You can set them in **laravel/.env** or in a **project-root .env**. When running in Docker, if a `.env` file exists in the project root, the entrypoint merges it over **laravel/.env** (root values override), so both files work and root takes precedence.

## Optional: use a custom domain (e.g. bikeslist.test)

If `.localhost` cookies don’t work across subdomains in your browser, use a two-part domain. Add to `/etc/hosts`:

```
127.0.0.1 bikeslist.test
127.0.0.1 dubai.bikeslist.test
```

Then set (in **laravel/.env** or **project root .env**, or in `docker-compose.yml` under `environment:`):

```
APP_URL=http://bikeslist.test
APP_DOMAIN=bikeslist.test
SESSION_DOMAIN=.bikeslist.test
```

Use **http://bikeslist.test** and **http://dubai.bikeslist.test**.
