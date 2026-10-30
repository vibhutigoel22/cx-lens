import { describe, it, expect } from 'vitest';
import { batchErrors, writeConfig, parseConfig, runAssessment } from '../src/index.js';
import { demo, customer, fixture } from './helpers.js';

describe('batch settings that would stop the collector', () => {
  const lensOld = 'opentelemetry-agent:\n  config:\n    processors:\n      batch:\n        # Coralogix Lens UNI-2: memory_limiter first, batch last\n        send_batch_size: 8192\n        timeout: 5s\n    service:\n      pipelines:\n        logs:\n          processors: [memory_limiter, batch]\n';
  it('catches send_batch_size above the chart preset’s send_batch_max_size (the error you hit)', () => {
    expect(batchErrors(lensOld, 'helm-values')).toEqual(['opentelemetry-agent: processors.batch: send_batch_max_size (2048) must be greater or equal to send_batch_size (8192); the collector will not start']);
  });
  it('repairs Lens-added blocks and keeps batch last in the pipeline', () => {
    const w = writeConfig(parseConfig(lensOld), []); expect(batchErrors(w.text, 'helm-values')).toEqual([]);
    expect(w.text).not.toMatch(/send_batch_size: 8192/); expect(w.text).toMatch(/(- batch|batch \])/); expect(w.text).not.toMatch(/processors: \{\}/); expect(w.notes.join()).toMatch(/removed the batch block/);
  });
  it('leaves the customer’s own batch block alone, but still flags it', () => {
    const own = lensOld.replace('        # Coralogix Lens UNI-2: memory_limiter first, batch last\n', '');
    const w = writeConfig(parseConfig(own), []); expect(w.text).toMatch(/send_batch_size: 8192/); expect(batchErrors(w.text, 'helm-values')).toHaveLength(1);
  });
  it('no false alarms: gateway (preset off) with only send_batch_size, a valid max, and collector configs', () => {
    expect(batchErrors('opentelemetry-gateway:\n  config:\n    processors:\n      batch:\n        send_batch_size: 8192\n', 'helm-values')).toEqual([]);
    expect(batchErrors('opentelemetry-agent:\n  presets:\n    batch:\n      sendBatchSize: 8192\n      sendBatchMaxSize: 8192\n', 'helm-values')).toEqual([]);
    expect(batchErrors('processors:\n  batch:\n    send_batch_size: 1024\n    send_batch_max_size: 2048\n', 'collector')).toEqual([]);
    expect(batchErrors('processors:\n  batch/x:\n    send_batch_size: 4096\n    send_batch_max_size: 1024\n', 'collector')).toHaveLength(1);
  });
  it('Lens no longer writes batch settings into Helm values, and writes valid ones for collectors', async () => {
    for (const [dep, file, fmt] of [['helm', 'configs/helm-values-old.yaml', 'helm-values'], ['ecs', 'configs/ecs-collector-0.98.yaml', 'collector']] as const) {
      const a = await runAssessment({ connector: demo(), customer, pillars: ['universal'], deployment: dep, configText: fixture(file) });
      const f = a.findings.find((x) => x.ruleId === 'UNI-MEMLIMIT-BATCH'); if (!f) continue; f.verifyStatus = 'verified';
      const w = writeConfig(a.config, [f], { deployment: dep === 'helm' ? 'helm' : 'collector' }); expect(batchErrors(w.text, fmt)).toEqual([]);
      if (dep === 'helm') expect(w.text).not.toMatch(/send_batch_size: 8192/);
    }
  });
});
