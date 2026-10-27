import { stringify } from 'yaml';
import type { Catalogue } from '../rules/catalogue.js';
import { definePlugin, AnalyzerPlugin, AnalyzerContext, Detection, skip, none, num, first, rows, GB, perDay, fmtCount } from './base.js';
import { effectiveRate } from '../units/calculator.js';
import { scanForProtectedRemovals, isProtectedLabel } from '../guard/protected.js';
import { HELM_COMPONENTS, pipelinesFor } from '../config/parse.js';
import { compareVersions } from '../versions/semver.js';

export function protectedSafeDenylist(cat: Catalogue) {
  const ml: string[] = cat.universal.denylists.metricsAndLogs.filter((k: string) => !isProtectedLabel(k));
  const traces = ml.filter((k) => !cat.universal.denylists.tracesExclude.includes(k));
  return { metrics: ml, logs: ml, traces };
}

/** Find which denylisted resource attributes actually appear in sampled records. */
async function presentAttrs(ctx: AnalyzerContext, cat: Catalogue) {
  const deny = protectedSafeDenylist(cat).logs;
  const logSample = await ctx.query('LOG-BASELINE', 'sample');
  const spanSample = await ctx.query('SPAN-BASELINE', 'sample');
  const logKeys = new Set<string>(), spanKeys = new Set<string>();
  for (const r of rows(logSample)) for (const k of Object.keys(r?.userData?.resource?.attributes ?? {})) logKeys.add(k);
  for (const r of rows(spanSample)) for (const k of Object.keys(r?.userData?.process?.tags ?? {})) spanKeys.add(k);
  return { logs: deny.filter((k) => logKeys.has(k)), spans: protectedSafeDenylist(cat).traces.filter((k) => spanKeys.has(k)), evidence: [logSample, spanSample] };
}

export function universalPlugins(cat: Catalogue): AnalyzerPlugin[] {
  return [
    definePlugin(cat, 'UNI-REDUCE-RESOURCE-ATTRS', 'universal', {
      async detect(ctx) {
        const cfg = ctx.config;
        const status: Record<string, string> = {};
        if (cfg.format === 'helm-values') {
          for (const v of cfg.views) {
            const p = v.presets?.reduceResourceAttributes;
            status[v.name] = !p?.enabled ? 'disabled' : !p.denylist ? 'default-denylist' : 'custom-denylist';
          }
          if (Object.values(status).every((s) => s === 'custom-denylist')) return null;
        } else if (cfg.format === 'collector' && /transform\/reduce|reduceResourceAttributes/.test(cfg.text)) return null;
        const pa = await presentAttrs(ctx, cat);
        const ev = [...pa.evidence];
        let logGb = 0, spanGb = 0; const perAttr: { attr: string; logs?: number; spans?: number }[] = [];
        for (const attr of pa.logs.slice(0, ctx.opts.maxAttrQueries)) {
          const e = await ctx.query('UNI-REDUCE-RESOURCE-ATTRS', 'resource-attr-bytes', { attr }); ev.push(e);
          const r = first(e); const gb = perDay((num(r.avg_bytes) + attr.length) * num(r.log_count), e.window) / GB; logGb += gb; perAttr.push({ attr, logs: gb });
        }
        for (const attr of pa.spans.slice(0, ctx.opts.maxAttrQueries)) {
          const e = await ctx.query('UNI-REDUCE-RESOURCE-ATTRS', 'resource-attr-bytes-spans', { attr }); ev.push(e);
          const r = first(e); const gb = perDay((num(r.avg_bytes) + attr.length) * num(r.span_count), e.window) / GB; spanGb += gb;
          const ex = perAttr.find((x) => x.attr === attr); if (ex) ex.spans = gb; else perAttr.push({ attr, spans: gb });
        }
        if (!pa.logs.length && !pa.spans.length && cfg.format !== 'helm-values') return null;
        const capped = pa.logs.length > ctx.opts.maxAttrQueries || pa.spans.length > ctx.opts.maxAttrQueries;
        return { applicable: true, evidence: ev, facts: { status, logGb, spanGb, perAttr, present: pa, capped },
          observedVolume: `${pa.logs.length} removable attributes on logs, ${pa.spans.length} on spans (~${(logGb + spanGb).toFixed(3)} GB/day)` };
      },
      recommend(d) {
        const s = d.facts.status as Record<string, string>;
        const st = Object.keys(s).length ? ` Current state: ${Object.entries(s).map(([k, v]) => `${k.replace('opentelemetry-', '')} ${v}`).join(', ')}.` : '';
        return { display: { chips: { label: 'Removable attributes found on records', items: [...new Set([...d.facts.present.logs, ...d.facts.present.spans])] as string[] } },
          detail: `Attributes found on records: ${[...new Set([...d.facts.present.logs, ...d.facts.present.spans])].join(', ') || 'none sampled'}.${st} A custom denylist replaces the chart default, so the full protected-safe list from the playbook is written (traces keep telemetry.*).`,
          nextStep: 'Enable reduceResourceAttributes with the protected-safe custom denylist on cluster-collector, agent and gateway, then roll out with a Helm upgrade.',
          caveats: ['Recheck the custom denylist against the chart README "Filtering and reducing costs" section on every chart upgrade, because the default list can change.',
            ...(d.facts.capped ? ['Only the first attributes were measured to respect query limits; the real saving is likely higher.'] : []),
            'Metric series saving is not converted to units here; see the METRIC high-churn finding for series counts.'],
        };
      },
      generateConfigPatch(_d, ctx) {
        const dl = protectedSafeDenylist(cat);
        const value = { enabled: true, pipelines: ['metrics', 'traces', 'logs'], denylist: dl };
        const helm = ctx.config.format !== 'collector' && ctx.deployment === 'helm';
        if (helm) return { summary: 'Enable reduceResourceAttributes with the protected-safe custom denylist on every collector', snippet: stringify({ 'opentelemetry-cluster-collector': { presets: { reduceResourceAttributes: value } } }),
          ops: [{ kind: 'helmPreset', components: ['opentelemetry-cluster-collector', 'opentelemetry-agent', 'opentelemetry-gateway'], preset: 'reduceResourceAttributes', value, anchor: 'cx_reduce_resource_attributes' }] };
        // Non-Helm: transform/reduce modelled on the Coralogix ECS/EC2 integration block (protected labels kept)
        const stmts = (keys: string[]) => keys.map((k) => `delete_key(resource.attributes, "${k}")`);
        const body = { error_mode: 'silent', log_statements: [{ context: 'log', statements: stmts(dl.logs) }], metric_statements: [{ context: 'metric', statements: stmts(dl.metrics) }], trace_statements: [{ context: 'span', statements: stmts(dl.traces) }] };
        return { summary: 'Add transform/reduce (Coralogix ECS/EC2 integration pattern) keeping protected labels', snippet: stringify({ processors: { 'transform/reduce': body } }),
          ops: [{ kind: 'processor', name: 'transform/reduce', body, signals: ['logs', 'metrics', 'traces'], position: 'middle' }] };
      },
      estimateSavings(d, ctx) {
        const l = effectiveRate(ctx.usage, 'logs'), t = effectiveRate(ctx.usage, 'traces');
        const u = d.facts.logGb * l.rate + d.facts.spanGb * t.rate;
        return { kind: 'units', unitsPerDay: u, gbPerDay: d.facts.logGb + d.facts.spanGb, basis: `Sum over present attributes of (avg value bytes + key bytes) × records per day, at ${l.basis} for logs and ${t.basis} for spans.` };
      },
    }),

    definePlugin(cat, 'UNI-GROUPBYATTRS', 'universal', {
      async detect(ctx) {
        if (ctx.config.format !== 'collector') return skip(ctx.config.format === 'helm-values' ? 'Helm chart manages pipeline processors; check rendered config with helm template.' : 'Needs a collector config to check pipelines.');
        const missing: string[] = [];
        for (const v of ctx.config.views) for (const [p, def] of Object.entries(v.pipelines)) if (!(def.processors ?? []).some((x) => x.startsWith('groupbyattrs'))) missing.push(p);
        const fluent = /fluent|prometheus/.test(ctx.config.text);
        return missing.length && fluent ? { applicable: true, evidence: [], facts: { missing }, observedVolume: `Pipelines without groupbyattrs: ${missing.join(', ')}` } : null;
      },
      recommend: (d) => ({ nextStep: 'Add groupbyattrs (keys: []) immediately before batch in the listed pipelines.', detail: `Receivers like Fluent Bit-style forwarders and Prometheus scrapes repeat the resource header on every batch. Pipelines: ${d.facts.missing.join(', ')}.`, caveats: ['Efficiency lever: smaller requests and less memory, not a unit saving.'] }),
      generateConfigPatch: () => ({ summary: 'Compact repeated Resource/Scope blocks', snippet: 'processors:\n  groupbyattrs:\n    keys: []\n', ops: [{ kind: 'processor', name: 'groupbyattrs', body: { keys: [] }, signals: ['logs', 'metrics', 'traces'], position: 'before-batch' }] }),
      estimateSavings: () => none('Compaction reduces requests and memory, not ingested units.'),
    }),

    definePlugin(cat, 'UNI-K8SATTR-ALLOWLIST', 'universal', {
      async detect(ctx) {
        if (ctx.config.format === 'empty' || ctx.config.format === 'other') return skip('Needs a config to inspect k8sattributes extraction.');
        const deletes = (ctx.config.text.match(/delete_key\(/g) ?? []).length;
        const k8s = ctx.config.views.flatMap((v) => Object.entries(v.processors).filter(([k]) => k.startsWith('k8sattributes')));
        const extractsAll = k8s.some(([, b]) => !b?.extract?.metadata);
        if (deletes >= cat.universal.rules.find((r: any) => r.id === 'UNI-K8SATTR-ALLOWLIST').thresholds.deleteKeyLinesSignal || extractsAll)
          return { applicable: true, evidence: [], facts: { deletes, extractsAll }, observedVolume: `${deletes} delete_key statements; ${extractsAll ? 'k8sattributes without an explicit metadata allowlist' : 'k8sattributes allowlisted'}` };
        return null;
      },
      recommend: (d) => ({ nextStep: 'Replace the downstream delete_key blocks with an explicit k8sattributes extract allowlist of the fields the customer queries or alerts on.', detail: d.facts.deletes >= 30 ? 'A transform block with 30+ delete_key lines duplicated across signals is the playbook signal that the fix belongs in k8sattributes extraction.' : 'k8sattributes extracts its default metadata set. Listing only what is used stops bloat at the source.' }),
      generateConfigPatch: () => { const body = cat.rules['UNI-K8SATTR-ALLOWLIST'].config.processor.body; return { summary: 'Allowlist k8sattributes extraction', snippet: stringify({ processors: { k8sattributes: body } }), ops: [] }; },
      estimateSavings: () => ({ kind: 'needs-scoping', unitsPerDay: null, gbPerDay: null, basis: 'Depends on which fields the customer keeps; measure per attribute after agreeing the allowlist.' }),
    }),

    definePlugin(cat, 'UNI-MEMLIMIT-BATCH', 'universal', {
      async detect(ctx) {
        if (ctx.config.format !== 'collector' && ctx.config.format !== 'helm-values') return skip('Needs a config to check processor order.');
        const issues: string[] = [];
        for (const v of ctx.config.views) for (const [p, def] of Object.entries(v.pipelines)) {
          const ps = def.processors; if (!ps) continue;
          const ml = ps.findIndex((x) => x.startsWith('memory_limiter')); const b = ps.findIndex((x) => x === 'batch' || x.startsWith('batch/'));
          if (ml === -1) issues.push(`${v.name}/${p}: no memory_limiter`); else if (ml !== 0) issues.push(`${v.name}/${p}: memory_limiter is not first`);
          if (b === -1) issues.push(`${v.name}/${p}: no batch`); else if (b !== ps.length - 1) issues.push(`${v.name}/${p}: batch is not last`);
        }
        return issues.length ? { applicable: true, evidence: [], facts: { issues }, observedVolume: issues.join('; ') } : null;
      },
      recommend: (d) => ({ nextStep: 'Put memory_limiter first and batch last in every pipeline.', detail: d.facts.issues.join('\n') }),
      generateConfigPatch: () => ({ summary: 'memory_limiter first, batch last', snippet: stringify({ processors: { memory_limiter: cat.rules['UNI-MEMLIMIT-BATCH'].config.memory_limiter, batch: cat.rules['UNI-MEMLIMIT-BATCH'].config.batch } }),
        ops: [{ kind: 'processor', name: 'memory_limiter', body: cat.rules['UNI-MEMLIMIT-BATCH'].config.memory_limiter, signals: ['logs', 'metrics', 'traces'], position: 'first' },
              { kind: 'processor', name: 'batch', body: cat.rules['UNI-MEMLIMIT-BATCH'].config.batch, signals: ['logs', 'metrics', 'traces'], position: 'last' }] }),
      estimateSavings: () => none('Stability baseline; prevents data loss during memory pressure.'),
    }),

    definePlugin(cat, 'UNI-OTLP-COMPRESSION', 'universal', {
      async detect(ctx) {
        // otlpexporter README: gzip is enabled by default. Only an explicit `compression: none` is a finding.
        const off: string[] = [];
        for (const v of ctx.config.views) for (const [k, b] of Object.entries<any>(v.exporters)) if (/^otlp/.test(k) && b?.compression === 'none') off.push(`${v.name}/${k}`);
        return off.length ? { applicable: true, evidence: [], facts: { off }, observedVolume: `Compression disabled on ${off.join(', ')}` } : null;
      },
      recommend: () => ({ nextStep: 'Remove `compression: none` (gzip is the OTLP default) or set zstd.', caveats: ['Saves network egress only; Coralogix units are measured before compression.'] }),
      estimateSavings: () => none('Network egress only — not Coralogix units.'),
    }),

    definePlugin(cat, 'UNI-PROTECTED-LABEL-REMOVED', 'universal', {
      async detect(ctx) {
        if (ctx.config.format !== 'collector' && ctx.config.format !== 'helm-values') return null;
        const v = scanForProtectedRemovals(ctx.config.doc);
        // Preset enabled with the chart DEFAULT denylist also removes protected labels.
        for (const view of ctx.config.views) { const p = view.presets?.reduceResourceAttributes; if (p?.enabled && !p.denylist) for (const k of cat.universal.denylists.chartDefaultSnapshot.attributes.filter(isProtectedLabel)) v.push({ key: k, location: `${view.name}.presets.reduceResourceAttributes (chart default denylist)`, how: 'denylist' }); }
        return v.length ? { applicable: true, evidence: [], facts: { v }, priority: 'high', observedVolume: `${new Set(v.map((x) => x.key)).size} protected label(s) removed` } : null;
      },
      recommend: (d) => ({ display: { chips: { label: 'Protected labels being removed', items: [...new Set(d.facts.v.map((x: any) => x.key))] as string[] }, notes: [{ kind: 'warn', text: 'Infrastructure Explorer, the APM Infrastructure tab and AWS resource enrichment depend on these attributes.' }] }, nextStep: 'Stop removing these attributes. The generated config writes a protected-safe denylist and strips protected labels from existing lists.', detail: d.facts.v.map((x: any) => `${x.key} — ${x.how} at ${x.location}`).join('\n') }),
      generateConfigPatch: (d, ctx) => ctx.deployment === 'helm' ? universalPlugins(cat)[0].generateConfigPatch(d, ctx) : undefined,
      estimateSavings: () => none('Protects Infrastructure Explorer; may slightly increase volume.'),
    }),

    definePlugin(cat, 'UNI-UPGRADE', 'universal', {
      async detect(ctx) {
        const h = ctx.versions.helmChart, c = ctx.versions.collector;
        const out: string[] = [];
        if (ctx.deployment === 'helm' && h?.current && h.latest && compareVersions(h.current, h.latest) < 0) out.push(`Helm chart ${h.current} → ${h.latest}`);
        if (ctx.deployment !== 'helm' && c?.current && c.latest && compareVersions(c.current, c.latest) < 0) out.push(`Collector ${c.current} → ${c.latest}`);
        return out.length ? { applicable: true, evidence: [], facts: { out }, observedVolume: out.join('; ') } : null;
      },
      recommend: (d) => ({ nextStep: 'Upgrade in non-production first using upgraded-config.yaml, keep the current values as the rollback, then promote.', detail: `${d.facts.out.join('; ')}. See the Upgrade section for breaking changes.` }),
      estimateSavings: () => none('Enables the presets and fixes used by other findings.'),
    }),
  ];
}
export { HELM_COMPONENTS, pipelinesFor, fmtCount };
