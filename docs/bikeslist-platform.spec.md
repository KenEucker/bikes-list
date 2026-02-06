# BikesList Platform Pillars Specification

**Status:** Draft

**Audience:** Product, platform, and community stakeholders

**Scope:** High-level description of BikesList’s core product pillars and feature boundaries

---

## Overview

BikesList is a city-focused bicycle bulletin board. It is intentionally **not** social media. The platform exists to make it easy for people in a city to:

* Buy and sell bicycles and bike-related items
* Discover and share bicycle rides (especially group rides)
* Find trusted local bike organizations, shops, clubs, and recurring rides

There are **no comments, no forums, no direct messaging, and no social feeds**. Interaction is limited to discovery, submission, and transactional contact where appropriate.

The platform is structured around three primary pillars.

---

## Pillar A — For Sale (Sales)

The For Sale section provides a structured, city-level marketplace for bicycles and bicycle-related items.

### Purpose

* Enable buying and selling without payments or escrow
* Keep interactions transactional and low-friction
* Avoid becoming a chat or negotiation platform

### Core Characteristics

* Sales are **text + photos** (no video, ever)
* Sales belong to **exactly one city**
* Sales may optionally include an **exact location** (address or pin), distinct from city association
* Location is always at least city-level; city remains the primary browsing and discovery scope
* Sales have clear lifecycle states:

  * Draft
  * Published
  * Sold
  * Expired
  * Removed

### Sale Content

* Title and description
* Sale **type**, which determines available grouped attributes:

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

* Sales are searchable and filterable
* Users may save searches in their profile
* No search alerts or notifications in v1

### Moderation

* Reactive moderation via user flags
* Moderators can act on sales using frontend tools
* Admins have full backend access

---

## Pillar B — Rides

Rides are a **front-and-center feature** of BikesList. The goal is to make BikesList the easiest place to discover bicycle rides in a city, without competing with or replacing existing calendars.

### Purpose

* Aggregate *all* bike-related rides in a city
* Lower friction for submitting and discovering rides
* Complement existing calendars rather than compete with them

### Ride Visibility

* Rides are prominently featured on city landing pages
* Rides can be browsed, searched, and viewed in calendar formats

### Ride Creation

* Anyone with an account can submit a ride
* Every ride submission requires agreement to community guidelines
* Ride creators receive email confirmation when a ride is submitted

### Trust & Moderation Model

* Accounts with little or no prior activity:

  * Rides enter a delayed submission queue
  * Rides become public automatically if moderators do not act in a timely manner
  * The delayed queue exists to give moderators an opportunity to catch invalid rides without blocking posting
* Established accounts:

  * Rides may auto-publish immediately
* All rides, regardless of how they are published:

  * Remain visible to moderators
  * May be removed or reverted to draft by moderators
  * May trigger a notification to the creator explaining the reason for moderation action

### Ride Structure

* One-time rides
* Multi-day rides
* Recurring rides

### Recurrence Rules

* Recurring rides may exist for **up to one year**
* Before expiration:

  * Email reminders are sent one month in advance
  * The original creator must confirm the ride still exists
  * The creator must re-accept community guidelines
* Rides not renewed expire automatically

### Ride Metadata

* Ride title and description
* Organizer information:

  * Organizer name (free-form, may differ from account name)
  * Organizer email address (sourced from the creator’s account)
  * Option to hide the organizer email address from public display
* City-level association
* Ride meeting location:

  * Address and/or pin dropped on a map
* Ride routes:

  * Optional published route
  * V1 minimum support: free-text route description
  * Enhanced support (map pins / route drawing) where feasible
* Associated Community Pages:

  * Local bike shops
  * Bicycle clubs
  * Recurring ride pages
  * Associations are displayed prominently on the ride page
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
* Teams
* Advocacy Organizations
* Co-ops
* Informal Groups
* Recurring Bicycle Rides (not club-affiliated)

### Purpose

* Provide a trusted directory of bicycle-related entities
* Centralize information without enabling social interaction
* Serve as anchors for rides and sales

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
* **Ride Info** — optional section shown above rides
* **Sales Info** — optional section shown above associated sales
* **Contact** — optional details such as:

  * Address (with map display)
  * Email address
  * Phone number

### Associations

* Pages may have rides
* Pages may have sales (Model A: sales are posted *by* the page)
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
* Pillar B enables discovering and sharing rides
* Pillar C enables trusted, static community representation

Each pillar is intentionally constrained to avoid social-media dynamics, reduce moderation burden, and keep the platform focused on discovery, participation, and real-world bicycle activity.
