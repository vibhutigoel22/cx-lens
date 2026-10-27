import { describe, it, expect } from 'vitest';
import { runAssessment, buildReport, renderHtml, renderMarkdown } from '../src/index.js';
import { demo, customer } from './helpers.js';

describe('leadership slide', async () => {
  const a = await runAssessment({ connector: demo(), customer: { ...customer, name: 'PayU APM', audience: 'the CTO and co-founders' }, pillars: ['universal', 'logs', 'traces', 'metrics'], deployment: 'helm', options: { investigate: { enabled: true, maxContributors: 8 } } });
  for (const f of a.findings) if (f.verifyStatus === 'candidate') f.verifyStatus = 'verified';
  const r = buildReport(a); const L = r.leadership; const html = renderHtml(r);
  it('uses the same overlap-safe total as the rest of the report', () => {
    expect(L.saving).toBeCloseTo(r.combined.realistic, 6); expect(L.perMonth).toBeCloseTo(L.saving * 30, 6); expect(L.perYear).toBeCloseTo(L.saving * 365, 6);
    expect(L.after!).toBeCloseTo(L.baseline! - L.saving, 6); expect(L.baseline).toBe(r.summary.currentUnitsPerDay);
  });
  it('splits savings by data type and lists the largest changes', () => {
    expect(L.pillars.map((p) => p.pillar)).toEqual([...L.pillars].sort((x, y) => y.units - x.units).map((p) => p.pillar));
    for (const p of L.pillars) expect(p.saving).toBeLessThanOrEqual(p.units + 1e-9);
    expect(L.top.length).toBeGreaterThan(0); expect(L.top[0].unitsPerDay).toBeGreaterThanOrEqual(L.top.at(-1)!.unitsPerDay);
    expect(L.top.reduce((x, y) => x + y.unitsPerDay, 0)).toBeLessThanOrEqual(L.saving + 1e-9); // the list never adds up to more than the headline
  });
  it('renders first, presentable full screen, followed by the technical part', () => {
    expect(html.indexOf('id="exec-slide"')).toBeLessThan(html.indexOf('id="technical"'));
    expect(html).toContain('One slide for the CTO and co-founders'); expect(html).toContain('id="present-btn"'); expect(html).toContain('requestFullscreen');
    expect(html).not.toContain('class="hero"'); expect(html).toContain('Savings are confirmed only after PayU APM verifies each change');
    expect(renderMarkdown(r)).toMatch(/## Leadership summary[\s\S]*# Technical details/);
  });
  it('flags a large data type with little saving as the next prize, and marks drafts on the slide', () => {
    if (L.nextPrize) { expect(L.nextPrize.share).toBeGreaterThanOrEqual(40); expect(L.nextPrize.savedShare).toBeLessThan(5); expect(html).toContain('Next prize:'); } else expect(html).not.toContain('Next prize:');
    const d = buildReport(a, { audience: 'customer', draft: true }); expect(renderHtml(d)).toContain('Draft, not yet verified');
  });
});
