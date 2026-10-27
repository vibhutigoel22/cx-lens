import { describe, it, expect } from 'vitest';
import { scrubReport, runAssessment, produceOutputs } from '../src/index.js';
import { demo, customer } from './helpers.js';

describe('customer-report scrubbing', () => {
  it('never touches numbers (a value with 12 decimals used to become "552.<account>" and break the export)', () => {
    const r: any = scrubReport({ summary: { currentUnitsPerDay: 552.585841234567, identifiedPct: 3.123456789012 } } as any, []);
    expect(r.summary.currentUnitsPerDay).toBe(552.585841234567); expect(r.summary.identifiedPct).toBe(3.123456789012);
  });
  it('never rewrites field names, even when an internal term matches one', () => {
    const r: any = scrubReport({ summary: { title: 'summary of findings' } } as any, ['summary', 'title']);
    expect(Object.keys(r)).toEqual(['summary']); expect(Object.keys(r.summary)).toEqual(['title']); expect(r.summary.title).toBe('<internal> of findings');
  });
  it('still removes account IDs, keys, links and internal names from text', () => {
    const r: any = scrubReport({ a: 'acct 123456789012', b: 'key cxup_ABCDEFGHIJKLMNOPQRST', c: 'see https://app.notion.com/p/x', d: 'ask Samarth', e: ['nested 123456789012'] } as any, ['Samarth']);
    expect(r.a).toBe('acct <account>'); expect(r.b).not.toMatch(/cxup_/); expect(r.c).not.toMatch(/notion/); expect(r.d).toBe('ask <internal>'); expect(r.e[0]).toBe('nested <account>');
  });
  it('exports succeed when savings have long decimals (end to end)', async () => {
    const a = await runAssessment({ connector: demo(), customer, pillars: ['universal', 'logs', 'traces'], deployment: 'helm' });
    for (const f of a.findings) { if (f.savings.unitsPerDay) f.savings.unitsPerDay = 1.585841234567; if (f.verifyStatus === 'candidate') f.verifyStatus = 'verified'; }
    const o = await produceOutputs(a, { offline: true }); expect(JSON.parse(o.files[o.reportNames.customerJson]).summary).toBeDefined();
    const d = await produceOutputs(a, { offline: true, allowDraft: true }); expect(d.files[d.reportNames.customerHtml]).toContain('Draft, not yet verified');
  });
});
