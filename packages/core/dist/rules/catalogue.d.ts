import type { SourceRef } from '../types.js';
export interface RuleDef {
    id: string;
    playbookSection: string;
    title: string;
    plain?: string;
    defaultPhase?: 1 | 2 | 3;
    effort?: string;
    owner?: string;
    overlapsWith?: string[];
    sources: string[];
    verify?: string[];
    detect?: any;
    config?: any;
    thresholds?: any;
    savings?: string;
    pillar?: string;
    deploymentTypes?: string[];
    notes?: string[];
    steps?: string[];
    draft?: string;
    priority?: string;
    checklist?: string[];
    internalOnly?: boolean;
}
export interface Catalogue {
    version: string;
    sources: Record<string, SourceRef>;
    rules: Record<string, RuleDef>;
    universal: any;
    logs: any;
    traces: any;
    metrics: any;
    protected: {
        exact: string[];
        prefixes: string[];
        reason: string;
        sources: SourceRef[];
    };
    units: {
        unitUsd: number;
        logs: Record<string, number>;
        traces: Record<string, number>;
        metrics: {
            default: number;
        };
        defaultTier: string;
        estimateTolerancePct: number;
        sources: SourceRef[];
    };
    domains: {
        regions: Record<string, {
            domain: string;
            cloudRegion: string;
            teamHost: string;
        }>;
        metricsApi: {
            template: string;
            minDelayMs: number;
            retryOn: number[];
        };
    };
    upgradeFixes: {
        fixes: any[];
        componentAliases: Record<string, string[]>;
    };
}
export declare function rulesDir(): string;
export declare function loadCatalogue(dir?: string): Catalogue;
export declare function resolveSources(cat: Catalogue, keys?: string[]): SourceRef[];
