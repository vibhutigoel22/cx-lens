import type { AnalyzerContext } from '../analyzers/base.js';
import type { Finding } from '../types.js';
/** PromQL helpers. `*_over_time` functions drop __name__, so ranking uses an instant query and churn is measured per metric. */
export declare const winOf: (ctx: AnalyzerContext) => string;
export declare function pq(ctx: AnalyzerContext, expr: string): Promise<{
    metric: Record<string, string>;
    value: [number, string];
}[]>;
export declare const scalar: (r: {
    value: [number, string];
}[]) => number;
/** Protected labels appear in metrics with underscores (cloud_region, host_name). */
export declare const isProtectedMetricLabel: (l: string) => boolean;
export declare const METRICS_SCHEMA: {
    readonly type: "object";
    readonly required: readonly ["contributors"];
    readonly properties: {
        readonly contributors: {
            readonly type: "array";
            readonly items: {
                readonly type: "object";
                readonly required: readonly ["key", "title", "what_it_is", "value", "action", "why_it_matters", "next_step", "verify_questions", "confidence"];
                readonly properties: {
                    readonly key: {
                        readonly type: "string";
                    };
                    readonly title: {
                        readonly type: "string";
                    };
                    readonly what_it_is: {
                        readonly type: "string";
                    };
                    readonly value: {
                        readonly enum: readonly ["high", "medium", "low"];
                    };
                    readonly signals: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                    readonly action: {
                        readonly enum: readonly ["drop_label", "normalise_label", "reduce_buckets", "drop_metric", "fix_at_source", "keep"];
                    };
                    readonly why_it_matters: {
                        readonly type: "string";
                    };
                    readonly label: {
                        readonly type: "string";
                        readonly description: "For drop_label / normalise_label: the Prometheus-style label name as shown.";
                    };
                    readonly regex: {
                        readonly type: "string";
                        readonly description: "For normalise_label: RE2 pattern applied to the label value.";
                    };
                    readonly replacement: {
                        readonly type: "string";
                    };
                    readonly buckets: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "number";
                        };
                        readonly description: "For reduce_buckets: new explicit bucket bounds in the metric’s unit (e.g. ms), ascending, without +Inf.";
                    };
                    readonly ottl_statements: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                        readonly description: "transform processor statements, context datapoint, unprefixed paths: attributes[\"k\"].";
                    };
                    readonly source_fix: {
                        readonly type: "string";
                    };
                    readonly next_step: {
                        readonly type: "string";
                    };
                    readonly verify_questions: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                    readonly confidence: {
                        readonly enum: readonly ["high", "medium", "low"];
                    };
                };
            };
        };
    };
};
export declare function investigateMetrics(ctx: AnalyzerContext, max: number): Promise<{
    findings: Finding[];
    notes: string[];
    totalSeries: number;
    top: string[];
}>;
