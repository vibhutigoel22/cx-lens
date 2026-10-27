import { describe, it, expect } from 'vitest';
import { runAssessment, buildReport, renderHtml } from '../src/index.js';
import { demo, customer } from './helpers.js';

const GQL = Array.from({ length: 600 }, (_, i) => [`query { fetchOrders(barcode: "${i}") { hash_id f${i} } }`, `{ getOrderList(customer_email:"*" page:${i}){ status } }`, `query getGiftClaim { claim(otp: "${i}") { code } }`, `mutation{ cancelClDigiRedeem(input:{tx_id: "${i}"}) { status s${i} } }`][i % 4]);
const URLS = Array.from({ length: 400 }, (_, i) => (i % 2 ? `/api/orders/${100000 + i}/items?page=${i}` : `/api/users/${(i * 7919).toString(16).padStart(8, '0')}-1111-2222-3333-444455556666`));
function connector(claude?: (p: string) => any) {
  const c = demo();
  (c as any).metricUsage = { labels: async () => ({ totalUnits: 127, totalBytes: 0, totalSeries: 0, date: { year: 2026, month: 10, day: 25 }, rows: [{ name: 'span_name', unique: 600, metricCount: 8, units: 18.53, fraction: 0.1459 }, { name: 'http_url', unique: 400, metricCount: 4, units: 2.9, fraction: 0.0228 }] }),
    metrics: async () => ({ totalUnits: 127, totalBytes: 0, totalSeries: 0, rows: [] }), metricsForLabel: async () => [] };
  const pq0 = c.promql.bind(c);
  (c as any).promql = async (e: string) => (e.startsWith('count by (span_name) (count_over_time') ? GQL.map((v) => ({ metric: { span_name: v }, value: [0, '1'] })) : e.startsWith('count by (http_url) (count_over_time') ? URLS.map((v) => ({ metric: { http_url: v }, value: [0, '1'] })) : pq0(e));
  if (claude) { const a0 = c.askAI!; (c as any).askAI = async (p: string, s: string, o: any) => (p.includes('### label:') ? claude(p) : a0(p, s, o)); } else delete (c as any).askAI;
  return c;
}
describe('tested transforms for high-cardinality labels', () => {
  it('without Claude: Lens writes and tests the GraphQL and URL transforms itself', async () => {
    const a = await runAssessment({ connector: connector(), customer, pillars: ['metrics'], deployment: 'helm' });
    const s = a.findings.find((f) => f.ruleId === 'INV:label:span_name')!; const u = a.findings.find((f) => f.ruleId === 'INV:label:http_url')!;
    expect(s.display!.validation!.result).toMatch(/600 distinct → 4 \(99\.3% fewer\)/); expect(s.change!.snippet).toMatch(/trace_statements[\s\S]*context: span[\s\S]*replace_pattern\(name,/); expect(s.caveats.join()).toMatch(/Patterns: Lens \(built-in/);
    expect(s.savings.unitsPerDay!).toBeCloseTo(18.53 * (1 - 4 / 600), 2);
    expect(u.display!.validation!.result).toMatch(/400 distinct → 2 /); expect(u.change!.snippet).toMatch(/replace_pattern\(attributes\["http\.url"\]/);
  });
  it('with Claude: keeps Claude’s patterns when they are at least as good, otherwise uses Lens’s', async () => {
    const weak = () => ({ text: '', json: { labels: [{ label: 'span_name', title: 'Weak', what_it_is: 'x', action: 'normalise', why_it_matters: 'y', patterns: [{ regex: 'nothing-matches', replacement: '' }], ottl_statements: ['replace_pattern(name, "nothing-matches", "")'], ottl_context: 'span', next_step: 'n', verify_questions: [], confidence: 'low' }] } });
    const a = await runAssessment({ connector: connector(weak), customer, pillars: ['metrics'], deployment: 'helm', options: { investigate: { enabled: true, maxContributors: 8, skills: { spanNames: false, buckets: false } } } });
    const s = a.findings.find((f) => f.ruleId === 'INV:label:span_name')!; expect(s.caveats.join()).toMatch(/Lens \(fewer values than Claude/); expect(s.display!.validation!.ok).toBe(true);
  });
  it('labels table shows the tested fix, and “pending verification” in the customer report when not verified', async () => {
    const a = await runAssessment({ connector: connector(), customer, pillars: ['metrics'], deployment: 'helm' });
    const cust = renderHtml(buildReport(a, { audience: 'customer' })); expect(cust).toMatch(/600 → 4 values <span class="muted">\(pending verification\)/);
    for (const f of a.findings) if (f.verifyStatus === 'candidate') f.verifyStatus = 'verified';
    const ver = renderHtml(buildReport(a, { audience: 'customer' })); expect(ver).toMatch(/<a href="#metric-\d+">600 → 4 values<\/a>/);
  });
});
