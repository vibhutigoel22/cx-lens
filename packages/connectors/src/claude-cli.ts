import { mkdtempSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { SkillRunner } from '@cx-lens/core';
import { run, which } from './exec.js';

/** Headless claude CLI: `claude -p <prompt> --output-format json`. Inputs are masked by the caller. */
export class ClaudeCliAdapter implements SkillRunner {
  readonly id = 'claude-cli';
  constructor(private bin = 'claude') {}
  available() { return !!which(this.bin); }
  async healthCheck() { if (!this.available()) return { ok: false, detail: 'claude CLI not found. Install Claude Code to enable AI review and skill plugins.' }; const r = await run(this.bin, ['--version']); return { ok: r.code === 0, detail: r.stdout.trim() }; }
  /**
   * Headless call. The prompt goes in on stdin (no argv size limits), tools are switched off so Claude can only read
   * what Lens sends and reply, nothing is saved as a session, and an optional JSON Schema enforces the answer shape.
   */
  async ask(prompt: string, extra: string[] = [], schema?: object): Promise<{ text: string; json?: unknown } | null> {
    if (!this.available()) return null;
    const args = ['-p', '--output-format', 'json', '--tools', '', '--no-session-persistence', ...(schema ? ['--json-schema', JSON.stringify(schema)] : []), ...extra];
    const r = await run(this.bin, args, { input: prompt, timeoutMs: 600000 });
    // Errors come back as JSON on stdout ({ is_error: true, result: "Not logged in · Please run /login" }), even with a non-zero exit.
    let j: any; try { j = JSON.parse(r.stdout); } catch { if (r.code !== 0) throw new Error(`claude CLI failed: ${(r.stderr || r.stdout).trim().slice(0, 200)}`); return { text: r.stdout }; }
    if (j.is_error || r.code !== 0) throw new Error(String(j.result ?? j.error ?? 'claude CLI returned an error').slice(0, 200));
    return { text: String(j.result ?? ''), json: j.structured_output ?? undefined };
  }
  /** Prerequisite check: is claude installed, signed in, and answering? Costs one tiny request. */
  async selfTest(): Promise<{ ok: boolean; detail: string }> {
    if (!this.available()) return { ok: false, detail: 'claude CLI not found on PATH. Install Claude Code and sign in.' };
    try { const r = await this.ask('Reply with the single word READY.'); return /READY/i.test(r?.text ?? '') ? { ok: true, detail: 'Signed in and answering' } : { ok: false, detail: `Unexpected reply: ${(r?.text ?? '').slice(0, 80)}` }; }
    catch (e) { const m = String((e as Error).message); return { ok: false, detail: /log ?in|auth|sign|api key|credential/i.test(m) ? 'Installed, but not signed in. Run claude once in Terminal and sign in.' : `claude CLI did not answer: ${m}` }; }
  }
  /** Unpack a .skill package (zip) and run it with its SKILL.md appended to the system prompt. */
  async runSkill(skillPath: string, prompt: string) {
    let dir = skillPath;
    if (skillPath.endsWith('.skill') || skillPath.endsWith('.zip')) { dir = mkdtempSync(join(tmpdir(), 'cxlens-skill-')); const u = await run('unzip', ['-q', '-o', skillPath, '-d', dir]); if (u.code !== 0) return null; }
    const find = (d: string): string | null => { for (const f of readdirSync(d, { withFileTypes: true })) { const p = join(d, f.name); if (f.isFile() && f.name === 'SKILL.md') return p; if (f.isDirectory()) { const x = find(p); if (x) return x; } } return null; };
    const md = existsSync(dir) ? find(dir) : null; if (!md) return null;
    return this.ask(prompt, ['--append-system-prompt', readFileSync(md, 'utf8')]);
  }
}
