import type { Connector, MetricSeriesRequest, QueryEvidence, QueryRequest, UsageStats } from '@cx-lens/core';
export interface CxTeam {
    name: string;
    region: string;
    profile?: string;
    keychainAccount?: string;
}
/**
 * Read-only adapter over the Coralogix `cx` CLI. Commands are discovered from `cx schema` at startup
 * and only used if present — nothing is hard-coded without confirmation.
 */
export declare class CxCliAdapter implements Connector {
    private team;
    private getKey;
    private bin;
    readonly id = "cx-cli";
    private commands;
    private version;
    constructor(team: CxTeam, getKey?: () => Promise<string | null>, bin?: string);
    discover(): Promise<Set<string>>;
    has(cmd: string): boolean;
    private static lastCall;
    /** Global throttle + retry on 429 honouring "Retry after N seconds" from the API. */
    private cx;
    minGapMs: number;
    private cxOnce;
    healthCheck(): Promise<{
        ok: boolean;
        detail: string;
        capabilities: string[];
    }>;
    listTeams(): Promise<{
        name: string;
        region: string;
    }[]>;
    runQuery(q: QueryRequest): Promise<QueryEvidence>;
    getUsageStats(days: number): Promise<UsageStats | null>;
    /**
     * Metrics through `cx metrics query` (PromQL). Uses cx's own sign-in (OAuth or API key, Keychain or file),
     * so Lens never needs or reads the key. Verified against the Metrics API: identical series counts.
     */
    promql(expr: string, at?: string): Promise<{
        metric: Record<string, string>;
        value: [number, string];
    }[]>;
    getLabelValues(label: string, window: string, metric?: string, at?: string): Promise<string[]>;
    getMetricSeries(req: MetricSeriesRequest): Promise<Record<string, string>[]>;
    listResources(kind: 'slos' | 'e2m' | 'tco' | 'alerts' | 'recording-rules'): Promise<any[] | null>;
}
/** cx usage daily returns {statsDate, highLogsUnits:{value}, ...}; map keys like highLogsUnits → logs:high. */
export declare function normaliseUsage(units: any[], gbs: any[]): UsageStats;
/** Distinct values of a label seen on `metric` during the window. */
export declare const labelValuesExpr: (label: string, window: string, metric: string) => string;
/** Every series of `metric` (matching labels) that had samples during the window — same set as /api/v1/series. */
export declare const seriesExpr: (req: MetricSeriesRequest) => string;
