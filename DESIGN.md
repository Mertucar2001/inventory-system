---
name: Mertory
description: Anlasser & Lichtmaschinen (starters & alternators) — a parts-counter tool for the workshop, stock, sales, and customers, kept plain and fast.
colors:
  primary: "oklch(0.56 0.19 48)"
  primary-deep: "oklch(0.46 0.18 46)"
  accent: "oklch(0.30 0.11 258)"
  accent-deep: "oklch(0.22 0.09 258)"
  success: "oklch(0.40 0.13 145)"
  danger: "oklch(0.46 0.20 12)"
  danger-ink: "oklch(0.32 0.18 12)"
  bg: "oklch(1.000 0.000 0)"
  surface: "oklch(0.904 0.007 258)"
  border: "oklch(0.85 0.009 258)"
  ink: "oklch(0.20 0.014 258)"
  muted: "oklch(0.42 0.012 258)"
typography:
  display:
    fontFamily: "IBM Plex Sans, Arial, sans-serif"
    fontSize: "clamp(1.5rem, 2.5vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "IBM Plex Sans, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "IBM Plex Sans, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.02em"
  mono:
    fontFamily: "IBM Plex Mono, Menlo, monospace"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "6px"
  lg: "10px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
---

# Design System: Mertory

## 1. Overview

**Creative North Star: "The Oval Badge"**

The reference is no longer a hypothetical work-light — it's Mertory's own logo: a navy-and-orange oval badge, the kind of mark that's been stamped on Anlasser & Lichtmaschinen (starter motor and alternator) parts for decades. Everything on screen exists to be read at a glance and acted on in seconds — check a stock count, log a sale, find a customer — by one person running the whole operation, sometimes with a customer waiting or a car on the lift. Nothing on the page should require a second look to parse.

That utilitarian brief comes from two named references the shop owner picked directly: **37signals/Basecamp** (plain-spoken, almost anti-design, function over polish) and **a parts-counter POS or industrial control panel** (high contrast, generous tap targets, built for a work environment rather than an office). Color now carries the real brand identity — deep navy as the dominant mark color, a confident orange as the one warm accent — while the base stays a clean, glare-resistant white and cool steel-gray, because the screen is read under bright and variable workshop lighting, not a calibrated office monitor.

This system explicitly rejects the generic AI-template look (purple gradients, rounded-everywhere cards, stock icon soup), the stock Bootstrap blue-and-gray default the app ships with today, and the bloated SaaS dashboard crowded with charts and widgets nobody checks at the counter.

**Key Characteristics:**
- Two real brand colors, navy and orange — Mertory's own identity, not an invented palette
- Pure white base for maximum legibility in bright or dim workshop light
- Numbers (stock, prices) set in monospace so columns of figures line up and scan fast
- Flat by default — structure comes from spacing and borders, not shadows
- Status (in stock / low / out) told through color + label together, never color alone

## 2. Colors

The palette is a full, deliberate set of named roles — not a single restrained accent — because an inventory tool needs stock and sale states to read instantly, at a glance, without opening a row. Navy and orange are Mertory's actual brand colors, not composed for this system; every other role is built to sit quietly around them.

### Primary
- **Mertory Orange** (oklch(0.56 0.19 48)): the brand's warm mark color, from the oval badge. Primary actions only — "Yeni Parça", "Kaydet", the buttons that move work forward. Always paired with white text. Darkened from the original oklch(0.68 0.19 48) on 2026-07-18 — the lighter value only reached 3.09:1 contrast with white text, failing WCAG AA (4.5:1); this shade holds 4.99:1.
- **Mertory Orange, Deep** (oklch(0.46 0.18 46)): hover/active state for primary actions and pressed states.

### Secondary
- **Mertory Navy** (oklch(0.30 0.11 258)): the brand's dominant mark color, from the oval badge. Header/navigation background, links, secondary emphasis, focus rings — this is the color that says "Mertory" before any logotype is read.
- **Mertory Navy, Deep** (oklch(0.22 0.09 258)): hover state for navy elements, and the header bar's own hover/pressed surfaces.

### Tertiary (status roles)
- **Shop Green** (oklch(0.40 0.13 145)): in-stock / success state. Filled, with white text — never a pale tint, this needs to read from across the counter.
- **Warning Red** (oklch(0.46 0.20 12)): low-stock, out-of-stock, and error states. Pushed toward true red, away from the brand orange's hue, so a stock warning is never mistaken for a call-to-action. Same filled, white-text treatment as Shop Green.
- **Warning Red, Ink** (oklch(0.32 0.18 12)): the same warning hue, darkened for use as *text* on a pale red surface (the error banner) instead of as a fill — keeps error banners tokenized instead of a one-off color.

### Neutral
- **Pure White** (oklch(1.000 0.000 0)): page background in light mode. Deliberately pure — the brand's color already comes from navy and orange, the backdrop stays out of the way.
- **Worktop Steel** (oklch(0.904 0.007 258)): surface color for table zebra striping, panel backgrounds, and modal bodies. Tinted toward the brand's own navy hue, not a generic gray.
- **Border Steel** (oklch(0.85 0.009 258)): table borders, input borders, dividers.
- **Graphite Ink** (oklch(0.20 0.014 258)): primary text. Near-black carrying a faint cast of the brand's own navy, never generic gray-on-gray.
- **Steel Gray** (oklch(0.42 0.012 258)): secondary text, timestamps, helper copy. Still dark enough to hold up in bright light — this is not the washed-out placeholder gray that makes AI-built tools hard to read.

### Dark Theme (optional, user-toggled)

Added 2026-07-19 at the shop owner's request, overriding this system's original "one theme, no dark mode" call. It's opt-in via a switch on the Ayarlar page — the default is still light, and nothing switches automatically on OS preference. Navy and orange (Primary, Secondary, and their Deep pairs) hold their exact values in both themes; only the neutrals invert, so the header and buttons read as the same brand in either mode. Neutrals:
- **bg**: oklch(0.16 0.014 258) — near-black, carrying the same navy-tinted cast as the light neutrals, not a flat gray.
- **surface**: oklch(0.28 0.018 258) — zebra striping and panels. Tuned so the surface-vs-bg contrast ratio (1.33:1) matches light mode's (1.34:1); an earlier, closer value read as too subtle to see the striping at all.
- **border**: oklch(0.36 0.018 258).
- **ink**: oklch(0.95 0.006 258) — 16.9:1 against bg.
- **muted**: oklch(0.72 0.014 258) — 7.8:1 against bg.
- **Warning Red, Ink (dark)**: oklch(0.82 0.13 18) — the light-mode Warning Red Ink is unreadable on a dark-tinted danger banner; this lighter red replaces it in dark mode, holding 9.4:1 against the dark banner background.

### Named Rules
**The Badge Rule.** Navy and orange are the only two brand colors in the system — Mertory's own identity, lifted from the oval badge, not invented for this redesign. No third saturated color gets added alongside them.

**The Filled-Status Rule.** Status pills (in-stock, low-stock, out-of-stock) are always filled with white text, never a pale tint with colored text. Pale badges wash out under bright workshop light; filled ones don't.

**The Constant-Brand Rule.** Primary and Secondary (and their Deep pairs) never change value between light and dark theme. Only Neutral tokens invert. A theme switch should never make the brand look like a different product.

## 3. Typography

**Display/Body Font:** IBM Plex Sans (with Arial fallback)
**Mono Font:** IBM Plex Mono (with Menlo fallback)

**Character:** One technical, no-nonsense sans for every label and sentence in the interface, paired with its own monospace sibling for anything numeric. The shared Plex family keeps the pairing coherent while the mono cut gives stock counts and prices a tabular, counted-out feel — figures that look like they were tallied, not typeset.

### Hierarchy
- **Display** (600, clamp(1.5rem, 2.5vw, 2rem), 1.15 line-height): page and section titles ("Parçalar", "Satışlar", "Müşteriler"). Modest scale on purpose — this is a tool, not a landing page; the ceiling stays low.
- **Body** (400, 1rem, 1.5 line-height): table cells, form fields, body copy, modal text.
- **Label** (600, 0.8125rem, 1.2 line-height, 0.02em tracking): table headers, form field labels, button text. Small and slightly tracked for structure, not decoration — this is a functional table-header convention, not a marketing eyebrow.
- **Mono** (500, 0.9375rem, 1.4 line-height, tabular figures): stock counts, prices, IDs — anywhere a column of numbers needs to line up and scan fast.

### Named Rules
**The Counted-Out Rule.** Any number that represents money or stock (buy price, sell price, quantity) is set in Mono. Any number that's just an identifier or a date reads fine in Body. The distinction signals "this number is the point of this row."

## 4. Elevation

Flat by default. Structure comes from the Worktop Steel surface tone, Border Steel hairlines, and spacing — not from drop shadows. A workshop counter doesn't have floating panels; neither should this. The one exception is modals, which need just enough separation to read as "on top of" the page under bright ambient light.

### Shadow Vocabulary
- **Modal Lift** (`box-shadow: 0 8px 24px rgba(20, 24, 30, 0.18)`): the only shadow in the system, used exclusively on modal/dialog surfaces to lift them off the page.

### Named Rules
**The Flat-Counter Rule.** Tables, cards, and panels are flat at rest. If something needs to look "elevated," that's a signal it should be a modal, not a shadow bolted onto a static panel.

## 5. Components

Components below are proposed defaults derived from the tokens and rules above — the running app still renders stock Bootstrap. Treat this section as the target, not a description of what exists today.

### Buttons
- **Shape:** small, functional radius (4px / `{rounded.sm}`) — enough to soften the corner, not enough to look soft.
- **Primary:** Mertory Orange background, white text, `{typography.label}` styling, padding `10px 20px`.
- **Hover / Focus:** background shifts to Mertory Orange Deep; focus ring in Mertory Navy, 2px, offset 2px.
- **Secondary / Ghost:** transparent background, Border Steel outline, Graphite Ink text — used for "İptal" and other non-committal actions.

### Status Pills (signature component)
- **Style:** filled background (Shop Green or Warning Red), white text, `{rounded.sm}` corners, small `{typography.label}` text.
- **Use:** stock state next to a part row ("Stokta", "Az Stok", "Tükendi"); core-exchange state next to a sale row ("Bekliyor" / "Alındı", added 2026-07-19 for the core-charge feature — same fill/white-text treatment, Warning Red for pending, Shop Green for received). Always paired with a text label, color is reinforcement, not the only signal.

### Remanufactured Badge
- **Style:** filled Mertory Navy, white text — the same `.pill` shape as a status pill, but a deliberately different color so it never reads as a stock-urgency signal. Sits directly after the part name in the Parçalar table.
- **Use:** marks a part enrolled in the core-exchange program (`is_remanufactured`). Distinct from the Durum field's "Yenilenmiş" condition value — a part can be used-but-not-reman, or reman-but-graded-as-new; the two are independent facts.

### Category Tag
- **Style:** outlined, not filled — Border Steel border, Steel Gray text, small and quiet. Deliberately lower-contrast than a pill; a vehicle category is informational, not a status that needs urgency.
- **Use:** the vehicle type (Otomobil / Kamyon / Motosiklet / Otobüs / Tarım-İş Makinesi) next to the Araç cell in the Parçalar table, and as a filter alongside the search box. Always shown, even for the default "Otomobil", so every row reads consistently.

### Cards / Panels
- **Corner Style:** `{rounded.md}` (6px).
- **Background:** Worktop Steel for panels that need to separate from the page; Pure White for the page itself.
- **Shadow Strategy:** none at rest — see Elevation.
- **Border:** 1px Border Steel where a panel needs a defined edge instead of a background shift.
- **Internal Padding:** `{spacing.md}` (16px).

### Inputs / Fields
- **Style:** 1px Border Steel stroke, Pure White background, `{rounded.sm}` corners.
- **Focus:** border shifts to Mertory Navy, no glow or shadow — a clean color change is enough under bright light.
- **Error:** border and helper text shift to Warning Red; the error message itself stays in Body type, not shrunk.
- **Placeholder:** Steel Gray, not the browser default gray — the default only cleared the 4.5:1 floor by a hair.

### Touch Targets
Row actions ("Düzenle", "Sil" in tables) are 44px minimum height, matching the Navigation bar's own tap targets — not the smaller 32px they shipped with initially. This is a working requirement, not a nicety: the workshop owner uses this one-handed at the counter, often on a tablet.

### Navigation (signature component)
- Single top bar in Mertory Navy with white text and, where the mark appears, the oval badge itself — this is the one place the brand identity shows at full strength. Five destinations (Parçalar, Satışlar, Müşteriler, Ayarlar, plus Ana Sayfa) stay one tap away at all times, as direct links, never nested behind a menu. The one dropdown in the header is the language switch, below.

### Language Switch (signature component)
- A compact trigger at the far end of the navy header shows the current language code (TR / EN / DE) with a caret; clicking it opens a small menu of all three, the current one marked with a checkmark. Plain language codes, not flags: a flag for German is ambiguous (DE/AT/CH) and flags read as decoration this system otherwise avoids. Positioned as a plain relative/absolute dropdown, not the native Popover API — the API's top-layer promotion breaks `position: absolute`'s containing-block chain, and CSS Anchor Positioning (the spec-correct fix) is Chrome/Edge 125+ only. The menu right-aligns to the trigger by default and flips to left-aligned when that would push it off the left edge of the viewport — the header wraps on narrow screens and the trigger can end up near the left edge. The same three-way choice repeats, larger and with native-language labels (Türkçe / English / Deutsch), as a dedicated section on the Ayarlar page for a clearer first-time choice.

### Toggle Switch
- A single on/off setting (Karanlık Mod on Ayarlar) uses a checkbox styled as a pill switch — filled Mertory Orange when on, Border Steel when off — wrapped in a label the same way `.lang-option` wraps its radio, so the whole row is clickable, not just the switch itself.

### Fact Panel
- Read-only information (İşletme Bilgileri, Hakkında) uses a bordered panel of stacked label/value rows, the same rhythm as the language-choice list but without the interactive states — no hover, no cursor change, nothing implies these rows do something when clicked. The one exception: a phone number is a `tel:` link, since tapping to call is the whole point of showing it on a counter tool.

### Checkbox Field
- A plain native checkbox with an inline label, wrapped so the whole row is clickable — for a single in-dialog yes/no choice ("Yenilenmiş parça", "Eski parça (kor) alındı mı?"). Distinct from the Toggle Switch above: this is a dialog form field among other fields, not a standalone settings row, so it stays visually lighter (no pill track).

### Total Line
- A shaded (Worktop Steel) summary row inside the Yeni Satış dialog, showing the live total in Mono. Recalculates on every quantity, price, or core-checkbox change. A helper note beneath it states in plain language whether the core deposit is included or waived — the deduction has to be visible, not just correct, or the checkbox's effect is invisible to the person using it.

## 6. Do's and Don'ts

### Do:
- **Do** keep Mertory Orange to primary actions and Mertory Navy to header/navigation and secondary emphasis — the two real brand colors, used deliberately, per the Badge Rule.
- **Do** set every stock count, price, and quantity in Mono so figures line up in a column and scan fast.
- **Do** keep Graphite Ink and Steel Gray dark enough to hold up in bright or variable workshop lighting — this is a working test, not just a WCAG minimum.
- **Do** pair every status color with a text label ("Stokta" / "Tükendi"), never color alone.

### Don't:
- **Don't** use the generic AI-template look — no purple gradients, no rounded-everywhere cards, no stock icon soup standing in for real content.
- **Don't** carry over the current stock Bootstrap blue-and-gray default theme; every surface here should read as designed, not templated.
- **Don't** build toward a bloated SaaS dashboard — no chart widgets, no metrics nobody checks at the counter, no dashboard-shaped hero section.
- **Don't** introduce a third saturated color competing with navy and orange — they're Mertory's real identity, not a palette to expand.
- **Don't** use pale, softly-tinted status badges — status pills are filled and white-text only, per the Filled-Status Rule.
- **Don't** add drop shadows to panels or cards at rest — flat by default, per the Flat-Counter Rule; the one exception is the Modal Lift shadow.
- **Don't** change Primary or Secondary values between light and dark theme — per the Constant-Brand Rule, only neutrals invert.
- **Don't** hardcode a neutral color (`white`, `black`) inside a `color-mix()` or similar — every mix should resolve against a theme token (`var(--color-bg)`) so it inverts correctly in dark mode.
