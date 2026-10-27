import type { Catalogue } from '../rules/catalogue.js';
import { AnalyzerPlugin, fmtCount } from './base.js';
import { HELM_COMPONENTS, pipelinesFor } from '../config/parse.js';
export declare function protectedSafeDenylist(cat: Catalogue): {
    metrics: string[];
    logs: string[];
    traces: string[];
};
export declare function universalPlugins(cat: Catalogue): AnalyzerPlugin[];
export { HELM_COMPONENTS, pipelinesFor, fmtCount };
