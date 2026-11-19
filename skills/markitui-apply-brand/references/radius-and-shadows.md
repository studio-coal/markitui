# Radius and shadows

## How radius flows

```
Theme: radius/radius-xs … radius-4xl   (numbers: 2, 4, 6, 8, 12, 16, 24, 32)
Theme: radius/radius-main              (the main corner value: a number, or an alias to a radius step)
   ↑ referenced by
Tailwind CSS: border-radius/rounded-main   → radius/radius-main
Tailwind CSS: border-radius/rounded-xs … rounded-4xl → radius/radius-xs … 4xl
              (rounded-none = 0 and rounded-full = 9999 are fixed)
   ↑ bound to
Components and blocks
```

`radius-main` in Theme is where the value lives. `rounded-main` in Tailwind CSS only references it, so blocks bind `rounded-main` and the theme decides the number.

Two knobs, used for different things:

| Knob | Affects | Use it for |
|---|---|---|
| `radius-main` | Cards, panels and other visual containers (media frames, image wrappers) **in blocks**, through `rounded-main`. Base components never use it. | The brand's corner style. This is the main change. |
| The radius scale (`radius-xs … 4xl`) | Everything bound to `rounded-xs … rounded-4xl`, including some base components (Toast and Alert use `rounded-lg`, Textarea `rounded-2xl`, Select menus `rounded-3xl`). | Only when the brand is clearly sharper or rounder overall. |

### Corner style → `radius-main`

Start from the step that matches the corner style:

| Corner style | Step | px |
|---|---|---|
| Sharp | `rounded-none` | 0 |
| Slight | `radius-sm` / `radius-md` | 4–6 |
| Soft | `radius-lg` / `radius-xl` | 8–12 |
| Round | `radius-2xl` / `radius-3xl` | 16–24 |

Then choose how to set it:

- **Alias the step** when the brand's corners match one (most brands). It stays in step with the radius scale, and code gets `--radius-main: var(--radius-lg)`.
- **Set a number** when the brand needs a value between steps (e.g. 10 from a brand book or a website's computed `border-radius`). `radius-main` is meant to be fine-tuned this way; code gets `--radius-main: 0.625rem`.

Never point `radius-main` at `rounded-main`: that is a loop.

From a website, match the computed `border-radius` of cards and panels: if it is within 1px of a step, alias the step; otherwise propose the number.

**Doc mismatch to check.** The System setup doc describes the default `rounded-main` as `rounded-2xl` (16px), while the stock variable aliases `rounded-none` (0). Read both in the user's copy and mention which one you started from.

### The radius scale

Change it only if the user wants all small radii sharper or rounder. Scale every step by the same factor and round to whole pixels (e.g. ×0.5 → 1, 2, 3, 4, 6, 8, 12, 16). Keep the steps increasing. Keep values identical in every Theme mode.

### Pill shapes are fixed

Button, Input, InputGroup, Select, SelectItem, Badge, Tabs, TabTrigger, PaginationItem, carousel controls, Slider and Avatar are bound to `rounded-full`, which no variable changes. A brand with square or slightly rounded buttons needs those base component masters re-bound to another fixed token (e.g. `rounded-md`), never to `rounded-main`.

That is a component edit, which this skill doesn't do by default. Put it in the proposal as a separate decision: "Your buttons are square; MarkitUI buttons are pills. Re-binding Button, Input, Select and Badge masters to `rounded-sm` would match. Do it?" Do it only with a yes, only in the master components, and list every component changed in the report.

## Shadows

Theme holds the shadow layers: `shadow/{size}/…` for sizes `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`. Single-layer sizes (`2xs`, `xs`, `2xl`) have their parts directly under the size; two-layer sizes (`sm`, `md`, `lg`, `xl`) under `/1/` and `/2/`. Each layer has `color`, `offset-x`, `offset-y`, `blur-radius`, `spread-radius`. Effect styles `drop-shadow/*` bind them; code writes one `--shadow-{size}` per size.

Stock: Tailwind v4 defaults, black at 5–25% alpha, identical in both modes.

| Option | Change |
|---|---|
| **Keep** | Nothing. Default. |
| **Soften** | Multiply every layer's colour alpha by about 0.6. |
| **Remove** (flat brands) | Set every layer's colour alpha to 0. Don't delete layers or variables. |
| **Tint** | Set layer colours to the brand's darkest step (950, or a tinted neutral 950) at the same alphas. Subtle; good on warm or coloured backgrounds. |

Rules:

- Change only the `color` layers. Offsets, blur and spread stay unless the brand book gives exact shadow specs.
- Shadow colours are raw values (they carry alpha); that's expected and not a "raw value" to report.
- Keep the values identical in both modes. Code writes shadows once.
- `focus-ring/*` effect styles have no shadow variables; they follow `focus-ring-default`, `focus-ring-destructive` and `focus-ring-inner` from the colour mapping.
