import type { AnalyzerPlugin, AssessOptions } from './analyzers/base.js';
import { type LabelInventory } from './investigate/labels.js';
import { Catalogue } from './rules/catalogue.js';
import { ParsedConfig } from './config/parse.js';
import type { AdoptionGap, Connector, CustomerContext, DeploymentType, Finding, Pillar, ProgressEvent, UsageStats, VersionInfo } from './types.js';
export interface AssessInput {
    connector: Connector;
    customer: CustomerContext;
    pillars: Pillar[];
    deployment: DeploymentType;
    configText?: string;
    versions?: VersionInfo;
    options?: Partial<AssessOptions>;
    extraPlugins?: AnalyzerPlugin[];
    onProgress?: (e: ProgressEvent) => void;
    /** Several deployment types at once (e.g. EKS + ECS + EC2), each with its own optional config and versions. The first is the primary. */
    deployments?: DeploymentType[];
    configs?: Partial<Record<DeploymentType, string>>;
    versionsBy?: Partial<Record<DeploymentType, VersionInfo>>;
}
/** Checks that read a collector config: run once per deployment type. Everything else reads Coralogix data: run once. */
export declare const CONFIG_RULES: Set<string>;
export interface Assessment {
    findings: Finding[];
    gaps: AdoptionGap[];
    usage: UsageStats | null;
    config: ParsedConfig;
    versions: VersionInfo;
    progress: ProgressEvent[];
    skipped: {
        id: string;
        reason: string;
    }[];
    eligibility: string[];
    options: AssessOptions;
    deployment: DeploymentType;
    deployments: DeploymentType[];
    configs: Partial<Record<DeploymentType, ParsedConfig>>;
    versionsBy: Partial<Record<DeploymentType, VersionInfo>>;
    platformSplit?: {
        pillar: 'logs' | 'traces';
        deployment: string;
        share: number;
    }[];
    pillars: Pillar[];
    customer: CustomerContext;
    startedAt: string;
    finishedAt: string;
    connectorId: string;
    artifacts: {
        labelCsv?: string;
    };
    /** Metric labels ranked by usage (Metric Usage API or PromQL). */
    labelInventory?: LabelInventory;
    /** Checks that found no data or were skipped, in plain words, shown in the reports and the app. */
    notes: string[];
}
export declare function allPlugins(cat?: Catalogue): AnalyzerPlugin[];
export declare function runAssessment(input: AssessInput): Promise<Assessment>;
/** Order by phase, then savings; number per pillar (LOG-1, SPAN-1 …). UNI-UPGRADE keeps its fixed id. */
export declare function assignIds(fs: Finding[]): Finding[];
