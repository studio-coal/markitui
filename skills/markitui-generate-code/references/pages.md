# Pages

A MarkitUI page is a set of frames (`{Page Name} / xl` and `{Page Name} / base`, plus `{Page Name} / md` when the project designs tablet), usually side by side in a Section named after the page. Each frame is a stack of block instances, top to bottom: navbar, sections, footer. (While a page is still being composed, the blocks sit in the Body Slot of a Breakpoint component instance instead; read them from there.) Build the blocks, then a route that renders them in order.

## Steps

1. **List the blocks.** Read the children of every frame (or their Body Slot) with `get_metadata`. Pair blocks by position: the first block in `Homepage / xl` with the first in `Homepage / base` (and `Homepage / md`), and so on. If the order or number differs between the frames, stop and ask which is right.
2. **Group by component.** Several instances of the same block on one page (two Logos blocks, three CTA blocks) share one block component; each instance becomes its own usage with its own content.
3. **Build or reuse each block component** (SKILL.md step 5). A block already built for another page is reused, never copied.
4. **Extract the real content of every instance.** Use `get_design_context` on each instance in the page frame (not on the library component): copy, links, images, which optional parts are shown, which variant is used. Layer names and component defaults are not the content.
5. **Write the route.** First read the xl frame's annotations: a Development annotation like `Route: /pricing` with the data source (`Static page`, `CMS list`…) is the source of truth. Without one, derive the route from the page name: `Homepage` → `/`, `Pricing` → `/pricing`, `Products - Corporate Cards` → `/products/corporate-cards` (the part before ` - ` is the parent path). Follow the framework's routing conventions.
6. **Pass content as props.** The route file holds the page's content and renders `<Navbar />`, the blocks in order, and `<Footer />`. Blocks take typed props for their content (heading, items, images); they never hard-code page copy, so the same block can serve several pages.

```tsx
export default function HomePage() {
  return (
    <>
      <HeroSplit01 heading="Ship your site faster" description="…" image={{ src: "/images/home/hero.jpg", alt: "…" }} />
      <LogosMarquee02 logos={customerLogos} />
      <FeatureStack05 eyebrow="Features" heading="…" items={features} />
      <Cta03 heading="…" primaryAction={{ label: "Start free", href: "/signup" }} />
    </>
  )
}
```

If the project uses a layout file for navbar and footer, put them there instead of in each page.

## Navbar and footer

- **Navbar.** Navbar blocks combine a bar with NavigationMenu content (dropdowns, mega menus) on xl and a mobile menu on base. Build the desktop menu with the adapted shadcn/ui NavigationMenu. The mobile menu component the design uses decides the pattern: `NavigationMenu / Mobile / Dropdown` → a full-width panel under the bar, `… / Drilldown` → a Sheet with nested screens (`Screen=Root|Submenu`), `… / Direct Links` → a simple list of links. Opened menu states in the design (`Open=True`, `Expanded=True`) show what the open menu looks like.
- **Footer.** Link columns (LinkGroup), newsletter (CTAForm), legal row and social icons. Footers are mostly static; keep them server-rendered.
- Navbar and footer go in the layout when every page uses the same ones.

## Flow blocks (shop)

Flow blocks (`{Category} / Flow / {Number}.`) show one interaction across `Step` variants: choosing a size, adding to bag, a size guide drawer, checkout steps. Build one interactive component whose state moves through the steps; don't render each step as a separate section. Use the matching shadcn/ui pieces (Sheet for drawers, Dialog for modals) and keep the form fields and prices from the design.

## Content quality

- Headline hierarchy across the page: one `h1` (the first block's main heading), `h2` for each block's Section Title, `h3` inside cards.
- Links: use the URLs the design or the user gives you. Where the design shows a link without a destination, use `#` and list it in the report.
- E-commerce data (prices, currency, sizes, stock) comes from the design for now; say in the report where it should later come from the store's data.
