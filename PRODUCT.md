# Product

## Register

product

## Users

**Landlords** — both **agencies** (with teammates) and **private owners** (often co-owning a single rental) — use the **web app** (`apps/web`, Next.js). They are at a desktop, mid-workflow, often time-pressured: an application has a 24-hour deadline, the inbox needs a decision, the listing needs to come online before the weekend. Many are not full-time professionals; private owners may rent out a single apartment and want the tool to feel manageable, not enterprisey.

**Tenants** — people apartment-hunting in Belgium, mostly in Brussels, Flanders, and Wallonia — use the **mobile app** (`apps/mobile`, Expo). They browse in pockets of time: on the tram, after work, between calls. They build a **huurpaspoort** (rental passport) once — income, employment, household, move-in date, pets, willing-to-domicile — and reuse it across every application. The marquee interaction is a swipe stack: like, dislike, never see the same listing twice.

Two products, one platform, opposite postures. The voice is Dutch (Flemish) by default — `packages/i18n` treats `nl` as the source of truth.

## Product Purpose

`plekje` connects Belgian landlords with screened tenants through a flow that respects both sides. Landlords get an org-scoped inbox of applications with clean profiles and a deadline that forces a decision. Tenants get a discovery experience that feels modern (swipe, photo-first) and an application that takes seconds because the profile already exists.

Success looks like: a private landlord lists their one apartment in under five minutes, gets a small handful of complete applications in the first 48 hours, and books a viewing for the one they pick — all without leaving the dashboard. On the other side: a tenant fills their huurpaspoort once, swipes their way to a shortlist over a few sessions, and applies with a single tap.

The product is **not** a classifieds portal. It is a screening tool with discovery on top.

## Brand Personality

Three words: **grounded, plainspoken, Belgian.**

The wordmark is `plekje` — lowercase, Dutch diminutive for "spot" or "place." It signals warmth and locality without being twee. The voice is calm and direct. Copy is Dutch-first and uses the informal register that Flemish speakers actually use ("Verhuur jouw pand," not "Het verhuren van uw eigendom"). When English is used (for now, the codebase mixes), it stays sober — no exclamation marks, no marketing adjectives, no growth-hack microcopy.

The product feels like a serious tool wearing soft clothes. The landlord side has the rigour of a Linear-style inbox (deadlines, statuses, decisions); the tenant side has the fluidity of a well-built consumer app (gestures, haptics, no busywork). They are tied together by the same wordmark, the same neutral palette, and the same conviction that housing decisions deserve careful interfaces.

## Anti-references

- **Belgian incumbents (Immoweb, Logic-Immo, Immoscout)** — classified-ad density, 2005 chrome, table layouts crammed with badges. We are the modern alternative; their visual register is exactly what we displace.
- **Tinder-for-X clones** — cheap gradients, gamified hearts, dopamine-bait. The swipe pattern is a discovery tool, not entertainment.
- **Generic SaaS dashboards** — gradient hero metric cards, identical icon-heading-text card grids, "Welcome back, Rubin 👋" empty states. Banned by the cross-register laws and reinforced here.
- **AI-slop landlord tools** — purple-and-cyan, glassmorphic sidebars, decorative "AI ✨" sparkles next to every action. We do not look like a 2024 YC batch demo.
- **Over-corporate property-management portals** — navy-and-gold, suit-and-tie photography, ten-step sign-up flows. Private owners would bounce.

## Design Principles

1. **Two postures, one voice.** Landlord web is deliberate — tables, deadlines, decisions, keyboard-friendly density. Tenant mobile is gestural — swipe, photo-first, optimistic, haptic. They share the same wordmark, the same neutral system, the same Dutch tone. Never let one drift visually away from the other.

2. **Dutch is the brand voice.** `packages/i18n` makes `nl` the source of truth on purpose. Copy is written in Flemish-Dutch first and translated outward, not the reverse. No machine-translated English with Dutch slapped on top.

3. **Practical confidence over performative polish.** Renting is one of life's largest recurring transactions. Reassuring competence beats delight-for-delight's-sake. No confetti on listing publish. No "Nice work! 🎉" toasts. The motion budget goes into the swipe stack and the photo gallery — not into onboarding flourishes.

4. **The huurpaspoort is the trust artifact.** Every tenant profile screen — the one the landlord reads, the one the tenant builds — gets the most careful information design in the product. Typographic weight, generous spacing, real hierarchy. This is the page the whole transaction rests on.

5. **Universal primitives, country-specific behaviour.** Belgian-specific concepts (postal code → municipality + region lookup, `employment_status` enum, "willing to domicile") render through universal UI components — an `Input` with the right validation, a `Select` with the right options. There is no `BelgianPostalCodeField`. This is the principle the codebase's `country_scaling` memory makes explicit; the UI honours it.

## Accessibility & Inclusion

- **WCAG 2.1 AA target** for both surfaces. Color contrast is enforced by token choices (foreground/background pairs in `packages/ui/src/styles.css`); decorative chroma should never carry meaning alone.
- **Status colour is never the only signal.** Deadline indicators (green ≥12h, amber ≥4h, red <4h, grey expired in v10b) always pair with text and an icon. Status pills carry labels, not just hues.
- **Reduced motion is respected.** `globals.css` already disables the `reveal` and `rule-grow` animations under `prefers-reduced-motion`. The swipe stack on mobile must follow suit: gesture commits should be honoured, but ambient/decorative motion suppressed.
- **Mobile typography stays legible at default body size.** Per the `no muted text on mobile` memory, secondary copy uses default `Text` color and earns hierarchy from `type`/`weight`, not from low-contrast greys.
- **Touch targets ≥44px** on mobile, especially the like/dislike buttons under the swipe card (the gesture-free fallback).
- **Belgian localisation as accessibility.** Dutch as the source language is itself an inclusion choice — Flemish users should never feel like the second-class translation of an English product.
