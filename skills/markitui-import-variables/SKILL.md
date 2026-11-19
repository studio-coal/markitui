---
name: markitui-import-variables
description: >-
  Sync a MarkitUI Figma file's variables, text styles and effect styles into a
  website project's Tailwind CSS v4 stylesheet (globals.css), for light and dark
  mode, responsive breakpoints and every brand mode the file has. Use whenever
  someone wants to import, export, sync or update MarkitUI tokens, theme,
  colours, typography, spacing, radius or shadows in code ("sync my MarkitUI
  variables", "pull the theme from Figma", "update globals.css from Figma",
  "set up MarkitUI tokens in my project", "apply the new brand in code"), even
  if they do not say "MarkitUI". Also bridges MarkitUI tokens to shadcn/ui token
  names so installed components pick up the brand. Prefer this
  over hand-editing CSS: it reads the live Figma file, keeps light, dark and
  breakpoints complete, and only edits a marked region of the stylesheet.
---

# MarkitUI: import variables into code

Read the user's MarkitUI Figma file and write its design tokens into the project's stylesheet as Tailwind CSS v4 theme variables, so code matches Figma 1:1. Figma is the source of truth; this skill never writes to Figma.

Three ideas carry this skill:

1. **Read the live file, not a fixed list.** MarkitUI is a product. Users change colours, fonts, sizes and radius, rename brands, add modes and add their own variables. Always inventory the file first. The stock values in `references/figma-collections.md` exist only to spot what changed, never as output.
2. **Use the names the file already gives you.** Theme and Custom variables have a Web code syntax (for example `var(--color-bg-primary)`). Designers see these names in Dev Mode, so the CSS must define exactly these names. The Tailwind CSS collection has no code syntax on purpose: its variable names already read like Tailwind (`spacing/4`, `colors/brand/500`, `border-radius/rounded-full`), so derive its CSS from the name with the table in `references/token-mapping.md`. Never invent other token names.
3. **Merge, never clobber.** Write only inside the `markitui:tokens` managed region. Everything outside it stays byte-for-byte the same.

## Prerequisites

- The Figma MCP server is connected (remote server recommended). Reading collections needs `use_figma` in read-only mode; if Figma's `figma-use` skill is available, load it before the first `use_figma` call.
- A link to the user's copy of the MarkitUI file. The fileKey comes only from this link.
- A project using Tailwind CSS v4 (React with shadcn/ui, or plain Tailwind). For Tailwind v3, see `references/managed-region.md` before writing anything.
- Works the same in Claude Code, Codex and other agents with file access.

## Workflow

1. **Locate the stylesheet.** Find the CSS file that contains `@import "tailwindcss"`. In shadcn projects, `components.json` → `tailwind.css` points to it; in Astro projects it is usually `src/styles/global.css`. Note whether shadcn/ui token blocks already exist and whether a `markitui:tokens` region exists (first run vs update). Read `references/managed-region.md`.

2. **Inventory the Figma file (read only).** Read `references/figma-collections.md`, then list every collection, mode, variable (name, type, code syntax, value per mode, alias target), every text style and every effect style. Compare against the stock baseline and write down what the user changed, added, renamed or removed. Never edit the file.

3. **Settle the modes.**
   - Theme collection: modes are named `<Brand> / Light` and `<Brand> / Dark`. One brand → `:root` and `.dark`. Several brands → ask which is the default; the others become `[data-brand="<slug>"]` blocks.
   - Custom collection: `base` is mobile-first, `breakpoint-md` and `breakpoint-xl` become media queries at the Theme breakpoint values. Any added `breakpoint-<name>` mode maps the same way.

4. **Decide the typography system.** Read `references/typography.md`. MarkitUI ships two systems: Custom text styles (default) and Tailwind CSS text styles. Check which one the project's pages actually use before writing typography, and tell the user what you found.

5. **Map tokens.** Read `references/token-mapping.md` and map every variable group, text style and effect style by its rules: units, aliases, composite colours, layered shadows, focus rings and the shadcn/ui bridge. Do not drop anything silently: anything you cannot map goes into the report.

6. **Build the region.** Assemble the output in the order and shape shown in `references/example-output.md`. Keep every semantic colour present in both light and dark blocks.

7. **Show, then write.** On the first run, or when more than ~20 tokens change, show the diff and wait for approval. Then write only inside the managed region and apply the small bridge edits described in `references/managed-region.md`.

8. **Verify and report.** Re-read the file: markers intact, `@theme` after the Tailwind import, every light semantic token has a dark counterpart, every Custom variable has a base value and resolves correctly at each breakpoint, no hard-coded value where Figma had an alias. Run the project's build or dev server if you can, and check for CSS errors. Report:
   - the Figma file and modes used, and the typography system chosen;
   - tokens added, changed and removed since the last sync;
   - user customisations detected (changed values, new variables, new modes);
   - anything left out on purpose (Figma-only tokens) and anything that could not be mapped, with a suggested fix;
   - fonts that the project still needs to load.

## Reference files: read each one when its step comes up

- `references/figma-collections.md`: MarkitUI's collections, modes and stock values; how to inventory the file; how to detect user changes. Read at step 2.
- `references/token-mapping.md`: the rules from Figma variable to CSS, group by group, including the shadcn/ui bridge. Read at step 5, before writing any value.
- `references/typography.md`: the two typography systems, how to detect which one is used, and how each becomes CSS. Read at step 4.
- `references/managed-region.md`: markers, first run vs update, conflicts with shadcn defaults, Tailwind v3. Read at step 1 and again before writing.
- `references/example-output.md`: an abbreviated example of the finished region. Read at step 6.

## Non-negotiables

- Never write to Figma. Never edit outside the managed region, except the bridge edits listed in `references/managed-region.md`, and only after showing them.
- Variable names come from Figma's code syntax (Theme, Custom) or from the derivation table (Tailwind CSS collection). Never rename, prefix or "tidy" them.
- Keep aliases as `var()` references. A semantic colour that points to `colors/brand/500` becomes `var(--color-brand-500)`, never the hex value, so brand changes flow through.
- Every semantic colour exists in light and dark; every Custom variable exists for every breakpoint mode; every brand mode is either written or listed as skipped.
- Never guess colour conversions. Write colours as Figma stores them (hex or rgb). Convert to oklch only if the project already uses oklch and you can run a real conversion in code.
- Never invent fonts, shadows or tokens the file does not define. Never delete a user's custom variable because it is not in the stock baseline.
- If the file is not a MarkitUI file (no Theme or Custom collection), stop and say what is missing.
