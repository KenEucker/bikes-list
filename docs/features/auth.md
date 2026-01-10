# Authentication + RBAC

## Overview

BikesList authentication uses session tokens stored in the API database. Users can sign in using:

- Discord OAuth
- Google OAuth
- Magic link email (link is returned by the API and logged for now)

Sessions are stored server-side and shared with clients via the `bl_session` cookie (HTTP-only, same-site).

## Roles

Roles are stored in `role_assignments` and can optionally be scoped to a city or a module.

| Role | Purpose |
| --- | --- |
| USER | Default role |
| MAINTAINER | Module/city maintainers |
| AMBASSADOR | City ambassadors |
| ADMIN | Platform admins |
| SUPER_ADMIN | Elevated admins (full control) |

Module scopes are optional and include: `events`, `shops`, `orgs`, `forsale`, `images`, `ads`, `discord`.

## Environment variables

| Variable | Description |
| --- | --- |
| `DISCORD_CLIENT_ID` | Discord OAuth client id |
| `DISCORD_CLIENT_SECRET` | Discord OAuth client secret |
| `DISCORD_REDIRECT_URL` | Callback URL for Discord OAuth |
| `GOOGLE_CLIENT_ID` | Google OAuth client id |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_REDIRECT_URL` | Callback URL for Google OAuth |
| `SUPER_ADMIN_EMAILS` | Comma-separated list of emails that auto-receive `SUPER_ADMIN` |

## API endpoints

### Session endpoints

- `GET /me` – returns the current user and role assignments.
- `POST /auth/logout` – revokes the current session and clears the cookie.

### Login endpoints

- `POST /auth/magic-link` – create a magic-link session; responds with `{ link }`.
- `GET /auth/magic-link/:token` – consume the magic link, set session cookie, redirect or return JSON.
- `GET /auth/discord` – redirect to Discord OAuth.
- `GET /auth/discord/callback` – complete Discord OAuth, set session cookie.
- `GET /auth/google` – redirect to Google OAuth.
- `GET /auth/google/callback` – complete Google OAuth, set session cookie.

### Admin RBAC

- `GET /admin/users` – list users with role assignments.
- `POST /admin/users` – create a user.
- `POST /admin/users/:id/roles` – assign a role.
- `DELETE /admin/users/:id/roles` – remove a role.

All admin endpoints require `ADMIN` or `SUPER_ADMIN` roles.
