import type { Catalogue, RuleDef } from '../rules/catalogue.js';
import { resolveSources } from '../rules/catalogue.js';
import type { ParsedConfig } from '../config/parse.js';
import type {
  ConfigChange, Connector, CustomerContext, DeploymentType, Effort, Finding, Owner, Phase, Pillar, ProgressEvent,
  QueryEvidence, Savings, SourceRef, UsageStats, VersionInfo,
} from '../types.js';

export interface AssessOptions {
  windowHours: number;       // default 24 (volume checks)
  /** exact date/time range (ISO 8601). When set, volume checks use it instead of the last windowHours. */
  range?: { start: string; end: string };
  dupWindowMinutes: number;  // default 15 (duplicate checks)
  rowLimit: number;          // hard cap on rows per query
  sampling: { nonErrorPct: number; nonCriticalErrorPct: number; criticalErrorPct: number; latencyThresholdMs: number };
  spanMetric: string;        // calls_total by default
  maxAttrQueries: number;
  /** Investigate mode: data-driven analysis with Claude, validated by Lens. */
  investigate?: { enabled: boolean; maxContributors: number; skills?: { spanNames?: boolean; buckets?: boolean }; vendor?: string; /** claude CLI model alias (sonnet, opus…); empty = the CLI's default */ model?: string };
}
export const DEFAULT_OPTIONS: AssessOptions = {
  windowHours: 24, dupWindowMinutes: 15, rowLimit: 200,
  sampling: { nonErrorPct: 1, nonCriticalErrorPct: 1, criticalErrorPct: 100, latencyThresholdMs: 500 },
  spanMetric: 'calls_total', maxAttrQueries: 12,
};

export interface AnalyzerContext {
  connector: Connector; cat: Catalogue; config: ParsedConfig; deployment: DeploymentType; versions: VersionInfo;
  usage: UsageStats | null; customer: CustomerContext; opts: AssessOptions;
  /** run a catalogue query (cached, windowed, row-limited) */
  query(ruleId: string, queryId: string, params?: Record<string, string>, rawKeys?: string[]): Promise<QueryEvidence>;
  /** shared baseline numbers computed once */
  shared: Map<string, unknown>;
  progress(e: Omit<ProgressEvent, 'checkId'> & { checkId?: string }): void;
}

/** What a plugin found. `null` means "nothing to report". */
export interface Detection {
  applicable: boolean;
  skippedReason?: string;
  evidence: QueryEvidence[];
  facts: Record<string, any>;
  observedVolume?: string;
  priority?: 'high' | 'normal';
  phaseOverride?: Phase;
  forceStatus?: Finding['verifyStatus'];
}
export interface Recommendation { title?: string; plain?: string; detail?: string; nextStep: string; caveats?: string[]; drafts?: Finding['drafts']; display?: Finding['display'] }

export interface AnalyzerPlugin {
  id: string;                  // = rule id
  pillar: Pillar;
  deploymentTypes: DeploymentType[];
  title: string;
  defaultPhase: Phase; defaultEffort: Effort; owner: Owner;
  verifyChecklist: string[]; overlapsWith: string[]; sources: SourceRef[];
  detect(ctx: AnalyzerContext): Promise<Detection | Detection[] | null>;
  recommend(d: Detection, ctx: AnalyzerContext): Recommendation;
  generateConfigPatch(d: Detection, ctx: AnalyzerContext): ConfigChange | undefined;
  estimateSavings(d: Detection, ctx: AnalyzerContext): Savings;
}

export type PluginImpl = Pick<AnalyzerPlugin, 'detect' | 'recommend' | 'estimateSavings'> & Partial<Pick<AnalyzerPlugin, 'generateConfigPatch' | 'deploymentTypes'>>;

const ALL: DeploymentType[] = ['helm', 'ecs', 'ec2', 'standalone'];
const EFFORTS: Effort[] = ['low', 'medium', 'medium-high', 'high'];

/** Build a plugin whose metadata comes from the rule catalogue (so playbook updates flow through data). */
export function definePlugin(cat: Catalogue, ruleId: string, pillar: Pillar, impl: PluginImpl): AnalyzerPlugin {
  const r: RuleDef | undefined = cat.rules[ruleId];
  if (!r) throw new Error(`Rule ${ruleId} missing from catalogue`);
  return {
    id: ruleId, pillar, title: r.title,
    deploymentTypes: impl.deploymentTypes ?? (r.deploymentTypes as DeploymentType[] | undefined) ?? ALL,
    defaultPhase: (r.defaultPhase ?? 1) as Phase,
    defaultEffort: (EFFORTS.includes(r.effort as Effort) ? r.effort : 'low') as Effort,
    owner: (r.owner === 'App Team' ? 'App Team' : 'DevOps') as Owner,
    verifyChecklist: r.verify ?? [], overlapsWith: r.overlapsWith ?? [], sources: resolveSources(cat, r.sources),
    detect: impl.detect, recommend: impl.recommend, estimateSavings: impl.estimateSavings,
    generateConfigPatch: impl.generateConfigPatch ?? (() => undefined),
  };
}

export const num = (v: unknown): number => (typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' && !isNaN(+v) ? +v : 0);
export const rows = (e?: QueryEvidence) => (e?.rows ?? []) as Record<string, any>[];
export const first = (e?: QueryEvidence) => rows(e)[0] ?? {};
export const GB = 1e9;
export const perDay = (value: number, window: string) => { const h = windowHours(window); return h > 0 ? value * (24 / h) : value; };
export function windowHours(w: string): number { const m = w.match(/^(\d+)([mhd])$/); if (!m) return 24; const n = +m[1]; return m[2] === 'm' ? n / 60 : m[2] === 'd' ? n * 24 : n; }
export const fmtCount = (n: number) => (n >= 1e9 ? `${(n / 1e9).toFixed(2)}B` : n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : `${Math.round(n)}`);
export const none = (basis: string): Savings => ({ kind: 'none-units', unitsPerDay: null, gbPerDay: null, basis });
export const scoping = (basis: string, gb: number | null = null): Savings => ({ kind: 'needs-scoping', unitsPerDay: null, gbPerDay: gb, basis });
export const skip = (reason: string): Detection => ({ applicable: false, skippedReason: reason, evidence: [], facts: {} });
export const yamlBlock = (o: unknown) => JSON.stringify(o, null, 2);
