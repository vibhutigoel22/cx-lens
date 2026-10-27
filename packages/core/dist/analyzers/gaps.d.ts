import type { AdoptionGap } from '../types.js';
import type { AnalyzerContext } from './base.js';
import { num } from './base.js';
/** Adoption gaps and expansion opportunities (not savings). */
export declare function detectGaps(ctx: AnalyzerContext): Promise<AdoptionGap[]>;
export { num };
