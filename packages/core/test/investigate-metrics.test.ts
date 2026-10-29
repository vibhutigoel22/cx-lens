import { describe, it, expect } from 'vitest';
import { runAssessment, quantile, isProtectedMetricLabel, buildReport, renderHtml } from '../src/index.js';
import { demo, customer } from './helpers.js';

describe('metrics helpers', () => {
  it('interpolates percentiles from cumulative buckets like histogram_quantile', () => {
    const b = [{ le: 10, c: 50 }, { le: 100, c: 90 }, { le: 1000, c: 100 }, { le: Infinity, c: 100 }];
    expect(quantile(b, 0.5)).toBeCloseTo(10); expect(quantile(b, 0.9)).toBeCloseTo(100); expect(quantile(b, 0.95)).toBeCloseTo(550);
  });
  it('treats underscore forms of protected labels as protected', () => { for (const l of ['cloud_region', 'host_name', 'host_id', 'cloud_account_id', 'azure_vm_name']) expect(isProtectedMetricLabel(l)).toBe(true); expect(isProtectedMetricLabel('process_pid')).toBe(false); });
});

describe('metrics in Investigate mode (recorded live data)', async () => {
  const a = await runAssessment({ connector: demo(), customer, pillars: ['universal', 'metrics'], deployment: 'helm', options: { investigate: { enabled: true, maxContributors: 8, vendor: 'Datadog' } } });
  const m = a.findings.filter((f) => f.source === 'investigate' && f.pillar === 'metrics');
  it('finds the label driving cardinality and measures the effect with PromQL', () => {
    const p = m.find((f) => f.ruleId.startsWith('INV:metric:') && f.display!.validation!.ok)!;
    expect(p.display!.validation!.query).toMatch(/^count\(count without \(\w+\) \(count_over_time\(\w+\[1440m\]\)\)\)$/);
    expect(p.savings.kind).toBe('units'); expect(p.savings.basis).toMatch(/Metric Usage API/); // exact units per metric from the recorded API
    expect(p.change!.snippet).toMatch(/metric_statements:[\s\S]*context: datapoint[\s\S]*delete_key/);
  });
  it('reports measured effects truthfully: a change that removes nothing claims nothing', () => { for (const f of m.filter((x) => x.ruleId.startsWith('INV:'))) if (/ 0 fewer|did not change any real value/.test(f.display?.validation?.result ?? '')) expect(f.savings.kind).not.toBe('units'); });
  it('span-name skill: patterns tested on every real span name; no saving claimed when nothing changes', () => {
    const s = m.find((f) => f.ruleId === 'INV:skill:span-name-cardinality-analyzer')!; expect(s.display!.validation!.result).toMatch(/unique span names/);
    expect(s.display!.samples!.items.length).toBeGreaterThan(0); if (!s.display!.validation!.ok) expect(s.savings.kind).toBe('needs-scoping');
  });
  it('bucket skill: Lens computes percentiles and the series change', () => {
    const b = m.find((f) => f.ruleId === 'INV:skill:span-metrics-bucket-optimizer')!;
    expect(b.display!.table!.headers).toEqual(['Service', 'p50 ms', 'p95 ms', 'p99 ms', 'Note']); expect(b.display!.table!.rows.length).toBeGreaterThan(0);
    expect(b.change!.snippet).toMatch(/opentelemetry-agent:\s*\n\s*presets:\s*\n\s*spanMetrics:\s*\n\s*histogramBuckets:/); // Helm: the chart’s own preset expect(b.caveats.join()).toMatch(/Datadog/);
    expect(b.observedVolume).toMatch(/^duration_ms_bucket/); // the costliest histogram, not db_duration_ms_bucket
  });
  it('reports render the metric findings', () => { const html = renderHtml(buildReport(a)); expect(html).toContain('Distinct values per label'); expect(html).toContain('Latency per top service'); });
});

describe('metric suggestions are rejected when unsafe', () => {
  it('blocks dropping a metric that alerts use, and protected labels', async () => {
    const c = demo(); const orig = c.listResources.bind(c);
    (c as any).listResources = async (k: string) => (k === 'alerts' ? [{ query: 'sum(rate(process_cpu_utilization_1[5m])) by (process_pid) > 0.9' }] : orig(k));
    const ai = c.askAI!; (c as any).askAI = async (p: string, s: string, o: any) => (p.includes('### metric:') ? { text: '', json: { contributors: [
      { key: 'metric:process_cpu_utilization_1', title: 'Drop it', what_it_is: 'x', value: 'low', action: 'drop_metric', why_it_matters: 'y', next_step: 'n', verify_questions: [], confidence: 'high' },
      { key: 'metric:process_cpu_time_total', title: 'Drop region', what_it_is: 'x', value: 'low', action: 'drop_label', label: 'cloud_region', why_it_matters: 'y', next_step: 'n', verify_questions: [], confidence: 'high' }] } } : ai(p, s, o));
    const a = await runAssessment({ connector: c, customer, pillars: ['metrics'], deployment: 'helm', options: { investigate: { enabled: true, maxContributors: 8, skills: { spanNames: false, buckets: false } } } });
    const d = a.findings.find((f) => f.title === 'Drop it')!; expect(d.display!.validation!.ok).toBe(false); expect(d.display!.validation!.result).toMatch(/referenced 1 time/); expect(d.savings.kind).toBe('needs-scoping');
    const r = a.findings.find((f) => f.title === 'Drop region')!; expect(r.display!.validation!.result).toMatch(/protected label/);
  });
});
describe('Investigate finding ids survive the API', () => {
  it('ids with colons and spaces round-trip through URL encoding', () => {
    const id = 'INV:span:frontend-proxy::router frontend egress';
    expect(decodeURIComponent(encodeURIComponent(id))).toBe(id); expect(encodeURIComponent(id)).not.toMatch(/[: ]/);
  });
});
