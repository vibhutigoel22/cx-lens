// Colours come from CSS custom properties (styles.css), so the dark and light themes swap without a rebuild.
// Opacity modifiers such as bg-ok/10 are mixed with color-mix() so they work with variables.
const v = (n) => ({ opacityValue }) => (opacityValue === undefined || opacityValue === '1' ? `var(--${n})` : `color-mix(in srgb, var(--${n}) calc(${opacityValue} * 100%), transparent)`);
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: Object.fromEntries([
        'paper', 'surface', 'sunk', 'raised', 'ink', 'mute', 'line', 'line-strong', 'rail', 'rail-ink', 'rail-mute', 'rail-line', 'step-done', 'step-future',
        'refract', 'refract-soft', 'on-refract', 'cyan', 'prism', 'universal', 'logs', 'traces', 'metrics', 'p1', 'p2', 'p3', 'warn', 'warnbg', 'bad', 'ok', 'on-color',
        'syn-key', 'syn-val', 'syn-unit',
      ].map((n) => [n, v(n)])),
      fontFamily: {
        sans: ['Inter', 'Geist', '-apple-system', 'system-ui', 'sans-serif'],
        display: ['Inter', 'Geist', '-apple-system', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', '"SF Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.12)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
        float: '0 18px 40px -12px rgba(0, 0, 0, 0.45)',
        'glow-cyan': 'var(--glow-cyan)', 'glow-purple': 'var(--glow-purple)', 'glow-emerald': 'var(--glow-emerald)',
      },
      borderRadius: { xl: '0.75rem', '2xl': '1rem' },
    },
  },
};
