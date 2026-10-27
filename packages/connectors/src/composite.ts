import type { Connector, MetricSeriesRequest, QueryEvidence, QueryRequest, UsageStats } from '@cx-lens/core';
import type { CxCliAdapter } from './cx-cli.js';
import type { MetricsApiAdapter } from './metrics-api.js';
import type { ClaudeCliAdapter } from './claude-cli.js';

/** One Connector the engine uses: cx for queries/usage, Metrics API for series, claude for AI review. */
export class CompositeConnector implements Connector {
  readonly id: string;
  askAI?: Connector['askAI'];
  metricUsage?: Connector['metricUsage'];
  constructor(private cx: CxCliAdapter, private metrics?: MetricsApiAdapter, private claude?: ClaudeCliAdapter) {
    this.id = ['cx-cli', metrics && 'metrics-api-fallback', claude?.available() && 'claude-cli'].filter(Boolean).join('+');
    if (claude?.available()) this.askAI = (prompt, sample, o) => claude.ask(sample ? `${prompt}\n\nMasked sample:\n${sample}` : prompt, [], o?.schema);
  }
  async healthCheck() { const c = await this.cx.healthCheck(); return { ok: c.ok, detail: c.detail, capabilities: [...c.capabilities, ...(this.metrics ? ['metrics-api-fallback'] : [])] }; }
  listTeams() { return this.cx.listTeams(); }
  runQuery(q: QueryRequest): Promise<QueryEvidence> { return this.cx.runQuery(q); }
  getUsageStats(days: number): Promise<UsageStats | null> { return this.cx.getUsageStats(days); }
  /** Metrics go through cx first (its own sign-in). The direct Metrics API is only a fallback when a key was given explicitly. */
  async getLabelValues(label: string, window: string, metric?: string, at?: string) {
    try { return await this.cx.getLabelValues(label, window, metric, at); }
    catch (e) { if (this.metrics) return this.metrics.getLabelValues(label, window, metric, at); throw e; }
  }
  async getMetricSeries(req: MetricSeriesRequest) {
    try { return await this.cx.getMetricSeries(req); }
    catch (e) { if (this.metrics) return this.metrics.getMetricSeries(req); throw e; }
  }
  promql(expr: string, at?: string) { return this.cx.promql(expr, at); }
  listResources(kind: 'slos' | 'e2m' | 'tco' | 'alerts' | 'recording-rules') { return this.cx.listResources(kind); }
}
