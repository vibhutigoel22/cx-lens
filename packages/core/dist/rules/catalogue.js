import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { parse } from 'yaml';
export function rulesDir() {
    if (process.env.CXLENS_RULES_DIR)
        return process.env.CXLENS_RULES_DIR;
    try {
        const req = createRequire(import.meta.url);
        return dirname(req.resolve('@cx-lens/rules/package.json'));
    }
    catch {
        let d = dirname(new URL(import.meta.url).pathname);
        for (let i = 0; i < 6; i++) {
            const c = join(d, 'rules');
            if (existsSync(join(c, 'universal.yaml')))
                return c;
            d = dirname(d);
        }
        throw new Error('Rule catalogue not found. Set CXLENS_RULES_DIR.');
    }
}
let cached = null;
export function loadCatalogue(dir = rulesDir()) {
    if (cached)
        return cached;
    const y = (f) => parse(readFileSync(join(dir, f), 'utf8'), { merge: true });
    const universal = y('universal.yaml'), logs = y('logs.yaml'), traces = y('traces.yaml'), metrics = y('metrics.yaml');
    const rules = {};
    for (const f of [universal, logs, traces, metrics])
        for (const r of f.rules)
            rules[r.id] = { ...r, pillar: f.pillar };
    cached = {
        version: [universal, logs, traces, metrics].map((f) => f.schemaVersion).join('.'),
        sources: y('sources.yaml').sources, rules, universal, logs, traces, metrics,
        protected: y('protected-labels.yaml'), units: y('units.yaml'), domains: y('domains.yaml'), upgradeFixes: y('upgrade-fixes.yaml'),
    };
    return cached;
}
export function resolveSources(cat, keys = []) {
    return keys.map((k) => cat.sources[k] ?? { title: `Not covered by official guidance (${k})`, url: '' });
}
//# sourceMappingURL=catalogue.js.map