import type { Catalogue } from '../rules/catalogue.js';
import { AnalyzerPlugin, AnalyzerContext } from './base.js';
/** filter processor syntax depends on collector version (legacy traces.span deprecated in 0.146.0). */
export declare function useConditionsSyntax(ctx: AnalyzerContext): boolean;
export declare function tracesPlugins(cat: Catalogue): AnalyzerPlugin[];
