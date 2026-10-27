import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { parse } from 'yaml';
import { compareVersions } from './semver.js';
export const HELM_REPO = 'https://cgx.jfrog.io/artifactory/coralogix-charts-virtual';
export const CHART_CHANGELOG = 'https://raw.githubusercontent.com/coralogix/telemetry-shippers/master/otel-integration/CHANGELOG.md';
export const CONTRIB_CHANGELOG = 'https://raw.githubusercontent.com/open-telemetry/opentelemetry-collector-contrib/main/CHANGELOG.md';
export const CORE_CHANGELOG = 'https://raw.githubusercontent.com/open-telemetry/opentelemetry-collector/main/CHANGELOG.md';
export const CHART_README = 'https://raw.githubusercontent.com/coralogix/telemetry-shippers/master/otel-integration/k8s-helm/README.md';
/** Offline fallback only (playbook pins this version). Logic always prefers the resolved latest. */
export const OFFLINE_FALLBACK = { chart: '0.0.356', collector: null };
const TTL = 24 * 3600 * 1000;
const cacheDir = () => process.env.CXLENS_CACHE_DIR ?? join(homedir(), '.cxlens', 'cache');
async function cachedFetch(url, name, force = false) {
    const dir = cacheDir();
    mkdirSync(dir, { recursive: true });
    const f = join(dir, name);
    const meta = f + '.json';
    if (!force && existsSync(meta)) {
        const m = JSON.parse(readFileSync(meta, 'utf8'));
        if (Date.now() - Date.parse(m.at) < TTL)
            return { text: readFileSync(f, 'utf8'), at: m.at, cached: true };
    }
    try {
        const r = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20000) });
        if (!r.ok)
            throw new Error(`${url} → HTTP ${r.status}`);
        const text = await r.text();
        const at = new Date().toISOString();
        writeFileSync(f, text);
        writeFileSync(meta, JSON.stringify({ at, url }));
        return { text, at, cached: false };
    }
    catch (e) {
        if (existsSync(f)) {
            const m = JSON.parse(readFileSync(meta, 'utf8'));
            return { text: readFileSync(f, 'utf8'), at: m.at, cached: true };
        }
        throw e;
    }
}
export const fetchText = cachedFetch;
/** Latest otel-integration chart (Helm repo index.yaml) and latest collector (GitHub releases redirect). */
export async function resolveLatest(force = false) {
    const errors = [];
    let chart = null, collector = null;
    let at = new Date().toISOString();
    let fromCache = false;
    try {
        const idx = await cachedFetch(`${HELM_REPO}/index.yaml`, 'helm-index.yaml', force);
        at = idx.at;
        fromCache = idx.cached;
        const y = parse(idx.text, { maxAliasCount: -1 });
        const vs = (y?.entries?.['otel-integration'] ?? []).map((e) => e.version).filter((v) => /^\d+\.\d+\.\d+$/.test(v));
        chart = vs.sort(compareVersions).at(-1) ?? null;
    }
    catch (e) {
        errors.push(`Helm repo: ${e.message}`);
    }
    try {
        const dir = cacheDir();
        mkdirSync(dir, { recursive: true });
        const f = join(dir, 'collector-latest.json');
        if (!force && existsSync(f)) {
            const c = JSON.parse(readFileSync(f, 'utf8'));
            if (Date.now() - Date.parse(c.at) < TTL)
                collector = c.version;
        }
        if (!collector) {
            const r = await fetch('https://github.com/open-telemetry/opentelemetry-collector-releases/releases/latest', { redirect: 'manual', signal: AbortSignal.timeout(15000) });
            const loc = r.headers.get('location') ?? '';
            const m = loc.match(/tag\/v?(\d+\.\d+\.\d+)/);
            if (m) {
                collector = m[1];
                writeFileSync(f, JSON.stringify({ version: collector, at: new Date().toISOString() }));
            }
            else
                throw new Error('no release redirect');
        }
    }
    catch (e) {
        errors.push(`Collector releases: ${e.message}`);
        const f = join(cacheDir(), 'collector-latest.json');
        if (existsSync(f))
            collector = JSON.parse(readFileSync(f, 'utf8')).version;
    }
    const offline = !chart && !collector;
    return { chart: chart ?? OFFLINE_FALLBACK.chart, collector, checkedAt: at, fromCache, offline, errors };
}
/** Map a chart version to the collector image it ships, using the chart CHANGELOG ("Bump the OpenTelemetry Collector image to vX"). */
export function collectorForChart(changelog, chart) {
    const sections = changelog.split(/\n### v/).slice(1);
    let found = false;
    for (const s of sections) {
        const v = s.split(/[\s/]/)[0];
        if (!found && compareVersions(v, chart) > 0)
            continue;
        found = true;
        const m = s.match(/OpenTelemetry Collector image to v?(\d+\.\d+\.\d+)/);
        if (m)
            return m[1];
    }
    return null;
}
//# sourceMappingURL=resolver.js.map