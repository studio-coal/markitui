# Reading the Figma design

## What a link can point to

Run `get_metadata` on the node first to see its type, name and children.

| Node | How to recognise it | What to build |
|---|---|---|
| Page frame | A frame named `{Page Name} / xl`, `/ md` or `/ base` (sometimes `{Category} - {Page Name} / xl`) whose children are block instances, usually inside a Section named after the page. A page still being composed is a Breakpoint component instance whose Body Slot holds the blocks: read the blocks from the slot | A page: see `pages.md` |
| Block instance | An instance of a component named like `Hero / Split / 03.`, `Pricing / 14.` or a project block `Acme / Hero / Split / 01.` | One block |
| Block component set | A component set with a `Breakpoint` property (`xl`, `base`, sometimes `md`) | One block, from its variants |
| Base component | A component on the Base Components or Shop Base Components page (Button, FeatureItem, ProductCard…) | Only its adaptation (see `base-components.md`) |
| Anything else | A plain frame or group | Ask the user what it should become, or treat it as one block if it has a section → container structure |

## Finding the xl, base (and md) frames

Always build from every breakpoint the design has. xl and base always exist; md (768 px, tablet) exists only when the project designed it.

- **Block component set:** its `Breakpoint=xl` and `Breakpoint=base` variants, plus `Breakpoint=md` if the set has one.
- **Block instance:** read its `Breakpoint` property, then find the instance of the same block in the other page frame (`Homepage / xl` ↔ `Homepage / base`, and `Homepage / md` when it exists), in the same position on the page. Instance overrides (copy, images, hidden parts) live on these instances, not on the component set, so read the instances.
- **Flow blocks** also have a `Step` property (for example `1 No size selected`, `2 Size selected`, `3 Added`). Read every step: they are the states of one interactive component.
- If one breakpoint is missing, build from the one you have, make a sensible responsive layout, and say so in the report.

## What to call, per frame

1. `get_screenshot`: the visual target. Never use it as an image in code.
2. `get_design_context` with `forceCode` if the result comes back as metadata only. If it is flagged as sparse, call it again on the visible child nodes in one parallel batch.
3. `get_variable_defs` on the same node: the variables and text styles actually bound. Use it to recover bindings the export drops (below).

Read the "Component descriptions" section of the `get_design_context` result. Every MarkitUI base component and block has a description; the "In code:" sentences tell you which element or shadcn/ui component to use.

## What the export gets wrong, and what to do

The export is a reference, not code to paste. These patterns come up in every MarkitUI block:

| Export shows | Meaning | Write instead |
|---|---|---|
| `w-[var(--viewport-width,1440px)]` on the block root | Figma-only mockup width | Nothing: a section is full width |
| `max-w-[1280px]` on `Container` | The Container's max width is bound to `layout/container-max-width`, but the export drops it | `max-w-(--container-max-width)` |
| `gap-x-[16px]` on a `Grid` | Grid gaps lose their variable in the export | Check `get_variable_defs`: `layout/grid-gutter` → `gap-x-(--grid-gutter)`; a `spacing/N` variable → `gap-x-N` |
| `gap-[var(--spacing\/3,12px)]`, `p-[var(--spacing\/0,0px)]` | A Tailwind CSS collection variable (`spacing/3`, `spacing/0`) | The Tailwind class: `gap-3`, `p-0` (or nothing for 0) |
| `rounded-[var(--border-radius\/rounded-full,9999px)]` | `border-radius/rounded-full` | `rounded-full` |
| `py-[var(--section-padding-y,64px)]` | A Custom layout token | `py-(--section-padding-y)` |
| `bg-[var(--color-bg-primary,white)]` | A semantic colour | `bg-bg-primary` |
| `font-[family-name:var(--headline-font-family,…)] … text-[length:var(--fontsize-headline-xl,48px)] tracking-[-1.44px]` | A text style, spelled out property by property | The text style class (see `class-translation.md`); the export lists the style names under "These styles are contained in the design" |
| `content-stretch`, `relative shrink-0`, `leading-[0]` wrappers, `min-w-px`, `[word-break:break-word]` | Export noise | Drop them |
| `absolute` children named `Fade Left` / `Fade Right` | Edge fades on a carousel or marquee | A gradient mask on the scroll container, not absolute boxes |
| `w-[528px]` and other fixed widths inside components | The size the component had in its master | Let the layout size it (`w-full`, grid column) |
| Image URLs `https://www.figma.com/api/mcp/asset/…` | Temporary download links (expire after 7 days) | Download each file into the project (see `icons-and-media.md`) |

## Hidden layers

A hidden layer in a block is almost always a state:

- `Tab Panel 2`, `Tab Panel 3`… → the other panels of a Tabs component.
- `Accordion Content` in closed items → the collapsed content of an accordion.
- A `Drawer`, `Backdrop`, `Quick View` or `Sticky Bar` in flow blocks → overlay or sticky states.
- Hidden parts toggled by a `Show …` property → optional content that this instance doesn't use. Leave these out.

Build states as real interactions. Read the hidden layer's content through `get_design_context` on that layer's node ID when you need it.

## Text content

- Use the text exactly as it appears on the instance (copy, prices, dates). Layer names and component defaults are not the content.
- Rich Text Editor (RTE) blocks hold real content with inline marks (strong, emphasis, link, code) that have no text styles of their own. Render them as `<strong>`, `<em>`, `<a>`, `<code>` inside the paragraph.
