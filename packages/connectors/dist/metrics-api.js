import { loadCatalogue } from '@cx-lens/core';
import { redactSecrets } from './exec.js';
/** Read-only Coralogix Metrics API (Prometheus-compatible /metrics/api/v1), region → domain from the official list. */
export class MetricsApiAdapter {
    region;
    getKey;
    id = 'metrics-api';
    last = 0;
    constructor(region, getKey) {
        this.region = region;
        this.getKey = getKey;
    }
    base() {
        const cat = loadCatalogue();
        const r = cat.domains.regions[this.region.toLowerCase()];
        if (!r)
            throw new Error(`Unknown Coralogix region ${this.region}. Known: ${Object.keys(cat.domains.regions).join(', ')}`);
        return cat.domains.metricsApi.template.replace('{domain}', r.domain);
    }
    range(window, at) { const h = window.endsWith('d') ? +window.slice(0, -1) * 24 : window.endsWith('m') ? +window.slice(0, -1) / 60 : +window.replace('h', ''); const end = at ? new Date(at) : new Date(); const start = new Date(end.getTime() - h * 3600e3); const z = (d) => d.toISOString().replace(/\.\d+Z$/, 'Z'); return { start: z(start), end: z(end) }; }
    async get(path, params) {
        const cat = loadCatalogue();
        const key = await this.getKey();
        if (!key)
            throw new Error('No API key for the Metrics API.');
        for (let attempt = 0; attempt < 4; attempt++) {
            const wait = this.last + cat.domains.metricsApi.minDelayMs - Date.now();
            if (wait > 0)
                await new Promise((r) => setTimeout(r, wait));
            this.last = Date.now();
            const u = new URL(this.base() + path);
            for (const [k, v] of params)
                u.searchParams.append(k, v);
            const r = await fetch(u, { headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(60000) });
            if (cat.domains.metricsApi.retryOn.includes(r.status)) {
                await new Promise((res) => setTimeout(res, 500 * 2 ** attempt));
                continue;
            }
            if (!r.ok)
                throw new Error(redactSecrets(`Metrics API ${path} → HTTP ${r.status}`));
            return r.json();
        }
        throw new Error('Metrics API rate limited after retries');
    }
    async healthCheck() { try {
        await this.getLabelValues('__name__', '15m');
        return { ok: true, detail: this.base() };
    }
    catch (e) {
        return { ok: false, detail: e.message };
    } }
    async getLabelValues(label, window, metric, at) {
        const { start, end } = this.range(window, at);
        const p = [['start', start], ['end', end]];
        if (metric)
            p.push(['match[]', metric]);
        return (await this.get(`/label/${encodeURIComponent(label)}/values`, p)).data ?? [];
    }
    async getMetricSeries(req) {
        const { start, end } = this.range(req.window, req.at);
        const sel = `${req.metric}{${Object.entries(req.match ?? {}).map(([k, v]) => `${k}="${v.replace(/"/g, '\\"')}"`).join(',')}}`;
        return (await this.get('/series', [['match[]', sel], ['start', start], ['end', end]])).data ?? [];
    }
}
//# sourceMappingURL=metrics-api.js.map