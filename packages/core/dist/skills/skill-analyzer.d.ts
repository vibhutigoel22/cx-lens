import type { AnalyzerPlugin } from '../analyzers/base.js';
import type { Pillar } from '../types.js';
/** Runs a TAM-built Claude Skill (.skill package) and maps its output to standard findings. */
export interface SkillRunner {
    runSkill(skillPath: string, prompt: string): Promise<{
        text: string;
    } | null>;
}
export interface SkillManifest {
    id: string;
    path: string;
    pillar: Pillar;
    title: string;
    prompt?: string;
}
export declare function skillAnalyzer(m: SkillManifest, runner: SkillRunner): AnalyzerPlugin;
