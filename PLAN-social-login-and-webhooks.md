# Development Plan: Social Login & Webhook PubSub Events

## Overview

Two features to implement:

1. **Social Login** -- Google and Discord OAuth via Laravel Socialite
2. **Webhook PubSub Events** -- Dispatch domain events (e.g. `ride.created`, `sale.created`) to configured webhook URLs for integrations like Discord/Slack

---

## Feature 1: Social Login (Google & Discord via Socialite)

### 1.1 Install & Configure Socialite

**Files to create/modify:**
- `composer.json` -- add `laravel/socialite` dependency
- `laravel/config/services.php` -- add `google` and `discord` OAuth credentials blocks
- `.env.example` -- add placeholder env vars

**Details:**
- Run `composer require laravel/socialite`
- Add to `laravel/config/services.php`:
  ```
  'google' => [
      'client_id'     => env('GOOGLE_CLIENT_ID'),
      'client_secret' => env('GOOGLE_CLIENT_SECRET'),
      'redirect'      => env('GOOGLE_REDIRECT_URI', '/auth/google/callback'),
  ],
  'discord' => [
      'client_id'     => env('DISCORD_CLIENT_ID'),
      'client_secret' => env('DISCORD_CLIENT_SECRET'),
      'redirect'      => env('DISCORD_REDIRECT_URI', '/auth/discord/callback'),
  ],
  ```
- Add env vars to `.env.example`:
  ```
  GOOGLE_CLIENT_ID=
  GOOGLE_CLIENT_SECRET=
  GOOGLE_REDIRECT_URI=/auth/google/callback
  DISCORD_CLIENT_ID=
  DISCORD_CLIENT_SECRET=
  DISCORD_REDIRECT_URI=/auth/discord/callback
  ```
- Discord is not a built-in Socialite provider. Install the community driver: `composer require socialiteproviders/discord`. Register its event listener in `EventServiceProvider` per the socialiteproviders docs (listens to `SocialiteWasCalled`).

---

### 1.2 Database Migration: `social_accounts` Table

**Files to create:**
- `database/migrations/xxxx_xx_xx_xxxxxx_create_social_accounts_table.php`

**Schema:**
```
social_accounts
├── id (bigIncrements)
├── user_id (foreignId -> users.id, cascadeOnDelete)
├── provider (string, e.g. 'google', 'discord')
├── provider_id (string, the OAuth provider's user ID)
├── provider_token (text, nullable, encrypted -- access token)
├── provider_refresh_token (text, nullable, encrypted)
├── token_expires_at (timestamp, nullable)
├── avatar_url (string, nullable)
├── provider_email (string, nullable)
├── timestamps
└── unique index on (provider, provider_id)
```

**Rationale:** A separate `social_accounts` table (rather than columns on `users`) allows a single user to link multiple providers and keeps the users table clean. The unique constraint on `(provider, provider_id)` prevents duplicate links.

---

### 1.3 Update User Model

**Files to modify:**
- `app/Domain/Auth/User.php`

**Changes:**
- Add `socialAccounts()` HasMany relationship to `SocialAccount` model
- Add helper: `linkedProviders(): Collection` -- returns list of linked provider names
- Add helper: `hasSocialAccount(string $provider): bool`

---

### 1.4 Create SocialAccount Model

**Files to create:**
- `app/Domain/Auth/SocialAccount.php`

**Details:**
- `$fillable`: `user_id`, `provider`, `provider_id`, `provider_token`, `provider_refresh_token`, `token_expires_at`, `avatar_url`, `provider_email`
- `$casts`: `provider_token` and `provider_refresh_token` as `encrypted`, `token_expires_at` as `datetime`
- `user()` BelongsTo relationship
- Scope `scopeForProvider(Builder $query, string $provider)` for convenience

---

### 1.5 Create SocialLoginController

**Files to create:**
- `app/Http/Controllers/Auth/SocialLoginController.php`

**Routes (replace existing placeholders in `routes/web.php`):**
```
GET  /auth/{provider}/redirect   -> redirect()    -- name: auth.social.redirect
GET  /auth/{provider}/callback   -> callback()    -- name: auth.social.callback
POST /account/settings/social/{provider}/disconnect -> disconnect()  -- name: auth.social.disconnect
```

**Constrain `{provider}`** to `google|discord` using `->whereIn('provider', ['google', 'discord'])`.

**Controller methods:**

#### `redirect(string $provider)`
- Validate provider is supported
- Return `Socialite::driver($provider)->redirect()`

#### `callback(string $provider)`
- Try/catch around `Socialite::driver($provider)->user()`
- On failure, redirect to login with error flash
- Look up `SocialAccount` by `(provider, provider_id)`
- **If social account exists:** Log in the associated user, update token fields, redirect to dashboard
- **If user is already authenticated (linking flow):** Create `SocialAccount` record for current user, redirect to account settings with success flash
- **If social account doesn't exist and guest:**
  - Look up existing user by email match (Socialite user email == users.email)
  - If match found: create `SocialAccount` link, log them in, redirect to dashboard
  - If no match: create new `User` (set `display_name` from Socialite name, `email` from Socialite email, `status` = active, `email_verified_at` = now), create `SocialAccount`, log in, redirect to dashboard
- All database operations wrapped in `DB::transaction()`

#### `disconnect(string $provider)` (auth required)
- Find current user's `SocialAccount` for provider
- Ensure user has at least one other auth method (another social account or a valid email/magic-link flow) before allowing disconnect -- prevent lockout
- Delete the `SocialAccount`
- Redirect back with success flash

---

### 1.6 Update Routes

**Files to modify:**
- `routes/web.php`

**Changes:**
- Remove the two existing placeholder callback routes (`/auth/google/callback` and `/auth/discord/callback`)
- Add the three new routes from 1.5 above
- Group social routes under appropriate middleware (guest for redirect/callback, auth for disconnect)

---

### 1.7 Frontend: Login Page & Account Settings

**Files to modify:**
- Login/sign-in view (likely an Inertia/Vue component at `resources/js/Pages/Auth/` or Blade template)
- Account settings view

**Login page changes:**
- Add "Continue with Google" button linking to `/auth/google/redirect`
- Add "Continue with Discord" button linking to `/auth/discord/redirect`
- Style with provider brand colors/icons
- Add a visual separator ("or") between social buttons and magic link form

**Account settings changes:**
- Add "Connected Accounts" section
- For each supported provider, show:
  - Connected status (with provider email/avatar if linked)
  - "Connect" button (links to `/auth/{provider}/redirect`) if not linked
  - "Disconnect" button (POST to `/account/settings/social/{provider}/disconnect`) if linked
- Show warning if disconnecting would leave no auth method

---

### 1.8 Tests

**Files to create:**
- `tests/Feature/Auth/SocialLoginTest.php`

**Test cases:**
- Redirect to Google/Discord generates correct OAuth URL
- Callback with valid Google user creates new user + social account
- Callback with valid Discord user creates new user + social account
- Callback links social account to existing user with matching email
- Callback logs in existing user who already has a linked social account
- Authenticated user can link a new provider
- Authenticated user can disconnect a provider (when another auth method exists)
- Authenticated user cannot disconnect last auth method (prevent lockout)
- Callback with invalid/failed OAuth redirects with error
- Invalid provider name returns 404
- Token fields are stored encrypted

---

## Feature 2: Webhook PubSub Events

### 2.1 Database Migration: `webhook_endpoints` Table

**Files to create:**
- `database/migrations/xxxx_xx_xx_xxxxxx_create_webhook_endpoints_table.php`
- `database/migrations/xxxx_xx_xx_xxxxxx_create_webhook_deliveries_table.php`

**`webhook_endpoints` schema:**
```
webhook_endpoints
├── id (bigIncrements)
├── user_id (foreignId -> users.id, nullable, cascadeOnDelete)
├── url (string) -- the target webhook URL
├── secret (string, encrypted) -- shared secret for HMAC signature verification
├── description (string, nullable) -- human-readable label
├── events (json) -- array of subscribed event names, e.g. ["ride.created", "sale.created"]
├── is_active (boolean, default true)
├── failure_count (integer, default 0) -- consecutive delivery failures
├── last_triggered_at (timestamp, nullable)
├── timestamps
└── index on (is_active)
```

**`webhook_deliveries` schema (delivery log):**
```
webhook_deliveries
├── id (bigIncrements)
├── webhook_endpoint_id (foreignId -> webhook_endpoints.id, cascadeOnDelete)
├── event_name (string) -- e.g. "sale.created"
├── payload (json) -- the full JSON payload sent
├── response_status (smallInteger, nullable) -- HTTP status code received
├── response_body (text, nullable) -- truncated response body
├── attempt (smallInteger, default 1) -- which retry attempt
├── delivered_at (timestamp, nullable) -- when successfully delivered
├── failed_at (timestamp, nullable) -- when delivery failed
├── error_message (text, nullable) -- error details on failure
├── timestamps
```

**Rationale:** The `webhook_deliveries` table provides an audit trail and allows users/admins to debug failed deliveries. The `failure_count` on endpoints enables automatic disabling after repeated failures.

---

### 2.2 Models

**Files to create:**
- `app/Domain/Webhooks/WebhookEndpoint.php`
- `app/Domain/Webhooks/WebhookDelivery.php`

**WebhookEndpoint:**
- `$fillable`: `user_id`, `url`, `secret`, `description`, `events`, `is_active`, `failure_count`, `last_triggered_at`
- `$casts`: `events` as `array`, `secret` as `encrypted`, `is_active` as `boolean`, `last_triggered_at` as `datetime`
- Relationships: `user()` BelongsTo, `deliveries()` HasMany
- Scopes: `scopeActive()`, `scopeSubscribedTo(string $event)`
- Methods: `subscribesTo(string $event): bool`, `recordFailure()`, `resetFailures()`
- Auto-disable: when `failure_count` reaches a configurable threshold (e.g. 10), set `is_active = false`

**WebhookDelivery:**
- `$fillable`: `webhook_endpoint_id`, `event_name`, `payload`, `response_status`, `response_body`, `attempt`, `delivered_at`, `failed_at`, `error_message`
- `$casts`: `payload` as `array`, `delivered_at` as `datetime`, `failed_at` as `datetime`
- Relationship: `endpoint()` BelongsTo

---

### 2.3 Define Domain Events

**Files to create:**
- `app/Domain/Events/SaleCreated.php`
- `app/Domain/Events/RideCreated.php`
- (Extensible -- add more as needed: `sale.updated`, `sale.sold`, `ride.updated`, etc.)

**Event class pattern:**
```php
class SaleCreated implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public function __construct(public Sale $sale) {}

    public function broadcastAs(): string
    {
        return 'sale.created';
    }
}
```

Each event carries the relevant model and exposes a `broadcastAs()` name matching the webhook event name string.

---

### 2.4 Webhook Dispatch Service

**Files to create:**
- `app/Domain/Webhooks/WebhookDispatcher.php`

**Responsibilities:**
- `dispatch(string $eventName, array $payload): void`
  - Query `WebhookEndpoint::active()->subscribedTo($eventName)`
  - For each matching endpoint, dispatch a `DeliverWebhookJob` (queued)
- `buildPayload(string $eventName, Model $model): array`
  - Standardized envelope format:
    ```json
    {
      "event": "sale.created",
      "timestamp": "2026-02-07T12:00:00Z",
      "data": { ... serialized model ... }
    }
    ```

---

### 2.5 Webhook Delivery Job

**Files to create:**
- `app/Jobs/DeliverWebhookJob.php`

**Details:**
- Queued job on a dedicated `webhooks` queue
- Accepts: `WebhookEndpoint $endpoint`, `string $eventName`, `array $payload`
- **Signing:** Generate HMAC-SHA256 signature of the JSON payload using the endpoint's `secret`. Send as `X-Signature-256` header.
- **Headers sent:**
  - `Content-Type: application/json`
  - `X-Signature-256: sha256=<hex_digest>`
  - `X-Webhook-Event: sale.created`
  - `X-Webhook-Delivery: <delivery_uuid>`
  - `User-Agent: Bikeslist-Webhooks/1.0`
- **HTTP request:** POST to endpoint URL with JSON payload, timeout of 10 seconds
- **On success (2xx):** Create `WebhookDelivery` record with `delivered_at`, reset endpoint `failure_count`, update `last_triggered_at`
- **On failure (non-2xx or exception):** Create `WebhookDelivery` record with `failed_at` and `error_message`, increment endpoint `failure_count`
- **Retries:** Use Laravel's built-in job retry with exponential backoff: `$backoff = [30, 120, 600]` (30s, 2m, 10m). Max 3 attempts. Each attempt creates its own delivery record.
- **Auto-disable:** After recording failure, check if `failure_count >= 10`. If so, set `is_active = false`. Optionally notify the endpoint owner.

---

### 2.6 Event Listeners (Wire Events to Dispatcher)

**Files to create:**
- `app/Domain/Webhooks/WebhookEventSubscriber.php`

**Details:**
- Laravel event subscriber class
- `subscribe(Dispatcher $events)` method registers listeners:
  - `SaleCreated::class => handleSaleCreated`
  - `RideCreated::class => handleRideCreated`
- Each handler calls `WebhookDispatcher::dispatch()` with the event name and serialized payload
- Register the subscriber in `EventServiceProvider`

**Integration with existing observers:**
- In `app/Providers/EventServiceProvider.php`, the `Sale::created` observer already dispatches `SpamCheckJob`. Add a `SaleCreated` event dispatch alongside it (or fire the event from the observer).
- For rides, add similar observer logic or fire `RideCreated` from the ride creation flow.

---

### 2.7 Webhook Payload Serialization

**Files to create:**
- `app/Domain/Webhooks/Payloads/SalePayload.php`
- `app/Domain/Webhooks/Payloads/RidePayload.php`

**Purpose:** Dedicated payload transformer classes that convert models into stable, documented JSON structures. This decouples the webhook contract from internal model changes.

**Example `SalePayload::fromModel(Sale $sale)`:**
```json
{
  "id": 42,
  "title": "2024 Surly Straggler",
  "type": "bicycle",
  "price_cents": 120000,
  "currency": "USD",
  "state": "active",
  "region": "portland",
  "url": "https://portland.bikeslist.org/for-sale/42",
  "created_at": "2026-02-07T12:00:00Z"
}
```

---

### 2.8 Admin UI: Webhook Management (Orchid)

**Files to create:**
- `laravel/app/Orchid/Screens/WebhookEndpointListScreen.php`
- `laravel/app/Orchid/Screens/WebhookEndpointEditScreen.php`
- `laravel/app/Orchid/Screens/WebhookDeliveryListScreen.php`

**Routes to add** (in `laravel/routes/platform.php`):
```
/admin/webhooks                 -> WebhookEndpointListScreen
/admin/webhooks/create          -> WebhookEndpointEditScreen
/admin/webhooks/{endpoint}/edit -> WebhookEndpointEditScreen
/admin/webhooks/{endpoint}/deliveries -> WebhookDeliveryListScreen
```

**Screens:**
- **List screen:** Table of all webhook endpoints with columns: URL (truncated), events, active status, failure count, last triggered. Actions: edit, toggle active, delete.
- **Edit screen:** Form fields for URL, description, events (multi-select from known event list), active toggle. Auto-generate secret on create. Show secret once on creation (or allow regeneration).
- **Deliveries screen:** Filterable log of deliveries for an endpoint. Columns: event, status code, attempt, delivered/failed timestamp. Action: view full payload and response.

---

### 2.9 Consumer UI: Webhook Settings (Optional / Future)

**Files to modify:**
- Account settings view (if exposing webhook configuration to regular users)

**Scope decision:** For initial implementation, webhook management should be admin-only via Orchid. User-facing webhook management can be added later if needed. The `user_id` nullable foreign key on `webhook_endpoints` supports both admin-global and per-user endpoints.

---

### 2.10 Configuration

**Files to create/modify:**
- `config/webhooks.php`

**Config values:**
```php
return [
    'signing_algorithm' => 'sha256',
    'timeout_seconds' => 10,
    'max_retries' => 3,
    'backoff' => [30, 120, 600],
    'auto_disable_threshold' => 10,
    'queue' => 'webhooks',
    'supported_events' => [
        'sale.created',
        'sale.updated',
        'sale.sold',
        'sale.deleted',
        'ride.created',
        'ride.updated',
        'ride.cancelled',
    ],
    'payload_max_size' => 65536, // 64KB limit
];
```

---

### 2.11 Tests

**Files to create:**
- `tests/Feature/Webhooks/WebhookDispatchTest.php`
- `tests/Feature/Webhooks/DeliverWebhookJobTest.php`
- `tests/Feature/Webhooks/WebhookEndpointModelTest.php`
- `tests/Feature/Webhooks/WebhookAdminScreenTest.php`

**Test cases:**
- Dispatching a `sale.created` event triggers delivery jobs for all active subscribed endpoints
- Dispatching an event with no matching endpoints dispatches no jobs
- Inactive endpoints are not triggered
- Delivery job sends correct HTTP request with proper headers and HMAC signature
- Successful delivery creates delivery record with `delivered_at`
- Failed delivery creates delivery record with `failed_at` and increments failure count
- Endpoint auto-disables after reaching failure threshold
- Retry backoff is applied correctly
- Payload serializers produce expected JSON structure
- Webhook endpoint CRUD operations work in Orchid admin
- Events list validation rejects unknown event names
- HMAC signature can be verified by a consumer using the shared secret

---

## Implementation Order

Recommended sequencing to minimize merge conflicts and allow incremental testing:

### Phase 1: Social Login
1. Install Socialite + Discord community provider
2. Create `social_accounts` migration
3. Create `SocialAccount` model, update `User` model
4. Create `SocialLoginController` with redirect/callback/disconnect
5. Update routes (replace placeholders)
6. Update frontend views (login + account settings)
7. Write tests

### Phase 2: Webhook PubSub
1. Create config file (`config/webhooks.php`)
2. Create migrations (`webhook_endpoints`, `webhook_deliveries`)
3. Create models (`WebhookEndpoint`, `WebhookDelivery`)
4. Create domain events (`SaleCreated`, `RideCreated`)
5. Create payload serializers
6. Create `WebhookDispatcher` service
7. Create `DeliverWebhookJob`
8. Create `WebhookEventSubscriber` and register in `EventServiceProvider`
9. Wire events into existing model observers
10. Create Orchid admin screens
11. Write tests

---

## Security Considerations

- **OAuth state parameter:** Socialite handles CSRF via the `state` parameter automatically -- ensure session middleware is active on OAuth routes.
- **Token storage:** Social account tokens encrypted at rest via Laravel's `encrypted` cast.
- **Webhook secrets:** Stored encrypted. Generated using `Str::random(40)` or similar cryptographically secure method.
- **HMAC signatures:** Use `hash_hmac('sha256', $payload, $secret)` so receivers can verify authenticity.
- **Webhook URL validation:** Validate URLs are HTTPS in production. Consider blocking private/internal IP ranges to prevent SSRF.
- **Rate limiting:** Apply rate limits to OAuth callback routes to prevent abuse. Consider rate limiting webhook deliveries per endpoint.
- **Payload sanitization:** Ensure webhook payloads don't leak sensitive fields (emails, tokens, internal IDs that shouldn't be exposed).

---

## Environment Variables Summary

### Social Login
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=/auth/google/callback
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_REDIRECT_URI=/auth/discord/callback
```

### Webhooks
```
WEBHOOKS_QUEUE=webhooks
WEBHOOKS_TIMEOUT=10
WEBHOOKS_MAX_RETRIES=3
WEBHOOKS_AUTO_DISABLE_THRESHOLD=10
```
