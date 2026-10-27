import { describe, it, expect } from 'vitest';
import { parseDocument } from 'yaml';
import { isProtectedLabel, parseConfig, writeConfig, unifiedDiff, upgradeConfig, parseChangelogBreaking, runAssessment } from '../src/index.js';
import { fixture, f, empty, customer, demo } from './helpers.js';

describe('format detection', () => {
  it('helm values with chart version', () => { const p = parseConfig(fixture('configs/helm-values-old.yaml')); expect(p.format).toBe('helm-values'); expect(p.chartVersion).toBe('0.0.300'); expect(p.label).toMatch(/Coralogix Helm values, chart version 0.0.300/); });
  it('collector config with version from image tag', () => { const p = parseConfig(fixture('configs/ecs-collector-0.98.yaml')); expect(p.format).toBe('collector'); expect(p.collectorVersion).toBe('0.98.0'); expect(p.distribution).toBe('otelcol-contrib'); });
  it('fluent bit is "other" but still reported', () => { const p = parseConfig('[SERVICE]\n  Flush 1\n[INPUT]\n  Name tail\n'); expect(p.format).toBe('other'); expect(p.notes[0]).toMatch(/Fluent Bit/); });
});

async function goldenRun(cfg: string, deployment: any) {
  const a = await runAssessment({ connector: demo(), customer, pillars: ['universal', 'logs', 'traces', 'metrics'], deployment, configText: cfg, versions: { collector: { current: deployment === 'helm' ? '0.147.0' : '0.98.0', latest: '0.163.2', source: 'user' } } });
  for (const x of a.findings) x.verifyStatus = 'verified';
  return { a, w: writeConfig(a.config, a.findings, { deployment: deployment === 'helm' ? 'helm' : 'collector' }) };
}
describe('golden: config writer', () => {
  it('Helm: protected-safe denylist on all three collectors via anchor, comments kept, original structure kept', async () => {
    const { w } = await goldenRun(fixture('configs/helm-values-old.yaml'), 'helm');
    const js: any = parseDocument(w.text, { merge: true }).toJS({ maxAliasCount: -1 });
    for (const c of ['opentelemetry-agent', 'opentelemetry-cluster-collector', 'opentelemetry-gateway']) { const p = js[c].presets.reduceResourceAttributes; expect(p.enabled).toBe(true); expect(p.denylist.logs).toContain('container.id'); expect(p.denylist.logs).not.toContain('cloud.region'); expect(p.denylist.traces).not.toContain('telemetry.sdk.name'); }
    expect(w.text).toMatch(/&cx_reduce_resource_attributes/); expect(w.text).toMatch(/\*cx_reduce_resource_attributes/);
    expect(w.text).toMatch(/# Custom denylist copied from an old ticket/); // user comments preserved
    expect(w.text).toMatch(/Coralogix Lens UNI-\d+/); // every added block is tagged
    expect(js['opentelemetry-agent'].config.exporters['otlp/coralogix'].compression).toBe('none'); // user value never silently overwritten
  });
  it('ECS: processors added in order memory_limiter → … → batch, filelog multiline only with evidence', async () => {
    const { w } = await goldenRun(fixture('configs/ecs-collector-0.98.yaml'), 'ecs');
    const js: any = parseDocument(w.text).toJS();
    for (const p of ['traces', 'metrics', 'logs']) { const ps: string[] = js.service.pipelines[p].processors; expect(ps[0]).toBe('memory_limiter'); expect(ps.at(-1)).toBe('batch'); }
    const keys = [...js.processors['transform/reduce'].log_statements[0].statements.join().matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    expect(keys).toContain('container.id'); expect(keys.filter(isProtectedLabel)).toEqual([]);
  });
  it('only Verified findings are applied unless Draft is allowed (with watermark)', () => {
    const p = parseConfig(fixture('configs/ecs-collector-0.98.yaml'));
    const cand = f({ ruleId: 'G', verifyStatus: 'candidate', change: { summary: 's', snippet: '', ops: [{ kind: 'processor', name: 'groupbyattrs', body: { keys: [] }, signals: ['logs'], position: 'before-batch' }] } });
    expect(writeConfig(p, [cand]).text).not.toMatch(/groupbyattrs/);
    const d = writeConfig(p, [cand], { allowDraft: true }); expect(d.draft).toBe(true); expect(d.text).toMatch(/DRAFT/); expect(d.text).toMatch(/groupbyattrs/);
  });
  it('diff shows additions', () => expect(unifiedDiff('a\nb\n', 'a\nx\nb\n')).toMatch(/^\+x$/m));
});

describe('upgrade', () => {
  const contrib = `# Changelog\n\n## v0.161.0\n\n### 🛑 Breaking changes 🛑\n\n- \`pkg/ottl\`: Remove the deprecated \`Base64Decode\` converter. Use the \`Decode\` converter with the \`base64\` encoding instead. (#50875)\n- \`processor/tail_sampling\`: Something about tail sampling config. (#1)\n\n## v0.100.0\n\n### 🛑 Breaking changes 🛑\n\n- \`processor/filter\`: old item (#2)\n`;
  it('parses changelog breaking sections', () => { const b = parseChangelogBreaking(contrib, 'contrib'); expect(b.map((x) => x.version)).toEqual(['0.161.0', '0.161.0', '0.100.0']); });
  it('older collector config → auto-fixes + manual list (only components in use)', () => {
    const u = upgradeConfig(parseConfig(fixture('configs/ecs-collector-0.98.yaml')), { fromCollector: '0.98.0', toCollector: '0.163.2', contribMd: contrib });
    const js: any = parseDocument(u.text).toJS();
    expect(js.processors['filter/health'].trace_conditions[0]).toBe('span.attributes["http.target"] == "/health"');
    expect(js.processors['filter/health'].traces).toBeUndefined();
    expect(js.connectors.spanmetrics.aggregation_cardinality_limit).toBe(1000);
    expect(u.text).toMatch(/Changed for v0\.163\.2/);
    expect(u.changes.some((c) => c.component === 'processor/tail_sampling')).toBe(false); // not used → not listed
    expect(u.changes.filter((c) => c.status === 'Auto-fixed').map((c) => c.component)).toEqual(expect.arrayContaining(['filter', 'spanmetrics', 'filter/transform']));
  });
  it('Helm config: Base64Decode rewritten', () => {
    const u = upgradeConfig(parseConfig(fixture('configs/helm-values-old.yaml')), { fromCollector: '0.147.0', toCollector: '0.163.2', contribMd: contrib });
    expect(u.text).toMatch(/Decode\(attributes\["payload_b64"\], "base64"\)/); expect(u.changes.find((c) => c.component === 'ottl')?.status).toBe('Auto-fixed');
  });
});
describe('golden: EC2', () => {
  it('detects EC2, fixes order, removes the protected delete_key, writes protected-safe reduce', async () => {
    const cfg = fixture('configs/ec2-collector.yaml'); const p = parseConfig(cfg);
    expect(p.deploymentGuess).toBe('ec2'); expect(p.collectorVersion).toBe('0.120.0');
    const a = await runAssessment({ connector: demo(), customer, pillars: ['universal', 'logs', 'traces', 'metrics'], deployment: 'ec2', configText: cfg, versions: { collector: { current: '0.120.0', latest: '0.163.2', source: 'user' } } });
    expect(a.findings.find((f) => f.ruleId === 'UNI-PROTECTED-LABEL-REMOVED')?.priority).toBe('high');
    for (const x of a.findings) x.verifyStatus = 'verified';
    const w = writeConfig(a.config, a.findings, { deployment: 'collector' });
    const js: any = parseDocument(w.text).toJS();
    expect(w.text).not.toMatch(/delete_key\(attributes, "host\.id"\)/); expect(w.text).toMatch(/delete_key\(attributes, "process\.pid"\)/);
    for (const pl of ['metrics', 'traces', 'logs']) { const ps: string[] = js.service.pipelines[pl].processors; expect(ps[0]).toBe('memory_limiter'); expect(ps.at(-1)).toBe('batch'); }
    expect(w.text).toMatch(/# Coralogix EC2 collector \(sample\)/); // user comments kept
    expect(w.text).toMatch(/Coralogix Lens: removed deletion of protected label\(s\) host\.id/);
  });
});
