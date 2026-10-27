import { stringify } from 'yaml';
import { definePlugin, skip, none, scoping, num, rows, perDay, fmtCount } from './base.js';
import { spanBaseline, isCritical } from './shared.js';
import { effectiveRate, pillarTierDaily, unitsPerGb } from '../units/calculator.js';
import { compareVersions } from '../versions/semver.js';
const traceUnits = (share, ctx, base, how) => {
    if (!base.gbPerDay)
        return scoping('Needs usage data to convert span share into units.');
    const r = effectiveRate(ctx.usage, 'traces');
    const gb = base.gbPerDay * share;
    return { kind: 'units', unitsPerDay: gb * r.rate, gbPerDay: gb, basis: `${how} (${(share * 100).toFixed(1)}% of spans) × ${base.gbPerDay.toFixed(2)} GB/day of traces, at ${r.basis}. Assumes average span size.`, pillar: 'traces' };
};
/** filter processor syntax depends on collector version (legacy traces.span deprecated in 0.146.0). */
export function useConditionsSyntax(ctx) { const v = ctx.versions.collector?.current ?? ctx.versions.collector?.latest; return !v || compareVersions(v, '0.146.0') >= 0; }
export function tracesPlugins(cat) {
    const d = cat.traces.defaults;
    return [
        definePlugin(cat, 'SPAN-SAMPLING', 'traces', {
            async detect(ctx) {
                if (/tail_sampling:|tailsampling:/.test(ctx.config.text))
                    return null;
                const s = await ctx.query('SPAN-SAMPLING', 'status-split');
                const e = await ctx.query('SPAN-SAMPLING', 'errors-by-service');
                const base = await spanBaseline(ctx);
                const byStatus = {};
                for (const r of rows(s))
                    byStatus[String(r.status ?? 'UNSET')] = num(r.spans);
                const total = Object.values(byStatus).reduce((a, b) => a + b, 0) || 1;
                const errShare = (byStatus.ERROR ?? 0) / total;
                const critErr = rows(e).filter((r) => isCritical(ctx, r.serviceName)).reduce((a, r) => a + num(r.spans), 0) / total;
                const o = ctx.opts.sampling;
                const kept = critErr * (o.criticalErrorPct / 100) + (errShare - critErr) * (o.nonCriticalErrorPct / 100) + (1 - errShare) * (o.nonErrorPct / 100);
                return { applicable: true, evidence: [s, e, base.ev], facts: { byStatus, errShare, kept, base }, observedVolume: `${fmtCount(base.count)} spans/day ingested at 100% · ${(errShare * 100).toFixed(2)}% error spans` };
            },
            recommend: (x, ctx) => ({ display: { policy: { items: [
                            { label: 'Errors', text: `critical services ${ctx.opts.sampling.criticalErrorPct}%, others ${ctx.opts.sampling.nonCriticalErrorPct}%` },
                            { label: 'Slow traces', text: `over ${ctx.opts.sampling.latencyThresholdMs} ms` },
                            { label: 'Healthy traffic', text: `${ctx.opts.sampling.nonErrorPct}% of OK/UNSET` }
                        ], kept: `${(x.facts.kept * 100).toFixed(1)}%` } },
                nextStep: 'Add the tail_sampling processor on the gateway (all spans of a trace must reach the same collector), validate in non-prod, then roll out with a Helm upgrade.',
                detail: `Policy order: errors (critical services ${ctx.opts.sampling.criticalErrorPct}%, others ${ctx.opts.sampling.nonCriticalErrorPct}%), slow traces over ${ctx.opts.sampling.latencyThresholdMs} ms, then ${ctx.opts.sampling.nonErrorPct}% of OK/UNSET. Estimated kept share: ${(x.facts.kept * 100).toFixed(1)}%.`,
                caveats: ['Upper-bound estimate: traces with an error keep all their spans, and slow traces are kept too, so the real saving is somewhat lower. Validate in non-prod first.', 'Keep span metrics for everything; sampling only reduces raw traces.'] }),
            generateConfigPatch: (_x, ctx) => {
                const o = ctx.opts.sampling;
                const crit = ctx.customer.criticalServices;
                const policies = [];
                if (crit.length)
                    policies.push({ name: `keep-critical-errors-${o.criticalErrorPct}pct`, type: 'and', and: { and_sub_policy: [{ name: 'svc', type: 'string_attribute', string_attribute: { key: 'service.name', values: crit } }, { name: 'err', type: 'status_code', status_code: { status_codes: ['ERROR'] } }, ...(o.criticalErrorPct < 100 ? [{ name: 'prob', type: 'probabilistic', probabilistic: { sampling_percentage: o.criticalErrorPct } }] : [])] } });
                policies.push({ name: `keep-errors-${o.nonCriticalErrorPct}pct`, type: 'and', and: { and_sub_policy: [{ name: 'err', type: 'status_code', status_code: { status_codes: ['ERROR'] } }, { name: 'prob', type: 'probabilistic', probabilistic: { sampling_percentage: o.nonCriticalErrorPct } }] } });
                policies.push({ name: 'keep-slow', type: 'latency', latency: { threshold_ms: o.latencyThresholdMs } });
                policies.push({ name: `keep-nonerror-${o.nonErrorPct}pct`, type: 'and', and: { and_sub_policy: [{ name: 'nonerror', type: 'status_code', status_code: { status_codes: ['OK', 'UNSET'] } }, { name: 'prob', type: 'probabilistic', probabilistic: { sampling_percentage: o.nonErrorPct } }] } });
                const body = { decision_wait: d.decisionWait, num_traces: d.numTraces, policies };
                return { summary: 'Composite tail sampling (errors, slow, sampled healthy traffic)', snippet: stringify({ processors: { tail_sampling: body } }),
                    ops: [{ kind: 'processor', name: 'tail_sampling', body, signals: ['traces'], position: 'before-batch', helmComponents: ['opentelemetry-gateway'] }] };
            },
            estimateSavings: (x, ctx) => traceUnits(1 - x.facts.kept, ctx, x.facts.base, 'Spans not kept by the policies'),
        }),
        definePlugin(cat, 'SPAN-HEALTH', 'traces', {
            async detect(ctx) {
                const e = await ctx.query('SPAN-HEALTH', 'health-spans');
                const n = perDay(rows(e).reduce((a, r) => a + num(r.spans), 0), e.window);
                if (!n)
                    return null;
                const base = await spanBaseline(ctx);
                return { applicable: true, evidence: [e, base.ev], facts: { n, base }, observedVolume: `${fmtCount(n)} health/probe spans/day` };
            },
            recommend: () => ({ nextStep: 'Add filter/drop-health before sampling. No application change.' }),
            generateConfigPatch: (_x, ctx) => {
                const legacy = !useConditionsSyntax(ctx);
                const paths = cat.rules['SPAN-HEALTH'].detect.paths;
                const p = legacy ? '' : 'span.';
                const conds = [...paths.map((x) => `${p}attributes["http.target"] == "${x}" or ${p}attributes["url.path"] == "${x}"`), `IsMatch(${p}attributes["user_agent.original"], "^kube-probe")`, `${p}attributes["rpc.service"] == "grpc.health.v1.Health"`];
                const body = legacy ? { error_mode: 'ignore', traces: { span: conds } } : { error_mode: 'ignore', trace_conditions: conds };
                return { summary: `Drop health/probe spans (${legacy ? 'legacy traces.span syntax for collectors before 0.146.0' : 'trace_conditions syntax'})`, snippet: stringify({ processors: { 'filter/drop-health': body } }),
                    ops: [{ kind: 'processor', name: 'filter/drop-health', body, signals: ['traces'], position: 'before-sampling', helmComponents: ['opentelemetry-agent'] }] };
            },
            estimateSavings: (x, ctx) => traceUnits(x.facts.n / (x.facts.base.count || 1), ctx, x.facts.base, 'Health/probe spans removed'),
        }),
        definePlugin(cat, 'SPAN-INTERNAL', 'traces', {
            async detect(ctx) {
                const e = await ctx.query('SPAN-INTERNAL', 'internal-by-service');
                const nonCrit = rows(e).filter((r) => !isCritical(ctx, r.serviceName));
                const n = perDay(nonCrit.reduce((a, r) => a + num(r.spans), 0), e.window);
                const base = await spanBaseline(ctx);
                if (!base.count || n / base.count < 0.05)
                    return null;
                return { applicable: true, evidence: [e, base.ev], facts: { n, base, svcs: nonCrit.slice(0, 8).map((r) => String(r.serviceName)) }, observedVolume: `${fmtCount(n)} INTERNAL spans/day in non-critical services (${((n / base.count) * 100).toFixed(1)}% of spans)` };
            },
            recommend: (x, ctx) => ({ display: { chips: { label: 'Services in scope', items: x.facts.svcs }, notes: ctx.customer.criticalServices.length ? [] : [{ kind: 'warn', text: 'No critical services were marked, so every service is treated as non-critical. Mark critical services to protect them.' }] },
                nextStep: 'Drop INTERNAL spans that are not errors in the listed non-critical services.', detail: `Services: ${x.facts.svcs.join(', ')}.${ctx.customer.criticalServices.length ? '' : ' No critical services were marked, so every service is treated as non-critical — mark critical services to protect them.'}`,
                caveats: ['Span kind in OTTL is `kind.string == "Internal"` (ottlspan README); the playbook\'s attributes["span.kind"] form is corrected.'] }),
            generateConfigPatch: (x, ctx) => {
                const legacy = !useConditionsSyntax(ctx);
                const p = legacy ? '' : 'span.';
                const svc = `resource.attributes["service.name"]`;
                const list = x.facts.svcs.map((s) => `${svc} == "${s}"`).join(' or ');
                const cond = `${p}kind.string == "Internal" and ${p}status.code != STATUS_CODE_ERROR and (${list})`;
                const body = legacy ? { error_mode: 'ignore', traces: { span: [cond] } } : { error_mode: 'ignore', trace_conditions: [cond] };
                return { summary: 'Drop non-error INTERNAL spans in non-critical services', snippet: stringify({ processors: { 'filter/drop-internal-noncritical': body } }),
                    ops: [{ kind: 'processor', name: 'filter/drop-internal-noncritical', body, signals: ['traces'], position: 'before-sampling', helmComponents: ['opentelemetry-agent'] }] };
            },
            estimateSavings: (x, ctx) => traceUnits(x.facts.n / (x.facts.base.count || 1), ctx, x.facts.base, 'Upper bound: all INTERNAL spans in non-critical services (error spans are kept, so slightly less)'),
        }),
        definePlugin(cat, 'SPAN-LOW-PRIORITY', 'traces', {
            async detect(ctx) {
                if (!ctx.customer.criticalServices.length)
                    return skip('Mark critical services in Customer context to enable per-service sampling.');
                return { applicable: true, evidence: [], facts: {}, forceStatus: 'needs-scoping' };
            },
            recommend: (_x, ctx) => ({ nextStep: 'Use per-service rates in tail_sampling: lighter sampling for critical services, heavier for the rest (see the tail sampling reference).', detail: `Critical: ${ctx.customer.criticalServices.join(', ')}.` }),
            estimateSavings: () => scoping('Included in the tail-sampling estimate; per-service rates change how the kept share is split.'),
        }),
        definePlugin(cat, 'SPAN-HEAVY-VALUES', 'traces', {
            async detect(ctx) {
                const e = await ctx.query('SPAN-HEAVY-VALUES', 'url-ids');
                const n = perDay(rows(e).reduce((a, r) => a + num(r.spans), 0), e.window);
                return n ? { applicable: true, evidence: [e], facts: { n, svcs: rows(e).map((r) => r.serviceName) }, observedVolume: `${fmtCount(n)} spans/day with IDs in URLs` } : null;
            },
            recommend: () => ({ nextStep: 'Normalise IDs in http.url / url.full with replace_pattern (test the regex on real values first).' }),
            generateConfigPatch: () => {
                const body = { error_mode: 'ignore', trace_statements: [{ context: 'span', statements: [cat.rules['SPAN-HEAVY-VALUES'].config.statement, cat.rules['SPAN-HEAVY-VALUES'].config.statement.replace(/http\.url/g, 'url.full')] }] };
                return { summary: 'Normalise IDs in URLs', snippet: stringify({ processors: { 'transform/reducecardinality': body } }), ops: [{ kind: 'processor', name: 'transform/reducecardinality', body, signals: ['traces'], position: 'middle', helmComponents: ['opentelemetry-agent'] }] };
            },
            estimateSavings: () => none('Mainly reduces span-metric cardinality, not span volume.'),
        }),
        definePlugin(cat, 'SPAN-LIBRARIES', 'traces', {
            async detect(ctx) {
                const e = await ctx.query('SPAN-LIBRARIES', 'spans-by-library');
                const base = await spanBaseline(ctx);
                const top = rows(e).slice(0, 8).map((r) => ({ lib: String(r.library), spans: perDay(num(r.spans), e.window) }));
                return top.length ? { applicable: true, evidence: [e], facts: { top, base }, forceStatus: 'needs-scoping', observedVolume: top.slice(0, 3).map((t) => `${t.lib} ${fmtCount(t.spans)}/day`).join(' · ') } : null;
            },
            recommend: (x) => ({ display: { bars: { label: 'Spans per day by instrumentation library', items: x.facts.top.map((t) => ({ name: t.lib, value: t.spans, text: `${fmtCount(t.spans)}/day` })) } },
                nextStep: 'Review with the app team whether every call of these libraries needs a span; most are covered by tail sampling.', detail: x.facts.top.map((t) => `${t.lib}: ${fmtCount(t.spans)} spans/day`).join('\n') }),
            estimateSavings: () => scoping('Discovery finding — decide per library.'),
        }),
        definePlugin(cat, 'SPAN-SPANMETRICS-TCO', 'traces', {
            async detect(ctx) {
                const t = pillarTierDaily(ctx.usage, 'traces');
                const high = t.high?.gb ?? 0, med = t.medium?.gb ?? 0;
                if (high + med <= 0)
                    return null;
                const svcs = (await ctx.connector.getLabelValues?.('service_name', `${Math.round(ctx.opts.windowHours * 60)}m`, ctx.opts.spanMetric, ctx.opts.range?.end)) ?? [];
                return { applicable: true, evidence: [], facts: { high, med, svcs }, observedVolume: `${(high + med).toFixed(2)} GB/day of traces in ${high ? 'High' : ''}${high && med ? '/' : ''}${med ? 'Medium' : ''} tier` };
            },
            recommend: (x) => {
                const first = x.facts.svcs[0] ?? '<service>';
                const pol = (inv) => ({ name: `lens-draft-traces-low-${inv ? 'not-' : ''}${first}`, description: 'Draft from Coralogix Lens. Review before creating.', priority: 'PRIORITY_TYPE_LOW', enabled: false, applicationRule: null, spanRules: { serviceRule: { ruleTypeId: inv ? 'RULE_TYPE_ID_IS_NOT' : 'RULE_TYPE_ID_IS', name: first } }, targets: [{ dataset: 'spans', priority: 'PRIORITY_TYPE_LOW', dataspace: 'default' }] });
                return { nextStep: 'Confirm alerts and dashboards use span metrics, then create the two complementary TCO trace policies (service is X / service is not X).',
                    caveats: ['The spanRules.serviceRule field in the draft mirrors the applicationRule shape returned by the API; run `cx tco test` on the draft before creating.', 'Low-tier traces remain searchable.'],
                    drafts: [{ kind: 'tco-trace-policy', name: `Traces to Low: service is ${first}`, json: pol(false) }, { kind: 'tco-trace-policy', name: `Traces to Low: service is not ${first}`, json: pol(true) }] };
            },
            estimateSavings: (x) => {
                const u = x.facts.high * (unitsPerGb('traces', 'high') - unitsPerGb('traces', 'low')) + x.facts.med * (unitsPerGb('traces', 'medium') - unitsPerGb('traces', 'low'));
                return { kind: 'units', unitsPerDay: u, gbPerDay: x.facts.high + x.facts.med, basis: `GB/day per tier × (current tier rate − Low tier rate ${unitsPerGb('traces', 'low')}), official rates.`, pillar: 'traces' };
            },
        }),
    ];
}
//# sourceMappingURL=traces.js.map