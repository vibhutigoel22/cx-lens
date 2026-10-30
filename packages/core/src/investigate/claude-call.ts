import type { AnalyzerContext } from '../analyzers/base.js';

const fmt = (ms: number) => { const s = Math.round(ms / 1000); return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`; };
/**
 * One Claude call with a live elapsed timer, the chosen model, its own time limit, and a plain-words error.
 * Returns the parsed JSON object, or throws an Error whose message says what happened.
 */
export async function askClaude(ctx: AnalyzerContext, what: string, prompt: string, schema: object, timeoutMs = 5 * 60_000): Promise<any> {
  if (!ctx.connector.askAI) throw new Error('the claude CLI is not available');
  const t0 = Date.now(); const model = ctx.opts.investigate?.model || undefined;
  const tick = () => ctx.progress({ checkId: 'INVESTIGATE', title: 'Investigate with Claude', status: 'running', message: `Claude is analysing ${what} · ${fmt(Date.now() - t0)}` });
  tick(); const timer = setInterval(tick, 10_000);
  try {
    const res = await ctx.connector.askAI(prompt, '', { schema, model, timeoutMs });
    if (!res) throw new Error('the claude CLI returned nothing');
    try { return res.json ?? JSON.parse(String(res.text ?? '').replace(/```json|```/g, '').trim()); }
    catch { throw new Error('Claude’s answer could not be read as JSON'); }
  } finally { clearInterval(timer); }
}
export const chunk = <T>(xs: T[], n: number): T[][] => { const out: T[][] = []; for (let i = 0; i < xs.length; i += n) out.push(xs.slice(i, i + n)); return out; };
