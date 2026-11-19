# Content types: archive and detail pages

Blog, Changelog, Customer Stories and Events & Webinars share one structure: an **archive page** (the list) and a **detail page** (one post, release, story or event). Use this file in Phase 1 to plan them, and in Phases 2–3 to place the archive components.

Source of truth: the **Archive pages** doc frame on the Archive Components page and the **Assembling archive and detail pages** doc frame on the Blog (Archive / Post) page. Both cover all four content types (Archive pages also covers the store's Collection (PLP), which uses the same archive components). Read them at the start of any run that plans one of these pages. Where this file and that doc differ, follow the file and mention it in the report.

## Blocks per content type

Each content type has its own pages and blocks. Use only that type's blocks: a changelog uses Changelog blocks, never Blog blocks. Pair headers and bodies within one content type only.

| Content type | Library page | Archive blocks | Detail blocks |
|---|---|---|---|
| Blog | Blog (Archive / Post) | `Blog / Archive / Featured / 01–08`, `Blog / Archive / List / 01–12` | `Blog / Post / Header / 01–06`, `Blog / Post / Body / 01–05` |
| Changelog | Changelog (Archive / Release) | `Changelog / Archive / Featured / 01–06`, `Changelog / Archive / List / 01–06` | `Changelog / Release / Header / 01–04`, `Changelog / Release / Body / 01–04` |
| Customer Stories | Customer Stories (Archive / Post) | `Customer Stories / Archive / 01–06` (no separate Featured or List) | `Customer Stories / Post / Header / 01–05`, `Customer Stories / Post / Body / 01–05` |
| Events & Webinars | Events & Webinars (Archive / Post) | `Events & Webinars / Archive / Featured / 01–09`, `Events & Webinars / Archive / List / 01–08` | `Events & Webinars / Event / Header / 01–06`, `Events & Webinars / Event / Body / 01–13` |

The numbers are the stock library. Inventory the user's copy by name, and read each block's description to choose; don't rely on the numbers alone. The Blog (Featured) and Customer Stories (Featured) pages hold highlight blocks for **other** pages (homepage, product pages, related items after a post). They don't go on archive pages: use the content type's own Archive / Featured blocks there.

## Archive components

Three shared components on the Archive Components page handle navigation. All have `Breakpoint = xl | base`. They live **inside** archive blocks, never between them; the block Container's gap spaces them, so the page keeps normal section spacing.

| Component | Set on the instance | Use |
|---|---|---|
| **ArchiveHeader** | `Orientation`, Controls slot, `Show Breadcrumb`; the nested Section Title's `Show Heading` and `Show Description` | The top of the archive: breadcrumb (Resources › content type), title, description, controls. **Horizontal** (default): controls in a row below the title, for archives with categories. **Vertical**: controls beside the title (a search, a link, a subscribe form or a next-event card), and above a sidebar, where the sidebar carries the categories. Hide the breadcrumb when the archive is a top-level page. |
| **ArchiveSidebar** | Controls slot | Beside the list in sidebar blocks (Grid column 1, span 3); above the list on base. Pills + Search (default) for card grids; Text List + Search for text or media rows. |
| **ArchivePagination** | `Type`, `Show Progress` | The way to older items. **Load More**: readers scroll; the default on mobile, for most feeds and grids. **Numbered**: each page needs its own link (sharing, search engines); large archives and directories. `Show Progress` adds an item count and progress bar. |

### Controls slot

The Controls slot in ArchiveHeader and ArchiveSidebar holds whatever narrows the list:

| Content type | Typical controls | Also common |
|---|---|---|
| Blog | Topic categories + Search | Filter + Sort for large archives; a link for short ones |
| Changelog | Product areas + Search | A year archive in the sidebar; a subscribe form |
| Customer Stories | Products + Search | Filters by company size, industry or product |
| Events & Webinars | Event types + Search | A next-event card with a countdown |

**Slot content isn't shared between xl and base.** Set it in both variants of the project block, or both instances on the page.

## Inside an archive block

Every archive block has a Container holding the navigation and the list:

- **Header slot** at the top of the Container, holding an ArchiveHeader. In Customer Stories archives the ArchiveHeader sits directly in the Container, without a slot.
- **Sidebar slot** in sidebar blocks: Grid column 1, span 3 (on base: row 1, span 12, above the list), holding an ArchiveSidebar. Already placed; don't add one by hand.
- **List**: rows or a Grid. A Grid is structural only (no padding or styling).
- **Below the list**: the place for an ArchivePagination, inside the same Container.

So a block is either a **header** block (navigation above the list) or a **sidebar** block (navigation beside it). Some highlight blocks, like carousels, carry no navigation.

## Composing an archive page

Order, after the Navbar. Only the list is required:

1. **Header**: an ArchiveHeader or ArchiveSidebar in the first block.
2. **Featured block** (optional): an Archive / Featured block of the same content type for the few items that matter most (newest post, major release, next event). Skip it on small archives; the list already starts with the newest item.
3. **List block**: every item, newest first.
4. **Pagination**: an ArchivePagination in the last block.
5. **CTA** (optional), then the Footer.

**Choose the list first**, by what readers scan; the featured block and the navigation follow from it:

| List kind | Use when |
|---|---|
| Text rows | Items read by title or date: posts, release notes, event listings, news |
| Thumbnail rows | Images help, but readers still go in order |
| Media rows | Fewer items, each with a strong image and a longer summary |
| Lead + rows | The newest item leads, the rest follow as rows |
| Card grid | Every item has an image or a logo, and readers browse |
| Bento | A short archive where one or two items lead |
| Sidebar version | Many categories, or an archive by year, that readers jump between |

**Featured block kinds:** Lead + cards (one main item, a row of supporting ones); Lead + feed (one main item, then the list continues in the same block; it can be the whole archive); Carousel (several equal highlights); Upcoming + on-demand (events: next events first, recordings after). A card-heavy featured block reads best above text or media rows; a text-led one above a card grid.

### Navigation rules

- **One header at the top, one pagination at the bottom**, whatever the number of blocks. When archive blocks stack, keep the header in the first block and empty the Header slot of the rest.
- **Show categories and search once.** With an ArchiveSidebar, remove the category row from the ArchiveHeader's Controls slot and make that header Vertical, or drop it.
- A sidebar block without an ArchiveHeader needs a Header block (from the Header page) above it for the page title.
- **Pagination** goes in the Container of the last archive block, below the list. Some blocks have it built in; where a block has none, add it in the **project block's** master (never the library block), in both variants. Skip it when the archive shows everything: a short bento, a carousel, a short changelog.
- For every archive component: set its variant, match `Breakpoint` to the block variant, set the instance to **Fill** width, and add no padding.
- Header and sidebar placement is decided by the block: to change it, choose another block. To add an ArchiveHeader above a block that has no Header slot (a carousel, a sidebar block), add it to the project block's Container above the Grid, in both variants.

### Example archives (stock Blog numbers)

- Simple blog: ArchiveHeader (Categories + Link) → `Blog / Archive / List / 09.` (card grid) → Load More.
- Magazine: ArchiveHeader (Categories + Filter + Sort) → `Blog / Archive / Featured / 03.` (lead + cards) → `Blog / Archive / List / 11.` → Numbered.
- Sidebar archive: `Blog / Archive / Featured / 08.` → `Blog / Archive / List / 10.` (ArchiveSidebar: Pills + Search) → Numbered.
- Changelog: ArchiveHeader (Product areas + Search) → a text-rows `Changelog / Archive / List` → Numbered.

## Composing a detail page

A post, release, story or event page is a **header and a body**. Start with the body: it decides whether a separate header is needed.

- **Complete bodies** carry their own header (breadcrumb, title, summary, meta, share). Use them alone.
- **Other bodies** have no header. Place a Header block of the same content type directly above.
- **Never put a Header above a body that already has one**: the title would show twice. If you want a separate Header with a complete body, hide the body's built-in header in the project block first.
- **Events** stack one to three Body blocks under an Event Header, each with one job: description and registration, agenda, speakers, recording, tickets or venue. Plan which job each body does, and whether the event is upcoming (registration) or on demand (recording).

**Body:** pick by length and by what the sidebar carries. Short items take a single column; long ones take a table of contents; items that should convert end with a subscribe form.

**Header:** pick by how much the image carries the story. Split (text beside image) is the default; stacked puts a long title first; text over image suits launches and big events; headers with numbers suit customer results, stats or an event countdown.

**Sidebar and article:**
- Sidebar groups (table of contents, share, author, details, category, subscribe, image, customer card, key results) are frames in the Body. Hide the ones you don't need on the instance; never detach.
- Fill the Rich Text slot with blocks from the Rich Text Editor page. Reading width is 768 (`max-w-3xl`); the slot gap spaces the blocks. The table of contents lists the article's H2 headings, so keep them short.
- After the body, close with related items from the content type's Featured page if it has one (Blog (Featured), Customer Stories (Featured)), then the Footer. Skip a newsletter CTA after a body that ends with a subscribe form or has one in its sidebar.

To tell complete bodies from header-less ones, read the block's description and check its top for a title and breadcrumb. In the stock Blog set, Body 01–03 are complete and 04–05 (long guides with a table of contents) need a Post Header above.

## Planning rows

Plan each content type as two pages: the archive (`CMS list.`) and one detail template (`CMS template.`). Suggested routes, unless the user's site uses others:

| Content type | Archive | Detail |
|---|---|---|
| Blog | `/blog` | `/blog/[slug]` |
| Changelog | `/changelog` | `/changelog/[slug]` |
| Customer Stories | `/customers` | `/customers/[slug]` |
| Events & Webinars | `/events` | `/events/[slug]` |

In the plan's sections column, name the archive components and their settings, e.g. `Blog / Archive / List / 09 (ArchiveHeader Horizontal: Categories + Link; ArchivePagination Load More)`. For events, list each Event Body and its job.

## Rules for both pages

- Build xl and base side by side and set `Breakpoint` on every block **and** every archive component.
- On base everything stacks in reading order: header images above the title, sidebars above the list, category pills scroll sideways, details and share below the article.
- Keep blocks and archive components as instances. Hide what you don't need; swap a block to change the structure.
- Change the number of posts, cards or rows in the project block master, in every variant.
- Edit labels and slot content on the instance. Never edit archive component variants on the Archive Components page or library blocks; changes there reach every content type.
