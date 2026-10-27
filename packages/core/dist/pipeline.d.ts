import type { Assessment } from './engine.js';
import { UpgradeResult } from './versions/upgrader.js';
import { checkCustomerSafe } from './report/scrub.js';
export interface Outputs {
    files: Record<string, string>;
    warnings: string[];
    reportNames: ReturnType<typeof reportFileNames>;
    upgrade: UpgradeResult | null;
    customerIssues: ReturnType<typeof checkCustomerSafe>;
}
/** Produce every export: optimized/upgraded config, diffs, breaking changes, TCO drafts, report.json/md/html (internal + customer). */
/** Safe, readable file name from the customer name (used for every report file). */
export declare function reportBaseName(customer: string): string;
/** Report file names for a customer: "<Customer>.html", "<Customer> (internal).html", plus " (draft)" for draft exports. */
export declare function reportFileNames(customer: string, draft?: boolean): {
    customerHtml: string;
    customerMd: string;
    customerJson: string;
    internalHtml: string;
    internalMd: string;
    internalJson: string;
};
export declare function produceOutputs(a: Assessment, opts?: {
    allowDraft?: boolean;
    offline?: boolean;
}): Promise<Outputs>;
