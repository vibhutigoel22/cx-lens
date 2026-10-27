import { describe, it, expect } from 'vitest';
import { completeDays, baselineUnitsPerDay, runAssessment, buildReport, renderHtml, renderMarkdown } from '../src/index.js';
import { demo, customer } from './helpers.js';

const day = (date: string, units: number) => ({ date: `${date}T00:00:00Z`, byPillarTier: { 'logs:high': { gb: units, units } }, totalUnits: units, totalGb: units });
describe('usage baseline uses complete days only', () => {
  const usage = { fetchedAt: '2026-10-23T05:00:00Z', days: ['10-15', '10-16', '10-17', '10-18', '10-19', '10-20', '10-21', '10-22'].map((d) => day(`2026-${d}`, 580)).concat([day('2026-10-23', 120)]) };
  it('leaves out the day the usage was read on', () => {
    const cd = completeDays(usage); expect(cd).toHaveLength(7); expect(cd.at(-1)!.date).toBe('2026-10-22T00:00:00Z');
    expect(baselineUnitsPerDay(usage)).toBe(580); // was (6×580 + 120)/7 ≈ 514 before the fix
  });
  it('keeps all days when none is partial', () => { expect(completeDays({ fetchedAt: '2026-10-24T01:00:00Z', days: usage.days })).toHaveLength(7); });
  it('demo baseline no longer includes the partial day', async () => {
    const a = await runAssessment({ connector: demo(), customer, pillars: ['universal'], deployment: 'helm' });
    const r = buildReport(a); expect(r.analysis.partialDayExcluded).toBe(true); expect(r.summary.currentUnitsPerDay!).toBeGreaterThan(6.5);
  });
});
describe('analysis windows', () => {
  it('flow into every query, are clamped to safe ranges, and are stated in the reports', async () => {
    const a = await runAssessment({ connector: demo(), customer, pillars: ['universal', 'logs', 'traces', 'metrics'], deployment: 'helm', options: { windowHours: 72, dupWindowMinutes: 30, rowLimit: 500 } });
    const ev = a.findings.flatMap((f) => f.evidence).filter((e) => e.language === 'dataprime');
    const wins = new Set(ev.map((e) => e.window));
    expect(wins.has('72h')).toBe(true); expect(wins.has('24h')).toBe(false); // samples stay 1h; dup checks use 30m
    expect(a.findings.find((f) => f.ruleId === 'METRIC-LABEL-ANALYZER' || f.ruleId === 'METRIC-HIGH-CHURN')?.evidence[0]?.window).toBe('4320m');
    const r = buildReport(a); expect(r.analysis).toMatchObject({ windowHours: 72, dupWindowMinutes: 30, usageDays: 7 });
    expect(renderHtml(r)).not.toContain('class="unit-card"');
    expect(renderMarkdown(r)).toContain('last 3 days');
    const c = await runAssessment({ connector: demo(), customer, pillars: ['universal'], deployment: 'helm', options: { windowHours: 999, dupWindowMinutes: 0, rowLimit: 5 } });
    expect(c.options).toMatchObject({ windowHours: 168, dupWindowMinutes: 1, rowLimit: 10 });
  });
});
describe('custom date and time range', () => {
  const end = new Date(Math.floor(Date.now() / 3600e3) * 3600e3 - 48 * 3600e3).toISOString();
  const start = new Date(Date.parse(end) - 4 * 3600e3).toISOString();
  it('sends the exact range to volume checks and the final minutes to duplicate checks and samples', async () => {
    const calls: any[] = []; const c = demo(); const orig = c.runQuery.bind(c); c.runQuery = async (q: any) => { calls.push(q); return orig(q); };
    const lv: any[] = []; const ol = c.getLabelValues.bind(c); (c as any).getLabelValues = async (...a: any[]) => { lv.push(a); return ol(a[0]); };
    const a = await runAssessment({ connector: c, customer, pillars: ['universal', 'logs', 'traces', 'metrics'], deployment: 'helm', options: { range: { start, end }, dupWindowMinutes: 30 } });
    expect(a.options.windowHours).toBe(4);
    const vol = calls.find((q) => q.id === 'LOG-BASELINE/log-count'); expect(vol).toMatchObject({ start, end, window: '240m' });
    const dup = calls.find((q) => q.id === 'LOG-DEDUP/dup-logid-total'); expect(dup.end).toBe(end); expect(Date.parse(dup.end) - Date.parse(dup.start)).toBe(30 * 60e3);
    const smp = calls.find((q) => q.id === 'LOG-BASELINE/sample'); expect(Date.parse(smp.end) - Date.parse(smp.start)).toBe(3600e3);
    expect(lv[0]).toEqual(['service_name', '240m', 'calls_total', end]);
    const r = buildReport(a); expect(r.analysis.range).toEqual({ start, end });
    expect(renderHtml(r)).not.toContain('How savings are measured'); expect(renderMarkdown(r)).toMatch(/Based on 4 hours of data, from .* UTC; duplicate checks use the final 30 minutes/);
  });
  it('rejects ranges that are in the future, too short, too long or invalid', async () => {
    const run = (s: string, e: string) => runAssessment({ connector: demo(), customer, pillars: ['universal'], deployment: 'helm', options: { range: { start: s, end: e } } });
    const now = Date.now(); const iso = (ms: number) => new Date(ms).toISOString();
    await expect(run(iso(now - 3600e3), iso(now + 3 * 3600e3))).rejects.toThrow(/future/);
    await expect(run(iso(now - 30 * 60e3), iso(now - 60e3))).rejects.toThrow(/at least 1 hour/);
    await expect(run(iso(now - 9 * 864e5), iso(now - 60e3))).rejects.toThrow(/at most 7 days/);
    await expect(run('yesterday', iso(now))).rejects.toThrow(/valid start and end/);
  });
});
describe('reports show the exact range next to each query', () => {
  it('labels range queries with their dates instead of "last Nm"', async () => {
    const end = new Date(Math.floor(Date.now() / 3600e3) * 3600e3 - 24 * 3600e3).toISOString(); const start = new Date(Date.parse(end) - 6 * 3600e3).toISOString();
    const a = await runAssessment({ connector: demo(), customer, pillars: ['universal', 'logs', 'traces'], deployment: 'helm', options: { range: { start, end } } });
    const html = renderHtml(buildReport(a)); const md = renderMarkdown(buildReport(a));
    expect(html).toMatch(/DataPrime query, run over \d+ \w{3} \d{4}, \d\d:\d\d UTC to/); expect(html).not.toMatch(/last \d+m \|/);
    expect(md).toMatch(/_Run over .* UTC to .* UTC_/); expect(md).not.toMatch(/last \d+m \|/);
  });
});
