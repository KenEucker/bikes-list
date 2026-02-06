## bikes-list (Laravel + Orchid + Breeze/Vue in Docker)

### Run locally

```bash
docker compose up --build
```

Then open:

- **Frontend (cities directory)**: `http://localhost`
- **Orchid admin**: `http://localhost/admin`

**Admin login:**

- **Email**: `admin@example.com`
- **Password**: `admin123`

**Frontend:** Login, profile (email), and password reset at `/login`, `/profile`, `/forgot-password`. No registration. Cities directory on the home page; each city links to a subdomain (e.g. `http://austin.localhost`). Add subdomains to `/etc/hosts` if needed:

```
127.0.0.1 localhost austin.localhost portland.localhost denver.localhost seattle.localhost minneapolis.localhost
```

### Uploads (images)

- **Env:** The app reads `laravel/.env`. Copy the MinIO/uploads block from `docs/env-uploads.example` into **laravel/.env** (not the project root `.env`). Restart `docker compose up` after editing.
- **Admin:** In Admin go to **Roles** → edit your role → enable **Uploads** under System so the **Uploads** menu appears (bucket status and list).
- **Frontend:** For Sale create/edit pages have an **Images** section; add images there and submit. Processed images appear on the sale and in Admin → Uploads.
- **401 on upload:** The app’s `config/sanctum.php` treats the **current request host** as stateful, so API uploads work from any subdomain (e.g. `portland.bikeslist.test`) without setting `SANCTUM_STATEFUL_DOMAINS`. If you removed that config, set `SANCTUM_STATEFUL_DOMAINS` to your frontend domain(s).

### Reset the database

```bash
docker compose down -v
docker compose up --build
```

## License

MIT
