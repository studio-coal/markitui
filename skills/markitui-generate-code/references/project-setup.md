# Project setup (preflight)

Check these before generating code. Fix what is missing, or ask the user, and say what you changed.

## 1. Stack

- Find the framework from `package.json` (Next.js, Vite, React Router, TanStack Start, Astro with `@astrojs/react`).
- Find the package manager from the lock file (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, `package-lock.json`). Write every install command for that manager.
- Output is TypeScript React (`.tsx`). In Astro projects, write static blocks as `.astro` components only if the project already does so; otherwise use `.tsx` blocks and hydrate only interactive parts (`client:visible` or `client:load`).

## 2. Tailwind CSS v4

- The main stylesheet has `@import "tailwindcss"`. If the project is on Tailwind v3 (`tailwind.config.*` with `@tailwind base`), stop and tell the user: this skill writes v4 classes such as `py-(--section-padding-y)`. Recommend upgrading first.

## 3. shadcn/ui

- `components.json` exists. Read `style`, `aliases`, `iconLibrary` and `tailwind.css`. If the CLI supports it, `npx shadcn@latest info --json` reports the base library, style, Tailwind version, aliases and installed components in one go; trust it over guessing.
- **Flavour:** a `style` starting with `base-` means Base UI; anything else means Radix. Both work. Never switch flavours in an existing project.
- If shadcn/ui is not set up, propose `npx shadcn@latest init` (Base UI is the default for new projects) and run it only after the user agrees. It creates `components.json`, the `cn()` helper and the dependencies.
- Respect the aliases in `components.json` for every import (`@/components/ui/button`, `@/lib/utils`).

## 4. MarkitUI tokens

- The stylesheet contains the `markitui:tokens` region from `markitui-import-variables`. If it is missing or older than the design changes the user mentions, run that skill first. Code generated without the region looks unstyled, because every class in this skill refers to its tokens.
- Read the region's header line: `typography: custom | tailwind | mixed` decides how text styles become classes (see `class-translation.md`), and `brands:` tells you whether `[data-brand]` variants exist.

## 5. Fonts and icons

- Every font family the design uses is loaded (`next/font`, `@fontsource/*`, a `<link>`, or `@font-face`). Missing fonts are the most visible failure: text falls back to a different typeface and every line wraps differently. Propose the fix and wait for approval before adding packages.
- Icons: `lucide-react` is installed if the design uses Lucide icons (MarkitUI's default). See `icons-and-media.md` for other libraries.

## 6. Folder layout

Use the project's existing structure when it has one. Otherwise:

| What | Where | Example |
|---|---|---|
| shadcn/ui components (adapted from Figma) | the `ui` alias, usually `components/ui/` | `components/ui/button.tsx` |
| MarkitUI components with no shadcn/ui equivalent | `components/markitui/` | `components/markitui/feature-item.tsx` |
| Blocks (sections) | `components/blocks/` | `components/blocks/feature-stack-05.tsx` |
| Pages | the framework's routes | `app/page.tsx`, `app/pricing/page.tsx` |
| Downloaded images and SVGs | `public/images/` (or the framework's asset folder) | `public/images/home/hero.jpg` |
| Custom icons | `components/icons/` | `components/icons/brand-x.tsx` |

## 7. Naming

- Block component from the Figma name: drop the slashes and dot, PascalCase, keep the number: `Feature / Stack / 05.` → `FeatureStack05` in `feature-stack-05.tsx`. Shop blocks keep `Shop`: `Hero / Shop / Full-bleed / 03.` → `HeroShopFullBleed03`.
- Project blocks (named `{Project} / {Block type} / {Category} / {Layout}` in Figma) drop the project name: `Acme / Hero / Split / 01.` → `HeroSplit01`, unless that clashes with an existing block.
- MarkitUI components keep their Figma name in PascalCase (`FeatureItem`, `CTAButtonGroup` → `CtaButtonGroup` only if the project uses that casing convention).
- Never rename an adapted shadcn/ui component or its exports.
