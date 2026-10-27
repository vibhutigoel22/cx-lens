import type { Connector, MetricSeriesRequest, QueryEvidence, QueryRequest, UsageStats } from '@cx-lens/core';
import type { CxCliAdapter } from './cx-cli.js';
import type { MetricsApiAdapter } from './metrics-api.js';
import type { ClaudeCliAdapter } from './claude-cli.js';
/** One Connector the engine uses: cx for queries/usage, Metrics API for series, claude for AI review. */
export declare class CompositeConnector implements Connector {
    private cx;
    private metrics?;
    private claude?;
    readonly id: string;
    askAI?: Connector['askAI'];
    metricUsage?: Connector['metricUsage'];
    constructor(cx: CxCliAdapter, metrics?: MetricsApiAdapter | undefined, claude?: ClaudeCliAdapter | undefined);
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
    /** Metrics go through cx first (its own sign-in). The direct Metrics API is only a fallback when a key was given explicitly. */
    getLabelValues(label: string, window: string, metric?: string, at?: string): Promise<string[]>;
    getMetricSeries(req: MetricSeriesRequest): Promise<Record<string, string>[]>;
    promql(expr: string, at?: string): Promise<{
        metric: Record<string, string>;
        value: [number, string];
    }[]>;
    listResources(kind: 'slos' | 'e2m' | 'tco' | 'alerts' | 'recording-rules'): Promise<any[] | null>;
}
