# Theme structure

What a brand changes in MarkitUI, what it must not touch, and how to find things in a user's copy.

## The three collections

| Collection | Modes (stock) | What a brand changes here |
|---|---|---|
| **Tailwind CSS** | `Value` | Primitive colour palettes: `colors/brand/50…950`, optionally `colors/neutral/*` (tint) and the status palettes. Add a palette group (e.g. `colors/acme/*`) only for a second brand. Radius steps alias Theme radius and need no change here. |
| **Theme** | `Brand A / Light`, `Brand A / Dark` | Semantic colours (`colors/bg-*`, `fg-*`, `interactive-*`, `border-*`, `focus-ring-*`), font families, `radius/radius-main` and the radius scale, shadow layers. Mode names. |
| **Custom** | `breakpoint-xl`, `breakpoint-md`, `base` | Only the family and weight aliases of the Custom text roles (`text styles/{role}/font-family`, `…/font-weight*`), when headings get a different family or weight. Sizes and layout stay as they are unless the user asks. |

Text styles: `Custom/*` (the default system, used by every component and block) and `Tailwind CSS/*` (optional). Both bind font family, weight, size and line height to variables, so they follow the Theme fonts. Letter spacing is set directly on each text style as a percentage and is tuned for Inter; see `typography.md`.

Effect styles: `drop-shadow/*` bind to Theme shadow layers; `focus-ring/*` bind to the focus-ring colours. They follow automatically.

## What may change

| Allowed | Not allowed |
|---|---|
| Primitive colour values in the Tailwind CSS collection | Renaming, deleting or adding semantic variables (`colors/*` in Theme) |
| Which primitive a semantic colour aliases, per mode | Changing scopes or code syntax |
| Theme font family strings, radius values, shadow layer values | Editing base components, project blocks or library blocks |
| Custom family and weight aliases (point at another Theme token) | Adding code syntax to the Tailwind CSS collection (it has none on purpose) |
| Letter spacing on text styles, after approval | Changing breakpoints, containers, layout tokens or type sizes, unless asked |
| Renaming the Theme mode pair; adding a mode pair; adding a primitive palette group for a second brand | Unbinding variables from text styles or effect styles |
| Removing unused brand palette steps, when the designer chose a palette with fewer than 11 shades (see `applying.md`) | Removing any other primitive or semantic variable |

If the brand needs something that is only possible by editing a component (for example square buttons: Button and Input use fixed `rounded-full`, not `radius-main`), say so in the proposal and leave it for the user to decide. Do it only if they ask, and only in the base component master.

## Finding things in a renamed copy

- **Theme** = the collection that holds `colors/bg-primary`.
- **Tailwind CSS** = the collection that holds `spacing/4` and the colour palettes; it has one mode.
- **Custom** = the collection that holds `layout/section-padding-y`.
- **The brand palette** is whatever `colors/interactive-accent` aliases in the first Theme mode, not necessarily a group called `brand`. The Colors doc allows renaming it.
- **Light and dark modes**: mode names end in `/ Light` and `/ Dark` by convention. If they don't, the dark mode is the one where `bg-primary` resolves darker.
- **The default mode** is the first mode in the Theme collection. Code (`markitui-import-variables`) treats the first Light mode as the default theme, so keep the user's main brand there.

## Stock semantic mapping

Use this as the baseline for spotting changes and as the starting point for a new brand. "brand/500" means `colors/brand/500` in the Tailwind CSS collection.

| Semantic colour | Light | Dark |
|---|---|---|
| bg-primary | base/white | neutral/900 |
| bg-secondary | neutral/50 | neutral/800 |
| bg-tertiary | neutral/100 | neutral/700 |
| bg-accent | brand/500 | brand/500 |
| bg-inverse | neutral/900 | base/white |
| bg-elevated | base/white | neutral/800 |
| bg-disabled | neutral/200 | neutral/600 |
| bg-overlay | base/black at opacity-30 | same |
| fg-primary | base/black | neutral/100 |
| fg-secondary | neutral/500 | neutral/400 |
| fg-tertiary | neutral/400 | neutral/500 |
| fg-accent, fg-link | brand/500 | brand/500 |
| fg-link-hover / -active | brand/600 / brand/700 | brand/400 / brand/300 |
| fg-on-accent | base/white | base/white |
| fg-on-primary | base/white | neutral/900 |
| fg-on-secondary | neutral/900 | neutral/100 |
| fg-inverse | base/white | base/black |
| interactive-accent / -hover / -active | brand/500 / 600 / 700 | brand/500 / 600 / 700 |
| interactive-primary / -hover / -active | base/black / neutral/900 / neutral/700 | base/white / neutral/300 / neutral/400 |
| interactive-secondary / -hover / -active | neutral/50 / 100 / 200 | neutral/800 / 700 / 600 |
| interactive-destructive / -hover / -active | red/500 / 700 / 800 | red/500 / 600 / 700 |
| border-strong / medium / subtle | neutral/800 / 400 / 200 | base/white / neutral/500 / 700 |
| focus-ring-default | base/black | base/white |
| focus-ring-inner | bg-primary | bg-primary |
| status (fg-, border-success / warning / destructive) | green / yellow / red 500 | same |

Every semantic colour has a usage description in Figma. Read it when unsure what a role is for.

**Known stock contrast gaps.** With the stock purple, white on `brand/500` is 4.12:1, and `brand/500` text on white is the same, so accent buttons, accent surfaces, links and accent text sit just under 4.5:1 (3.94:1 for links on `bg-secondary`). In dark, `brand/500` links are 4.35:1 on `bg-primary` and 3.67:1 on `bg-secondary`. Status colours at 500 are far below 4.5:1 as text on white. The audit reports these. When you apply a brand, the "must" pairs are fixed by the mapping in `colour-system.md`; the status pairs are reported for the user to decide.

## Other stock values

- Fonts: `font-sans` Inter, `font-serif` Playfair Display, `font-mono` Roboto Mono. All Custom roles alias `font-sans`; Display and Headline use semibold.
- Radius: `radius-xs 2`, `sm 4`, `md 6`, `lg 8`, `xl 12`, `2xl 16`, `3xl 24`, `4xl 32`. `radius-main` (the main corner value; a number or an alias to a radius step) aliases `border-radius/rounded-none` (0); `rounded-main` in Tailwind CSS references it. Check the System setup doc; if it states a different default than the variable, report the mismatch.
- Shadows: Tailwind v4 defaults, layers of black at 5–25%, the same in both modes.

## Reading the collections

Read one collection per `use_figma` call and keep the return small: for each variable its name, type and, per mode, the alias target's name or the raw value. `scripts/theme-audit.js` already resolves every semantic colour to its final hex, so run it instead of writing your own resolver.
