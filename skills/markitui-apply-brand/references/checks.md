# Checks and report

Run after applying, fix what fails, re-run what the fix touched, then report.

## 1. Contrast and aliases (script)

Run `scripts/theme-audit.js` (paste the whole file into `use_figma`; set `MODES_TO_CHECK` to the brand's pair if the file has several). It returns, per mode, resolved colours, raw values, missing values and failed pairs.

- [ ] No `must` failures in Light or Dark, except ones the user accepted in the proposal.
- [ ] `missing` is empty in every mode.
- [ ] `raw` lists only values the user approved as raw.
- [ ] `info` failures are listed in the report (status colours, `fg-tertiary`, `border-medium`), not fixed silently.

The pairs and minimums (WCAG 2.1):

| Pair | Minimum |
|---|---|
| `fg-primary`, `fg-secondary` on `bg-primary`, `bg-secondary`, `bg-elevated` | 4.5:1 |
| `fg-accent`, `fg-link` on `bg-primary`, `bg-secondary`; `fg-link-hover` on `bg-primary` | 4.5:1 |
| `fg-on-accent` on `bg-accent` and `interactive-accent` (+ hover, active) | 4.5:1 |
| `fg-on-primary` on `interactive-primary` (+ hover, active) | 4.5:1 |
| `fg-on-secondary` on `interactive-secondary` (+ hover) | 4.5:1 |
| `fg-inverse` on `bg-inverse` | 4.5:1 |
| `interactive-accent`, `focus-ring-default`, `border-strong` on `bg-primary` | 3:1 |

Fix a failure by moving the semantic alias to another step of the scale, never by editing components or changing the anchor colour.

## 2. Values (script)

- [ ] The brand palette has exactly the steps the designer agreed (all 11, or fewer), with lightness falling steadily, and the designer's shades unchanged on their steps.
- [ ] No stock purple step is left behind, and no semantic colour or node points at a removed step.
- [ ] Fonts, radius and shadow values are identical in every Theme mode.
- [ ] Custom role aliases are identical in every Custom mode.
- [ ] Scopes and code syntax are unchanged on every variable you touched (compare with the Step 1 read).
- [ ] No variables were added to Theme or Custom; any new Tailwind CSS palette group has no code syntax.

## 3. Fonts (script)

For every text style in `Custom/*` (and `Tailwind CSS/*` if the project uses them), check its `fontName` is in `figma.listAvailableFontsAsync()`. List missing ones with the weight they need.

## 4. Visual check (screenshots)

Screenshot in both modes. To show Dark, set the Theme mode explicitly on the frame, screenshot, then set it back to what it was:

```js
const theme = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Theme');
const before = frame.explicitVariableModes[theme.id]; // undefined = inherits
frame.setExplicitVariableModeForCollection(theme, darkModeId);
// …screenshot…
before ? frame.setExplicitVariableModeForCollection(theme, before) : frame.clearExplicitVariableModeForCollection(theme);
```

Look at:

- the **Style Guide** page frames (colours, type, buttons)
- a hero, a feature grid with an image overlay, a pricing block, a form (Contact or CTA with input), a footer
- for stores also a product card, the cart and checkout

Look for low-contrast or invisible buttons, links that read as body text, borders that vanish in dark, clipped or overflowing text (new fonts change widths), headings that wrap differently, cards whose new corners clash with images.

## Report

Short prose plus:

| Role | Light | Dark | Contrast (L / D) |
|---|---|---|---|

for the semantic colours that changed. Then one line each for fonts (with tracking), radius, shadows and modes, and:

- **Needs your decision:** accepted failures, raw values, unavailable fonts and their substitutes, status-colour contrast, doc/variable mismatches.
- **Version saved:** its name, so the user can roll back.
- **Next:** run `markitui-import-variables` in the code project to bring the theme into code. Mention licensed fonts that need their files there.
