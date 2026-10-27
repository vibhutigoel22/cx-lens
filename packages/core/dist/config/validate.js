import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseDocument } from 'yaml';
export function findBinary(names = ['otelcol-contrib', 'otelcol']) {
    const home = process.env.HOME ?? '';
    const PATH = [process.env.PATH ?? '', '/opt/homebrew/bin', '/usr/local/bin', `${home}/.local/bin`, `${home}/bin`].join(':');
    for (const n of names) {
        const r = spawnSync('which', [n], { encoding: 'utf8', env: { ...process.env, PATH } });
        if (r.status === 0 && r.stdout.trim())
            return r.stdout.trim();
    }
    return null;
}
export function validateConfig(text, format) {
    const d = parseDocument(text);
    const res = { yamlOk: d.errors.length === 0, yamlErrors: d.errors.map((e) => e.message) };
    if (!res.yamlOk)
        return res;
    if (format !== 'collector') {
        res.collector = { skipped: 'Helm values are merged by the chart at install time; run `helm template` to render and validate the final collector configs.' };
        return res;
    }
    const bin = findBinary();
    if (!bin) {
        res.collector = { skipped: 'otelcol-contrib not found on PATH — YAML check only.' };
        return res;
    }
    const dir = mkdtempSync(join(tmpdir(), 'cxlens-'));
    const f = join(dir, 'config.yaml');
    writeFileSync(f, text);
    const r = spawnSync(bin, ['validate', `--config=${f}`], { encoding: 'utf8', timeout: 30000 });
    res.collector = { binary: bin, ok: r.status === 0, output: (r.stdout + r.stderr).trim() };
    return res;
}
//# sourceMappingURL=validate.js.map