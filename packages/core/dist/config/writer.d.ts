import type { Finding, SignalType } from '../types.js';
import { ParsedConfig } from './parse.js';
export interface WriteResult {
    text: string;
    applied: {
        findingId: string;
        summary: string;
    }[];
    skipped: {
        findingId: string;
        reason: string;
    }[];
    protectedRemoved: string[];
    notes: string[];
    draft: boolean;
}
/**
 * Apply findings' config changes. Only Verified findings are applied unless allowDraft is set,
 * in which case the output carries a DRAFT watermark.
 */
export declare function writeConfig(parsed: ParsedConfig, findings: Finding[], opts?: {
    allowDraft?: boolean;
    deployment?: 'helm' | 'collector';
}): WriteResult;
export declare function reparse(text: string): ParsedConfig;
export type { SignalType };
