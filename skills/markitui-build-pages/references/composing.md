# Composing pages (Phase 3)

## For each page

1. **xl.** Insert an instance of the **Breakpoint** component (Style Guide page) and set `Breakpoint = xl`. The instance sets the frame width from `layout/viewport-width` and switches the Custom variable collection to the matching mode, so layout tokens and Custom text styles update automatically. Append the project block instances with `Breakpoint = xl` to its Body Slot in plan order: navbar first, footer last. Then set the instance overrides (copy, images, visibility, variants).
2. **base.** Duplicate the xl page, switch the Breakpoint instance to `base`, and switch every block's `Breakpoint` to `base`. Blocks keep their content and overrides. Don't rebuild.
3. **md (optional).** Only when the user chose md: duplicate the xl page again, set `Breakpoint = md`, and switch every block to its `md` variant. Full steps in `responsive.md`.
4. **Detach.** Detach the Breakpoint instance, move the blocks out of the Body Slot into the page frame, and delete the slot, so the tree reads page → sections with no wrapper. Check the frame still has its explicit Custom collection mode (`breakpoint-xl`, `breakpoint-md` or `base`); set it if missing.
5. **Name** the frames `{Page Name} / xl`, `{Page Name} / base` (and `{Page Name} / md`). Pages grouped under a parent use `{Category} - {Page Name} / {breakpoint}` (e.g. `Products - Corporate Cards / xl`).
6. **Wrap** the frames in a Figma Section named after the page: xl at 64 / 64 inside the Section, then md (if any) and base, each 128 to the right of the previous frame, 64 padding around them.

Blocks stay attached instances with their component names, and each block's Breakpoint matches its frame. This page shape (detached frame, block instances as direct children) is what developers and the generate-code skill expect.

## Flow pages

Flow blocks (`{Category} / Flow / {Number}.`) have a `Step` property. Set each page's flow block to the Step from the plan. To show a full journey, duplicate the page frame for each further step and switch the Step on each copy, naming them `{Page Name} / {Step} / xl` (e.g. `Product / Size selected / xl`), and the same for base and md.

## Canvas layout

On the build page, top to bottom:

1. **Navigation** row: navbar and menu component sets, then the opened-menu frames and the mobile menu.
2. **Project block components** row: globals first, then section blocks in the order they first appear in the plan.
3. **Pages** row: page Sections left to right in journey order (Home first), 272 apart.

Row labels are Figma Sections 64 tall spanning the row. Content sits 464 below its label, and each label sits 3,200 below the tallest item of the row above.
