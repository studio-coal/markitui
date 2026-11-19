# Responsive variants: xl, base and optional md

Every MarkitUI page is designed at **xl** (1440 px canvas, desktop) and **base** (375 px, mobile). A project can add **md** (768 px, tablet). The user decides this at the start (SKILL.md, opening questions); never add md without a yes.

The file is ready for md:

- The **Breakpoint** component (Style Guide page) has `Breakpoint = xl | md | base`. Each variant sets its width from `layout/viewport-width` and switches the Custom collection to `breakpoint-xl`, `breakpoint-md` or `base`.
- The **Custom** collection has a `breakpoint-md` mode with tablet values for layout tokens (section padding, container, gutter) and Custom text styles.
- The **Theme** collection has `breakpoint/md` (768), which code uses for `md:` classes.

Library blocks only have `xl` and `base` variants. So md means adding an `md` variant to each **project block**, never to library blocks.

## When md is worth it

Offer md as optional and explain the trade-off in one line each:

| Choice | Means | Good for |
|---|---|---|
| **xl + base** (default) | Every block and page at desktop and mobile. Developers make tablet work from those two. | Most marketing sites and stores |
| **xl + md + base** | Every project block gets an md variant, and every page gets an md frame. About a third more design work. | Sites where tablet traffic matters, or where several layouts would look wrong squeezed or stretched at 768 (multi-column pricing, mega menus, product grids, comparison tables) |
| **md for some pages only** | md variants only for the blocks those pages use, md frames only for those pages | A key landing page or the store's product and collection pages |

## Adding an md variant to a project block (Phase 2)

Do this in the project block master, after its xl and base variants are final.

1. **Pick the starting variant.** Duplicate the variant whose layout is closer to what the block should do at 768:
   - start from **xl** when the block keeps columns side by side on tablet (card grids, logo rows, footers, pricing with 2–3 tiers, split heroes with a short text column);
   - start from **base** when the block should stack on tablet (long text beside media, tall split layouts, mega menus that become a drawer).
2. **Rename** the copy `Breakpoint=md` and move it between xl and base in the component set, so variants read xl, md, base.
3. **Set the Custom mode.** Set the variant's explicit mode for the Custom collection to `breakpoint-md`. Its width is bound to `layout/viewport-width`, so it resizes to 768 by itself; if it doesn't, bind the width to `layout/viewport-width` rather than typing 768. Layout tokens and Custom text styles then switch to their tablet values automatically.
4. **Adapt the layout**, keeping every value on variables:
   - card rows: 3 or 4 across at xl → usually 2 across at md (the last card spans or wraps); keep `layout/grid-gutter`
   - Section Title `split` → `stack` when the two halves get too narrow
   - media beside text: keep side by side if the text column is still at least about 320 wide, otherwise stack media above text as on base
   - navigation: keep the desktop navbar only if every item fits at 768 without wrapping; otherwise use the base navbar with the mobile menu
   - hide nothing that xl and base both show; content must be the same at all three breakpoints
5. **Base components** with their own `Breakpoint` variant (xl/base only) use `xl` in an md block, unless the base variant clearly fits better (for example a full-width mobile button row). Don't create md variants of base components.
6. **Flow blocks** (`Step` property): add md for every Step, so `Breakpoint=md, Step=…` exists for each step.

Check the md variant in a screenshot next to xl and base: no clipped text, no card narrower than its content, spacing consistent with the other two.

A block whose md would be identical to xl or base still needs its own `md` variant, because every block on an md page must switch the Custom mode to `breakpoint-md`. Duplicate the closer variant, set the mode, and leave the layout as is.

## Assembling md pages (Phase 3)

Build md after xl and base for each page:

1. **Duplicate the finished xl page** while it is still a Breakpoint instance (or insert a new Breakpoint instance and append the same project blocks in the same order).
2. **Switch the Breakpoint instance** to `Breakpoint = md`. The frame becomes 768 wide and the Custom mode `breakpoint-md`.
3. **Switch every block** in the Body Slot to `Breakpoint = md`. Overrides (copy, images, visibility, variants) carry over because it is the same instance; check each block's copy still matches xl and base.
4. **Detach** exactly as for xl and base (`composing.md`): blocks become direct children of the frame, the Body Slot is removed, and the frame keeps its explicit `breakpoint-md` mode.
5. **Name** it `{Page Name} / md` (flow steps: `{Page Name} / {Step} / md`) and place it in the page's Section between xl and base: xl at 64 / 64, md 128 to the right of xl, base 128 to the right of md.

If a block has no md variant yet, stop and add it to the project block first (above). Never leave an xl or base block inside an md frame: its Custom mode and width would be wrong.

## In code

The md frame is what developers and `markitui-generate-code` use for `md:` classes. Without it, they infer tablet from xl and base. The route annotation's third line names the breakpoints that exist (`handoff.md`).
