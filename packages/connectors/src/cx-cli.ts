import type { Connector, MetricSeriesRequest, QueryEvidence, QueryRequest, UsageStats } from '@cx-lens/core';
import { extractJson, redactSecrets, run, which } from './exec.js';

export interface CxTeam { name: string; region: string; profile?: string; keychainAccount?: string }

/**
 * Read-only adapter over the Coralogix `cx` CLI. Commands are discovered from `cx schema` at startup
 * and only used if present — nothing is hard-coded without confirmation.
 */
export class CxCliAdapter implements Connector {
  readonly id = 'cx-cli';
  private commands = new Set<string>();
  private version = '';
  constructor(private team: CxTeam, private getKey: () => Promise<string | null> = async () => null, private bin = 'cx') {}

  async discover(): Promise<Set<string>> {
    if (this.commands.size) return this.commands;
    const v = await run(this.bin, ['--version']); this.version = v.stdout.trim();
    const s = await run(this.bin, ['schema'], { timeoutMs: 20000 });
    const walk = (n: any, prefix: string[]) => { if (!n || typeof n !== 'object') return; const name = n.name; const path = name && name !== 'cx' ? [...prefix, name] : prefix; if (path.length) this.commands.add(path.join(' ')); for (const c of n.subcommands ?? n.commands ?? []) walk(c, path); };
    try { walk(extractJson(s.stdout), []); } catch { /* fall back to --help parsing */ }
    if (!this.commands.size) { const h = await run(this.bin, ['--help']); for (const m of h.stdout.matchAll(/^\s{2}([a-z][a-z0-9-]+)\s{2,}/gm)) this.commands.add(m[1]); }
    return this.commands;
  }
  has(cmd: string) { return [...this.commands].some((c) => c === cmd || c.endsWith(' ' + cmd) || c.startsWith(cmd)); }

  private static lastCall = 0;
  /** Global throttle + retry on 429 honouring "Retry after N seconds" from the API. */
  private async cx(args: string[], timeoutMs = 120000) {
    for (let attempt = 0; ; attempt++) {
      const gap = CxCliAdapter.lastCall + this.minGapMs - Date.now(); if (gap > 0) await new Promise((r) => setTimeout(r, gap));
      CxCliAdapter.lastCall = Date.now();
      try { return await this.cxOnce(args, timeoutMs); }
      catch (e) {
        const m = String((e as Error).message).match(/\(429\)[\s\S]*?Retry after (\d+)/);
        if (!m || attempt >= 6) throw e;
        await new Promise((r) => setTimeout(r, (+m[1] + 1) * 1000 + attempt * 500));
      }
    }
  }
  minGapMs = 1100;
  private async cxOnce(args: string[], timeoutMs: number) {
    const env: Record<string, string> = {}; const g: string[] = [];
    if (this.team.profile) g.push('-p', this.team.profile);
    else { const k = await this.getKey(); if (k) { env.CX_API_KEY = k; g.push('--region', this.team.region); } }
    const r = await run(this.bin, ['--read-only', ...g, ...args, '-o', 'json'], { env, timeoutMs });
    if (r.code !== 0) throw new Error(redactSecrets((r.stderr.match(/Caused by:[\s\S]*?(?=\n\nStack|$)/)?.[0] ?? r.stderr).trim().slice(0, 600)));
    return { json: extractJson(r.stdout), ms: r.ms };
  }

  async healthCheck() {
    if (!which(this.bin)) return { ok: false, detail: 'cx CLI not found. Install: brew install coralogix/tap/cx (see coralogix.com/docs/external/cx-cli/)', capabilities: [] };
    await this.discover();
    try { await this.cx(['logs', 'limit 1', '--start', 'now-15m', '--limit', '1'], 60000); return { ok: true, detail: `${this.version} · team ${this.team.name} (${this.team.region})`, capabilities: [...this.commands].filter((c) => /^(logs|spans|usage|tco|slos|e2m|alerts|recording-rules|metrics)\b/.test(c)) }; }
    catch (e) { return { ok: false, detail: (e as Error).message, capabilities: [...this.commands] }; }
  }
  async listTeams() {
    const r = await run(this.bin, ['profiles', 'list']);
    return r.stdout.split('\n').slice(2).map((l) => l.trim().split(/\s{2,}/)).filter((c) => c.length >= 3).map((c) => ({ name: c[0], region: c[2] }));
  }
  async runQuery(q: QueryRequest): Promise<QueryEvidence> {
    const t0 = Date.now();
    try {
      const sub = q.pillar === 'traces' ? 'spans' : 'logs';
      const { json } = await this.cx([sub, q.text, '--start', q.start ?? `now-${q.window}`, '--end', q.end ?? 'now', '--limit', String(q.limit)]);
      return { ...q, rows: Array.isArray(json) ? (json as any[]) : [json as any], ms: Date.now() - t0 };
    } catch (e) { return { ...q, error: (e as Error).message, ms: Date.now() - t0 }; }
  }
  async getUsageStats(days: number): Promise<UsageStats | null> {
    try {
      const u: any = (await this.cx(['usage', 'daily', '--type', 'units', '--start', `now-${days}d`])).json;
      const g: any = (await this.cx(['usage', 'daily', '--type', 'processed-gbs', '--start', `now-${days}d`])).json;
      return normaliseUsage(u.units ?? [], g.gbs ?? []);
    } catch { return null; }
  }
  /**
   * Metrics through `cx metrics query` (PromQL). Uses cx's own sign-in (OAuth or API key, Keychain or file),
   * so Lens never needs or reads the key. Verified against the Metrics API: identical series counts.
   */
  async promql(expr: string, at?: string): Promise<{ metric: Record<string, string>; value: [number, string] }[]> {
    const { json } = await this.cx(['metrics', 'query', expr, ...(at ? ['--time', at] : [])]);
    return Array.isArray(json) ? (json as any[]) : [];
  }
  async getLabelValues(label: string, window: string, metric?: string, at?: string): Promise<string[]> {
    const rows = await this.promql(labelValuesExpr(label, window, metric ?? 'up'), at);
    return rows.map((r) => r.metric?.[label]).filter((v): v is string => typeof v === 'string').sort();
  }
  async getMetricSeries(req: MetricSeriesRequest): Promise<Record<string, string>[]> {
    const rows = await this.promql(seriesExpr(req), req.at);
    return rows.map((r) => ({ __name__: req.metric, ...r.metric }));
  }
  async listResources(kind: 'slos' | 'e2m' | 'tco' | 'alerts' | 'recording-rules') {
    const args = kind === 'tco' ? ['tco', 'list'] : [kind, 'list'];
    try { const j = (await this.cx(args)).json; return Array.isArray(j) ? j : []; } catch { return null; }
  }
}

/** cx usage daily returns {statsDate, highLogsUnits:{value}, ...}; map keys like highLogsUnits → logs:high. */
export function normaliseUsage(units: any[], gbs: any[]): UsageStats {
  const map = (k: string) => { const m = k.match(/^(high|medium|low|blocked)(Logs|Tracing|Metrics|SessionRecording)(Units|Gbs)$/); if (!m) return null; const p = { Logs: 'logs', Tracing: 'traces', Metrics: 'metrics', SessionRecording: 'sessionRecording' }[m[2]]!; return `${p}:${m[1]}`; };
  const byDate = new Map<string, any>();
  for (const d of units) { const e = { date: d.statsDate, byPillarTier: {} as Record<string, { gb: number; units: number }>, totalUnits: d.totalUnits?.value ?? 0, totalGb: 0 }; for (const [k, v] of Object.entries<any>(d)) { const key = map(k); if (key && v?.value) (e.byPillarTier[key] ??= { gb: 0, units: 0 }).units = v.value; } if (d.cpuProfilesUnits?.value) e.byPillarTier['profiles:default'] = { gb: 0, units: d.cpuProfilesUnits.value }; byDate.set(d.statsDate, e); }
  for (const d of gbs) { const e = byDate.get(d.statsDate); if (!e) continue; e.totalGb = d.totalGbs?.value ?? 0; for (const [k, v] of Object.entries<any>(d)) { const key = map(k); if (key && v?.value) (e.byPillarTier[key] ??= { gb: 0, units: 0 }).gb = v.value; } if (d.cpuProfilesGbs?.value) (e.byPillarTier['profiles:default'] ??= { gb: 0, units: 0 }).gb = d.cpuProfilesGbs.value; }
  return { days: [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date)), fetchedAt: new Date().toISOString() };
}

const esc = (v: string) => v.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const sel = (metric: string, match: Record<string, string> = {}) => `${metric}{${Object.entries(match).map(([k, v]) => `${k}="${esc(v)}"`).join(',')}}`;
/** Distinct values of a label seen on `metric` during the window. */
export const labelValuesExpr = (label: string, window: string, metric: string) => `count by (${label}) (count_over_time(${sel(metric)}[${window}]))`;
/** Every series of `metric` (matching labels) that had samples during the window — same set as /api/v1/series. */
export const seriesExpr = (req: MetricSeriesRequest) => `count_over_time(${sel(req.metric, req.match)}[${req.window}])`;
