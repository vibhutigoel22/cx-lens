import { describe, it, expect } from 'vitest';
import { helmMerge, validateHelmValues, writeConfig, parseConfig, runAssessment } from '../src/index.js';
import { demo, customer, fixture } from './helpers.js';

const schema = { type: 'object', required: ['mode'], properties: { mode: { type: 'string' }, presets: { type: 'object', additionalProperties: false, properties: { logsCollection: { type: 'object', properties: { enabled: { type: 'boolean' }, reduceLogAttributes: { type: 'object', properties: { enabled: { type: 'boolean' } } } } }, reduceResourceAttributes: { type: 'object' }, spanMetrics: { type: 'object', properties: { histogramBuckets: { type: 'array' } } } } } } };
const cs = { version: 'test', components: ['opentelemetry-agent', 'opentelemetry-gateway'], schema, parentDefaults: { 'opentelemetry-agent': { mode: 'daemonset' }, 'opentelemetry-gateway': { mode: 'deployment' } }, subDefaults: {} };
describe('Helm schema check', () => {
  it('merges like helm: maps merge, lists and scalars replace', () => expect(helmMerge({ a: { b: 1, l: [1, 2] } }, { a: { c: 2, l: [3] } })).toEqual({ a: { b: 1, c: 2, l: [3] } }));
  it('reports the same error helm gives for presets.reduceLogAttributes, and none once Lens repairs it', () => {
    const bad = 'opentelemetry-agent:\n  presets:\n    reduceLogAttributes:\n      enabled: true\n    logsCollection:\n      enabled: true\n';
    expect(validateHelmValues(bad, cs as any)).toEqual(['opentelemetry-agent: presets: Additional property reduceLogAttributes is not allowed']);
    const w = writeConfig(parseConfig(bad), []); expect(validateHelmValues(w.text, cs as any)).toEqual([]);
    expect(w.text).toMatch(/logsCollection:\n\s+enabled: true\n\s+reduceLogAttributes:/); expect(w.notes.join()).toMatch(/moved presets.reduceLogAttributes/);
  });
  it('no false alarms for values the chart defaults supply (mode)', () => expect(validateHelmValues('opentelemetry-gateway:\n  presets:\n    reduceResourceAttributes:\n      enabled: true\n', cs as any)).toEqual([]));
  it('Lens now writes reduceLogAttributes under logsCollection', async () => {
    const a = await runAssessment({ connector: demo(), customer, pillars: ['universal', 'logs'], deployment: 'helm', configText: fixture('configs/helm-values-old.yaml') });
    const f = a.findings.find((x) => x.ruleId === 'LOG-ATTR-REDUCTION')!; f.verifyStatus = 'verified';
    const w = writeConfig(a.config, [f]); expect(validateHelmValues(w.text, cs as any)).toEqual([]);
    expect((parseConfig(w.text).doc.toJS() as any)['opentelemetry-agent'].presets.logsCollection.reduceLogAttributes.enabled).toBe(true);
  });
});
