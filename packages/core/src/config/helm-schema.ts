import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { parse, parseDocument } from 'yaml';
import AjvModule from 'ajv';
import { HELM_REPO } from '../versions/resolver.js';

/**
 * Validate generated Helm values against the otel-integration chart's own JSON schema, the same check
 * `helm upgrade --install` runs. The chart for the target version is downloaded once and cached.
 */
const cacheDir = () => join(process.env.CXLENS_CACHE_DIR ?? join(homedir(), '.cxlens', 'cache'), 'charts');
function untar(buf: Buffer, want: (name: string) => boolean): Record<string, string> {
  const out: Record<string, string> = {}; let off = 0;
  while (off + 512 <= buf.length) {
    const h = buf.subarray(off, off + 512); const name = h.subarray(0, 100).toString('utf8').replace(/\0.*$/s, ''); if (!name) break;
    const prefix = h.subarray(345, 500).toString('utf8').replace(/\0.*$/s, ''); const full = prefix ? `${prefix}/${name}` : name;
    const size = parseInt(h.subarray(124, 136).toString('utf8').replace(/\0.*$/s, '').trim() || '0', 8); const type = String.fromCharCode(h[156] || 48);
    if ((type === '0' || type === '\0') && want(full)) out[full] = buf.subarray(off + 512, off + 512 + size).toString('utf8');
    off += 512 + Math.ceil(size / 512) * 512;
  }
  return out;
}
export interface ChartSchema { version: string; components: string[]; schema: object; parentDefaults?: Record<string, unknown>; subDefaults?: Record<string, unknown> }
export async function loadChartSchema(version: string): Promise<ChartSchema> {
  mkdirSync(cacheDir(), { recursive: true }); const f = join(cacheDir(), `otel-integration-${version}.json`);
  if (existsSync(f)) { const c = JSON.parse(readFileSync(f, 'utf8')); if (c.parentDefaults) return c; }
  const r = await fetch(`${HELM_REPO.replace('/artifactory/', '/artifactory/api/helm/')}/otel-integration-${version}.tgz`, { signal: AbortSignal.timeout(60000) });
  if (!r.ok) throw new Error(`Could not download otel-integration ${version} (HTTP ${r.status})`);
  const files = untar(gunzipSync(Buffer.from(await r.arrayBuffer())), (n) => ['otel-integration/Chart.yaml', 'otel-integration/values.yaml', 'otel-integration/charts/opentelemetry-collector/values.schema.json', 'otel-integration/charts/opentelemetry-collector/values.yaml'].includes(n));
  const chart: any = parse(files['otel-integration/Chart.yaml'] ?? ''); const schemaTxt = files['otel-integration/charts/opentelemetry-collector/values.schema.json'];
  if (!schemaTxt) throw new Error(`otel-integration ${version} has no collector schema`);
  const out: ChartSchema = { version, components: (chart?.dependencies ?? []).filter((d: any) => d.name === 'opentelemetry-collector').map((d: any) => d.alias ?? d.name), schema: JSON.parse(schemaTxt), parentDefaults: parse(files['otel-integration/values.yaml'] ?? '') ?? {}, subDefaults: parse(files['otel-integration/charts/opentelemetry-collector/values.yaml'] ?? '') ?? {} };
  writeFileSync(f, JSON.stringify(out)); return out;
}
const Ajv: any = (AjvModule as any).default ?? AjvModule;
/** Helm's merge: maps merge recursively, everything else (lists, scalars) is replaced by the later value. */
const isMap = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
export function helmMerge(...layers: unknown[]): any { return layers.reduce((acc: any, v: any) => { if (v === undefined) return acc; if (!isMap(acc) || !isMap(v)) return v ?? acc; const o: any = { ...acc }; for (const [k, x] of Object.entries(v)) o[k] = x === null ? undefined : helmMerge(o[k], x); return o; }, undefined); }
/** Returns Helm-style messages, e.g. "opentelemetry-agent: presets: Additional property reduceLogAttributes is not allowed". */
export function validateHelmValues(valuesText: string, cs: ChartSchema): string[] {
  const values: any = parseDocument(valuesText, { merge: true }).toJS({ maxAliasCount: -1 }) ?? {};
  const ajv = new Ajv({ allErrors: true, strict: false, validateSchema: false }); const validate = ajv.compile(cs.schema); const errs: string[] = [];
  for (const c of cs.components) {
    if (values[c] === undefined) continue;
    // What helm validates: sub-chart defaults ← otel-integration defaults for this component ← your values.
    const merged = helmMerge(cs.subDefaults ?? {}, (cs.parentDefaults as any)?.[c] ?? {}, values[c]);
    if (!validate(merged)) for (const e of validate.errors ?? []) {
      const at = String(e.instancePath ?? '').split('/').filter(Boolean).join('.') || '(root)';
      errs.push(e.keyword === 'additionalProperties' ? `${c}: ${at}: Additional property ${e.params.additionalProperty} is not allowed` : `${c}: ${at}: ${e.message}`);
    }
  }
  return [...new Set(errs)];
}
