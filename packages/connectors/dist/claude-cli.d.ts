import type { SkillRunner } from '@cx-lens/core';
/** Headless claude CLI: `claude -p <prompt> --output-format json`. Inputs are masked by the caller. */
export declare class ClaudeCliAdapter implements SkillRunner {
    private bin;
    readonly id = "claude-cli";
    constructor(bin?: string);
    available(): boolean;
    healthCheck(): Promise<{
        ok: boolean;
        detail: string;
    }>;
    /**
     * Headless call. The prompt goes in on stdin (no argv size limits), tools are switched off so Claude can only read
     * what Lens sends and reply, nothing is saved as a session, and an optional JSON Schema enforces the answer shape.
     */
    ask(prompt: string, extra?: string[], schema?: object): Promise<{
        text: string;
        json?: unknown;
    } | null>;
    /** Prerequisite check: is claude installed, signed in, and answering? Costs one tiny request. */
    selfTest(): Promise<{
        ok: boolean;
        detail: string;
    }>;
    /** Unpack a .skill package (zip) and run it with its SKILL.md appended to the system prompt. */
    runSkill(skillPath: string, prompt: string): Promise<{
        text: string;
        json?: unknown;
    } | null>;
}
