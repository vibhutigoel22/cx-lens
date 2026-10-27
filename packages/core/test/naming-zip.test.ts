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
  it('produces a valid zip that unzip can read, with UTF-8 names', () => {
    const z = createZip({ 'Demo Retail/Demo Retail.html': '<h1>ok</h1>', 'Demo Retail/notes ü.md': 'x'.repeat(5000) });
    const d = mkdtempSync(join(tmpdir(), 'z-')); const f = join(d, 'a.zip'); writeFileSync(f, z);
    const list = execFileSync('unzip', ['-l', f], { encoding: 'utf8' });
    expect(list).toContain('Demo Retail/Demo Retail.html'); expect(list).toContain('notes ü.md');
    execFileSync('unzip', ['-q', '-o', f, '-d', d]); expect(readFileSync(join(d, 'Demo Retail/Demo Retail.html'), 'utf8')).toBe('<h1>ok</h1>');
    expect(execFileSync('unzip', ['-t', f], { encoding: 'utf8' })).toMatch(/No errors detected/);
  });
});
