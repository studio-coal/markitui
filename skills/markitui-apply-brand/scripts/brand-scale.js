// MarkitUI brand scale generator.
//
// Builds an 11-step palette (50–950) from one brand colour in OKLCH, so
// lightness steps are even and the hue stays stable. The brand colour itself
// lands unchanged on the step closest to its lightness.
//
// Use it two ways:
//   1. Node:      node brand-scale.js "#2563eb"           (prints a table)
//                 node brand-scale.js "#2563eb" --tint     (also prints a tinted neutral)
//   2. use_figma: paste the functions above the CLI block into a script and
//                 call brandScale('#2563eb'). No imports, no Node APIs.
//
// Pure JavaScript, no dependencies.

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// Target OKLCH lightness per step, close to Tailwind CSS v4's own palettes.
const TARGET_L = {
  50: 0.977, 100: 0.946, 200: 0.902, 300: 0.827, 400: 0.714, 500: 0.627,
  600: 0.558, 700: 0.496, 800: 0.438, 900: 0.381, 950: 0.291,
};

// Chroma per step relative to the peak (Tailwind palettes peak at 500–600).
const CHROMA_FACTOR = {
  50: 0.1, 100: 0.22, 200: 0.4, 300: 0.62, 400: 0.85, 500: 1, 600: 1,
  700: 0.9, 800: 0.78, 900: 0.64, 950: 0.5,
};

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h.slice(0, 6);
  return [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16) / 255);
}

function rgbToHex(rgb) {
  return '#' + rgb.map(x => Math.round(Math.min(1, Math.max(0, x)) * 255).toString(16).padStart(2, '0')).join('');
}

const toLinear = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = c => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function rgbToOklch(rgb) {
  const [r, g, b] = rgb.map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.sqrt(A * A + B * B);
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { l: L, c: C, h: H };
}

// Returns linear sRGB (may be out of gamut).
function oklchToLinear({ l, c, h }) {
  const hr = (h * Math.PI) / 180;
  const A = c * Math.cos(hr);
  const B = c * Math.sin(hr);
  const l_ = (l + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m_ = (l - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s_ = (l - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
}

const inGamut = lin => lin.every(x => x >= -0.0001 && x <= 1.0001);

// Lower chroma until the colour fits sRGB, keeping lightness and hue.
function oklchToHex(lch) {
  let lo = 0;
  let hi = lch.c;
  if (inGamut(oklchToLinear(lch))) return rgbToHex(oklchToLinear(lch).map(toGamma));
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklchToLinear({ ...lch, c: mid }))) lo = mid;
    else hi = mid;
  }
  return rgbToHex(oklchToLinear({ ...lch, c: lo }).map(toGamma));
}

function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(hexA, hexB) {
  const a = relativeLuminance(hexA);
  const b = relativeLuminance(hexB);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

// anchorHex: the brand colour. Options:
//   anchorStep: force the step the brand colour sits on (e.g. 600).
//   chromaScale: multiply chroma of the generated steps (e.g. 0.9 for a calmer scale).
function brandScale(anchorHex, options = {}) {
  const anchor = rgbToOklch(hexToRgb(anchorHex));
  const anchorStep = options.anchorStep ?? STEPS.reduce((best, s) =>
    Math.abs(TARGET_L[s] - anchor.l) < Math.abs(TARGET_L[best] - anchor.l) ? s : best, 500);
  const peak = (anchor.c / CHROMA_FACTOR[anchorStep]) * (options.chromaScale ?? 1);

  // Shift the lightness curve so the anchor step matches the anchor exactly,
  // fading the shift out towards 50 and 950 so the ends stay usable.
  const shift = anchor.l - TARGET_L[anchorStep];
  const idx = STEPS.indexOf(anchorStep);

  const scale = {};
  STEPS.forEach((step, i) => {
    if (step === anchorStep) {
      scale[step] = anchorHex.toLowerCase().slice(0, 7);
      return;
    }
    const distance = Math.abs(i - idx);
    const fade = Math.max(0, 1 - distance / 4);
    const l = Math.min(0.985, Math.max(0.2, TARGET_L[step] + shift * fade));
    scale[step] = oklchToHex({ l, c: peak * CHROMA_FACTOR[step], h: anchor.h });
  });
  return { anchorStep, hue: Math.round(anchor.h), scale };
}

// A neutral scale tinted towards the brand hue. strength 0.005–0.02 is subtle.
function tintedNeutral(anchorHex, strength = 0.01) {
  const { h } = rgbToOklch(hexToRgb(anchorHex));
  const lightness = { ...TARGET_L, 50: 0.985, 100: 0.97, 200: 0.922, 300: 0.87, 400: 0.708, 500: 0.556, 600: 0.439, 700: 0.371, 800: 0.269, 900: 0.205, 950: 0.145 };
  const scale = {};
  for (const step of STEPS) scale[step] = oklchToHex({ l: lightness[step], c: strength, h });
  return scale;
}

// Figma colour object from hex.
function hexToFigma(hex) {
  const [r, g, b] = hexToRgb(hex);
  return { r, g, b, a: 1 };
}

// ---- CLI (Node only) ---------------------------------------------------------
if (typeof module !== 'undefined' && typeof require !== 'undefined' && require.main === module) {
  const hex = process.argv[2];
  if (!hex || !/^#?[0-9a-f]{3}([0-9a-f]{3})?$/i.test(hex)) {
    console.error('Usage: node brand-scale.js "#2563eb" [--tint] [--step 600]');
    process.exit(1);
  }
  const stepArg = process.argv.indexOf('--step');
  const anchorStep = stepArg > 0 ? Number(process.argv[stepArg + 1]) : undefined;
  const result = brandScale(hex.startsWith('#') ? hex : '#' + hex, { anchorStep });
  console.log(`Anchor on ${result.anchorStep}, hue ${result.hue}`);
  console.log('step  hex       vs white  vs #171717');
  for (const s of STEPS) {
    const c = result.scale[s];
    console.log(`${String(s).padEnd(5)} ${c}  ${contrast(c, '#ffffff').toFixed(2).padStart(6)}    ${contrast(c, '#171717').toFixed(2).padStart(6)}`);
  }
  if (process.argv.includes('--tint')) {
    console.log('\nTinted neutral');
    const n = tintedNeutral(result.scale[result.anchorStep]);
    for (const s of STEPS) console.log(`${String(s).padEnd(5)} ${n[s]}`);
  }
}

if (typeof module !== 'undefined') {
  module.exports = { brandScale, tintedNeutral, contrast, hexToFigma, rgbToOklch, oklchToHex, STEPS };
}
