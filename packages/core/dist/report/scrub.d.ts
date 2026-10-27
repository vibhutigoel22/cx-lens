import type { Report } from './builder.js';
export interface ScrubIssue {
    kind: string;
    match: string;
    where: string;
}
/** Find anything that must not reach a customer. */
export declare function checkCustomerSafe(text: string, internalTerms?: string[]): ScrubIssue[];
/** Redact what can be redacted automatically (links, IDs, keys, internal terms). */
export declare function scrubText(text: string, internalTerms?: string[]): string;
export declare function scrubReport(r: Report, internalTerms?: string[]): Report;
