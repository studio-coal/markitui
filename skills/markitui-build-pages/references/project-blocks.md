# Project blocks (Phase 2)

A project block is the project's own copy of a library block. Pages use project blocks, so the library stays untouched and every project change happens in one place.

## Create

For each section in the approved plan:

1. **Clone** the source component set. Never edit the original.
2. **Rename** it:
   - sections: `{Project} / Section / {Category} / {Layout}` (e.g. `Acme / Section / Features / Bento`)
   - globals: `{Project} / Global / Navbar`, `{Project} / Global / Footer`
   - menus: `{Project} / Navigation / Menu / {Name}` (e.g. `Acme / Navigation / Menu / Product`)
   - archive and detail blocks: `{Project} / Section / {Content type} / {Archive|Post|Release|Event} / {Part}` (e.g. `Acme / Section / Blog / Archive / List`, `Acme / Section / Events & Webinars / Event / Body / Agenda`)
   - two project blocks from the same category and layout: add a short purpose, `Acme / Section / Features / Bento / Platform`
3. **Description:** `{Project block name}. Source: {source library block name}.`
4. **Keep the variant properties:** `Breakpoint = xl | base` (plus `md` if the user chose tablet), and `Step` on flow blocks.

## What to change where

| In the project block master | As instance overrides on the page |
|---|---|
| Layout changes: number of cards, grid spans, adding or removing items | Per-page copy: headings, descriptions, list items |
| Copy shared by every page using the block (footer links, navbar labels) | Button labels and links |
| Images that are the same everywhere (logo, brand visuals) | Images specific to the page |
| Component property defaults | Visibility toggles (`Show …`) and variant choices (e.g. Section Title layout) |
| Archive navigation that isn't in the block yet (an ArchivePagination, an ArchiveHeader above the Grid), in every variant | ArchiveHeader title and description, Controls slot content (set in the xl **and** base instance), sidebar groups to hide |

Make structural changes in the master so the block stays reusable; keep page-specific changes on instances.

## Breakpoints

- Each project block keeps one `Breakpoint` property with `xl` and `base`, and `md` when the user chose tablet.
- **Different layouts per breakpoint** (Composing pages 1.4): to use one library block at xl and another at base (e.g. Megatabs on desktop, stacked cards on mobile), clone both, combine them as variants of one project block, keep a single `Breakpoint` property, and make their copy match.
- **An md layout** (Composing pages 1.3): only when the user chose md in the opening questions. Follow `responsive.md`: duplicate the closer variant, rename it `md`, set its Custom mode to `breakpoint-md`, adapt the layout. Every block on an md page needs an md variant, even if its layout matches xl or base.

## Design rules

Keep project blocks consistent with the library:

- Structure stays section → container → grid → content. Grid frames are structural only (no padding or fills).
- Everything on variables and text styles: no raw colours, spacing, radii, effects or font settings.
- Section Title: heading size `xl` for the block's main title, `lg` when the title sits beside the content. A full-width title uses the Stack Center layout by default.
- Rows of cards show 3 cards by default; change the count per project need.
- On base, media that sits beside text at xl stacks above the text.
- Cards and panels use `layout/card-padding` (`card-padding-lg` for large cards) and `layout/panel-padding`; grids use `layout/grid-gutter` between columns.
- `rounded-main` is for cards, panels and other visual containers (media frames, image wrappers) in blocks only; base components never use it. Bind `border-radius/rounded-main`, never a fixed radius, so the theme's `radius-main` controls them.
- An image with text on top needs the `colors/bg-overlay` layer in the same fill stack as the image. Keep it in the block frame's own fill (image + overlay), not as separate absolute frames.
- Base components (Button, Badge, ProductCard…) are used as instances with their properties. Never detach them or restyle them inside a block.

## Navigation

- Build the navbar and each menu's content as project blocks.
- Show each opened menu as a frame next to the navbar: `Navbar / {Menu} Menu Opened` (or `Dropdown Opened`), at xl.
- Add `Navbar / Mobile Menu` at base, using the mobile navigation pattern from the plan (Dropdown, Drilldown or Direct Links).
