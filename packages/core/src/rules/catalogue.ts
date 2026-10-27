import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { parse } from 'yaml';
import type { SourceRef } from '../types.js';

export interface RuleDef {
  id: string; playbookSection: string; title: string; plain?: string; defaultPhase?: 1 | 2 | 3; effort?: string; owner?: string;
  overlapsWith?: string[]; sources: string[]; verify?: string[]; detect?: any; config?: any; thresholds?: any; savings?: string;
  pillar?: string; deploymentTypes?: string[]; notes?: string[]; steps?: string[]; draft?: string; priority?: string; checklist?: string[]; internalOnly?: boolean;
}
export interface Catalogue {
  version: string;
  sources: Record<string, SourceRef>;
  rules: Record<string, RuleDef>;
  universal: any; logs: any; traces: any; metrics: any;
  protected: { exact: string[]; prefixes: string[]; reason: string; sources: SourceRef[] };
  units: { unitUsd: number; logs: Record<string, number>; traces: Record<string, number>; metrics: { default: number }; defaultTier: string; estimateTolerancePct: number; sources: SourceRef[] };
  domains: { regions: Record<string, { domain: string; cloudRegion: string; teamHost: string }>; metricsApi: { template: string; minDelayMs: number; retryOn: number[] } };
  upgradeFixes: { fixes: any[]; componentAliases: Record<string, string[]> };
}

export function rulesDir(): string {
  if (process.env.CXLENS_RULES_DIR) return process.env.CXLENS_RULES_DIR;
  try {
    const req = createRequire(import.meta.url);
    return dirname(req.resolve('@cx-lens/rules/package.json'));
  } catch {
    let d = dirname(new URL(import.meta.url).pathname);
    for (let i = 0; i < 6; i++) { const c = join(d, 'rules'); if (existsSync(join(c, 'universal.yaml'))) return c; d = dirname(d); }
    throw new Error('Rule catalogue not found. Set CXLENS_RULES_DIR.');
  }
}

let cached: Catalogue | null = null;
export function loadCatalogue(dir = rulesDir()): Catalogue {
  if (cached) return cached;
  const y = (f: string) => parse(readFileSync(join(dir, f), 'utf8'), { merge: true });
  const universal = y('universal.yaml'), logs = y('logs.yaml'), traces = y('traces.yaml'), metrics = y('metrics.yaml');
  const rules: Record<string, RuleDef> = {};
  for (const f of [universal, logs, traces, metrics]) for (const r of f.rules) rules[r.id] = { ...r, pillar: f.pillar };
  cached = {
    version: [universal, logs, traces, metrics].map((f) => f.schemaVersion).join('.'),
    sources: y('sources.yaml').sources, rules, universal, logs, traces, metrics,
    protected: y('protected-labels.yaml'), units: y('units.yaml'), domains: y('domains.yaml'), upgradeFixes: y('upgrade-fixes.yaml'),
  };
  return cached;
}

export function resolveSources(cat: Catalogue, keys: string[] = []): SourceRef[] {
  return keys.map((k) => cat.sources[k] ?? { title: `Not covered by official guidance (${k})`, url: '' });
}
