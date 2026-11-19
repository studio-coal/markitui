# Checks and report

## Script check (read-only `use_figma`, one call per build page)

For every page frame:

- [ ] Named `{Page Name} / xl` (1440 wide) or `{Page Name} / base` (375 wide), or `{Page Name} / {Step} / xl|base` for flow steps; `md` frames are 768.
- [ ] Has the explicit Custom collection mode matching its breakpoint.
- [ ] Contains only attached block instances: no leftover Breakpoint instance, Body Slot or wrapper frame, no detached blocks.
- [ ] Every block's `Breakpoint` matches the frame; flow blocks show the planned `Step`.
- [ ] Every xl frame has a Development annotation starting `Route: `.
- [ ] Sits in a Section named after the page, with xl, md (if chosen) and base side by side in that order.
- [ ] If md was chosen: every block on an md frame is its `Breakpoint=md` variant, and the frame's Custom mode is `breakpoint-md`.

For every project block:

- [ ] Named `{Project} / Section / …`, `{Project} / Global / …` or `{Project} / Navigation / Menu / …`, with a description containing `Source:`.
- [ ] Fills, strokes, gaps, padding and radii are bound to variables; no raw values.
- [ ] Every text layer uses a text style.
- [ ] No default layer names (`Frame 12`, `Group 3`), no detached base components.

Across pages:

- [ ] Store data (items, prices, tax, totals, delivery dates) is consistent across cart, checkout and confirmation.
- [ ] Each page has one opener (hero or header) and the same navbar and footer.
- [ ] Each archive page has exactly one ArchiveHeader or ArchiveSidebar at the top and at most one ArchivePagination at the bottom; categories and search show once; every archive component's `Breakpoint` matches its block, in both xl and base.
- [ ] Archive and detail pages use only their own content type's blocks; no Featured-page blocks on archive pages.
- [ ] No detail page has a Header above a body that already has its own header.

## Visual check

- Screenshot every page at xl and base, and md when it exists. Look for clipped or overflowing text, empty placeholders that should have content, wrong block order, broken spacing at block boundaries.
- Screenshot one page with the dark mode of the Theme collection applied and check that everything still reads.
- Contrast: body text at least 4.5:1 against its background, large text and UI elements at least 3:1, including text on images with the overlay.

Fix what you find, then re-run the checks that the fixes touched.

## Report

Reply in short prose with a compact table:

| Page | Route | Sections (project block ← source) | Needs your decision |
|---|---|---|---|

Then list, briefly: project blocks created, placeholders left (images, logos, copy), behaviour that still needs defining, and anything from the plan you couldn't build and why.
