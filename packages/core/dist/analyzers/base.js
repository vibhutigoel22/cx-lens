import { resolveSources } from '../rules/catalogue.js';
export const DEFAULT_OPTIONS = {
    windowHours: 24, dupWindowMinutes: 15, rowLimit: 200,
    sampling: { nonErrorPct: 1, nonCriticalErrorPct: 1, criticalErrorPct: 100, latencyThresholdMs: 500 },
    spanMetric: 'calls_total', maxAttrQueries: 12,
};
const ALL = ['helm', 'ecs', 'ec2', 'standalone'];
const EFFORTS = ['low', 'medium', 'medium-high', 'high'];
/** Build a plugin whose metadata comes from the rule catalogue (so playbook updates flow through data). */
export function definePlugin(cat, ruleId, pillar, impl) {
    const r = cat.rules[ruleId];
    if (!r)
        throw new Error(`Rule ${ruleId} missing from catalogue`);
    return {
        id: ruleId, pillar, title: r.title,
        deploymentTypes: impl.deploymentTypes ?? r.deploymentTypes ?? ALL,
        defaultPhase: (r.defaultPhase ?? 1),
        defaultEffort: (EFFORTS.includes(r.effort) ? r.effort : 'low'),
        owner: (r.owner === 'App Team' ? 'App Team' : 'DevOps'),
        verifyChecklist: r.verify ?? [], overlapsWith: r.overlapsWith ?? [], sources: resolveSources(cat, r.sources),
        detect: impl.detect, recommend: impl.recommend, estimateSavings: impl.estimateSavings,
        generateConfigPatch: impl.generateConfigPatch ?? (() => undefined),
    };
}
export const num = (v) => (typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' && !isNaN(+v) ? +v : 0);
export const rows = (e) => (e?.rows ?? []);
export const first = (e) => rows(e)[0] ?? {};
export const GB = 1e9;
export const perDay = (value, window) => { const h = windowHours(window); return h > 0 ? value * (24 / h) : value; };
export function windowHours(w) { const m = w.match(/^(\d+)([mhd])$/); if (!m)
    return 24; const n = +m[1]; return m[2] === 'm' ? n / 60 : m[2] === 'd' ? n * 24 : n; }
export const fmtCount = (n) => (n >= 1e9 ? `${(n / 1e9).toFixed(2)}B` : n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : `${Math.round(n)}`);
export const none = (basis) => ({ kind: 'none-units', unitsPerDay: null, gbPerDay: null, basis });
export const scoping = (basis, gb = null) => ({ kind: 'needs-scoping', unitsPerDay: null, gbPerDay: gb, basis });
export const skip = (reason) => ({ applicable: false, skippedReason: reason, evidence: [], facts: {} });
export const yamlBlock = (o) => JSON.stringify(o, null, 2);
//# sourceMappingURL=base.js.map