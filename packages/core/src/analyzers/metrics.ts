import { stringify } from 'yaml';
import type { Catalogue } from '../rules/catalogue.js';
import { definePlugin, AnalyzerPlugin, AnalyzerContext, skip, none, scoping } from './base.js';
import type { QueryEvidence } from '../types.js';

/** Built-in re-implementation of the playbook's Metrics Label Analyzer script. */
export async function labelAnalysis(ctx: AnalyzerContext) {
  if (ctx.shared.has('labels')) return ctx.shared.get('labels') as any;
  if (!ctx.connector.getLabelValues || !ctx.connector.getMetricSeries) { ctx.shared.set('labels', null); return null; }
  const { resolveSpanMetrics } = await import('../investigate/labels.js'); const sm = await resolveSpanMetrics(ctx);
  const metric = sm.calls ?? ctx.opts.spanMetric; if (!sm.calls) ctx.shared.set('spanMetricsMissing', true);
  const win = `${Math.round(ctx.opts.windowHours * 60)}m`; const at = ctx.opts.range?.end;
  const services = await ctx.connector.getLabelValues('service_name', win, metric, at);
  const perService: { service: string; series: number; spanNames: number; urls: number }[] = [];
  const csv: string[][] = [['service_name', 'span_name', 'http_url', 'k8s_cluster_name']];
  const uniq = new Set<string>(); const labelKeys = new Set<string>(); let totalSeries = 0;
  for (const svc of services) {
    const series = await ctx.connector.getMetricSeries({ metric, match: { service_name: svc }, window: win, at });
    totalSeries += series.length;
    const names = new Set<string>(), urls = new Set<string>();
    for (const s of series) {
      Object.keys(s).forEach((k) => labelKeys.add(k)); names.add(s.span_name ?? ''); if (s.http_url) urls.add(s.http_url);
      const row = [s.service_name ?? svc, s.span_name ?? '', s.http_url ?? '', s.k8s_cluster_name ?? '']; const k = row.join('\u0001');
      if (!uniq.has(k)) { uniq.add(k); csv.push(row); }
    }
    perService.push({ service: svc, series: series.length, spanNames: names.size, urls: urls.size });
    ctx.progress({ title: 'Metrics Label Analyzer', status: 'running', message: `${svc}: ${series.length} series` });
  }
  const ev: QueryEvidence = { id: 'metrics-label-analyzer', language: 'promql', pillar: 'traces', text: `GET /metrics/api/v1/series match[]=${metric}{service_name="<svc>"} for ${services.length} services`, window: win, limit: 0, rows: perService };
  const res = { metric, services, perService, csv, totalSeries, uniqueRows: uniq.size, labelKeys: [...labelKeys], ev };
  ctx.shared.set('labels', res); return res;
}

export function metricsPlugins(cat: Catalogue): AnalyzerPlugin[] {
  const th = cat.metrics.thresholds;
  return [
    definePlugin(cat, 'METRIC-LABEL-ANALYZER', 'metrics', {
      async detect(ctx) {
        const la = await labelAnalysis(ctx); if (!la) return skip('Metrics API not connected.');
        const flagged = la.perService.filter((s: any) => s.spanNames > th.healthySpanNamesPerService.max);
        return flagged.length ? { applicable: true, evidence: [la.ev], facts: { la, flagged }, observedVolume: `${flagged.length} of ${la.services.length} services above ${th.healthySpanNamesPerService.max} unique span names` } : null;
      },
      recommend: (x) => { const top = [...x.facts.la.perService].sort((a: any, b: any) => b.series - a.series).slice(0, 10); const fl = [...x.facts.flagged].sort((a: any, b: any) => b.series - a.series);
        return { display: { bars: { label: 'Top 10 services by span-metric series', items: top.map((s: any) => ({ name: s.service, value: s.series, text: `${s.series.toLocaleString('en-US')} series` })) },
          table: { summary: `All ${fl.length} services above the healthy range`, headers: ['Service', 'Span names', 'Series'], rows: fl.map((s: any) => [s.service, s.spanNames.toLocaleString('en-US'), s.series.toLocaleString('en-US')]) } },
        nextStep: 'Enable span-metrics sanitisation (Helm) or the redaction `url_sanitizer` (ECS/EC2); re-run this check 24 hours after the change.', detail: x.facts.flagged.map((s: any) => `${s.service}: ${s.spanNames} span names, ${s.series} series`).join('\n') }; },
      estimateSavings: () => scoping('Series reduction; convert via Metrics Usage Analyzer units after the change.'),
    }),
    definePlugin(cat, 'METRIC-HIGH-CHURN', 'metrics', {
      deploymentTypes: ['helm', 'ecs', 'ec2', 'standalone'],
      async detect(ctx) {
        const la = await labelAnalysis(ctx); if (!la) return skip('Metrics API not connected.');
        const churn = (th.highChurnLabels as string[]).filter((l) => la.labelKeys.includes(l));
        return churn.length ? { applicable: true, evidence: [la.ev], facts: { churn, la }, observedVolume: `${ctx.opts.spanMetric} carries ${churn.join(', ')} across ${la.totalSeries} series` } : null;
      },
      recommend: (x) => ({ display: { chips: { label: 'High-churn labels found', items: x.facts.churn } },
        nextStep: 'Remove these labels at the source with the protected-safe `reduceResourceAttributes` denylist (the Universal finding carries the config).', detail: `High-churn labels present: ${x.facts.churn.join(', ')}. Each restart creates new series.` }),
      estimateSavings: () => scoping('Series count drop is measured with the post-change label analysis.'),
    }),
    definePlugin(cat, 'METRIC-SPAN-ATTRS', 'metrics', {
      async detect(ctx) {
        const la = await labelAnalysis(ctx); if (!la) return skip('Metrics API not connected.');
        const bad = la.labelKeys.filter((k: string) => (th.unboundedLabelHints as string[]).some((h) => k.toLowerCase().includes(h)));
        return bad.length ? { applicable: true, evidence: [la.ev], facts: { bad } } : null;
      },
      recommend: (x) => ({ nextStep: 'Delete these attributes before span metrics are generated.', detail: x.facts.bad.join(', ') }),
      generateConfigPatch: (x) => { const body = { error_mode: 'ignore', trace_statements: [{ context: 'span', statements: x.facts.bad.map((k: string) => `delete_key(attributes, "${k.replace(/_/g, '.')}")`) }] };
        return { summary: 'Remove unbounded attributes from span metric dimensions', snippet: stringify({ processors: { 'transform/delete_key': body } }), ops: [{ kind: 'processor', name: 'transform/delete_key', body, signals: ['traces'], position: 'middle', helmComponents: ['opentelemetry-agent'] }] }; },
      estimateSavings: () => scoping('Series reduction depends on value spread.'),
    }),
    definePlugin(cat, 'METRIC-SPAN-SANITIZATION', 'metrics', {
      deploymentTypes: ['helm'],
      async detect(ctx) {
        const p = ctx.config.views.find((v) => v.name === 'opentelemetry-agent')?.presets?.spanMetricsSanitization;
        const disabled = p && (p.enabled === false || p.sanitize_url === false);
        const la = await labelAnalysis(ctx);
        const flagged = la ? la.perService.filter((s: any) => s.spanNames > th.healthySpanNamesPerService.max) : [];
        return disabled || flagged.length ? { applicable: true, evidence: la ? [la.ev] : [], facts: { disabled, flagged } } : null;
      },
      recommend: (x) => ({ nextStep: 'Keep spanMetricsSanitization at enabled: auto with sanitize_url: true (chart default when span metrics are on).', detail: x.facts.disabled ? 'Sanitisation is disabled in the current values.' : 'Services exceed the healthy span-name range.' }),
      generateConfigPatch: () => ({ summary: 'Enable span metrics sanitisation', snippet: '', ops: [{ kind: 'helmPreset', components: ['opentelemetry-agent'], preset: 'spanMetricsSanitization', value: { enabled: 'auto', sanitize_url: true, sanitizeDatabases: ['sql', 'redis', 'memcached', 'mongo', 'opensearch', 'es'] } }] }),
      estimateSavings: () => scoping('Series reduction; re-run the label analysis after 24 hours.'),
    }),
    definePlugin(cat, 'METRIC-CARDINALITY-LIMIT', 'metrics', {
      async detect(ctx) {
        const sm = ctx.config.views.flatMap((v) => Object.entries<any>(v.connectors).filter(([k]) => k.startsWith('spanmetrics')));
        const issues = sm.filter(([, b]) => !b?.aggregation_cardinality_limit || b?.dimensions_cache_size !== undefined).map(([k, b]) => `${k}: ${b?.dimensions_cache_size !== undefined ? 'uses deprecated dimensions_cache_size' : 'no aggregation_cardinality_limit'}`);
        return issues.length ? { applicable: true, evidence: [], facts: { issues } } : null;
      },
      recommend: (x) => ({ nextStep: 'Fix cardinality upstream first, then set aggregation_cardinality_limit near the steady-state series count. New combinations beyond the limit fold into one series with otel.metric.overflow="true".', detail: x.facts.issues.join('\n') }),
      estimateSavings: () => none('Safety cap; protects collector memory and storage.'),
    }),
    definePlugin(cat, 'METRIC-NO-PROB-SAMPLER', 'metrics', {
      async detect(ctx) {
        const bad = ctx.config.views.flatMap((v) => Object.entries(v.pipelines).filter(([p, d]) => p.startsWith('metrics') && (d.processors ?? []).some((x) => x.startsWith('probabilistic_sampler'))).map(([p]) => `${v.name}/${p}`));
        return bad.length ? { applicable: true, evidence: [], facts: { bad } } : null;
      },
      recommend: () => ({ nextStep: 'Remove probabilistic_sampler from metrics pipelines; use deterministic OTTL filtering or SDK-level sampling.' }),
      estimateSavings: () => none('Correctness fix.'),
    }),
    definePlugin(cat, 'METRIC-UNUSED', 'metrics', {
      async detect() { return { applicable: true, evidence: [], facts: {}, forceStatus: 'needs-scoping', observedVolume: 'Guided check in the Coralogix UI' }; },
      recommend: () => ({ display: { steps: cat.rules['METRIC-UNUSED'].steps ?? [] }, nextStep: 'Run the guided check above and share the block candidates with the TAM.', caveats: ['Coralogix Lens never blocks metrics automatically.'] }),
      estimateSavings: () => scoping('Units come from the Metrics Usage Analyzer for the blocked metrics.'),
    }),
    definePlugin(cat, 'METRIC-SCRAPE-INTERVAL', 'metrics', {
      async detect(ctx) {
        const short: string[] = [];
        for (const v of ctx.config.views) for (const [k, r] of Object.entries<any>(v.receivers)) if (k.startsWith('prometheus')) for (const sc of r?.config?.scrape_configs ?? []) {
          const iv = String(sc.scrape_interval ?? r?.config?.global?.scrape_interval ?? ''); const s = /^(\d+)s$/.exec(iv)?.[1];
          if (s && +s < cat.rules['METRIC-SCRAPE-INTERVAL'].thresholds.targetSeconds && !/autoscal|hpa|keda/i.test(sc.job_name)) short.push(`${sc.job_name} (${iv})`);
        }
        return short.length ? { applicable: true, evidence: [], facts: { short } } : null;
      },
      recommend: (x) => ({ nextStep: 'Raise these jobs to 60s; keep short intervals only for autoscaling signals.', detail: x.facts.short.join(', ') }),
      estimateSavings: () => scoping('A 15s→60s change cuts samples for that job by about 4×; size with Metrics Usage Analyzer units per job.'),
    }),
    definePlugin(cat, 'METRIC-REDACTION', 'metrics', {
      async detect(ctx) {
        if (/redaction/.test(ctx.config.text)) return null;
        const la = await labelAnalysis(ctx);
        const flagged = la ? la.perService.filter((s: any) => s.spanNames > th.healthySpanNamesPerService.max || s.urls > th.healthySpanNamesPerService.max) : [];
        return flagged.length ? { applicable: true, evidence: [la.ev], facts: { flagged } } : null;
      },
      recommend: () => ({ nextStep: 'Add the redaction processor with url_sanitizer and db_sanitizer before span metrics; run with summary: debug first to see what changes.', caveats: ['url_sanitizer/db_sanitizer are documented in the current redaction README (traces: beta). If the customer\'s collector rejects them, fall back to transform + replace_pattern.'] }),
      generateConfigPatch: () => { const body = { allow_all_keys: true, url_sanitizer: { enabled: true, attributes: ['http.url', 'url.full', 'http.target'], sanitize_span_name: true }, db_sanitizer: { sanitize_span_name: true, sql: { enabled: true, attributes: ['db.statement', 'db.query.text'] } }, summary: 'debug' };
        return { summary: 'Sanitise URLs and DB statements (redaction)', snippet: stringify({ processors: { 'redaction/span': body } }), ops: [{ kind: 'processor', name: 'redaction/span', body, signals: ['traces'], position: 'middle' }] }; },
      estimateSavings: () => scoping('Series reduction; re-run label analysis after 24 hours.'),
    }),
    definePlugin(cat, 'METRIC-FILTER-UNUSED', 'metrics', {
      async detect() { return { applicable: true, evidence: [], facts: {}, forceStatus: 'needs-scoping' }; },
      recommend: () => ({ nextStep: 'After the Metrics Usage Analyzer review, drop unused metrics at the collector with a filter processor (by name, regex or attribute).' }),
      estimateSavings: () => scoping('Depends on the metrics chosen.'),
    }),
  ];
}
