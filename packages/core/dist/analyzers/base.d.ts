import type { Catalogue } from '../rules/catalogue.js';
import type { ParsedConfig } from '../config/parse.js';
import type { ConfigChange, Connector, CustomerContext, DeploymentType, Effort, Finding, Owner, Phase, Pillar, ProgressEvent, QueryEvidence, Savings, SourceRef, UsageStats, VersionInfo } from '../types.js';
export interface AssessOptions {
    windowHours: number;
    /** exact date/time range (ISO 8601). When set, volume checks use it instead of the last windowHours. */
    range?: {
        start: string;
        end: string;
    };
    dupWindowMinutes: number;
    rowLimit: number;
    sampling: {
        nonErrorPct: number;
        nonCriticalErrorPct: number;
        criticalErrorPct: number;
        latencyThresholdMs: number;
    };
    spanMetric: string;
    maxAttrQueries: number;
    /** Investigate mode: data-driven analysis with Claude, validated by Lens. */
    investigate?: {
        enabled: boolean;
        maxContributors: number;
        skills?: {
            spanNames?: boolean;
            buckets?: boolean;
        };
        vendor?: string;
    };
}
export declare const DEFAULT_OPTIONS: AssessOptions;
export interface AnalyzerContext {
    connector: Connector;
    cat: Catalogue;
    config: ParsedConfig;
    deployment: DeploymentType;
    versions: VersionInfo;
    usage: UsageStats | null;
    customer: CustomerContext;
    opts: AssessOptions;
    /** run a catalogue query (cached, windowed, row-limited) */
    query(ruleId: string, queryId: string, params?: Record<string, string>, rawKeys?: string[]): Promise<QueryEvidence>;
    /** shared baseline numbers computed once */
    shared: Map<string, unknown>;
    progress(e: Omit<ProgressEvent, 'checkId'> & {
        checkId?: string;
    }): void;
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
export interface Recommendation {
    title?: string;
    plain?: string;
    detail?: string;
    nextStep: string;
    caveats?: string[];
    drafts?: Finding['drafts'];
    display?: Finding['display'];
}
export interface AnalyzerPlugin {
    id: string;
    pillar: Pillar;
    deploymentTypes: DeploymentType[];
    title: string;
    defaultPhase: Phase;
    defaultEffort: Effort;
    owner: Owner;
    verifyChecklist: string[];
    overlapsWith: string[];
    sources: SourceRef[];
    detect(ctx: AnalyzerContext): Promise<Detection | Detection[] | null>;
    recommend(d: Detection, ctx: AnalyzerContext): Recommendation;
    generateConfigPatch(d: Detection, ctx: AnalyzerContext): ConfigChange | undefined;
    estimateSavings(d: Detection, ctx: AnalyzerContext): Savings;
}
export type PluginImpl = Pick<AnalyzerPlugin, 'detect' | 'recommend' | 'estimateSavings'> & Partial<Pick<AnalyzerPlugin, 'generateConfigPatch' | 'deploymentTypes'>>;
/** Build a plugin whose metadata comes from the rule catalogue (so playbook updates flow through data). */
export declare function definePlugin(cat: Catalogue, ruleId: string, pillar: Pillar, impl: PluginImpl): AnalyzerPlugin;
export declare const num: (v: unknown) => number;
export declare const rows: (e?: QueryEvidence) => Record<string, any>[];
export declare const first: (e?: QueryEvidence) => Record<string, any>;
export declare const GB = 1000000000;
export declare const perDay: (value: number, window: string) => number;
export declare function windowHours(w: string): number;
export declare const fmtCount: (n: number) => string;
export declare const none: (basis: string) => Savings;
export declare const scoping: (basis: string, gb?: number | null) => Savings;
export declare const skip: (reason: string) => Detection;
export declare const yamlBlock: (o: unknown) => string;
