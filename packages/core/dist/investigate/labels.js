import { stringify } from 'yaml';
import { fmtCount } from '../analyzers/base.js';
import { maskText } from '../masking/pii.js';
import { effectiveRate, pillarDailyGb } from '../units/calculator.js';
import { resolveSources, loadCatalogue } from '../rules/catalogue.js';
import { pq, scalar, winOf, isProtectedMetricLabel } from './metrics.js';
const SKIP = new Set(['__name__', 'le', 'quantile', 'job', 'instance']);
/** Labels Coralogix features rely on: shown, never suggested for removal. */
const NEEDED = new Set(['cx_application_name', 'cx_subsystem_name', 'service_name', 'span_kind', 'status_code', 'http_response_status_code', 'k8s_cluster_name', 'k8s_namespace_name']);
const RISKY = ['span_name', 'http_url', 'url_full', 'http_target', 'url_path', 'http_route', 'db_statement', 'db_query_text', 'user_id', 'session_id', 'request_id', 'trace_id', 'process_pid', 'container_id', 'k8s_pod_name', 'k8s_pod_uid', 'process_command_line'];
const CHURN = /(^|_)(pid|uid)$|container_id|pod_name|pod_uid|process_command|instance_id|process_parent_pid/;
export function classify(r, totalSeries) {
    if (CHURN.test(r.name) && r.unique > 20)
        return 'churn';
    if (r.unique >= 200 || (RISKY.includes(r.name) && r.unique >= 50))
        return 'high-cardinality';
    const wide = (r.metricCount ?? 0) >= 50 || (r.series && totalSeries ? r.series / totalSeries >= 0.3 : false);
    if (r.unique <= 1 && wide && ((r.fraction ?? 0) >= 0.01 || r.fraction === undefined))
        return 'constant';
    return 'normal';
}
const lockOf = (n) => (isProtectedMetricLabel(n) ? 'protected' : NEEDED.has(n) ? 'needed' : undefined);
/** Every label ranked by usage: exact from the Metric Usage API when a key is set, otherwise measured with PromQL through cx. */
export async function labelInventory(ctx) {
    if (ctx.shared.has('labelInventory'))
        return ctx.shared.get('labelInventory');
    let inv;
    const mu = ctx.connector.metricUsage;
    try {
        if (!mu)
            throw new Error('no usage API');
        const d = await mu.labels(300);
        const rows = d.rows.filter((r) => !SKIP.has(r.name)).map((r) => ({ name: r.name, unique: r.unique, metricCount: r.metricCount, units: r.units, fraction: r.fraction, locked: lockOf(r.name) }));
        inv = { source: 'usage-api', date: d.date ? `${d.date.year}-${String(d.date.month).padStart(2, '0')}-${String(d.date.day).padStart(2, '0')}` : undefined, totalUnits: d.totalUnits, totalSeries: d.totalSeries, rows: rows.map((r) => ({ ...r, kind: classify(r) })) };
    }
    catch {
        // PromQL fallback: candidate labels from the top metrics plus known risky names; three cheap queries per label.
        const keys = new Set(RISKY);
        const top = await pq(ctx, 'topk(12, count by (__name__) ({__name__=~".+"}))');
        for (const t of top)
            for (const s of await pq(ctx, `topk(1, ${t.metric.__name__})`))
                Object.keys(s.metric).forEach((k) => keys.add(k));
        const totalSeries = scalar(await pq(ctx, 'count({__name__=~".+"})'));
        const rows = [];
        for (const k of [...keys].filter((x) => !SKIP.has(x)).slice(0, 30)) {
            const series = scalar(await pq(ctx, `count({${k}!=""})`));
            if (!series)
                continue;
            const unique = scalar(await pq(ctx, `count(count by (${k}) ({${k}!=""}))`));
            const metricCount = scalar(await pq(ctx, `count(count by (__name__) ({${k}!=""}))`));
            const r = { name: k, unique, metricCount, series, locked: lockOf(k) };
            rows.push({ ...r, kind: classify(r, totalSeries) });
            ctx.progress({ checkId: 'INVESTIGATE', title: 'Investigate with Claude', status: 'running', message: `Measured label ${rows.length}: ${k}` });
        }
        rows.sort((a, b) => (b.series ?? 0) - (a.series ?? 0));
        inv = { source: 'promql', totalSeries, rows };
    }
    ctx.shared.set('labelInventory', inv);
    return inv;
}
/** Group label values by underlying shape. Deterministic, done by Lens. */
export function shapeOf(v) {
    const s = v.trim();
    if (/^(query|mutation|subscription)\b|^\{\s*[A-Za-z_]/.test(s) && s.includes('{')) {
        const named = /^\s*(query|mutation|subscription)\s+([A-Za-z_][A-Za-z0-9_]*)\s*[({]/.exec(s);
        if (named)
            return `${named[1]} ${named[2]}`;
        const anon = /^\s*(query|mutation|subscription)?\s*\{\s*([A-Za-z_][A-Za-z0-9_]*)/.exec(s);
        if (anon)
            return `${anon[1] ?? 'query'} ${anon[2]}`;
    }
    const url = /^((?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+)?(https?:\/\/[^/\s]+)?(\/[^\s?#]*)(\?\S*)?$/.exec(s);
    if (url)
        return `${url[1] ?? ''}${url[2] ?? ''}${url[3].split('/').map((seg) => (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(seg) ? '{uuid}' : /^[0-9a-f]{16,}$/i.test(seg) ? '{hex}' : /^\d{2,}$/.test(seg) ? '{id}' : /^(?=.*\d)[A-Za-z0-9_-]{8,}$/.test(seg) ? '{id}' : seg)).join('/')}${url[4] ? '?…' : ''}`;
    return s.replace(/"[^"]*"/g, '"*"').replace(/'[^']*'/g, "'*'").replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '{uuid}').replace(/\b[0-9a-f]{16,}\b/gi, '{hex}').replace(/\d+/g, '#').replace(/\s+/g, ' ').slice(0, 120);
}
export function groupShapes(values) {
    const m = new Map();
    for (const v of values) {
        const k = shapeOf(v);
        const e = m.get(k) ?? { shape: k, count: 0, examples: [] };
        e.count++;
        if (e.examples.length < 2)
            e.examples.push(v);
        m.set(k, e);
    }
    return [...m.values()].sort((a, b) => b.count - a.count);
}
/** Where a span-metrics label lives on the span (OTTL path, span context). Other labels: datapoint attribute. */
export function ottlTarget(label) {
    if (label === 'span_name')
        return { context: 'span', path: 'name' };
    const span = { http_url: 'http.url', url_full: 'url.full', http_target: 'http.target', url_path: 'url.path', http_route: 'http.route', db_statement: 'db.statement', db_query_text: 'db.query.text' };
    return span[label] ? { context: 'span', path: `attributes["${span[label]}"]` } : { context: 'datapoint', path: `attributes["${label.replace(/_/g, '.')}"]` };
}
/** Lens's own normalisation for well-known shapes. JS regexes are the RE2-compatible ones written into the OTTL. */
export function builtinFix(label, values) {
    if (!values.length)
        return null;
    const shapes = groupShapes(values);
    const t = ottlTarget(label);
    const share = (re) => shapes.filter((s) => re.test(s.shape)).reduce((x, s) => x + s.count, 0) / values.length;
    const q = (r) => r.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    if (share(/^(query|mutation|subscription) /) >= 0.2) {
        const p = [
            { regex: '^\\s*(query|mutation|subscription)\\s+([A-Za-z_][A-Za-z0-9_]*)\\s*[({][\\s\\S]*$', replacement: '$1 $2' },
            { regex: '^\\s*(query|mutation|subscription)\\s*\\{\\s*([A-Za-z_][A-Za-z0-9_]*)[\\s\\S]*$', replacement: '$1 $2' },
            { regex: '^\\s*\\{\\s*([A-Za-z_][A-Za-z0-9_]*)[\\s\\S]*$', replacement: 'query $1' }
        ];
        return { kind: 'graphql', title: `Name GraphQL ${label === 'span_name' ? 'spans' : label} by operation`, what: `${label} holds the full GraphQL query text, so every field selection or argument shape becomes a new value. OpenTelemetry names GraphQL spans by operation (for example “query fetchOrders”) and keeps the query text in the graphql.document attribute.`,
            patterns: p, statements: p.map((x) => `replace_pattern(${t.path}, "${q(x.regex)}", "${x.replacement.replace(/\$(\d)/g, '$$$$$1')}")`), context: t.context };
    }
    if (share(/\{(id|uuid|hex)\}|\?…$/) >= 0.2) {
        const p = [{ regex: '\\?.*$', replacement: '' }, { regex: '/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}', replacement: '/{uuid}' }, { regex: '/[0-9a-fA-F]{16,}\\b', replacement: '/{hex}' }, { regex: '/[0-9]{2,}\\b', replacement: '/{id}' }];
        return { kind: 'url', title: `Normalise IDs and query strings in ${label}`, what: `${label} values carry IDs and query strings, so every request path becomes its own value.`, patterns: p, statements: p.map((x) => `replace_pattern(${t.path}, "${q(x.regex)}", "${x.replacement}")`), context: t.context };
    }
    return null;
}
const applyPatterns = (pats) => { const rs = pats.map((p) => { try {
    return new RegExp(p.regex, 'g');
}
catch {
    return null;
} }); return (v) => pats.reduce((x, p, i) => (rs[i] ? x.replace(rs[i], String(p.replacement ?? '').replace(/\$\$/g, '$').replace(/\$\{?(\d)\}?/g, '$$$1')) : x), v); };
/** Span metrics found by the span_name label, not by assuming calls_total. */
export async function resolveSpanMetrics(ctx) {
    if (ctx.shared.has('spanMetrics'))
        return ctx.shared.get('spanMetrics');
    const names = (await pq(ctx, 'count by (__name__) ({span_name!=""})')).map((r) => r.metric.__name__).filter(Boolean);
    // Prefer the costliest metric (exact units when the usage API is available), else the main (non-db_, shortest) name.
    const units = new Map();
    if (ctx.connector.metricUsage) {
        try {
            for (const m of (await ctx.connector.metricUsage.metrics(100)).rows)
                units.set(m.name, m.units);
        }
        catch { /* estimate */ }
    }
    const best = (xs) => [...xs].sort((a, b) => (units.get(b) ?? -1) - (units.get(a) ?? -1) || Number(a.startsWith('db_')) - Number(b.startsWith('db_')) || a.length - b.length)[0];
    const pref = names.includes(ctx.opts.spanMetric) ? ctx.opts.spanMetric : undefined;
    const callsC = names.filter((n) => /calls(_total)?$/.test(n));
    const histC = names.filter((n) => /_bucket$/.test(n));
    const r = { calls: pref ?? best(callsC) ?? best(names.filter((n) => !/_(bucket|sum|count)$/.test(n))), histogram: best(histC.filter((n) => /duration/.test(n))) ?? best(histC), all: names };
    ctx.shared.set('spanMetrics', r);
    return r;
}
const LABELS_SCHEMA = { type: 'object', required: ['labels'], properties: { labels: { type: 'array', items: { type: 'object',
                required: ['label', 'title', 'what_it_is', 'action', 'why_it_matters', 'next_step', 'verify_questions', 'confidence'],
                properties: { label: { type: 'string' }, title: { type: 'string' }, what_it_is: { type: 'string' }, signals: { type: 'array', items: { type: 'string' } },
                    action: { enum: ['normalise', 'drop', 'fix_at_source', 'keep'] }, why_it_matters: { type: 'string' },
                    patterns: { type: 'array', items: { type: 'object', required: ['regex', 'replacement'], properties: { regex: { type: 'string' }, replacement: { type: 'string' } } }, description: 'For normalise: RE2 patterns applied in order to the label value.' },
                    ottl_context: { enum: ['span', 'datapoint', 'resource'], description: 'span: rewrite the span attribute/name before the spanmetrics connector (traces pipeline). datapoint/resource: metrics pipeline.' },
                    ottl_statements: { type: 'array', items: { type: 'string' } }, source_fix: { type: 'string' }, next_step: { type: 'string' }, verify_questions: { type: 'array', items: { type: 'string' } }, confidence: { enum: ['high', 'medium', 'low'] } } } } } };
/** Per-label analysis: Lens shows the evidence, Claude proposes, Lens tests the change on every real value. */
export async function investigateLabels(ctx, inv) {
    const notes = [];
    const cat = loadCatalogue();
    const W = winOf(ctx);
    const pick = (k, n) => inv.rows.filter((r) => r.kind === k && !r.locked).sort((a, b) => (b.fraction ?? b.series ?? b.unique) - (a.fraction ?? a.series ?? a.unique)).slice(0, n);
    const chosen = [...pick('high-cardinality', 3), ...pick('churn', 2), ...pick('constant', 3)];
    if (!chosen.length) {
        notes.push(`Label inventory: no high-cardinality, churn or constant labels stood out among ${inv.rows.length} labels.`);
        return { findings: [], notes };
    }
    const evidence = {};
    for (const r of chosen) {
        const values = r.kind === 'constant' ? [] : (await pq(ctx, `count by (${r.name}) (count_over_time({${r.name}!=""}[${W}]))`)).map((x) => x.metric[r.name]).filter(Boolean);
        const series = r.kind === 'constant' ? (await pq(ctx, `topk(3, count by (__name__, ${r.name}) ({${r.name}!=""}))`)).map((x) => `${x.metric.__name__}{${r.name}="${x.metric[r.name]}", …}`) : [];
        const metrics = ctx.connector.metricUsage ? (await ctx.connector.metricUsage.metricsForLabel(r.name, 10).catch(() => [])).map((m) => ({ name: m.name, units: m.units })) : (await pq(ctx, `topk(10, count by (__name__) ({${r.name}!=""}))`)).map((m) => ({ name: m.metric.__name__, series: Number(m.value[1]) }));
        evidence[r.name] = { values, series, shapes: groupShapes(values), metrics, seriesWith: scalar(await pq(ctx, `count(count_over_time({${r.name}!=""}[${W}]))`)) };
        ctx.progress({ checkId: 'INVESTIGATE', title: 'Investigate with Claude', status: 'running', message: `Grouped values of ${r.name}` });
    }
    const pct = (r) => (r.fraction !== undefined ? `${(r.fraction * 100).toFixed(2)}% of metric usage (${r.units?.toFixed(2)} units/day)` : `${fmtCount(r.series ?? 0)} series`);
    const prompt = `You are a Coralogix metrics cardinality expert helping a TAM. For each label below, Lens measured its usage and grouped its real values by shape. Propose ONE change per label.
Rules: never touch protected labels (${[...cat.protected.exact, ...cat.protected.prefixes.map((p) => p + '*')].join(', ')}). For high-cardinality labels prefer "normalise" with RE2 patterns that collapse IDs, query strings, GraphQL query text (to the operation name) or similar variable parts, keeping one value per real route or operation. For span_name or other span-metrics dimensions, set ottl_context "span" (rewrite before the spanmetrics connector; OTTL path name or attributes["k"]). Constant labels repeated on many metrics: "drop" if nothing filters on them. Churn labels (pids, uids, pod names): "drop". Use only OTTL functions replace_pattern, replace_all_patterns, delete_key, delete_matching_keys, set, keep_keys; use $$1 for capture groups in collector config. Do not invent numbers; Lens measures the effect. Return JSON only.

${chosen.map((r) => { const e = evidence[r.name]; return `### label:${r.name}\nkind (by Lens): ${r.kind}; unique values: ${fmtCount(r.unique)}; carried by ${r.metricCount ?? e.metrics.length} metrics; ${pct(r)}\n${e.shapes.length ? `value shapes (Lens): ${fmtCount(e.values.length)} values → ${fmtCount(e.shapes.length)} shapes. Top shapes:\n${e.shapes.slice(0, 12).map((s) => `  ${s.count}× ${maskText(s.shape).masked}  e.g. ${maskText(s.examples[0].slice(0, 160)).masked}`).join('\n')}` : 'single value on every series'}\nmetrics: ${e.metrics.slice(0, 8).map((m) => m.name).join(', ')}`; }).join('\n\n')}`;
    if (ctx.connector.askAI)
        ctx.progress({ checkId: 'INVESTIGATE', title: 'Investigate with Claude', status: 'running', message: `Claude is analysing ${chosen.length} labels` });
    const res = ctx.connector.askAI ? await ctx.connector.askAI(prompt, '', { schema: LABELS_SCHEMA }).catch(() => null) : null;
    let ai = [];
    if (res) {
        try {
            const j = res?.json ?? JSON.parse(String(res?.text ?? '').replace(/```json|```/g, '').trim());
            ai = j.labels ?? [];
        }
        catch {
            notes.push('Claude’s label answer could not be read as JSON; Lens used its own fixes where it had one.');
        }
    }
    // Lens's own fix for well-known shapes, so a tested transform exists with or without Claude. The better one wins.
    for (const r of chosen.filter((x) => x.kind === 'high-cardinality')) {
        const e = evidence[r.name];
        const b = builtinFix(r.name, e.values);
        if (!b)
            continue;
        const mine = new Set(e.values.map(applyPatterns(b.patterns))).size;
        const theirs = ai.find((x) => x.label === r.name);
        const theirsAfter = theirs?.action === 'normalise' && theirs.patterns?.length ? new Set(e.values.map(applyPatterns(theirs.patterns))).size : Infinity;
        if (theirsAfter <= mine) {
            theirs.patternSource = 'Claude';
            continue;
        }
        const base = { label: r.name, title: b.title, what_it_is: b.what, why_it_matters: 'Collapsing them keeps one value per real operation or route, which removes most of the series this label creates.', next_step: b.context === 'span' ? 'Add the transform in the traces pipeline before the spanmetrics connector, validate in non-prod, then re-run the label check after 24 hours.' : 'Add the transform to the metrics pipeline, then re-run the label check after 24 hours.', verify_questions: theirs?.verify_questions ?? ['Do saved views, dashboards or alerts filter on exact values of this label?'], confidence: theirs?.confidence ?? 'high', signals: theirs?.signals };
        const merged = { ...base, action: 'normalise', patterns: b.patterns, ottl_context: b.context, ottl_statements: b.statements, patternSource: theirs ? 'Lens (fewer values than Claude’s patterns)' : 'Lens (built-in for this shape)' };
        if (theirs)
            Object.assign(theirs, merged);
        else
            ai.push(merged);
    }
    const usage = JSON.stringify([...((await ctx.connector.listResources?.('alerts')) ?? []), ...((await ctx.connector.listResources?.('recording-rules')) ?? [])]);
    const mGb = pillarDailyGb(ctx.usage, 'metrics');
    const rate = effectiveRate(ctx.usage, 'metrics');
    const findings = [];
    for (const a of ai) {
        const r = chosen.find((x) => x.name === a.label);
        if (!r || a.action === 'keep')
            continue;
        const e = evidence[r.name];
        const problems = [];
        if (isProtectedMetricLabel(r.name) || NEEDED.has(r.name))
            problems.push(`${r.name} is needed by Coralogix features or Infrastructure Explorer`);
        for (const s of a.ottl_statements ?? [])
            for (const f of String(s).matchAll(/\b([A-Za-z_]+)\s*\(/g))
                if (!['replace_pattern', 'replace_all_patterns', 'delete_key', 'delete_matching_keys', 'set', 'keep_keys', 'IsMatch'].includes(f[1]))
                    problems.push(`OTTL function ${f[1]} is not allowed here`);
        const used = new RegExp(`\\b${r.name}\\b`).test(usage);
        if (used && a.action === 'drop')
            problems.push(`Alerts or recording rules mention ${r.name}`);
        let before = r.unique, after = null, removedShare = 0;
        const items = [];
        let vText = '';
        let exact = false;
        if (a.action === 'normalise' && (a.patterns ?? []).length && e.values.length) {
            const res2 = [];
            for (const p of a.patterns) {
                try {
                    res2.push(new RegExp(p.regex, 'g'));
                }
                catch {
                    problems.push(`Pattern does not compile: ${p.regex}`);
                }
            }
            const apply = (v) => a.patterns.reduce((x, p, i) => (res2[i] ? x.replace(res2[i], String(p.replacement ?? '').replace(/\$\$/g, '$').replace(/\$\{?(\d)\}?/g, '$$$1')) : x), v);
            const mapped = e.values.map(apply);
            before = new Set(e.values).size;
            after = new Set(mapped).size;
            removedShare = before ? 1 - after / before : 0;
            exact = true;
            e.values.map((v, i) => [v, mapped[i]]).filter(([x, y]) => x !== y).slice(0, 4).forEach(([x, y]) => items.push({ before: maskText(x.slice(0, 300)).masked, after: maskText(y.slice(0, 300)).masked }));
            vText = `Patterns applied by Lens to all ${fmtCount(e.values.length)} real values of ${r.name}: ${fmtCount(before)} distinct → ${fmtCount(after)} (${(removedShare * 100).toFixed(1)}% fewer).${used ? ' Alerts or recording rules mention this label: check them.' : ''}`;
            if (!items.length)
                problems.push('The patterns did not change any real value');
        }
        else if (a.action === 'drop' && r.kind !== 'constant') {
            const now = scalar(await pq(ctx, `count(count_over_time({${r.name}!=""}[${W}]))`)), aft = scalar(await pq(ctx, `count(count without (${r.name}) (count_over_time({${r.name}!=""}[${W}])))`));
            after = aft;
            removedShare = now ? 1 - aft / now : 0;
            exact = true;
            vText = `Series carrying ${r.name} over the window: ${fmtCount(now)} → ${fmtCount(aft)} without it (${(removedShare * 100).toFixed(1)}% fewer).`;
            for (const v of e.values.slice(0, 3))
                items.push({ before: maskText(`${r.name}="${v}"`).masked, after: '(label removed)' });
        }
        else if (a.action === 'drop') {
            vText = `${r.name} has one value on ${r.metricCount ?? '?'} metrics. Dropping it removes bytes from every sample but no series; the exact saving cannot be measured in advance.`;
        }
        else
            vText = 'Change at the source: not measurable in advance.';
        const ok = !problems.length && removedShare > 0;
        // Saving: exact label usage from the Metric Usage API when available, otherwise the label's share of series.
        let units = 0, basis = '';
        if (ok && r.units !== undefined) {
            units = r.units * removedShare;
            basis = `${r.name} is on series using ${r.units.toFixed(2)} units/day (Metric Usage API, ${inv.date}); ${(removedShare * 100).toFixed(1)}% fewer distinct values/series, assuming usage falls in proportion.`;
        }
        else if (ok && mGb && inv.totalSeries) {
            const gb = mGb * ((e.seriesWith * removedShare) / inv.totalSeries);
            units = gb * rate.rate;
            basis = `${fmtCount(Math.round(e.seriesWith * removedShare))} of ${fmtCount(inv.totalSeries)} metric series (estimate) × ${mGb.toFixed(2)} GB/day of metrics, at ${rate.basis}.`;
        }
        const ctxName = a.ottl_context === 'span' ? 'span' : a.ottl_context === 'resource' ? 'resource' : 'datapoint';
        const snippet = (a.ottl_statements ?? []).length ? stringify({ processors: { [`transform/lens_label_${r.name}`]: { error_mode: 'ignore', [ctxName === 'span' ? 'trace_statements' : 'metric_statements']: [{ context: ctxName, statements: a.ottl_statements }] } } }, { lineWidth: 0 }) + (ctxName === 'span' ? '# Place in the traces pipeline before the spanmetrics connector.\n' : '') : a.source_fix ? `# Change at the source:\n# ${a.source_fix}` : '';
        findings.push({ id: '', ruleId: `INV:label:${r.name}`, pillar: 'metrics', source: 'investigate', title: a.title, plain: `${a.what_it_is} ${a.why_it_matters}`,
            detail: (a.signals ?? []).length ? `Evidence: ${a.signals.join(' · ')}` : undefined, evidence: [],
            observedVolume: `${r.name}: ${fmtCount(r.unique)} unique values on ${r.metricCount ?? e.metrics.length} metrics${r.fraction !== undefined ? `, ${(r.fraction * 100).toFixed(1)}% of metric usage` : ''}`,
            savings: units ? { kind: 'units', unitsPerDay: units, gbPerDay: null, basis, pillar: 'metrics' } : { kind: 'needs-scoping', unitsPerDay: null, gbPerDay: null, basis: problems.length ? `Not validated: ${problems.join('; ')}.` : vText },
            phase: a.action === 'fix_at_source' ? 3 : 1, effort: a.action === 'fix_at_source' ? 'medium-high' : 'low', owner: a.action === 'fix_at_source' ? 'App Team' : 'DevOps', priority: 'normal',
            verifyChecklist: [...(a.verify_questions ?? []), `Do dashboards or saved views filter on specific ${r.name} values?`], verifyStatus: ok ? 'candidate' : 'needs-scoping', progress: ok ? 'not-started' : 'pending',
            overlapsWith: r.name === 'span_name' ? ['INV:skill:span-name-cardinality-analyzer', 'METRIC-SPAN-SANITIZATION', 'SPAN-HEAVY-VALUES'] : ['METRIC-HIGH-CHURN'],
            change: snippet ? { summary: a.title, snippet, ops: [] } : undefined,
            caveats: [...problems.map((p) => `Lens check: ${p}`), ...(exact ? [] : ['Not measurable before the change.']), ...(a.patternSource ? [`Patterns: ${a.patternSource}.`] : []), ...(a.patternSource?.startsWith('Lens') && !ctx.connector.askAI ? [] : [`Claude’s confidence: ${a.confidence}.`])], nextStep: a.next_step,
            sources: resolveSources(cat, ['otel-transform', 'otel-spanmetrics', 'cx-metrics-usage', 'cx-span-cardinality']),
            display: { bars: e.shapes.length ? { label: `${r.name}: ${fmtCount(e.values.length)} values group into ${fmtCount(e.shapes.length)} shapes (grouped by Lens)`, items: e.shapes.slice(0, 8).map((s) => ({ name: maskText(s.shape).masked, value: s.count, text: `${fmtCount(s.count)} values` })) } : undefined,
                samples: { label: 'Real label values (masked)', items: items.length ? items : e.shapes.length ? e.shapes.slice(0, 3).map((s) => ({ before: maskText(s.examples[0].slice(0, 300)).masked })) : e.series.map((s) => ({ before: maskText(s).masked, after: a.action === 'drop' ? maskText(s.replace(new RegExp(`${r.name}="[^"]*", `), '')).masked : undefined })) },
                table: e.metrics.length ? { summary: `Metrics carrying ${r.name}`, headers: ['Metric', r.units !== undefined ? 'Units/day' : 'Series'], rows: e.metrics.slice(0, 10).map((m) => [m.name, m.units !== undefined ? m.units.toFixed(3) : fmtCount(m.series ?? 0)]) } : undefined,
                validation: { query: a.action === 'normalise' ? `count by (${r.name}) (count_over_time({${r.name}!=""}[${W}]))` : `count(count without (${r.name}) (count_over_time({${r.name}!=""}[${W}])))`, result: problems.length ? problems.join('; ') : vText, ok },
                impact: ok ? [{ label: 'Distinct values', value: `${fmtCount(before)} → ${fmtCount(after ?? before)}` }, ...(units ? [{ label: 'Estimated saving', value: `${units >= 1 ? units.toFixed(2) : units.toFixed(3)} units/day` }] : [])] : undefined } });
    }
    return { findings, notes };
}
//# sourceMappingURL=labels.js.map