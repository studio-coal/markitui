---
name: markitui-generate-code
description: >-
  Turn MarkitUI Figma designs into production code: a single block, several
  blocks, or a whole page, as responsive React + Tailwind CSS v4 components
  built on shadcn/ui and the project's MarkitUI tokens. Use whenever someone
  wants to implement, build, code up or convert a MarkitUI frame, block, section
  or page ("turn this page into code", "build this hero", "implement this Figma
  block", "make this design real", a pasted figma.com link with a request for
  code), even if they do not say "MarkitUI". Prefer this over generic
  design-to-code: it merges the xl, base (and md, when designed) frames into
  one mobile-first component, decides which parts deserve their own components, keeps every value on MarkitUI tokens and text styles, and styles
  each shadcn/ui component once from its Figma master so blocks reuse it.
---

# MarkitUI: generate code from Figma

Build MarkitUI designs as code that matches Figma at every designed breakpoint, uses the project's MarkitUI tokens for every value, and reuses one styled set of base components. Figma is the source of truth; this skill never writes to Figma.

What carries this skill:

1. **Blocks are the unit.** A page is a stack of blocks; a block is one section component. Build blocks, then compose pages from them.
2. **Every breakpoint, one component.** Every MarkitUI block has a Breakpoint=xl (desktop) and Breakpoint=base (mobile) design, and some projects add Breakpoint=md (tablet). Read every breakpoint the design has and write one mobile-first component, never one per breakpoint.
3. **Tokens, never values.** Colours, spacing, radius, type and effects come from MarkitUI tokens synced by `markitui-import-variables`. Figma's export often loses bindings or prints raw numbers; recover the token instead of copying the number.
4. **Judge component boundaries.** Figma's components are not always the right code components. Repeated cards and panels that are plain frames in Figma usually become components; thin Figma helpers usually become plain markup.
5. **Style base components once.** MarkitUI base components are pre-styled shadcn/ui components. The first time a block needs one, install it from shadcn/ui, restyle it from its Figma master and mark it as adapted. Every block after that reuses it.

## Prerequisites

- The Figma MCP server is connected. Before calling `get_design_context`, load Figma's `figma-design-to-code` guidance if it is available.
- A link to the frame, block or page in the user's MarkitUI file.
- A React project with Tailwind CSS v4 and shadcn/ui (Base UI or Radix flavour). Next.js, Vite, React Router, TanStack Start and Astro (React integration) all work.
- The project's stylesheet contains the `markitui:tokens` region from the `markitui-import-variables` skill. If it doesn't, run that skill first.

## Workflow

1. **Preflight the project.** Read `references/project-setup.md`. Confirm the stack, Tailwind v4, shadcn/ui and its flavour, the `markitui:tokens` region (and the typography system in its header), fonts and the icon package. Fix what is missing before generating anything; missing tokens or fonts are the main reason output looks wrong.

2. **Identify what was linked.** Read `references/reading-figma.md`. A link can point to a page frame (`{Page} / xl` or `/ base`, holding block instances), a single block instance, a block component set, or a base component. Find the matching xl and base frames (and md, if the design has one) before reading anything else.

3. **Read the design at every breakpoint.** For each frame: a screenshot, `get_design_context` (high fidelity), and `get_variable_defs` to recover bindings the export drops. Note hidden layers, component instances, text styles and assets.

4. **Run the component pass.** Read `references/base-components.md` and `references/component-boundaries.md`. List every base component instance in the target, and every repeated or self-contained part that isn't a Figma component; decide which become code components and which stay inline. For each one not yet adapted in the project, adapt it once (shadcn/ui component restyled from the Figma master, or a local MarkitUI component when there is no shadcn/ui equivalent). Reuse adapted components as they are.

5. **Build each block.** Read `references/class-translation.md` before writing any `className`, and `references/icons-and-media.md` when the block has icons, images or video. Translate the structure (section → container → grid → content), merge xl, base and md (if present) into responsive classes, use the components decided in step 4, map every value to a token, use the right text style classes, and build hidden states as real interactions.

6. **Compose the page** (only when a page was linked). Read `references/pages.md`. Create the route, place blocks in order with the real copy and images from the design, and add the navbar and footer.

7. **Check and report.** Run the checklist in `references/output-checklist.md`, build or start the project, and compare the result at 375px and 1440px (and 768px when there is an md design) with the Figma screenshots. Report the files created, base components adapted, component boundary decisions, assets downloaded, anything you could not match and why, and the commands the user needs to run.

## Reference files: read each one when its step comes up

- `references/project-setup.md`: preflight checks, folder layout, naming. Step 1.
- `references/reading-figma.md`: finding xl/base pairs, what to call, what the export gets wrong. Steps 2–3.
- `references/base-components.md`: Figma component → shadcn/ui mapping, property → prop rules, the one-time adaptation process. Step 4.
- `references/component-boundaries.md`: which Figma parts become code components (repeated cards, panels) and which Figma components stay plain markup. Step 4, and while building each block.
- `references/class-translation.md`: export classes → MarkitUI Tailwind classes, layout structure, responsive merge, typography, colours, effects. Step 5, before writing any `className`.
- `references/icons-and-media.md`: icon libraries, images, video, logos, downloading assets. Step 5, when a block has any.
- `references/pages.md`: page frames, routes, block order, real content, navigation, flows. Step 6.
- `references/output-checklist.md`: the self-review before returning code. Step 7.

## Non-negotiables

- Read every breakpoint the design has. One component per block, mobile-first, with responsive classes for the md and xl layouts.
- Component boundaries follow good code structure, not Figma's layer structure. Report every boundary decision.
- No hard-coded colours, no arbitrary pixel values, no copied export classes. Every value maps to a MarkitUI token, a Tailwind scale step or a `type-*` text style. If nothing fits, flag it; don't invent a value.
- Reuse adapted base components. Never restyle a shadcn/ui component inside a block with one-off classes to make it match.
- Ship the design's real copy and images. Placeholder text, default sample content or the image placeholder glyph left in the output means the build is not done, unless the design itself still uses a placeholder (then say so in the report).
- Hidden layers are usually states (other tabs, closed accordion panels, flow steps). Build them as interactions; don't delete them, and don't render them all at once.
- Ignore Figma-only values: the block's `--viewport-width`, fixed frame widths and absolute positions that only exist to lay out the mockup.
- Never write to Figma, and never edit the `markitui:tokens` region by hand; token changes go through `markitui-import-variables`.
