import { AnalyzerContext } from './base.js';
/** Average billed bytes per log record = usage GB/day ÷ log count/day (both measured, no assumptions). */
export declare function logBaseline(ctx: AnalyzerContext): Promise<{
    count: number;
    bodyBytes: number;
    gbPerDay: number | null;
    bytesPerLog: number | null;
    ev: any;
}>;
export declare function spanBaseline(ctx: AnalyzerContext): Promise<{
    count: number;
    gbPerDay: number | null;
    bytesPerSpan: number | null;
    ev: any;
    kinds: Record<string, number>;
}>;
export declare const isCritical: (ctx: AnalyzerContext, svc: string) => boolean;
