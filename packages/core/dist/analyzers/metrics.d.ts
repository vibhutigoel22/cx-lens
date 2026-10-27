import type { Catalogue } from '../rules/catalogue.js';
import { AnalyzerPlugin, AnalyzerContext } from './base.js';
/** Built-in re-implementation of the playbook's Metrics Label Analyzer script. */
export declare function labelAnalysis(ctx: AnalyzerContext): Promise<any>;
export declare function metricsPlugins(cat: Catalogue): AnalyzerPlugin[];
