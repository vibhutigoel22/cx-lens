import { describe, it, expect } from 'vitest';
import { shapeOf, groupShapes, classify, runAssessment, produceOutputs, buildReport, renderHtml, combinedSavings } from '../src/index.js';
import { demo, customer, fixture } from './helpers.js';

const GQL = ['query { fetchOrders(barcode: "*") { hash_id order_date order_status }', 'query { fetchOrders(barcode: "*") { hash_id } }', 'query getGiftClaim { dg_physical_card_claim(otp: "*") { code } }',
  '{ getOrderList(customer_email:"*" status:[complete]){ status { code } } }', 'mutation{ cancelClDigiRedeem(input:{tx_id: "*"}) { status } }', 'GET /api/orders/123456/items', 'GET /api/orders/987654/items'];

describe('value shapes and label kinds (Lens, deterministic)', () => {
  it('groups GraphQL text by operation and URLs by route', () => {
    expect(shapeOf(GQL[0])).toBe('query fetchOrders'); expect(shapeOf(GQL[2])).toBe('query getGiftClaim'); expect(shapeOf(GQL[3])).toBe('query getOrderList'); expect(shapeOf(GQL[4])).toBe('mutation cancelClDigiRedeem');
    expect(shapeOf(GQL[5])).toBe('GET /api/orders/{id}/items');
    const g = groupShapes(GQL); expect(g[0]).toMatchObject({ shape: 'query fetchOrders', count: 2 }); expect(g.find((s) => s.shape === 'GET /api/orders/{id}/items')!.count).toBe(2);
  });
  it('classifies high-cardinality, churn and constant labels', () => {
    expect(classify({ name: 'span_name', unique: 16295, metricCount: 10 })).toBe('high-cardinality');
    expect(classify({ name: 'process_pid', unique: 2600, metricCount: 300 })).toBe('churn');
    expect(classify({ name: 'cx_otel_integration_name', unique: 1, metricCount: 567, fraction: 0.037 })).toBe('constant');
    expect(classify({ name: 'status_code', unique: 3, metricCount: 16 })).toBe('normal');
  });
});

describe('label analysis with the Metric Usage API', () => {
  it('ranks labels by exact usage, tests Claude’s patterns on every real value, and saves from the label’s units', async () => {
    const c = demo(); const vals = Array.from({ length: 300 }, (_, i) => (i % 3 === 0 ? `query { fetchOrders(barcode: "${i}") { hash_id f${i} } }` : i % 3 === 1 ? `{ getOrderList(customer_email:"*" page:${i}){ status } }` : `query getGiftClaim { claim(otp: "${i}") { code } }`));
    (c as any).metricUsage = { labels: async () => ({ totalUnits: 137, totalBytes: 4e12, totalSeries: 200000, date: { year: 2026, month: 10, day: 25 }, rows: [
        { name: 'span_name', unique: 300, metricCount: 10, units: 13.39, fraction: 0.1428 }, { name: 'host_name', unique: 141, metricCount: 494, units: 5.98, fraction: 0.0638 }, { name: 'cx_otel_integration_name', unique: 1, metricCount: 567, units: 3.1, fraction: 0.037 }] }),
      metrics: async () => ({ totalUnits: 137, totalBytes: 0, totalSeries: 0, rows: [] }), metricsForLabel: async () => [{ name: 'calls_total', unique: 300, bytes: 0, units: 6.1, fraction: 0.4 }] };
    const pq0 = c.promql.bind(c); (c as any).promql = async (e: string) => (e.startsWith('count by (span_name) (count_over_time') ? vals.map((v) => ({ metric: { span_name: v }, value: [0, '1'] })) : pq0(e));
    const ask0 = c.askAI!; (c as any).askAI = async (p: string, s: string, o: any) => (p.includes('### label:') ? { text: '', json: { labels: [
      { label: 'span_name', title: 'Name GraphQL spans by operation', what_it_is: 'Span names hold the full GraphQL query text.', action: 'normalise', why_it_matters: 'Every query shape is a new series.', ottl_context: 'span',
        patterns: [{ regex: '^\\s*(query|mutation|subscription)\\s+([A-Za-z_][A-Za-z0-9_]*)\\s*[({][\\s\\S]*$', replacement: '$1 $2' }, { regex: '^\\s*(query|mutation|subscription)\\s*\\{\\s*([A-Za-z_][A-Za-z0-9_]*)[\\s\\S]*$', replacement: '$1 $2' }, { regex: '^\\s*\\{\\s*([A-Za-z_][A-Za-z0-9_]*)[\\s\\S]*$', replacement: 'query $1' }],
        ottl_statements: ['replace_pattern(name, "^\\\\s*\\\\{\\\\s*([A-Za-z_][A-Za-z0-9_]*)[\\\\s\\\\S]*$", "query $$1")'], next_step: 'Apply before spanmetrics.', verify_questions: [], confidence: 'high' },
      { label: 'host_name', title: 'Drop host name', what_it_is: 'x', action: 'drop', why_it_matters: 'y', next_step: 'n', verify_questions: [], confidence: 'low' }] } } : ask0(p, s, o));
    const a = await runAssessment({ connector: c, customer, pillars: ['metrics'], deployment: 'helm', options: { investigate: { enabled: true, maxContributors: 8, skills: { spanNames: false, buckets: false } } } });
    expect(a.labelInventory!.source).toBe('usage-api'); expect(a.labelInventory!.rows.find((r) => r.name === 'span_name')!.kind).toBe('high-cardinality');
    const f = a.findings.find((x) => x.ruleId === 'INV:label:span_name')!;
    expect(f.display!.validation!.result).toMatch(/300 distinct → 3 \(99\.0% fewer\)/); expect(f.savings.unitsPerDay!).toBeCloseTo(13.39 * 0.99, 2); expect(f.change!.snippet).toMatch(/trace_statements[\s\S]*context: span/);
    expect(f.display!.bars!.items[0].name).toMatch(/query (fetchOrders|getOrderList|getGiftClaim)/);
    expect(a.findings.find((x) => x.ruleId === 'INV:label:host_name')).toBeUndefined(); // protected: never offered to Claude
    const r = buildReport(a); expect(r.labels!.rows[0].name).toBe('span_name'); expect(renderHtml(r)).toContain('Top cardinality and usage labels');
  });
});

describe('several deployment types', async () => {
  const a = await runAssessment({ connector: demo(), customer, pillars: ['universal', 'logs', 'traces', 'metrics'], deployment: 'helm', deployments: ['helm', 'ecs', 'ec2'],
    configs: { helm: fixture('configs/helm-values-old.yaml'), ecs: fixture('configs/ecs-collector-0.98.yaml'), ec2: fixture('configs/ec2-collector.yaml') },
    versionsBy: { helm: { helmChart: { current: '0.0.300', latest: '0.0.362', source: 'user' }, collector: { current: '0.147.0', latest: '0.163.2', source: 'user' } }, ecs: { collector: { current: '0.98.0', latest: '0.163.2', source: 'user' } }, ec2: { collector: { current: '0.120.0', latest: '0.163.2', source: 'user' } } } });
  it('runs config checks per type and tags them', () => {
    const upgr = a.findings.filter((f) => f.ruleId.startsWith('UNI-UPGRADE')); expect(upgr.map((f) => f.ruleId).sort()).toEqual(['UNI-UPGRADE@ec2', 'UNI-UPGRADE@ecs', 'UNI-UPGRADE@helm']);
    expect(a.findings.find((f) => f.ruleId === 'UNI-PROTECTED-LABEL-REMOVED@ec2')!.title).toMatch(/^EC2: /);
  });
  it('one data finding, one decision, a config change per type; savings counted once', async () => {
    const red = a.findings.find((f) => f.ruleId === 'UNI-REDUCE-RESOURCE-ATTRS')!; expect(red.deployments).toEqual(['helm', 'ecs', 'ec2']);
    expect(red.changes!.helm!.ops[0].kind).toBe('helmPreset'); expect(red.changes!.ecs!.ops[0].kind).toBe('processor');
    expect(a.findings.filter((f) => f.ruleId === 'UNI-REDUCE-RESOURCE-ATTRS')).toHaveLength(1);
    const single = await runAssessment({ connector: demo(), customer, pillars: ['universal', 'logs', 'traces', 'metrics'], deployment: 'helm' });
    const t = (x: typeof a) => combinedSavings(x.findings.filter((f) => f.savings.kind === 'units'), null).total; expect(t(a)).toBeCloseTo(t(single), 6);
  });
  it('writes a folder per type with its own optimised and upgraded config', async () => {
    for (const f of a.findings) if (f.verifyStatus === 'candidate') f.verifyStatus = 'verified';
    const o = await produceOutputs(a, { offline: true });
    for (const d of ['kubernetes', 'ecs', 'ec2']) { expect(o.files[`${d}/optimized-config.yaml`]).toBeDefined(); expect(o.files[`${d}/upgraded-config.yaml`]).toBeDefined(); expect(o.files[`${d}/breaking-changes.md`]).toBeDefined(); }
    expect(o.files['kubernetes/optimized-config.yaml']).toMatch(/reduceResourceAttributes/); expect(o.files['ecs/optimized-config.yaml']).toMatch(/transform\/reduce/); expect(o.files['ecs/optimized-config.yaml']).not.toMatch(/reduceResourceAttributes/);
    const html = o.files[o.reportNames.internalHtml]; expect(html).toContain('Version status by deployment type'); expect(html).toMatch(/Applies to<\/span><b>Kubernetes, ECS, EC2/); expect(html).toContain('Collector config (ECS)');
  });
});
