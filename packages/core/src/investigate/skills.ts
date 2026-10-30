import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { stringify } from 'yaml';
import type { AnalyzerContext } from '../analyzers/base.js';
import { fmtCount } from '../analyzers/base.js';
import { rulesDir, resolveSources, loadCatalogue } from '../rules/catalogue.js';
import { maskText } from '../masking/pii.js';
import { effectiveRate, pillarDailyGb } from '../units/calculator.js';
import type { Finding } from '../types.js';
import { pq, scalar, winOf } from './metrics.js';
import { resolveSpanMetrics } from './labels.js';
import { askClaude } from './claude-call.js';

/** TAM skills (playbook › AI Skills). Lens collects the data each skill needs through cx; Claude applies the skill’s method with tools off. */
export function skillsDir(): string { return process.env.CXLENS_SKILLS_DIR ?? join(dirname(rulesDir()), '..', 'skills'); }
export function loadSkill(name: string): string | null {
  const d = join(skillsDir(), name); const f = join(d, 'SKILL.md'); if (!existsSync(f)) return null;
  let s = readFileSync(f, 'utf8'); const refs = join(d, 'references');
  if (existsSync(refs)) for (const r of readdirSync(refs).filter((x) => x.endsWith('.md'))) s += `\n\n--- reference: ${r} ---\n${readFileSync(join(refs, r), 'utf8').slice(0, 20000)}`;
  return s.slice(0, 90000);
}
const PREAMBLE = (name: string) => `SKILL:${name}\nYou are running the TAM skill below inside Coralogix Lens. Lens has ALREADY collected the live data the skill needs through the cx CLI (read-only). Do not ask for an API key, domain or any input, and do not try to run queries: skip the skill's data-gathering steps and apply its analysis method to the data provided. Never copy patterns from other customers: derive everything from this data. Return JSON only, matching the schema.\n\n=== SKILL ===\n`;

const SPAN_SCHEMA = { type: 'object', required: ['patterns', 'ottl_statements', 'summary', 'next_step', 'verify_questions'], properties: {
  patterns: { type: 'array', items: { type: 'object', required: ['regex', 'replacement', 'description'], properties: { regex: { type: 'string' }, replacement: { type: 'string' }, description: { type: 'string' } } } },
  ottl_statements: { type: 'array', items: { type: 'string' }, description: 'transform statements, context span, e.g. replace_pattern(name, "regex", "repl")' },
  summary: { type: 'string' }, next_step: { type: 'string' }, verify_questions: { type: 'array', items: { type: 'string' } } } } as const;
const BUCKET_SCHEMA = { type: 'object', required: ['buckets_ms', 'rationale', 'next_step', 'verify_questions'], properties: {
  buckets_ms: { type: 'array', items: { type: 'number' } }, apdex_ms: { type: 'number' }, rationale: { type: 'string' },
  per_service: { type: 'array', items: { type: 'object', properties: { service: { type: 'string' }, note: { type: 'string' } } } },
  next_step: { type: 'string' }, verify_questions: { type: 'array', items: { type: 'string' } } } } as const;

/** span-name-cardinality-analyzer: Lens gathers span_name values per service; validates the regexes on every real value. */
export async function runSpanNameSkill(ctx: AnalyzerContext, totalSeries: number): Promise<Finding | { note: string }> {
  const md = loadSkill('span-name-cardinality-analyzer'); if (!md) return { note: 'span-name-cardinality-analyzer skill not found in the skills folder.' };
  const sm = await resolveSpanMetrics(ctx); if (!sm.calls) return { note: 'No span metrics found (no metric carries a span_name label), so the span-name skill had nothing to analyse.' }; const M = sm.calls, W = winOf(ctx);
  const per = await pq(ctx, `topk(8, count by (service_name) (count by (service_name, span_name) (count_over_time(${M}[${W}]))))`);
  if (!per.length) return { note: `No ${M} data for the span-name skill.` };
  const vals: Record<string, string[]> = {};
  for (const r of per) { const s = r.metric.service_name; vals[s] = (await pq(ctx, `count by (span_name) (count_over_time(${M}{service_name="${s.replace(/"/g, '\\"')}"}[${W}]))`)).map((x) => x.metric.span_name).filter(Boolean); }
  const data = per.map((r) => { const s = r.metric.service_name; return `service ${s}: ${fmtCount(Number(r.value[1]))} unique span_name values. Examples:\n${vals[s].slice(0, 40).map((v) => `  ${maskText(v).masked}`).join('\n')}`; }).join('\n\n');
  ctx.progress({ checkId: 'INVESTIGATE', title: 'Investigate with Claude', status: 'running', message: 'Running TAM skill: span-name-cardinality-analyzer' });
  const res = { json: await askClaude(ctx, 'span names (TAM skill)', `${PREAMBLE('span-name-cardinality-analyzer')}${md}\n\n=== DATA (metric ${M}, window ${W}) ===\n${data}`, SPAN_SCHEMA).catch(() => null), text: '' };
  let j: any; try { j = res?.json ?? JSON.parse(String(res?.text ?? '').replace(/```json|```/g, '').trim()); } catch { return { note: 'The span-name skill answer could not be read.' }; }
  // Validate: apply the patterns, in order, to every collected span_name value.
  const problems: string[] = []; const res2: RegExp[] = [];
  for (const p of j.patterns ?? []) { try { res2.push(new RegExp(p.regex, 'g')); } catch { problems.push(`Pattern does not compile: ${p.regex}`); } }
  const apply = (v: string) => (j.patterns ?? []).reduce((x: string, p: any, i: number) => (res2[i] ? x.replace(res2[i], (p.replacement ?? '').replace(/\$\{?(\d)\}?/g, '$$$1')) : x), v);
  let before = 0, after = 0; const examples: { before: string; after: string }[] = [];
  for (const s of Object.keys(vals)) { const b = new Set(vals[s]); const a = new Set(vals[s].map(apply)); before += b.size; after += a.size; for (const v of vals[s]) { const o = apply(v); if (o !== v && examples.length < 5) examples.push({ before: maskText(v).masked, after: maskText(o).masked }); } }
  const seriesM = scalar(await pq(ctx, `count(count_over_time(${M}[${W}]))`)); const ratio = before ? after / before : 1;
  const removed = Math.round(seriesM * (1 - ratio)); const ok = !problems.length && removed > 0 && examples.length > 0;
  const mGb = pillarDailyGb(ctx.usage, 'metrics'); const rate = effectiveRate(ctx.usage, 'metrics');
  // Span metrics come from calls_total and the duration histogram: both shrink by the same span_name ratio.
  const hist = sm.histogram ? scalar(await pq(ctx, `count(count_over_time(${sm.histogram}[${W}]))`)) : 0; const removedAll = removed + Math.round(hist * (1 - ratio));
  const gb = ok && mGb && totalSeries ? mGb * removedAll / totalSeries : 0; const units = gb * rate.rate; const cat = loadCatalogue();
  return { id: '', ruleId: 'INV:skill:span-name-cardinality-analyzer', pillar: 'metrics', source: 'investigate', title: 'Sanitise span names (TAM skill: span-name-cardinality-analyzer)', plain: j.summary,
    evidence: [], observedVolume: `${Object.keys(vals).length} services, ${fmtCount(before)} unique span names → ${fmtCount(after)} after sanitising`,
    savings: ok && units ? { kind: 'units', unitsPerDay: units, gbPerDay: gb, basis: `Unique span names drop from ${before} to ${after} across the top services (patterns applied by Lens to every real value). ${M} and duration_ms_bucket shrink by the same ratio: about ${fmtCount(removedAll)} of ${fmtCount(totalSeries)} metric series × ${mGb!.toFixed(3)} GB/day, at ${rate.basis}.`, pillar: 'metrics' } : { kind: 'needs-scoping', unitsPerDay: null, gbPerDay: null, basis: problems.join('; ') || 'No reduction measured.' },
    phase: 1, effort: 'low', owner: 'DevOps', priority: 'normal', verifyChecklist: [...(j.verify_questions ?? []), 'Do dashboards or alerts filter on any exact span name these patterns would change?'], verifyStatus: ok ? 'candidate' : 'needs-scoping', progress: ok ? 'not-started' : 'pending',
    overlapsWith: ['METRIC-SPAN-SANITIZATION', 'METRIC-LABEL-ANALYZER', 'SPAN-HEAVY-VALUES'],
    change: (j.ottl_statements ?? []).length ? { summary: 'Sanitise span names', snippet: stringify({ processors: { 'transform/span_name_sanitization': { error_mode: 'ignore', trace_statements: [{ context: 'span', statements: j.ottl_statements }] } } }, { lineWidth: 0 }) + '# Place before the spanmetrics connector in the traces pipeline.\n', ops: [] } : undefined,
    caveats: [...problems.map((p) => `Lens check: ${p}`), 'Patterns derived from this customer’s own span names only, as the skill requires.'], nextStep: j.next_step, sources: resolveSources(cat, ['otel-transform', 'otel-spanmetrics', 'cx-span-cardinality']),
    display: { samples: examples.length ? { label: 'Real span names: before and after the patterns', items: examples, afterNote: 'After: the skill’s patterns applied by Lens to these exact values.' } : { label: 'Real span names (none changed by the patterns)', items: Object.values(vals).flat().slice(0, 5).map((v) => ({ before: maskText(v).masked })) }, bars: { label: 'Unique span names per service (top services)', items: per.map((r) => ({ name: r.metric.service_name, value: Number(r.value[1]), text: `${fmtCount(Number(r.value[1]))} names` })) },
      validation: { query: `count by (span_name) (count_over_time(${M}{service_name="…"}[${W}]))`, result: `${fmtCount(before)} unique span names across ${Object.keys(vals).length} services become ${fmtCount(after)} (${((1 - ratio) * 100).toFixed(1)}% fewer).`, ok },
      impact: ok ? [{ label: 'Unique span names', value: `${fmtCount(before)} → ${fmtCount(after)}` }, { label: 'Series removed (est.)', value: fmtCount(removedAll) }, ...(units ? [{ label: 'Estimated saving', value: `${units >= 1 ? units.toFixed(2) : units.toFixed(3)} units/day` }] : [])] : undefined } } as Finding;
}

/** span-metrics-bucket-optimizer: Lens pulls the bucket distribution for the top services; percentiles are computed by Lens. */
export function quantile(b: { le: number; c: number }[], q: number): number | null {
  const s = [...b].sort((x, y) => x.le - y.le); const tot = s.at(-1)?.c ?? 0; if (!tot) return null; const rank = q * tot; let pl = 0, pc = 0;
  for (const x of s) { if (x.c >= rank) { if (!Number.isFinite(x.le)) return pl; return pl + (x.le - pl) * ((rank - pc) / Math.max(1e-9, x.c - pc)); } pl = Number.isFinite(x.le) ? x.le : pl; pc = x.c; } return null;
}
export async function runBucketSkill(ctx: AnalyzerContext, vendor: string, totalSeries: number, metricNames: string[]): Promise<Finding | { note: string }> {
  const md = loadSkill('span-metrics-bucket-optimizer'); if (!md) return { note: 'span-metrics-bucket-optimizer skill not found in the skills folder.' };
  const W = winOf(ctx); const sm = await resolveSpanMetrics(ctx); const H = sm.histogram ?? metricNames.find((m) => /duration.*_bucket$/.test(m)); if (!H) return { note: 'No span-metrics latency histogram found, so the bucket skill had nothing to analyse.' }; const C = H.replace(/_bucket$/, '_count');
  const top = await pq(ctx, `topk(8, sum by (service_name) (increase(${C}[${W}])))`); if (!top.length) return { note: `No ${H} data for the bucket skill.` };
  const per: { service: string; buckets: { le: number; c: number }[] }[] = [];
  for (const t of top) { const s = t.metric.service_name; const r = await pq(ctx, `sum by (le) (increase(${H}{service_name="${s.replace(/"/g, '\\"')}"}[${W}]))`); per.push({ service: s, buckets: r.map((x) => ({ le: x.metric.le === '+Inf' ? Infinity : Number(x.metric.le), c: Number(x.value[1]) })) }); }
  const current = [...new Set(per.flatMap((p) => p.buckets.map((b) => b.le)).filter(Number.isFinite))].sort((a, b) => a - b);
  const table = per.map((p) => `${p.service}: requests ${fmtCount(p.buckets.find((b) => !Number.isFinite(b.le))?.c ?? 0)}; p50 ${quantile(p.buckets, 0.5)?.toFixed(1)} ms; p95 ${quantile(p.buckets, 0.95)?.toFixed(1)} ms; p99 ${quantile(p.buckets, 0.99)?.toFixed(1)} ms; cumulative: ${p.buckets.sort((a, b) => a.le - b.le).map((b) => `le=${Number.isFinite(b.le) ? b.le : '+Inf'}:${Math.round(b.c)}`).join(' ')}`).join('\n');
  ctx.progress({ checkId: 'INVESTIGATE', title: 'Investigate with Claude', status: 'running', message: 'Running TAM skill: span-metrics-bucket-optimizer' });
  const res = { json: await askClaude(ctx, 'histogram buckets (TAM skill)', `${PREAMBLE('span-metrics-bucket-optimizer')}${md}\n\n=== DATA (metric ${H}, window ${W}; percentiles interpolated by Lens) ===\nVendor compared against: ${vendor}\nCurrently deployed buckets (ms): ${current.join(', ')}\n${table}`, BUCKET_SCHEMA).catch(() => null), text: '' };
  let j: any; try { j = res?.json ?? JSON.parse(String(res?.text ?? '').replace(/```json|```/g, '').trim()); } catch { return { note: 'The bucket skill answer could not be read.' }; }
  const nb: number[] = j.buckets_ms ?? []; const problems: string[] = [];
  if (!nb.length || [...nb].sort((a, b) => a - b).join() !== nb.join()) problems.push('Bucket bounds must be a non-empty ascending list');
  const seriesH = scalar(await pq(ctx, `count(count_over_time(${H}[${W}]))`)); const after = current.length ? Math.round(seriesH * (nb.length + 1) / (current.length + 1)) : seriesH;
  const delta = seriesH - after; const mGb = pillarDailyGb(ctx.usage, 'metrics'); const rate = effectiveRate(ctx.usage, 'metrics');
  const hUnits = ctx.connector.metricUsage ? (await ctx.connector.metricUsage.metrics(100).catch(() => null))?.rows.find((r) => r.name === H)?.units : undefined;
  const gb = !problems.length && delta > 0 && mGb && totalSeries ? mGb * delta / totalSeries : 0; const units = !problems.length && delta > 0 && hUnits !== undefined && seriesH ? hUnits * (delta / seriesH) : gb * rate.rate; const cat = loadCatalogue();
  const ok = !problems.length;
  return { id: '', ruleId: 'INV:skill:span-metrics-bucket-optimizer', pillar: 'metrics', source: 'investigate', title: 'Re-tune span metrics histogram buckets (TAM skill: span-metrics-bucket-optimizer)', plain: j.rationale,
    evidence: [], observedVolume: `${H}: ${current.length} buckets today across ${per.length} top services`,
    savings: units ? { kind: 'units', unitsPerDay: units, gbPerDay: gb, basis: hUnits !== undefined ? `${H} uses ${hUnits.toFixed(3)} units/day (Metric Usage API); ${current.length} → ${nb.length} buckets removes about ${fmtCount(delta)} of its ${fmtCount(seriesH)} series, assuming usage falls in proportion.` : `${current.length} → ${nb.length} buckets changes ${H} from ${fmtCount(seriesH)} to about ${fmtCount(after)} series (${fmtCount(delta)} of ${fmtCount(totalSeries)} metric series) × ${mGb!.toFixed(3)} GB/day, at ${rate.basis}.`, pillar: 'metrics' } : { kind: ok && delta <= 0 ? 'none-units' : 'needs-scoping', unitsPerDay: null, gbPerDay: null, basis: problems.join('; ') || (delta < 0 ? `Adds about ${fmtCount(-delta)} series in exchange for more accurate percentiles.` : 'Accuracy change with no series reduction.') },
    phase: 2, effort: 'medium', owner: 'DevOps', priority: 'normal', verifyChecklist: [...(j.verify_questions ?? []), 'Which percentiles and Apdex thresholds do the customer’s alerts and SLOs use?'], verifyStatus: ok ? 'candidate' : 'needs-scoping', progress: ok ? 'not-started' : 'pending',
    overlapsWith: [], change: nb.length ? { summary: 'New explicit histogram buckets', snippet: ctx.deployment === 'helm' ? stringify({ 'opentelemetry-agent': { presets: { spanMetrics: { histogramBuckets: nb.map((b) => `${b}ms`) } } } }, { lineWidth: 0 }) + '# presets.spanMetrics.histogramBuckets (chart values.schema.json).\n' : stringify({ connectors: { spanmetrics: { histogram: { explicit: { buckets: nb.map((b) => `${b}ms`) } } } } }, { lineWidth: 0 }), ops: ctx.deployment === 'helm' ? [{ kind: 'helmPreset', components: ['opentelemetry-agent'], preset: 'spanMetrics.histogramBuckets', value: nb.map((b) => `${b}ms`) as any }] : [] } : undefined,
    caveats: [...problems.map((p) => `Lens check: ${p}`), `Vendor compared against: ${vendor}.`, 'Percentiles are interpolated by Lens from live bucket counts (as histogram_quantile does).'], nextStep: j.next_step, sources: resolveSources(cat, ['otel-spanmetrics', 'cx-span-cardinality']),
    display: { samples: { label: 'Buckets: today and proposed', items: [{ before: `Today (ms): ${current.join(', ')}`, after: `Proposed (ms): ${nb.join(', ')}${j.apdex_ms ? ` (Apdex ${j.apdex_ms} ms)` : ''}` }] },
      table: { summary: `Latency per top service (computed by Lens from live buckets)`, headers: ['Service', 'p50 ms', 'p95 ms', 'p99 ms', 'Note'], rows: per.map((p) => [p.service, quantile(p.buckets, 0.5)?.toFixed(1) ?? '—', quantile(p.buckets, 0.95)?.toFixed(1) ?? '—', quantile(p.buckets, 0.99)?.toFixed(1) ?? '—', (j.per_service ?? []).find((x: any) => x.service === p.service)?.note ?? '']) },
      validation: { query: `sum by (le) (increase(${H}{service_name="…"}[${W}]))`, result: `${current.length} buckets today → ${nb.length} proposed. ${H}: ${fmtCount(seriesH)} series → about ${fmtCount(after)}.`, ok },
      impact: [{ label: 'Buckets', value: `${current.length} → ${nb.length}` }, { label: 'Histogram series', value: `${fmtCount(seriesH)} → ~${fmtCount(after)}` }, ...(units ? [{ label: 'Estimated saving', value: `${units >= 1 ? units.toFixed(2) : units.toFixed(3)} units/day` }] : [])] } } as Finding;
}
