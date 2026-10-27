import React from 'react';
import { Layers, ScrollText, Waypoints, Activity, type LucideIcon } from 'lucide-react';
export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
export function Button({ kind = 'secondary', size = 'md', className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { kind?: 'primary' | 'secondary' | 'quiet' | 'danger'; size?: 'md' | 'lg' }) {
  return <button {...p} className={cx(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed',
    // quiet buttons carry their own padding (below), so the size padding only applies to the other kinds
    kind !== 'quiet' && (size === 'lg' ? 'px-5 py-2.5 text-[14.5px]' : 'px-3.5 py-2 text-[13.5px]'),
    kind === 'quiet' && (size === 'lg' ? 'text-[14.5px]' : 'text-[13.5px]'),
    kind === 'primary' && 'bg-refract text-[color:var(--on-refract)] hover:brightness-110 shadow-soft hover:shadow-float',
    kind === 'secondary' && 'border border-line bg-surface hover:bg-sunk shadow-sm',
    kind === 'quiet' && 'text-mute hover:text-ink hover:bg-sunk px-3 py-2',
    kind === 'danger' && 'border border-bad/50 text-bad hover:bg-bad hover:text-on-color',
    className)} />;
}
export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-[13.5px] font-medium mb-1.5">{label}</span>{children}{hint && <span className="block text-[12.5px] text-mute mt-1.5">{hint}</span>}</label>;
}
export const inputCls = 'w-full rounded-lg border border-line bg-surface px-3 py-2 text-[14px] placeholder:text-mute/70 focus:border-refract';
export function Pill({ tone = 'neutral', children, icon: Icon }: { tone?: 'ok' | 'bad' | 'neutral' | 'warn' | 'info'; children: React.ReactNode; icon?: LucideIcon }) {
  return <span className={cx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12.5px] font-medium',
    tone === 'ok' && 'bg-ok/10 text-ok', tone === 'bad' && 'bg-bad/10 text-bad', tone === 'warn' && 'bg-warn/10 text-warn', tone === 'info' && 'bg-refract-soft text-refract', tone === 'neutral' && 'bg-sunk text-mute')}>{Icon && <Icon size={13} aria-hidden />}{children}</span>;
}
export function Details({ summary, children, open }: { summary: string; children: React.ReactNode; open?: boolean }) {
  return <details open={open} className="group rounded-lg border border-line bg-surface"><summary className="cursor-pointer select-none list-none px-4 py-2.5 text-[13.5px] font-medium flex items-center justify-between">{summary}<span aria-hidden className="text-mute group-open:rotate-90 transition-transform">›</span></summary><div className="px-4 pb-4">{children}</div></details>;
}
export function Empty({ title, next }: { title: string; next?: React.ReactNode }) {
  return <div className="rounded-xl border border-dashed border-line px-6 py-10 text-center"><p className="text-[15px]">{title}</p>{next && <div className="mt-3 text-[13px] text-mute">{next}</div>}</div>;
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
    <span role="tooltip" className="pointer-events-none absolute left-0 top-full z-20 mt-1.5 w-64 rounded-lg bg-rail px-3 py-2 text-[12.5px] leading-snug text-rail-ink opacity-0 shadow-lg transition-opacity group-hover/term:opacity-100 group-focus-within/term:opacity-100">{GLOSSARY[t] ?? t}</span></span>;
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
