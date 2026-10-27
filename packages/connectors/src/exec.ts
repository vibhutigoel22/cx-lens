import { spawn, spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import { delimiter } from 'node:path';

/**
 * A Mac app opened from Finder gets a minimal PATH (/usr/bin:/bin:/usr/sbin:/sbin), so tools installed with Homebrew,
 * npm or by hand would look missing. Add the usual install locations; the user's own PATH always comes first.
 */
const EXTRA_PATHS = ['/opt/homebrew/bin', '/usr/local/bin', `${homedir()}/.local/bin`, `${homedir()}/bin`, `${homedir()}/.npm-global/bin`, `${homedir()}/.claude/local`];
export const toolPath = () => [...new Set([...(process.env.PATH ?? '').split(delimiter), ...EXTRA_PATHS].filter(Boolean))].join(delimiter);
process.env.PATH = toolPath();
export interface ExecResult { code: number; stdout: string; stderr: string; ms: number }
export function which(bin: string): string | null { const r = spawnSync('/usr/bin/env', ['which', bin], { encoding: 'utf8', env: { ...process.env, PATH: toolPath() } }); return r.status === 0 ? r.stdout.trim() : null; }
export function run(bin: string, args: string[], opts: { env?: Record<string, string>; timeoutMs?: number; input?: string } = {}): Promise<ExecResult> {
  const t0 = Date.now();
  return new Promise((resolve) => {
    const p = spawn(bin, args, { env: { ...process.env, ...opts.env }, stdio: ['pipe', 'pipe', 'pipe'] });
    let out = '', err = ''; const timer = setTimeout(() => p.kill('SIGTERM'), opts.timeoutMs ?? 120000);
    p.stdout.on('data', (d) => (out += d)); p.stderr.on('data', (d) => (err += d));
    p.on('close', (code) => { clearTimeout(timer); resolve({ code: code ?? -1, stdout: out, stderr: err, ms: Date.now() - t0 }); });
    p.on('error', (e) => { clearTimeout(timer); resolve({ code: -1, stdout: out, stderr: String(e), ms: Date.now() - t0 }); });
    if (opts.input) p.stdin.end(opts.input); else p.stdin.end();
  });
}
/** cx prints progress lines before the JSON; take from the first line that starts JSON. */
export function extractJson(s: string): unknown {
  const lines = s.split('\n'); const i = lines.findIndex((l) => /^\s*[\[{]/.test(l));
  if (i < 0) throw new Error('No JSON in output');
  return JSON.parse(lines.slice(i).join('\n'));
}
/** Never let secrets reach logs or errors. */
export const redactSecrets = (s: string) => s.replace(/\bcx[a-z]{1,3}_[A-Za-z0-9]{16,}\b/g, 'cx***').replace(/(Bearer\s+)\S+/g, '$1***');
