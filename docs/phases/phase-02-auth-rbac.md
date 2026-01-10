# Phase 02: Authentication, Roles, Ambassadors, Admin Governance

## Scope

- OAuth sign-in with Discord and Google.
- Magic link email sign-in.
- Session handling and RBAC enforcement in the API.
- Admin UI to create users and assign/remove roles (including ambassadors).
- Role-aware UI on the web and admin surfaces.

## Data model

### User

| Field | Notes |
| --- | --- |
| id | UUID primary key |
| email | Unique email address |
| display_name | Optional display name |
| avatar_url | Optional avatar |
| discord_id / google_id | OAuth provider IDs |
| last_login_at | Timestamp of last login |

### Session

| Field | Notes |
| --- | --- |
| token | Session token used by the cookie |
| provider | Discord, Google, or magic link |
| expires_at | Session expiration |
| revoked_at | Session revocation timestamp |

### RoleAssignment

| Field | Notes |
| --- | --- |
| role | USER, MAINTAINER, AMBASSADOR, ADMIN, SUPER_ADMIN |
| city_id | Optional city scoping |
| module | Optional module scoping |

## API endpoints

### Auth + session

- `GET /me`
- `POST /auth/magic-link`
- `GET /auth/magic-link/:token`
- `GET /auth/discord`
- `GET /auth/discord/callback`
- `GET /auth/google`
- `GET /auth/google/callback`
- `POST /auth/logout`

### Admin RBAC

- `GET /admin/users`
- `POST /admin/users`
- `POST /admin/users/:id/roles`
- `DELETE /admin/users/:id/roles`

Admin endpoints require `ADMIN` or `SUPER_ADMIN` roles.

## Admin UI

- Create users.
- Assign/remove role assignments.
- Assign ambassadors to cities (AMBASSADOR role with city scope).
- View current session roles.

## Web UI

- Login/logout entry points.
- Role badges on the home page.

## Notes

- Magic links are returned by the API and logged for delivery tooling integration later.
- `SUPER_ADMIN_EMAILS` assigns the SUPER_ADMIN role on login for listed email addresses.
