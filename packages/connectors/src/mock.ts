import { readFileSync } from 'node:fs';
import type { Connector, MetricSeriesRequest, QueryEvidence, QueryRequest, UsageStats } from '@cx-lens/core';

export interface Fixture { metricUsage?: { labels?: any; metrics?: any; byLabel?: Record<string, any[]> }; promql?: Record<string, any[]>; recordedAt: string; source: string; queries: Record<string, { rows?: any[]; error?: string }>; usage: UsageStats | null; labels: Record<string, string[]>; series: Record<string, Record<string, string>[]>; resources: Record<string, unknown[] | null>; ai?: Record<string, string> }
export const fixtureKey = (q: { pillar: string; text: string }) => `${q.pillar}|${q.text}`;

/** Replays recorded (anonymised) data for tests and demo mode. Unknown queries return an empty result. */
export class MockAdapter implements Connector {
  readonly id = 'mock';
  askAI?: Connector['askAI'];
  metricUsage?: Connector['metricUsage'];
  constructor(public fx: Fixture) {
    if (fx.metricUsage?.labels) { const u = fx.metricUsage; this.metricUsage = { labels: async () => u.labels, metrics: async () => u.metrics ?? { totalUnits: 0, totalBytes: 0, totalSeries: 0, rows: [] }, metricsForLabel: async (l: string) => u.byLabel?.[l] ?? [] }; } if (fx.ai && Object.keys(fx.ai).length) this.askAI = async (p: string) => { const k = /\bSKILL:([\w-]+)/.exec(p)?.[1] ?? (/### label:/.test(p) ? 'labels' : /### metric:/.test(p) ? 'metrics' : 'investigate'); const text = fx.ai![k]; if (text === undefined) return null; let json: unknown; try { json = JSON.parse(text); } catch { /* text answer */ } return { text, json }; }; }
  static fromFile(p: string) { return new MockAdapter(JSON.parse(readFileSync(p, 'utf8'))); }
  async healthCheck() { return { ok: true, detail: `Demo data recorded ${this.fx.recordedAt.slice(0, 10)}`, capabilities: ['logs', 'spans', 'usage', 'metrics-api'] }; }
  async listTeams() { return [{ name: 'demo', region: 'ap1' }]; }
  async runQuery(q: QueryRequest): Promise<QueryEvidence> { const r = this.fx.queries[fixtureKey(q)]; return { ...q, rows: r?.rows ?? [], error: r?.error, ms: 1 }; }
  async getUsageStats() { return this.fx.usage ? { ...this.fx.usage, fetchedAt: this.fx.usage.fetchedAt ?? this.fx.recordedAt } : null; }
  async getLabelValues(label: string) { return this.fx.labels[label] ?? []; }
  async getMetricSeries(req: MetricSeriesRequest) { return this.fx.series[JSON.stringify(req.match ?? {})] ?? []; }
  async listResources(kind: string) { return this.fx.resources[kind] ?? null; }
  async promql(expr: string) { return this.fx.promql?.[expr] ?? []; }
}

/** Wraps a live connector and records everything (for building fixtures). */
export class RecordingConnector implements Connector {
  readonly id: string; fx: Fixture; askAI?: Connector['askAI'];
  metricUsage?: Connector['metricUsage'];
  constructor(private inner: Connector) {
    if (inner.metricUsage) { const mu = inner.metricUsage; const fx = () => (this.fx.metricUsage ??= { byLabel: {} });
      this.metricUsage = { labels: async (n) => (fx().labels = await mu.labels(n)), metrics: async (n) => (fx().metrics = await mu.metrics(n)), metricsForLabel: async (l, n) => ((fx().byLabel ??= {})[l] = await mu.metricsForLabel(l, n)) }; } this.id = `recording(${inner.id})`; this.fx = { recordedAt: new Date().toISOString(), source: inner.id, queries: {}, usage: null, labels: {}, series: {}, resources: {}, ai: {} };
    if (inner.askAI) this.askAI = async (p, s, o) => { const r = await inner.askAI!(p, s, o); if (r) { const k = /\bSKILL:([\w-]+)/.exec(p)?.[1] ?? (/### label:/.test(p) ? 'labels' : /### metric:/.test(p) ? 'metrics' : 'investigate'); this.fx.ai![k] = r.json ? JSON.stringify(r.json) : r.text; } return r; }; }
  healthCheck() { return this.inner.healthCheck(); }
  listTeams() { return this.inner.listTeams(); }
  async runQuery(q: QueryRequest) { const r = await this.inner.runQuery(q); this.fx.queries[fixtureKey(q)] = { rows: r.rows, error: r.error }; return r; }
  async getUsageStats(d: number) { const u = await this.inner.getUsageStats(d); this.fx.usage = u; return u; }
  async getLabelValues(l: string, w: string, m?: string) { const v = (await this.inner.getLabelValues?.(l, w, m)) ?? []; this.fx.labels[l] = v; return v; }
  async getMetricSeries(req: MetricSeriesRequest) { const v = (await this.inner.getMetricSeries?.(req)) ?? []; this.fx.series[JSON.stringify(req.match ?? {})] = v; return v; }
  async listResources(k: any) { const v = (await this.inner.listResources?.(k)) ?? null; this.fx.resources[k] = v; return v; }
  async promql(expr: string, at?: string) { const v = (await this.inner.promql?.(expr, at)) ?? []; (this.fx.promql ??= {})[expr] = v; return v; }
}
