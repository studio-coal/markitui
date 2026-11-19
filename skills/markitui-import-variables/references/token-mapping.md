# Token mapping: Figma → Tailwind CSS v4

Rules for turning each MarkitUI variable, text style and effect style into CSS. Typography has its own file (`typography.md`); this file covers everything else plus the shadcn/ui bridge.

## General rules

1. **Name** = the variable's Web code syntax with `var(...)` removed. `var(--color-bg-primary)` → `--color-bg-primary`. Tailwind CSS collection variables have no code syntax: derive them with the table below.
2. **Alias** → write the target's CSS expression as the value (its code syntax, or the derived expression for Tailwind CSS collection targets). `colors/bg-accent → colors/brand/500` becomes `--color-bg-accent: var(--color-brand-500);`. `layout/card-padding → spacing/6` becomes `--card-padding: calc(var(--spacing) * 6);`. Never resolve an alias to its raw value.
3. **Raw value** → write it with the unit rules below.
4. **One name, one place.** Each CSS variable is declared once per selector. A token belongs to exactly one of: `@theme static`, `@theme inline`, the `.dark` / brand override blocks, or the responsive `:root` block.
5. **Use `@theme static`, write groups in full.** Tailwind v4 only outputs theme variables that a utility uses. MarkitUI tokens reference each other with `var()` (semantic → palette, `radius-main` → radius scale, layout → containers), and designers expect every Dev Mode name to exist at runtime. So declare theme tokens in `@theme static` and write each mapped group completely, even where values equal Tailwind's defaults. This also avoids error-prone "is this the default?" comparisons.

## Tailwind CSS collection names

The Tailwind CSS collection has no code syntax. Derive each variable's CSS expression from its name:

| Variable name | CSS expression | Notes |
|---|---|---|
| `colors/base/white`, `colors/base/black` | `var(--color-white)`, `var(--color-black)` | |
| `colors/base/transparent` | `transparent` | keyword, never a variable |
| `colors/<palette>/<step>` | `var(--color-<palette>-<step>)` | e.g. `colors/brand/500` → `var(--color-brand-500)` |
| `spacing/<n>` | `calc(var(--spacing) * <n>)` | a `-` in the step is a decimal point: `spacing/0-5` → `* 0.5` |
| `spacing/0`, `spacing/px` | `0`, `1px` | |
| `width/w-<n>`, `height/h-<n>`, `min-width/min-w-<n>` | `calc(var(--spacing) * <n>)` | same rule as spacing |
| `max-width/max-w-<size>` | `var(--container-<size>)` | e.g. `max-w-7xl` → `var(--container-7xl)` |
| `border-radius/rounded-<size>` | `var(--radius-<size>)` | |
| `border-radius/rounded-none`, `rounded-full`, `rounded-main` | `0`, `calc(infinity * 1px)`, `var(--radius-main)` | |
| `border-width/border`, `border-width/border-<n>` | `1px`, `<n>px` | |
| `opacity/opacity-<n>` | `<n>%` | |
| `breakpoint/<name>` | `var(--breakpoint-<name>)` | |

The same names map straight to Tailwind classes in code: `spacing/4` on a gap → `gap-4`, `border-radius/rounded-full` → `rounded-full`, `colors/brand/500` → `bg-brand-500`.

## Units

Figma stores numbers without units. Assume a 16px root font size.

| Kind | Unit | Example |
|---|---|---|
| Font size, line height, spacing base, radius, container, breakpoint, layout tokens with raw values | rem (px ÷ 16) | `48` → `3rem`, `6` → `0.375rem` |
| Border width, shadow offsets/blur/spread, blur radius | px | `4` → `4px` |
| Opacity | % | `30` → `30%` |
| Font weight | unitless | `600` |
| Font family | quoted name + fallback stack | `"Inter"` → `"Inter", ui-sans-serif, system-ui, sans-serif` |
| Letter spacing (from text styles) | em | `-3%` → `-0.03em` |
| Zero | unitless | `0` |

Keep rem values exact (up to 4 decimals, no trailing zeros): `22` → `1.375rem`, `18` → `1.125rem`.

Fallback stacks: sans → `ui-sans-serif, system-ui, sans-serif`; serif → `ui-serif, Georgia, serif`; mono → `ui-monospace, SFMono-Regular, Menlo, monospace`. If the project loads fonts through `next/font` or similar with its own CSS variable (e.g. `--font-inter`), put that variable first: `--font-sans: var(--font-inter), "Inter", ui-sans-serif, system-ui, sans-serif;`.

## Colours

Write colours as Figma stores them: `#rrggbb`, or `#rrggbbaa` when alpha < 1. Do not hand-convert to oklch (see SKILL.md).

**Palettes** (`colors/<palette>/<step>` in the Tailwind CSS collection) → `@theme static`, every step of every palette (`brand`, `neutral`, `red`, `green`, `yellow`, `blue`, and any user-added palette such as `colors/brand-secondary/*`). `base/white` and `base/black` → `--color-white`, `--color-black`. `base/transparent` → never written; use the keyword `transparent`.

**Semantic colours** (`colors/*` in Theme) → declared in `@theme static` with the default brand's Light value, then **repeated in full** in the `.dark` block with the Dark value. Repeat every semantic colour in `.dark`, even when light and dark are equal, because some semantic colours alias other semantic colours (`focus-ring-inner → bg-primary`) and must recompute inside nested `.dark` areas.

```css
@theme static {
  --color-bg-primary: var(--color-white);
  --color-fg-primary: var(--color-black);
}
.dark {
  --color-bg-primary: var(--color-neutral-900);
  --color-fg-primary: var(--color-neutral-100);
}
```

Declaring them in `@theme static` (not `@theme inline`) makes Tailwind generate utilities and always emit the variables, so the names designers see in Dev Mode exist at runtime. Resulting utilities read as `bg-bg-primary`, `text-fg-secondary`, `border-border-subtle`, `bg-interactive-accent`. That double prefix is expected; do not rename tokens to avoid it.

**Composite colours** (value is `{ color, opacity }`):
- Opacity 100 → the colour alone: `var(--color-black)`.
- Opacity between 1 and 99 (or an alias to `opacity/opacity-N`) → `color-mix(in oklab, var(--color-black) 30%, transparent)`.
- Opacity below 1 → treat as fully transparent: write `transparent` and flag it in the report.
- An alias to `colors/base/transparent` (stock `bg-transparent`) → write `transparent`.

**Theme modes and brands.**
- First brand (or the one the user names as default): Light → `@theme`, Dark → `.dark`.
- Every other brand: `[data-brand="<slug>"]` for Light and `[data-brand="<slug>"].dark, .dark [data-brand="<slug>"]` for Dark. Slug = lowercase brand name with spaces as hyphens.
- Make sure the project's dark variant matches the class: `@custom-variant dark (&:is(.dark *));` (shadcn adds this; add it outside the region only if it is missing and the project uses class-based dark mode).

## Spacing, sizing, radius, borders

- `spacing/1` → `--spacing` in `@theme static` (stock 4 → `0.25rem`). If any spacing step is not `step × spacing/1`, flag it: Tailwind spacing is linear and cannot represent it.
- `width`, `min-width`, `height`, `max-width`, `stroke-width`: skip (Figma-only helpers, see `figma-collections.md`). Aliases that point into them resolve through the derivation table (e.g. `max-w-7xl` → `var(--container-7xl)`).
- `radius/radius-xs … radius-4xl` → `--radius-*` in `@theme static`.
- `radius/radius-main` (Theme) → `--radius-main` in `@theme static`. It holds the project's main corner value and can be either:
  - a **number** fine-tuned for the theme (e.g. `10`) → `0.625rem` (÷ 16, like the radius scale);
  - an **alias** to a radius step → that step's CSS expression: `radius/radius-lg` or `border-radius/rounded-lg` → `var(--radius-lg)`, `rounded-none` → `0`, `rounded-full` → `calc(infinity * 1px)`.
  
  If it aliases `border-radius/rounded-main`, that is a loop: stop and report it.
- `border-radius/rounded-main` (Tailwind CSS) only references `radius-main`; it produces no variable of its own. In code it is the `rounded-main` utility, used for cards, panels and other visual containers (media frames, image wrappers) in blocks. Base components never bind it; they bind fixed radius tokens (e.g. `rounded-full` on Button and Input). If a user's base component binds `rounded-main`, flag it in the report.
- `border-width/*`, `opacity/*`: skip; Tailwind's utilities already match. If a user changed one, flag it instead of overriding Tailwind's scale.

## Font families and weights

- `font family/*` → `--font-sans`, `--font-serif`, `--font-mono` (and any added family) in `@theme static`, with the fallback stacks above.
- `font-weight/*` → `--font-weight-*` in `@theme static`, all nine.

## Breakpoints and containers

- `breakpoint/*` → `--breakpoint-*` in `@theme static`, in rem (stock `sm 40rem`, `md 48rem`, `lg 64rem`, `xl 80rem`, `2xl 96rem`). The Custom media queries use these live values.
- `container/*` → `--container-*` in `@theme static`, in rem.

## Blur

`blur/*` (Theme) → `--blur-*` in `@theme static`, in px. Effect styles `blur/*` and `backdrop-blur/*` need no output of their own: `blur-md` and `backdrop-blur-md` already use these variables.

## Shadows

Each `shadow/<size>` group is one composite CSS variable `--shadow-<size>` in `@theme`. Build it from its layers:

- Single-layer sizes (`2xs`, `xs`, `2xl`): parts sit directly under `shadow/<size>/`.
- Two-layer sizes (`sm`, `md`, `lg`, `xl`): parts sit under `shadow/<size>/1/` and `shadow/<size>/2/`.
- Each layer = `<offset-x>px <offset-y>px <blur-radius>px <spread-radius>px <color>`, with `0` unitless.
- Layer order in CSS = layer number ascending (`1` first). This matches Tailwind's defaults.
- Colour: write `rgb(0 0 0 / 0.1)` form when the Figma colour is black with alpha, otherwise hex with alpha.

```css
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
```

Write every shadow size in `@theme static`.

## Focus rings

Effect styles `focus-ring/*` have no variables of their own. They are two spread-only drop shadows: an inner ring in the page background colour and an outer ring in the focus colour. Write them to `@theme inline` so the colours resolve on the focused element (light/dark aware):

| Effect style | CSS |
|---|---|
| `focus-ring/default` | `--shadow-focus-ring-default: 0 0 0 2px var(--color-focus-ring-inner), 0 0 0 4px var(--color-focus-ring-default);` |
| `focus-ring/destructive` | `--shadow-focus-ring-destructive: 0 0 0 2px var(--color-focus-ring-inner), 0 0 0 4px var(--color-focus-ring-destructive);` |
| `focus-ring/hover` | `--shadow-focus-ring-hover: 0 0 0 4px var(--color-interactive-secondary-hover);` |

Read the spreads (`border-width/border-2`, `border-4`) and colours from the live effect styles; the table shows stock values. The inner ring is bound to `colors/focus-ring-inner`; if a user's file binds it to another colour, use that colour's token. Usage in code: `focus-visible:shadow-focus-ring-default`.

## Custom collection (responsive)

Custom variables are plain CSS variables, not `@theme` tokens (they have no Tailwind namespace). Declare them in `:root` with mobile-first overrides:

```css
:root {
  --section-padding-y: calc(var(--spacing) * 12);           /* base */
  @media (width >= 48rem) { --section-padding-y: calc(var(--spacing) * 16); }  /* breakpoint-md */
  /* breakpoint-xl is also 16, so no xl override is written */
}
```

- `base` → the plain declaration. `breakpoint-<name>` → `@media (width >= <Theme breakpoint/<name> in rem>)`. Order media blocks from smallest to largest.
- Skip an override when its value equals the next smaller mode's value (keep the output short), but every variable must have a base value.
- Group all variables of one breakpoint in a single media block rather than one block per variable (the example above is per variable only for clarity; see `example-output.md`).
- Layout tokens are used in code with Tailwind's CSS-variable shorthand: `py-(--section-padding-y)`, `px-(--container-padding-x)`, `gap-(--grid-gutter)`, `max-w-(--container-max-width)`, `p-(--card-padding)`.
- `layout/grid-column-count` → write it (`--grid-column-count: 12`) for reference; code uses `grid-cols-12`.
- `layout/viewport-width` → skip (Figma-only).
- Typography variables in Custom (`text styles/*`) follow `typography.md`.

## Bridge to shadcn/ui

Components installed from shadcn/ui read their own variables (`--background`, `--primary`, …). Point those at MarkitUI tokens so installed components wear the brand. Write the bridge inside the managed region, in both `:root` and `.dark`:

| shadcn token | MarkitUI token | Note |
|---|---|---|
| `--background` | `--color-bg-primary` | |
| `--foreground` | `--color-fg-primary` | |
| `--card`, `--popover` | `--color-bg-elevated` | |
| `--card-foreground`, `--popover-foreground` | `--color-fg-primary` | |
| `--primary` | `--color-interactive-primary` | MarkitUI Button default = primary |
| `--primary-foreground` | `--color-fg-on-primary` | |
| `--secondary` | `--color-interactive-secondary` | |
| `--secondary-foreground` | `--color-fg-on-secondary` | |
| `--muted` | `--color-bg-secondary` | |
| `--muted-foreground` | `--color-fg-secondary` | |
| `--accent` | `--color-interactive-secondary-hover` | **Trap:** shadcn "accent" is the subtle hover fill of menus and lists, not a brand colour. MarkitUI's brand accent is `--color-interactive-accent`. |
| `--accent-foreground` | `--color-fg-on-secondary` | |
| `--destructive` | `--color-interactive-destructive` | |
| `--destructive-foreground` (if present) | `--color-fg-on-destructive` | |
| `--border` | `--color-border-subtle` | |
| `--input` | the colour bound to the Input base component's border in Figma; stock `--color-border-subtle` | Check the Input component's stroke binding before writing |
| `--ring` | `--color-focus-ring-default` | |
| `--radius` | `var(--radius-main)` | See the radius conflict in `managed-region.md` |

Write each as `--background: var(--color-bg-primary);`. Leave `--chart-*` and `--sidebar-*` untouched: MarkitUI has no tokens for them (web-app patterns). Mention them in the report if they exist.

If the project has no shadcn/ui tokens, skip the bridge.
