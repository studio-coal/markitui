# Colour system

How to turn a brand colour into a palette and a semantic mapping for light and dark mode. Every step below is a proposal until the user approves it.

## 1. The brand scale

MarkitUI palettes have 11 shade slots (50–950), but a project doesn't always need all of them. The stock semantic mapping only uses a few brand shades (about 300–700). A strict brand guide or a small site can work fine with just the brand's own colours.

### Shades are the designer's decision

Count the shades the brand actually provides (brand book, website CSS, the user's message):

- **All 11 given:** use them as given. Check the lightness falls steadily from 50 to 950; if it doesn't, show where and ask.
- **Fewer than 11 given** (one main colour, or a handful of shades): **ask the designer whether a full palette is needed, and only if it is, how to create the missing shades.** Never generate, borrow or invent shades without their answer, and never assume a full palette is wanted. Ask together with any other missing brand information (`collecting-brand.md`), not as a separate round, unless the gap only shows up later.

First work out which semantic roles the given shades can't cover (from §4 and §5 below), so the question is concrete. Then ask it like this:

> Your brand gives **{n}** shades for the brand palette ({list them}). MarkitUI has room for 11 (50–950), but you may not need them all. Which fits this project?
> 1. **Only my shades.** Buttons, links and accents use your colours. {Roles your shades can't cover, e.g. "Hover and pressed states keep the same colour, and dark-mode links fall short of contrast."}
> 2. **My shades plus the few the theme needs**: {e.g. "a darker shade for hover and pressed, a lighter one for links in dark mode"}.
> 3. **A full 11-shade palette**, for projects that will use brand tints and shades in their own designs.
>
> If you pick 2 or 3, how should I create the extra shades? **a)** generate them from your colours (they stay exact; I show every shade before anything changes), **b)** take them from the closest Tailwind palette (here: `{palette}`; your colour won't be exact), or **c)** you send them.

Don't recommend an option by default; say what each one means for this brand. If the designer already said what they want (e.g. "just use our two colours"), don't ask again.

The same question applies to every palette the brand adds or changes: a secondary colour, a second brand, a tinted neutral from brand book greys. Ask once, listing each palette with its count.

An answer like "whatever you think" or "go ahead": choose 2 with a), say so in the proposal, and let the designer change it there.

### Option 1: only the given shades

- Put each given shade on the step nearest its lightness (`scripts/brand-scale.js` reports which step a colour is closest to). If two land on the same step, ask.
- Point semantic roles only at those steps. Where a role needs a shade that doesn't exist (hover and active one or two steps darker, dark-mode links), use the nearest given shade, even if that means hover looks the same as rest, and list each such role in the proposal.
- Roles that then fail contrast go under "Decisions needed" in the proposal, with the shade that would fix them. They are the designer's call.
- The steps left over still hold stock purple. Remove them so no stock colour stays behind, but only after every semantic colour points elsewhere and nothing else uses them (see `applying.md`). If something still uses a step, list it and ask.

### Options 2 and 3: extra shades

Create only the shades agreed (option 2) or all 11 (option 3), the way the designer chose:

**a) Generate**

```bash
node scripts/brand-scale.js "#2563eb"            # scale + contrast against white and #171717
node scripts/brand-scale.js "#2563eb" --step 600  # force the step the brand colour sits on
node scripts/brand-scale.js "#2563eb" --tint      # also print a tinted neutral
```

- The brand colour lands **unchanged** on the step closest to its lightness (usually 500 or 600). Every other step is generated in OKLCH so lightness is even and the hue stays stable.
- Override the anchor step only when the designer asks or the auto step puts the brand colour somewhere odd (for example a very light brand colour at 300).
- Several given shades: generate from the main colour, then put each given shade on the step nearest its lightness, replacing the generated one. If two given shades land on the same step, or the result no longer falls steadily in lightness, show it and ask.
- Option 2: keep only the generated steps you need; treat the rest as in option 1.

**b) Closest Tailwind palette:** pick the Tailwind v4 palette whose 500–600 is closest in hue to the brand colour, take the steps needed, and show the brand colour next to the nearest one with the difference.

**c) The designer's shades:** use them as sent and check their order in lightness.

In every case, mark the designer's own shades and the added ones separately in the proposal.

### Writing the palette

Write into the existing brand palette group (stock `colors/brand/*`, possibly renamed; see `theme-structure.md`). Keep the step names (`colors/brand/600`), even when only a few steps remain. Don't create a new group for the main brand.

## 2. Neutral

Choose one, and say which in the proposal:

| Option | When |
|---|---|
| **Keep** the stock neutral | Default. Safe for every brand. |
| **Tinted** neutral (`--tint`, chroma about 0.01 towards the brand hue) | The brand is warm or cool and the user wants greys to match (e.g. warm beige brands, deep navy brands). |
| **Brand book greys** | The brand book defines its own grey scale. Map it onto 50–950 by lightness. Fewer than 11 greys: ask whether a full scale is needed and how, as in §1. |

Neutral drives every surface, text colour and border, so re-run the contrast check after changing it.

## 3. Status colours

Keep `red`, `green`, `yellow` and `blue` (Tailwind defaults) unless the brand book defines its own. A brand whose main colour is red or green: say so, because `interactive-accent` and `interactive-destructive` (or success) will look alike. Suggest shifting the status hue slightly, or leave it to the user.

Stock status text (`fg-success`, `fg-warning`, `fg-destructive` at step 500) fails 4.5:1 on white. Offer, as an optional fix, moving the light-mode `fg-*` status colours to 600–700 (yellow needs 700–800). Borders and fills can stay at 500.

## 4. Semantic mapping

Start from the stock mapping in `theme-structure.md` and change only what the brand needs. The brand affects these roles:

| Role | What decides the step |
|---|---|
| `interactive-accent` | The main button colour. Light: the brand step, if `fg-on-accent` on it passes 4.5:1. |
| `interactive-accent-hover` / `-active` | One and two steps darker than `interactive-accent` (stock pattern). On a very dark accent, go one and two steps lighter instead. |
| `bg-accent` | Same step as `interactive-accent`. Accent surfaces carry `fg-on-accent` text. |
| `fg-on-accent` | White by default. Use `neutral/950` or `base/black` when the brand colour is light (yellow, lime, cyan, pastel). |
| `fg-accent`, `fg-link` | Text in the brand colour. The lightest step that passes 4.5:1 on **both** `bg-primary` and `bg-secondary`. |
| `fg-link-hover` / `-active` | Light: one and two steps darker than `fg-link`. Dark: one and two steps lighter. |
| `interactive-primary` (+ hover, active) | The neutral main button. Keep black/white unless the brand book wants its dark buttons in a brand shade (then use brand 900–950 in light, brand 50–100 in dark, with matching `fg-on-primary`). |
| `focus-ring-default` | Keep black/white, or use the accent step if it passes 3:1 on `bg-primary`. |
| `border-*`, `bg-*` (non-accent), `fg-primary/secondary/tertiary` | Neutral. Change only if the neutral changed and contrast moved. |

Keep `bg-overlay`, `bg-transparent`, `focus-ring-inner` and all status roles as they are unless there is a specific reason.

### When the brand colour itself fails

The brand colour is often between 3:1 and 4.5:1 against white (stock purple is 4.12:1). Then the exact brand colour can't carry white button text. Offer the user a choice, with the numbers:

1. **Keep the exact colour, change the text.** `fg-on-accent` → `neutral/950` if dark text passes 4.5:1 on it. Works for light and mid-light brands.
2. **Keep white text, darken the button.** `interactive-accent` and `bg-accent` → the next darker step that passes. The exact brand colour stays in the palette for illustrations and decoration.
3. **Accept it.** Large or bold button text is still under the 4.5:1 rule for body text. Record it as a "must" failure the user accepted.

Recommend option 2 for mid-tone brands and option 1 for light brands. Never silently change the anchor colour itself.

## 5. Dark mode

Dark mode is not an inversion of light mode.

- Surfaces stay neutral: `bg-primary` 900–950, `bg-secondary` and `bg-elevated` 800, `bg-tertiary` 700.
- Brand **text** (`fg-accent`, `fg-link`) needs a lighter step, often 300–400: the lightest-looking step that passes 4.5:1 on `bg-primary` and `bg-secondary` in dark.
- Brand **buttons** can usually keep the light-mode step and its `fg-on-accent`, because the button carries its own background. Check `interactive-accent` against `bg-primary` at 3:1 so the button edge is still visible; if not, go one step lighter and re-check `fg-on-accent`.
- A very dark brand (navy, deep green) almost always needs a lighter accent step in dark mode.
- "Light only" from the user still means filling dark sensibly with these rules. The file always has both modes and code always writes `.dark`.

## 6. Secondary brand colours

The Theme collection has no semantic role for a secondary brand colour, and semantic variables are never added. Options to offer:

- Add it as a primitive palette group (e.g. `colors/brand-secondary/*`, with as many shades as the designer decided in §1) for designers to use in project blocks and illustrations. Code picks it up as `bg-brand-secondary-500` etc.
- Or use it for one existing role where it fits, such as `fg-link` or `focus-ring-default`, if contrast passes.

## 7. More than one brand

A second brand (a sub-brand, a product line, a white-label client) is a second Theme mode pair:

1. Add a palette group for it in the Tailwind CSS collection: `colors/<brand-slug>/50…950`. The Tailwind CSS collection has one mode, so each brand needs its own palette group. Fewer shades than 11: ask, as in §1.
2. Add `{Brand} / Light` and `{Brand} / Dark` to the Theme collection and point their semantic colours at the new palette.
3. The first Theme mode stays the default brand. Code writes it to `@theme` and every other brand to `[data-brand="<slug>"]`.

Limits to say in the proposal:

- The number of modes per collection depends on the Figma plan. Check the current count and tell the user before adding.
- **Code only varies colours per brand.** `markitui-import-variables` writes fonts, radius and shadows once, from the default mode. Keep those values identical in every Theme mode. If the second brand needs a different font or corner style, say it won't carry into code automatically, and let the user decide.
