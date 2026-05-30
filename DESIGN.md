---
name: plekje
description: Belgian rental platform; landlord web app and tenant mobile app, one neutral system.
colors:
  office-paper:    "oklch(1 0 0)"
  notary-ink:      "oklch(0.145 0 0)"
  sealed-charcoal: "oklch(0.205 0 0)"
  paper-tint:      "oklch(0.97 0 0)"
  pencil-grey:     "oklch(0.556 0 0)"
  hairline:        "oklch(0.922 0 0)"
  ring-grey:       "oklch(0.708 0 0)"
  vermilion-stamp: "oklch(0.577 0.245 27.325)"
typography:
  display:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "normal"
  headline:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
  title:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.35
  body:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0"
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.625rem"
  xl: "0.875rem"
  pill: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  "2xl": "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.sealed-charcoal}"
    textColor: "{colors.office-paper}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 1rem"
    height: "2.5rem"
    typography: "{typography.body}"
  button-outline:
    backgroundColor: "{colors.office-paper}"
    textColor: "{colors.notary-ink}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 1rem"
    height: "2.5rem"
    typography: "{typography.body}"
  button-ghost:
    backgroundColor: "{colors.office-paper}"
    textColor: "{colors.notary-ink}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 1rem"
    height: "2.5rem"
    typography: "{typography.body}"
  button-destructive:
    backgroundColor: "{colors.vermilion-stamp}"
    textColor: "{colors.office-paper}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 1rem"
    height: "2.5rem"
    typography: "{typography.body}"
  input-default:
    backgroundColor: "{colors.office-paper}"
    textColor: "{colors.notary-ink}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 0.75rem"
    height: "2.5rem"
    typography: "{typography.body}"
  card-default:
    backgroundColor: "{colors.office-paper}"
    textColor: "{colors.notary-ink}"
    rounded: "{rounded.xl}"
    padding: "1rem"
    typography: "{typography.body}"
  badge-default:
    backgroundColor: "{colors.sealed-charcoal}"
    textColor: "{colors.office-paper}"
    rounded: "{rounded.pill}"
    padding: "0.125rem 0.5rem"
    height: "1.25rem"
    typography: "{typography.label}"
  badge-outline:
    backgroundColor: "{colors.office-paper}"
    textColor: "{colors.notary-ink}"
    rounded: "{rounded.pill}"
    padding: "0.125rem 0.5rem"
    height: "1.25rem"
    typography: "{typography.label}"
---

# Design System: plekje

## 1. Overview

**Creative North Star: "The Notary's Daylight"**

A Belgian notary's office at 10am on a Tuesday: limestone walls, a single high window, paper on a wooden desk, an inkwell within reach, a stamp pressed firmly in the corner of every document that matters. The space is calm, not austere. It is competent, not corporate. People go there for the most important transactions of their lives and they trust it because nothing in the room is performing. `plekje` translates that posture into pixels: a paper-white surface, ink-black type, hairline rules instead of shadows, and a single vermilion stamp held in reserve for moments that deserve weight.

The design system is built on `shadcn` primitives over Base-UI, but its character is set by what it refuses. There are no gradient hero metric cards, no purple-and-cyan SaaS chrome, no glassmorphic dashboards, no growth-hack toasts. The neutrals are pure (chroma 0 today; tinted toward the brand hue at handoff, chroma ≤0.01) and the only chromatic ink in the entire system is the destructive vermilion at `oklch(0.577 0.245 27.325)` — the stamp. That single chromatic note carries all the strategic weight: it appears where consequences live (delete, reject, error) and nowhere else.

Two surfaces share this system without becoming the same surface. The **landlord web** holds the posture of a Linear-style inbox: dense, predictable, keyboard-friendly, a max-w-6xl content column under a sticky 64px top bar. The **tenant mobile** holds the posture of a well-built consumer app: gestural, photo-first, optimistic, haptic. Same wordmark, same palette, same Dutch tone; opposite ergonomics.

**Key Characteristics:**
- Paper-white surface (`oklch(1 0 0)`), ink-black type (`oklch(0.145 0 0)`), zero chroma neutrals
- Flat-by-default: hairline `ring-1` instead of shadows for surface separation
- One chromatic accent only (`vermilion-stamp`), reserved for destructive and error states
- Lowercase wordmark `plekje` at 1.35rem, generously tracked
- Buttons press into the surface (`active:translate-y-px`), not out of it
- Exponential ease-out (`cubic-bezier(0.16, 0.84, 0.28, 1)`) for the two registered animations; reduced motion is respected

## 2. Colors: The Paper-and-Ink Palette

A purely neutral system today, with the vermilion stamp as the only chromatic ink. The current values are pre-brand-handoff; the token *names* are the stable contract, the OKLCH values will tint toward the brand hue when handoff lands.

### Primary
- **Sealed Charcoal** (`oklch(0.205 0 0)`): the "stamp" colour. Lives on the primary button, the wordmark in dark mode, the focused dropdown trigger. Used for the single most important action on a given surface, never more than that. Foreground pair: Office Paper.

### Neutral
- **Office Paper** (`oklch(1 0 0)`): page background, card surface, the default canvas. In dark mode, paper becomes ink (`oklch(0.145 0 0)`) and the relationship inverts cleanly.
- **Notary Ink** (`oklch(0.145 0 0)`): primary body text, headings, the wordmark in light mode. The colour decisions are made in.
- **Paper Tint** (`oklch(0.97 0 0)`): the "secondary surface" — sidebars, card footers (`bg-muted/50`), avatar wells, disabled input fills. One step warmer than Office Paper to separate a panel from the page without a border.
- **Pencil Grey** (`oklch(0.556 0 0)`): muted-foreground; helper text on web only, never on mobile.
- **Hairline** (`oklch(0.922 0 0)`): borders, dividers, input strokes, card rings. The structural fabric of the entire system. Used as `ring-1 ring-foreground/10` on cards, as `border` on inputs and outlines.
- **Ring Grey** (`oklch(0.708 0 0)`): focus ring base, applied at `ring-3 ring-ring/50` opacity. The visible commitment to keyboard users.

### Accent (single, reserved)
- **Vermilion Stamp** (`oklch(0.577 0.245 27.325)`): destructive actions, validation errors, the only saturated colour in the system. Lives in the `destructive` button variant (at 10% alpha background + full-strength text), in `aria-invalid` rings on inputs, and on error alerts. It does not appear on success, warning, or informational states; those are carried by ink-on-paper plus icon, not by colour.

### Named Rules

**The One Stamp Rule.** There is exactly one chromatic colour in the system: Vermilion Stamp. It marks consequence. It never decorates, never highlights, never gradients into anything else. If a screen would benefit from "more colour," the answer is more typographic weight or more whitespace, not a new hue.

**The No-Muted-On-Mobile Rule.** Pencil Grey (`muted-foreground`) is forbidden in `apps/mobile`. Secondary copy uses the default Notary Ink and earns hierarchy from `type` and `weight` instead. Low-contrast greys are illegible at outdoor ambient brightness, which is exactly the tenant's reading context.

**The Pre-Brand-Handoff Rule.** Neutrals stay at chroma 0 until the brand swap. At handoff, every neutral tints toward the brand hue at chroma ≤0.01 in a single coordinated commit. No partial tinting; either all neutrals carry the brand or none do.

## 3. Typography

**Display Font:** the project-level CSS variable `var(--font-sans)` with a system fallback stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`). No web-font is loaded today; the system stack is treated as legitimate per product-register defaults.

**Body Font:** same family. Single-stack typography; the spec deliberately rejects display/body pairing.

**Label/Mono Font:** none distinct. Numeric data in tables uses the same family with `font-variant-numeric: tabular-nums` where alignment matters.

**Character:** plain Dutch sans, weighted for clarity, set lowercase on the wordmark and sentence-case everywhere else. The pairing rejects editorial seriousness (no Garamond, no Söhne-style display), tech-bro austerity (no Berkeley Mono headlines), and consumer-app whimsy (no rounded display fonts). It reads like a Belgian railway sign: trustworthy, regional, present-day.

### Hierarchy
- **Display** (weight 500, 1.35rem, line-height 1, lowercase): the wordmark `plekje` only. Generously tracked, used at the top-left of every shell.
- **Headline** (weight 600, 1.5rem, line-height 1.2): page H1 — "Listings", "Inbox", "Mijn verhuur". One per route.
- **Title** (weight 500, 1rem, line-height 1.35): card titles, dialog titles, section headings inside a page.
- **Body** (weight 400, 0.875rem, line-height 1.55): default content text. Capped at 65–75ch for prose; data tables and dense panels run wider.
- **Label** (weight 500, 0.75rem, line-height 1.3): badges, table column headers, helper text on web.

### Named Rules

**The Single-Family Rule.** One font family across both apps. The brand will not adopt a display/body pairing. Hierarchy is carried by weight and size, never by font switch.

**The Tabular-Numbers Rule.** Any column or row that lists prices, surface areas, deadlines, or counts uses `font-variant-numeric: tabular-nums`. Misaligned euros in a listings table are a defect, not a typography choice.

**The Lowercase Wordmark Rule.** `plekje` is always set lowercase, weight 500, 1.35rem. It is never uppercased, italicised, or styled with an icon glyph. The lowercase is the brand.

## 4. Elevation

This system is **flat-by-default with hairline separation**. There is no shadow vocabulary. Surfaces sit on a single z-plane and are distinguished by `ring-1 ring-foreground/10` (cards), `border` (inputs, outlines), or by a half-step warmer paper (`bg-muted/50` on card footers and panels). The TopBar is sticky and uses a bottom border, not a shadow.

Depth, when it appears, is **state-driven**, not ambient. A button presses (`active:translate-y-px`) into the surface on click instead of lifting off it. A focus ring is the only "elevation" event that asserts itself outward, and it is structural (keyboard affordance), not decorative.

### Shadow Vocabulary

None. The system has no `box-shadow` tokens. If a future surface genuinely needs one, it must justify itself with a comment in code and be added to this section in the same PR.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat. Separation is hairline rings, borders, or a half-step warmer paper tint. Shadows are forbidden unless a specific state (a floating popover at z-50, a draggable swipe card with motion-driven lift) earns one.

**The Press-In Rule.** Primary buttons translate down by 1px on `:active`, not up on `:hover`. The interaction is committed and tactile; nothing floats on hover for decoration.

**The Ring-As-Border Rule.** Cards use `ring-1 ring-foreground/10` instead of a `border`. The ring keeps the card's `overflow: hidden` corners clean while still asserting separation. Do not switch a card to `border-` utilities.

## 5. Components

### Buttons
- **Shape:** `rounded-lg` (0.625rem / 10px). Smaller variants (xs, sm) drop to `rounded-[min(var(--radius-md),10px)]` to stay proportionate.
- **Primary** (`variant: default`): Sealed Charcoal background, Office Paper text, 40px height, `px-4`. Hover applies to anchor-rendered buttons only (`[a]:hover:bg-primary/80`); the canonical mouse-button hover is the focus ring + press.
- **Outline:** Office Paper background, Hairline border, Notary Ink text. Hover fills to Paper Tint. The "second action" for forms with a destructive option (e.g. Save / Cancel).
- **Ghost:** transparent default; hover fills to Paper Tint. The "tertiary" action for low-stakes affordances (toggling sections, opening sub-menus).
- **Destructive:** Vermilion Stamp text on a 10%-alpha Vermilion fill (`bg-destructive/10`). The fill darkens to 20% on hover. Confirms-before-acting; never the default action of a form.
- **Hover / Focus:** focus is universal — `ring-3 ring-ring/50` with a Ring Grey base. `active:not(aria-[haspopup]):translate-y-px` provides the press-in.
- **Sizes:** `xs` 28px, `sm` 36px, `default` 40px, `lg` 44px (the mobile-touch-target floor on the tenant app's like/dislike buttons), plus `icon` square variants.

### Inputs / Fields
- **Style:** Office Paper background, Hairline border, `rounded-lg`, 40px height, `px-3 py-2`.
- **Focus:** `ring-3 ring-ring/50` plus the border darkens to Ring Grey. No glow. No animated stroke.
- **Error:** `aria-invalid` triggers a Vermilion border + `ring-3 ring-destructive/20`. Error message renders below in body weight, Vermilion text.
- **Variants:** `default` (the boxed input above) and `flat` (no border, no padding) for inline-editable cells.

### Cards / Containers
- **Corner Style:** `rounded-xl` (0.875rem / 14px). One step rounder than buttons and inputs, to read as "container" not "control."
- **Background:** Office Paper.
- **Shadow Strategy:** none. See the Flat-By-Default Rule.
- **Border:** `ring-1 ring-foreground/10` (the "ring-as-border" treatment).
- **Internal Padding:** `py-4 px-4` default; `py-3 px-3` on `data-size="sm"`. Card footers carry a top border and Paper Tint background.

### Badges
- **Shape:** `rounded-4xl` (effectively pill, height 20px, `px-2 py-0.5`).
- **Default:** Sealed Charcoal background, Office Paper text. Reserved for the dominant status of a row.
- **Outline:** Office Paper background, Hairline border, Notary Ink text. The "passive" status pill.
- **Destructive:** Vermilion text on 10%-alpha fill.
- **Typography:** Label scale (0.75rem, weight 500).

### Navigation (Web TopBar)
- **Layout:** sticky `top-0 z-40`, 64px height, `border-b border-border`, Office Paper background.
- **Content:** Wordmark left, UserNav avatar right. Inner padding `px-6`.
- **UserNav:** circular 36px avatar with the user's initial, `ring-1 ring-border`, opens a Base-UI DropdownMenu aligned to the right at `sideOffset={8}`.
- **Mobile:** Expo Router stack with `headerShown: false`; the mobile shell does not use a TopBar — gesture-driven navigation lives inside each tab.

### Signature: Wordmark
The `Wordmark` component (`apps/web/src/features/shell/wordmark.tsx`) is the brand's single most-repeated artefact. Lowercase `plekje`, weight 500, 1.35rem, leading-none. Two tones: `ink` (default, Notary Ink) and `paper` (Office Paper, for dark surfaces). It anchors the auth split-screen header and the dashboard TopBar; it also signs the splash screen on mobile. Never wrap it in a logo mark; never icon-pair it.

### Signature: The Swipe Card (mobile, v8 forthcoming)
Not yet built; specified here because the rest of the system must support it. A single full-bleed photo card, rounded `xl`, with the listing's price + surface area overlaid in Office Paper text on a soft bottom gradient. Gesture-driven (Reanimated 3): right = like, left = dislike, tap = open detail. Optimistic commit, subtle haptic on commit. This is the one surface where motion gets a real budget; everywhere else, motion is structural.

## 6. Do's and Don'ts

### Do:
- **Do** use Office Paper (`oklch(1 0 0)`) as the default surface and Notary Ink (`oklch(0.145 0 0)`) as the default text. Pure neutrals are the spec, today.
- **Do** reserve Vermilion Stamp for destructive and error states. One screen, one stamp at most.
- **Do** separate surfaces with `ring-1 ring-foreground/10` (cards) or a half-step warmer Paper Tint (panels, sidebars, footers).
- **Do** press primary buttons *into* the surface with `active:translate-y-px`. Tactile commitment beats decorative hover lift.
- **Do** ship every interactive component with the full state vocabulary: default, hover, focus-visible, active, disabled, loading, error.
- **Do** use the lowercase `Wordmark` component for the brand, weight 500 at 1.35rem, always.
- **Do** use `font-variant-numeric: tabular-nums` in any column listing prices, surfaces, deadlines, or counts.
- **Do** respect the two registered animations (`reveal`, `rule-grow`) and their `prefers-reduced-motion` suppression. Add new animations the same way.
- **Do** write component CSS through the `packages/ui` primitives; never inline `<input>`, `<textarea>`, or `<button>` in app code (per the codebase's `ui_primitives` doctrine).
- **Do** localise to Dutch first. The system's voice depends on it.

### Don't:
- **Don't** use `#000` or `#fff`. The system is OKLCH-only; the values exist as `oklch(0 0 0)` and `oklch(1 0 0)` and that is the only acceptable spelling, even in one-off styles.
- **Don't** introduce a second chromatic accent. There is exactly one (Vermilion Stamp). If a feature requests "blue for info" or "green for success", the answer is ink + icon, not a new colour.
- **Don't** put `text-muted-foreground` or `color="muted"` on `apps/mobile`. Per the codebase memory, secondary mobile copy is default ink with hierarchy from `type`/`weight`. Pencil Grey is web-only.
- **Don't** add a `border-left` or `border-right` greater than 1px as a coloured accent on cards, list items, or alerts. Absolute ban from the shared laws. Rewrite with leading icons, full hairline borders, or a Paper Tint fill.
- **Don't** use gradient text (`background-clip: text` over a gradient). Banned. Solid Notary Ink; emphasis through weight or size.
- **Don't** use glassmorphism, backdrop blurs, or "frosted" panels as decoration. The system is paper-flat; opacity tricks belong nowhere on it.
- **Don't** build a hero metric card (big number / small label / supporting stats / gradient accent). The landlord dashboard does not look like an analytics SaaS demo.
- **Don't** ship identical-card grids: same-size cards with icon + heading + text repeated four-up. Vary the row, or use a table.
- **Don't** add box-shadows to cards, buttons, or panels. Hairline rings carry separation. If a popover or floating element needs lift, it must be added to Elevation with a justification.
- **Don't** introduce em dashes (`—`) or double-hyphen `--` in user-facing copy. Commas, colons, semicolons, periods, parentheses.
- **Don't** look like Immoweb, Logic-Immo, or Immoscout: classified-ad density, 2005 chrome, table layouts crammed with coloured badges. The visual register of those incumbents is exactly what `plekje` displaces.
- **Don't** look like a "Tinder-for-X" clone: gamified hearts, neon gradients, dopamine-bait. The swipe pattern is a discovery tool, not entertainment.
- **Don't** look like a 2024 YC batch demo: purple-and-cyan, glassmorphic sidebars, decorative "AI ✨" sparkles, "Welcome back, Rubin 👋" empty states.
- **Don't** look like a corporate property-management portal: navy-and-gold, suit-and-tie photography, ten-step sign-up flows. Private owners would bounce.
