import type { Finding, SignalType, Tier, UsageDay, UsageStats } from '../types.js';
/** Units per GB using ONLY the official per-pillar, per-tier table (rules/units.yaml). */
export declare function unitsPerGb(pillar: SignalType, tier?: Tier): number;
export declare function gbToUnits(gb: number, pillar: SignalType, tier?: Tier): number;
/**
 * The last `n` COMPLETE days of usage. The day the usage was read on is still in progress, so it is left out
 * (including it pulled the 7-day average down by roughly a seventh of a day).
 */
export declare function completeDays(usage: UsageStats | null, n?: number): UsageDay[];
/** Blended rate from the customer's own usage (Coralogix computes those units from the same official table). */
export declare function effectiveRate(usage: UsageStats | null, pillar: SignalType): {
    rate: number;
    basis: string;
};
export declare function pillarDailyGb(usage: UsageStats | null, pillar: SignalType): number | null;
export declare function pillarTierDaily(usage: UsageStats | null, pillar: SignalType): Record<string, {
    gb: number;
    units: number;
}>;
export declare function baselineUnitsPerDay(usage: UsageStats | null): number | null;
export interface OverlapGroup {
    ids: string[];
    note: string;
    maxUnits: number;
    naiveSum: number;
}
/** Overlap groups = connected components over overlapsWith, restricted to findings present. */
export declare function overlapGroups(findings: Finding[]): OverlapGroup[];
/** Combined savings without double counting. Each overlap group contributes its max; others add. Capped at baseline. */
export declare function combinedSavings(findings: Finding[], baseline: number | null): {
    total: number;
    groups: OverlapGroup[];
};
export declare const fmtUnits: (u: number | null | undefined) => string;
export declare const fmtGb: (g: number | null | undefined) => string;
