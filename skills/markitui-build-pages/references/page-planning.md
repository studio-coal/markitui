# Page planning (Phase 1)

## Inventory the library

- The **Navigation** doc frame lists every block category with a short description and a link to its page. Start there.
- Block pages sit under three groups: Global blocks (Navbar / Navigation, Footer, Banner, Cookie Notice, Section Title, Rich Text Editor, Archive Components), Marketing blocks and E-commerce blocks.
- Block component sets are named `{Category} / {Number}.` or `{Category} / {Layout} / {Number}.`. Store versions of shared categories use `{Category} / Shop / …` (e.g. `Navbar / Shop / 01.`, `Footer / Shop / 12.`). Flow blocks are `{Category} / Flow / {Number}.`.
- Every block has a description of its layout and content (e.g. "Stack · Full-width 16:9 media and three checklist columns."). Read names, descriptions and variant properties only; don't load block contents until Phase 2.

## Page anatomy

A page is: navbar, one opener (hero or header), content sections, an optional CTA, footer.

| Page type | Typical sections after the opener |
|---|---|
| Homepage (marketing) | Logos, Features (2–3 sections), Customer Stories or testimonials, Stats, Pricing teaser or CTA |
| Product or solution page | Features (detail), Integrations, Customer Stories, FAQ, CTA |
| Pricing | Pricing, Comparison, FAQ, CTA |
| About / Company | Header, Stats, Team, Careers teaser, CTA |
| Blog, Customer Stories, Changelog, Events & Webinars archive | Header (ArchiveHeader or ArchiveSidebar inside the first block), optional Archive / Featured block, Archive / List block, ArchivePagination inside the last block, optional CTA. See `content-types.md` |
| Post, release, story or event detail | The content type's Header + Body, or a complete Body alone; events stack 1–3 Event Bodies; related items from the type's Featured page. See `content-types.md` |
| Contact | Contact, FAQ |
| Store homepage | Hero (Shop), Categories, Product Showcase, Store (service strip, brand story) |
| Collection (PLP) | Collection blocks with filters, Product Showcase |
| Product detail (PDP) | Product Detail hero and details, Recommendations, Reviews |
| Cart, Checkout, Confirmation | Cart and Checkout blocks, including flow blocks |

Choose blocks by their content and structure, not their looks: styling happens in the project block and the theme. Prefer variety across a page (don't stack three Features blocks with the same layout), and keep the same block for the same job across pages (one FAQ style site-wide).

## The plan

Present one table row per page:

| Page | Route | Data source | Sections in order (project block ← source library block) |
|---|---|---|---|
| Home | `/` | Static | Navbar ← Navbar / 01. · Hero / Split ← Hero / Split / 03. · Logos / Row ← Logos / 04. · … · Footer ← Footer / 07. |
| Blog | `/blog` | CMS | Navbar ← Navbar / 01. · Blog / Archive / List ← Blog / Archive / List / 09. (ArchiveHeader Horizontal: Categories + Link; ArchivePagination Load More) · Footer ← Footer / 07. |
| Blog post | `/blog/[slug]` | CMS | … |

Below the table, list:

- **Breakpoints:** the user's choice from the opening questions: `xl + base`, `xl + md + base`, or md for the named pages only. When md is in, list the project blocks that will get an md variant.
- **Shared blocks** used on several pages (navbar, footer, CTA, FAQ).
- **Navigation:** the navbar, each menu (dropdown or mega menu), and the mobile menu pattern.
- **For content types:** for each archive, the list kind, the archive component settings (ArchiveHeader orientation and controls, sidebar controls, pagination type), and for each detail template whether the body is complete or paired with a Header.
- **For stores:** the flow blocks and which `Step` each page shows (e.g. PDP shows `Step = 1 No size selected`, cart drawer shows `Step = 3 Added`).
- **Open questions:** missing copy, images, or pages the user hasn't decided on.

Routes use lowercase kebab-case; dynamic segments in brackets (`/products/[slug]`). Data source is `Static`, `CMS` (lists and templates) or `Store` (products, cart, checkout).

Then stop and wait for approval or changes.
