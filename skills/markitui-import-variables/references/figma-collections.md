# MarkitUI Figma collections

How MarkitUI's variables are organised, what the stock file contains, and how to inventory a user's copy. The stock values here are a **baseline for spotting changes**, not output. Always map what the live file contains.

## The three collections

| Collection | Modes (stock) | What it holds | In code |
|---|---|---|---|
| **Tailwind CSS** | `Value` (one mode) | Primitives that mirror Tailwind CSS v4: colour palettes (`colors/base`, `neutral`, `brand`, `red`, `green`, `yellow`, `blue`), `spacing`, `width`, `min-width`, `max-width`, `height`, `border-radius`, `border-width`, `stroke-width`, `opacity`, `breakpoint` | `@theme static` primitives: palettes and the spacing base. Sizing, border-width, opacity and stroke groups are skipped (Tailwind already provides them) |
| **Theme** | `Brand A / Light`, `Brand A / Dark` | Semantic colours (`colors/*`), font families, font weights, the Tailwind text scale (`text/*`), radius, blur, shadow layers, breakpoints, containers | Semantic colours in `@theme static` (light) and `.dark`; the rest in `@theme static` |
| **Custom** | `breakpoint-xl`, `breakpoint-md`, `base` | Responsive typography tokens for the Custom text styles (`text styles/*`) and responsive layout tokens (`layout/*`) | Plain CSS variables in `:root`, overridden per breakpoint with media queries |

Collection and mode names can change in a user's copy. Identify collections by content if a name differs (Theme = the one with `colors/bg-primary`; Custom = the one with `layout/section-padding-y`).

## Code syntax

Theme and Custom variables have a Web code syntax. The Tailwind CSS collection has **none, on purpose**: its variable names already read like Tailwind, and Figma's export turns them into readable placeholders such as `var(--spacing\/4,16px)`. Derive Tailwind CSS collection names with the table in `token-mapping.md` ("Tailwind CSS collection names").

| Group | Example variable | Code syntax |
|---|---|---|
| Semantic colour | `colors/bg-primary` | `var(--color-bg-primary)` |
| Radius | `radius/radius-lg` | `var(--radius-lg)` |
| Main radius (value: number or alias) | `radius/radius-main` | `var(--radius-main)` |
| Font family | `font family/font-sans` | `var(--font-sans)` |
| Font weight | `font-weight/font-semibold` | `var(--font-weight-semibold)` |
| Tailwind text size | `text/base/font-size`, `text/base/line-height` | `var(--text-base)`, `var(--text-base--line-height)` |
| Breakpoint, container | `breakpoint/md`, `container/7xl` | `var(--breakpoint-md)`, `var(--container-7xl)` |
| Shadow layer | `shadow/sm/1/offset-y` (every part) | `var(--shadow-sm)` (composite: all layers of one shadow share one name) |
| Blur | `blur/md` | `var(--blur-md)` |
| Custom type | `text styles/headline/fontsize-xl` | `var(--fontsize-headline-xl)` |
| Custom type family | `text styles/headline/font-family` | `var(--headline-font-family)` |
| Layout | `layout/section-padding-y` | `var(--section-padding-y)` |

If a user adds a Theme or Custom variable without code syntax, derive one with the same pattern as its group and list it in the report as "derived name". If a user adds code syntax to the Tailwind CSS collection, ignore it and derive from the name.

## Stock baseline (for change detection)

**Palettes (Tailwind CSS collection).** `neutral`, `red`, `green`, `yellow`, `blue` hold Tailwind v4's default palette as hex (e.g. `neutral/500 #737373`, `red/500 #fb2c36`, `blue/500 #2b7fff`). `brand` 50–950 is stock purple: `50 #faf5ff`, `100 #f3e8ff`, `200 #e9d4ff`, `300 #dab2ff`, `400 #c27aff`, `500 #ad46ff`, `600 #9810fa`, `700 #8200db`, `800 #6e11b0`, `900 #59168b`, `950 #3b0764`. `base`: `white #ffffff`, `black #000000`, `transparent`.

**Spacing.** `spacing/1 = 4` (Tailwind's `--spacing: 0.25rem`); every other step = step × 4.

**Radius.** `radius-xs 2`, `sm 4`, `md 6`, `lg 8`, `xl 12`, `2xl 16`, `3xl 24`, `4xl 32` (Tailwind defaults). `radius/radius-main` (Theme) holds the main corner value: a number fine-tuned for the theme, or an alias to a radius step (stock: alias to `border-radius/rounded-none`, 0). `border-radius/rounded-main` (Tailwind CSS) only references it, and blocks bind `rounded-main` on cards, panels and other visual containers. Base components never bind it; they use fixed radius tokens (e.g. Button and Input use `rounded-full`).

**Fonts.** `font-sans "Inter"`, `font-serif "Playfair Display"`, `font-mono "Roboto Mono"`. Weights 100–900 (Tailwind defaults).

**Theme text scale.** `text/xs … text/9xl` = Tailwind v4 defaults (12/16, 14/20, 16/24, 18/28, 20/28, 24/32, 30/36, 36/40, 48/48, 60/60, 72/72, 96/96, 128/128).

**Breakpoints and containers.** Tailwind defaults: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`; containers `3xs 256` … `7xl 1280`.

**Shadows.** Tailwind v4 defaults, two layers for `sm`, `md`, `lg`, `xl`; one layer for `2xs`, `xs`, `2xl`. Colours are black at 5%, 10% or 25%.

**Semantic colours (Theme).** About 50 tokens in five families: `bg-*`, `fg-*`, `interactive-*` (`accent`, `primary`, `secondary`, `destructive`, each with `-hover` and `-active`), `border-*`, `focus-ring-*`. Each one has a usage description. Most alias palette steps; a few are composite (colour + opacity): `bg-overlay` (black at `opacity-30`), `focus-ring-default`, `focus-ring-destructive`. `bg-transparent` aliases `colors/base/transparent`.

**Custom (per mode xl | md | base).**
- Display `fontsize/lineheight-lg` 96 | 80 | 72, `-md` 72 | 64 | 56, `-sm` 64 | 56 | 48.
- Headline `2xl` 56 | 48 | 40, `xl` 48 | 40 | 36, `lg` 36 | 32 | 28, `md` 28 | 24 | 24, `sm` 24 | 20 | 20, `xs` 20 | 18 | 18 (line height = font size).
- Body `lg` 18/26, `md` 16/24, `sm` 14/22, `xs` 12/18 (same in all modes).
- Label `md` 16/16, `sm` 14/14, `xs` 12/12; Eyebrow `md` 12/12; Caption `md` 12/16.
- Family and weight tokens per text family alias Theme fonts and weights.
- Layout: `viewport-width` 1440 | 768 | 375, `grid-column-count` 12, `grid-gutter` spacing 4 | 3 | 3, `container-max-width` max-w-7xl, `container-padding-x` spacing 6 | 5 | 4, `section-padding-y` spacing 16 | 16 | 12, `section-title-gap-2xl` spacing 6 | 6 | 4, `section-title-gap-xl` and `-lg` spacing 4, `card-padding` spacing 6 | 6 | 4, `card-padding-lg` spacing 8 | 8 | 6, `panel-padding` spacing 10 | 8 | 6.

**Text styles.** Custom: `Custom/Display/*` (3), `Custom/Headline/*` (6), `Custom/Body/*` (12), `Custom/Label/*` (6: Label MD, SM and XS, each Semibold and Medium), `Custom/Eyebrow/Eyebrow`, `Custom/Caption/Caption`. Tailwind: `Tailwind CSS/text-<size>/leading-normal|leading-none/<weight>` (13 sizes × 2 leadings × 11 variants). See `typography.md`.

**Effect styles.** `drop-shadow/shadow-2xs … shadow-2xl` (bound to Theme shadow layers), `focus-ring/default`, `focus-ring/destructive`, `focus-ring/hover`, `backdrop-blur/*` and `blur/*` (bound to Theme blur).

## Figma-only tokens (do not write to CSS)

- `layout/viewport-width`: the width of the Figma page mockup per mode, not a CSS value.
- The `width`, `min-width`, `height` and `max-width` groups: Tailwind's sizing utilities already provide them.
- `stroke-width`: only used for icons in Figma; Tailwind's `stroke-*` utilities cover it.
- `border-width` and `opacity`: Tailwind's utilities already match. Flag them if a user changed a value.

List skipped groups in the report so the user knows they were left out on purpose.

## How to inventory the file

Use `use_figma` with a **read-only** script (no `set`, `create`, `remove` or `setValueForMode` calls). Keep each return small: one collection per call, plus one call for text styles and one for effect styles. For each variable return name, resolved type, code syntax (null for the Tailwind CSS collection), and per mode either the raw value or the alias target's name. Resolve composite colours (objects with `color` and `opacity`) into both parts.

Example read script for one collection (adapt the collection lookup):

```js
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const col = cols.find(c => c.name === 'Theme');
const names = {};
const name = async id => names[id] ??= (await figma.variables.getVariableByIdAsync(id))?.name ?? '?';
const fmt = async v => {
  if (v?.type === 'VARIABLE_ALIAS') return { alias: await name(v.id) };
  if (v && typeof v === 'object' && 'color' in v) return {
    color: v.color?.type === 'VARIABLE_ALIAS' ? { alias: await name(v.color.id) } : v.color,
    opacity: v.opacity?.type === 'VARIABLE_ALIAS' ? { alias: await name(v.opacity.id) } : v.opacity,
  };
  return v;
};
const out = [];
for (const id of col.variableIds) {
  const v = await figma.variables.getVariableByIdAsync(id);
  const byMode = {};
  for (const m of col.modes) byMode[m.name] = await fmt(v.valuesByMode[m.modeId]);
  out.push({ name: v.name, type: v.resolvedType, code: v.codeSyntax.WEB ?? null, byMode });
}
return { collection: col.name, modes: col.modes.map(m => m.name), variables: out };
```

Colours come back as `{r, g, b, a}` in 0–1; convert to hex (`Math.round(x * 255)`), adding alpha only when `a < 1`.

For text styles return name, font family and style, font size, line height (pixels, percent or auto), letter spacing (value and unit), text case, text decoration, and the names of bound variables. For effect styles return name, each effect's type, offset, radius, spread, colour and bound variable names.

If `use_figma` is not available, ask the user for a link to a frame that uses the tokens (e.g. the Colors documentation page) and use `get_variable_defs`. That only returns variables used in the selection, so say clearly that the sync is partial.

## Detecting user changes

Compare the inventory with the baseline and sort every difference into one of these:

- **Changed value**: e.g. `brand/*` is now blue, `radius-main` is now `10` or aliases `radius-lg`, `font-sans` is `"Geist"`, a headline size changed. Write the new value. Mention it in the report.
- **Re-pointed semantic colour**: e.g. `interactive-primary` now aliases `brand/600`. Keep the new alias.
- **Raw value instead of alias**: a semantic colour set to a hex value. Write the hex, and flag it: brand changes will no longer flow through that token.
- **New variable**: map it using its code syntax (or, in the Tailwind CSS collection, the derivation table) and group rules. Never drop it.
- **New mode**: a second brand (`Acme / Light`, `Acme / Dark`) or a new breakpoint mode. See SKILL.md step 3.
- **Variables from another library**: nodes can be bound to variables from a different Figma library (remote variables, not in the local collections). They are not part of the MarkitUI token set: do not write them, and list them in the report with where they are used, so the designer can rebind them to MarkitUI variables.
- **Removed or renamed variable**: if the previous managed region defined a name that no longer exists, remove it and list it under "removed", so the user can search the code for remaining uses.
