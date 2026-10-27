import { DEPLOYMENT_LABEL } from '../types.js';
import { baselineUnitsPerDay, combinedSavings, completeDays, overlapGroups, pillarDailyGb } from '../units/calculator.js';
import { loadCatalogue } from '../rules/catalogue.js';
import { BRAND } from '../brand.js';
export const REPORT_SCHEMA_VERSION = '1.0.0';
const PHASES = [
    { phase: 1, name: 'Phase 1 – Quick Wins', goal: 'Config-only changes with no app code involvement', timeframe: '1–2 weeks', effort: 'Low' },
    { phase: 2, name: 'Phase 2 – Coordinated Changes', goal: 'Helm upgrade, collector redeploy, or light cross-team review', timeframe: '2–4 weeks', effort: 'Medium' },
    { phase: 3, name: 'Phase 3 – Strategic', goal: 'App code changes or architectural decisions', timeframe: '1 quarter', effort: 'Medium–High' },
];
const addDays = (d) => new Date(Date.now() + d * 864e5).toISOString().slice(0, 10);
export function buildReport(a, opts = {}) {
    const audience = opts.audience ?? 'internal';
    const cat = loadCatalogue();
    // Customer-ready: only Verified findings, unless TAM overrides (then Draft watermark).
    let fs = a.findings.filter((f) => f.verifyStatus !== 'rejected' && !cat.rules[f.ruleId]?.internalOnly);
    let draft = false;
    if (audience === 'customer') {
        const ver = fs.filter((f) => f.verifyStatus === 'verified');
        if (opts.includeUnverified && ver.length < fs.length)
            draft = true;
        else
            fs = ver;
    }
    if (opts.draft)
        draft = true; // explicit "download as draft": watermark every report
    const ruleToId = new Map(a.findings.map((f) => [f.ruleId, f.id]));
    const baseline = baselineUnitsPerDay(a.usage);
    const counted = fs.filter((f) => f.savings.kind === 'units' && (f.savings.unitsPerDay ?? 0) > 0);
    const comb = combinedSavings(counted, baseline);
    const p1 = counted.filter((f) => f.phase === 1);
    const p1comb = combinedSavings(p1, baseline).total;
    let cum = 0;
    const roadmap = PHASES.map((p) => { const inPhase = counted.filter((f) => f.phase <= p.phase); cum = combinedSavings(inPhase, baseline).total; return { ...p, cumulativeUnitsPerDay: cum, findingIds: fs.filter((f) => f.phase === p.phase).map((f) => f.id) }; });
    const largest = counted.reduce((m, f) => (!m || (f.savings.unitsPerDay ?? 0) > (m.savings.unitsPerDay ?? 0) ? f : m), null);
    const ranked = fs.map((f, i) => ({ ...f, rank: i + 1, overlapsWithIds: f.overlapsWith.map((r) => ruleToId.get(r)).filter((x) => !!x && fs.some((g) => g.id === x)),
        sources: audience === 'customer' ? f.sources.filter((s) => !s.internal) : f.sources }));
    const trend = (a.usage?.days ?? []).map((d) => {
        const sum = (p) => Object.entries(d.byPillarTier).filter(([k]) => k.startsWith(p + ':')).reduce((x, [, v]) => x + v.units, 0);
        return { date: d.date, total: d.totalUnits, logs: sum('logs'), traces: sum('traces'), metrics: sum('metrics') };
    });
    const v = a.versions;
    const up = opts.upgrade ?? null;
    const ownerOf = (ph) => fs.filter((f) => f.phase === ph).map((f) => f.owner);
    const nextSteps = [
        { owner: 'Customer DevOps', action: 'Review and approve the Phase 1 changes and config diff', byWhen: addDays(7) },
        { owner: audience === 'customer' ? 'Coralogix TAM' : a.customer.preparedBy || 'TAM', action: 'Re-run the assessment to confirm Phase 1 savings, then update the status column', byWhen: addDays(21) },
        ...(ownerOf(2).length ? [{ owner: 'Customer DevOps', action: 'Schedule the Phase 2 Helm upgrade / collector redeploy (non-prod first)', byWhen: addDays(28) }] : []),
        ...(fs.some((f) => f.verifyStatus === 'needs-scoping') ? [{ owner: 'Customer App Team', action: 'Scope the findings marked TBD', byWhen: addDays(30) }] : []),
    ];
    const leadership = (() => {
        const cd = completeDays(a.usage);
        const per = (p) => (cd.length ? cd.reduce((x, d) => x + Object.entries(d.byPillarTier).filter(([k]) => k.startsWith(p + ':')).reduce((y, [, v]) => y + v.units, 0), 0) / cd.length : 0);
        const counts = counted.filter((f) => f.countedInTotal !== false);
        const pillarOf = (f) => (f.savings.pillar ?? (f.pillar !== 'universal' ? f.pillar : null));
        const pillars = ['metrics', 'traces', 'logs'].map((p) => ({ pillar: p, units: per(p), saving: combinedSavings(counts.filter((f) => pillarOf(f) === p), null).total })).filter((x) => x.units > 0 || x.saving > 0).sort((x, y) => y.units - x.units);
        const pipelineWide = combinedSavings(counts.filter((f) => pillarOf(f) === null), null).total;
        const total = comb.total;
        const tot = pillars.reduce((x, p) => x + p.units, 0) || 1;
        const big = pillars.find((p) => p.units / tot >= 0.4 && (p.units ? p.saving / p.units : 0) < 0.05);
        return { audience: a.customer.audience?.trim() || 'leadership', baseline, saving: total, after: baseline !== null ? Math.max(0, baseline - total) : null, pct: baseline ? (total / baseline) * 100 : null,
            perMonth: total * 30, perYear: total * 365, quickWinShare: total > 0 ? Math.min(1, p1comb / total) : null, pillars, pipelineWide,
            // Only the changes the total actually counts: in each overlap group, the largest member. The list then adds up to (at most) the headline.
            top: (() => {
                const groups = overlapGroups(counts);
                const drop = new Set();
                for (const g of groups) {
                    const members = counts.filter((f) => g.ids.includes(f.id)).sort((x, y) => (y.savings.unitsPerDay ?? 0) - (x.savings.unitsPerDay ?? 0));
                    members.slice(1).forEach((f) => drop.add(f.id));
                }
                return counts.filter((f) => !drop.has(f.id)).sort((x, y) => (y.savings.unitsPerDay ?? 0) - (x.savings.unitsPerDay ?? 0)).slice(0, 4).map((f) => ({ title: f.title, unitsPerDay: f.savings.unitsPerDay ?? 0 }));
            })(),
            nextPrize: big ? { pillar: big.pillar, share: (big.units / tot) * 100, savedShare: big.units ? (big.saving / big.units) * 100 : 0, driver: big.pillar === 'metrics' ? (() => { const d = (a.labelInventory?.rows ?? []).filter((r) => r.kind === 'high-cardinality' || r.kind === 'churn').sort((x, y) => (y.fraction ?? y.series ?? 0) - (x.fraction ?? x.series ?? 0))[0]; return d ? { label: d.name, unique: d.unique, share: d.fraction !== undefined ? d.fraction * 100 : undefined } : undefined; })() : undefined } : undefined,
            baselineFrom: cd[0]?.date.slice(0, 10), baselineTo: cd.at(-1)?.date.slice(0, 10) };
    })();
    const report = {
        schemaVersion: REPORT_SCHEMA_VERSION, product: BRAND.name, audience, draft, unitUsd: cat.units.unitUsd, leadership,
        labels: a.labelInventory ? { source: a.labelInventory.source, date: a.labelInventory.date, rows: [...a.labelInventory.rows].sort((x, y) => (y.fraction ?? (y.series ?? 0) / 1e9) - (x.fraction ?? (x.series ?? 0) / 1e9) || y.unique - x.unique).slice(0, 15).map((l) => { const full = a.findings.find((f) => f.ruleId === `INV:label:${l.name}`); const shown = ranked.find((f) => f.ruleId === `INV:label:${l.name}`); const dv = full?.display?.impact?.find((i) => i.label === 'Distinct values')?.value; return { ...l, fix: full ? { text: dv ? `${dv} values` : full.title, findingId: shown?.id } : undefined }; }) } : null,
        checkNotes: a.notes ?? [],
        deploymentRows: (a.deployments ?? [a.deployment]).map((d) => { const v = a.versionsBy?.[d] ?? (d === a.deployment ? a.versions : {}); const c = a.configs?.[d]; return { deployment: d, label: DEPLOYMENT_LABEL[d], config: c && c.format !== 'empty' ? c.label : 'No config added', helmChart: v?.helmChart && { current: v.helmChart.current, latest: v.helmChart.latest }, collector: v?.collector && { current: v.collector.current, latest: v.collector.latest } }; }),
        upgrades: (opts.upgrades ?? []).filter((u) => u.changes.length).map((u) => ({ deployment: u.deployment, label: DEPLOYMENT_LABEL[u.deployment] ?? u.deployment, changes: u.changes, from: u.from, to: u.to, denylistRecheck: u.denylistRecheck })),
        platformSplit: a.platformSplit,
        analysis: (() => { const cd = completeDays(a.usage); return { windowHours: a.options.windowHours, dupWindowMinutes: a.options.dupWindowMinutes, range: a.options.range, usageDays: cd.length, usageFrom: cd[0]?.date.slice(0, 10), usageTo: cd.at(-1)?.date.slice(0, 10), partialDayExcluded: (a.usage?.days.length ?? 0) > 0 && (a.usage.days.at(-1).date.slice(0, 10) >= (a.usage.fetchedAt ?? new Date().toISOString()).slice(0, 10)) }; })(),
        header: { date: new Date().toISOString().slice(0, 10), customer: a.customer.name, environment: a.customer.environment, preparedBy: a.customer.preparedBy },
        intro: `This report gives the ${a.customer.name} engineering and leadership teams a clear, ranked view of where observability spend is driven, and a phased plan to send cleaner telemetry without losing visibility into what matters. Savings are shown in Coralogix units per day; freed quota can be reinvested in new services, signals and features.`,
        summary: { currentUnitsPerDay: baseline, identifiedUnitsPerDay: comb.total, identifiedPct: baseline ? (comb.total / baseline) * 100 : null, phase1: { count: fs.filter((f) => f.phase === 1).length, unitsPerDay: p1comb }, pendingScoping: fs.filter((f) => f.verifyStatus === 'needs-scoping' || f.savings.kind === 'needs-scoping').length },
        roadmap,
        versionStatus: v.helmChart || v.collector ? { helmChart: v.helmChart && { current: v.helmChart.current, latest: v.helmChart.latest }, collector: v.collector && { current: v.collector.current, latest: v.collector.latest }, checkedAt: opts.latestCheckedAt ?? v.collector?.checkedAt ?? v.helmChart?.checkedAt,
            breakingFound: up?.changes.length ?? 0, autoFixed: up?.changes.filter((c) => c.status === 'Auto-fixed').length ?? 0, manual: up?.changes.filter((c) => c.status === 'Manual action needed').length ?? 0,
            assumedLatest: v.helmChart?.source === 'assumed-latest' || v.collector?.source === 'assumed-latest' } : null,
        findings: ranked,
        overlaps: overlapGroups(counted.length ? fs : []).map((g) => ({ ids: g.ids, note: g.note })),
        combined: { largest: largest ? { id: largest.id, title: largest.title, unitsPerDay: largest.savings.unitsPerDay ?? 0 } : null, phase1: p1comb, realistic: comb.total, realisticPct: baseline ? (comb.total / baseline) * 100 : null,
            disclaimer: `This is the TAM's best-effort calculation and can vary by about ±${cat.units.estimateTolerancePct}%.` },
        trend,
        upgrade: up && up.changes.length ? { changes: up.changes, from: up.from, to: up.to, denylistRecheck: up.denylistRecheck,
            steps: ['Test the upgrade in a non-production cluster first.', 'Keep the current values file as the rollback (helm rollback to the previous revision).', 'Use upgraded-config.yaml for the upgrade; use optimized-config.yaml if you must stay on the current version for now.', 'Resolve every “Manual action needed” row before production.', 'Promote to production during a change window and watch collector logs and data usage for 24 hours.'] } : null,
        gaps: a.gaps,
        headroom: comb.total > 0 ? `About ${comb.total.toFixed(1)} units/day of headroom${baseline ? ` (${((comb.total / baseline) * 100).toFixed(0)}% of today's usage)` : ''} could be reinvested — for example in tracing for uninstrumented services, RUM, profiling or SLOs.` : 'Headroom is confirmed once the scoped findings are sized.',
        nextSteps, eligibility: a.eligibility,
    };
    if (audience === 'internal')
        report.internal = { connector: a.connectorId, startedAt: a.startedAt, finishedAt: a.finishedAt, skipped: a.skipped, rulesVersion: cat.version, configLabel: a.config.label, configNotes: a.config.notes, sources: Object.values(cat.sources) };
    return report;
}
export { pillarDailyGb };
/** Human wording for a window in hours: "24 hours", "7 days". */
export const windowText = (h) => { if (h % 24 === 0 && h >= 48)
    return `${h / 24} days`; if (Number.isInteger(h))
    return h === 1 ? '1 hour' : `${h} hours`; const m = Math.round(h * 60); return `${Math.floor(m / 60)} h ${m % 60} min`; };
const M3 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** "24 Oct 2026, 23:00 UTC" */
export const utcText = (iso) => { const d = new Date(iso); return `${d.getUTCDate()} ${M3[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC`; };
/** Short description of the data window: "the last 24 hours" or "24 Oct 2026, 23:00 UTC to 25 Oct 2026, 03:00 UTC (4 hours)". */
export const windowPhrase = (a) => (a.range ? `${utcText(a.range.start)} to ${utcText(a.range.end)} (${windowText(a.windowHours)})` : `the last ${windowText(a.windowHours)}`);
/** One sentence describing what data the numbers are based on. */
export function analysisSentence(r) {
    const a = r.analysis;
    const usage = a.usageDays ? ` and the average of the last ${a.usageDays} complete day${a.usageDays === 1 ? '' : 's'} of usage${a.usageFrom && a.usageTo ? ` (${a.usageFrom} to ${a.usageTo})` : ''}` : '';
    return a.range ? `Based on ${windowText(a.windowHours)} of data, from ${utcText(a.range.start)} to ${utcText(a.range.end)}; duplicate checks use the final ${a.dupWindowMinutes} minutes of that range, scaled to a day${usage}.`
        : `Based on the last ${windowText(a.windowHours)} of data (duplicate checks: last ${a.dupWindowMinutes} minutes, scaled to a day)${usage}.`;
}
//# sourceMappingURL=builder.js.map