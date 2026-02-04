# BikesList UX Design Specification

**Status:** Draft

**Audience:** BikesList contributors, frontend developers, designers, platform maintainers

**Applies to:** BikesList public site (Inertia/Tailwind), BikesList admin (Laravel Orchid – token-aligned minimum)

---

## 1. Product UX Statement

> **BikesList feels like a no‑frills message board where everything I need is visible above the fold.**

This statement is the primary UX constraint. All design, layout, and component decisions must reinforce:

* immediate visibility of information
* minimal scrolling to orient oneself
* clarity over aesthetics
* speed of scanning over visual flair

If a design decision conflicts with this statement, it is incorrect.

---

## 2. Core Design Philosophy

### 2.1 Craigslist, but Modern

BikesList intentionally embraces the strengths of classic classifieds systems:

* information density
* predictable layouts
* text-forward presentation
* low visual noise

Modernization is applied **only** to:

* typography quality
* spacing consistency
* alignment
* accessibility
* responsiveness

BikesList must **not** resemble:

* SaaS dashboards
* startup landing pages
* social media feeds
* card-heavy marketplaces

---

### 2.2 Civic Infrastructure Aesthetic

BikesList is civic infrastructure for bicycling.

The design should communicate:

* legitimacy
* longevity
* neutrality
* trust

The primary visual reference is the **GOV.UK Design System**. BikesList should follow its patterns *strictly* unless explicitly documented otherwise.

**Rule:** If a pattern exists in the GOV.UK Design System, BikesList should use that pattern unless there is a strong, documented reason not to.

---

## 3. Color Mode Strategy

### 3.1 Light‑First

* Light mode is the default
* All pages must be designed and evaluated in light mode first

### 3.2 Dark Mode Support

* Dark mode is fully supported
* Dark mode is a theme, not a redesign
* Layout, hierarchy, spacing, and components remain identical

### 3.3 Theme Requirements

* Toggle available globally
* Preference persisted (cookie + client storage)
* Respect system preference on first visit
* No layout shift or flash during theme initialization

---

## 4. Design Tokens

BikesList uses a centralized token system consumed by both the public UI and (minimally) the admin UI.

### 4.1 Required Token Categories

* Background
* Foreground / text
* Muted text
* Borders
* Primary action
* Secondary action
* Destructive action
* Focus state

Tokens must support both light and dark mappings.

### 4.2 Admin Alignment (Minimum Requirement)

Laravel Orchid does **not** need to be visually identical, but must:

* share background colors
* share typography
* share link and button semantics
* support light/dark parity

The admin should feel like the control panel of the same system, not a separate product.

---

## 5. Typography

### 5.1 Principles

* Typography carries hierarchy, not decoration
* Size and weight are used intentionally
* Line length is constrained for readability

### 5.2 Usage Rules

* Headings clearly indicate page structure
* Meta text (dates, locations, categories) is visually secondary but readable
* Links are visibly links (underlined, high contrast)

Placeholder text must never replace labels.

---

## 6. Layout System

### 6.1 Page Structure

* Single primary content column
* Optional secondary column only when functionally required
* Content visible above the fold wherever possible

### 6.2 Containers

* Informational pages: narrow reading width
* Listings and indexes: wider scan-friendly width
* Admin pages: consistent with Orchid layout but token-aligned

---

## 7. Navigation

### 7.1 Global Navigation

Must include:

* city / region selector
* search
* primary content access (listings, events, pages)
* create action (contextual)
* user menu
* theme toggle

Navigation must prioritize clarity over compactness.

---

## 8. Listings UX

### 8.1 Listings Index

* Text-forward list view is primary
* Rows, not cards
* Clear separation between items
* Optional thumbnail, never dominant

### 8.2 Filters

* Filters are explicit and readable
* No hidden filter logic
* Mobile filters may collapse but remain obvious

---

## 9. Listing Detail Pages

* Information appears before imagery
* Actions (contact, report) are clear and separated
* Bike listings include validation links where applicable
* Images support the listing, not the other way around

---

## 10. Events UX

* Events appear as structured entries, not promotional cards
* Date, time, location, and route information is immediately visible
* Routes may be simple text explanations in early versions

---

## 11. Community Pages

* Treated as informational civic pages
* Clear identity (shop, club, org)
* Contact and participation info visible without scrolling

---

## 12. Forms

Forms must follow GOV.UK conventions:

* Explicit labels
* Helpful hints
* Clear validation errors with instructions
* Logical grouping

Forms should feel calm and procedural, not clever.

---

## 13. Components

All components must:

* be accessible by default
* share visual language
* work identically in light and dark mode

Required components:

* buttons (primary, secondary, destructive)
* inputs and selects
* textareas
* notices and alerts
* dialogs and confirmations
* pagination
* empty states with guidance

---

## 14. Motion and Effects

* Motion is minimal and purposeful
* No decorative animation
* Focus on clarity and state changes

---

## 15. Non‑Goals

BikesList explicitly avoids:

* marketing-driven layouts
* visual gimmicks
* excessive imagery
* trendy UI patterns
* conversion funnels

---

## 16. Acceptance Criteria

A page is considered correct if:

* core information is visible above the fold
* hierarchy is obvious without styling tricks
* the page reads clearly when images are removed
* light and dark mode behave identically
* the design would still make sense in five years

---
