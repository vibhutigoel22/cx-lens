import React from 'react';
import { BarChart3, Tags } from 'lucide-react';
import { cx, units, PILLARS, Pill, DataValue } from './ui';

const TIERS: { key: string; name: string; cls: string; dot: string }[] = [
  { key: 'high', name: 'High', cls: 'bg-[linear-gradient(90deg,#06B6D4,#00DFBA)]', dot: 'bg-[#06B6D4]' },
  { key: 'medium', name: 'Medium', cls: 'bg-[linear-gradient(90deg,#8B5CF6,#A855F7)]', dot: 'bg-[#A855F7]' },
  { key: 'low', name: 'Low (archive)', cls: 'bg-[#64748B]', dot: 'bg-[#64748B]' },
];
const tierOf = (t: string) => (/high|frequent/i.test(t) ? 'high' : /medium|monitor/i.test(t) ? 'medium' : 'low');

/** Average units/day per pillar and TCO tier over the last 7 complete days (today is still partial). */
export function tierSplit(run: any) {
  const today = (run?.usage?.fetchedAt ?? new Date().toISOString()).slice(0, 10);
  const days = (run?.usage?.days ?? []).filter((d: any) => d.date.slice(0, 10) < today).slice(-7);
  if (!days.length) return null;
  const acc: Record<string, Record<string, { units: number; gb: number }>> = {};
  for (const d of days) for (const [k, v] of Object.entries<any>(d.byPillarTier ?? {})) {
    const [pillar, tier] = k.split(':'); const t = tierOf(tier ?? '');
    const row = (acc[pillar] ??= {}); const cell = (row[t] ??= { units: 0, gb: 0 }); cell.units += (v.units ?? 0) / days.length; cell.gb += (v.gb ?? 0) / days.length;
  }
  return { days: days.length, rows: Object.entries(acc).map(([pillar, tiers]) => ({ pillar, tiers, total: Object.values(tiers).reduce((a, x) => a + x.units, 0) })).sort((a, b) => b.total - a.total) };
}

/** Segmented distribution bars (§3): where today's units go, by data type and TCO tier. */
export function TierDistribution({ run }: { run: any }) {
  const split = tierSplit(run); if (!split || !split.rows.length) return null;
  const max = Math.max(...split.rows.map((r) => r.total), 1e-9);
  return <section aria-labelledby="tier-title" className="card p-5">
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h2 id="tier-title" className="flex items-center gap-2 text-[15px] font-semibold"><BarChart3 size={16} className="text-refract" />Where today’s units go</h2>
      <ul className="flex flex-wrap gap-3 text-[12px] text-mute" aria-label="TCO tiers">{TIERS.map((t) => <li key={t.key} className="flex items-center gap-1.5"><span className={cx('h-2.5 w-2.5 rounded-sm', t.dot)} />{t.name}</li>)}</ul>
    </div>
    <p className="mt-0.5 text-[12.5px] text-mute">Average of the last {split.days} complete days, by data type and TCO tier. Bars share one scale.</p>
    <ul className="mt-4 space-y-3">{split.rows.map((r) => { const P = PILLARS[r.pillar]; return (
      <li key={r.pillar} className="grid grid-cols-[92px_1fr_auto] items-center gap-3">
        <span className="flex items-center gap-2 text-[13px] font-medium">{P ? <P.icon size={14} className={P.text} aria-hidden /> : null}{P?.name ?? r.pillar}</span>
        <span className="relative h-3 overflow-hidden rounded-full bg-sunk ring-1 ring-inset ring-line" role="img"
          aria-label={`${P?.name ?? r.pillar}: ${TIERS.filter((t) => r.tiers[t.key]).map((t) => `${t.name} ${units(r.tiers[t.key].units)}`).join(', ')} units per day`}>
          <span className="absolute inset-y-0 left-0 flex" style={{ width: `${(r.total / max) * 100}%` }}>
            {TIERS.map((t) => r.tiers[t.key] ? <span key={t.key} className={cx('h-full first:rounded-l-full last:rounded-r-full', t.cls)} style={{ width: `${(r.tiers[t.key].units / r.total) * 100}%` }} title={`${t.name}: ${units(r.tiers[t.key].units)} units/day (${r.tiers[t.key].gb.toFixed(1)} GB/day)`} /> : null)}
          </span>
        </span>
        <span className="w-28 text-right text-[12.5px]"><DataValue v={`${units(r.total)} units/day`} /></span>
      </li>); })}</ul>
  </section>;
}

const KIND: Record<string, { label: string; tone: 'bad' | 'warn' | 'prism' | 'neutral'; pulse: boolean }> = {
  'high-cardinality': { label: 'High cardinality', tone: 'bad', pulse: true },
  churn: { label: 'Churn', tone: 'warn', pulse: true },
  constant: { label: 'Same value everywhere', tone: 'prism', pulse: false },
};
/** Top metric labels by cost, with impact badges and a share bar per label (§3). */
export function LabelCardinality({ inventory, limit = 10 }: { inventory: any; limit?: number }) {
  const rows: any[] = inventory?.rows ?? []; if (!rows.length) return null;
  // High-cardinality and churn labels first (they are what to fix), then the rest by cost.
  const cost = (r: any) => r.units ?? r.series ?? 0; const hot = (r: any) => r.kind === 'high-cardinality' || r.kind === 'churn';
  const ranked = [...rows].sort((a, b) => Number(hot(b)) - Number(hot(a)) || cost(b) - cost(a)).slice(0, limit);
  const flagged = rows.filter((r) => r.kind === 'high-cardinality' || r.kind === 'churn').length;
  const share = (r: any) => r.fraction ?? (inventory.totalSeries && r.series ? r.series / inventory.totalSeries : 0);
  const maxShare = Math.max(...ranked.map(share), 1e-9);
  return <section aria-labelledby="labels-title" className="card p-5">
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h2 id="labels-title" className="flex items-center gap-2 text-[15px] font-semibold"><Tags size={16} className="text-prism" />Metric labels by cost</h2>
      {flagged > 0 && <Pill tone="bad" pulse>{flagged} high-cardinality or churn label{flagged === 1 ? '' : 's'}</Pill>}
    </div>
    <p className="mt-0.5 text-[12.5px] text-mute">{inventory.source === 'usage-api' ? 'Exact units from the Metric Usage API' : 'Measured with PromQL through cx'}{inventory.date ? `, ${inventory.date}` : ''}. Protected labels are shown but never suggested for removal.</p>
    <div className="mt-3 overflow-x-auto"><table className="w-full text-[12.5px]">
      <thead className="text-left text-[11.5px] uppercase tracking-[0.06em] text-mute"><tr><th className="py-1.5 pr-3 font-medium">Label</th><th className="px-3 font-medium whitespace-nowrap">Unique values</th><th className="px-3 font-medium whitespace-nowrap">Share of cost</th><th className="px-3 font-medium text-right">Units/day</th><th className="pl-3 font-medium">Impact</th></tr></thead>
      <tbody>{ranked.map((r) => { const k = KIND[r.kind]; return <tr key={r.name} className="border-t border-line">
        <td className="py-2 pr-3"><DataValue v={r.name} as="key" /></td>
        <td className="px-3 tabnum whitespace-nowrap"><DataValue v={`${r.unique.toLocaleString()} ${r.unique === 1 ? 'value' : 'values'}`} /></td>
        <td className="px-3"><span className="flex items-center gap-2"><span className="h-1.5 min-w-[96px] flex-1 overflow-hidden rounded-full bg-sunk"><span className={cx('block h-full rounded-full', r.kind === 'high-cardinality' ? 'bg-bad' : r.kind === 'churn' ? 'bg-warn' : 'bg-refract')} style={{ width: `${(share(r) / maxShare) * 100}%` }} /></span><span className="w-12 text-right text-mute tabnum">{(share(r) * 100).toFixed(1)}%</span></span></td>
        <td className="px-3 text-right">{r.units != null ? <DataValue v={units(r.units)} /> : <span className="text-mute">—</span>}</td>
        <td className="pl-3 whitespace-nowrap">{r.locked === 'protected' ? <Pill tone="info">Protected</Pill> : k ? <Pill tone={k.tone} pulse={k.pulse}>{k.label}</Pill> : <span className="text-mute">—</span>}</td>
      </tr>; })}</tbody></table></div>
  </section>;
}
