# Applying the approved theme

Write only what the user approved. Find everything by name (and by content in a renamed copy, see `theme-structure.md`), never by ID.

## 0. Save a version

Save a named version so the change can be undone in one step:

```js
await figma.saveVersionHistoryAsync('Before brand: Acme', 'Saved by markitui-apply-brand');
```

If that call isn't supported, ask the user to use **File › Save to version history** and wait for a yes before writing.

## Write order

One `use_figma` call per step, each returning a short summary (what changed, count). Re-read the step's result before the next one.

1. **Primitives** (Tailwind CSS collection): brand scale, then neutral tint, status changes and any new palette group.
2. **Modes** (Theme collection): rename the pair, or add the new pair.
3. **Semantic colours** (Theme): aliases per mode, Light then Dark.
4. **Fonts** (Theme `font family/*`), then Custom role aliases if approved.
5. **Text style letter spacing**, if approved.
6. **Radius** (`radius-main`, then the scale if approved).
7. **Shadows**, if approved.
8. **Component edits**, only if the user explicitly approved one (e.g. button corners).

## Script patterns

Shared helpers (paste at the top of each script):

```js
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const all = await figma.variables.getLocalVariablesAsync();
const byName = (col, name) => all.find(v => v.variableCollectionId === col.id && v.name === name);
const hexToFigma = h => { const n = h.replace('#', ''); return { r: parseInt(n.slice(0, 2), 16) / 255, g: parseInt(n.slice(2, 4), 16) / 255, b: parseInt(n.slice(4, 6), 16) / 255, a: 1 }; };
const tw = cols.find(c => c.name === 'Tailwind CSS');
const theme = cols.find(c => c.name === 'Theme');
const custom = cols.find(c => c.name === 'Custom');
```

**1. Primitives.** Update existing variables in place; never delete and recreate them, or every alias to them breaks.

```js
const scale = { 50: '#f4f8ff', /* … */ 950: '#0c2660' };
const group = 'colors/brand'; // the palette interactive-accent points at
for (const [step, hex] of Object.entries(scale)) {
  byName(tw, `${group}/${step}`).setValueForMode(tw.defaultModeId, hexToFigma(hex));
}
```

**Removing unused steps** (only when the designer chose fewer than 11 shades). Do it last in step 3, after every semantic colour points at a kept step. First check nothing else uses the steps you are about to remove:

```js
const remove = ['colors/brand/50', 'colors/brand/100' /* … */].map(n => byName(tw, n));
const ids = new Set(remove.map(v => v.id));
// 1. Other variables that alias them (any collection, any mode)
const aliasedBy = all.filter(v => Object.values(v.valuesByMode).some(x =>
  (x?.type === 'VARIABLE_ALIAS' && ids.has(x.id)) || (x?.color?.type === 'VARIABLE_ALIAS' && ids.has(x.color.id))
)).map(v => v.name);
// 2. Nodes bound to them directly, one page per call (blocks should only use semantic colours)
const page = figma.currentPage; // loop over pages in separate calls
const nodes = page.findAll(n => ['fills', 'strokes'].some(k =>
  (n.boundVariables?.[k] ?? []).some(b => ids.has(b.id))
)).map(n => `${n.name} (${n.id})`);
return { aliasedBy, nodes };
```

Remove a step with `v.remove()` only when both lists are empty for it across all pages. Otherwise keep it, list what uses it, and ask. Code drops removed steps on the next `markitui-import-variables` run and lists them as removed.

A new palette group (second brand or secondary colour): create each step with `figma.variables.createVariable(name, tw, 'COLOR')`, set its value, and copy `scopes` from the matching `colors/brand/*` step. Don't add code syntax: the Tailwind CSS collection has none on purpose.

**2. Modes.**

```js
const light = theme.modes[0], dark = theme.modes[1];
theme.renameMode(light.modeId, 'Acme / Light');
theme.renameMode(dark.modeId, 'Acme / Dark');
// Second brand instead:
// const newLight = theme.addMode('Acme / Light'); const newDark = theme.addMode('Acme / Dark');
```

`addMode` throws when the plan's mode limit is reached: stop and tell the user. A new mode starts with copied values; still set every semantic colour for it explicitly in step 3, and copy every non-colour Theme value from the default mode so code stays consistent.

**3. Semantic colours.** Set aliases, not hex values:

```js
const mapping = { // role: [light target, dark target]
  'interactive-accent': ['colors/brand/600', 'colors/brand/600'],
  'fg-link': ['colors/brand/600', 'colors/brand/400'],
  // … only the approved roles
};
const [L, D] = [theme.modes.find(m => m.name.endsWith('/ Light')), theme.modes.find(m => m.name.endsWith('/ Dark'))];
for (const [role, [lt, dt]] of Object.entries(mapping)) {
  const v = byName(theme, `colors/${role}`);
  v.setValueForMode(L.modeId, figma.variables.createVariableAlias(byName(tw, lt)));
  v.setValueForMode(D.modeId, figma.variables.createVariableAlias(byName(tw, dt)));
}
```

- Targets in `base/*` work the same (`colors/base/white`).
- Composite values (`bg-overlay`: colour + opacity) are left alone unless approved.
- Don't touch `description`, `scopes`, `codeSyntax` or `hiddenFromPublishing`.

**4. Fonts.** Load each font first, so Figma doesn't show missing fonts:

```js
for (const style of ['Regular', 'Medium', 'Semi Bold']) await figma.loadFontAsync({ family: 'Geist', style });
for (const m of theme.modes) byName(theme, 'font family/font-sans').setValueForMode(m.modeId, 'Geist');
```

Re-pointing a role (approved heading family or weight), in **every** Custom mode:

```js
const target = figma.variables.createVariableAlias(byName(theme, 'font family/font-serif'));
for (const m of custom.modes) byName(custom, 'text styles/headline/font-family').setValueForMode(m.modeId, target);
```

**5. Letter spacing.**

```js
const styles = await figma.getLocalTextStylesAsync();
const tracking = { 'Custom/Display/Display LG': -3, 'Custom/Headline/': -2 /* prefix match */ };
for (const s of styles) {
  const key = Object.keys(tracking).find(k => s.name === k || (k.endsWith('/') && s.name.startsWith(k)));
  if (key == null) continue;
  await figma.loadFontAsync(s.fontName);
  s.letterSpacing = { unit: 'PERCENT', value: tracking[key] };
}
```

Exact names win over prefixes; put them first. Change nothing else on the style: its family, weight, size and line height stay bound to variables.

**6. Radius.**

```js
const main = byName(theme, 'radius/radius-main');
// Alias a step…
const to = figma.variables.createVariableAlias(byName(theme, 'radius/radius-lg'));
// …or set a fine-tuned number: const to = 10;
for (const m of theme.modes) main.setValueForMode(m.modeId, to);
```

Scale steps are numbers (`radius/radius-lg` = 8), set in every mode. Never change `border-radius/rounded-main` in Tailwind CSS: it must keep referencing `radius-main`.

**7. Shadows.** Change only the `color` layers, in every mode:

```js
for (const v of all.filter(v => v.variableCollectionId === theme.id && /^shadow\/.+\/color$/.test(v.name))) {
  for (const m of theme.modes) {
    const c = v.valuesByMode[m.modeId];
    v.setValueForMode(m.modeId, { ...c, a: c.a * 0.6 }); // soften
  }
}
```

## Mistakes to avoid

- Writing hex values into semantic colours. Code then loses the link to the palette.
- Changing only the Light mode. Every approved change is set for each mode it applies to.
- Setting non-colour Theme values in one mode only. Fonts, radius and shadows must match across modes.
- Re-pointing a Custom role in one breakpoint mode only.
- Writing to the shared MarkitUI file instead of the user's copy.
