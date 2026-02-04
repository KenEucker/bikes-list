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

### Reset the database

```bash
docker compose down -v
docker compose up --build
```

## License

MIT
