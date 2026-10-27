import type { AnalyzerContext } from '../analyzers/base.js';
import type { Finding } from '../types.js';
export type LabelKind = 'high-cardinality' | 'churn' | 'constant' | 'normal';
export interface LabelRow {
    name: string;
    unique: number;
    metricCount?: number;
    series?: number;
    units?: number;
    fraction?: number;
    kind: LabelKind;
    locked?: 'protected' | 'needed';
}
export interface LabelInventory {
    source: 'usage-api' | 'promql';
    date?: string;
    totalUnits?: number;
    totalSeries?: number;
    rows: LabelRow[];
}
export declare function classify(r: Omit<LabelRow, 'kind'>, totalSeries?: number): LabelKind;
/** Every label ranked by usage: exact from the Metric Usage API when a key is set, otherwise measured with PromQL through cx. */
export declare function labelInventory(ctx: AnalyzerContext): Promise<LabelInventory>;
/** Group label values by underlying shape. Deterministic, done by Lens. */
export declare function shapeOf(v: string): string;
export declare function groupShapes(values: string[]): {
    shape: string;
    count: number;
    examples: string[];
}[];
/** Where a span-metrics label lives on the span (OTTL path, span context). Other labels: datapoint attribute. */
export declare function ottlTarget(label: string): {
    context: 'span' | 'datapoint';
    path: string;
};
/** Lens's own normalisation for well-known shapes. JS regexes are the RE2-compatible ones written into the OTTL. */
export declare function builtinFix(label: string, values: string[]): {
    kind: 'graphql' | 'url';
    title: string;
    what: string;
    patterns: {
        regex: string;
        replacement: string;
    }[];
    statements: string[];
    context: 'span' | 'datapoint';
} | null;
/** Span metrics found by the span_name label, not by assuming calls_total. */
export declare function resolveSpanMetrics(ctx: AnalyzerContext): Promise<{
    calls?: string;
    histogram?: string;
    all: string[];
}>;
/** Per-label analysis: Lens shows the evidence, Claude proposes, Lens tests the change on every real value. */
export declare function investigateLabels(ctx: AnalyzerContext, inv: LabelInventory): Promise<{
    findings: Finding[];
    notes: string[];
}>;
