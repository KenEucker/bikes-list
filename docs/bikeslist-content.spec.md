# BikesList Platform Pillars Specification

**Status:** Draft
**Audience:** Product, platform, and community stakeholders
**Scope:** High-level description of BikesList’s core product pillars and feature boundaries

---

## Overview

BikesList is a city-focused bicycle bulletin board. It is intentionally **not** social media. The platform exists to make it easy for people in a city to:

* Buy and sell bicycles and bike-related items
* Discover and share bicycle events (especially group rides)
* Find trusted local bike organizations, shops, clubs, and recurring events

There are **no comments, no forums, no direct messaging, and no social feeds**. Interaction is limited to discovery, submission, and transactional contact where appropriate.

The platform is structured around three primary pillars.

---

## Pillar A — Classified Listings

Classified listings provide a structured, city-level marketplace for bicycles and bicycle-related items.

### Purpose

* Enable buying and selling without payments or escrow
* Keep interactions transactional and low-friction
* Avoid becoming a chat or negotiation platform

### Core Characteristics

* Listings are **text + photos** (no video, ever)
* Listings belong to **exactly one city**
* Listings may optionally include an **exact location** (address or pin), distinct from city association
* Location is always at least city-level; city remains the primary browsing and discovery scope
* Listings have clear lifecycle states:

  * Draft
  * Published
  * Sold
  * Expired
  * Removed

### Listing Content

* Title and description
* Listing **type**, which determines available grouped attributes:

  * Full bicycles
  * Bicycle parts
  * Clothing
  * Miscellaneous (books, films, etc.)
* Type-specific structured attributes (simple and easy to use)
* Price (including free)
* Photos
* Optional exact location
* Optional association with a Community Page (Model A)

### Contact & Communication

* Buyers contact sellers via an on-site contact form
* Replies happen through BikesList relay forms
* BikesList sends emails on behalf of both parties
* Real email addresses are never exposed
* No attachments, no messaging threads, no SMS, no push notifications

### Search & Discovery

* Listings are searchable and filterable
* Users may save searches in their profile
* No search alerts or notifications in v1

### Moderation

* Reactive moderation via user flags
* Moderators can act on listings using frontend tools
* Admins have full backend access

---

## Pillar B — Events

Events are a **front-and-center feature** of BikesList. The goal is to make BikesList the easiest place to discover bicycle rides and events in a city, without competing with or replacing existing calendars.

### Purpose

* Aggregate *all* bike-related events in a city
* Lower friction for submitting and discovering rides
* Complement existing calendars rather than compete with them

### Event Visibility

* Events are prominently featured on city landing pages
* Events can be browsed, searched, and viewed in calendar formats

### Event Creation

* Anyone with an account can submit an event
* Every event submission requires agreement to community guidelines
* Event creators receive email confirmation when an event is submitted

### Trust & Moderation Model

* Accounts with little or no prior activity:

  * Events enter a delayed submission queue
  * Events become public automatically if moderators do not act in a timely manner
  * The delayed queue exists to give moderators an opportunity to catch invalid events without blocking posting
* Established accounts:

  * Events may auto-publish immediately
* All events, regardless of how they are published:

  * Remain visible to moderators
  * May be removed or reverted to draft by moderators
  * May trigger a notification to the creator explaining the reason for moderation action

### Event Structure

* One-time events
* Multi-day events
* Recurring events

### Recurrence Rules

* Recurring events may exist for **up to one year**
* Before expiration:

  * Email reminders are sent one month in advance
  * The original creator must confirm the event still exists
  * The creator must re-accept community guidelines
* Events not renewed expire automatically

### Event Metadata

* Event title and description
* Organizer information:

  * Organizer name (free-form, may differ from account name)
  * Organizer email address (sourced from the creator’s account)
  * Option to hide the organizer email address from public display
* City-level association
* Event meeting location:

  * Address and/or pin dropped on a map
* Event routes:

  * Optional published route
  * V1 minimum support: free-text route description
  * Enhanced support (map pins / route drawing) where feasible
* Associated Community Pages:

  * Local bike shops
  * Bicycle clubs
  * Recurring event pages
  * Associations are displayed prominently on the event listing
* Tags such as:

  * Family friendly
  * 21+ only
  * No-drop
  * Sponsored
  * Fundraiser

### Boundaries

* No comments
* No messaging
* No user-generated discussion

---

## Pillar C — Community Pages

Community Pages are **static, informational hubs** for bicycle-related organizations and recurring activities in a city.

### Supported Page Types

* Local Bike Shops
* Bicycle Clubs
* Recurring Bicycle Events (not club-affiliated)

### Purpose

* Provide a trusted directory of bicycle-related entities
* Centralize information without enabling social interaction
* Serve as anchors for events and listings

### Page Creation

* Anyone may submit a Community Page
* Approval rules:

  * Experienced users submitting pages in their city may be auto-approved
  * Pages are still sent to moderators for validation
* Moderators may create pages directly

### Claiming Pages

* Moderator-created pages include a **“Claim this page”** option
* Claiming opens a form
* Submitted claim information is sent to city moderators for review

### Page Structure

Community Pages are composed of defined content buckets:

* **Heading** — name and primary identifier
* **About** — description and background
* **Event Info** — optional section shown above events
* **Sales Info** — optional section shown above associated listings
* **Contact** — optional details such as:

  * Address (with map display)
  * Email address
  * Phone number

### Associations

* Pages may have events
* Pages may have listings (Model A: listings are posted *by* the page)
* Pages do not host user submissions, comments, or posts

### Boundaries

* No comments
* No messaging
* No reviews
* No follower or activity systems

---

## Platform-Wide Non-Goals

The following are explicitly out of scope for BikesList:

* Social media features of any kind
* User-to-user messaging
* Comments or discussion threads
* Forums
* Reactions, likes, follows, or feeds
* Payments or checkout flows
* Phone number-based identity or contact

---

## Summary

BikesList is designed as a **city-scale bicycle information utility**:

* Pillar A enables buying and selling
* Pillar B enables discovering and sharing events
* Pillar C enables trusted, static community representation

Each pillar is intentionally constrained to avoid social-media dynamics, reduce moderation burden, and keep the platform focused on discovery, participation, and real-world bicycle activity.
