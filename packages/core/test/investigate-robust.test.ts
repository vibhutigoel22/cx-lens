import { describe, it, expect } from 'vitest';
import { runAssessment, recordText, maskText } from '../src/index.js';
import { demo, customer } from './helpers.js';

describe('Investigate copes with real-world records', () => {
  it('uses the record itself when a log has no body (plain-JSON logs)', () => {
    expect(recordText({ body: 'hello' })).toBe('hello');
    expect(recordText({ body: { msg: 'x' } })).toBe('{"msg":"x"}');
    expect(recordText({ message: 'plain json log', level: 'info', resource: { attributes: {} }, timeUnixNano: '1' })).toBe('{"message":"plain json log","level":"info"}');
    expect(recordText(undefined)).toBe(''); expect(maskText(undefined as any).masked).toBe('');
  });
  it('a body-less sample or a failing pattern no longer stops Investigate; the run completes', async () => {
    const c = demo(); const q0 = c.runQuery.bind(c); let n = 0;
    (c as any).runQuery = async (q: any) => {
      const r = await q0(q);
      if (q.id === 'INV-LOGS/samples') { n++; if (n === 2) throw new Error('simulated cx failure'); return { ...r, rows: (r.rows ?? []).map((x: any) => ({ ...x, userData: { message: 'no body here', level: 'info' } })) }; }
      return r;
    };
    const events: any[] = [];
    const a = await runAssessment({ connector: c, customer, pillars: ['universal', 'logs', 'traces', 'metrics'], deployment: 'helm', options: { investigate: { enabled: true, maxContributors: 8 } }, onProgress: (e) => events.push(e) });
    expect(events.filter((e) => e.checkId === 'INVESTIGATE').at(-1).status).toBe('done');
    expect(events.some((e) => e.checkId === 'INVESTIGATE' && e.status === 'failed')).toBe(false); // a failed query becomes an empty sample, not a crash
    expect(events.filter((e) => e.checkId === 'FINISHING').at(-1).status).toBe('done');
    expect(a.findings.length).toBeGreaterThan(0);
  });
});
