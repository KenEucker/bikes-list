# BikesList UI Specification

**Status:** Draft

**Audience:** BikesList platform contributors, frontend engineers, UX designers

**Scope:** Defines the frontend user interface, routes, roles, forms, and moderation UX for the BikesList platform.

**Applies to:** bikeslist-web (frontend), bikeslist-api (supporting contracts)

---

## 1. Core Principles

* **City-first UX:** All public content (sales, rides, community pages) is scoped to a city, accessed via city subdomains.
* **Global accounts:** User accounts, dashboards, and authentication are global and accessible from any subdomain.
* **Email relay only:** All contact and reporting is handled via relay email addresses (copy + mailto). No inboxes, no stored messages.
* **Moderation with auto-publish:** Sales, rides, and pages enter a pending state and auto-publish/approve after a configured duration unless moderated.
* **Simple, civic UI:** Functional, trustworthy, infrastructure-like design.

---

## 2. Domains and Routing

### 2.1 Global Domain (`bikeslist.org`)

Public:

* `/` — Landing page with world map and city list
* `/terms`
* `/privacy`

Account (global, accessible from any domain):

* `/account/sign-in`
* `/account/sign-up`
* `/account/settings`
* `/account/magic-link`

OAuth callbacks:

* `/auth/google/callback`
* `/auth/discord/callback`

---

### 2.2 City Subdomains (`{city}.bikeslist.org`)

Public:

* `/` — City Home
* `/search`
* `/for-sale`
* `/for-sale/:id`
* `/rides`
* `/rides/:id`
* `/community`
* `/community/:slug`

Auth required:

* `/for-sale/new`
* `/for-sale/:id/edit`
* `/rides/new`
* `/rides/:id/edit`
* `/community/new`
* `/dashboard`
* `/dashboard/sales`
* `/dashboard/rides`
* `/dashboard/pending`
* `/dashboard/pages`
* `/dashboard/pages/:slug`

Moderator only (city-scoped):

* `/moderation`
* `/moderation/sales`
* `/moderation/rides`
* `/moderation/pages`

---

## 3. Landing Page (Global)

* Interactive Leaflet world map
* Map pins for each city using the BikesList logo
* Clicking a pin navigates to the city subdomain
* City list grouped by:

  * Country → State/Province → City (when available)
* City search/typeahead
* No geolocation features in v1

---

## 4. City Home

Order of sections:

1. **Upcoming rides (current month)** — calendar-style single-column list grouped by day
2. **Featured community pages** — defaults to first 3 created if none explicitly featured
3. **Search bar** — navigates to `/search`
4. **For Sale preview** — up to 20 items, no filters or sorting

   * CTA: "View all for sale" → `/for-sale`

---

## 5. Search

Route: `/search`

* Tabbed results:

  1. For Sale (default)
  2. Rides
  3. Community Pages
* Single search input persists across tabs

---

## 6. Authentication & Accounts

* Users must set a password to complete account creation
* Social sign-up supported:

  * Google
  * Discord
* Social sign-up flow:

  * OAuth returns user to sign-up screen
  * Email field is prefilled and read-only
  * User must set a password to finalize account
* Magic links available after account creation

---

## 7. For Sale (Sales)

### 7.1 Sale States

* Draft
* Pending Review (auto-publish unless moderated)
* Published
* Sold
* Expired
* Removed

### 7.2 Sale Creation

Route: `/for-sale/new`

Steps:

1. Select sale type: Bike, Part, Clothing, Misc
2. Core fields (all types):

   * Title (6–80 chars)
   * Price (number, allow 0)
   * Condition (new, like_new, good, fair, poor)
   * Description (min 20 chars)
   * Photos (1–4 images)
   * Optional: brand, model, year
3. Type-specific attributes (see appendix)
4. Review and submit

On submit:

* Sale enters `pending_review`
* Banner: auto-publish notice

### 7.3 Bike-Specific Additions

* Optional serial number field (private by default)
* "Stolen bike check" section:

  * External link to Bike Index search
  * Optional secondary link (e.g. Project 529)

### 7.4 Sale Detail Page

* Contact seller relay email (copy + mailto)
* Report sale relay email (city moderators)

---

## 8. Rides

### 8.1 Ride States

* Draft
* Pending Review (auto-publish unless moderated)
* Published
* Removed

### 8.2 Ride Creation

Route: `/rides/new`

Fields:

* Title
* Start date/time
* End date/time
* Meeting location (text)
* Description
* Optional:

  * Ride type
  * External link
  * Cover image

Route section:

* Route description
* Route link (URL)

Host identity:

* Host as user
* Host as community page

### 8.3 Ride Detail Page

* Contact organizer relay email
* Report ride relay email (city moderators)

---

## 9. Community Pages

### 9.1 Page States

* Pending
* Approved
* Removed

Only approved pages are publicly visible.

### 9.2 Roles

* **Owner**

  * Full control
  * Manage team
  * Post sales and rides
* **Editor**

  * Edit page profile
  * Create sales and rides as page

(No Admin role)

### 9.3 Page Creation

Route: `/community/new`

* Form-based creation
* Submissions enter `pending`
* Auto-approve unless moderated

Alternative (claim existing page):

* Form submission
* Sends relay email to city moderators

### 9.4 Public Community Page

* Info, logo/photos, links, hours (if shop), social links
* Sales by this org
* Rides by this org
* Report page relay email (city moderators)

### 9.5 Community Dashboard

Routes:

* `/dashboard/pages`
* `/dashboard/pages/:slug`

Tabs:

* Overview
* Profile (editable; approved pages stay approved on update)
* Team
* For Sale
* Rides

Photos:

* Max 4 photos

---

## 10. Moderation

* City-scoped moderation permissions
* Combined moderation UI for:

  * Sales
  * Rides
  * Community Pages

Actions:

* Approve / Publish
* Remove (requires note)
* Restore (optional)

Moderator notes are visible to creators/admins, never public.

---

## 11. Dashboard

Routes:

* `/dashboard`
* `/dashboard/sales`
* `/dashboard/rides`
* `/dashboard/pending`

Shows:

* User-created sales and rides
* Community page content for pages they manage
* Pending review items

---

## 12. Appendix: Sale Attributes

### Bike

* Frame size (enum/free)
* Wheel size
* Gears
* Optional: category, brake type, frame material

### Part

* Part category
* Optional compatibility notes

### Clothing

* Clothing type
* Size
* Optional gender, season

### Misc

* Optional category
