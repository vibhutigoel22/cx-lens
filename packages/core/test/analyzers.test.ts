import { describe, it, expect } from 'vitest';
import { runAssessment, produceOutputs, checkCustomerSafe, maskText, buildReport, renderMarkdown, allPlugins } from '../src/index.js';
import { demo, customer, fixture, empty } from './helpers.js';

describe('demo assessment (recorded live data)', async () => {
  const a = await runAssessment({ connector: demo(), customer, pillars: ['universal', 'logs', 'traces', 'metrics'], deployment: 'helm', configText: fixture('configs/helm-values-old.yaml'), versions: { helmChart: { current: '0.0.300', latest: '0.0.362', source: 'user' }, collector: { current: '0.147.0', latest: '0.163.2', source: 'user' } } });
  const by = (r: string) => a.findings.find((f) => f.ruleId === r);
  it('every plugin is registered and carries sources', () => { for (const p of allPlugins()) { expect(p.sources.length).toBeGreaterThan(0); expect(p.sources.every((s) => s.url)).toBe(true); } });
  it('finds the protected label removal with high priority', () => { expect(by('UNI-PROTECTED-LABEL-REMOVED')?.priority).toBe('high'); });
  it('multiline fragments from real data', () => expect(by('LOG-MULTILINE')?.savings.unitsPerDay).toBeGreaterThan(0));
  it('tail sampling is Phase 2 and the largest finding', () => { const s = by('SPAN-SAMPLING')!; expect(s.phase).toBe(2); expect(Math.max(...a.findings.map((f) => f.savings.unitsPerDay ?? 0))).toBe(s.savings.unitsPerDay); });
  it('ids are pillar-prefixed', () => { for (const f of a.findings) expect(f.id).toMatch(/^(UNI|LOG|SPAN|METRIC)-(\d+|UPGRADE)$/); });
  it('every finding has a verify checklist, sources, next step', () => { for (const f of a.findings) { expect(f.sources.length).toBeGreaterThan(0); expect(f.nextStep.length).toBeGreaterThan(5); } });
  it('customer report contains no internal links or ids', async () => {
    for (const f of a.findings) if (f.verifyStatus === 'candidate') f.verifyStatus = 'verified';
    const o = await produceOutputs(a, { offline: true });
    const rn = o.reportNames;
    expect(rn.customerHtml).toBe('Acme.html'); expect(rn.internalHtml).toBe('Acme (internal).html');
    expect(checkCustomerSafe(o.files[rn.customerMd])).toEqual([]);
    expect(o.files[rn.customerMd]).not.toMatch(/notion|slack|🔶/i);
    expect(o.files[rn.internalMd]).toMatch(/notion\.com/);
    expect(JSON.parse(o.files[rn.customerJson]).schemaVersion).toBe('1.0.0');
    for (const n of ['report.customer.html', 'report.internal.html', 'report.json']) expect(o.files[n]).toBeUndefined();
  });
  it('only Verified findings reach the customer report', () => { const f0 = a.findings[0]; const prev = f0.verifyStatus; f0.verifyStatus = 'rejected'; const r = buildReport(a, { audience: 'customer' }); expect(r.findings.some((x) => x.ruleId === f0.ruleId)).toBe(false); f0.verifyStatus = prev; });
  it('report has every template section', () => { const md = renderMarkdown(buildReport(a)); for (const h of ['What is this report?', 'Top-line summary', 'Phased roadmap', 'Version status', 'Ranked optimization opportunities', 'Combined potential', 'Usage trend', 'Detailed findings', 'Next steps']) expect(md).toContain(h); expect(md).toMatch(/±20%/); });
});
describe('without data or config', () => {
  it('still runs and skips cleanly', async () => { const a = await runAssessment({ connector: empty(), customer, pillars: ['universal', 'logs'], deployment: 'helm' }); expect(a.findings.every((f) => f.sources.length)).toBe(true); });
  it('eligibility warnings are gentle, not blocking', async () => { const a = await runAssessment({ connector: empty(), customer: { ...customer, nearRenewal: true, teamCanVerify: false }, pillars: ['universal'], deployment: 'helm' }); expect(a.eligibility).toHaveLength(2); });
});
describe('masking', () => {
  it('masks emails, IPs, tokens, keys, cards', () => {
    const { masked, counts } = maskText('mail a.b@x.io from 10.1.2.3 Bearer abc.def key cxup_ABCDEFGHIJKLMNOPQRST card 4111 1111 1111 1111 acct 123456789012 "password": "hunter2"');
    for (const s of ['a.b@x.io', '10.1.2.3', 'abc.def', 'cxup_ABC', '4111', '123456789012', 'hunter2']) expect(masked).not.toContain(s);
    expect(Object.keys(counts).length).toBeGreaterThanOrEqual(6);
  });
});
describe('report.json contract', () => {
  it('conforms to the published JSON Schema (required keys, ids, enums)', async () => {
    const { readFileSync } = await import('node:fs'); const schema = JSON.parse(readFileSync(new URL('../schema/report.schema.json', import.meta.url), 'utf8'));
    const { runAssessment, buildReport } = await import('../src/index.js'); const { demo, customer } = await import('./helpers.js');
    const a = await runAssessment({ connector: demo(), customer, pillars: ['universal', 'logs', 'traces', 'metrics'], deployment: 'helm' });
    const r: any = JSON.parse(JSON.stringify(buildReport(a)));
    for (const k of schema.required) expect(r).toHaveProperty(k);
    const re = new RegExp(schema.$defs.finding.properties.id.pattern);
    for (const f of r.findings) { for (const k of schema.$defs.finding.required) expect(f).toHaveProperty(k); expect(f.id).toMatch(re); expect(schema.$defs.finding.properties.savings.properties.kind.enum).toContain(f.savings.kind); }
  });
});
describe('HTML reports use the approved design', () => {
  it('customer and internal HTML share the template; internal-only parts stay internal', async () => {
    const { runAssessment, buildReport, renderHtml, scrubReport, checkCustomerSafe } = await import('../src/index.js');
    const { demo, customer, fixture } = await import('./helpers.js');
    const a = await runAssessment({ connector: demo(), customer, pillars: ['universal', 'logs', 'traces', 'metrics'], deployment: 'helm', configText: fixture('configs/helm-values-old.yaml') });
    for (const f of a.findings) f.verifyStatus = 'verified';
    const cust = renderHtml(scrubReport(buildReport(a, { audience: 'customer' })));
    const int = renderHtml(buildReport(a, { audience: 'internal' }));
    for (const html of [cust, int]) {
      for (const id of ['summary', 'roadmap', 'opportunities', 'trend', 'findings', 'next']) expect(html).toContain(`<section id="${id}">`);
      for (const cls of ['class="top"', 'class="slide"', 'id="technical"', 'class="road"', 'class="tbl"', 'class="combo"', 'class="chart"', 'class="finding ph1"', 'class="timeline"', 'aria-label="Coralogix"']) expect(html).toContain(cls);
      expect(html).not.toContain('How savings are measured');
    }
    expect(cust).not.toContain('id="internal"'); expect(cust).not.toContain('Internal: not for customer'); expect(cust).not.toMatch(/notion\.com/);
    expect(checkCustomerSafe(cust)).toEqual([]);
    expect(int).toContain('id="internal"'); expect(int).toContain('Internal: not for customer distribution'); expect(int).toMatch(/Verify status/);
    // finding display content
    expect(int).toContain('Policy order'); expect(int).toContain('Services in scope');
  });
});
