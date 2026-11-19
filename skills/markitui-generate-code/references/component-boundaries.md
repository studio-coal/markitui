# Component boundaries: Figma structure is not code structure

Figma components exist to make designing easy; code components exist to make the code reusable and readable. The two often line up, but not always. Decide each boundary on its merits, as a developer would, then report the decisions.

Two mistakes to avoid:

- **Missing components.** Many repeated parts are plain frames in Figma, not components: the cards in a pricing block, feature cards, testimonial cards, team members, stat tiles, the panel in a CTA or header block. They should usually be components in code.
- **Too many components.** Some Figma components are design scaffolding or thin wrappers. Turning each into a code component adds files and props without adding reuse.

Do this when listing the base components (SKILL.md step 4) and again while building each block (step 5).

## Make it a component in code (even if it isn't one in Figma)

A group of layers should become a component when **any** of these is true:

| Signal | Examples |
|---|---|
| It repeats inside the block with the same structure and different content | Pricing tiers, feature cards, testimonials, team members, stats, FAQ items, logo tiles, product cards in a custom grid |
| The same structure appears in two or more blocks | A card style shared by a Feature block and a Blog block; a CTA panel reused across pages |
| It has its own behaviour or state | A plan card with a monthly/yearly price, an expandable card, a card with a selected state |
| It is a self-contained unit inside a large block | A pricing card with header, price, feature list and button; a form panel; a media panel with an overlay caption |

How to build it:

1. **Check what already exists first.** The part may be an existing base component in disguise (a feature card is often FeatureItem plus a container; a testimonial often uses Author). Reuse it inside the new component instead of rebuilding it.
2. **Name it by role**, never by layer name: `Frame 412` → `PricingCard`, `Card` in a team block → `TeamMemberCard`.
3. **Props from the differences.** Compare the repeated copies: whatever differs (text, image, price, highlighted tier, icon) becomes a prop, and whatever is the same stays in the component. A visibly different copy (the "most popular" tier with an accent border) is a prop such as `highlighted`, not a second component.
4. **Render from data.** The block maps an array of items to the component (`tiers.map(tier => <PricingCard key={tier.name} {...tier} />)`), and the page passes the array as a prop (see `pages.md`).
5. **Where it lives:**
   - Used by one block only → define it in the block's file, below the block component (not exported), or as `components/blocks/<block>/<part>.tsx` if the block file gets long.
   - Used by two or more blocks → `components/markitui/<kebab-name>.tsx`, exported, with the marker comment noting it has no Figma component: `// markitui: from repeated frames in "Pricing / 14." (no Figma component) on <date>`.
6. Keep its styling on tokens exactly as for any block (`class-translation.md`). The visual result doesn't change; only the boundaries do. Cards and panels that bind `rounded-main` in Figma keep `rounded-main`.

## Keep it inline (even if it is a component in Figma)

Don't create a code component for these. Write the plain element or use what the description's "In code:" line says:

| Figma component | In code |
|---|---|
| Breakpoint (and its Body Slot) | Nothing. It is the page canvas; the breakpoint becomes responsive classes. |
| ImagePlaceholder, VideoPlaceholder | The image or video itself (`<img>`, the framework's image component, `<video>`) with an `aspect-*` class |
| IconPlaceholder, Icon | The icon import (`icons-and-media.md`) |
| List, simple ListItem | `<ul>` / `<li>` with classes, unless ListItem carries an icon and styling used in several blocks |
| Logo (a single image) | `<img>` or the framework's image component |
| Breakpoint variants of one component (`Breakpoint=xl`, `base`, `md`) | One component with responsive classes, never one per breakpoint |
| Nested helper components that only exist to build a bigger component in Figma (`… / Content`, `… / Header`, `_Base` parts) | Markup inside the parent component |
| A component used once, with trivial markup and no state | Inline markup in the block |

Base components that map to shadcn/ui (`base-components.md`) are always components: use the adapted shadcn/ui component.

## Rule of thumb

Ask: "If a developer changed this part, would they want the change to happen everywhere it appears?" Yes → component. Also: "Does wrapping this in a component make the block easier to read?" Yes → component, even if it appears once. No to both → inline.

When unsure and the part repeats, prefer a component: it is cheaper to inline later than to find and merge copies.

## Report

List the boundary decisions in the final report, one line each:

| Figma | Code | Why |
|---|---|---|
| 3 frames `Tier` in `Pricing / 14.` (not a component) | `PricingCard` in `pricing-14.tsx` | Repeats 3× with different content; `highlighted` prop for the middle tier |
| `ImagePlaceholder` | `<Image>` inline | Thin wrapper around one image |
| Card frames in `Feature / Grid / 02.` and `Blog / Grid / 01.` | `ContentCard` in `components/markitui/content-card.tsx` | Same structure in two blocks |

If the same part should be a component in Figma too (it repeats but isn't one), mention it as a suggestion for the design file. Never change Figma yourself.
