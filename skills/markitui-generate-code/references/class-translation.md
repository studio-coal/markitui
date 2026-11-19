# Class translation: Figma → MarkitUI Tailwind classes

Read this before writing any `className`. The token names here come from the `markitui:tokens` region written by `markitui-import-variables`; if a name you need isn't in that region, the tokens are out of date.

## Block structure

Every MarkitUI block follows section → container → grid → content. Keep that structure in code; it is what makes blocks consistent and easy to edit.

```tsx
<section className="bg-bg-primary py-(--section-padding-y)">
  <div className="mx-auto w-full max-w-(--container-max-width) px-(--container-padding-x)">
    <div className="grid grid-cols-12 gap-x-(--grid-gutter)">
      {/* content */}
    </div>
  </div>
</section>
```

| Figma layer | Code |
|---|---|
| Block root (the component or `Breakpoint=…` variant) | `<section>` with the block's background fill and `py-(--section-padding-y)` (use the bound token; some blocks use another vertical padding) |
| `Container` | `mx-auto w-full max-w-(--container-max-width) px-(--container-padding-x)` |
| `Full bleed` | A full-width wrapper outside `Container` (no max width, no side padding) |
| `Grid` (Figma grid layout) | `grid grid-cols-N` with the grid's column count; gaps from the bound tokens |
| `Content`, `Main`, `Media`, `Lists` and other wrappers | A `div` with flex or grid only if it lays something out; merge wrappers that add nothing |
| `Section Title` instance | The Section Title pattern (see `base-components.md`) inside the grid, with its column span |

Grids are structural only (no padding or fills). Panels that span the container use `p-(--panel-padding)`; cards use `p-(--card-padding)` or `p-(--card-padding-lg)`, whichever the design binds.

## Grid spans

- `col-[4/span_6]` → `col-span-6 col-start-4`. `col-[span_12]` → `col-span-12`. Positions like `col-1` inside simple grids usually need no class: let items flow.
- Equal repeated items (three cards, four logos) usually sit in a simpler grid (`grid-cols-3`); the 12-column grid is for proportions (4/8, 5/7) and offsets.

## Merging xl, base and md

Write mobile-first: base classes are the `Breakpoint=base` frame; add prefixed classes for the larger layouts.

- **When an md frame exists**, it is the source for `md:` classes: whatever changes between base and md gets `md:`, whatever changes again for xl gets `lg:` (layout switches) or `xl:`. Don't guess a tablet layout that the md frame contradicts.
- **Without an md frame**, use the prefix rules below and check 768px yourself.

- **Which prefix.** Spacing and type already change per breakpoint through Custom tokens, so prefixes are only needed for layout changes. Use `lg:` for layout switches by default (side-by-side panels, 12-column spans, split Section Titles). Use `md:` when the desktop layout still fits a 768px tablet, such as rows of cards (1 column → `md:grid-cols-2` → `lg:grid-cols-3`).
- **Direction and order.** Media stacked above text on base and beside it on xl → `flex flex-col lg:flex-row` or grid spans; change order with `order-*` only if the frames really differ.
- **Visibility.** Something present in only one frame → `hidden lg:block` or `lg:hidden`. Prefer this to duplicating markup only when the two versions are genuinely different elements (for example a mobile menu button).
- **Sizes.** Never copy the two frames' pixel widths. Use fluid widths (`w-full`, grid spans, `max-w-*` tokens).
- **Component variants.** Base components with a `Breakpoint` variant (xl/base/md) get one responsive component, not one per breakpoint. Their base variant drops hover and pressed states.

## Typography

Use text style classes, never individual font properties. The export lists the text styles a frame uses ("These styles are contained in the design: …").

The region header in the stylesheet says which system the project uses:

| `typography:` | Figma style | Class |
|---|---|---|
| `custom` | `Custom/Headline/Headline XL` | `type-headline-xl` |
| `custom` | `Custom/Body/Body MD Medium` | `type-body-md-medium` |
| `custom` | `Custom/Label/Label SM Semibold` | `type-label-sm-semibold` |
| `custom` | `Custom/Eyebrow/Eyebrow`, `Custom/Caption/Caption` | `type-eyebrow`, `type-caption` |
| `tailwind` | `Tailwind CSS/text-2xl/leading-normal/bold` | `text-2xl font-bold` |
| `tailwind` | `Tailwind CSS/text-base/leading-none/medium` | `text-base leading-none font-medium` |
| `mixed` | either | the class for whichever style the layer uses |

Custom `type-*` classes already change size at `md` and `xl`; never add responsive font sizes to them. If the base and xl frames use different styles for the same text (e.g. Headline LG on base, Headline XL on xl), use `type-headline-lg lg:type-headline-xl`.

Text colour is separate: `text-fg-primary`, `text-fg-secondary`, `text-fg-on-accent`…

**Headings.** Use one `h1` per page: the main heading of the first block (usually the hero). Section Title headings are `h2`; titles inside cards and items are `h3`. Eyebrows, captions and labels are never headings. When building a single block on its own, use `h2` and say the page should promote its hero heading to `h1`.

## Colours

Semantic colour variables map to utilities with the variable name after the prefix:

| Figma variable | Fill | Text | Stroke |
|---|---|---|---|
| `colors/bg-*` | `bg-bg-secondary` | — | — |
| `colors/fg-*` | — | `text-fg-secondary` | — |
| `colors/border-*` | — | — | `border-border-subtle` |
| `colors/interactive-*` | `bg-interactive-accent`, `hover:bg-interactive-accent-hover` | `text-interactive-primary` | `border-interactive-primary` |
| `colors/bg-overlay` | on an overlay layer over an image | — | — |

Never use palette colours (`bg-brand-500`) in blocks when a semantic token exists; palettes are for the token layer. If a layer has a palette colour bound directly, use it and list it in the report.

## Spacing, sizing and radius

- `spacing/N` → the Tailwind step `N` (`gap-4`, `px-6`, `mt-2`). `spacing/0-5` → `0.5`.
- Custom layout tokens → the token with Tailwind's variable shorthand: `py-(--section-padding-y)`, `gap-(--section-title-gap-xl)`, `p-(--card-padding)`.
- `border-radius/rounded-*` → `rounded-*`; `rounded-main` → `rounded-main` (cards, panels and other visual containers in blocks; base components never use it). Never replace it with the px value it currently resolves to.
- `border-width/border` → `border`; side-only strokes → `border-t`, `border-b`…
- Fixed icon or avatar sizes from the design → the Tailwind size step (`size-4`, `size-10`).
- A raw number with no variable: use the matching Tailwind step if it is exactly on the scale; otherwise flag it in the report instead of writing `[13px]`.

## Effects

| Figma effect style | Class |
|---|---|
| `drop-shadow/shadow-*` | `shadow-*` |
| `focus-ring/default` | `focus-visible:shadow-focus-ring-default` |
| `focus-ring/destructive` | `focus-visible:shadow-focus-ring-destructive` |
| `focus-ring/hover` | `hover:shadow-focus-ring-hover` |
| `backdrop-blur/*`, `blur/*` | `backdrop-blur-*`, `blur-*` |

## Images in fills

A block or card whose own fill holds an image plus an overlay layer → an `<img>` (or the framework image component) positioned to cover the element, with the overlay as a sibling: `<div className="absolute inset-0 bg-bg-overlay" />`. Keep the overlay wherever the design has one; text over images always needs it.

## Interactions

| In Figma | In code |
|---|---|
| Hidden tab panels, a TabTrigger set | shadcn/ui Tabs (adapted) |
| Megatabs (MegaTabList + MegaTabTrigger with progress bar) | A tablist with auto-advance (the progress bar shows the timer); pause on hover and focus; respect `prefers-reduced-motion` |
| Accordion items, one open | shadcn/ui Accordion |
| CarouselControl + CarouselPagination | shadcn/ui Carousel with the adapted controls and dots |
| Fade Left / Fade Right on a scroller | `mask-image` gradient on the scroll container |
| `Monthly` / `Annually` switch on pricing | Tabs or a toggle group that swaps the prices |
| Flow block steps (drawer, quick view, sticky bar) | The matching shadcn/ui overlay (Sheet, Dialog) or state change, driven by the step the user is on |

Interactive parts go in client components (`"use client"` in Next.js); keep the rest of the block server-rendered.
