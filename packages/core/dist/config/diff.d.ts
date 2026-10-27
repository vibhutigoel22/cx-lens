/** Minimal LCS line diff producing unified-diff text and side-by-side rows. */
export interface DiffRow {
    kind: 'same' | 'add' | 'del';
    left?: string;
    right?: string;
    ln?: number;
    rn?: number;
}
export declare function diffLines(a: string, b: string): DiffRow[];
export declare function unifiedDiff(a: string, b: string, aName?: string, bName?: string, ctx?: number): string;
