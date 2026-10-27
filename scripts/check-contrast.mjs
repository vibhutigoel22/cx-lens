// Verifies every text/background pair the UI uses meets WCAG AA (4.5:1) in light and dark mode.
import { readFileSync } from 'node:fs';
const css = readFileSync(new URL('../packages/ui/src/styles.css', import.meta.url), 'utf8');
const block = (src) => Object.fromEntries([...src.matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{6})/g)].map((m) => [m[1], m[2]]));
const light = block(css.split('@media (prefers-color-scheme: dark)')[0]);
const dark = { ...light, ...block(css.split('@media (prefers-color-scheme: dark)')[1]) };
const lum = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const PAIRS = [['on-refract', 'refract'], ['refract', 'surface'], ['refract', 'paper'], ['refract', 'refract-soft'], ['ink', 'paper'], ['ink', 'surface'], ['mute', 'paper'], ['mute', 'surface'], ['mute', 'sunk'],
  ...['universal', 'logs', 'traces', 'metrics', 'p1', 'p2', 'p3', 'bad', 'ok'].flatMap((k) => [[k, 'surface'], [k, 'paper'], ['on-color', k]]), ['warn', 'warnbg'], ['rail-ink', 'rail'], ['rail-mute', 'rail']];
let failed = 0;
for (const [name, pal] of [['light', light], ['dark', dark]]) for (const [fg, bg] of PAIRS) { const r = ratio(pal[fg], pal[bg]); if (r < 4.5) { failed++; console.log(`FAIL ${name}: --${fg} on --${bg} = ${r.toFixed(2)}:1`); } }
console.log(failed ? `${failed} pair(s) below 4.5:1` : `All ${PAIRS.length * 2} text/background pairs meet WCAG AA (4.5:1) in light and dark mode.`);
process.exit(failed ? 1 : 0);
