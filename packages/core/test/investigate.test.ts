import { describe, it, expect } from 'vitest';
import { lintSuggestion, runAssessment, buildReport, renderHtml, renderMarkdown, combinedSavings } from '../src/index.js';
import { demo, customer } from './helpers.js';

const base = { key: 'log:x', title: 't', what_it_is: 'w', value: 'low' as const, why_it_matters: 'y', next_step: 'n', verify_questions: [], confidence: 'high' as const };
describe('Lens checks on what Claude proposes', () => {
  it('accepts a clean transform', () => expect(lintSuggestion({ ...base, action: 'replace', dataprime_filter: "$d.body:string.contains('x')", ottl_statements: ['replace_pattern(body, "a+", "")'], regex: 'a+' }, 'logs')).toEqual([]));
  it('rejects functions outside the allowed OTTL list', () => expect(lintSuggestion({ ...base, action: 'replace', dataprime_filter: "$d.body:string.contains('x')", ottl_statements: ['ExecShell(body)'] }, 'logs').join()).toMatch(/not on the allowed list/));
  it('rejects removing a protected label', () => expect(lintSuggestion({ ...base, action: 'delete_attribute', dataprime_filter: "$l.subsystemname == 'a'", ottl_statements: ['delete_key(resource.attributes, "host.name")'], attribute: 'host.name' }, 'logs').join()).toMatch(/protected/));
  it('rejects unbalanced quotes, bad regex and pipes in the DataPrime filter', () => {
    const p = lintSuggestion({ ...base, action: 'replace', dataprime_filter: "x | limit 1", ottl_statements: ['replace_pattern(body, "a(, "")'], regex: 'a(' }, 'logs').join(' ');
    expect(p).toMatch(/Unbalanced/); expect(p).toMatch(/does not compile/); expect(p).toMatch(/pipe/);
  });
});

describe('Investigate mode on recorded live data', async () => {
  const a = await runAssessment({ connector: demo(), customer, pillars: ['universal', 'logs', 'traces', 'metrics'], deployment: 'helm', options: { investigate: { enabled: true, maxContributors: 8 } } });
  const inv = a.findings.filter((f) => f.source === 'investigate' && f.pillar !== 'metrics'); // logs and spans (metrics have their own tests)
  it('produces validated, data-driven findings', () => { expect(inv.length).toBeGreaterThanOrEqual(3); expect(inv.every((f) => f.display?.validation && f.display.samples?.items.length)).toBe(true); });
  it('shows a real before/after for transforms, simulated on the live samples', () => {
    const r = inv.find((f) => /trace IDs/i.test(f.title))!; const s = r.display!.samples!.items[0];
    expect(s.before).toMatch(/trace_id=/); expect(s.after).not.toMatch(/trace_id=/); expect(r.change!.snippet).toMatch(/replace_pattern\(body/);
  });
  it('for drops, shows only records the filter actually selects', () => {
    const d = inv.find((f) => /redirect/i.test(f.title))!;
    expect(d.display!.samples!.label).toMatch(/records this change affects/); for (const s of d.display!.samples!.items) { expect(s.before).toMatch(/" 308 /); expect(s.after).toMatch(/dropped/); }
  });
  it('claims savings only when validated, computed from measured volume and official rates', () => {
    for (const f of inv) { if (f.savings.kind === 'units') { expect(f.display!.validation!.ok).toBe(true); expect(f.savings.basis).toMatch(/units\/GB/); expect(f.display!.impact!.at(-1)!.label).toBe('Estimated saving'); } else expect(f.verifyStatus).toBe('needs-scoping'); }
  });
  it('never counts overlapping playbook log rules twice', () => {
    const hygiene = a.findings.filter((f) => ['LOG-LOW-VALUE', 'LOG-MULTILINE', 'LOG-DEDUP'].includes(f.ruleId) && f.savings.kind === 'units');
    for (const h of hygiene) expect(h.countedInTotal).toBe(false);
    const total = combinedSavings(a.findings.filter((f) => f.savings.kind === 'units'), null).total;
    const naive = a.findings.reduce((x, f) => x + (f.savings.unitsPerDay ?? 0), 0); expect(total).toBeLessThanOrEqual(naive);
  });
  it('reports include live samples, the transform and the savings maths', () => {
    const html = renderHtml(buildReport(a)); const md = renderMarkdown(buildReport(a));
    for (const s of ['Found in live data', 'Validated against live data', 'Proposed transform (collector config)', 'class="pair"', 'Estimated saving']) expect(html).toContain(s);
    expect(md).toMatch(/Live samples .*before → after/); expect(md).toContain('Validated against live data');
  });
});
