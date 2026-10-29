/**
 * Saved Metric Usage API keys. The keys live in the macOS Keychain (account "metric-usage:<id>"); this index only
 * holds their names and which team uses which, so the app can offer a dropdown instead of asking again.
 */
export interface UsageKeyEntry {
    id: string;
    label: string;
    createdAt: string;
}
export declare function listUsageKeys(team?: string): {
    keys: {
        teams: string[];
        id: string;
        label: string;
        createdAt: string;
    }[];
    selected: string | null;
};
export declare function addUsageKey(label: string, secret: string, team?: string): Promise<UsageKeyEntry>;
export declare function selectUsageKey(team: string, id: string | null): void;
export declare function removeUsageKey(id: string): Promise<void>;
/** Key for a team: CXLENS_USAGE_KEY, else the key chosen for the team, else the older per-team Keychain entry. */
export declare function resolveUsageKey(team: string): Promise<string | null>;
