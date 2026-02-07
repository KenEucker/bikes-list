# BikesList Content Moderation Specification

**Status:** Draft

**Audience:** Product, platform, and community stakeholders

**Scope:** Defines the moderation philosophy, roles, actions, and lifecycle rules for all user-facing content on BikesList, including For Sale items, Rides, and Community Pages.

**Applies to:** bikeslist-web, bikeslist-api, moderation frontend tooling

---

## 1. Philosophy & Goals

BikesList moderation exists to preserve **trust, safety, and signal quality** across the platform. BikesList is intentionally **not social media**, and moderation is therefore not concerned with managing conversations, opinions, or interpersonal behavior.

Moderation focuses on:

* Content validity and relevance
* Fraud, scam, and theft prevention
* Public safety for real-world activities
* Directory accuracy for community information

Moderation is corrective and curatorial rather than punitive. Whenever possible, content should be reverted to draft with explanation rather than permanently deleted.

---

## 2. Moderation Scope

Moderation applies to the following content types:

* **For Sale** (Sales)
* **Rides**
* **Community Pages**

There are no comments, messaging threads, or social interactions to moderate.

---

## 3. Roles & Access Model

### 3.1 User Roles

* **Regular Users**

  * Submit For Sale items, Rides, and Community Pages
  * Flag content for moderator review

* **City Moderators**

  * Moderate content within one or more assigned cities
  * Act on flagged or queued content
  * Create Rides and Community Pages

* **Global Moderators**

  * Moderate content across all cities
  * Same capabilities as City Moderators, without geographic restriction

* **Admins**

  * Full backend access
  * Global oversight and emergency intervention

### 3.2 Frontend-Only Moderation Model

Moderation is performed exclusively through **frontend moderation tools**.

* Moderators do **not** require backend/admin access
* Backend access is reserved for Admins only
* Moderation actions are logged and enforced via the API

This separation is intentional and preserves a clean boundary between platform administration and community moderation.

### 3.3 Moderator Assignment & Scope

This section defines how moderators are created and scoped.

* Moderators are **assigned by Admins** via backend/admin tooling
* Assignment associates a user with:

  * One or more cities, **or**
  * Global moderation scope
* “Moderator” and “Global Moderator” are **not backend roles**
* Moderator capability is derived from assignment data and exposed to the frontend
* Moderators cannot assign, revoke, or modify moderator access

---

## 4. Ownership vs Moderation Permissions

Moderation does not imply content ownership.

* Moderators **cannot edit** user-submitted content
* Moderators **can fully edit** content they personally created
* Moderators may create:

  * For Sale items (as regular users)
  * Rides
  * Community Pages

Ownership grants edit rights; moderation grants action rights only.

---

## 5. Moderation Actions

Moderation actions are consistent across content types, though availability may vary by context.

### 5.1 Supported Actions

* **Approve**
* **Publish**
* **Revert to Draft**
* **Remove** (unpublish and hide from public view)

There is no hard delete action available to moderators.

### 5.2 Draft Reversion with Notes

Moderators may revert content to **Draft** and attach a moderation note explaining the reason for the action.

* Notes are visible to the content creator
* Notes are not public-facing

This is the preferred corrective action whenever content can be fixed by the creator.

---

## 6. Moderation Reasons

All moderation actions must use **predefined reason codes**.

* Reason codes are fixed enums
* No free-text reasons are stored as moderation data
* Reason codes may be surfaced to content creators

Examples include:

* Not bicycle-related
* Suspected scam or fraud
* Suspected stolen property
* Incorrect city or location
* Commercial spam
* Duplicate content

---

## 7. Notifications & Communication

All moderation actions trigger a notification to the content creator.

* Notifications are sent via BikesList relay email
* Moderators never see user email addresses
* Moderators may optionally include a relay message

Replies from users return through the same relay mechanism.

There is no formal appeal system.

---

## 8. Content-Type Specific Rules

### 8.1 For Sale (Sales)

Moderation focuses on transactional trust and fraud prevention.

Common actions:

* Revert to draft for incorrect categorization
* Remove suspected scams or stolen items
* Remove duplicate or spam sales

Moderators may flag items as removed but do not mark items as sold.

---

### 8.2 Rides

Moderation focuses on public safety and calendar integrity.

* New Rides may enter a delayed submission queue
* Rides auto-publish if moderators do not act in time
* All Rides remain visible to moderators post-publication

Moderators may:

* Revert unsafe or misleading Rides to draft
* Remove invalid or non-bike-related Rides

---

### 8.3 Community Pages

Moderation focuses on directory accuracy and impersonation prevention.

* Pages may be validated, reverted, or removed
* Moderators may create Community Pages directly
* Claim requests are reviewed by moderators

Community Pages do not host user-generated discussion.

---

## 9. Visibility & Attribution

* Public-facing content never displays moderator identity
* Public messaging uses generic attribution such as “Removed by moderator”
* Internal logs retain actor identity for audit purposes

User email addresses are never exposed.

---

## 10. Retention & Automated Cleanup

Removed content is not immediately deleted.

* Removed items remain in the system for a defined retention period
* A background job periodically deletes removed content

Retention policy:

* Default: 30–90 days after removal
* Duration is configurable

This allows recovery, auditing, and dispute resolution before permanent deletion.

---

## 11. Audit Logging

All moderation actions are logged with:

* Content identifier
* Action taken
* Reason code
* Actor role (moderator, global moderator, admin)
* Timestamp
* Previous state → new state

Audit logs are restricted to authorized roles.

---

## 12. Explicit Non-Goals

The moderation system explicitly avoids:

* Social moderation mechanics
* Reputation or strike systems
* Public moderation history
* Gamified reporting
* Automated user punishments

BikesList moderation exists to protect usefulness, safety, and trust — not to police behavior.

---

## Summary

BikesList moderation is intentionally minimal, transparent, and corrective. By limiting scope, enforcing clear boundaries, and separating moderation from administration, BikesList preserves its identity as a city-scale bicycle utility rather than a social platform.
