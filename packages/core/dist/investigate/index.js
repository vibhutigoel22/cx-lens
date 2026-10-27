import { stringify } from 'yaml';
import { first, num, perDay, rows, GB, fmtCount } from '../analyzers/base.js';
import { logBaseline, spanBaseline, isCritical } from '../analyzers/shared.js';
import { maskText } from '../masking/pii.js';
import { isProtectedLabel, scanForProtectedRemovals } from '../guard/protected.js';
import { effectiveRate, unitsPerGb } from '../units/calculator.js';
import { compareVersions } from '../versions/semver.js';
import { resolveSources, loadCatalogue } from '../rules/catalogue.js';
import { findBinary } from '../config/validate.js';
import { ANALYSIS_SCHEMA, SYSTEM_RULES } from './schema.js';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
export const DEFAULT_INVESTIGATE = { enabled: false, maxContributors: 8 };
const ALLOWED_OTTL = ['replace_pattern', 'replace_all_patterns', 'delete_key', 'delete_matching_keys', 'set', 'truncate_all', 'Substring', 'Len', 'IsMatch', 'Concat', 'keep_keys'];
const trimSample = (v, n = 600) => { const s = typeof v === 'string' ? v : v == null ? '' : String(v); return s.length > n ? `${s.slice(0, n)}… [+${s.length - n} chars]` : s; };
/** Text of a log record. OTel logs have a body; logs shipped as plain JSON have none: the record itself is the log. */
export function recordText(u) {
    if (typeof u?.body === 'string')
        return u.body;
    if (u?.body != null)
        return JSON.stringify(u.body);
    if (u && typeof u === 'object') {
        const { resource, scope, resourceSchemaUrl, observedTimeUnixNano, timeUnixNano, ...rest } = u;
        void resource;
        void scope;
        void resourceSchemaUrl;
        void observedTimeUnixNano;
        void timeUnixNano;
        return JSON.stringify(rest);
    }
    return u == null ? '' : String(u);
}
const short = (s, n = 90) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
/** Lens's own checks on what Claude wrote. Returns problems; empty = passed. */
export function lintSuggestion(c, pillar) {
    const p = [];
    const ottl = [c.ottl_condition ?? '', ...(c.ottl_statements ?? [])].join('\n');
    for (const m of ottl.matchAll(/\b([A-Za-z_][A-Za-z0-9_]*)\s*\(/g))
        if (!ALLOWED_OTTL.includes(m[1]) && !['and', 'or', 'not', 'where'].includes(m[1]))
            p.push(`OTTL function ${m[1]} is not on the allowed list`);
    const bal = (s) => { let d = 0, q = false; for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (ch === '"' && s[i - 1] !== '\\')
            q = !q;
        if (!q) {
            if (ch === '(')
                d++;
            if (ch === ')')
                d--;
            if (d < 0)
                return false;
        }
    } return d === 0 && !q; };
    for (const s of [c.ottl_condition, ...(c.ottl_statements ?? [])].filter(Boolean))
        if (!bal(s))
            p.push(`Unbalanced quotes or brackets in: ${short(s, 60)}`);
    if (c.regex) {
        try {
            new RegExp(c.regex);
        }
        catch {
            p.push('The replace regex does not compile');
        }
    }
    if (c.attribute && isProtectedLabel(c.attribute))
        p.push(`${c.attribute} is a protected label`);
    const fake = stringify({ processors: { 'transform/x': { log_statements: [{ context: 'log', statements: c.ottl_statements ?? [] }] } } });
    if (scanForProtectedRemovals(fake).length)
        p.push('Would remove a protected label');
    if ((c.action === 'drop' || c.action === 'sample') && !c.ottl_condition)
        p.push('Drop/sample needs an OTTL condition');
    if ((c.action === 'replace' || c.action === 'truncate' || c.action === 'delete_attribute') && !(c.ottl_statements ?? []).length)
        p.push('Transform needs OTTL statements');
    if (!/^[\s\S]{3,}$/.test(c.dataprime_filter ?? '') || /[;|]/.test(c.dataprime_filter))
        p.push('The DataPrime filter is missing or contains a pipe');
    void pillar;
    return p;
}
/** Build the collector snippet deterministically from the structured suggestion. */
function buildConfig(c, pillar, conditionsSyntax, name) {
    const sig = pillar === 'logs' ? 'log' : 'span';
    if (c.action === 'drop' || c.action === 'sample') {
        if (!c.ottl_condition)
            return null;
        if (c.action === 'sample') {
            // probabilistic_sampler supports logs and traces; filter-based keep-rate is expressed with a hash condition is not portable, so sampling is done with the official sampler on a dedicated pipeline.
            const body = { sampling_percentage: c.sample_percent ?? 10 };
            return { procName: `probabilistic_sampler/${name}`, body, snippet: stringify({ processors: { [`probabilistic_sampler/${name}`]: body } }, { lineWidth: 0 }) + `# Route only records matching:\n#   ${c.ottl_condition}\n# into a pipeline that uses this sampler (routing connector), or apply at the SDK.\n` };
        }
        const body = conditionsSyntax ? { error_mode: 'ignore', [pillar === 'logs' ? 'log_conditions' : 'trace_conditions']: [c.ottl_condition] } : { error_mode: 'ignore', [pillar === 'logs' ? 'logs' : 'traces']: { [pillar === 'logs' ? 'log_record' : 'span']: [c.ottl_condition] } };
        return { procName: `filter/${name}`, body, snippet: stringify({ processors: { [`filter/${name}`]: body } }, { lineWidth: 0 }) };
    }
    if (['replace', 'truncate', 'delete_attribute'].includes(c.action) && c.ottl_statements?.length) {
        const body = { error_mode: 'ignore', [pillar === 'logs' ? 'log_statements' : 'trace_statements']: [{ context: sig, statements: c.ottl_statements }] };
        return { procName: `transform/${name}`, body, snippet: stringify({ processors: { [`transform/${name}`]: body } }, { lineWidth: 0 }) };
    }
    return null;
}
/** If otelcol-contrib is on this machine, validate the snippet inside a minimal real collector config. */
function collectorValidate(procName, body, pillar) {
    const bin = findBinary();
    if (!bin)
        return null;
    const cfg = stringify({ receivers: { otlp: { protocols: { grpc: { endpoint: '127.0.0.1:0' } } } }, processors: { [procName]: body }, exporters: { debug: {} }, service: { pipelines: { [pillar]: { receivers: ['otlp'], processors: [procName], exporters: ['debug'] } } } });
    const d = mkdtempSync(join(tmpdir(), 'cxlens-v-'));
    const f = join(d, 'c.yaml');
    writeFileSync(f, cfg);
    const r = spawnSync(bin, ['validate', `--config=${f}`], { encoding: 'utf8', timeout: 20000 });
    return { ok: r.status === 0, output: (r.stdout + r.stderr).trim().slice(0, 400) };
}
const skippedContribs = [];
async function discover(ctx, max) {
    skippedContribs.length = 0;
    const out = [];
    const lb = await logBaseline(ctx);
    const sb = await spanBaseline(ctx);
    const t = await ctx.query('INV-LOGS', 'top-templates');
    const totalBody = rows(t).reduce((a, r) => a + num(r.body_bytes), 0) || 1;
    for (const r of rows(t).slice(0, max)) {
        try {
            const s = await ctx.query('INV-LOGS', 'samples', { template: String(r.templateid) });
            const samples = rows(s).map((x) => { const u = x?.userData ?? {}; const body = recordText(u); const attrs = Object.keys(u.attributes ?? {}); return maskText(trimSample(body)).masked + (attrs.length ? `\n  attributes: ${attrs.slice(0, 12).join(', ')}` : ''); });
            out.push({ key: `log:${r.templateid}`, pillar: 'logs', label: `${r.app}/${r.subsystem}`, perDayCount: perDay(num(r.logs), t.window), perDayBytes: perDay(num(r.body_bytes), t.window), share: num(r.body_bytes) / totalBody, meta: { template: r.templateid, app: r.app, subsystem: r.subsystem, severity: r.severity }, samples, evidence: [t, s] });
            ctx.progress({ checkId: 'INVESTIGATE', title: 'Investigate with Claude', status: 'running', message: `Sampled log pattern ${out.length} of ${Math.min(max, rows(t).length)}` });
        }
        catch (e) {
            skippedContribs.push(`log pattern ${r.templateid}: ${e.message}`);
        }
    }
    const o = await ctx.query('INV-SPANS', 'top-operations');
    const totalSpans = rows(o).reduce((a, r) => a + num(r.spans), 0) || 1;
    for (const r of rows(o).slice(0, Math.max(3, Math.round(max / 2)))) {
        try {
            const s = await ctx.query('INV-SPANS', 'samples', { service: String(r.service), operation: String(r.operation) });
            const samples = rows(s).map((x) => { const u = x?.userData ?? {}; return maskText(trimSample(JSON.stringify({ name: u.operationName, kind: u.tags?.['span.kind'], status: u.tags?.['otel.status_code'], durationUs: u.duration, attributes: Object.fromEntries(Object.entries(u.tags ?? {}).slice(0, 15)) }), 700)).masked; });
            out.push({ key: `span:${r.service}::${r.operation}`, pillar: 'traces', label: `${r.service} · ${r.operation}`, perDayCount: perDay(num(r.spans), o.window), perDayBytes: 0, share: num(r.spans) / totalSpans, meta: { service: r.service, operation: r.operation, avgDurationUs: num(r.avg_duration), critical: isCritical(ctx, r.service) }, samples, evidence: [o, s] });
        }
        catch (e) {
            skippedContribs.push(`span operation ${r.service} · ${r.operation}: ${e.message}`);
        }
    }
    void lb;
    void sb;
    return out;
}
function promptFor(ctx, cs) {
    const lines = [`Customer: ${ctx.customer.name} (${ctx.customer.environment}). Critical services: ${ctx.customer.criticalServices.join(', ') || 'none marked'}.`,
        `Window: ${ctx.opts.range ? `${ctx.opts.range.start} to ${ctx.opts.range.end}` : `last ${ctx.opts.windowHours} hours`}. Volumes below are per day.`, ''];
    for (const c of cs) {
        lines.push(`### ${c.key}`, `pillar: ${c.pillar}; ${c.pillar === 'logs' ? `application/subsystem: ${c.label}; severity: ${c.meta.severity}; records/day: ${fmtCount(c.perDayCount)}; body bytes/day: ${(c.perDayBytes / 1e6).toFixed(1)} MB; share of log body bytes: ${(c.share * 100).toFixed(1)}%` : `service · operation: ${c.label}; spans/day: ${fmtCount(c.perDayCount)}; share of spans: ${(c.share * 100).toFixed(1)}%; avg duration: ${(c.meta.avgDurationUs / 1000).toFixed(1)} ms; critical service: ${c.meta.critical ? 'yes' : 'no'}`}`, 'masked samples:', ...c.samples.map((s, i) => `[${i + 1}] ${s}`), '');
    }
    return lines.join('\n');
}
/** Investigate mode: data-driven findings with live samples, validated by Lens. */
export async function investigate(ctx, opts) {
    const notes = [];
    const cat = loadCatalogue();
    if (!ctx.connector.askAI)
        return { findings: [], notes: ['Investigate mode needs the claude CLI. It was not available, so only the playbook checks ran.'] };
    ctx.progress({ checkId: 'INVESTIGATE', title: 'Investigate with Claude', status: 'running', message: 'Finding the biggest contributors' });
    const cs = await discover(ctx, opts.maxContributors);
    if (!cs.length)
        return { findings: [], notes: ['No data found in the window to investigate.'] };
    const v = ctx.versions.collector?.current ?? ctx.versions.collector?.latest;
    const conditionsSyntax = !v || compareVersions(v, '0.146.0') >= 0;
    const prompt = `${SYSTEM_RULES({ collectorVersion: v, conditionsSyntax, protectedLabels: [...cat.protected.exact, ...cat.protected.prefixes.map((x) => x + '*')] })}\n\n${promptFor(ctx, cs)}`;
    ctx.progress({ checkId: 'INVESTIGATE', title: 'Investigate with Claude', status: 'running', message: `Claude is analysing ${cs.length} contributors` });
    const res = await ctx.connector.askAI(prompt, '', { schema: ANALYSIS_SCHEMA });
    let ai = [];
    try {
        const j = res?.json ?? JSON.parse(String(res?.text ?? '').replace(/```json|```/g, '').trim());
        ai = j.contributors ?? [];
    }
    catch {
        notes.push('Claude’s answer could not be read as JSON, so no Investigate findings were produced.');
    }
    const lb = await logBaseline(ctx);
    const sb = await spanBaseline(ctx);
    const findings = [];
    let n = 0;
    for (const a of ai) {
        const found = cs.find((x) => x.key === a.key);
        if (!found || a.action === 'keep')
            continue;
        const c = found;
        n++;
        const name = `lens_${c.pillar === 'logs' ? 'log' : 'span'}_${n}`;
        const problems = lintSuggestion(a, c.pillar);
        const cfg = problems.length ? null : buildConfig(a, c.pillar, conditionsSyntax, name);
        const cv = cfg ? collectorValidate(cfg.procName, cfg.body, c.pillar) : null;
        if (cv && !cv.ok)
            problems.push(`otelcol-contrib validate failed: ${cv.output}`);
        // Validate against real data with cx
        const ev = [...c.evidence];
        let matchedCount = 0, matchedBytes = 0, errorShare = 0;
        let vText = '';
        let vOk = false;
        const expr = a.dataprime_filter;
        if (!problems.length || problems.every((p) => p.startsWith('otelcol'))) {
            const q = await ctx.query(c.pillar === 'logs' ? 'INV-LOGS' : 'INV-SPANS', 'validate', { expr }, ['expr']);
            ev.push(q);
            const s = await ctx.query(c.pillar === 'logs' ? 'INV-LOGS' : 'INV-SPANS', c.pillar === 'logs' ? 'validate-severity' : 'validate-errors', { expr }, ['expr']);
            ev.push(s);
            if (q.error)
                problems.push(`The DataPrime filter did not run: ${q.error.slice(0, 160)}`);
            else {
                matchedCount = perDay(num(first(q).n), q.window);
                matchedBytes = perDay(num(first(q).bytes), q.window);
                const tot = rows(s).reduce((x, r) => x + num(r.n), 0) || 1;
                errorShare = rows(s).filter((r) => /error|critical|fatal/i.test(String(r.severity ?? r.status))).reduce((x, r) => x + num(r.n), 0) / tot;
                vOk = matchedCount > 0 && !(errorShare > 0 && ['drop', 'sample'].includes(a.action));
                vText = matchedCount ? `Matches ${fmtCount(matchedCount)} ${c.pillar === 'logs' ? 'logs' : 'spans'}/day${c.pillar === 'logs' ? ` (${(matchedBytes / 1e6).toFixed(1)} MB of body text)` : ''}, ${(Math.min(1, matchedCount / Math.max(1, c.perDayCount)) * 100).toFixed(0)}% of this pattern. ${errorShare > 0 ? `${(errorShare * 100).toFixed(1)}% of matches are errors${['drop', 'sample'].includes(a.action) ? ', so this drop is NOT safe as written' : ''}.` : 'No error records match.'}` : 'The filter matched no records in the window, so the suggestion was not confirmed.';
            }
        }
        // Simulate the change on the masked samples (replace / truncate) to show a real "after".
        // Drop/sample: show records actually selected by the filter, so every "dropped" example is one the change removes.
        let base = c.samples;
        if (['drop', 'sample', 'fix_at_source'].includes(a.action) && matchedCount) {
            const ms = await ctx.query(c.pillar === 'logs' ? 'INV-LOGS' : 'INV-SPANS', 'matched-samples', { expr }, ['expr']);
            ev.push(ms);
            const got = rows(ms).map((x) => { const u = x?.userData ?? {}; return maskText(trimSample(c.pillar === 'logs' ? recordText(u) : JSON.stringify({ name: u.operationName, attributes: Object.fromEntries(Object.entries(u.tags ?? {}).slice(0, 12)) }), 600)).masked; });
            if (got.length)
                base = got;
        }
        const items = base.map((before) => {
            const body = before.split('\n  attributes:')[0];
            if (a.action === 'replace' && a.regex) {
                try {
                    return { before: body, after: body.replace(new RegExp(a.regex, 'g'), (a.replacement ?? '').replace(/\$\{?(\d)\}?/g, '$$$1')) };
                }
                catch {
                    return { before: body };
                }
            }
            if (a.action === 'truncate' && a.truncate_to)
                return { before: body, after: body.length > a.truncate_to ? body.slice(0, a.truncate_to) : body };
            if (a.action === 'drop' && matchedCount && base !== c.samples)
                return { before: body, after: '(record dropped by the filter)' };
            if (a.action === 'sample' && matchedCount && base !== c.samples)
                return { before: body, after: `(kept for about ${a.sample_percent ?? 10}% of matching records)` };
            return { before: body };
        });
        // Savings: measured by Lens from real volume and official rates. Claude's numbers are never used.
        const lr = effectiveRate(ctx.usage, 'logs'), tr = effectiveRate(ctx.usage, 'traces');
        const impact = [];
        let gb = 0;
        let basis = '';
        if (c.pillar === 'logs' && matchedCount && vOk) {
            const bpl = lb.bytesPerLog ?? (matchedBytes / Math.max(1, matchedCount));
            if (a.action === 'drop' || a.action === 'fix_at_source') {
                gb = (matchedCount * bpl) / GB;
                basis = `${fmtCount(matchedCount)} matching logs/day × ${Math.round(bpl)} B average billed size per log`;
            }
            else if (a.action === 'sample') {
                const keep = (a.sample_percent ?? 10) / 100;
                gb = ((1 - keep) * matchedCount * bpl) / GB;
                basis = `${((1 - keep) * 100).toFixed(0)}% of ${fmtCount(matchedCount)} matching logs/day × ${Math.round(bpl)} B`;
            }
            else if (a.action === 'truncate' && a.truncate_to) {
                const tq = await ctx.query('INV-LOGS', 'validate-truncate', { expr, limit: String(a.truncate_to) }, ['expr']);
                ev.push(tq);
                const tn = perDay(num(first(tq).n), tq.window), tb = perDay(num(first(tq).bytes), tq.window);
                gb = Math.max(0, tb - tn * a.truncate_to) / GB;
                basis = `${fmtCount(tn)} logs/day longer than ${a.truncate_to} characters lose ${((tb - tn * a.truncate_to) / Math.max(1, tn)).toFixed(0)} B each on average (measured)`;
            }
            else if (a.action === 'replace' && items.some((i) => i.after !== undefined)) {
                const saved = items.filter((i) => i.after !== undefined).map((i) => Buffer.byteLength(i.before) - Buffer.byteLength(i.after));
                const avg = saved.reduce((x, y) => x + y, 0) / saved.length;
                gb = Math.max(0, avg * matchedCount) / GB;
                basis = `${avg.toFixed(0)} B removed per log (measured on the live samples) × ${fmtCount(matchedCount)} matching logs/day`;
            }
            else if (a.action === 'move_tier' && a.tier) {
                const g = (matchedCount * bpl) / GB;
                const u = g * (unitsPerGb('logs', 'high') - unitsPerGb('logs', a.tier));
                impact.push({ label: 'Volume moved', value: `${g.toFixed(3)} GB/day` });
                findings.push(make(u, g, `${g.toFixed(3)} GB/day moved from High (${unitsPerGb('logs', 'high')} units/GB) to ${a.tier} (${unitsPerGb('logs', a.tier)} units/GB)`));
                continue;
            }
            if (gb) {
                impact.push({ label: 'Affected per day', value: `${fmtCount(matchedCount)} logs` }, { label: 'Data removed', value: gb >= 1 ? `${gb.toFixed(2)} GB/day` : `${(gb * 1000).toFixed(1)} MB/day` }, { label: 'Rate used', value: `${lr.rate.toFixed(3)} units/GB` });
            }
        }
        else if (c.pillar === 'traces' && matchedCount && vOk && sb.gbPerDay && sb.count) {
            const share = matchedCount / sb.count * (a.action === 'sample' ? 1 - (a.sample_percent ?? 10) / 100 : 1);
            if (['drop', 'sample', 'fix_at_source'].includes(a.action)) {
                gb = sb.gbPerDay * share;
                basis = `${fmtCount(matchedCount)} matching spans/day = ${(share * 100).toFixed(2)}% of ${fmtCount(sb.count)} spans × ${sb.gbPerDay.toFixed(2)} GB/day of traces`;
                impact.push({ label: 'Affected per day', value: `${fmtCount(matchedCount)} spans` }, { label: 'Data removed', value: `${gb >= 1 ? gb.toFixed(2) + ' GB' : (gb * 1000).toFixed(1) + ' MB'}/day` }, { label: 'Rate used', value: `${tr.rate.toFixed(3)} units/GB` });
            }
        }
        const units = gb * (c.pillar === 'logs' ? lr.rate : tr.rate);
        if (units)
            impact.push({ label: 'Estimated saving', value: `${units >= 1 ? units.toFixed(2) : units.toFixed(3)} units/day` });
        findings.push(make(units || null, gb || null, basis ? `${basis}, at ${(c.pillar === 'logs' ? lr : tr).basis}.` : problems.length ? 'Not validated, so no saving is claimed.' : 'Not quantified.'));
        function make(u, g, b) {
            const phase = a.action === 'fix_at_source' ? 3 : 1;
            const effort = a.action === 'fix_at_source' ? 'medium-high' : 'low';
            const validated = !problems.length && vOk;
            return {
                id: '', ruleId: `INV:${c.key}`, pillar: c.pillar, source: 'investigate', title: a.title, plain: `${a.what_it_is} ${a.why_it_matters}`,
                detail: (a.signals ?? []).length ? `Evidence: ${(a.signals ?? []).join(' · ')}` : undefined,
                evidence: ev, observedVolume: `${c.label}: ${fmtCount(c.perDayCount)} ${c.pillar === 'logs' ? 'logs' : 'spans'}/day${c.pillar === 'logs' ? `, ${(c.perDayBytes / 1e6).toFixed(1)} MB body text` : ''}`,
                savings: validated && u ? { kind: 'units', unitsPerDay: u, gbPerDay: g, basis: b, pillar: c.pillar } : { kind: 'needs-scoping', unitsPerDay: null, gbPerDay: null, basis: problems.length ? `Not validated: ${problems.join('; ')}.` : b },
                phase, effort, owner: a.action === 'fix_at_source' ? 'App Team' : 'DevOps', priority: 'normal',
                verifyChecklist: [...a.verify_questions, ...(c.pillar === 'logs' ? ['Is any alert, dashboard or saved view built on these records?'] : ['Is any alert or SLO built on these spans?'])],
                verifyStatus: validated ? 'candidate' : 'needs-scoping', progress: validated ? 'not-started' : 'pending',
                overlapsWith: c.pillar === 'traces' ? ['SPAN-SAMPLING', 'SPAN-HEALTH', 'SPAN-INTERNAL'] : [],
                change: cfg ? { summary: a.title, snippet: cfg.snippet, ops: [] } : a.source_fix ? { summary: a.title, snippet: `# Change at the source (application or shipper):\n# ${a.source_fix}`, ops: [] } : undefined,
                caveats: [...problems.map((p) => `Lens check: ${p}`), ...(cv?.ok ? ['Validated with otelcol-contrib on this Mac.'] : cfg ? ['OTTL checked by Lens (allowed functions, quoting, protected labels). Run otelcol-contrib validate before rollout.'] : []), `Claude’s confidence: ${a.confidence}.`],
                nextStep: a.next_step, sources: resolveSources(cat, ['otel-transform', 'otel-filter', 'cx-dataprime', 'cx-units']),
                display: { samples: { label: base !== c.samples ? 'Live samples of the records this change affects (masked)' : 'Live samples (masked)', items, afterNote: items.some((i) => i.after) ? (a.action === 'replace' ? 'After: the replace_pattern regex applied by Lens to these exact samples.' : a.action === 'truncate' ? `After: truncated to ${a.truncate_to} characters.` : undefined) : undefined },
                    validation: { query: `filter ${expr}`, result: vText || (problems.length ? problems.join('; ') : 'Not run'), ok: validated }, impact },
            };
        }
    }
    if (ai.length && !findings.length)
        notes.push('Claude reviewed the top contributors and recommended keeping them as they are.');
    for (const s of skippedContribs)
        notes.push(`Investigate skipped ${s}`);
    return { findings, notes, prompt };
}
//# sourceMappingURL=index.js.map