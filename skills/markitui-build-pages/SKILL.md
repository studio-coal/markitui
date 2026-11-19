---
name: markitui-build-pages
description: >-
  Build website or online store pages in your own copy of the MarkitUI Figma
  file from library blocks: a page plan for approval, project blocks, then
  xl and base page frames (plus optional md tablet frames) with handoff notes
  for developers. Use whenever
  someone wants to design, compose, plan or build pages, a sitemap, a landing
  page or a store in MarkitUI ("build our homepage", "make pages for these
  routes", "create a pricing page", "turn this sitemap into pages"), and when
  they want to rebuild or redesign an existing website in MarkitUI ("rebuild
  acme.com in MarkitUI", "redesign our current site with these blocks"), even
  if they do not say "MarkitUI".
---

# MarkitUI: build pages

Turn a brief, a sitemap, a page list, a reference website or an existing website into finished pages in the user's MarkitUI Figma file. The flow is always:

library block → project block → page composed in a Breakpoint component → detached `{Page} / xl` and `{Page} / base` frames (and `{Page} / md` if the user wants tablet) in one Section per page → handoff notes.

The file's own documentation is the source of truth. At the start of every run, read the **Composing pages**, **Layout** and **Breakpoints** doc frames on the Documentation page, and the **Navigation** doc frame for the list of block categories. If anything in this skill disagrees with them, follow the file.

## Before you start

- Work only in the user's own copy of MarkitUI. Ask for its Figma link if you don't have it.
- Writing to Figma needs the Figma MCP server with write access. Load the Figma MCP's guidance for writing to files (its `figma-use` skill) before the first edit, and create a session first if the server asks for one.
- Switch Figma pages at most once per script. Find pages, components and variable collections by name, not by ID.
- Library blocks and base components are final. Never edit them to make a page work. If something can't be done with a block as it is, tell the user and ask.

## Opening questions

Before any planning, ask what the user's prompt doesn't already make clear, in **one** message (use multiple-choice questions where the interface offers them). Skip a question only when the prompt answers it unambiguously.

1. **What should the pages be built from?**
   - a brief or description of the business
   - a sitemap or page list
   - a reference website to follow (structure only, new copy)
   - their existing website to rebuild (keeps their copy)
   - anything else they have: screenshots, a document, competitor sites, a wireframe
2. **Responsive variants:** how many breakpoint variants should each block and page have?
   - **xl + base** (desktop and mobile; default, library blocks are ready)
   - **xl + md + base** (adds tablet: an md variant in every project block and an md frame for every page)
   - **md for some pages only** (they name the pages)

   Give the one-line trade-off from `references/responsive.md`. Never add md without a yes.
3. **Project name**, used in every component name (e.g. `Acme`).
4. **Site type:** marketing website, online store, or both.
5. **Where to build:** a new Figma page in the file (e.g. `↳ Acme Pages`) unless the user names one.
6. **Copy:** the user's real copy, copy written in the style of a reference site, or believable placeholder copy.
7. **For stores:** country, currency and number format, VAT or sales tax rate.

Then collect what the chosen source needs: the brief, the sitemap, or the website URL (and for a reference or existing site, read `references/existing-site.md`).

Use project blocks by default. Use library blocks directly only if the user asks for a quick prototype or a single landing page.

## Workflow

**Phase 1: Page plan (stop for approval).** Read `references/page-planning.md`. The plan states the breakpoints the user chose. Inventory the library, choose blocks for each page, and present the plan table. When the input is an existing website to rebuild, read `references/existing-site.md` first; it produces the same plan. **Stop and wait** for approval or changes.

**Phase 2: Project blocks.** Read `references/project-blocks.md`. Clone each chosen library block into a project block, rename it, and adapt it in the master. Build the navbar, menus and footer as project blocks too. If the user chose md, read `references/responsive.md` and add an md variant to every project block the md pages use.

**Phase 3: Compose the pages.** Read `references/composing.md` and `references/content.md`. Build each page at xl in a Breakpoint component, duplicate it for base (and md, following `references/responsive.md`), detach, name, wrap in a Section, and lay out the canvas.

**Phase 4: Handoff notes.** Read `references/handoff.md`. Add the route annotation to every xl frame and behaviour and content annotations where a static frame can't show what happens.

**Check and report.** Read `references/checks.md`. Run the script checks, screenshot every page at every breakpoint it has, fix what you find, then report.

## Reference files: read each one when its phase comes up

- `references/page-planning.md`: page anatomy, choosing blocks, the plan table. Phase 1.
- `references/existing-site.md`: rebuilding an existing website. Phase 1, when the input is a live site.
- `references/project-blocks.md`: cloning, naming, what to change in the master, design rules. Phase 2.
- `references/responsive.md`: the md option, adding md variants to project blocks, assembling md pages with the Breakpoint component. Opening questions, Phase 2 and Phase 3, when md is chosen.
- `references/composing.md`: Breakpoint component, xl and base, detaching, naming, canvas layout. Phase 3.
- `references/content.md`: copy, store data, dates, images. Phase 3.
- `references/handoff.md`: annotation formats developers and the generate-code skill rely on. Phase 4.
- `references/checks.md`: audit, screenshots and the report. Last.

## Non-negotiables

- Ask the opening questions the prompt doesn't answer, including responsive variants, before planning.
- Stop after the plan and wait for approval. Never build pages from an unapproved plan.
- Never edit library blocks or base components; all changes go into project blocks or instance overrides.
- Every page has an xl and a base frame (and an md frame if chosen) built from the same blocks, and each block's Breakpoint matches its frame.
- Everything stays on MarkitUI variables and text styles. No raw colours, spacing, radii or font settings.
- Real or believable copy, never Lorem ipsum. No real brand names or logos that aren't the user's.
- Every xl frame gets a route annotation in the exact format in `references/handoff.md`.
