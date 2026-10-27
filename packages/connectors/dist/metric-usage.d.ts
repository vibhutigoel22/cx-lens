import { type MetricUsageClient, type MetricUsageRow, type MetricUsageDay } from '@cx-lens/core';
export declare const usageKeyAccount: (team: string) => string;
export declare function usageKey(team: string): Promise<string | null>;
export declare class MetricUsageApi implements MetricUsageClient {
    private region;
    private key;
    private client;
    constructor(region: string, key: string);
    private call;
    /** Last complete UTC day: today's dataset is still filling. */
    private common;
    labels(length?: number): Promise<MetricUsageDay>;
    metrics(length?: number): Promise<MetricUsageDay>;
    metricsForLabel(label: string, length?: number): Promise<MetricUsageRow[]>;
    healthCheck(): Promise<{
        ok: boolean;
        detail: string;
    }>;
}
export declare function metricUsageFor(team: {
    name: string;
    region: string;
}): Promise<MetricUsageApi | null>;
