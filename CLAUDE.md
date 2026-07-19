# Mertory

## Design Context

This project has captured design context via the `impeccable` skill:

- **`PRODUCT.md`** — who this is for (Mertory, a one-person Anlasser & Lichtmaschinen workshop), what it's for, brand personality ("sturdy & no-fuss"), and anti-references.
- **`DESIGN.md`** — the visual system, built on Mertory's real brand colors (navy + orange, from its oval badge). Fully implemented across all 5 pages in `frontend/css/design.css`; Bootstrap is gone.

Read both before making UI changes so new work stays consistent with the confirmed direction.

## Internationalization

The UI is trilingual (Turkish default, English, German — see `frontend/js/i18n.js`). Any new user-facing string needs an entry in all three dictionaries there, not a hardcoded string in HTML or JS:

- Static text: `data-i18n="dotted.key"` on the element (translated `textContent` on load and on language switch).
- Placeholders: `data-i18n-placeholder`. Aria-labels: `data-i18n-aria-label`.
- Dynamic/JS-generated text (toasts, table rows, empty states): call `t("dotted.key", { param: value })` directly; use `{{param}}` placeholders in the dictionary strings.
- Counts needing singular/plural (German especially): define `key_one` / `key_other` and pass `{ count }` in the params — `t()` picks the right suffix automatically.
- Each page listens for the `i18n:langchange` event on `document` and re-runs its own load function to re-render with the new language; follow that pattern in any new page.
- The language switch in the header is a plain relative/absolute dropdown (`.lang-switch` / `.lang-trigger` / `.lang-menu`), not the native Popover API — the API's top-layer promotion breaks `position: absolute`'s containing-block chain, silently pushing the menu off-screen. Wiring lives in `initLangSwitch()` in `i18n.js`.

## Theme

Dark mode is opt-in via a toggle on `settings.html` (`js/theme.js`), stored in `localStorage` under `als-theme`. Default is light; nothing switches on OS preference. Every page has a small inline blocking script in `<head>` that applies `data-theme="dark"` to `<html>` before first paint, to avoid a flash of the wrong theme — copy that snippet into any new page. When adding CSS, never hardcode `white`/`black` inside a `color-mix()`; resolve against `var(--color-bg)` so the mix inverts correctly in dark mode (see DESIGN.md §2, "Don't hardcode a neutral color").

## Settings page

`settings.html` / `js/settings.js` also handles CSV export (parts/sales/customers, one file each, UTF-8 with a BOM so Excel reads Turkish/German characters correctly) and displays static business info (name/address/phone) and an app version string. The version number is a plain literal inside `settings.html`'s "Hakkında" section — bump it there when it's worth tracking.

## Core exchange (remanufactured parts)

`Part.is_remanufactured` + `Part.core_charge` mark a part as enrolled in the industry-standard core-exchange program; `Sale.core_returned` + `Sale.core_value` track whether *this* sale's old unit came back. `vehicle_type` (a fixed Turkish-canonical string — see `VehicleType` in `routers/parts.py` — translated for display via `vehicleTypeLabel()` in `parts.js`, same pattern as `conditionLabel()`) categorizes non-car parts (Kamyon/Motosiklet/Otobüs/Tarım-İş Makinesi).

- **Total calculation is a live lookup, not a stored snapshot**: a sale's displayed total is `sold_price * quantity + (core_returned ? 0 : part.core_charge)`, computed at render time in both `sales.js` (`saleTotal()`) and the sale dialog (`updateTotal()`) by looking up the current part — consistent with how part/customer names are already resolved by id at render time rather than denormalized onto the sale.
- **Resolving a pending core** (customer brings the old part back later) goes through `PUT /sales/{id}/core`, a narrow endpoint that only ever touches `core_returned`/`core_value` — never route other sale edits through it.
- Adding a new `vehicle_type` option means updating it in four places: the `VehicleType` Literal in `routers/parts.py`, the `<select>` options in `parts.html`, the `VEHICLE_TYPE_KEY` map in `parts.js`, and the `parts.vehicleType.*` translations in `i18n.js`.
