export declare const toolPath: () => string;
export interface ExecResult {
    code: number;
    stdout: string;
    stderr: string;
    ms: number;
}
export declare function which(bin: string): string | null;
export declare function run(bin: string, args: string[], opts?: {
    env?: Record<string, string>;
    timeoutMs?: number;
    input?: string;
}): Promise<ExecResult>;
/** cx prints progress lines before the JSON; take from the first line that starts JSON. */
export declare function extractJson(s: string): unknown;
/** Never let secrets reach logs or errors. */
export declare const redactSecrets: (s: string) => string;
