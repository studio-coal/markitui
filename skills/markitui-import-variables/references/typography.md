# Typography: two systems

MarkitUI ships two typography systems. Both live in the file; a project normally uses one.

| | Custom text styles (default) | Tailwind CSS text styles |
|---|---|---|
| Figma styles | `Custom/Display/*`, `Custom/Headline/*`, `Custom/Body/*`, `Custom/Label/*`, `Custom/Eyebrow/Eyebrow`, `Custom/Caption/Caption` | `Tailwind CSS/text-<size>/leading-normal\|leading-none/<variant>` |
| Variables | Custom collection `text styles/*`: size and line height per breakpoint (responsive), family and weight per text family | Theme collection `text/*` (fixed sizes), `font family/*`, `font-weight/*` |
| Responsive | Yes: sizes change at `md` and `xl` | No: designers pick a different style per breakpoint |
| Code | One `type-*` utility class per text style | Standard Tailwind classes: `text-2xl font-bold` |

The block library and the documentation use Custom text styles. That says nothing about a user's project, so always check the project itself.

## Step 1: detect which system the project uses

1. Ask the user for links to the project's own page frames or project blocks (not the library pages). If there are none yet, use Custom (the default), say so, and skip to step 3.
2. For each linked frame, read the text styles in use. Prefer `get_variable_defs` on the frame (it lists the styles and variables used). If you need counts, use a read-only `use_figma` script that walks `TEXT` nodes under the frame and counts `textStyleId` by style-name prefix (`Custom/`, `Tailwind CSS/`, none). Read only; never change the file.
3. Decide:
   - 90% or more of styled text uses `Custom/` → **Custom**.
   - 90% or more uses `Tailwind CSS/` → **Tailwind**.
   - Anything in between → **Mixed**. Write both, and tell the user which pages use which, because mixed systems usually mean some pages were built before a decision was made.
   - Text with no text style → count it and list a few layer names in the report. Suggest the designer applies styles; do not invent styles for it.
4. Tell the user the result and the numbers before writing ("Project pages use Custom text styles: 212 of 218 text layers").

Write the result at the top of the managed region (`/* typography: custom */`, `tailwind` or `mixed`) so later syncs and the block-to-code skill can read it.

## Always written (all systems)

From the Theme collection, in `@theme static`:

- `font family/*` → `--font-sans`, `--font-serif`, `--font-mono` (see fallback stacks in `token-mapping.md`).
- `font-weight/*` → `--font-weight-thin … --font-weight-black`.
- `text/<size>/font-size` → `--text-<size>` and `text/<size>/line-height` → `--text-<size>--line-height`, in rem for all 13 sizes. Base components and plain Tailwind classes depend on these.

## Custom system output

**1. Typography variables.** Custom `text styles/*` variables go into the responsive `:root` block (see "Custom collection" in `token-mapping.md`), named by their code syntax:

```css
:root {
  --headline-font-family: var(--font-sans);
  --headline-font-weight: var(--font-weight-semibold);
  --fontsize-headline-xl: 2.25rem;     /* base */
  --lineheight-headline-xl: 2.25rem;
  @media (width >= 48rem) { --fontsize-headline-xl: 2.5rem; --lineheight-headline-xl: 2.5rem; }
  @media (width >= 80rem) { --fontsize-headline-xl: 3rem;   --lineheight-headline-xl: 3rem; }
}
```

Family and weight variables alias Theme tokens (`→ font family/font-sans` becomes `var(--font-sans)`). If a user points a family at serif, that change flows through automatically.

**2. One utility per Custom text style.** A Figma text style bundles family, weight, size, line height, letter spacing, case and decoration. Mirror it as one class with `@utility`:

```css
@utility type-headline-xl {
  font-family: var(--headline-font-family);
  font-weight: var(--headline-font-weight);
  font-size: var(--fontsize-headline-xl);
  line-height: var(--lineheight-headline-xl);
  letter-spacing: -0.03em;
}
```

Building each utility:

- **Values come from the style's bound variables.** Map each bound variable (`fontSize`, `lineHeight`, `fontFamily`, `fontWeight`) to its code syntax. If a property is not bound, use the style's raw value (rem for size and line height) and flag the style in the report.
- **Letter spacing, case and decoration are not variables.** Read them from the text style: letter spacing percent → em (`-3%` → `-0.03em`, omit when 0); `textCase: UPPER` → `text-transform: uppercase`; `textDecoration: UNDERLINE` → `text-decoration-line: underline`; `STRIKETHROUGH` → `line-through`.
- **Class name** = `type-` + the last part of the style name in lowercase, spaces as hyphens, with single-letter sizes expanded to match the variable names (`M` → `md`, `S` → `sm`, `L` → `lg`):

| Figma text style | Class |
|---|---|
| `Custom/Display/Display LG` | `type-display-lg` |
| `Custom/Headline/Headline 2xl` | `type-headline-2xl` |
| `Custom/Headline/Headline XL` | `type-headline-xl` |
| `Custom/Body/Body MD Semibold` | `type-body-md-semibold` |
| `Custom/Body/Body SM Link` | `type-body-sm-link` |
| `Custom/Label/Label MD Medium` | `type-label-md-medium` |
| `Custom/Eyebrow/Eyebrow` | `type-eyebrow` |
| `Custom/Caption/Caption` | `type-caption` |

Why `type-` and not `text-`: projects using `cn()` / tailwind-merge treat unknown `text-*` classes as text colours, so `text-headline-xl text-fg-primary` would silently drop one of them. `type-*` classes pass through untouched.

User-added Custom styles follow the same rule. If two styles produce the same class name, stop and ask.

Colour is never part of a text style. Text colour stays a separate class (`text-fg-primary`).

## Tailwind system output

No extra utilities. The Theme tokens written above make Tailwind's own classes match Figma. How a Figma style reads as classes:

| Figma text style | Classes |
|---|---|
| `Tailwind CSS/text-2xl/leading-normal/bold` | `text-2xl font-bold` |
| `Tailwind CSS/text-base/leading-none/medium` | `text-base leading-none font-medium` |
| `Tailwind CSS/text-sm/leading-normal/underlined` | `text-sm underline` |
| `Tailwind CSS/text-sm/leading-normal/strikethrough` | `text-sm line-through` |

**Trap:** `leading-normal` in the Figma style name means "the size's own line height" (`text-2xl` → 32px), which `text-2xl` already sets. It is not Tailwind's `leading-normal` utility (1.5). Never add `leading-normal` to the classes.

**Letter spacing.** Tailwind CSS text styles carry a letter spacing (stock `-3%`) that Tailwind's defaults don't have. If all Tailwind CSS styles share one value, write it once:

```css
@theme static { --tracking-normal: -0.03em; }
@layer base { body { letter-spacing: var(--tracking-normal); } }
```

If values differ between styles, write the most common one this way and list the exceptions in the report as `tracking-[…]` classes to use.

## Mixed system output

Write both: the Custom variables and `type-*` utilities, and the Tailwind letter-spacing rule. Report which pages use which system.

## Fonts

Variables only name fonts; the project must load them. For each family used by the chosen system (stock: Inter for everything; Playfair Display and Roboto Mono only if styles use serif or mono), check that the project loads it (`next/font`, `@fontsource/*`, `<link>` to a font service, or `@font-face`). If it is missing, propose how to load it and wait for approval before adding packages. If the project loads a font into its own variable (e.g. `--font-inter` from `next/font`), use that variable first in the `--font-*` stack.
