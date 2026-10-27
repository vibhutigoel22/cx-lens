export declare const HELM_REPO = "https://cgx.jfrog.io/artifactory/coralogix-charts-virtual";
export declare const CHART_CHANGELOG = "https://raw.githubusercontent.com/coralogix/telemetry-shippers/master/otel-integration/CHANGELOG.md";
export declare const CONTRIB_CHANGELOG = "https://raw.githubusercontent.com/open-telemetry/opentelemetry-collector-contrib/main/CHANGELOG.md";
export declare const CORE_CHANGELOG = "https://raw.githubusercontent.com/open-telemetry/opentelemetry-collector/main/CHANGELOG.md";
export declare const CHART_README = "https://raw.githubusercontent.com/coralogix/telemetry-shippers/master/otel-integration/k8s-helm/README.md";
/** Offline fallback only (playbook pins this version). Logic always prefers the resolved latest. */
export declare const OFFLINE_FALLBACK: {
    chart: string;
    collector: string | null;
};
export interface Latest {
    chart: string | null;
    collector: string | null;
    checkedAt: string;
    fromCache: boolean;
    offline: boolean;
    errors: string[];
}
declare function cachedFetch(url: string, name: string, force?: boolean): Promise<{
    text: string;
    at: string;
    cached: boolean;
}>;
export declare const fetchText: typeof cachedFetch;
/** Latest otel-integration chart (Helm repo index.yaml) and latest collector (GitHub releases redirect). */
export declare function resolveLatest(force?: boolean): Promise<Latest>;
/** Map a chart version to the collector image it ships, using the chart CHANGELOG ("Bump the OpenTelemetry Collector image to vX"). */
export declare function collectorForChart(changelog: string, chart: string): string | null;
export {};
