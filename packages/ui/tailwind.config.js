const v = (n) => `var(--${n})`;
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: Object.fromEntries([
        'paper', 'surface', 'sunk', 'ink', 'mute', 'line', 'rail', 'rail-ink', 'rail-mute', 'rail-line', 'refract', 'refract-soft', 'prism',
        'universal', 'logs', 'traces', 'metrics', 'p1', 'p2', 'p3', 'warn', 'warnbg', 'bad', 'ok', 'on-color',
      ].map((n) => [n, v(n)])),
      fontFamily: {
        sans: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
        display: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
        mono: ['"Fira Code"', '"SF Mono"', 'monospace'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
        float: '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: { xl: '0.75rem', '2xl': '1rem' },
    },
  },
};
