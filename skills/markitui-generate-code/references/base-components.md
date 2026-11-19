# Base components

MarkitUI's base components are pre-styled. Most map to a shadcn/ui component; the rest are MarkitUI's own. Both kinds are adapted **once per project** from their Figma master, then reused by every block.

## Is it already adapted?

Search the project for the marker comment at the top of component files:

```tsx
// markitui: adapted from Figma "Button" (node 444:177) on 2026-11-18
```

- Marker present → import and use the component as it is. Don't restyle it inside blocks.
- No marker → adapt it now (below), then continue with the block.
- If the user changed the component in Figma since the marker's date, re-adapt only when they ask.

## Figma → code mapping

Each base component's description says `Shadcn/UI: maps to …` or `MarkitUI component (no shadcn/ui equivalent)`. That line is the source of truth; this table is the stock mapping.

| Figma component | shadcn/ui component(s) |
|---|---|
| Button | Button |
| Badge | Badge |
| Alert | Alert, AlertTitle, AlertDescription, AlertAction |
| Accordion, AccordionItem | Accordion, AccordionItem, AccordionTrigger, AccordionContent |
| Tabs, TabTrigger | Tabs, TabsList, TabsTrigger, TabsContent |
| Breadcrumb, BreadcrumbItem | Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbEllipsis |
| Pagination, PaginationItem | Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis |
| CarouselControl | CarouselPrevious, CarouselNext (inside Carousel) |
| Avatar, AvatarGroup | Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount |
| AspectRatio | AspectRatio |
| Separator | Separator |
| Input, InputGroup, Textarea | Input; InputGroup, InputGroupInput, InputGroupAddon; Textarea |
| Field, CheckboxGroup | Field, FieldLabel, FieldDescription, FieldError, FieldGroup |
| Checkbox, RadioGroup, RadioGroupItem, Switch | Checkbox; RadioGroup, RadioGroupItem; Switch |
| Select, SelectItem, SelectLabel, SelectContent | Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectLabel |
| Slider, SliderThumb | Slider |
| Tooltip | Tooltip, TooltipTrigger, TooltipContent |
| Toast | Sonner (`Toaster` + `toast`) |
| TableCell | Table, TableCell (and the other Table parts the block uses) |
| Navbar menus (NavigationMenu blocks) | NavigationMenu; Sheet or Collapsible for mobile menus (see `pages.md`) |

MarkitUI-only components (no shadcn/ui equivalent) become local components in `components/markitui/`: Section Title, Eyebrow, EyebrowBanner, CTAButtonGroup, CTAForm, FeatureItem, ListItem, List, Statistic, DateTile, Author, Logo, Link, LinkGroup, Icon, IconPlaceholder, MegaTabList, MegaTabTrigger, CarouselPagination, CarouselPaginationItem, ImagePlaceholder, VideoPlaceholder, and the shop components (ProductCard, Price, Rating, ColorSwatch, SizeOption, QuantityStepper, CartLineItem, ShippingProgress, ServiceItem, LocaleSelector, Shop Section Title). Their descriptions say what element to use ("In code: an `<li>` …"); follow that.

Some MarkitUI-only components are thin and better as plain markup inside the block than as a component: IconPlaceholder (just the icon), ImagePlaceholder and VideoPlaceholder (the image or video itself), List (a `<ul>`). Use judgement: make a component when two or more blocks share it.

## Property → prop rules

| Figma property | In code |
|---|---|
| `Variant` | `variant` prop. Values in lowercase kebab-case: `Default` → `default`, `Accent` → `accent` |
| `Size` | `size` prop: `Default` → `default`, `sm`, `lg`, `Icon` → `icon`, `Icon sm` → `icon-sm` |
| `Type`, `Layout`, `Align`, `Orientation`, `Side`, `Ratio` | A prop with the same meaning (`orientation`, `side`, `ratio={16 / 9}`), or the shadcn/ui prop that already exists |
| `State` (`Hover`, `Pressed`, `Focus`, `Disabled`, `Invalid`, `Filled`) | Never a prop. Styles for the matching state: `hover:`, `active:`, `focus-visible:`, `disabled:`, `aria-invalid:`. `Filled` needs no style (it shows a value) |
| `Active`, `Checked`, `Open`, `Selected` | The component's own state, styled through the data attributes the installed shadcn/ui file already uses. Read the file; never invent attribute names (Base UI and Radix use different ones) |
| `Breakpoint` (`xl`, `base`) | Not a prop: responsive classes (see `class-translation.md`) |
| `Show …` booleans | Optional parts: render when the prop or child is present |
| TEXT properties (`Label`, `Title`, `Description`) | `children` or a text prop, following shadcn/ui's API |
| INSTANCE_SWAP icons (`Left Icon`, `Right Icon`, `Icon`, `Media`) | An icon as a child (`<Button><ArrowRight /> Label</Button>`) or a node prop |
| SLOT (`Items`, `Accordion Items`, `Body`) | `children` |

## Adapting a shadcn/ui component (once)

1. **Install** it with the project's package manager: `npx shadcn@latest add button` (the CLI picks the Base UI or Radix flavour from `components.json`).
2. **Read the whole Figma component set**: `get_design_context` on the component set, and on representative variants if the result is sparse; `get_variable_defs` for its bindings. Note every variant, size and state, and which tokens each uses.
3. **Restyle the installed file in place.** Keep shadcn/ui's structure, exports, props and accessibility. Replace its default classes with MarkitUI classes so each variant and size matches Figma (see `class-translation.md` for every token). Typical changes for Button:
   - radius `rounded-full` (Button and Input bind `rounded-full` in Figma), height and padding from the size variants;
   - colours per variant: `default` → `bg-interactive-primary text-fg-on-primary hover:bg-interactive-primary-hover active:bg-interactive-primary-active`, `secondary` → the `interactive-secondary` set, `destructive` → the `interactive-destructive` set;
   - add Figma-only variants: `accent` → `bg-interactive-accent text-fg-on-accent hover:bg-interactive-accent-hover …`;
   - label text style (`type-label-sm-semibold`) and icon size;
   - focus: `focus-visible:shadow-focus-ring-default` instead of shadcn/ui's ring classes; disabled from Figma's Disabled state.
4. **Variant list = Figma's.** Variants and sizes in code match the Figma properties. Remove shadcn/ui-only variants the design system doesn't have (for example a `lg` size), unless other code in the project already uses them; then keep them and restyle them with the nearest MarkitUI tokens, and say so.
5. **Add the marker comment** at the top of the file, with the Figma component name, node ID and date.
6. **Check** the component renders every variant correctly (a quick test page or Storybook story if the project has one) before using it in blocks.

## Creating a MarkitUI-only component (once)

1. Read the component set the same way (design context, variable defs, description).
2. Create `components/markitui/<kebab-name>.tsx` with a typed props interface built from the property rules above, using adapted shadcn/ui components inside it where Figma nests them (FeatureItem's link is the adapted Button with `variant="link"`).
3. Follow the description's "In code:" guidance for the element (`<li>`, `<time datetime="…">`, `role="tab"`).
4. Add the same marker comment.

## Section Title

Section Title is in almost every block. Build it once as `components/markitui/section-title.tsx`:

- Props: `eyebrow`, `heading`, `description`, `actions` (children or a CTAButtonGroup), `features` (optional list), `layout` (`stack-left`, `stack-center`, `split`), `headingSize` (`2xl`, `xl`, `lg`), `as` for the heading level (default `h2`).
- `headingSize` picks the headline text style (`type-headline-2xl`, `type-headline-xl`, `type-headline-lg`); the gap comes from the matching `--section-title-gap-*` token.
- `split` puts heading and description side by side on desktop and stacks them on mobile.
