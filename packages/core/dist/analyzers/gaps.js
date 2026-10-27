import { rows, num } from './base.js';
import { labelAnalysis } from './metrics.js';
import { resolveSources } from '../rules/catalogue.js';
/** Adoption gaps and expansion opportunities (not savings). */
export async function detectGaps(ctx) {
    const g = [];
    const src = resolveSources(ctx.cat, ['playbook']);
    const slos = await ctx.connector.listResources?.('slos');
    if (Array.isArray(slos) && slos.length === 0)
        g.push({ area: 'SLOs', detail: 'No SLOs are defined.', opportunity: 'Define SLOs on the critical services using span metrics.', sources: src });
    const e2m = await ctx.connector.listResources?.('e2m');
    if (Array.isArray(e2m) && e2m.length === 0)
        g.push({ area: 'Events2Metrics', detail: 'No Events2Metrics definitions.', opportunity: 'Convert high-volume, low-value logs and traces into metrics for long-term trends.', sources: resolveSources(ctx.cat, ['cx-e2m']) });
    try {
        const sdk = await ctx.query('SPAN-BASELINE', 'sdk-split');
        const dotnet = rows(sdk).filter((r) => String(r.lang).toLowerCase() === 'dotnet' && String(r.sdk).toLowerCase() !== 'opentelemetry');
        if (dotnet.length)
            g.push({ area: '.NET SDK', detail: `Services on a non-OpenTelemetry .NET SDK: ${dotnet.map((r) => r.service).join(', ')}.`, opportunity: 'The proprietary Coralogix .NET SDK is deprecated; move to the OpenTelemetry .NET SDK and the same collector pipeline.', sources: src });
        const traced = new Set(rows(sdk).map((r) => String(r.service)));
        const la = await labelAnalysis(ctx);
        if (la) {
            const missing = la.services.filter((s) => !traced.has(s));
            if (missing.length)
                g.push({ area: 'Tracing coverage', detail: `Services with span metrics but no sampled traces: ${missing.slice(0, 10).join(', ')}.`, opportunity: 'Check whether these are instrumented end to end.', sources: src });
        }
    }
    catch { /* evidence errors are reported on the query */ }
    const last = ctx.usage?.days.at(-1);
    if (last) {
        const has = (p) => Object.entries(last.byPillarTier).some(([k, v]) => k.startsWith(p) && v.gb > 0);
        if (!has('sessionRecording'))
            g.push({ area: 'RUM', detail: 'No session-recording usage in the last day.', opportunity: 'Real User Monitoring would connect front-end experience to back-end traces.', sources: src });
        if (!has('profiles'))
            g.push({ area: 'Continuous profiling', detail: 'No profiling usage.', opportunity: 'Profiling can explain CPU hot spots found during investigations.', sources: src });
    }
    return g;
}
export { num };
//# sourceMappingURL=gaps.js.map