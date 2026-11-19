---
name: markitui-apply-brand
description: >-
  Turn a brand into a MarkitUI theme in your own copy of the MarkitUI Figma
  file: brand colour scale, semantic colours for light and dark mode, fonts,
  corner radius and shadows, checked for contrast, after you approve a
  proposal. Use whenever someone wants to brand, theme, re-skin or restyle
  MarkitUI ("apply our brand", "make MarkitUI look like acme.com", "use these
  colours and fonts", "set up a dark mode", "add a second brand"), from a brand
  book, a website, screenshots, a logo, or just hex values and font names,
  even if they do not say "MarkitUI" or "theme".
---

# MarkitUI: apply a brand

Turn the user's brand into a MarkitUI theme. Every base component and block follows automatically, because they only use variables and text styles. The work is changing **values** in three variable collections, never components.

The file's own documentation is the source of truth. At the start of every run, read the **Variables**, **Colors**, **Typography** and **System setup** doc frames on the Documentation page. If anything in this skill disagrees with them, follow the file and mention the difference in the report.

## Before you start

- Work only in the user's own copy of MarkitUI. Ask for its Figma link if you don't have it.
- Writing to Figma needs the Figma MCP server with write access. Load the Figma MCP's guidance for writing to files (its `figma-use` skill) before the first edit, and create a session first if the server asks for one.
- Find collections, modes and variables **by name**, never by ID. A user may have renamed things; `references/theme-structure.md` says how to find them by content.
- What may change and what may not is listed in `references/theme-structure.md`. In short: values and aliases, yes; renaming, deleting or re-scoping semantic variables, code syntax, components and blocks, no.

## Workflow

**1. Inventory.** Read `references/theme-structure.md`. Read the user's Theme, Tailwind CSS and Custom collections with a read-only script, and run `scripts/theme-audit.js` (paste it into `use_figma`) to get the current resolved colours and contrast. Note anything already changed from stock.

**2. Collect the brand.** Read `references/collecting-brand.md`. Take whatever the user has (brand book, website, screenshots, logo, hex values, font names) and fill the gaps with at most five short questions in one message. If any palette has fewer than 11 shades, add the shades question from `references/colour-system.md` to that message: is a full palette needed, and only if so, how to create it. Check every font is available in Figma.

**3. Build the proposal.** Read `references/colour-system.md`, `references/typography.md` and `references/radius-and-shadows.md`. Build the brand palette the way the designer chose (only their shades, or extra shades generated with `scripts/brand-scale.js`, taken from the closest Tailwind palette, or sent by them), choose the semantic mapping for light and dark, then fonts, radius and shadows. Check contrast on the proposed values before showing them.

**4. Propose and stop.** Present it in the format in `references/proposal.md`. **Stop and wait** for approval or changes. Change nothing in the file before the user approves.

**5. Apply.** Read `references/applying.md`. Save a version first, then write in the order given there: primitives, modes, semantic colours, fonts, text style tracking, radius, shadows.

**6. Check and report.** Read `references/checks.md`. Run `scripts/theme-audit.js` again, check fonts and aliases, screenshot the Style Guide frames and a few blocks in both modes, fix what fails, then report.

## Reference files: read each one when its step comes up

- `references/theme-structure.md`: the three collections, what may change, finding things in a renamed copy, stock values. Step 1.
- `references/collecting-brand.md`: brand inputs, reading a website, questions, font availability. Step 2.
- `references/colour-system.md`: the brand scale, neutral tint, status colours, semantic mapping for light and dark, multiple brands. Step 3.
- `references/typography.md`: font families, which roles use which family, weights, letter spacing. Step 3.
- `references/radius-and-shadows.md`: `radius-main`, the radius scale, shadow layers. Step 3.
- `references/proposal.md`: the proposal format. Step 4.
- `references/applying.md`: write order and script patterns. Step 5.
- `references/checks.md`: contrast, aliases, fonts, screenshots, report. Step 6.

## Scripts

- `scripts/brand-scale.js`: only when the designer chose to generate extra shades (it also reports which step a colour is nearest). Builds an 11-step OKLCH scale (50–950) from one colour, with the brand colour unchanged on its nearest step; optional tinted neutral. Run with Node (`node scripts/brand-scale.js "#2563eb" --tint`) or paste the functions into `use_figma`.
- `scripts/theme-audit.js`: read-only. Resolves every semantic colour in every Theme mode and checks WCAG contrast for the pairs blocks use. Paste the whole file into `use_figma`.

## Non-negotiables

- Shades are the designer's call. If the brand gives fewer than 11 shades for a palette, ask whether a full palette is needed and, only if it is, how to create it, before building the proposal. A palette with only the brand's own shades is a valid answer. Never generate, borrow or invent shades unasked.
- Stop after the proposal and wait for approval.
- Values and aliases only. Never rename, delete or add semantic variables, or change scopes or code syntax: code maps to the variable names. Don't edit base components or blocks, except a component change the user explicitly approved in the proposal (such as button corners, see `references/radius-and-shadows.md`), made in the master only.
- Semantic colours stay aliases to primitives. A raw value is a last resort and goes in the report.
- Every "must" contrast pair passes in light and dark, or the user has explicitly accepted the failure.
- Every font used is available in Figma and has the weights the text styles need.
- When done, point the user to `markitui-import-variables` to bring the new theme into code.
