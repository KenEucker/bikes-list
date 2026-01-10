# Phase 0 — Foundation: Monorepo, Docker, Tailwind, Logging

Codex Prompt — Phase 0

You are implementing Phase 0 of a new project called BikesList.

Goal: establish a clean, production-oriented foundation that all future phases will build on.

Requirements

Create a TypeScript monorepo with:

/apps
  /web     (public site – Astro SSR)
  /api     (Fastify API – TypeScript)
  /admin   (super-admin panel – Astro SSR)
/packages
  /shared  (shared types, zod schemas, utilities)
/docs
docker-compose.yml


Astro SSR

web and admin must run in SSR mode (Node adapter).

Both should share Tailwind config where possible.

Fastify API

TypeScript

JSON logging with request IDs

Health endpoint: GET /health

Tailwind CSS

Tailwind must be used as the primary styling system.

Minimize custom CSS classes.

Shared Tailwind config where possible.

Docker

docker-compose services:

db (Postgres)

api

web

admin

All services networked together.

Provide .env.example files.

Logging

Structured JSON logs

Correlation/request ID per request

Docs

Create docs/README.md

Create docs/ROADMAP.md (empty scaffold)

Create docs/DEVELOPMENT_LOG.md (empty scaffold)

Constraints

Do not implement features beyond scaffolding.

No auth yet.

No database schema yet beyond connectivity.

Deliverables

Full file tree

Working docker compose up

Health endpoints reachable

Tailwind working in both web and admin

# Phase 1 — Cities, System Settings, Admin-Only City Creation

Codex Prompt — Phase 1

Implement Phase 1: Cities + System Settings + Admin City Management.

Requirements

Prisma + Postgres

Initialize Prisma in apps/api

Create migrations

City model

Fields:

id (uuid)

country_code

region (nullable)

name

slug (unique)

timezone

is_active

created_at / updated_at

System Settings

Key/value settings table

Support global and per-city overrides

Examples (no logic yet):

enable_paid_listings

require_event_approval

image_verification_mode

Admin App

Admin-only city management UI:

Create city

Activate/deactivate city

Import cities (JSON/CSV)

Export cities (JSON/CSV)

Web App

City routing: /[citySlug]

Inactive cities show “Coming Soon”

API

Cities endpoints:

GET /cities

GET /cities/:slug

POST /admin/cities

Constraints

Only admin can create cities.

No auth enforcement yet; stub admin guard is acceptable.

Docs

Add docs/phases/phase-01-cities.md

Deliverables

Cities fully functional

Admin-only creation enforced

Import/export works

# Phase 2 — Auth, Roles, Ambassadors, Admin User Management

Codex Prompt — Phase 2

Implement Phase 2: Authentication, Roles, Ambassadors, Admin User Governance.

Authentication

No passwords.

Support:

Discord OAuth

Google OAuth

Magic link email

Models

User

Session

RoleAssignment:

role (USER, MAINTAINER, AMBASSADOR, ADMIN, SUPER_ADMIN)

scope:

city_id (nullable)

module (nullable: events, shops, orgs, forsale, images, ads, discord)

Admin App

User management:

Create users

Assign/remove roles

Assign ambassadors to cities

Remove ambassador roles

API

RBAC middleware

Session handling

Web

Login/logout

Show role-aware UI (no features yet)

Docs

docs/features/auth.md

docs/phases/phase-02-auth-rbac.md

Deliverables

Users can log in

Admin can manage users + ambassadors

Role enforcement works

# BikesList — Phase-Current + Detailed Phases (Rewrite starting at Phase 3)

This document captures:

1. **Phase-current baseline (Phases 0–2 completed)** — what we assume exists now and what must be true to proceed.
2. **Rewritten detailed phases starting at Phase 3** — thorough, end-to-end requirements with admin IA, models, endpoints, jobs, acceptance criteria, and docs.

---

## Phase-current baseline (Phases 0–2 completed)

### What you have now (and what we’ll assume going forward)

**Monorepo + services**
- `apps/web` (Astro SSR) running
- `apps/api` (Fastify TS) running
- `apps/admin` (Astro SSR) running (currently minimal UI)
- `packages/shared` exists
- Docker compose: Postgres + web + api + admin working together
- Tailwind is in place (at least for web; ideally admin too)

**Cities**
- City model + API endpoints + seed/import/export exist
- Admin can create cities (at least create)
- Web supports `/[citySlug]` and “coming soon” for inactive

**Auth + roles**
- Auth exists (Discord/Google/magic link) OR partially exists
- Users exist in DB
- Sessions exist
- Admin can create users and assign roles (but UX is minimal)
- Role enforcement exists in API in some form

### What is missing (and must be addressed before Phase 3 features get deep)

**Admin is not yet a real application**: it’s currently minimal/single-page.

Starting Phase 3, **Admin App UX & scaffolding** is a first-class requirement. Admin must have:
- A real layout with:
  - left nav / top nav
  - page routing
  - consistent components (tables, forms, dialogs)
- CRUD patterns:
  - list page
  - create page/modal
  - edit page
  - detail page
  - delete/disable action with confirmation
- Filters/search/pagination for lists
- Flash/toast notifications for actions
- “You are not authorized” states
- Audit log views (eventually)

These expectations are baked into Phase 3 onward.

---

# Rewritten phases starting at Phase 3 (detailed)

## Phase 3 — AdminJS (Fastify) + Media storage (S3-compatible) + Image moderation

### Why this phase exists

By the end of Phase 2, core services are connected, but:
- Admin UX is minimal and not scalable
- CRUD workflows are incomplete
- Moderation pipelines do not yet exist

Phase 3 establishes:
1. A **real admin interface** using AdminJS
2. A **media pipeline** that introduces moderation early
3. **UI standards** that all future frontend work must follow

---

## Architectural decisions (locked in)

### 1. AdminJS is the primary admin CRUD interface

- **AdminJS is mounted inside `apps/api` (Fastify)** at:
  ```
  /admin
  ```
- AdminJS handles:
  - CRUD for core platform data
  - Moderation queues
  - System settings
- AdminJS is **not styled with Tailwind**; it uses its own UI system.
- AdminJS is branded (name + colors), but not heavily customized.

### 2. Astro Admin app remains (optional but recommended)

- `apps/admin` continues to exist for:
  - dashboards
  - reports
  - job monitoring
  - analytics
- `apps/admin` links out to AdminJS for CRUD workflows.

### 3. Frontend UI standards (mandatory going forward)

For **all Astro-based frontend work** (`apps/web` and `apps/admin`):

1. **Tailwind CSS utility classes are the default**
2. **WebCoreUI is the component library**
   - buttons
   - tables
   - inputs
   - modals
   - toasts
   - navigation
3. Custom CSS is avoided except for:
   - fonts
   - CSS variables
   - minimal overrides
4. If a WebCoreUI component exists, **use it instead of custom markup**

These rules apply to **all future phases**.

---

## Phase 3 Outcomes

By the end of Phase 3:

- Admin has a fully usable, multi-resource CRUD UI
- Media uploads work end-to-end
- Image moderation is enforced
- Public pages only show approved media
- UI standards are documented and enforced

---

## AdminJS setup (detailed)

### Packages to install
- `adminjs`
- `@adminjs/fastify` (or compatible adapter)
- `@adminjs/prisma`
- Any required peer dependencies

### AdminJS authentication
- Only users with roles:
  - `ADMIN`
  - `SUPER_ADMIN`
- Use existing session/auth middleware from Phase 2
- If auth is incomplete, implement a temporary role guard that:
  - reads the authenticated user from request context
  - blocks access otherwise

### AdminJS resources (must be configured)

#### Platform
- **City**
  - create / edit / list / delete
- **SystemSetting**
  - global and per-city settings

#### Identity
- **User**
  - create / edit / list
- **RoleAssignment**
  - add/remove roles
  - assign ambassadors to cities and scopes

#### Moderation
- **MediaObject**
  - list
  - detail
  - approve action
  - reject action (requires rejection reason)
- **ModerationAction**
  - read-only audit log

Resources must be grouped in the AdminJS sidebar:
- Platform
- Identity
- Moderation

---

## Media storage (S3-compatible)

### Docker
Add `minio` service:

- persistent volume
- bucket auto-creation on startup
- credentials from env vars

### Required environment variables
```
S3_ENDPOINT
S3_REGION
S3_BUCKET
S3_ACCESS_KEY_ID
S3_SECRET_ACCESS_KEY
S3_PUBLIC_BASE_URL
```

Swapping to DigitalOcean Spaces or AWS S3 later must be **env-only**.

---

## Media data model

### MediaObject
- id
- owner_type (FOR_SALE | EVENT | SHOP | ORG | AD | USER_AVATAR)
- owner_id
- city_id (nullable)
- uploader_user_id (nullable)
- bucket
- key
- content_type
- byte_size
- width / height (optional)
- sha256 (optional)
- verification_status (PENDING | APPROVED | REJECTED)
- rejection_reason (nullable)
- timestamps

### ModerationAction
- id
- actor_user_id
- action_type
- entity_type
- entity_id
- city_id (nullable)
- note (nullable)
- timestamps

---

## API endpoints (Phase 3 scope)

### Upload flow
- `POST /media/presign-upload`
- `POST /media/complete-upload`
- `GET /media/:id`

### Moderation
- `GET /cities/:slug/media/pending`
- `POST /media/:id/approve`
- `POST /media/:id/reject`

### Security rules
- Only authenticated users may upload
- Only approved media is publicly visible
- AdminJS actions enforce role checks server-side

---

## Web integration (minimal validation)

To validate the pipeline without scope creep:

- Add image upload UI for **one feature only**:
  - For-sale listings (recommended)
  - OR user avatars
- Use:
  - presigned upload
  - completion callback
- Show placeholder images until approval

UI must follow:
- Tailwind utility classes
- WebCoreUI components

---

## Acceptance criteria

Phase 3 is complete when:

- AdminJS supports full CRUD for cities, users, roles
- Images can be uploaded, approved, and rejected
- Approved images appear publicly
- Rejected images do not
- UI standards are documented and followed

---

## Documentation updates (required)

Add the following files:

- `docs/phases/phase-03-adminjs-media.md` (this phase)
- `docs/features/adminjs.md` (setup + conventions)
- `docs/features/ui-standards.md` (Tailwind + WebCoreUI rules)

Update:
- `docs/DEVELOPMENT_LOG.md` with Phase 3 summary

---

## Notes for future phases

- All future admin CRUD should default to AdminJS unless:
  - complex workflows are required
  - visualization is needed
- All user-facing UI must remain:
  - simple
  - text-forward
  - utility-class driven

This phase establishes the operational backbone of BikesList.

## Phase 4 — Search (self-hosted) with indexing jobs + Admin controls

### Outcomes
- Search works across at least **For-sale** and **Events** (even if Events module lands later, you can index a placeholder type).
- Admin can reindex, view index health, and see failed indexing jobs.

### Scope decision baked in
Implement **self-hosted Meilisearch in docker** (not managed).
(You can later swap to Postgres FTS if desired, but Meilisearch gives a better UX quickly.)

### Admin IA additions
- **Search**
  - Overview (status, indexes, last indexed)
  - Reindex controls (per index)
  - Index job history (success/fail logs)

### Docker
Add `meilisearch` service with persistent volume.

### Data model
- `SearchIndexJob`
  - id
  - index_name
  - status (QUEUED/RUNNING/SUCCESS/FAILED)
  - started_at, finished_at
  - error (nullable)
  - triggered_by_user_id (nullable)
- Optionally `SearchOutbox` table for incremental updates (nice but can be later)

### API endpoints
- `GET /search/status` (admin only)
- `POST /search/reindex/:indexName` (admin only)
- `GET /search/jobs` (admin only)
- `GET /search/:citySlug/:module?q=...&filters...` (public)

### Implementation notes (must be in prompt)
- Index documents include `city_slug` to filter by route
- Keep document shape stable, versioned (so you can migrate later)
- On entity create/update/delete, enqueue index update (simple queue table is fine)

### Acceptance criteria
- Admin sees Meilisearch health.
- Reindex works from admin UI.
- Search returns reasonable results for seeded/sample content.

### Docs
- `docs/features/search.md` (now real, not placeholder)
- `docs/phases/phase-04-search.md`

---

## Phase 5 — For-sale (complete module) + Flags

### Outcomes
Craigslist-style for-sale is truly usable:
- Bikes / Parts / Gear categories
- $0 displayed as Free
- Expiration + renew
- Mark sold
- Flagging
- Images supported (via Phase 3 pipeline)

### Web UI pages (required)
For a city route `/[citySlug]/forsale`:
- List page:
  - filters: category, min/max price, query, condition
  - sorting: newest default
  - pagination
- Detail page:
  - title, price/free, date, condition, description
  - images gallery (approved only)
  - “flag listing”
- Create page (auth required)
- Edit page (owner or ambassador scope)
- “My listings” page (for logged-in users)

### Data model
- `ForSaleListing`
  - id, city_id, user_id
  - category enum (BIKES, PARTS, GEAR)
  - title, description
  - price_cents (nullable; 0 => Free)
  - condition enum
  - status (ACTIVE/SOLD/EXPIRED/REMOVED)
  - expires_at
  - timestamps
- `Flag`
  - id, entity_type, entity_id, city_id
  - reason enum
  - details (optional)
  - reporter_user_id nullable
  - status (OPEN/RESOLVED/REJECTED)
  - timestamps

### Admin/Ambassador IA additions
- **For-sale moderation**
  - Flags queue
  - Listing actions: hide/remove, restore, extend expiry, move category
- Flag detail page with context + actions
- Audit entries for moderation actions

### API endpoints (explicit)
- `GET /cities/:slug/forsale`
- `GET /forsale/:id`
- `POST /cities/:slug/forsale`
- `PATCH /forsale/:id`
- `POST /forsale/:id/mark-sold`
- `POST /forsale/:id/renew`
- `POST /flags` (for any module)
- `GET /admin/cities/:slug/flags`
- `POST /admin/flags/:id/resolve`
- `POST /admin/forsale/:id/remove`
- `POST /admin/forsale/:id/restore`

### Job
- Expiry sweep job (daily) sets ACTIVE → EXPIRED when past `expires_at`

### Acceptance criteria
- Real end-to-end flow works and is moderate-able.
- Flags appear in admin and can be resolved.

### Docs
- `docs/features/forsale.md`
- `docs/phases/phase-05-forsale.md`

---

## Phase 6 — Events (terms, code-of-conduct, recurrence, clone) + optional approval policy

### Outcomes
Events are safe and structured, not RSVP-based.
- Organizer name + URL required
- Terms acceptance **each post**
- Recurrence: weekly/bi-weekly/monthly
- Clone old events
- Optional approval (settings-driven per city)

### Web UI pages
`/[citySlug]/events`
- list page (upcoming + past, grouped by date)
- detail page
- create page:
  - requires checkbox acknowledgements:
    - Terms & Conditions
    - Ride-leader code of conduct
  - those must be recorded per event
- edit page
- clone action on detail

### Data model
- `Event`
  - id, city_id, user_id
  - title, description
  - start_at, end_at nullable
  - location_text
  - organizer_name, organizer_url
  - organization_id nullable
  - ride_id (stable public id)
  - status (PENDING/PUBLISHED/CANCELED/REMOVED)
  - recurrence fields (optional):
    - recurrence_type (NONE/WEEKLY/BIWEEKLY/MONTHLY)
    - recurrence_parent_id (for instances) OR series table
- `EventAcceptance`
  - event_id, user_id
  - terms_version, coc_version
  - accepted_at
- `EventClone`
  - old_event_id, new_event_id, user_id, created_at

### Admin/Ambassador IA
- Events queue (if approval enabled)
- Event moderation actions
- Acceptance/audit view

### API endpoints
- `GET /cities/:slug/events`
- `GET /events/:id`
- `POST /cities/:slug/events`
- `PATCH /events/:id`
- `POST /events/:id/cancel`
- `POST /events/:id/clone`
- `POST /events/:id/recurrence/generate` (admin/owner; optional)
- `GET /admin/cities/:slug/events/pending`

### Acceptance criteria
- Recurring creation produces correct future occurrences (bounded horizon).
- Clone works.
- Acceptance records are stored each time.

### Docs
- `docs/features/events.md`
- `docs/phases/phase-06-events.md`

---

## Phase 7 — Maps (Leaflet) + geolocation + external map links

### Outcomes
- Events and Shops can optionally have coordinates.
- Leaflet map displays when coords exist.
- External map links always available.

### Web UI
- Pin-drop picker (Vue island) on:
  - Event create/edit
  - Shop create/edit (later)
- Event detail page shows Leaflet map if lat/lng exists
- External links:
  - Google Maps
  - Bing Maps

### Data model additions
- Add `lat`, `lng` nullable to Event (and Shop later)

### Geolocation
- Coarse IP-based geolocation (server-side) used only for:
  - suggesting default city
  - ad targeting later
- Must be opt-out friendly and not stored as a profile identity

### Docs
- `docs/features/maps.md`
- `docs/phases/phase-07-maps.md`

---

## Phase 8 — Shops (approval-required) + claim flow + maintainer

### Outcomes
- Anyone can submit a shop listing (PENDING).
- Ambassadors/admin approve to publish.
- Claim requests allow LBS staff to become maintainers.

### Required Web UI
- `/[citySlug]/shops` list + filters
- Shop detail
- Submit shop form (auth)
- Claim shop flow

### Admin/Ambassador IA
- Shops pending queue
- Claim requests queue
- Shop edit + publish/unpublish
- Maintainer assignment view

### Data model
- `Shop`
  - id, city_id
  - status (PENDING/PUBLISHED/REMOVED)
  - claimed_by_user_id nullable
  - verification_status (UNCLAIMED/CLAIMED/VERIFIED)
  - address_text, phone, website, hours_text, services_tags
  - lat/lng nullable
- `ClaimRequest`
  - entity_type (SHOP/ORG)
  - entity_id
  - user_id
  - city_id
  - status (PENDING/APPROVED/REJECTED)
  - note
  - timestamps

### API
- `GET /cities/:slug/shops`
- `GET /shops/:id`
- `POST /cities/:slug/shops` (creates pending)
- `POST /shops/:id/claim`
- `GET /admin/cities/:slug/shops/pending`
- `POST /admin/shops/:id/approve`
- `POST /admin/shops/:id/reject`
- `POST /admin/claims/:id/approve`
- `POST /admin/claims/:id/reject`

### Docs
- `docs/features/shops.md`
- `docs/phases/phase-08-shops.md`

---

## Phase 9 — Organizations (approval-required) + claim flow

Same structure as Shops, plus org-specific fields.

### Docs
- `docs/features/organizations.md`
- `docs/phases/phase-09-organizations.md`

---

## Phase 10 — Discord Integration (fully specified, end-to-end)

### Outcomes
- Cities can link multiple Discord servers.
- Servers can be configured in either:
  - **BOT mode** (bot installed)
  - **WEBHOOK mode** (no bot)
- Ambassadors configure channel bindings per server.
- Publishing content creates “delivery jobs” that post to Discord with attribution.
- For bot-mode servers, BikesList can create Discord scheduled events.

### Admin/Ambassador IA (required pages)
In Admin under each City:
- **Discord Servers**
  - List linked servers
  - Add server flow:
    - Choose mode: Bot-installed vs Webhook-only
    - For bot mode:
      - show “Install bot” link
      - after install, allow selecting the guild from known guilds (or paste guild_id)
    - For webhook-only:
      - store server name + invite URL + webhooks per purpose
  - Server detail page:
    - status (connected / failing)
    - channel bindings
    - test post button
- **Channel Bindings**
  - For each purpose (forsale, events, shops, orgs, ads, announcements):
    - enable/disable
    - channel_id (bot mode) OR webhook_url (webhook mode)
- **Delivery Log**
  - list of deliveries (queued/sent/failed)
  - retry button for failed
  - view last error

### Data model
- `CityDiscordServer`
  - city_id, guild_id, name, icon_url, mode, invite_url, is_active
- `DiscordChannelBinding`
  - server_id, purpose, channel_id, webhook_url_encrypted, is_enabled
- `DiscordDeliveryJob`
  - entity_type, entity_id, server_id, binding_id
  - status QUEUED/SENT/FAILED
  - attempt_count, last_error, discord_message_id
  - timestamps
- `DiscordScheduledEventLink`
  - bikeslist_event_id, guild_id, discord_event_id

### API (explicit)
- `POST /admin/cities/:cityId/discord/servers` (add server)
- `PATCH /admin/discord/servers/:id` (edit)
- `DELETE /admin/discord/servers/:id` (disable/unlink with confirmation)
- `POST /admin/discord/servers/:id/bindings` (set bindings)
- `POST /admin/discord/servers/:id/test-post`
- `GET /admin/discord/deliveries?city=...`
- `POST /admin/discord/deliveries/:id/retry`

**Bot install flow**
- Provide an install URL with required scopes/permissions.
- Store bot token in env vars; never in DB.

**Posting**
- When a listing/event/shop/org is published/approved:
  - enqueue delivery jobs for all enabled bindings in that city
- Worker loop processes jobs:
  - respects rate limits
  - retries with backoff

**Attribution format**
- “Posted by {displayName} on BikesList”
- Include canonical URL back to BikesList

**Scheduled events**
- On BikesList event publish:
  - if server has “events” binding and is bot-mode:
    - create guild scheduled event
    - store mapping

### Acceptance criteria
- Linking and configuring servers is actually possible from admin UI.
- A for-sale post creates a Discord post in configured channels.
- Failures show up in delivery logs with retry.
- Events create Discord scheduled events where applicable.

### Docs
- `docs/features/discord.md`
- `docs/phases/phase-10-discord.md`

---

## Phase 11 — Ads + analytics + admin controls

### Outcomes
- LBS/org maintainers can create a simple “native ad”:
  - image + overlay text + link
- Ads are city-scoped and can be boosted by coarse geolocation.
- Ads have analytics: impressions + clicks.
- Admin can configure platform ad slots (including Google Ads scripts) with kill switches.

### Required pages
Web:
- Ad display placements on:
  - city home
  - module landing pages
  - detail pages (sidebar/below)
- Advertiser dashboard:
  - list of ads
  - create/edit
  - analytics view (7/30/90/lifetime)

Admin:
- Ads queue (pending approvals)
- Ads management by city
- Platform ads settings:
  - enable/disable google ads
  - script slot config
  - kill switch

### Data model
- `Advertisement` (city_id, owner_type, owner_id, media_id, overlay_text, target_url, placement_scope, status, starts_at, ends_at)
- `AdImpression` (ad_id, city_id, page_type, created_at)
- `AdClick` (ad_id, city_id, page_type, created_at)

### Acceptance criteria
- A maintainer can create an ad → goes pending → ambassador approves → appears on city pages.
- Analytics increment properly.
- Platform ads can be toggled off instantly.

### Docs
- `docs/features/ads.md`
- `docs/phases/phase-11-ads.md`

---

## Phase 12 — Admin diagnostics: jobs, logs, table browser, reporting, import/export tools

### Outcomes
Admin is a real operations console:
- Job status, runs, reruns
- Structured error viewer
- DB table browser (read-only)
- City reports
- Import/export for cities and other entities

### Required pages
Admin:
- **Jobs**
  - job list
  - job history
  - rerun / pause controls
- **Errors**
  - list + filters
  - detail by error id
  - link to “Create GitHub issue” prefill
- **Database**
  - table picker
  - paginated view
  - column filters
  - export CSV (read-only)
- **Reports**
  - per city KPIs
  - content volumes
  - moderation queue counts
  - discord delivery health
- **Imports/Exports**
  - cities (already)
  - ads
  - shops/orgs
  - possibly events (optional)

### Docs
- `docs/features/admin.md`
- `docs/phases/phase-12-admin-ops.md`

---

## Phase 13 — Launch hardening

### Outcomes
- Rate limiting
- Spam prevention
- Backups
- Deployment docs
- Performance pass
- Security review checklist

### Docs
- `docs/phases/phase-13-launch.md`
