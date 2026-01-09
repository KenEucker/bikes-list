# Phase 01: Cities + System Settings + Admin City Management

## Scope

- Cities are persisted in Postgres via Prisma.
- System settings support global and per-city overrides (no business logic yet).
- Admin UI enables city creation, activation toggles, and import/export.
- Web app supports city routes and shows a "Coming Soon" state for inactive cities.

## Data model

### City

| Field | Notes |
| --- | --- |
| id | UUID primary key |
| country_code | ISO country code |
| region | Optional region/state |
| name | City name |
| slug | Unique slug for routing |
| timezone | IANA timezone |
| is_active | Controls "Coming Soon" state |
| created_at / updated_at | Audit timestamps |

### System settings

| Field | Notes |
| --- | --- |
| key | Setting name |
| value | Setting value (string) |
| city_id | Nullable override per city |

## API endpoints

- `GET /cities` – list all cities.
- `GET /cities/:slug` – fetch a single city by slug.
- `POST /admin/cities` – create a city (admin-only stub).
- `PATCH /admin/cities/:id` – toggle city activation (admin-only stub).
- `POST /admin/cities/import` – import cities from JSON or CSV (admin-only stub).
- `GET /admin/cities/export?format=json|csv` – export cities (admin-only stub).

Admin routes require the `x-admin: true` header for now.

## Admin UI

The admin panel at `/` includes:

- City list with active/inactive toggle.
- Create city form.
- Import JSON/CSV file.
- Export JSON/CSV file.

## Web routing

City pages are served at `/<citySlug>`.

Inactive cities display a "Coming Soon" message.
