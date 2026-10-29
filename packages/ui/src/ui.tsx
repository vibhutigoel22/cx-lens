import React, { useEffect, useState } from 'react';
import { Layers, ScrollText, Waypoints, Activity, Copy, Check, FileDown, Moon, Sun, Monitor, type LucideIcon } from 'lucide-react';
import { parseDocument, parse as parseYaml } from 'yaml';
import { download } from './api';
export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
export function Button({ kind = 'secondary', size = 'md', className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { kind?: 'primary' | 'secondary' | 'quiet' | 'danger'; size?: 'md' | 'lg' }) {
  return <button {...p} className={cx(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium tracking-[-0.01em] transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none',
    // quiet buttons carry their own padding (below), so the size padding only applies to the other kinds
    kind !== 'quiet' && (size === 'lg' ? 'px-5 py-2.5 text-[14.5px]' : 'px-3.5 py-2 text-[13.5px]'),
    kind === 'quiet' && (size === 'lg' ? 'text-[14.5px]' : 'text-[13.5px]'),
    kind === 'primary' && 'cta font-semibold',
    kind === 'secondary' && 'border border-line-strong/70 bg-raised/60 text-ink hover:border-refract/60 hover:bg-raised',
    kind === 'quiet' && 'text-mute hover:text-ink hover:bg-sunk px-3 py-2',
    kind === 'danger' && 'border border-bad/50 text-bad hover:bg-bad hover:text-on-color',
    className)} />;
}
export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-[13.5px] font-medium mb-1.5">{label}</span>{children}{hint && <span className="block text-[12.5px] text-mute mt-1.5">{hint}</span>}</label>;
}
export const inputCls = 'w-full rounded-lg border border-line-strong/70 bg-sunk px-3 py-2 text-[14px] text-ink placeholder:text-mute/70 focus:border-refract focus:shadow-glow-cyan outline-none transition-shadow';
export function Pill({ tone = 'neutral', children, icon: Icon, pulse }: { tone?: 'ok' | 'bad' | 'neutral' | 'warn' | 'info' | 'prism'; children: React.ReactNode; icon?: LucideIcon; pulse?: boolean }) {
  return <span className={cx('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12.5px] font-medium',
    tone === 'ok' && 'border-ok/30 bg-ok/10 text-ok', tone === 'bad' && 'border-bad/30 bg-bad/10 text-bad', tone === 'warn' && 'border-warn/30 bg-warn/10 text-warn',
    tone === 'info' && 'border-refract/30 bg-refract-soft text-refract', tone === 'prism' && 'border-prism/30 bg-prism/10 text-prism', tone === 'neutral' && 'border-line bg-sunk text-mute')}>
    {pulse && <span aria-hidden className="pulse-dot" />}{Icon && <Icon size={13} aria-hidden />}{children}</span>;
}
export function Details({ summary, children, open }: { summary: string; children: React.ReactNode; open?: boolean }) {
  return <details open={open} className="group rounded-xl border border-line bg-surface/60"><summary className="cursor-pointer select-none list-none px-4 py-2.5 text-[13.5px] font-medium flex items-center justify-between hover:text-refract">{summary}<span aria-hidden className="text-mute group-open:rotate-90 transition-transform">›</span></summary><div className="px-4 pb-4">{children}</div></details>;
}
export function Empty({ title, next }: { title: string; next?: React.ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-line-strong px-6 py-10 text-center"><p className="text-[15px]">{title}</p>{next && <div className="mt-3 text-[13px] text-mute">{next}</div>}</div>;
}

/** Skeleton pulse bars in place of spinners while data loads (§6). Screen readers hear the label instead. */
export function Skeleton({ className }: { className?: string }) { return <span aria-hidden className={cx('skeleton block h-3', className)} />; }
export function SkeletonRows({ rows = 3, label, className }: { rows?: number; label: string; className?: string }) {
  return <div role="progressbar" aria-busy="true" aria-label={label} className={cx('space-y-2.5', className)}>
    {Array.from({ length: rows }, (_, i) => <div key={i} className="flex items-center gap-3"><Skeleton className="h-4 w-4 rounded-full" /><Skeleton className={cx('h-3', ['w-2/3', 'w-1/2', 'w-3/5', 'w-2/5'][i % 4])} /><Skeleton className="ml-auto h-3 w-14" /></div>)}
  </div>;
}

/** Stat tile: small label, large bold value (§5 bento card). */
export function Stat({ label, value, unit, tone, hint }: { label: string; value: React.ReactNode; unit?: string; tone?: 'ok' | 'refract' | 'prism'; hint?: React.ReactNode }) {
  return <div className="card px-4 py-3.5"><p className="text-[12px] font-medium uppercase tracking-[0.06em] text-mute">{label}</p>
    <p className={cx('mt-1 font-display text-[24px] font-semibold leading-tight tabnum tracking-[-0.02em]', tone === 'ok' && 'text-ok', tone === 'refract' && 'text-refract', tone === 'prism' && 'text-prism')}>{value}{unit && <span className="ml-1 text-[13px] font-normal text-syn-unit">{unit}</span>}</p>
    {hint && <p className="mt-0.5 text-[12px] text-mute">{hint}</p>}</div>;
}

/**
 * Syntax-coloured data value (§3): metric/label keys in cyan, values in slate, units in violet.
 * Numbers followed by a unit ("1.2 units/day", "340 MB", "12%") split into value + unit.
 */
const UNIT_RE = /^([~≈<>]?\s*[−-]?[\d.,]+(?:\s*[KMB](?![a-z]))?)\s*(units?\/day|units?|GB\/day|GB|MB|KB|bytes?|series|values?|spans?\/day|logs?\/day|records?\/day|\/day|%|ms|s|×)$/i;
const KEY_RE = /^[A-Za-z_][\w.:/-]*$/;
export function DataValue({ v, as = 'auto' }: { v: unknown; as?: 'auto' | 'key' | 'value' }) {
  const s = v == null ? '' : String(v);
  const m = as === 'key' ? null : s.match(UNIT_RE);
  if (m) return <span className="tabnum"><span className="syn-val">{m[1]}</span> <span className="syn-unit">{m[2]}</span></span>;
  if (as === 'key' || (as === 'auto' && KEY_RE.test(s) && /[_.]/.test(s))) return <span className="font-mono syn-key">{s}</span>;
  return <span className="syn-val tabnum">{s}</span>;
}

/**
 * Code block with a floating action pill (§4): YAML / JSON view, one-click copy, and export.
 * JSON is converted from the YAML on demand (comments are dropped there; YAML view keeps them).
 */
export function CodeBlock({ code, lang = 'yaml', fileName, className, maxH = 'max-h-72', label }: { code: string; lang?: 'yaml' | 'text'; fileName?: string; className?: string; maxH?: string; label?: string }) {
  const [fmt, setFmt] = useState<'yaml' | 'json'>('yaml'); const [copied, setCopied] = useState(false);
  const json = (() => { if (lang !== 'yaml' || fmt !== 'json') return null; try { const d = parseDocument(code); if (d.errors.length) return null; return JSON.stringify(d.toJSON(), null, 2); } catch { return null; } })();
  const yamlOk = lang === 'yaml' && (() => { try { const p = parseYaml(code); return p !== null && typeof p === 'object'; } catch { return false; } })();
  const shown = fmt === 'json' && json ? json : code;
  useEffect(() => { if (!copied) return; const t = setTimeout(() => setCopied(false), 1500); return () => clearTimeout(t); }, [copied]);
  const copy = () => navigator.clipboard?.writeText(shown).then(() => setCopied(true)).catch(() => {});
  const ext = fmt === 'json' && json ? 'json' : lang === 'yaml' ? 'yaml' : 'txt';
  return <div className={cx('group/code relative rounded-xl border border-line bg-sunk', className)}>
    <div className="absolute right-2 top-2 z-[1] flex items-center gap-0.5 rounded-full border border-line-strong/70 bg-raised/90 p-0.5 text-[11.5px] shadow-soft backdrop-blur" role="toolbar" aria-label={label ? `${label} actions` : 'Code actions'}>
      {yamlOk && (['yaml', 'json'] as const).map((f) => <button key={f} type="button" aria-pressed={fmt === f} onClick={() => setFmt(f)} className={cx('rounded-full px-2 py-0.5 font-mono font-medium uppercase', fmt === f ? 'bg-refract text-on-refract' : 'text-mute hover:text-ink')}>{f}</button>)}
      <button type="button" onClick={copy} aria-label="Copy to clipboard" className="flex items-center gap-1 rounded-full px-2 py-0.5 text-mute hover:text-ink">{copied ? <><Check size={12} className="text-ok" />Copied</> : <><Copy size={12} />Copy</>}</button>
      {fileName && <button type="button" onClick={() => download(`${fileName}.${ext}`, shown)} aria-label="Export as a file" className="flex items-center gap-1 rounded-full px-2 py-0.5 text-mute hover:text-ink"><FileDown size={12} />Export</button>}
    </div>
    <pre className={cx('overflow-auto p-3 pt-10 text-[12px] leading-relaxed font-mono text-syn-val', maxH)}>{shown}</pre>
  </div>;
}

/** Light / dark / follow-macOS switch. Dark is the default. */
export type ThemePref = 'dark' | 'light' | 'system';
export function useTheme(rootRef: React.RefObject<HTMLElement>) {
  const read = (): ThemePref => { try { const v = localStorage.getItem('cxlens-theme'); return v === 'light' || v === 'system' ? v : 'dark'; } catch { return 'dark'; } };
  const [theme, setTheme] = useState<ThemePref>(read);
  useEffect(() => {
    const node = rootRef.current?.getRootNode(); const target = node instanceof ShadowRoot ? (node.host as HTMLElement) : document.documentElement;
    target.setAttribute('data-theme', theme); try { localStorage.setItem('cxlens-theme', theme); } catch { /* private mode */ }
  }, [theme]);
  return [theme, setTheme] as const;
}
export function ThemeSwitch({ value, onChange }: { value: ThemePref; onChange: (t: ThemePref) => void }) {
  const opts: [ThemePref, string, LucideIcon][] = [['dark', 'Dark', Moon], ['light', 'Light', Sun], ['system', 'Match macOS', Monitor]];
  return <div role="radiogroup" aria-label="Appearance" className="inline-flex rounded-full border border-rail-line bg-white/[.03] p-0.5">{opts.map(([v, l, I]) =>
    <button key={v} type="button" role="radio" aria-checked={value === v} aria-label={l} title={l} onClick={() => onChange(v)} className={cx('grid h-7 w-7 place-items-center rounded-full transition-colors', value === v ? 'bg-white/10 text-step-done' : 'text-rail-mute hover:text-rail-ink')}><I size={14} /></button>)}</div>;
}

export const units = (u: number | null | undefined) => (u == null ? 'TBD' : u >= 10 ? u.toFixed(1) : u.toFixed(u >= 1 ? 2 : 3));
export const PHASE = {
  1: { name: 'Quick wins', long: 'Config-only, no app changes', when: '1–2 weeks', cls: 'text-p1', bg: 'bg-p1', soft: 'bg-p1/10' },
  2: { name: 'Coordinated changes', long: 'Helm upgrade or collector redeploy', when: '2–4 weeks', cls: 'text-p2', bg: 'bg-p2', soft: 'bg-p2/10' },
  3: { name: 'Strategic', long: 'Application code or architecture', when: 'About a quarter', cls: 'text-p3', bg: 'bg-p3', soft: 'bg-p3/10' },
} as const;
export const PILLARS: Record<string, { name: string; icon: LucideIcon; color: string; text: string; bg: string; border: string }> = {
  universal: { name: 'Universal', icon: Layers, color: 'var(--universal)', text: 'text-universal', bg: 'bg-universal', border: 'border-universal' },
  logs: { name: 'Logs', icon: ScrollText, color: 'var(--logs)', text: 'text-logs', bg: 'bg-logs', border: 'border-logs' },
  traces: { name: 'Traces', icon: Waypoints, color: 'var(--traces)', text: 'text-traces', bg: 'bg-traces', border: 'border-traces' },
  metrics: { name: 'Metrics', icon: Activity, color: 'var(--metrics)', text: 'text-metrics', bg: 'bg-metrics', border: 'border-metrics' },
};
export const PILLAR_NAME: Record<string, string> = Object.fromEntries(Object.entries(PILLARS).map(([k, v]) => [k, v.name]));
/** Plain-language glossary shown on hover/focus. */
const GLOSSARY: Record<string, string> = {
  units: 'Coralogix’s billing measure. Each GB costs a different number of units depending on data type and storage tier.',
  'TCO tier': 'Storage priority (High, Medium, Low) that sets how data is indexed and what it costs per GB.',
  'tail sampling': 'Deciding which traces to keep after seeing the whole trace, so errors and slow requests are always kept.',
  'protected labels': 'Resource attributes that Infrastructure Explorer and AWS enrichment rely on. Lens never removes them.',
  'span metrics': 'Request, error and latency metrics generated from traces. Alerts built on them work even when traces are sampled.',
};
export function Term({ t, children }: { t: keyof typeof GLOSSARY | string; children?: React.ReactNode }) {
  return <span className="relative inline-block group/term"><span tabIndex={0} className="underline decoration-dotted decoration-mute/60 underline-offset-[3px] cursor-help">{children ?? t}</span>
    <span role="tooltip" className="pointer-events-none absolute left-0 top-full z-20 mt-1.5 w-64 rounded-lg border border-rail-line bg-raised px-3 py-2 text-[12.5px] leading-snug text-ink opacity-0 shadow-float transition-opacity group-hover/term:opacity-100 group-focus-within/term:opacity-100">{GLOSSARY[t] ?? t}</span></span>;
}

/** Savings-aware total: overlapping findings contribute only their largest member (same rule as the engine). */
export function combined(findings: any[], pick: (f: any) => boolean): number {
  const fs = findings.filter((f) => pick(f) && f.savings.kind === 'units' && (f.savings.unitsPerDay ?? 0) > 0);
  const ids = new Set(fs.map((f) => f.ruleId)); const parent = new Map<string, string>(); const find = (x: string): string => (parent.get(x) ?? x) === x ? x : find(parent.get(x)!);
  for (const f of fs) parent.set(f.ruleId, f.ruleId);
  for (const f of fs) for (const o of f.overlapsWith ?? []) if (ids.has(o)) parent.set(find(o), find(f.ruleId));
  const best = new Map<string, number>(); for (const f of fs) { const r = find(f.ruleId); best.set(r, Math.max(best.get(r) ?? 0, f.savings.unitsPerDay)); }
  return [...best.values()].reduce((a, b) => a + b, 0);
}
