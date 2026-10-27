import { loadCatalogue } from '../rules/catalogue.js';
import type { Finding, SignalType, Tier, UsageDay, UsageStats } from '../types.js';

/** Units per GB using ONLY the official per-pillar, per-tier table (rules/units.yaml). */
export function unitsPerGb(pillar: SignalType, tier: Tier = 'high'): number {
  const u = loadCatalogue().units;
  if (pillar === 'metrics') return u.metrics.default;
  const table = pillar === 'logs' ? u.logs : u.traces;
  const t = tier === 'default' ? u.defaultTier : tier;
  const rate = table[t];
  if (rate === undefined) throw new Error(`No official unit rate for ${pillar}/${tier}`);
  return rate;
}
export function gbToUnits(gb: number, pillar: SignalType, tier: Tier = 'high'): number { return gb * unitsPerGb(pillar, tier); }

/**
 * The last `n` COMPLETE days of usage. The day the usage was read on is still in progress, so it is left out
 * (including it pulled the 7-day average down by roughly a seventh of a day).
 */
export function completeDays(usage: UsageStats | null, n = 7): UsageDay[] {
  if (!usage?.days.length) return [];
  const today = (usage.fetchedAt ?? new Date().toISOString()).slice(0, 10);
  return usage.days.filter((d) => d.date.slice(0, 10) < today).slice(-n);
}

/** Blended rate from the customer's own usage (Coralogix computes those units from the same official table). */
export function effectiveRate(usage: UsageStats | null, pillar: SignalType): { rate: number; basis: string } {
  if (usage && usage.days.length) {
    let gb = 0, units = 0;
    for (const d of completeDays(usage)) for (const [k, v] of Object.entries(d.byPillarTier)) if (k.startsWith(pillar + ':')) { gb += v.gb; units += v.units; }
    if (gb > 0) return { rate: units / gb, basis: `the customer's blended ${pillar} rate over the last 7 complete days (${(units / gb).toFixed(3)} units/GB, from official tier rates)` };
  }
  const r = unitsPerGb(pillar, 'high');
  return { rate: r, basis: `the official ${pillar} High-tier rate (${r} units/GB); no usage data was available` };
}

export function pillarDailyGb(usage: UsageStats | null, pillar: SignalType): number | null {
  const last = completeDays(usage); if (!last.length) return null; let gb = 0;
  for (const d of last) for (const [k, v] of Object.entries(d.byPillarTier)) if (k.startsWith(pillar + ':')) gb += v.gb;
  return gb / last.length;
}
export function pillarTierDaily(usage: UsageStats | null, pillar: SignalType): Record<string, { gb: number; units: number }> {
  const out: Record<string, { gb: number; units: number }> = {};
  const last = completeDays(usage); if (!last.length) return out;
  for (const d of last) for (const [k, v] of Object.entries(d.byPillarTier)) if (k.startsWith(pillar + ':')) {
    const t = k.split(':')[1]; out[t] ??= { gb: 0, units: 0 }; out[t].gb += v.gb / last.length; out[t].units += v.units / last.length;
  }
  return out;
}

export function baselineUnitsPerDay(usage: UsageStats | null): number | null {
  const last = completeDays(usage); if (!last.length) return null;
  return last.reduce((a, d) => a + d.totalUnits, 0) / last.length;
}

export interface OverlapGroup { ids: string[]; note: string; maxUnits: number; naiveSum: number }

/** Overlap groups = connected components over overlapsWith, restricted to findings present. */
export function overlapGroups(findings: Finding[]): OverlapGroup[] {
  findings = findings.filter((f) => f.countedInTotal !== false);
  const byRule = new Map(findings.map((f) => [f.ruleId, f]));
  const adj = new Map<string, Set<string>>();
  const link = (a: string, b: string) => { if (!adj.has(a)) adj.set(a, new Set()); adj.get(a)!.add(b); };
  for (const f of findings) for (const o of f.overlapsWith) if (byRule.has(o) && o !== f.ruleId) { link(f.ruleId, o); link(o, f.ruleId); }
  const seen = new Set<string>(); const groups: OverlapGroup[] = [];
  for (const start of adj.keys()) {
    if (seen.has(start)) continue;
    const comp: string[] = []; const stack = [start];
    while (stack.length) { const n = stack.pop()!; if (seen.has(n)) continue; seen.add(n); comp.push(n); for (const m of adj.get(n) ?? []) stack.push(m); }
    const fs = comp.map((r) => byRule.get(r)!);
    const withUnits = fs.filter((f) => (f.savings.unitsPerDay ?? 0) > 0);
    const vals = fs.map((f) => f.savings.unitsPerDay ?? 0);
    const biggest = fs.reduce((a, b) => ((b.savings.unitsPerDay ?? 0) > (a.savings.unitsPerDay ?? 0) ? b : a), fs[0]);
    const names = fs.map((f) => f.id).sort().join(', ');
    groups.push({
      ids: fs.map((f) => f.id), maxUnits: Math.max(0, ...vals), naiveSum: vals.reduce((a, b) => a + b, 0),
      note: withUnits.length > 1
        ? `${names} overlap: they act on some of the same data, so do not add their savings. The combined total counts only the largest, ${biggest.id}. Apply the simpler change first if you like; ${biggest.id} still delivers most of the saving on its own.`
        : `${names} overlap: they act on some of the same data. Only ${biggest.id} carries a saving estimate, so nothing is double counted.`,
    });
  }
  return groups;
}

/** Combined savings without double counting. Each overlap group contributes its max; others add. Capped at baseline. */
export function combinedSavings(findings: Finding[], baseline: number | null): { total: number; groups: OverlapGroup[] } {
  const groups = overlapGroups(findings);
  const inGroup = new Set(groups.flatMap((g) => g.ids));
  let total = groups.reduce((a, g) => a + g.maxUnits, 0);
  for (const f of findings) if (!inGroup.has(f.id) && f.countedInTotal !== false) total += f.savings.unitsPerDay ?? 0;
  if (baseline !== null) total = Math.min(total, baseline);
  return { total, groups };
}

export const fmtUnits = (u: number | null | undefined) => (u === null || u === undefined ? 'TBD' : u >= 10 ? `~${u.toFixed(1)}` : `~${u.toFixed(u >= 1 ? 2 : 3)}`);
export const fmtGb = (g: number | null | undefined) => (g === null || g === undefined ? '—' : g >= 1 ? `${g.toFixed(2)} GB` : `${(g * 1000).toFixed(1)} MB`);
