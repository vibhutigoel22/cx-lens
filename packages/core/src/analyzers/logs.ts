import { stringify } from 'yaml';
import type { Catalogue } from '../rules/catalogue.js';
import { definePlugin, AnalyzerPlugin, skip, none, scoping, num, rows, first, GB, perDay, fmtCount } from './base.js';
import { logBaseline } from './shared.js';
import { effectiveRate, pillarTierDaily, unitsPerGb } from '../units/calculator.js';
import { isProtectedLabel } from '../guard/protected.js';
import { maskText } from '../masking/pii.js';
import type { Savings } from '../types.js';

const unitsFromLogGb = (gb: number, ctx: any, basisPrefix: string): Savings => { const r = effectiveRate(ctx.usage, 'logs'); return { kind: 'units', unitsPerDay: gb * r.rate, gbPerDay: gb, basis: `${basisPrefix}, at ${r.basis}.`, pillar: 'logs' }; };

export function logsPlugins(cat: Catalogue): AnalyzerPlugin[] {
  return [
    definePlugin(cat, 'LOG-ATTR-REDUCTION', 'logs', {
      async detect(ctx) {
        if (ctx.config.views.some((v) => v.presets?.logsCollection?.reduceLogAttributes?.enabled)) return null;
        const ev = []; let gb = 0; const per: Record<string, number> = {};
        for (const attr of cat.rules['LOG-ATTR-REDUCTION'].detect.candidateLogAttributes as string[]) {
          const e = await ctx.query('LOG-SAVINGS-CALC', 'per-attribute-cost', { attr }); ev.push(e);
          const r = first(e); const g = perDay((num(r.avg_bytes_size) + attr.length) * num(r.log_count), e.window) / GB;
          if (g > 0) { per[attr] = g; gb += g; }
        }
        return gb > 0 ? { applicable: true, evidence: ev, facts: { per, gb }, observedVolume: Object.entries(per).map(([k, v]) => `${k} ${(v * 1000).toFixed(1)} MB/day`).join(' · ') } : null;
      },
      recommend: (d) => ({ nextStep: 'Enable the reduceLogAttributes sub-preset under logsCollection on the agent (presets.logsCollection.reduceLogAttributes). No application change.', detail: `Measured attribute payload: ${Object.entries(d.facts.per).map(([k, v]: any) => `${k}: ${(v * 1000).toFixed(2)} MB/day`).join(', ')}.` }),
      generateConfigPatch: (_d, ctx) => ctx.deployment === 'helm'
        ? { summary: 'Enable reduceLogAttributes (logsCollection sub-preset)', snippet: stringify({ 'opentelemetry-agent': { presets: { logsCollection: { reduceLogAttributes: { enabled: true } } } } }), ops: [{ kind: 'helmPreset', components: ['opentelemetry-agent'], preset: 'logsCollection.reduceLogAttributes', value: { enabled: true } }] }
        : { summary: 'Delete unused log record attributes', snippet: '', ops: [{ kind: 'processor', name: 'transform/reduce_log_attributes', body: { error_mode: 'ignore', log_statements: [{ context: 'log', statements: ['delete_key(attributes, "log.file.path")', 'delete_key(attributes, "log.iostream")', 'delete_key(attributes, "logtag")'] }] }, signals: ['logs'], position: 'middle' }] },
      estimateSavings: (d, ctx) => unitsFromLogGb(d.facts.gb, ctx, '(avg value bytes + key bytes) × logs per day for each attribute'),
    }),

    definePlugin(cat, 'LOG-DUP-KEYS', 'logs', {
      async detect(ctx) {
        const sample = await ctx.query('LOG-BASELINE', 'sample');
        const recs = rows(sample).map((r) => ({ resource: r?.userData?.resource?.attributes, attributes: r?.userData?.attributes }));
        if (!recs.length) return skip('No log sample available.');
        const masked = maskText(JSON.stringify(recs.slice(0, 20), null, 1));
        if (!ctx.connector.askAI) return { applicable: true, evidence: [sample], facts: { masked, ai: null }, forceStatus: 'needs-scoping', observedVolume: 'AI review not available (claude CLI not connected)' };
        const prompt = 'You review OpenTelemetry log attributes for a telemetry hygiene review. From the masked JSON sample, list attributes whose values duplicate another attribute or are static/low-value. Never suggest any of: cloud.*, host.id, host.name, host.image.id, host.type, azure.*, gcp.*. Reply ONLY with JSON: {"candidates":[{"key":"...","scope":"resource|attributes","duplicates":"other key or null","reason":"..."}]}';
        const res = await ctx.connector.askAI(prompt, masked.masked);
        let cands: any[] = [];
        try { cands = JSON.parse((res?.text ?? '').replace(/```json|```/g, '').trim()).candidates ?? []; } catch { /* unparseable */ }
        cands = cands.filter((c) => c?.key && !isProtectedLabel(c.key));
        const ev = [sample]; let gb = 0;
        for (const c of cands.slice(0, 6)) {
          const e = await ctx.query(c.scope === 'resource' ? 'UNI-REDUCE-RESOURCE-ATTRS' : 'LOG-SAVINGS-CALC', c.scope === 'resource' ? 'resource-attr-bytes' : 'per-attribute-cost', { attr: c.key }); ev.push(e);
          const r = first(e); gb += perDay((num(r.avg_bytes ?? r.avg_bytes_size) + c.key.length) * num(r.log_count), e.window) / GB;
        }
        return cands.length ? { applicable: true, evidence: ev, facts: { masked, cands, gb }, observedVolume: `${cands.length} candidate keys from AI review of a masked sample` } : null;
      },
      recommend: (d) => ({ nextStep: d.facts.cands ? 'Confirm each candidate key with the customer, then delete them with transform/delete_keys_resource.' : 'Connect the claude CLI (or review the masked sample manually) to identify duplicated keys.',
        detail: d.facts.cands ? d.facts.cands.map((c: any) => `${c.key}${c.duplicates ? ` (duplicates ${c.duplicates})` : ''}: ${c.reason}`).join('\n') : `Masked sample prepared (${d.facts.masked.counts ? Object.entries(d.facts.masked.counts).map(([k, v]) => `${v} ${k}`).join(', ') : 'no PII found'}).`,
        caveats: ['Candidates come from an AI review of 20 masked records; every key must be verified.'] }),
      generateConfigPatch: (d) => {
        if (!d.facts.cands?.length) return undefined;
        const res = d.facts.cands.filter((c: any) => c.scope === 'resource').map((c: any) => `delete_key(attributes, "${c.key}")`);
        const att = d.facts.cands.filter((c: any) => c.scope !== 'resource').map((c: any) => `delete_key(attributes, "${c.key}")`);
        const body: any = { error_mode: 'ignore', log_statements: [] };
        if (res.length) body.log_statements.push({ context: 'resource', statements: res });
        if (att.length) body.log_statements.push({ context: 'log', statements: att });
        return { summary: 'Delete duplicated keys', snippet: stringify({ processors: { 'transform/delete_keys_resource': body } }), ops: [{ kind: 'processor', name: 'transform/delete_keys_resource', body, signals: ['logs'], position: 'middle' }] };
      },
      estimateSavings: (d, ctx) => d.facts.gb ? unitsFromLogGb(d.facts.gb, ctx, '(avg value bytes + key bytes) × logs per day for each candidate key') : scoping('Needs the duplicated keys to be identified first.'),
    }),

    definePlugin(cat, 'LOG-TEMPLATES', 'logs', {
      async detect(ctx) {
        const t = await ctx.query('LOG-TEMPLATES', 'top-templates'); const b = await ctx.query('LOG-TEMPLATES', 'top-repeated-bodies');
        if (!rows(t).length) return null;
        const top = rows(b).slice(0, 5).map((r) => `${fmtCount(perDay(num(r._count), b.window))}/day: ${String(r._expr0 ?? r['$d.body'] ?? '(null body)').slice(0, 80)}`);
        return { applicable: true, evidence: [t, b], facts: { top }, forceStatus: 'needs-scoping', observedVolume: `${rows(t).length} high-volume templates reviewed` };
      },
      recommend: (d) => ({ nextStep: 'Walk the top templates with the customer: parsed, meaningful, actionable, alert coverage, then decide parse / standardise / move tier / drop.', detail: `Most repeated messages:\n${d.facts.top.join('\n')}` }),
      estimateSavings: () => scoping('Outcome depends on the per-template decision made with the customer.'),
    }),

    definePlugin(cat, 'LOG-MULTILINE', 'logs', {
      async detect(ctx) {
        const s = await ctx.query('LOG-MULTILINE', 'short-bodies'); const a = await ctx.query('LOG-MULTILINE', 'stack-continuations');
        const frag = perDay(rows(s).reduce((x, r) => x + num(r.occurrence_count), 0), s.window);
        const fragBytes = perDay(rows(s).reduce((x, r) => x + num(r.body_bytes), 0), s.window);
        const stack = perDay(rows(a).reduce((x, r) => x + num(r.log_count), 0), a.window);
        if (frag + stack < 1000) return null;
        const base = await logBaseline(ctx);
        const looksJson = rows(s).slice(0, 8).some((r) => /^[\s{}\[\],]+$/.test(String(r.log_body ?? '')));
        return { applicable: true, evidence: [s, a, base.ev], facts: { frag, fragBytes, stack, base, looksJson, top: rows(s).slice(0, 6).map((r) => JSON.stringify(r.log_body)) },
          observedVolume: `${fmtCount(frag)} near-empty fragments/day${stack ? ` · ${fmtCount(stack)} stack-trace continuation lines/day` : ''}` };
      },
      recommend: (d) => ({ display: { chips: { label: 'Most common fragments', items: d.facts.top } }, nextStep: 'Set `multiline.line_start_pattern` on the filelog receiver so each event starts at its first line (timestamp, or `{` for pretty-printed JSON).',
        detail: `Top fragments: ${d.facts.top.join(', ')}.${d.facts.looksJson ? ' The fragments are pieces of pretty-printed JSON, so an event starts with a line beginning `{`.' : ''} In OpenTelemetry this is configured on the filelog receiver, not a processor.`,
        caveats: ['The regex must match the first line of each event for these services; confirm with a sample before rollout.', 'Better still: log JSON on a single line in the application.'] }),
      generateConfigPatch: (d, ctx) => {
        const pattern = d.facts.looksJson ? cat.rules['LOG-MULTILINE'].config.jsonLineStartPattern : cat.rules['LOG-MULTILINE'].config.lineStartPattern;
        return { summary: 'Join multi-line events on the filelog receiver', snippet: stringify({ receivers: { filelog: { multiline: { line_start_pattern: pattern } } } }),
          ops: ctx.config.format === 'collector' ? [{ kind: 'receiverSetting', receiverPrefix: 'filelog', path: ['multiline', 'line_start_pattern'], value: pattern }] : [] };
      },
      estimateSavings: (d, ctx) => {
        const bpl = d.facts.base.bytesPerLog; if (!bpl) return scoping('Needs usage data to size per-record overhead.');
        const avgFrag = d.facts.frag ? d.facts.fragBytes / d.facts.frag : 0;
        const gb = ((d.facts.frag + d.facts.stack) * Math.max(0, bpl - avgFrag)) / GB;
        return unitsFromLogGb(gb, ctx, `Each fragment is a separate record carrying full metadata. Saving ≈ fragments × (average billed bytes per log ${Math.round(bpl)} B − fragment body), since the merged text is kept`);
      },
    }),

    definePlugin(cat, 'LOG-LOW-VALUE', 'logs', {
      async detect(ctx) {
        const e = await ctx.query('LOG-LOW-VALUE', 'low-value-bodies');
        const cnt = perDay(rows(e).reduce((x, r) => x + num(r.log_count), 0), e.window);
        if (cnt < 100) return null;
        const base = await logBaseline(ctx);
        return { applicable: true, evidence: [e, base.ev], facts: { cnt, base, bodies: rows(e).map((r) => r.body) }, observedVolume: `${fmtCount(cnt)} logs/day` };
      },
      recommend: (d) => ({ nextStep: 'Drop these messages with a filter processor (or stop logging them in the app).', detail: `Bodies: ${d.facts.bodies.join(', ')}` }),
      generateConfigPatch: (d) => {
        const conds = (d.facts.bodies as string[]).map((b) => `log.body == ${JSON.stringify(b)}`);
        return { summary: 'Drop low-value logs', snippet: stringify({ processors: { 'filter/drop-low-value-logs': { error_mode: 'ignore', log_conditions: conds } } }),
          ops: [{ kind: 'processor', name: 'filter/drop-low-value-logs', body: { error_mode: 'ignore', log_conditions: conds }, signals: ['logs'], position: 'middle' }] };
      },
      estimateSavings: (d, ctx) => d.facts.base.bytesPerLog ? unitsFromLogGb((d.facts.cnt * d.facts.base.bytesPerLog) / GB, ctx, 'logs per day × average billed bytes per log') : scoping('Needs usage data.'),
    }),

    definePlugin(cat, 'LOG-DEDUP', 'logs', {
      async detect(ctx) {
        const t = await ctx.query('LOG-DEDUP', 'dup-logid-total'); const s = await ctx.query('LOG-DEDUP', 'dup-logid');
        const extra = perDay(num(first(t).extra_copies), t.window);
        if (extra < 100) return null;
        const base = await logBaseline(ctx);
        return { applicable: true, evidence: [t, s, base.ev], facts: { extra, ids: num(first(t).duplicated_ids), base }, observedVolume: `~${fmtCount(extra)} extra copies/day (from a ${t.window} window)` };
      },
      recommend: () => ({ nextStep: 'Find why logs are shipped twice (two shippers on one file, retries, duplicate pipelines). Fix the source first; use logdedup only where duplicates are expected.',
        detail: 'logdedup aggregates identical logs over an interval and emits one record with a log_count attribute. Options verified against its README; the playbook\'s cache_size and mode do not exist.',
        caveats: ['logdedup is alpha stability.', 'The daily figure is extrapolated from a 15-minute sample.'] }),
      generateConfigPatch: () => { const body = cat.rules['LOG-DEDUP'].config.body; return { summary: 'Add logdedup (alpha)', snippet: stringify({ processors: { logdedup: body } }), ops: [{ kind: 'processor', name: 'logdedup', body, signals: ['logs'], position: 'middle' }] }; },
      estimateSavings: (d, ctx) => d.facts.base.bytesPerLog ? unitsFromLogGb((d.facts.extra * d.facts.base.bytesPerLog) / GB, ctx, 'extra copies per day × average billed bytes per log') : scoping('Needs usage data.'),
    }),

    definePlugin(cat, 'LOG-OVERSIZED', 'logs', {
      async detect(ctx) {
        const e = await ctx.query('LOG-OVERSIZED', 'oversized');
        const cnt = perDay(rows(e).reduce((x, r) => x + num(r.log_count), 0), e.window);
        const bytes = perDay(rows(e).reduce((x, r) => x + num(r.body_bytes), 0), e.window);
        return cnt > 0 ? { applicable: true, evidence: [e], facts: { cnt, bytes }, observedVolume: `${fmtCount(cnt)} logs/day · ${(bytes / GB).toFixed(3)} GB` } : null;
      },
      recommend: () => ({ nextStep: 'Reduce payload size in the application: truncate large fields, drop redundant metadata, or split events.', caveats: ['Needs app-team code changes, which is why this is Phase 3.'] }),
      estimateSavings: (d, ctx) => unitsFromLogGb(d.facts.bytes / GB, ctx, 'upper bound: full body bytes of oversized logs per day'),
    }),

    definePlugin(cat, 'LOG-TCO-FIT', 'logs', {
      async detect(ctx) {
        const tiers = pillarTierDaily(ctx.usage, 'logs');
        const high = tiers.high?.gb ?? 0;
        if (high <= 0) return null;
        const e = await ctx.query('LOG-TCO-FIT', 'bytes-by-subsystem');
        const total = rows(e).reduce((x, r) => x + num(r.body_bytes), 0) || 1;
        const subs = rows(e).slice(0, 10).map((r) => ({ app: r.applicationname, sub: r.subsystemname, share: num(r.body_bytes) / total, logs: perDay(num(r.log_count), e.window) }));
        const existing = (await ctx.connector.listResources?.('tco')) ?? null;
        return { applicable: true, evidence: [e], facts: { high, subs, existing }, forceStatus: 'needs-scoping', observedVolume: `${high.toFixed(2)} GB/day of logs in High tier` };
      },
      recommend: (d) => ({ display: { bars: { label: 'Largest subsystems by log body size', items: d.facts.subs.map((s: any) => ({ name: `${s.app}/${s.sub}`, value: s.share, text: `${(s.share * 100).toFixed(0)}%` })) } },
        nextStep: 'Agree with the customer which subsystems are rarely searched and not alerted on, then create the drafted TCO Log Policies (Medium for monitoring, Low for compliance).',
        detail: `Largest subsystems by body size: ${d.facts.subs.slice(0, 6).map((s: any) => `${s.app}/${s.sub} ${(s.share * 100).toFixed(0)}%`).join(', ')}. Moving 1 GB/day from High to Medium saves ${(unitsPerGb('logs', 'high') - unitsPerGb('logs', 'medium')).toFixed(2)} units/day; to Low saves ${(unitsPerGb('logs', 'high') - unitsPerGb('logs', 'low')).toFixed(2)}.${d.facts.existing ? ` ${(d.facts.existing as unknown[]).length} TCO policies already exist.` : ''}`,
        caveats: ['If the customer still uses the legacy TCO Override table, migrate it to Log Policies (hover an override and use the convert icon).'],
        drafts: d.facts.subs.slice(0, 3).map((s: any) => ({ kind: 'tco-log-policy' as const, name: `Lens draft: ${s.app}/${s.sub} to Medium`, json: { name: `${s.app}-${s.sub}-to-medium`, description: 'Draft from Coralogix Lens. Review before creating.', priority: 'PRIORITY_TYPE_MEDIUM', enabled: false, applicationRule: { ruleTypeId: 'RULE_TYPE_ID_IS', name: String(s.app) }, subsystemRule: { ruleTypeId: 'RULE_TYPE_ID_IS', name: String(s.sub) }, targets: [{ dataset: 'logs', priority: 'PRIORITY_TYPE_MEDIUM', dataspace: 'default' }] } })),
      }),
      estimateSavings: (d) => scoping(`Depends on which subsystems move. Each GB/day moved High→Medium saves ${(unitsPerGb('logs', 'high') - unitsPerGb('logs', 'medium')).toFixed(2)} units/day (official tier rates).`, d.facts.high),
    }),

    definePlugin(cat, 'LOG-SEVERITY', 'logs', {
      async detect(ctx) {
        const e = await ctx.query('LOG-SEVERITY', 'error-templates');
        const top = rows(e).slice(0, 8).filter((r) => /expire|not found|retry|timeout|token/i.test(String(r.sample ?? '')));
        return top.length ? { applicable: true, evidence: [e], facts: { top }, forceStatus: 'needs-scoping', observedVolume: `${top.length} high-volume Error templates look routine` } : null;
      },
      recommend: (d) => ({ nextStep: 'Confirm with the app team and log these at Info or Warning instead of Error.', detail: d.facts.top.map((r: any) => `${fmtCount(num(r.log_count))}: ${String(r.sample).slice(0, 100)}`).join('\n') }),
      estimateSavings: () => ({ kind: 'severity-only', unitsPerDay: null, gbPerDay: null, basis: 'Severity fix only — improves error signal, not volume.' }),
    }),
  ];
}
