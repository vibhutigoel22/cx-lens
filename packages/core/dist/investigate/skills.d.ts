import type { AnalyzerContext } from '../analyzers/base.js';
import type { Finding } from '../types.js';
/** TAM skills (playbook › AI Skills). Lens collects the data each skill needs through cx; Claude applies the skill’s method with tools off. */
export declare function skillsDir(): string;
export declare function loadSkill(name: string): string | null;
/** span-name-cardinality-analyzer: Lens gathers span_name values per service; validates the regexes on every real value. */
export declare function runSpanNameSkill(ctx: AnalyzerContext, totalSeries: number): Promise<Finding | {
    note: string;
}>;
/** span-metrics-bucket-optimizer: Lens pulls the bucket distribution for the top services; percentiles are computed by Lens. */
export declare function quantile(b: {
    le: number;
    c: number;
}[], q: number): number | null;
export declare function runBucketSkill(ctx: AnalyzerContext, vendor: string, totalSeries: number, metricNames: string[]): Promise<Finding | {
    note: string;
}>;
