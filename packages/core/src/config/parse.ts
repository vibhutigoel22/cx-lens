import { Document, isMap, isSeq, parseDocument } from 'yaml';
import type { DeploymentType, HelmComponent } from '../types.js';

export type ConfigFormat = 'helm-values' | 'collector' | 'other' | 'empty';
export const HELM_COMPONENTS: HelmComponent[] = ['opentelemetry-agent', 'opentelemetry-cluster-collector', 'opentelemetry-gateway'];

export interface CollectorView {
  name: string; // helm component or "collector"
  basePath: string[]; // path to collector config root inside the doc
  receivers: Record<string, any>; processors: Record<string, any>; exporters: Record<string, any>; connectors: Record<string, any>;
  pipelines: Record<string, { receivers?: string[]; processors?: string[]; exporters?: string[] }>;
  presets: Record<string, any>;
}
export interface ParsedConfig {
  format: ConfigFormat; text: string; doc: Document;
  chartVersion?: string; collectorVersion?: string; distribution?: 'otelcol' | 'otelcol-contrib';
  deploymentGuess?: DeploymentType; views: CollectorView[]; notes: string[]; label: string;
}

const IMAGE_RE = /otel\/opentelemetry-collector(-contrib|-k8s)?:v?(\d+\.\d+\.\d+)/;
const TAG_RE = /tag:\s*["']?v?(\d+\.\d+\.\d+)/;

export function parseConfig(text: string): ParsedConfig {
  const trimmed = text.trim();
  if (!trimmed) return { format: 'empty', text, doc: new Document({}), views: [], notes: ['No configuration provided — fresh snippets will be generated.'], label: 'No config' };
  if (/^\s*\[(SERVICE|INPUT|OUTPUT|FILTER)\]/m.test(text)) {
    return { format: 'other', text, doc: new Document({}), views: [], label: 'Fluent Bit (classic format)',
      notes: ['Fluent Bit classic configuration detected. Coralogix Lens reads it for context only; collector changes are produced as separate OpenTelemetry snippets.'] };
  }
  const doc = parseDocument(text, { merge: true, keepSourceTokens: false });
  if (doc.errors.length) return { format: 'other', text, doc, views: [], label: 'Unparseable YAML', notes: doc.errors.map((e) => `YAML error: ${e.message}`) };
  const js: any = doc.toJS({ maxAliasCount: -1 }) ?? {};
  const notes: string[] = [];
  const img = text.match(IMAGE_RE);
  let collectorVersion = img?.[2];
  const distribution: ParsedConfig['distribution'] = img ? (img[1] === '-contrib' ? 'otelcol-contrib' : 'otelcol') : undefined;

  if (HELM_COMPONENTS.some((c) => c in js) || (js.global && (js.global.domain || js.global.clusterName))) {
    const views: CollectorView[] = HELM_COMPONENTS.filter((c) => c in js || true).map((c) => viewOf(c, [c, 'config'], js?.[c]?.config ?? {}, js?.[c]?.presets ?? {}));
    if (!collectorVersion) { const t = JSON.stringify(js).match(/"tag":"v?(\d+\.\d+\.\d+)"/); collectorVersion = t?.[1]; }
    const chartVersion = typeof js?.global?.version === 'string' ? js.global.version : undefined;
    if (!chartVersion) notes.push('Chart version not found in values (global.version). Enter it, or the latest is assumed.');
    return { format: 'helm-values', text, doc, chartVersion, collectorVersion, distribution, deploymentGuess: 'helm', views, notes,
      label: `Coralogix Helm values${chartVersion ? `, chart version ${chartVersion}` : ''}` };
  }
  if (js.receivers || js.exporters || js.service) {
    const ecs = /awsecscontainermetrics|ecs_task|aws\.ecs/.test(text);
    const ec2 = /resourcedetection[\s\S]{0,200}ec2/.test(text) && !ecs;
    return { format: 'collector', text, doc, collectorVersion, distribution, deploymentGuess: ecs ? 'ecs' : ec2 ? 'ec2' : 'standalone',
      views: [viewOf('collector', [], js, {})], notes,
      label: `OpenTelemetry Collector config${ecs ? ' (Coralogix ECS integration)' : ec2 ? ' (EC2)' : ''}${collectorVersion ? `, collector ${collectorVersion}` : ''}` };
  }
  return { format: 'other', text, doc, views: [], label: 'Unrecognised YAML', notes: ['Not a Coralogix Helm values file or collector config. The report is still produced; config changes are generated as snippets.'] };
}

function viewOf(name: string, basePath: string[], cfg: any, presets: any): CollectorView {
  const pipes: CollectorView['pipelines'] = {};
  for (const [k, v] of Object.entries<any>(cfg?.service?.pipelines ?? {})) pipes[k] = { receivers: v?.receivers, processors: v?.processors, exporters: v?.exporters };
  return { name, basePath, receivers: cfg?.receivers ?? {}, processors: cfg?.processors ?? {}, exporters: cfg?.exporters ?? {}, connectors: cfg?.connectors ?? {}, pipelines: pipes, presets: presets ?? {} };
}

/** Component *types* used (processors/receivers/exporters/connectors), e.g. "filter" from "filter/drop". */
export function componentTypesUsed(p: ParsedConfig): Set<string> {
  const s = new Set<string>();
  for (const v of p.views) for (const sect of [v.receivers, v.processors, v.exporters, v.connectors]) for (const k of Object.keys(sect)) s.add(k.split('/')[0]);
  if (/\b(set|delete_key|replace_pattern|Decode|Base64Decode)\(/.test(p.text)) s.add('ottl');
  return s;
}
export const pipelinesFor = (v: CollectorView, signal: string) => Object.keys(v.pipelines).filter((k) => k === signal || k.startsWith(signal + '/'));
export { isMap, isSeq };
