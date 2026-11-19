# MarkitUI skills

Agent skills for MarkitUI, the Figma design system for marketing websites and online stores. The skills teach AI tools (Claude, Claude Code, Codex, Cursor and other agents that support `SKILL.md`) how to work with your copy of the MarkitUI Figma file.

## Skills

| Skill | What it does | Runs in |
|---|---|---|
| [`markitui-apply-brand`](skills/markitui-apply-brand/SKILL.md) | Turns your brand (brand book, website, screenshots, or colours and fonts) into a MarkitUI theme: brand palette, light and dark semantic colours, fonts, corners and shadows, checked for contrast. Proposes first, changes nothing until you approve. | Figma |
| [`markitui-build-pages`](skills/markitui-build-pages/SKILL.md) | Plans and builds website or store pages in your copy of the MarkitUI file from library blocks: project blocks, desktop and mobile page frames (optional tablet) and handoff notes. Can also rebuild an existing website. | Figma |
| [`markitui-import-variables`](skills/markitui-import-variables/SKILL.md) | Syncs your MarkitUI variables, text styles and effect styles into your project's Tailwind CSS v4 stylesheet: light and dark mode, breakpoints, brand modes, typography and a bridge to shadcn/ui tokens. | Your code project |
| [`markitui-generate-code`](skills/markitui-generate-code/SKILL.md) | Turns MarkitUI blocks and pages into responsive React + Tailwind CSS v4 components on shadcn/ui, using your MarkitUI tokens. Run `markitui-import-variables` first. | Your code project |

A typical order: `markitui-apply-brand` → `markitui-build-pages` → `markitui-import-variables` → `markitui-generate-code`.

## Before you start

1. Connect your AI tool to Figma with the Figma MCP server. Figma's setup guide: https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/
2. Have a link to your own copy of the MarkitUI file ready (not the original download).

The **AI skills** guide on the Documentation page of your MarkitUI file explains every skill for designers, with example prompts and troubleshooting.

## Install

### Claude Code, Codex and Cursor

Install every MarkitUI skill once, for all your projects (best for design work):

```bash
npx skills add studio-coal/markitui -g
```

Developers can install into one project instead. Run this inside the project folder:

```bash
npx skills add studio-coal/markitui
```

Install a single skill:

```bash
npx skills add studio-coal/markitui -g --skill markitui-build-pages
```

Update later:

```bash
npx skills update
```

Using pnpm, Yarn or Bun instead of npm? Swap `npx` for your tool's equivalent, for example:

```bash
pnpm dlx skills add studio-coal/markitui -g
yarn dlx skills add studio-coal/markitui -g
bunx skills add studio-coal/markitui -g
```

The command needs Node.js. It copies the skills into `.agents/skills/` (read by Codex and Cursor) and links them for Claude Code. Restart your tool or start a new chat afterwards.

### Manual install

Copy a skill folder (for example `skills/markitui-apply-brand`) into your tool's skills folder:

| Tool | All projects | One project |
|---|---|---|
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| Codex, Cursor | `~/.agents/skills/` | `.agents/skills/` |

Keep the folder name and the `references` folder inside it.

### Claude app (desktop or claude.ai)

1. Download this repo (**Code** → **Download ZIP**) and unzip it.
2. Compress each folder inside `skills/` into its own `.zip` file.
3. In Claude, make sure **Settings › Capabilities › Code execution and file creation** is on.
4. Go to **Customize › Skills**, click **+**, choose **Create skill › Upload a skill**, and upload each `.zip`.

Skills added in the Claude app also load in Claude Code when you sign in with the same account.

### Figma agent

Figma's own agent accepts a skill as a single Markdown file and can't load the `references` folder these skills rely on. Use Claude, Claude Code, Codex or Cursor connected to Figma instead.

## Use

Ask in plain words and add a link to your file or frame:

```text
Apply our brand to my MarkitUI file: <link>. Our brand: <website>.
Build a homepage and a pricing page for Acme in my MarkitUI file: <link>.
Sync the MarkitUI variables from <link> into this project.
Turn this page into code: <link to the page frame>.
```

To call a skill directly: `/markitui-build-pages` in Claude Code, `$markitui-build-pages` in Codex, or "Use markitui-build-pages" in Cursor and the Claude app.

## Requirements

- Your own copy of the MarkitUI Figma file
- The Figma MCP server connected to your AI tool
- For the code skills: a project using Tailwind CSS v4 and shadcn/ui (Tailwind v3 is supported with manual steps)
