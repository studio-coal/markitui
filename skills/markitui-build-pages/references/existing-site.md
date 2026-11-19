# Rebuilding an existing website (Phase 1 input)

Use this when the user wants an existing website rebuilt or redesigned in MarkitUI. The result is the same page plan as `page-planning.md`, with each section matched to a library block.

## 1. Whose site is it?

Ask if it isn't clear:

- **The user's own site** (they own the content): carry over its real copy, page structure and navigation. Ask the user to supply images and logos; don't copy them from the site unless the user confirms they own them and want them reused.
- **Someone else's site used as a reference:** take the structure and page types only. Write original copy in the project's own voice, and never copy text, images, logos or brand names.

## 2. Read the site

- Start with the homepage and the main navigation, then the footer links, to build the sitemap. Ask the user which pages to include if there are more than about ten.
- For each page, read it top to bottom (fetch the page; use a browser screenshot when the layout matters and a browser tool is available). List each section with its purpose and content: "hero with headline, subline, two buttons and a product screenshot", "three feature cards with icons", "logo wall, 6 logos", "pricing, 3 plans, monthly/annual toggle", "FAQ, 8 questions".
- Note interactive parts (tabs, carousels, accordions, mega menus, filters) and forms.

## 3. Match sections to blocks

For each section, pick the library block whose **purpose and structure** fit best, using block descriptions:

- Same purpose first (a pricing table is a Pricing block), then the closest structure (number of items, media position, split or stacked).
- Content counts can change in the project block (4 cards instead of 3), so don't reject a block only because the count differs.
- If nothing fits well, use the closest block and mark the row "needs adaptation" with what has to change, or "no match" with a suggestion. Never invent a section outside the library.
- Keep the site's page order unless the user asks for improvements; if you suggest changes (merging thin sections, adding a CTA), list them separately so the user can choose.

## 4. Plan table

Add a source column to the normal plan:

| Page | Route | Sections in order (existing section → project block ← library block) | Notes |
|---|---|---|---|
| Home | `/` | Hero with screenshot → Hero / Split ← Hero / Split / 03. · Logo wall → Logos / Row ← Logos / 04. · … | Testimonials section has no close match: using Customer Stories / Carousel ← … |

Then stop for approval, as in every run. After approval, continue with Phase 2 as usual. With the user's own site, put its real copy into the instance overrides in Phase 3.
