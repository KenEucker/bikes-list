# Phase 3 — AdminJS + Media pipeline + Moderation

## Outcomes
- AdminJS is mounted in `apps/api` at `/admin` with branded UI.
- CRUD coverage for cities, settings, users, and role assignments.
- Media upload flow is backed by S3-compatible storage and moderation actions.
- Approved media is the only publicly visible media.
- Astro UI follows Tailwind + WebCoreUI conventions.

## Architecture (locked)
- AdminJS runs inside the Fastify API (`apps/api`) at `/admin`.
- AdminJS uses its own UI system (no Tailwind overrides).
- Astro apps (`apps/web`, `apps/admin`) use Tailwind utilities and WebCoreUI components.

## AdminJS resources
**Platform**
- City
- SystemSetting

**Identity**
- User
- RoleAssignment

**Moderation**
- MediaObject (approve/reject actions)
- ModerationAction (read-only audit log)

## Media pipeline
### Upload flow
1. `POST /media/presign-upload` returns a presigned URL and media record.
2. Client uploads the object directly to S3-compatible storage.
3. `POST /media/complete-upload` finalizes metadata (dimensions, hashes).
4. Moderators approve/reject via AdminJS or API actions.

### Moderation
- `GET /cities/:slug/media/pending`
- `POST /media/:id/approve`
- `POST /media/:id/reject`

### Visibility rules
- Public requests only return approved media.
- Uploaders and admins can view pending media.

## Environment variables
```
S3_ENDPOINT
S3_REGION
S3_BUCKET
S3_ACCESS_KEY_ID
S3_SECRET_ACCESS_KEY
S3_PUBLIC_BASE_URL
```

## Docker (local dev)
- MinIO runs alongside the API with a persistent volume.
- A startup job creates the bucket and enables anonymous downloads.

## UI validation
- `/profile` in `apps/web` provides avatar upload + pending status.
- `apps/admin` links out to AdminJS for CRUD workflows.
