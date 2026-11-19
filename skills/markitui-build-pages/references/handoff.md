# Handoff notes (Phase 4)

Annotations tell developers, and the `markitui-generate-code` skill, what a static frame can't show. Use the file's existing annotation categories: **Development**, **Interaction**, **Accessibility**, **Content**. Keep the exact formats below; generate-code reads them.

## Route annotation (every xl frame, category Development)

Attach to the xl page frame:

```
Route: /pricing
Static page.
xl and base are one responsive page in code.
```

- Line 1: `Route: ` and the route from the plan (`/`, `/pricing`, `/blog/[slug]`).
- Line 2: the data source: `Static page.`, `CMS list.`, `CMS template.` or `Store data.`
- Line 3: always `xl and base are one responsive page in code.`, or `xl, md and base are one responsive page in code.` when the page has an md frame.

Add this once, on the first page's xl frame, as a fourth line: `Navbar and footer live in the shared layout.`

## Behaviour annotations (category Interaction)

Attach to the block or element whose behaviour isn't visible in a static frame. One short sentence each:

- Menus: "Opens the Product mega menu on hover and focus; see Navbar / Product Menu Opened."
- Tabs and Megatabs: "Tabs switch the panel below; Megatabs advance every 6 s and pause on hover."
- Carousels: "Swipe on mobile; arrows and dots on desktop."
- Accordions: "One item open at a time; first item open by default."
- Pricing toggles: "Monthly/Annually switches all plan prices."
- Filters, variant pickers, quantity steppers, cart and checkout steps, forms (fields, validation, success state), CMS lists (sort order, page size).

## Content annotations (category Content)

- Placeholders the user still has to supply: "Image placeholder: team photo needed."
- Copy to confirm: "Plan prices are examples; confirm before launch."

## Accessibility annotations (category Accessibility)

Only where the design needs a decision a developer can't make alone: an icon-only button's label, alt text for meaningful images when it isn't obvious, the reading order of a complex layout.

## Ready for dev

Mark a page Ready for dev only when the user says it's final.
