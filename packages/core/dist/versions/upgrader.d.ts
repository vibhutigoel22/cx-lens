import { isScalar } from 'yaml';
import { ParsedConfig, parseConfig } from '../config/parse.js';
export interface BreakingChange {
    version: string;
    component: string;
    what: string;
    before?: string;
    after?: string;
    status: 'Auto-fixed' | 'Manual action needed' | 'Not applicable';
    source: string;
    explanation?: string;
}
export interface UpgradeResult {
    text: string;
    changes: BreakingChange[];
    from: {
        chart?: string;
        collector?: string;
    };
    to: {
        chart?: string;
        collector?: string;
    };
    denylistRecheck: string[];
}
/** Parse "## vX.Y.Z" sections and their 🛑 Breaking changes items. */
export declare function parseChangelogBreaking(md: string, kind: 'contrib' | 'core'): {
    version: string;
    component: string;
    text: string;
}[];
/** Chart CHANGELOG: "### vX" sections; keep lines marked Breaking / Note for upgraders. */
export declare function parseChartChangelog(md: string): {
    version: string;
    text: string;
}[];
export declare function upgradeConfig(parsed: ParsedConfig, opts: {
    fromCollector?: string;
    toCollector: string;
    fromChart?: string;
    toChart?: string;
    contribMd?: string;
    coreMd?: string;
    chartMd?: string;
    chartReadme?: string;
}): UpgradeResult;
export declare function breakingChangesMarkdown(u: UpgradeResult): string;
export { parseConfig, isScalar };
