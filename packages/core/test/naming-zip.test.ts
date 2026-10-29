import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { reportBaseName, reportFileNames, createZip, runAssessment, produceOutputs } from '../src/index.js';
import { demo, customer } from './helpers.js';

describe('report names follow the customer', () => {
  it('uses the customer name, safely', () => {
    expect(reportBaseName('Demo Retail')).toBe('Demo Retail');
    expect(reportBaseName('ACME / EU: prod*')).toBe('ACME EU prod');
    expect(reportBaseName('..hidden')).toBe('hidden');
    expect(reportBaseName('')).toBe('Coralogix Lens report');
    expect(reportFileNames('Demo Retail', true)).toMatchObject({ customerHtml: 'Demo Retail (draft).html', internalHtml: 'Demo Retail (internal, draft).html' });
  });
  it('draft exports watermark every report, internal included', async () => {
    const a = await runAssessment({ connector: demo(), customer: { ...customer, name: 'Demo Retail' }, pillars: ['universal', 'traces'], deployment: 'helm' });
    const o = await produceOutputs(a, { allowDraft: true, offline: true });
    expect(o.files['Demo Retail (draft).html']).toMatch(/class="draft"/);
    expect(o.files['Demo Retail (internal, draft).html']).toMatch(/class="draft"/);
    expect(JSON.parse(o.files['Demo Retail (draft).json']).draft).toBe(true);
  });
});
describe('zip writer', () => {
  /** Reads entry names and flags straight from the central directory, so the check does not depend on how a
   *  platform's `unzip -l` prints non-ASCII names (Debian and macOS builds both show "ü" as "+" or CP437). */
  const centralEntries = (z: Buffer) => {
    const eocd = z.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06])); // end of central directory record
    const count = z.readUInt16LE(eocd + 10); let i = z.readUInt32LE(eocd + 16); // entries, central directory offset
    const out: { name: string; flags: number }[] = [];
    for (let k = 0; k < count; k++) {
      expect(z.readUInt32LE(i)).toBe(0x02014b50);
      const flags = z.readUInt16LE(i + 8), n = z.readUInt16LE(i + 28), x = z.readUInt16LE(i + 30), c = z.readUInt16LE(i + 32);
      out.push({ name: z.subarray(i + 46, i + 46 + n).toString('utf8'), flags }); i += 46 + n + x + c;
    }
    return out;
  };
  it('produces a valid zip that unzip can read, with UTF-8 names', () => {
    const z = createZip({ 'Demo Retail/Demo Retail.html': '<h1>ok</h1>', 'Demo Retail/notes ü.md': 'x'.repeat(5000) });
    // Names are stored as UTF-8 and flagged as such (general purpose bit 11), which Finder, 7-Zip and Windows honour.
    const entries = centralEntries(Buffer.from(z));
    expect(entries.map((e) => e.name)).toEqual(['Demo Retail/Demo Retail.html', 'Demo Retail/notes ü.md']);
    for (const e of entries) expect(e.flags & 0x0800).toBe(0x0800);
    // The system unzip accepts the archive and extracts it intact.
    const d = mkdtempSync(join(tmpdir(), 'z-')); const f = join(d, 'a.zip'); writeFileSync(f, z);
    const list = execFileSync('unzip', ['-l', f], { encoding: 'utf8' });
    expect(list).toContain('Demo Retail/Demo Retail.html'); expect(list).toMatch(/2 files/);
    execFileSync('unzip', ['-q', '-o', f, '-d', d]); expect(readFileSync(join(d, 'Demo Retail/Demo Retail.html'), 'utf8')).toBe('<h1>ok</h1>');
    expect(execFileSync('unzip', ['-t', f], { encoding: 'utf8' })).toMatch(/No errors detected/);
  });
});
