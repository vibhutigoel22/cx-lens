import { type MetricSeriesRequest } from '@cx-lens/core';
/** Read-only Coralogix Metrics API (Prometheus-compatible /metrics/api/v1), region → domain from the official list. */
export declare class MetricsApiAdapter {
    private region;
    private getKey;
    readonly id = "metrics-api";
    private last;
    constructor(region: string, getKey: () => Promise<string | null>);
    base(): string;
    private range;
    private get;
    healthCheck(): Promise<{
        ok: boolean;
        detail: string;
    }>;
    getLabelValues(label: string, window: string, metric?: string, at?: string): Promise<string[]>;
    getMetricSeries(req: MetricSeriesRequest): Promise<Record<string, string>[]>;
}
