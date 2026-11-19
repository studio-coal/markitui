# Icons and media

## Icons

MarkitUI places icons through IconPlaceholder: the visible icon is the component swapped into its Icon property. The swapped component's name tells you which library it comes from. The export shows it as the layer's `data-name` (for example `data-name="Lucide/Check"`) and lists its description.

| Swapped component | In code |
|---|---|
| `Lucide/<Name>` (MarkitUI's default set) | The lucide-react component with the same name: `Lucide/ArrowRight` → `import { ArrowRight } from "lucide-react"`. In Astro `.astro` files, use the Lucide package for Astro if the project has it |
| A designer-added library with a recognisable prefix (`Phosphor/…`, `Tabler/…`, `Heroicons/…`, `Remix/…`) | That library's React package, if the project has it installed; check `components.json` `iconLibrary` too. If it isn't installed, ask before adding it, or export the SVGs (next row) |
| MarkitUI's own icons (`Icon / Social / …`, `Icon / Payment / …`, `Icon / Delivery / …`, `Icon / AI / …`) and any icon with no matching package | Export the SVG and make a local icon component in `components/icons/` (one per icon, named after the Figma component). Reuse it wherever the same icon appears |
| `IconPlaceholder` still showing the neutral placeholder glyph | The designer hasn't picked an icon. Use a sensible Lucide icon only if the meaning is obvious from the text; otherwise leave a clearly named placeholder and list it in the report |

Rules:

- Size icons with the Tailwind size step from the design (`size-4`, `size-5`), and colour them with text colour tokens (`text-fg-secondary`) through `currentColor`.
- Decorative icons get `aria-hidden="true"`; icon-only buttons need an `aria-label` (or a visually hidden label).
- Never redraw, simplify or trace an icon. Use the package component or the exported SVG as it is.

## Exporting SVGs

`get_design_context` returns temporary asset URLs for SVGs and images. Download each into the project (for example `curl -L -o public/images/… "<url>"`), then reference the local file. The URLs expire after 7 days, so never leave them in code. Keep the SVG's own `width`, `height` and `viewBox`; for icons, convert the SVG into a component and replace fixed fills with `currentColor` only when the icon is single-colour.

## Images

| In Figma | In code |
|---|---|
| AspectRatio with an image | The adapted AspectRatio (`ratio={16 / 9}` for `16:9`, `ratio={3 / 4}`…) containing an `<img>` or the framework image component (`next/image`) with `object-cover` and a meaningful `alt` |
| AspectRatio still showing ImagePlaceholder | The designer hasn't added an image. Don't ship the placeholder glyph: render an empty `bg-bg-tertiary` box at the right ratio, mark it with a `TODO` comment, and list it in the report |
| An image in a frame's fill (hero backgrounds, image cards) | An `<img>` covering the element (`absolute inset-0 size-full object-cover`), with the overlay layer above it (`bg-bg-overlay` when text sits on the image) |
| VideoPlaceholder | `<video>` (with `poster`, `muted`, `playsInline`, and `autoPlay loop` only when the design implies a background video) or the provider's embed, inside the AspectRatio |

- Download every real image the design uses (`get_design_context` returns one flattened URL per `<img>`). Name files after where they appear: `public/images/home/hero.jpg`, `public/images/pricing/team-photo.jpg`.
- If an image cannot be downloaded, say so in the report; never substitute a stock or generated image silently.
- Alt text: describe the image's content in the context of the page; decorative images get `alt=""`.
- Prefer the framework's image component (`next/image`, Astro `<Image />`) when the project already uses it.

## Logos

- `Logo` with `Type=Brand` is the site's own logo (navbar, footer): export it as SVG once and make a `Logo` component.
- `Logo` with `Type=Customer` is a customer or partner logo in logo walls and testimonials: export each as SVG or image with the company name as `alt`.
- Placeholder logos (the stock vectors) stay placeholders only if the design still uses them; list them in the report.
