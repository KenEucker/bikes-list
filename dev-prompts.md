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

# Phase 3 — Media Storage (S3-Compatible) + Image Moderation

Codex Prompt — Phase 3

Implement Phase 3: Image Uploads with S3-Compatible Storage and Moderation.

Storage

Add MinIO to docker-compose

Use AWS S3 SDK configured via env vars

Image Model

image_url

owner_type / owner_id

verification_status (PENDING, APPROVED, REJECTED)

API

Presigned upload URLs

Image moderation endpoints

Admin / Ambassador UI

Image approval queue

Web

Image upload components (Vue island allowed)

Approved images only shown publicly

Docs

docs/features/storage.md

docs/phases/phase-03-media.md

Deliverables

Upload → approve → display flow works

# Phase 4 — Search (Self-Hosted)

Codex Prompt — Phase 4

Implement Phase 4: Search Infrastructure.

Requirements

Self-hosted search (Meilisearch or Postgres FTS)

Docker service if external

API

Indexing pipeline

Reindex endpoints

Admin

Search status + reindex button

Web

Basic search UI (Craigslist style)

Docs

docs/features/search.md

Deliverables

Search works for at least one entity

# Phase 5 — For-Sale Listings

Codex Prompt — Phase 5

Implement Phase 5: For-Sale Listings (Bikes / Parts / Gear).

Features

Create/edit/delete listings

$0 → Free

Expiration + renew

Mark sold

Flag listings

API

City-scoped listing endpoints

Web

List + detail pages

Docs

docs/features/forsale.md

Deliverables

End-to-end classifieds flow

# Phase 6 — Moderation + Audit + Error → GitHub Issue

Codex Prompt — Phase 6

Implement Phase 6: Moderation, Audit Logs, Error Reporting.

Features

Flag queues

Hide/unhide

Soft-ban users

Audit log

Error Reporting

ErrorReport model

Toast: “Uh oh! We encountered an error”

Button: “Create GitHub issue”

Prefilled GitHub issue URL with safe data only

Admin

Error viewer by error ID

Docs

docs/features/errors-and-audit.md

Deliverables

Moderation + audit usable

GitHub issue creation flow works

# Phase 7 — Events (Recurring, Clone, Terms)

Codex Prompt — Phase 7

Implement Phase 7: Events.

Requirements

Organizer name + URL required

Terms + Ride Leader Code acceptance per post

Recurring: weekly/bi-weekly/monthly

Clone existing events

Docs

docs/features/events.md

Deliverables

Safe, reusable event system

# Phase 8 — Maps (Leaflet)

Codex Prompt — Phase 8

Implement Phase 8: Maps with Leaflet.

Features

lat/lng fields

Leaflet map on event/shop detail pages

External links (Google, Bing)

Docs

docs/features/maps.md

# Phase 9 — Shops (Approval + Claim)

Codex Prompt — Phase 9

Implement Phase 9: Local Bike Shops Directory.

Approval required

Claim flow

Maintainer roles

Docs

docs/features/shops.md

# Phase 10 — Organizations

Codex Prompt — Phase 10

Implement Phase 10: Organizations Directory.

Same pattern as shops.

Docs

docs/features/orgs.md

# Phase 11 — Discord Integration

Codex Prompt — Phase 11

Implement Phase 11: Discord Integration.

Features

Link servers per city

Bot install

Webhook fallback

Channel bindings

Attribution posting

Discord scheduled events

Docs

docs/features/discord.md

# Phase 12 — Ads + Analytics

Codex Prompt — Phase 12

Implement Phase 12: Advertisements + Analytics.

LBS/org ads

City-scoped

Impression + click tracking

Admin platform ads

Docs

docs/features/ads.md

# Phase 13 — Admin Hardening + Reporting

Codex Prompt — Phase 13

Implement Phase 13: Admin Diagnostics & Reporting.

Jobs

Logs

Reports

DB browser (read-only)

Docs

docs/features/admin.md

# Phase 14 — Launch Hardening

Codex Prompt — Phase 14

Implement Phase 14: Launch Hardening.

Rate limiting

Spam prevention

Backups

Deployment docs

Docs

docs/phases/phase-14-launch.md
