import { describe, it, expect } from 'vitest';
import { runAssessment } from '../src/index.js';
import { demo, customer } from './helpers.js';
describe('Investigate sends contributors in small groups', () => {
  it('a failed group only skips its own contributors; answers about other contributors are ignored', async () => {
    const c = demo(); const a0 = c.askAI!; let calls = 0; const seen: string[] = [];
    (c as any).askAI = async (p: string, s: string, o: any) => { if (!p.includes('### log:') && !p.includes('### span:')) return a0(p, s, o); calls++; seen.push(o?.model ?? ''); if (calls === 1) throw new Error('simulated timeout'); return a0(p, s, o); };
    const a = await runAssessment({ connector: c, customer, pillars: ['universal', 'logs', 'traces'], deployment: 'helm', options: { investigate: { enabled: true, maxContributors: 8, model: 'sonnet' } } });
    expect(calls).toBeGreaterThan(2); expect(seen.every((m) => m === 'sonnet')).toBe(true);
    expect(a.notes.join(' ')).toMatch(/Claude didn’t analyse log patterns 1–3 of \d+: simulated timeout/);
    const inv = a.findings.filter((f) => f.source === 'investigate'); expect(new Set(inv.map((f) => f.ruleId)).size).toBe(inv.length);
  });
});
