// MarkitUI theme audit — read-only. Paste the whole file into a use_figma call.
//
// Resolves every semantic colour (Theme collection, colors/*) in every Theme
// mode, then checks WCAG 2.1 contrast for the pairs MarkitUI blocks actually
// use. It changes nothing in the file.
//
// Returns, per mode:
//   resolved   – semantic colour → final hex (with alpha if any) and its alias chain end
//   raw        – semantic colours set to a raw value instead of an alias
//   missing    – semantic colours with no value in this mode
//   fails      – pairs under their minimum, with level "must" (brand-affected) or "info"
//
// Edit MODES_TO_CHECK to limit the run to one mode pair (e.g. ['Acme / Light', 'Acme / Dark']).

const MODES_TO_CHECK = null; // null = all Theme modes

// [foreground, background, minimum, level]
// "must": the brand step affects it; fix before reporting.
// "info": status colours and neutrals the brand doesn't touch; report only.
const PAIRS = [
  ['fg-primary', 'bg-primary', 4.5, 'must'],
  ['fg-primary', 'bg-secondary', 4.5, 'must'],
  ['fg-primary', 'bg-elevated', 4.5, 'must'],
  ['fg-secondary', 'bg-primary', 4.5, 'must'],
  ['fg-secondary', 'bg-secondary', 4.5, 'must'],
  ['fg-secondary', 'bg-elevated', 4.5, 'must'],
  ['fg-accent', 'bg-primary', 4.5, 'must'],
  ['fg-accent', 'bg-secondary', 4.5, 'must'],
  ['fg-link', 'bg-primary', 4.5, 'must'],
  ['fg-link', 'bg-secondary', 4.5, 'must'],
  ['fg-link-hover', 'bg-primary', 4.5, 'must'],
  ['fg-on-accent', 'bg-accent', 4.5, 'must'],
  ['fg-on-accent', 'interactive-accent', 4.5, 'must'],
  ['fg-on-accent', 'interactive-accent-hover', 4.5, 'must'],
  ['fg-on-accent', 'interactive-accent-active', 4.5, 'must'],
  ['fg-on-primary', 'interactive-primary', 4.5, 'must'],
  ['fg-on-primary', 'interactive-primary-hover', 4.5, 'must'],
  ['fg-on-primary', 'interactive-primary-active', 4.5, 'must'],
  ['fg-on-secondary', 'interactive-secondary', 4.5, 'must'],
  ['fg-on-secondary', 'interactive-secondary-hover', 4.5, 'must'],
  ['fg-inverse', 'bg-inverse', 4.5, 'must'],
  ['interactive-accent', 'bg-primary', 3, 'must'],
  ['focus-ring-default', 'bg-primary', 3, 'must'],
  ['border-strong', 'bg-primary', 3, 'must'],
  ['fg-tertiary', 'bg-primary', 4.5, 'info'],
  ['border-medium', 'bg-primary', 3, 'info'],
  ['fg-on-destructive', 'interactive-destructive', 4.5, 'info'],
  ['fg-destructive', 'bg-primary', 4.5, 'info'],
  ['fg-success', 'bg-primary', 4.5, 'info'],
  ['fg-warning', 'bg-primary', 4.5, 'info'],
];

const cols = await figma.variables.getLocalVariableCollectionsAsync();
let theme = cols.find(c => c.name === 'Theme');
if (!theme) { // renamed in this copy: find the collection that holds colors/bg-primary
  const locals = await figma.variables.getLocalVariablesAsync('COLOR');
  const bg = locals.find(v => v.name === 'colors/bg-primary');
  theme = bg && cols.find(c => c.id === bg.variableCollectionId);
}
if (!theme) return { error: 'No Theme collection found (no variable named colors/bg-primary).' };

const cache = {};
const getVar = async id => (cache[id] ??= await figma.variables.getVariableByIdAsync(id));
const colById = Object.fromEntries(cols.map(c => [c.id, c]));

// Resolve a value to { rgb: [r,g,b], a, end } following aliases across collections.
async function resolve(value, modeId, depth = 0) {
  if (depth > 10 || value == null) return null;
  if (value.type === 'VARIABLE_ALIAS') {
    const v = await getVar(value.id);
    if (!v) return null;
    const col = colById[v.variableCollectionId];
    // Same collection → same mode; other collection → its default mode.
    const m = col && col.id === theme.id ? modeId : col?.defaultModeId;
    const r = await resolve(v.valuesByMode[m], modeId, depth + 1);
    return r && { ...r, end: r.end ?? v.name };
  }
  if (typeof value === 'object' && 'r' in value) return { rgb: [value.r, value.g, value.b], a: value.a ?? 1 };
  if (typeof value === 'object' && 'color' in value) { // colour + opacity composite
    const c = await resolve(value.color, modeId, depth + 1);
    let op = value.opacity;
    if (op?.type === 'VARIABLE_ALIAS') {
      const ov = await getVar(op.id);
      op = ov?.valuesByMode[colById[ov.variableCollectionId]?.defaultModeId];
    }
    return c && { ...c, a: c.a * (typeof op === 'number' ? (op > 1 ? op / 100 : op) : 1) };
  }
  if (typeof value === 'number') return { num: value };
  return null;
}

const lin = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const over = (fg, a, bg) => fg.map((c, i) => c * a + bg[i] * (1 - a));
const hex = (rgb, a = 1) => '#' + rgb.map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('') + (a < 1 ? Math.round(a * 255).toString(16).padStart(2, '0') : '');
const ratio = (x, y) => { const a = lum(x), b = lum(y); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };

const colourVars = [];
for (const id of theme.variableIds) {
  const v = await getVar(id);
  if (v.resolvedType === 'COLOR' && v.name.startsWith('colors/')) colourVars.push(v);
}

const out = {};
for (const mode of theme.modes) {
  if (MODES_TO_CHECK && !MODES_TO_CHECK.includes(mode.name)) continue;
  const resolved = {}, raw = [], missing = [], fails = [];
  for (const v of colourVars) {
    const key = v.name.replace('colors/', '');
    const val = v.valuesByMode[mode.modeId];
    if (val == null) { missing.push(key); continue; }
    if (typeof val === 'object' && 'r' in val) raw.push(key);
    const r = await resolve(val, mode.modeId);
    if (!r?.rgb) { missing.push(key); continue; }
    resolved[key] = { hex: hex(r.rgb, r.a), rgb: r.rgb, a: r.a, alias: r.end ?? 'raw' };
  }
  const page = resolved['bg-primary'];
  for (const [fgK, bgK, min, level] of PAIRS) {
    const fg = resolved[fgK], bg = resolved[bgK];
    if (!fg || !bg || !page) continue;
    const bgRgb = over(bg.rgb, bg.a, page.rgb);
    const fgRgb = over(fg.rgb, fg.a, bgRgb);
    const r = ratio(fgRgb, bgRgb);
    if (r < min) fails.push({ fg: fgK, bg: bgK, ratio: +r.toFixed(2), min, level, fgAlias: fg.alias, bgAlias: bg.alias });
  }
  out[mode.name] = {
    resolved: Object.fromEntries(Object.entries(resolved).map(([k, v]) => [k, `${v.hex} (${v.alias})`])),
    raw, missing, fails,
  };
}
return out;
