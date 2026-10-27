import { describe, it, expect } from 'vitest';
import { parseDocument } from 'yaml';
import { isProtectedLabel, scanForProtectedRemovals, guardOutput, assertNotProtected, stripProtectedFromDenylists, writeConfig, parseConfig, protectedSafeDenylist, loadCatalogue, upgradeConfig } from '../src/index.js';
import { f, fixture } from './helpers.js';

const PROTECTED = ['cloud.provider', 'cloud.platform', 'cloud.account.id', 'cloud.account.name', 'cloud.region', 'cloud.availability_zone', 'host.id', 'host.name', 'host.image.id', 'host.type', 'azure.vm.name', 'gcp.gce.instance_group_manager.zone'];

describe('protected labels', () => {
  it('recognises every protected label and wildcard', () => { for (const k of PROTECTED) expect(isProtectedLabel(k)).toBe(true); expect(isProtectedLabel('k8s.pod.uid')).toBe(false); });
  it('the recommended custom denylist contains no protected label', () => { const d = protectedSafeDenylist(loadCatalogue()); for (const l of [d.logs, d.metrics, d.traces]) expect(l.filter(isProtectedLabel)).toEqual([]); expect(d.traces.some((k) => k.startsWith('telemetry.'))).toBe(false); });
  it('detects delete_key, denylist, attributes delete, keep_keys omissions and delete_matching_keys', () => {
    const y = `processors:\n  transform/x:\n    log_statements:\n      - context: resource\n        statements:\n          - delete_key(attributes, "host.name")\n          - keep_keys(resource.attributes, ["service.name"])\n          - delete_matching_keys(attributes, "^cloud\\..*")\n  resource/y:\n    attributes:\n      - { key: cloud.region, action: delete }\npresets:\n  reduceResourceAttributes:\n    denylist:\n      logs: [azure.vm.size]\n`;
    const hows = new Set(scanForProtectedRemovals(y).map((v) => v.how));
    for (const h of ['delete_key', 'denylist', 'attributes-delete', 'keep_keys-omits', 'delete_matching_keys']) expect(hows.has(h as any)).toBe(true);
  });
  it('guardOutput throws on unsafe output', () => { expect(() => guardOutput('processors:\n  transform:\n    trace_statements: ["delete_key(attributes, \\"host.id\\")"]')).toThrow(/protected/); });
  it('assertNotProtected refuses', () => expect(() => assertNotProtected(['k8s.pod.uid', 'cloud.region'], 't')).toThrow());
  it('strips protected labels from existing denylists with a comment', () => {
    const doc = parseDocument('presets:\n  reduceResourceAttributes:\n    denylist:\n      metrics: [k8s.pod.uid, cloud.region]\n');
    expect(stripProtectedFromDenylists(doc)).toEqual(['cloud.region']); const out = doc.toString(); expect(out).not.toMatch(/- cloud\.region|, cloud\.region/); expect(out).toMatch(/Coralogix Lens: removed protected label/);
  });
  // Every writer path: helmPreset, processor, exporterSetting, receiverSetting, connectorSetting
  const hostile = [
    { kind: 'helmPreset', components: ['opentelemetry-agent'], preset: 'reduceResourceAttributes', value: { enabled: true, denylist: { logs: ['host.name'] } } },
    { kind: 'processor', name: 'transform/bad', body: { log_statements: [{ context: 'resource', statements: ['delete_key(attributes, "cloud.region")'] }] }, signals: ['logs'], position: 'middle' },
    { kind: 'processor', name: 'resource/bad', body: { attributes: [{ key: 'host.id', action: 'delete' }] }, signals: ['logs'], position: 'middle' },
    { kind: 'connectorSetting', connector: 'spanmetrics', key: 'x', value: { denylist: ['gcp.project.id'] } },
    { kind: 'receiverSetting', receiverPrefix: 'filelog', path: ['operators'], value: ['delete_key(attributes, "host.type")'] },
  ];
  for (const op of hostile) it(`writer refuses ${op.kind}`, () => {
    for (const cfg of ['', fixture('configs/helm-values-old.yaml'), fixture('configs/ecs-collector-0.98.yaml')]) {
      const r = writeConfig(parseConfig(cfg), [f({ ruleId: 'X', change: { summary: 'x', snippet: '', ops: [op as any] } })], { deployment: cfg.includes('receivers') ? 'collector' : 'helm' });
      expect(r.skipped[0]?.reason ?? '').toMatch(/protected/i); expect(scanForProtectedRemovals(r.text)).toEqual([]);
    }
  });
  it('existing unsafe denylists are cleaned in every output, including upgrades', () => {
    const p = parseConfig(fixture('configs/helm-values-old.yaml'));
    const w = writeConfig(p, []); expect(w.protectedRemoved).toContain('cloud.region'); expect(scanForProtectedRemovals(w.text).filter((v) => v.how !== 'denylist' || !v.location.includes('chart default'))).toEqual([]);
    const u = upgradeConfig(p, { fromCollector: '0.147.0', toCollector: '0.163.2' }); expect(scanForProtectedRemovals(u.text)).toEqual([]);
  });
});
