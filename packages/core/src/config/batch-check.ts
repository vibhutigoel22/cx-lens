import { parseDocument } from 'yaml';
/**
 * The collector refuses to start when send_batch_max_size < send_batch_size. In Helm values the chart's batch preset
 * (on by default for the agent and the cluster collector: 1024 / 2048) merges with config.processors.batch, so check the
 * merged values. Collector defaults: send_batch_size 8192, send_batch_max_size 0 (no limit).
 */
const PRESET_ON = new Set(['opentelemetry-agent', 'opentelemetry-cluster-collector']);
export function batchErrors(text: string, format: 'helm-values' | 'collector' | string): string[] {
  let v: any; try { v = parseDocument(text, { merge: true }).toJS({ maxAliasCount: -1 }) ?? {}; } catch { return []; }
  const errs: string[] = []; const check = (where: string, size: unknown, max: unknown) => { const s = Number(size), m = Number(max); if (Number.isFinite(s) && Number.isFinite(m) && m > 0 && m < s) errs.push(`${where}: send_batch_max_size (${m}) must be greater or equal to send_batch_size (${s}); the collector will not start`); };
  if (format === 'helm-values') {
    for (const [c, val] of Object.entries<any>(v)) {
      if (!c.startsWith('opentelemetry-') || !val || typeof val !== 'object') continue;
      const pb = val.presets?.batch ?? {}; const on = pb.enabled ?? PRESET_ON.has(c); const procs = val.config?.processors ?? {};
      for (const [name, b] of Object.entries<any>(procs)) if (name === 'batch' || name.startsWith('batch/')) {
        const preset = on && name === 'batch';
        check(`${c}: processors.${name}`, b?.send_batch_size ?? (preset ? pb.sendBatchSize ?? 1024 : 8192), b?.send_batch_max_size ?? (preset ? pb.sendBatchMaxSize ?? 2048 : 0));
      }
      if (on && !procs.batch) check(`${c}: presets.batch`, pb.sendBatchSize ?? 1024, pb.sendBatchMaxSize ?? 2048);
    }
  } else for (const [name, b] of Object.entries<any>(v.processors ?? {})) if (name === 'batch' || name.startsWith('batch/')) check(`processors.${name}`, b?.send_batch_size ?? 8192, b?.send_batch_max_size ?? 0);
  return errs;
}
