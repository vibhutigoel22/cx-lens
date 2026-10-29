// Verifies every text/background pair the UI uses meets WCAG AA (4.5:1) in the dark (default) and light themes.
import { readFileSync } from 'node:fs';
const css = readFileSync(new URL('../packages/ui/src/styles.css', import.meta.url), 'utf8');
/** Custom properties (hex only) declared in the first rule whose selector contains `sel`. */
const block = (sel) => {
  const at = css.indexOf(sel); if (at < 0) throw new Error(`No rule for ${sel} in styles.css`);
  const body = css.slice(css.indexOf('{', at) + 1, css.indexOf('}', at));
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{6})/g)].map((m) => [m[1], m[2]]));
};
const dark = block(':root, :root[data-theme="dark"]');
const light = { ...dark, ...block(':root[data-theme="light"]') };
const system = { ...dark, ...block(':root[data-theme="system"]') };
// "Follow macOS" must look exactly like the light theme when macOS is in light mode.
const drift = Object.keys(system).filter((k) => system[k] !== light[k] && block(':root[data-theme="system"]')[k] !== undefined);
const lum = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const PAIRS = [['on-refract', 'refract'], ['refract', 'surface'], ['refract', 'paper'], ['refract', 'refract-soft'], ['refract', 'sunk'], ['ink', 'paper'], ['ink', 'surface'], ['ink', 'sunk'], ['ink', 'raised'], ['mute', 'paper'], ['mute', 'surface'], ['mute', 'sunk'],
  ...['universal', 'logs', 'traces', 'metrics', 'p1', 'p2', 'p3', 'bad', 'ok', 'prism'].flatMap((k) => [[k, 'surface'], [k, 'paper'], [k, 'sunk'], ['on-color', k]]), ['warn', 'warnbg'],
  ['syn-key', 'surface'], ['syn-val', 'surface'], ['syn-unit', 'surface'], ['syn-key', 'sunk'], ['syn-unit', 'sunk'], ['ink', 'diff-del'], ['ink', 'diff-add'],
  ['rail-ink', 'rail'], ['rail-mute', 'rail'], ['step-done', 'rail'], ['step-future', 'rail']];
let failed = 0;
for (const [name, pal] of [['dark', dark], ['light', light]]) for (const [fg, bg] of PAIRS) {
  if (!pal[fg] || !pal[bg]) { failed++; console.log(`MISSING ${name}: --${fg} or --${bg}`); continue; }
  const r = ratio(pal[fg], pal[bg]); if (r < 4.5) { failed++; console.log(`FAIL ${name}: --${fg} on --${bg} = ${r.toFixed(2)}:1`); }
}
if (drift.length) { failed++; console.log(`FAIL: data-theme="system" differs from the light theme for ${drift.join(', ')}`); }
console.log(failed ? `${failed} problem(s)` : `All ${PAIRS.length * 2} text/background pairs meet WCAG AA (4.5:1) in the dark and light themes.`);
process.exit(failed ? 1 : 0);
