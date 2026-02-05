# BikesList Upload & Object Storage Strategy Specification

**Status:** Draft

**Audience:** Platform contributors, operators

**Scope:** Defines the upload strategy and object storage approach for BikesList across development (MinIO) and production (DigitalOcean Spaces), including WebP conversion and derivative size generation.

**Applies to:** bikeslist (Laravel app), Docker stack, background jobs/queue

---

## 1. Goals

1. Provide a **single, S3-compatible storage interface** that works identically in:

   * **Development:** self-hosted **MinIO** inside the project Docker stack
   * **Production:** **DigitalOcean Spaces** (S3-compatible)
2. Ensure uploads are stored as **WebP** (or maintain originals where required) and generate **smaller variants** on upload.
3. Keep the application **provider-swappable via environment variables only**.
4. Support both:

   * Server-handled uploads (direct multipart to app)
   * Optional future: signed URL direct-to-object-store uploads

## 2. Non-Goals

* Designing a full CDN strategy (though storage URLs should be CDN-friendly).
* Implementing complex lifecycle policies, replication, or multi-region.
* Supporting non-S3 storage backends.

## 3. Definitions

* **Original:** The user-uploaded source image (jpg/png/heic/etc.).
* **Canonical WebP:** The normalized “primary” stored image format for display.
* **Variants:** Derived images (smaller sizes) for responsive usage.
* **Bucket:** S3/Spaces/MinIO bucket name.
* **Object Key:** Path within bucket.

## 4. Storage Backends

### 4.1 Development: MinIO

* Runs as a service in Docker compose.
* Bucket created automatically on compose startup.
* App uses internal endpoint (container DNS name): `http://minio:9000`.
* Path-style access is enabled.

### 4.2 Production: DigitalOcean Spaces

* Uses the Spaces endpoint, e.g. `https://nyc3.digitaloceanspaces.com`.
* Prefer virtual-hosted style URLs where possible (configurable).
* Optional CDN domain may be used for public URLs.

### 4.3 Provider-Swappability

* App code must not contain any MinIO/DO-specific logic.
* All differences are handled by environment configuration.
* Laravel filesystem disk used: `s3` (or `uploads`) backed by Flysystem S3 driver.

## 5. Environment Configuration

### 5.1 Required Environment Variables

These env vars MUST be sufficient to switch providers:

* `UPLOADS_DRIVER=s3` (default)
* `UPLOADS_BUCKET=<bucket-name>`
* `UPLOADS_REGION=<region>` (MinIO can be `us-east-1`)
* `UPLOADS_KEY=<access-key>`
* `UPLOADS_SECRET=<secret-key>`
* `UPLOADS_ENDPOINT=<endpoint-url>`

  * MinIO: `http://minio:9000`
  * DO: `https://nyc3.digitaloceanspaces.com`
* `UPLOADS_URL=<public-base-url>`

  * MinIO local (simple dev): `http://localhost:9000/<bucket>`
  * DO: `https://<bucket>.<region>.digitaloceanspaces.com` (or CDN)
* `UPLOADS_PATH_STYLE=true|false`

  * MinIO: `true`
  * DO: typically `false`, but configurable

### 5.2 Optional Environment Variables

* `UPLOADS_VISIBILITY=public|private` (default: `public` for images)
* `UPLOADS_PREFIX=uploads` (default prefix for all keys)

## 6. Object Key Strategy

Uploads MUST be stored predictably to simplify URL generation and caching.

### 6.1 Key Format

`<prefix>/<resource>/<resource-id>/<asset-id>/<variant>.<ext>`

* `prefix`: from `UPLOADS_PREFIX` (default `uploads`)
* `resource`: e.g. `listings`, `parts`, `events`, `pages`, `profiles`
* `resource-id`: numeric or UUID
* `asset-id`: UUID for each uploaded asset
* `variant`: `original`, `webp`, `sm`, `md`, `lg` (see §7)
* `ext`: `webp` for all derived variants; `original` may keep original extension

### 6.2 Example Keys

* `uploads/listings/123/550e8400-e29b-41d4-a716-446655440000/original.jpg`
* `uploads/listings/123/550e8400-e29b-41d4-a716-446655440000/webp.webp`
* `uploads/listings/123/550e8400-e29b-41d4-a716-446655440000/sm.webp`
* `uploads/listings/123/550e8400-e29b-41d4-a716-446655440000/md.webp`
* `uploads/listings/123/550e8400-e29b-41d4-a716-446655440000/lg.webp`

## 7. Image Processing Strategy

### 7.1 Supported Inputs

Only **static images** are allowed:

* `jpeg`
* `jpg`
* `png`
* `bmp`
* `webp`

Animated images (including animated GIFs or animated WebP) are **explicitly not supported** and MUST be rejected at validation time.

### 7.2 Canonical Output Format

* All stored display images MUST be **WebP**.
* Originals MUST NOT be retained by default.
* Canonical encoding quality:

  * Default: `q=82`
  * Configurable via env/config if needed

### 7.3 Variants (Exact Dimensions)

The following variants MUST be generated for every upload:

| Variant | Width (px) | Use                     |
| ------- | ---------- | ----------------------- |
| `sm`    | 240        | Thumbnails, dense lists |
| `md`    | 520        | Cards, feeds            |
| `lg`    | 720        | Primary / detail view   |

Rules:

* Preserve aspect ratio.
* Width-based resizing only.
* Do not upscale smaller images.
* The `lg` variant is considered the **main / canonical display image**.

### 7.4 When Variants Are Generated

On upload, BikesList MUST:

1. Validate image type and dimensions.
2. Generate `sm`, `md`, and `lg` WebP variants.
3. Upload variants to object storage.
4. Persist upload metadata and variant keys.

Original source files MUST be discarded after processing unless explicitly enabled for debugging.

### 7.5 Metadata

Store the following in the database:

* `id` (UUID)
* `resource_type`, `resource_id`
* `mime_original`
* `width`, `height` (of canonical `lg` variant)
* `variants` map: `{ sm, md, lg }`
* `visibility`
* `created_by`

Avoid storing sensitive or critical metadata solely in object storage.

### 7.6 EXIF Handling

* All EXIF metadata (including GPS) MUST be stripped during processing.

## 8. Execution Model (Sync vs Async)

### 8.1 Default: Job-Based Processing

* Upload endpoint stores the raw file temporarily (disk) and creates an `Upload` record in `processing` state.
* Dispatch a queue job `ProcessUploadVariants`.
* Job:

  * Downloads temp/original
  * Generates variants
  * Uploads to object store
  * Marks `Upload` as `ready`

### 8.2 Fallback: Synchronous Processing

* If queue is disabled in dev, allow processing inline behind a feature flag:

  * `UPLOADS_PROCESS_SYNC=true`

### 8.3 Idempotency

* Variant generation must be idempotent:

  * If keys already exist, skip re-upload unless forced.
  * Ensure consistent output for same input.

## 9. Public URLs and Caching

### 9.1 URL Generation

* Public URL MUST be constructed via Laravel Storage (`url()`), which uses `UPLOADS_URL` base.
* Avoid leaking `UPLOADS_ENDPOINT` externally.

### 9.2 Cache Headers

* Objects should be uploaded with cache headers appropriate for immutable content:

  * `Cache-Control: public, max-age=31536000, immutable`

Rationale: keys are content-immutable (asset UUIDs), so aggressive caching is safe.

## 10. API / Domain Integration

### 10.1 Upload API Shape (Conceptual)

#### Direct Upload via Signed URLs (Preferred)

* `POST /api/uploads/sign`

  * Authenticated
  * Returns:

    * `upload_id`
    * `signed_url`
    * required headers
* Client uploads file **directly to object storage**.
* Client notifies server when upload completes.
* Server processes variants via job.

#### Server-Handled Upload (Fallback)

* `POST /api/uploads` (multipart)
* Server stores temp file, then processes variants.

### 10.2 Resource Attachment

Domain resources (listings, events, pages, profiles) MUST reference uploads by **upload id**, not raw URLs.

URLs are derived dynamically from variant keys and storage config.

## 11. Security & Abuse Controls

* Validate file type by sniffing content (not only extension).
* Enforce max size (e.g. 15MB) and max dimensions (e.g. 8000x8000).
* Strip EXIF metadata for privacy (especially GPS), unless explicitly required.
* Rate limit upload endpoints.

## 12. Documentation (Inline)

This specification is the **authoritative documentation** for BikesList uploads and object storage.

All implementation prompts, code changes, and operational guidance MUST reference and follow this document directly.

The following documentation requirements are defined inline and must be satisfied by the implementation:

### 12.1 Developer Setup (Local / MinIO)

* `docker compose up` MUST start a MinIO service automatically.
* A default bucket MUST be created on startup.
* Developers MUST be able to:

  * Upload images through the BikesList app
  * See generated WebP variants in MinIO
* MinIO Console MUST be reachable at:

  * `http://localhost:9001`

### 12.2 Environment Switching (MinIO → DigitalOcean Spaces)

Switching providers MUST require **only environment variable changes**.

The documentation for this switch is defined here and MUST be reflected in `.env.example`:

**MinIO (dev)**

* `UPLOADS_ENDPOINT=http://minio:9000`
* `UPLOADS_URL=http://localhost:9000/<bucket>`
* `UPLOADS_PATH_STYLE=true`
* `UPLOADS_REGION=us-east-1`

**DigitalOcean Spaces (prod)**

* `UPLOADS_ENDPOINT=https://<region>.digitaloceanspaces.com`
* `UPLOADS_URL=https://<bucket>.<region>.digitaloceanspaces.com` (or CDN)
* `UPLOADS_PATH_STYLE=false`
* `UPLOADS_REGION=<region>`

No code changes are permitted when switching environments.

### 12.3 Image Pipeline Behavior

* All uploads MUST result in:

  * A canonical WebP
  * `sm`, `md`, `lg` WebP variants
* Variant dimensions and quality MUST match §7.
* Originals MAY be retained based on configuration.

### 12.4 Debugging & Verification

The implementation MUST provide at least one of the following:

* An Artisan command to smoke-test uploads and variant generation
* OR an admin-only endpoint that validates:

  * bucket connectivity
  * write/read permissions
  * variant presence

### 12.5 Logging Expectations

Upload processing MUST emit structured logs including:

* upload id
* resource type / id
* variant generation status
* timing and failure reasons

This logging behavior is part of the contract defined by this spec.

## 13. Observability

* Log upload processing events:

  * start/end, duration, sizes, variant results
* Emit structured logs with upload id and resource id.
* Record job failures and surface status in admin UI.

## 14. Acceptance Criteria

1. In dev, uploading an image results in the expected S3 objects in MinIO:

   * `original` (if enabled)
   * `webp`, `sm`, `md`, `lg` as WebP
2. In prod, switching env vars to DO Spaces stores and serves the same objects.
3. No code changes are required to switch from MinIO to DO.
4. Public URLs resolve correctly in both environments.
5. Variant generation is deterministic and idempotent.