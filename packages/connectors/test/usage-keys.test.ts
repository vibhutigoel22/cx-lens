import { describe, it, expect, beforeEach } from 'vitest';
import { rmSync, readFileSync } from 'node:fs';
describe('saved metric usage keys', () => {
  beforeEach(() => { process.env.CXLENS_HOME = '/tmp/cxlens-uk'; process.env.CXLENS_DEV_SECRET_FILE = '/tmp/cxlens-uk/secrets.json'; delete process.env.CXLENS_USAGE_KEY; delete process.env.CX_API_KEY; rmSync('/tmp/cxlens-uk', { recursive: true, force: true }); });
  it('saves a named key, keeps only its name in the index, and resolves it per team', async () => {
    const m = await import('../src/usage-keys.js');
    const e = await m.addUsageKey('CaratLane – DataAnalytics', 'secret-123', 'cs-sam');
    expect(m.listUsageKeys('cs-sam')).toMatchObject({ selected: e.id, keys: [{ label: 'CaratLane – DataAnalytics', teams: ['cs-sam'] }] });
    expect(readFileSync('/tmp/cxlens-uk/usage-keys.json', 'utf8')).not.toContain('secret-123');
    expect(await m.resolveUsageKey('cs-sam')).toBe('secret-123'); expect(await m.resolveUsageKey('other')).toBeNull();
    m.selectUsageKey('other', e.id); expect(await m.resolveUsageKey('other')).toBe('secret-123');
    await expect(m.addUsageKey('caratlane – dataanalytics', 'x')).rejects.toThrow(/already exists/);
    await m.removeUsageKey(e.id); expect(await m.resolveUsageKey('cs-sam')).toBeNull(); expect(m.listUsageKeys().keys).toHaveLength(0);
  });
});
