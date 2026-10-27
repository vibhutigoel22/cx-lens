import type { Connector, MetricSeriesRequest, QueryEvidence, QueryRequest, UsageStats } from '@cx-lens/core';
export interface Fixture {
    metricUsage?: {
        labels?: any;
        metrics?: any;
        byLabel?: Record<string, any[]>;
    };
    promql?: Record<string, any[]>;
    recordedAt: string;
    source: string;
    queries: Record<string, {
        rows?: any[];
        error?: string;
    }>;
    usage: UsageStats | null;
    labels: Record<string, string[]>;
    series: Record<string, Record<string, string>[]>;
    resources: Record<string, unknown[] | null>;
    ai?: Record<string, string>;
}
export declare const fixtureKey: (q: {
    pillar: string;
    text: string;
}) => string;
/** Replays recorded (anonymised) data for tests and demo mode. Unknown queries return an empty result. */
export declare class MockAdapter implements Connector {
    fx: Fixture;
    readonly id = "mock";
    askAI?: Connector['askAI'];
    metricUsage?: Connector['metricUsage'];
    constructor(fx: Fixture);
    static fromFile(p: string): MockAdapter;
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
    getUsageStats(): Promise<{
        fetchedAt: string;
        days: import("@cx-lens/core").UsageDay[];
    } | null>;
    getLabelValues(label: string): Promise<string[]>;
    getMetricSeries(req: MetricSeriesRequest): Promise<Record<string, string>[]>;
    listResources(kind: string): Promise<unknown[] | null>;
    promql(expr: string): Promise<any[]>;
}
/** Wraps a live connector and records everything (for building fixtures). */
export declare class RecordingConnector implements Connector {
    private inner;
    readonly id: string;
    fx: Fixture;
    askAI?: Connector['askAI'];
    metricUsage?: Connector['metricUsage'];
    constructor(inner: Connector);
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
    getUsageStats(d: number): Promise<UsageStats | null>;
    getLabelValues(l: string, w: string, m?: string): Promise<string[]>;
    getMetricSeries(req: MetricSeriesRequest): Promise<Record<string, string>[]>;
    listResources(k: any): Promise<unknown[] | null>;
    promql(expr: string, at?: string): Promise<{
        metric: Record<string, string>;
        value: [number, string];
    }[]>;
}
