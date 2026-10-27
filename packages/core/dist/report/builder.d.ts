import type { Assessment } from '../engine.js';
import type { Finding, SourceRef } from '../types.js';
import { pillarDailyGb } from '../units/calculator.js';
import type { UpgradeResult } from '../versions/upgrader.js';
export declare const REPORT_SCHEMA_VERSION = "1.0.0";
export type Audience = 'internal' | 'customer';
export interface Report {
    schemaVersion: string;
    product: string;
    audience: Audience;
    draft: boolean;
    unitUsd: number;
    /** One-slide leadership summary. Built from the same overlap-safe totals as the rest of the report. */
    leadership: {
        audience: string;
        baseline: number | null;
        saving: number;
        after: number | null;
        pct: number | null;
        perMonth: number;
        perYear: number;
        quickWinShare: number | null;
        pillars: {
            pillar: 'logs' | 'traces' | 'metrics';
            units: number;
            saving: number;
        }[];
        pipelineWide: number;
        top: {
            title: string;
            unitsPerDay: number;
        }[];
        nextPrize?: {
            pillar: string;
            share: number;
            savedShare: number;
            driver?: {
                label: string;
                unique: number;
                share?: number;
            };
        };
        baselineFrom?: string;
        baselineTo?: string;
    };
    /** Metric labels ranked by usage, with the kind Lens assigned (high-cardinality, churn, constant). */
    labels: {
        source: 'usage-api' | 'promql';
        date?: string;
        rows: {
            name: string;
            unique: number;
            metricCount?: number;
            series?: number;
            units?: number;
            fraction?: number;
            kind: string;
            locked?: string;
            fix?: {
                text: string;
                findingId?: string;
            };
        }[];
    } | null;
    /** One row per deployment type (several when the customer runs EKS, ECS and EC2 together). */
    deploymentRows: {
        deployment: string;
        label: string;
        config: string;
        helmChart?: {
            current?: string;
            latest?: string;
        };
        collector?: {
            current?: string;
            latest?: string;
        };
    }[];
    /** Upgrades per deployment type. */
    upgrades: {
        deployment: string;
        label: string;
        changes: UpgradeResult['changes'];
        from: UpgradeResult['from'];
        to: UpgradeResult['to'];
        denylistRecheck: string[];
    }[];
    /** Share of log and span volume per deployment type (from cloud.platform), when several types are selected. */
    platformSplit?: {
        pillar: string;
        deployment: string;
        share: number;
    }[];
    /** Checks that found no data or were skipped, in plain words. */
    checkNotes: string[];
    /** Time windows the numbers are based on. */
    analysis: {
        windowHours: number;
        dupWindowMinutes: number;
        range?: {
            start: string;
            end: string;
        };
        usageDays: number;
        usageFrom?: string;
        usageTo?: string;
        partialDayExcluded: boolean;
    };
    header: {
        date: string;
        customer: string;
        environment: string;
        preparedBy: string;
    };
    intro: string;
    summary: {
        currentUnitsPerDay: number | null;
        identifiedUnitsPerDay: number;
        identifiedPct: number | null;
        phase1: {
            count: number;
            unitsPerDay: number;
        };
        pendingScoping: number;
    };
    roadmap: {
        phase: 1 | 2 | 3;
        name: string;
        goal: string;
        timeframe: string;
        effort: string;
        cumulativeUnitsPerDay: number;
        findingIds: string[];
    }[];
    versionStatus: {
        helmChart?: {
            current?: string;
            latest?: string;
        };
        collector?: {
            current?: string;
            latest?: string;
        };
        checkedAt?: string;
        breakingFound: number;
        autoFixed: number;
        manual: number;
        assumedLatest: boolean;
    } | null;
    findings: (Finding & {
        rank: number;
        overlapsWithIds: string[];
    })[];
    overlaps: {
        ids: string[];
        note: string;
    }[];
    combined: {
        largest: {
            id: string;
            title: string;
            unitsPerDay: number;
        } | null;
        phase1: number;
        realistic: number;
        realisticPct: number | null;
        disclaimer: string;
    };
    trend: {
        date: string;
        total: number;
        logs: number;
        traces: number;
        metrics: number;
    }[];
    upgrade: (Pick<UpgradeResult, 'changes' | 'from' | 'to' | 'denylistRecheck'> & {
        steps: string[];
    }) | null;
    gaps: Assessment['gaps'];
    headroom: string;
    nextSteps: {
        owner: string;
        action: string;
        byWhen: string;
    }[];
    eligibility: string[];
    internal?: {
        connector: string;
        startedAt: string;
        finishedAt: string;
        skipped: Assessment['skipped'];
        rulesVersion: string;
        configLabel: string;
        configNotes: string[];
        sources: SourceRef[];
    };
}
export declare function buildReport(a: Assessment, opts?: {
    audience?: Audience;
    upgrade?: UpgradeResult | null;
    upgrades?: (UpgradeResult & {
        deployment: string;
    })[];
    includeUnverified?: boolean;
    latestCheckedAt?: string;
    draft?: boolean;
}): Report;
export { pillarDailyGb };
/** Human wording for a window in hours: "24 hours", "7 days". */
export declare const windowText: (h: number) => string;
/** "24 Oct 2026, 23:00 UTC" */
export declare const utcText: (iso: string) => string;
/** Short description of the data window: "the last 24 hours" or "24 Oct 2026, 23:00 UTC to 25 Oct 2026, 03:00 UTC (4 hours)". */
export declare const windowPhrase: (a: {
    windowHours: number;
    range?: {
        start: string;
        end: string;
    };
}) => string;
/** One sentence describing what data the numbers are based on. */
export declare function analysisSentence(r: Report): string;
