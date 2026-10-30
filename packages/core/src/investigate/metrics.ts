import { stringify } from 'yaml';
import type { AnalyzerContext } from '../analyzers/base.js';
import { fmtCount } from '../analyzers/base.js';
import { maskText } from '../masking/pii.js';
import { isProtectedLabel } from '../guard/protected.js';
import { effectiveRate, pillarDailyGb } from '../units/calculator.js';
import { compareVersions } from '../versions/semver.js';
import { resolveSources, loadCatalogue } from '../rules/catalogue.js';
import type { Finding, FindingDisplay } from '../types.js';
import { askClaude } from './claude-call.js';

/** PromQL helpers. `*_over_time` functions drop __name__, so ranking uses an instant query and churn is measured per metric. */
export const winOf = (ctx: AnalyzerContext) => `${Math.round(ctx.opts.windowHours * 60)}m`;
export async function pq(ctx: AnalyzerContext, expr: string): Promise<{ metric: Record<string, string>; value: [number, string] }[]> {
  if (!ctx.connector.promql) return [];
  try { return await ctx.connector.promql(expr, ctx.opts.range?.end); } catch { return []; }
}
export const scalar = (r: { value: [number, string] }[]) => Number(r[0]?.value?.[1] ?? 0) || 0;
const promLabel = (k: string) => k.replace(/\./g, '_');
/** Protected labels appear in metrics with underscores (cloud_region, host_name). */
export const isProtectedMetricLabel = (l: string) => isProtectedLabel(l) || isProtectedLabel(l.replace(/_/g, '.')) || ['cloud_account_id', 'cloud_availability_zone', 'host_image_id'].includes(l);
const seriesText = (m: string, labels: Record<string, string>) => `${m}{${Object.entries(labels).filter(([k]) => k !== '__name__').map(([k, v]) => `${k}="${v}"`).join(', ')}}`;

export const METRICS_SCHEMA = {
  type: 'object', required: ['contributors'],
  properties: { contributors: { type: 'array', items: { type: 'object',
    required: ['key', 'title', 'what_it_is', 'value', 'action', 'why_it_matters', 'next_step', 'verify_questions', 'confidence'],
    properties: {
      key: { type: 'string' }, title: { type: 'string' }, what_it_is: { type: 'string' }, value: { enum: ['high', 'medium', 'low'] },
      signals: { type: 'array', items: { type: 'string' } },
      action: { enum: ['drop_label', 'normalise_label', 'reduce_buckets', 'drop_metric', 'fix_at_source', 'keep'] },
      why_it_matters: { type: 'string' },
      label: { type: 'string', description: 'For drop_label / normalise_label: the Prometheus-style label name as shown.' },
      regex: { type: 'string', description: 'For normalise_label: RE2 pattern applied to the label value.' }, replacement: { type: 'string' },
      buckets: { type: 'array', items: { type: 'number' }, description: 'For reduce_buckets: new explicit bucket bounds in the metric’s unit (e.g. ms), ascending, without +Inf.' },
      ottl_statements: { type: 'array', items: { type: 'string' }, description: 'transform processor statements, context datapoint, unprefixed paths: attributes["k"].' },
      source_fix: { type: 'string' }, next_step: { type: 'string' }, verify_questions: { type: 'array', items: { type: 'string' } }, confidence: { enum: ['high', 'medium', 'low'] },
    } } } },
} as const;

interface MContrib { key: string; metric: string; seriesNow: number; seriesWindow: number; labels: { name: string; distinct: number }[]; samples: string[]; raw: Record<string, string>[] }

export async function investigateMetrics(ctx: AnalyzerContext, max: number): Promise<{ findings: Finding[]; notes: string[]; totalSeries: number; top: string[] }> {
  const notes: string[] = []; const cat = loadCatalogue(); const W = winOf(ctx);
  if (!ctx.connector.promql) return { findings: [], notes: ['Metrics investigation needs cx metrics queries.'], totalSeries: 0, top: [] };
  ctx.progress({ checkId: 'INVESTIGATE', title: 'Investigate with Claude', status: 'running', message: 'Ranking metrics by series' });
  // Rank: exact units per metric from the Metric Usage API when available; otherwise series over the window, so churn counts.
  let rank: { metric: Record<string, string>; value: [number, string] }[] = []; const unitsByMetric = new Map<string, number>();
  if (ctx.connector.metricUsage) { try { const mu = await ctx.connector.metricUsage.metrics(Math.max(max, 10)); for (const r of mu.rows.slice(0, max)) { unitsByMetric.set(r.name, r.units); rank.push({ metric: { __name__: r.name }, value: [0, String(r.unique)] }); } } catch { /* fall back to PromQL */ } }
  if (!rank.length) {
    const live = await pq(ctx, `topk(${Math.min(25, max * 3)}, count by (__name__) ({__name__=~".+"}))`);
    const win: { m: string; now: number; w: number }[] = [];
    for (const r of live) { const m = r.metric.__name__; if (m) win.push({ m, now: Number(r.value[1]), w: scalar(await pq(ctx, `count(count_over_time(${m}[${W}]))`)) }); }
    rank = win.sort((a, b) => b.w - a.w).slice(0, max).map((x) => ({ metric: { __name__: x.m }, value: [0, String(x.now)] }));
  }
  const totalSeries = scalar(await pq(ctx, `count(count_over_time({__name__=~".+"}[${W}]))`));
  const cs: MContrib[] = [];
  for (const r of rank) {
    const m = r.metric.__name__; if (!m) continue;
    const seriesWindow = scalar(await pq(ctx, `count(count_over_time(${m}[${W}]))`));
    const labels: MContrib['labels'] = []; let smp: { metric: Record<string, string> }[];
    if (seriesWindow <= 12000) {
      // One query: every series of this metric over the window; distinct values per label are counted locally.
      const all = await pq(ctx, `count_over_time(${m}[${W}])`); smp = all.slice(0, 8);
      const seen = new Map<string, Set<string>>(); for (const s of all) for (const [k, v] of Object.entries(s.metric)) if (k !== '__name__') { if (!seen.has(k)) seen.set(k, new Set()); seen.get(k)!.add(v); }
      for (const [k, s] of seen) labels.push({ name: k, distinct: s.size });
    } else {
      // Very large metric: sample, then measure the most likely culprits with one query each.
      smp = await pq(ctx, `topk(8, count_over_time(${m}[${W}]))`);
      const keys = [...new Set(smp.flatMap((s) => Object.keys(s.metric)))].filter((k) => k !== '__name__');
      const varying = keys.filter((k) => new Set(smp.map((s) => s.metric[k])).size > 1).slice(0, 6);
      for (const k of varying) labels.push({ name: k, distinct: scalar(await pq(ctx, `count(count by (${k}) (count_over_time(${m}[${W}])))`)) });
    }
    labels.sort((a, b) => b.distinct - a.distinct);
    cs.push({ key: `metric:${m}`, metric: m, seriesNow: Number(r.value[1]), seriesWindow, labels, samples: smp.slice(0, 4).map((s) => maskText(seriesText(m, s.metric)).masked), raw: smp.slice(0, 4).map((s) => s.metric) });
    ctx.progress({ checkId: 'INVESTIGATE', title: 'Investigate with Claude', status: 'running', message: `Measured metric ${cs.length} of ${rank.length}: ${m}` });
  }
  if (!cs.length) return { findings: [], notes: ['No metrics found in the window.'], totalSeries, top: [] };
  const v = ctx.versions.collector?.current ?? ctx.versions.collector?.latest; const conditionsSyntax = !v || compareVersions(v, '0.146.0') >= 0;
  const prompt = `You are a Coralogix metrics cardinality expert helping a TAM. For each metric below, explain what it is and propose ONE safe change that reduces series without losing alerting or dashboard value.
Rules: never drop or rewrite these protected labels (dots shown as underscores in metrics): ${[...cat.protected.exact, ...cat.protected.prefixes.map((p) => p + '*')].join(', ')}. Only OpenTelemetry contrib components and OTTL functions delete_key, delete_matching_keys, replace_pattern, set, keep_keys. OTTL statements use the transform processor, context datapoint, unprefixed paths: attributes["label.name"] (OTel attribute names use dots where the Prometheus label has underscores). For histograms ending _bucket, reduce_buckets proposes explicit bounds in the metric unit. Label churn shows as series over the window far above series now. Prefer: drop a churn/ID label, normalise IDs inside a label, fewer buckets, drop an unused metric. Do not invent numbers: Lens measures the series effect itself with PromQL. Return JSON only.
Window: ${ctx.opts.range ? `${ctx.opts.range.start} to ${ctx.opts.range.end}` : `last ${ctx.opts.windowHours} hours`}. Total distinct series in the window across all metrics: ${fmtCount(totalSeries)}.

${cs.map((c) => `### ${c.key}\nseries now: ${fmtCount(c.seriesNow)}; distinct series over the window: ${fmtCount(c.seriesWindow)}\ndistinct values per label (over the window): ${c.labels.map((l) => `${l.name}=${fmtCount(l.distinct)}`).join(', ')}\nsample series (masked):\n${c.samples.map((s, i) => `[${i + 1}] ${s}`).join('\n')}`).join('\n\n')}`;
  ctx.progress({ checkId: 'INVESTIGATE', title: 'Investigate with Claude', status: 'running', message: `Claude is analysing ${cs.length} metrics` });
  let ai: any[] = []; try { ai = (await askClaude(ctx, `${cs.length} metrics`, prompt, METRICS_SCHEMA))?.contributors ?? []; } catch (e) { notes.push(`Claude didn’t analyse the metrics: ${(e as Error).message}`); }
  const usage = JSON.stringify([...((await ctx.connector.listResources?.('alerts')) ?? []), ...((await ctx.connector.listResources?.('recording-rules')) ?? [])]);
  const mGb = pillarDailyGb(ctx.usage, 'metrics'); const rate = effectiveRate(ctx.usage, 'metrics');
  const findings: Finding[] = []; let n = 0;
  for (const a of ai) {
    const c = cs.find((x) => x.key === a.key); if (!c || a.action === 'keep') continue; n++;
    const problems: string[] = []; const m = c.metric; const L: string | undefined = a.label;
    for (const s of a.ottl_statements ?? []) for (const f of s.matchAll(/\b([A-Za-z_]+)\s*\(/g)) if (!['delete_key', 'delete_matching_keys', 'replace_pattern', 'set', 'keep_keys'].includes(f[1])) problems.push(`OTTL function ${f[1]} is not allowed here`);
    if (L && isProtectedMetricLabel(L)) problems.push(`${L} is a protected label`);
    if (a.regex) { try { new RegExp(a.regex); } catch { problems.push('The regex does not compile'); } }
    const usedBy = (usage.match(new RegExp(`\\b${m}\\b`, 'g')) ?? []).length; const labelUsed = L ? new RegExp(`\\b${L}\\b`).test(usage) && usedBy > 0 : false;
    if (a.action === 'drop_metric' && usedBy) problems.push(`${m} is referenced ${usedBy} time(s) in alerts or recording rules`);
    if (a.action === 'drop_label' && labelUsed) problems.push(`Alerts or recording rules that use ${m} also mention ${L}`);
    // Measure the effect with PromQL
    let after: number | null = null; let estimate = false; let vQuery = ''; const items: { before: string; after?: string }[] = [];
    if (!problems.length) {
      if (a.action === 'drop_label' && L) {
        vQuery = `count(count without (${L}) (count_over_time(${m}[${W}])))`; after = scalar(await pq(ctx, vQuery));
        // Show the dropped label first so the difference is visible at a glance.
        for (const s of c.raw.slice(0, 3)) { const { [L]: gone, __name__: _n, ...rest } = s; const restTxt = Object.entries(rest).slice(0, 6).map(([k, v2]) => `${k}="${v2}"`).join(', ');
          items.push({ before: maskText(`${m}{${L}="${gone ?? ''}", ${restTxt}, …}`).masked, after: maskText(`${m}{${restTxt}, …}`).masked }); }
      }
      else if (a.action === 'normalise_label' && L && a.regex) {
        vQuery = `count by (${L}) (count_over_time(${m}[${W}]))`; const vals = (await pq(ctx, vQuery)).map((r) => r.metric[L]).filter(Boolean);
        const re = new RegExp(a.regex, 'g'); const mapped = vals.map((x) => x.replace(re, (a.replacement ?? '').replace(/\$\{?(\d)\}?/g, '$$$1')));
        const before = new Set(vals).size, aft = new Set(mapped).size; after = before ? Math.round(c.seriesWindow * aft / before) : null; estimate = true;
        vals.map((x, i) => [x, mapped[i]]).filter(([x, y]) => x !== y).slice(0, 4).forEach(([x, y]) => items.push({ before: maskText(`${L}="${x}"`).masked, after: maskText(`${L}="${y}"`).masked }));
        if (!items.length) problems.push('The regex did not change any real label value');
      } else if (a.action === 'reduce_buckets' && Array.isArray(a.buckets) && a.buckets.length) {
        if (!m.endsWith('_bucket')) problems.push('Bucket changes only apply to histogram _bucket metrics');
        else { vQuery = `count(count by (le) (count_over_time(${m}[${W}])))`; const le = scalar(await pq(ctx, vQuery)); const sorted = [...a.buckets].sort((x: number, y: number) => x - y); if (sorted.join() !== a.buckets.join()) problems.push('Buckets must be ascending'); after = le ? Math.round(c.seriesWindow * (a.buckets.length + 1) / le) : null; estimate = true; items.push({ before: `${le - 1} buckets + Inf`, after: `${a.buckets.length} buckets + Inf: ${a.buckets.join(', ')}` }); }
      } else if (a.action === 'drop_metric') { after = 0; vQuery = `count(count_over_time(${m}[${W}]))`; }
    }
    const removed = after !== null ? Math.max(0, c.seriesWindow - after) : 0;
    const ok = !problems.length && after !== null && removed > 0;
    const mUnits = unitsByMetric.get(m); const gb = ok && mGb && totalSeries ? mGb * (removed / totalSeries) : 0; const units = ok && mUnits !== undefined && c.seriesWindow ? mUnits * (removed / c.seriesWindow) : gb * rate.rate;
    const name = `lens_metric_${n}`;
    let snippet = '';
    if (a.action === 'drop_metric') snippet = stringify({ processors: { [`filter/${name}`]: conditionsSyntax ? { error_mode: 'ignore', metric_conditions: [`metric.name == "${m}"`] } : { error_mode: 'ignore', metrics: { metric: [`name == "${m}"`] } } } }, { lineWidth: 0 });
    else if (a.action === 'reduce_buckets' && a.buckets) snippet = stringify({ connectors: { spanmetrics: { histogram: { explicit: { buckets: a.buckets.map((b: number) => `${b}ms`) } } } } }, { lineWidth: 0 }) + '# Helm: set presets.spanMetrics.histogramBuckets to the same list (chart values.schema.json).\n';
    else if ((a.ottl_statements ?? []).length) snippet = stringify({ processors: { [`transform/${name}`]: { error_mode: 'ignore', metric_statements: [{ context: 'datapoint', statements: a.ottl_statements }] } } }, { lineWidth: 0 });
    else if (a.source_fix) snippet = `# Change at the source:\n# ${a.source_fix}`;
    const display: FindingDisplay = {
      bars: { label: `Distinct values per label over the window (${m})`, items: c.labels.slice(0, 10).map((l) => ({ name: l.name, value: l.distinct, text: `${fmtCount(l.distinct)} values` })) },
      samples: { label: 'Live series (masked)', items: items.length ? items : c.samples.map((s) => ({ before: s })), afterNote: estimate ? 'Series after the change are estimated from the real label values or bucket counts; see the validation box.' : undefined },
      validation: { query: vQuery || '(not run)', result: problems.length ? problems.join('; ') : after === null ? 'Not measured.' : `${fmtCount(c.seriesWindow)} series over the window → ${estimate ? 'about ' : ''}${fmtCount(after)} after the change (${fmtCount(removed)} fewer, ${totalSeries ? ((removed / totalSeries) * 100).toFixed(2) : '?'}% of all metric series).${usedBy ? ` Referenced ${usedBy} time(s) in alerts or recording rules: check before changing.` : ' Not referenced by alerts or recording rules.'}`, ok },
      impact: ok ? [{ label: 'Series now (window)', value: fmtCount(c.seriesWindow) }, { label: 'After the change', value: `${estimate ? '~' : ''}${fmtCount(after!)}` }, { label: 'Share of metric series', value: `${((removed / totalSeries) * 100).toFixed(2)}%` }, ...(units ? [{ label: 'Estimated saving', value: `${units >= 1 ? units.toFixed(2) : units.toFixed(3)} units/day` }] : [])] : undefined,
    };
    findings.push({
      id: '', ruleId: `INV:${c.key}`, pillar: 'metrics', source: 'investigate', title: a.title, plain: `${a.what_it_is} ${a.why_it_matters}`,
      detail: (a.signals ?? []).length ? `Evidence: ${(a.signals ?? []).join(' · ')}` : undefined, evidence: [],
      observedVolume: `${m}: ${fmtCount(c.seriesNow)} series now, ${fmtCount(c.seriesWindow)} over the window`,
      savings: ok && units ? { kind: 'units', unitsPerDay: units, gbPerDay: gb || null, basis: mUnits !== undefined ? `${m} uses ${mUnits.toFixed(3)} units/day (Metric Usage API); ${fmtCount(removed)} of its ${fmtCount(c.seriesWindow)} series removed, assuming usage falls in proportion.` : `${fmtCount(removed)} of ${fmtCount(totalSeries)} distinct metric series removed (${((removed / totalSeries) * 100).toFixed(2)}%) × ${mGb!.toFixed(3)} GB/day of metrics, at ${rate.basis}. Assumes series send similar numbers of data points.`, pillar: 'metrics' } : { kind: 'needs-scoping', unitsPerDay: null, gbPerDay: null, basis: problems.length ? `Not validated: ${problems.join('; ')}.` : 'Series effect measured; no metrics usage available to convert to units.' },
      phase: a.action === 'fix_at_source' ? 3 : a.action === 'reduce_buckets' ? 2 : 1, effort: a.action === 'fix_at_source' ? 'medium-high' : 'low', owner: a.action === 'fix_at_source' ? 'App Team' : 'DevOps', priority: 'normal',
      verifyChecklist: [...(a.verify_questions ?? []), `Is ${m} used in dashboards (outside alerts and recording rules)?`], verifyStatus: ok ? 'candidate' : 'needs-scoping', progress: ok ? 'not-started' : 'pending',
      overlapsWith: /calls_total|duration/.test(m) ? ['METRIC-SPAN-SANITIZATION', 'METRIC-LABEL-ANALYZER', 'SPAN-HEAVY-VALUES'] : ['METRIC-HIGH-CHURN'],
      change: snippet ? { summary: a.title, snippet, ops: [] } : undefined,
      caveats: [...problems.map((p) => `Lens check: ${p}`), ...(estimate ? ['The after-change series count is an estimate from real label values or bucket counts.'] : []), `Claude’s confidence: ${a.confidence}.`],
      nextStep: a.next_step, sources: resolveSources(cat, ['otel-transform', 'otel-filter', 'otel-spanmetrics', 'cx-span-cardinality', 'cx-units']), display,
    });
  }
  void promLabel;
  return { findings, notes, totalSeries, top: cs.map((c) => c.metric) };
}
