import { describe, it, expect } from 'vitest';
import { labelValuesExpr, seriesExpr, CxCliAdapter } from '../src/cx-cli.js';
import { CompositeConnector } from '../src/composite.js';

describe('metrics through cx (PromQL)', () => {
  it('builds window-aware PromQL equivalent to /label/values and /series', () => {
    expect(labelValuesExpr('service_name', '24h', 'calls_total')).toBe('count by (service_name) (count_over_time(calls_total{}[24h]))');
    expect(seriesExpr({ metric: 'calls_total', match: { service_name: 'front"end' }, window: '24h' })).toBe('count_over_time(calls_total{service_name="front\\"end"}[24h])');
  });
  it('maps cx JSON rows to label values and series', async () => {
    const a = new CxCliAdapter({ name: 't', region: 'ap1', profile: 't' });
    (a as any).promql = async (e: string) => e.startsWith('count by') ? [{ metric: { service_name: 'b' }, value: [0, '1'] }, { metric: { service_name: 'a' }, value: [0, '2'] }] : [{ metric: { service_name: 'a', span_name: 'GET' }, value: [0, '5'] }];
    expect(await a.getLabelValues('service_name', '24h', 'calls_total')).toEqual(['a', 'b']);
    expect(await a.getMetricSeries({ metric: 'calls_total', match: { service_name: 'a' }, window: '24h' })).toEqual([{ __name__: 'calls_total', service_name: 'a', span_name: 'GET' }]);
  });
  it('uses cx first and the Metrics API only as an explicit-key fallback', async () => {
    const cx: any = { getLabelValues: async () => { throw new Error('cx failed'); }, getMetricSeries: async () => [{ x: '1' }], healthCheck: async () => ({ ok: true, detail: '', capabilities: [] }) };
    const api: any = { getLabelValues: async () => ['from-api'] };
    expect(await new CompositeConnector(cx, api).getLabelValues('service_name', '24h')).toEqual(['from-api']);
    expect(await new CompositeConnector(cx, api).getMetricSeries({ metric: 'm', window: '24h' })).toEqual([{ x: '1' }]);
    await expect(new CompositeConnector(cx).getLabelValues('service_name', '24h')).rejects.toThrow('cx failed');
  });
});
describe('exact ranges reach cx', () => {
  it('uses --start/--end for logs and spans, and --time for metrics', async () => {
    const a = new CxCliAdapter({ name: 't', region: 'ap1', profile: 't' }); const seen: string[][] = [];
    (a as any).cx = async (args: string[]) => { seen.push(args); return { json: [], ms: 1 }; };
    await a.runQuery({ id: 'x', language: 'dataprime', pillar: 'traces', text: 'limit 1', window: '240m', limit: 5, start: '2026-10-24T23:00:00.000Z', end: '2026-10-25T03:00:00.000Z' });
    expect(seen[0]).toEqual(['spans', 'limit 1', '--start', '2026-10-24T23:00:00.000Z', '--end', '2026-10-25T03:00:00.000Z', '--limit', '5']);
    await a.runQuery({ id: 'y', language: 'dataprime', pillar: 'logs', text: 'limit 1', window: '24h', limit: 5 });
    expect(seen[1]).toEqual(['logs', 'limit 1', '--start', 'now-24h', '--end', 'now', '--limit', '5']);
    await a.getLabelValues('service_name', '240m', 'calls_total', '2026-10-25T03:00:00.000Z');
    expect(seen[2]).toEqual(['metrics', 'query', 'count by (service_name) (count_over_time(calls_total{}[240m]))', '--time', '2026-10-25T03:00:00.000Z']);
  });
});
describe('claude CLI call', () => {
  it('sends the prompt on stdin with tools off, no session, and the JSON schema', async () => {
    const { mkdtempSync, writeFileSync, chmodSync } = await import('node:fs'); const { join } = await import('node:path'); const { tmpdir } = await import('node:os');
    const { ClaudeCliAdapter } = await import('../src/claude-cli.js');
    const d = mkdtempSync(join(tmpdir(), 'fake-claude-')); const bin = join(d, 'claude');
    writeFileSync(bin, `#!${process.execPath}\nlet s='';process.stdin.on('data',c=>s+=c).on('end',()=>console.log(JSON.stringify({result:JSON.stringify({argv:process.argv.slice(2),stdin:s}),structured_output:{ok:true}})));`); chmodSync(bin, 0o755);
    const a = new ClaudeCliAdapter(bin); (a as any).available = () => true;
    const r = await a.ask('hello prompt', [], { type: 'object' }); const seen = JSON.parse(r!.text);
    expect(seen.stdin).toBe('hello prompt');
    expect(seen.argv).toEqual(['-p', '--output-format', 'json', '--tools', '', '--no-session-persistence', '--json-schema', '{"type":"object"}']);
    expect(r!.json).toEqual({ ok: true });
  });
});
describe('tool discovery from a Finder-launched app', () => {
  it('adds the usual install locations to PATH without dropping the user’s own', async () => {
    const { toolPath } = await import('../src/exec.js'); const p = toolPath().split(':');
    expect(p).toContain('/opt/homebrew/bin'); expect(p).toContain('/usr/local/bin'); expect(p.indexOf('/usr/bin')).toBeGreaterThanOrEqual(0);
  });
});
