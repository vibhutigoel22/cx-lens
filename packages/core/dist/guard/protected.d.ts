import { Document } from 'yaml';
export interface ProtectedViolation {
    key: string;
    location: string;
    how: 'denylist' | 'delete_key' | 'attributes-delete' | 'keep_keys-omits' | 'delete_matching_keys';
}
export declare function isProtectedLabel(key: string): boolean;
export declare function protectedList(): string[];
export declare class ProtectedLabelError extends Error {
    keys: string[];
    constructor(msg: string, keys: string[]);
}
/** Throws if any value in `keys` is protected. Used by every config-writer path. */
export declare function assertNotProtected(keys: string[], context: string): void;
/** Find every way a config removes a protected label. Works on Helm values and plain collector configs. */
export declare function scanForProtectedRemovals(doc: Document | string): ProtectedViolation[];
/** Remove protected labels from every denylist in the document, leaving a comment. Returns removed keys. */
export declare function stripProtectedFromDenylists(doc: Document): string[];
/** Remove existing delete_key statements and attributes/resource delete actions that target protected labels. */
export declare function stripProtectedRemovals(doc: Document): string[];
/** Final gate on any generated output. Throws if the output still removes a protected label.
 *  `preexisting` lets un-fixable patterns already in the customer's config (keep_keys / regex deletes) pass;
 *  they are reported as a high-priority finding instead. */
export declare function guardOutput(yamlText: string, preexisting?: ProtectedViolation[]): void;
