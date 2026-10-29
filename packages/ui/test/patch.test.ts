import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { diffLines } from '../../core/src/config/diff';
import { unifiedPatch, afterText } from '../src/patch';

const before = readFileSync(new URL('../../../fixtures/configs/helm-values-old.yaml', import.meta.url), 'utf8');
const edit = (t: string) => { const l = t.split('\n'); l.splice(3, 1, '  # changed by test', l[3]); l.splice(10, 0, 'added: true'); l.splice(l.length - 3, 1); return l.join('\n'); };

describe('config diff export', () => {
  it('writes a patch that git apply accepts and that reproduces the new config', () => {
    const after = edit(before); const rows = diffLines(before, after) as any;
    expect(afterText(rows)).toBe(after);
    const d = mkdtempSync(join(tmpdir(), 'patch-')); mkdirSync(join(d, 'cfg'));
    writeFileSync(join(d, 'cfg', 'values.yaml'), before); writeFileSync(join(d, 'x.diff'), unifiedPatch(rows, 'cfg/values.yaml'));
    execFileSync('git', ['init', '-q'], { cwd: d }); execFileSync('git', ['apply', '--check', 'x.diff'], { cwd: d }); execFileSync('git', ['apply', 'x.diff'], { cwd: d });
    expect(readFileSync(join(d, 'cfg', 'values.yaml'), 'utf8')).toBe(after);
  });
  it('splits distant changes into separate hunks that still apply', () => {
    const src = readFileSync(new URL('../../../fixtures/configs/ecs-collector-0.98.yaml', import.meta.url), 'utf8');
    const l = src.split('\n'); l.splice(1, 0, '# top'); l.splice(40, 1); const after = l.join('\n');
    const patch = unifiedPatch(diffLines(src, after) as any, 'ecs.yaml'); expect(patch.match(/^@@/gm)?.length).toBe(2);
    const d = mkdtempSync(join(tmpdir(), 'patch2-')); writeFileSync(join(d, 'ecs.yaml'), src); writeFileSync(join(d, 'x.diff'), patch);
    execFileSync('git', ['init', '-q'], { cwd: d }); execFileSync('git', ['apply', 'x.diff'], { cwd: d });
    expect(readFileSync(join(d, 'ecs.yaml'), 'utf8')).toBe(after);
  });
  it('is empty when nothing changed', () => { expect(unifiedPatch(diffLines(before, before) as any, 'v.yaml')).toBe(''); });
});
