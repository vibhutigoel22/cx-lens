export interface ValidationResult {
    yamlOk: boolean;
    yamlErrors: string[];
    collector?: {
        binary: string;
        ok: boolean;
        output: string;
    } | {
        skipped: string;
    };
}
export declare function findBinary(names?: string[]): string | null;
export declare function validateConfig(text: string, format: string): ValidationResult;
