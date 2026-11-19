# Output checklist

Run through this before returning code. Fix every failure you can; report the rest.

## Tokens and styles

- [ ] No hex, rgb or oklch colours in blocks or components.
- [ ] No arbitrary pixel values (`[13px]`, `[1280px]`). Every value is a Tailwind step, a MarkitUI token (`(--section-padding-y)`) or a text style class.
- [ ] No export noise left (`content-stretch`, `leading-[0]` wrappers, `[word-break:break-word]`, `var(--spacing\/…)`, `w-[var(--viewport-width…)]`).
- [ ] Text uses `type-*` classes (or Tailwind text classes in a `typography: tailwind` project); no separate font-size, line-height or letter-spacing classes.
- [ ] Colours use semantic tokens (`bg-bg-*`, `text-fg-*`, `border-border-*`, `bg-interactive-*`).
- [ ] Container, grid gutter, section and card padding use the layout tokens.

## Structure and responsiveness

- [ ] Each block is one component, mobile-first, built from every breakpoint frame the design has (xl, base, and md if present).
- [ ] Section → container → grid → content structure kept; no empty wrapper divs.
- [ ] The layout matches the Figma screenshots at 375px and 1440px (and 768px when there is an md frame), and nothing breaks at 768px and 1024px.
- [ ] No fixed widths copied from the mockup.

## Components

- [ ] Repeated cards and panels are components with props and data arrays, even where Figma has plain frames; thin Figma helpers are plain markup (`component-boundaries.md`). Each decision is in the report.

- [ ] Every base component is imported from its adapted file (marker comment present); none is restyled inside a block.
- [ ] Variants and sizes used in blocks exist on the adapted component.
- [ ] Interactive parts (tabs, accordion, carousel, menus, flows) work with keyboard and mouse, and only those parts are client components.

## Content and assets

- [ ] The design's real copy everywhere; no lorem ipsum, no component default text.
- [ ] All images and SVGs downloaded into the project; no `figma.com/api/mcp/asset` URLs left.
- [ ] No ImagePlaceholder glyphs shipped; remaining placeholders are listed in the report.
- [ ] Icons come from the right package or a local SVG component; none redrawn.
- [ ] One `h1` per page; headings follow the order.
- [ ] Images have meaningful `alt` text (or `alt=""` when decorative); icon-only buttons have labels.

## Project

- [ ] Imports follow the aliases in `components.json`; install commands use the project's package manager.
- [ ] The project builds (or the dev server starts) without errors, and lint/type checks pass if the project has them.
- [ ] Nothing in the `markitui:tokens` region was edited by hand.

## Report to the user

- Files created or changed, grouped by blocks, base components (adapted now or reused) and pages.
- Component boundary decisions: parts that became components without being Figma components, and Figma components written as plain markup (table format in `component-boundaries.md`).
- Install commands to run, if you couldn't run them.
- Placeholders left (images, icons, links) and where.
- Anything that didn't match the design, why, and the suggested fix (in code or in Figma).
