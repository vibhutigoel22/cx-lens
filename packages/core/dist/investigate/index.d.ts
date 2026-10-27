import type { AnalyzerContext } from '../analyzers/base.js';
import type { Finding } from '../types.js';
export interface InvestigateOptions {
    enabled: boolean;
    maxContributors: number;
}
export declare const DEFAULT_INVESTIGATE: InvestigateOptions;
export interface AIContributor {
    key: string;
    title: string;
    what_it_is: string;
    value: 'high' | 'medium' | 'low';
    signals?: string[];
    action: string;
    why_it_matters: string;
    dataprime_filter: string;
    ottl_condition?: string;
    ottl_statements?: string[];
    regex?: string;
    replacement?: string;
    truncate_to?: number;
    sample_percent?: number;
    tier?: 'medium' | 'low';
    attribute?: string;
    source_fix?: string;
    next_step: string;
    verify_questions: string[];
    confidence: 'high' | 'medium' | 'low';
}
/** Text of a log record. OTel logs have a body; logs shipped as plain JSON have none: the record itself is the log. */
export declare function recordText(u: any): string;
/** Lens's own checks on what Claude wrote. Returns problems; empty = passed. */
export declare function lintSuggestion(c: AIContributor, pillar: 'logs' | 'traces'): string[];
/** Investigate mode: data-driven findings with live samples, validated by Lens. */
export declare function investigate(ctx: AnalyzerContext, opts: InvestigateOptions): Promise<{
    findings: Finding[];
    notes: string[];
    prompt?: string;
}>;
