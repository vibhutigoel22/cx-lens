import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { loadCatalogue } from '@cx-lens/core';
import { redactSecrets } from './exec.js';
/**
 * Coralogix Metric Usage API (gRPC): the data behind Settings › Metrics Data › Labels / Metrics.
 * Needs an API key with the DataAnalytics preset. Optional: stored in the macOS Keychain as "<team>:metric-usage"
 * (or the CXLENS_USAGE_KEY variable). Read-only. Message definitions come from the API's own reflection data.
 */
const here = dirname(fileURLToPath(import.meta.url));
const protoset = () => [process.env.CXLENS_PROTO_DIR && join(process.env.CXLENS_PROTO_DIR, 'metric-usages.protoset'), join(here, '../proto/metric-usages.protoset')].find((p) => p && existsSync(p));
export const usageKeyAccount = (team) => `${team}:metric-usage`;
export async function usageKey(team) { const { resolveUsageKey } = await import('./usage-keys.js'); return resolveUsageKey(team); }
const day = (d) => ({ year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() });
const num = (v) => Number(v ?? 0) || 0;
const row = (name, u, extra = {}) => ({ name, unique: num(u?.cardinality), bytes: num(u?.bytes_volume), units: num(u?.unit_usage), fraction: num(u?.fraction_of_daily_usage), metricCount: extra.metric_count !== undefined ? num(extra.metric_count) : undefined, variations: extra.variations_count !== undefined ? num(extra.variations_count) : undefined });
export class MetricUsageApi {
    region;
    key;
    client;
    constructor(region, key) {
        this.region = region;
        this.key = key;
        const def = protoLoader.loadFileDescriptorSetFromBuffer(readFileSync(protoset()), { keepCase: true, longs: String, enums: String, defaults: true });
        const pkg = grpc.loadPackageDefinition(def);
        const Svc = pkg.com.coralogix.metrics.metric_usages.UsageService;
        const r = loadCatalogue().domains.regions[region.toLowerCase()];
        if (!r)
            throw new Error(`Unknown region ${region}`);
        this.client = new Svc(`api.${r.domain}:443`, grpc.credentials.createSsl());
    }
    call(method, req) {
        const md = new grpc.Metadata();
        md.set('authorization', this.key);
        return new Promise((res, rej) => this.client[method](req, md, { deadline: Date.now() + 60000 }, (e, out) => (e ? rej(Object.assign(new Error(redactSecrets(`Metric Usage API ${method}: ${e.details ?? e.message}`)), { code: e.code })) : res(out))));
    }
    /** Last complete UTC day: today's dataset is still filling. */
    common(length) { const d = new Date(Date.now() - 864e5); return { start_date: day(d), end_date: day(d), start_offset: 0, length, order_by: 'USAGE', ordering: 'DESCENDING' }; }
    async labels(length = 300) {
        const o = await this.call('GetLabelUsages', { common: this.common(length) });
        const u = o.daily_usages?.[0] ?? {};
        return { date: u.total_daily_usage?.date, totalUnits: num(u.total_daily_usage?.daily_unit_usage), totalBytes: num(u.total_daily_usage?.daily_bytes_volume), totalSeries: num(u.total_daily_usage?.daily_cardinality), rows: (u.label_usages ?? []).map((l) => row(l.name, l.usage, l)) };
    }
    async metrics(length = 50) {
        const o = await this.call('GetMetricUsages', { common: this.common(length) });
        const u = o.daily_usages?.[0] ?? {};
        return { date: u.total_daily_usage?.date, totalUnits: num(u.total_daily_usage?.daily_unit_usage), totalBytes: num(u.total_daily_usage?.daily_bytes_volume), totalSeries: num(u.total_daily_usage?.daily_cardinality), rows: (u.metric_usages ?? []).map((m) => row(m.name, m.usage, m)) };
    }
    async metricsForLabel(label, length = 50) {
        const o = await this.call('GetMetricUsagesByLabel', { common: this.common(length), label_name: label });
        const u = o.daily_usages?.[0] ?? {};
        return (u.metric_usages ?? []).map((m) => row(m.metric_name, m.usage));
    }
    async healthCheck() {
        try {
            const l = await this.labels(1);
            return { ok: true, detail: `Key works: ${l.totalUnits.toFixed(2)} metric units yesterday${l.rows.length ? '' : ' (no label usage yet)'}.` };
        }
        catch (e) {
            const c = e?.code;
            return { ok: false, detail: c === 16 || c === 7 ? 'The key was rejected. Check it is for this team and has the DataAnalytics preset.' : c === 14 || c === 4 ? 'Could not reach the Metric Usage API. Check the network and the team’s region.' : `The Metric Usage API returned an error. ${String(e?.message ?? '').replace(/^Metric Usage API \w+: /, 'Details: ')}` };
        }
    }
}
export async function metricUsageFor(team) { const k = await usageKey(team.name); return k ? new MetricUsageApi(team.region, k) : null; }
//# sourceMappingURL=metric-usage.js.map