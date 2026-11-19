# Collecting the brand

## Accepted inputs

Take whatever the user has. Any one of these is enough to start:

| Input | What to take from it |
|---|---|
| Brand book (PDF, images) | Primary and secondary colours with their hex values, typefaces and weights, corner and shadow style if shown, rules for dark backgrounds. Prefer stated hex values over sampled ones. |
| Website URL | Computed styles of real elements (see below). |
| Screenshots | Sampled colours of buttons, links, headings, backgrounds. Treat sampled values as approximate and say so. |
| Logo (SVG or image) | The main brand colour. Fonts only if the logo is clearly set in a known typeface; otherwise ask. |
| Hex values and font names | Use as given. |

Note the source of every value; the proposal shows it.

## Reading a website

Read computed styles, not screenshots. With a browser tool, run a script on the page that reads `getComputedStyle` for:

- the primary call-to-action button: `background-color`, `color`, `border-radius`, `font-family`, `font-weight`, `box-shadow`
- a secondary button and a text link (`color`, hover colour if you can trigger it)
- `h1`, `h2` and body text: `font-family`, `font-weight`, `letter-spacing`, `color`
- the page background and a card or panel: `background-color`, `border-radius`, `box-shadow`, `border-color`
- whether the site has a dark mode (`prefers-color-scheme` styles or a toggle)

Take the first family in each `font-family` stack. Without a browser, fetch the page and read the CSS variables or theme colours from the stylesheet, and say the values are from CSS, not rendered elements.

A site that isn't the user's own (a reference site): take the feel (colour temperature, corner style, type style), never the exact brand colours or fonts unless the user says it is fine.

## Questions

If something essential is missing, ask in one message, at most five questions, and offer a default for each:

1. **Brand name**, used for the mode names (e.g. `Acme / Light`).
2. **Main brand colour**, or a website or logo to take it from.
3. **Fonts** for headings and body, or the feel (geometric sans, humanist sans, editorial serif, mono accents). Default: keep Inter.
4. **Corner style:** sharp, soft or round. Default: keep the current `radius-main`.
5. **Dark mode:** light and dark, or light only. Default: both (the file always has both; "light only" means dark is still filled sensibly but not tuned).

Also ask, only if relevant: a secondary brand colour, and whether this replaces the current brand or is added as a second brand.

**Shades are always asked, on top of the five.** If any palette has fewer than 11 shades (the usual case: one brand colour), add the shades question from `colour-system.md` §1 to the same message: whether a full palette is needed, and only if so, how to create it. Don't fill shades yourself first, don't assume a full palette is wanted, and don't skip the question because the rest of the brand is complete.

## Font availability

Fonts must be available in Figma, or text styles show missing fonts. Check before proposing:

```js
const fonts = await figma.listAvailableFontsAsync();
const styles = fonts.filter(f => f.fontName.family === 'Geist').map(f => f.fontName.style);
return styles; // [] means not available
```

Needed weights (by style name; spacing and capitalisation vary by font, e.g. "Semi Bold" vs "SemiBold"):

- Custom text styles: Regular (400), Medium (500), Semi Bold (600) for the body family; whatever weight Display and Headline alias (stock: Semi Bold) for the heading family.
- Tailwind CSS text styles cover all nine weights. A family missing some only affects those styles; list the missing ones rather than rejecting the font.

If a font isn't available: say so, propose the closest available alternative (same classification and proportions, e.g. a geometric sans for a geometric sans), and mention that installing the font locally or using a Google Font with the same name in Figma would make it available. Google Fonts are available in Figma by default.

The font also has to be loaded in code later. A licensed font that isn't on Google Fonts needs its files in the code project; mention it in the report.
