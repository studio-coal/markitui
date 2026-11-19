# Typography

What a brand changes in type: families, which text roles use which family, weights, and letter spacing. Sizes and line heights stay as they are unless the user asks; they are layout decisions, not brand ones.

## How fonts flow

```
Theme: font family/font-sans | font-serif | font-mono   (strings, e.g. "Inter")
   ↑ aliased by
Custom: text styles/{role}/font-family, …/font-weight*   (one alias per role, same in every breakpoint mode)
   ↑ bound to
Text styles: Custom/* (used by every component and block), Tailwind CSS/* (optional)
```

- Changing `font-sans` changes every text style that aliases it. That is the normal brand change.
- Roles: `display`, `headline`, `body`, `label`, `eyebrow`, `caption`. Stock: all alias `font-sans`; `display` and `headline` use `font-semibold`; `body` and `label` have separate weight variables per weight (`font-weight-regular`, `-medium`, `-semibold`).
- Tailwind CSS text styles bind `font-sans` and a weight directly.

## Families

| Brand has | Set |
|---|---|
| One family | `font-sans` = that family. Leave serif and mono as they are. |
| Heading + body family | `font-sans` = body family. Put the heading family in `font-serif` (if it is a serif), then point `text styles/display/font-family` and `text styles/headline/font-family` at it. A heading sans: see the rules below. |
| A mono accent (eyebrows, labels, prices) | `font-mono` = that family, then point `text styles/eyebrow/font-family` (and only the roles the user names) at `font-mono`. |

Rules:

- Families are plain strings: the family name exactly as Figma lists it (`"Geist"`, not `"Geist Sans"` unless that is the listed name).
- Re-point Custom role aliases in **every** Custom mode (`breakpoint-xl`, `breakpoint-md`, `base`), so the role doesn't change family across breakpoints.
- Never add a fourth family variable: code maps exactly these three. A heading **sans** that differs from the body sans has no slot of its own. Ask the user which slot to repurpose (usually `font-serif` when the brand has no serif), and say the class in code will still be called `font-serif`.
- Keep font family values identical across all Theme modes (see `colour-system.md` §7).

## Weights

Text styles bind a numeric weight; Figma then needs the matching style in the font (e.g. 600 → "Semi Bold"). Check availability with `figma.listAvailableFontsAsync()` (see `collecting-brand.md`).

- Body family needs Regular, Medium and Semi Bold for the Custom styles.
- The heading family needs the weight Display and Headline use (stock Semi Bold).
- If the brand's headings are bolder or lighter (e.g. a display serif at Regular), re-point `text styles/display/font-weight` and `text styles/headline/font-weight` to another `font-weight/*` token. Don't change the numbers inside `font-weight/*`: they are Tailwind's scale.
- A missing weight shows as a missing font. List any Tailwind CSS text styles affected; they are optional and only matter if the project uses them.

## Letter spacing

Letter spacing is **not** a variable. It is set on each text style as a percentage, tuned for Inter:

| Styles | Stock |
|---|---|
| Display LG / MD / SM | −5% / −4% / −3.5% |
| Headline (all sizes) | −3% |
| Body, Label | −3% |
| Caption | −1% |
| Eyebrow | 0% |
| Tailwind CSS/* | −3% |

Inter's tight spacing looks cramped in most other fonts. When the family changes, propose new tracking in the proposal, not after:

| New family | Display | Headline | Body / Label / Caption |
|---|---|---|---|
| Neo-grotesque similar to Inter (Geist, SF, Helvetica Now, Manrope) | keep stock | −2% to −3% | −1% to −2% |
| Geometric sans (Poppins, Montserrat, Futura-like) | −2% to −3% | −1% to −2% | 0% |
| Humanist sans (Source Sans, Open Sans, Lato) | −2% | −1% | 0% |
| Serif headings (Playfair, Fraunces, Lora) | −1% to −2% | −1% | (body unaffected) |
| Mono | 0% | 0% | 0% |

Follow the brand book or the website's computed `letter-spacing` when it gives a value; convert em to percent (`-0.02em` → `−2%`). Eyebrow stays 0% unless it is uppercase and the brand spaces it out (then +2% to +8%).

Code reads letter spacing straight from each text style (`markitui-import-variables` writes it into the `type-*` utilities), so the change carries through.

## Sizes

Don't change `text styles/*` sizes or line heights, or the Theme `text/*` scale, for a brand. Exception: a family with a much larger or smaller x-height than Inter can look a size off. Mention it in the report and offer to adjust after the user has seen the screenshots.

## Code note

A font that is on Google Fonts loads easily in code. A licensed font needs its files in the code project. Say which in the report.
