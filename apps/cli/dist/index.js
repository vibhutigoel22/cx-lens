#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BRAND, runAssessment, produceOutputs, createZip, reportBaseName, resolveLatest, parseConfig, collectorForChart, fetchText, CHART_CHANGELOG } from '@cx-lens/core';
import { buildConnector, MockAdapter, RecordingConnector, setSecret, keychainAvailable, CxCliAdapter, ClaudeCliAdapter, resolveKey } from '@cx-lens/connectors';
const HELP = `${BRAND.name} — ${BRAND.tagline}

Usage:
  ${BRAND.cli} analyze [options]          Run the review and write reports + configs
  ${BRAND.cli} doctor [--team <profile>]  Check cx, claude, Metrics API and versions
  ${BRAND.cli} versions [--refresh]       Show latest Helm chart and OTel Collector
  ${BRAND.cli} teams add <name> --region <r>   Store an API key in the macOS Keychain (reads CX_API_KEY or prompts)
  ${BRAND.cli} recheck --team <profile> --before <dir>   Re-run the label analysis and compare series counts

analyze options:
  --pillars universal,logs,traces,metrics   (default: all; universal always runs first)
  --team <cx profile>      Coralogix team (cx profile name)   --region <ap1|eu2|…>
  --config <values.yaml|config.yaml>        Optional customer config
  --deployment helm,ecs,ec2,standalone      One or several (default: detected, else helm)
  --config helm=values.yaml --config ecs=ecs.yaml   One config per deployment type (or a single file)
  --chart-version <x.y.z>  --otel-version <x.y.z>  --distribution otelcol|otelcol-contrib
  --customer <name> --env <id> --prepared-by <name> --critical svc1,svc2
  --internal-terms a,b     Extra names to strip from the customer report
  --audience "the CTO and co-founders"   Who the leadership slide is for (default: leadership)
  --window 24h|7d (1h–7d, default 24h)  --dup-window 15m (1–60m, default 15m)  --row-limit 200 (default)  --span-metric calls_total
  --from 2026-10-24T00:00:00Z --to 2026-10-25T00:00:00Z   Exact range instead of --window (1 h to 7 days, UTC)
  --investigate [n]        Investigate with Claude: top n contributors (default 8), live samples, validated suggestions
                           Metrics pillar also runs the TAM skills span-name-cardinality-analyzer and span-metrics-bucket-optimizer
  --vendor <name>          Vendor compared against for the bucket skill (Datadog, New Relic, Splunk, Grafana, Dynatrace; default none)
  --no-skills              Skip the TAM skills
  --verify all|ID,ID       Mark findings Verified (otherwise all stay Candidate)
  --state <file.json>      Load Verify statuses saved by the app
  --allow-draft            Include unverified findings with a DRAFT watermark
  --near-renewal  --no-verify-team
  --demo                   Use recorded demo data (no account needed)
  --record <fixture.json>  Record live results for demo/tests (anonymised)
  --zip                    Also write everything as one <Customer>.zip
  --out <dir>              Output directory (default ./cxlens-report)
`;
/** "15m" → 15, "24h" → 1440, "7d" → 10080; a bare number is read as hours for --window and minutes for --dup-window by the caller's unit. */
function toMinutes(v) { const m = v.trim().match(/^(\d+(?:\.\d+)?)\s*([mhd]?)$/i); if (!m)
    throw new Error(`Invalid window "${v}". Use e.g. 15m, 24h or 7d.`); const n = +m[1]; const u = (m[2] || 'h').toLowerCase(); return u === 'm' ? n : u === 'h' ? n * 60 : n * 1440; }
function args(argv) { const o = {}; const pos = []; for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
        const k = a.slice(2);
        const n = argv[i + 1];
        const v = n !== undefined && !n.startsWith('--') ? (i++, n) : true;
        o[k] = k === 'config' && o[k] !== undefined ? `${o[k]},${v}` : v;
    }
    else
        pos.push(a);
} return { o, pos }; }
const here = dirname(fileURLToPath(import.meta.url));
const demoFixture = () => [join(here, '../../../fixtures/demo.json'), join(process.cwd(), 'fixtures/demo.json')].find(existsSync);
export function anonymise(s, team) {
    let t = s.replace(/\b\d{12}\b/g, '123456789012').replace(/"companyId":\s*\d+/g, '"companyId": 1000000').replace(/https?:\/\/[a-z0-9-]+\.app\.coralogix\.[a-z]+/g, 'https://demo-team.app.coralogix.in').replace(/\bi-[0-9a-f]{8,17}\b/g, 'i-0demo0000000000').replace(/\bami-[0-9a-f]{8,17}\b/g, 'ami-0demo000000000');
    if (team)
        t = t.split(team).join('demo-team');
    return t;
}
async function main() {
    const [cmd, ...rest] = process.argv.slice(2);
    const { o, pos } = args(rest);
    if (!cmd || cmd === 'help' || o.help) {
        console.log(HELP);
        return;
    }
    if (cmd === 'versions') {
        const l = await resolveLatest(!!o.refresh);
        console.log(`Latest Helm chart: ${l.chart} · Latest OTel Collector: ${l.collector ?? 'unknown'} · checked ${l.checkedAt.slice(0, 10)}${l.fromCache ? ' (cached)' : ''}${l.errors.length ? `\n${l.errors.join('\n')}` : ''}`);
        return;
    }
    if (cmd === 'teams' && pos[0] === 'add') {
        if (!keychainAvailable()) {
            console.error('Keychain is only available on macOS. Use `cx profiles add` instead.');
            process.exit(1);
        }
        const key = process.env.CX_API_KEY;
        if (!key) {
            console.error('Set CX_API_KEY in the environment for this command (it is stored in Keychain, never on disk).');
            process.exit(1);
        }
        await setSecret(pos[1], key);
        console.log(`Stored key for ${pos[1]} (${o.region}) in the macOS Keychain.`);
        return;
    }
    if (cmd === 'doctor') {
        const team = { name: String(o.team ?? 'default'), region: String(o.region ?? 'ap1'), profile: o.team ? String(o.team) : undefined };
        const cx = new CxCliAdapter(team, () => resolveKey(team));
        const c = await cx.healthCheck();
        console.log(`cx:          ${c.ok ? 'ok' : 'missing'} — ${c.detail}`);
        const cl = await new ClaudeCliAdapter().healthCheck();
        console.log(`claude:      ${cl.ok ? 'ok' : 'missing'} — ${cl.detail}`);
        console.log(`metrics:     ${c.ok && cx.has('metrics') ? 'ok — through cx (PromQL), no separate key needed' : 'unavailable — needs cx with the metrics command'}`);
        const l = await resolveLatest();
        console.log(`Latest Helm chart: ${l.chart} · Latest OTel Collector: ${l.collector} · checked ${l.checkedAt.slice(0, 10)}`);
        return;
    }
    if (cmd === 'analyze' || cmd === 'recheck') {
        const out = resolve(String(o.out ?? './cxlens-report'));
        mkdirSync(out, { recursive: true });
        const team = { name: String(o.team ?? 'demo'), region: String(o.region ?? 'ap1'), profile: o.team ? String(o.team) : undefined };
        let connector = o.demo ? MockAdapter.fromFile(String(o.fixture ?? demoFixture() ?? 'fixtures/demo.json')) : await buildConnector(team, { claude: !o['no-ai'] });
        let rec = null;
        if (o.record) {
            rec = new RecordingConnector(connector);
            connector = rec;
        }
        if (cmd === 'recheck') {
            const bf = readdirSync(String(o.before)).find((n) => n === 'report.internal.json' || /\(internal[^)]*\)\.json$/.test(n));
            if (!bf)
                throw new Error(`No internal report JSON found in ${o.before}`);
            const before = JSON.parse(readFileSync(join(String(o.before), bf), 'utf8'));
            const prev = before.findings.find((f) => f.ruleId === 'METRIC-LABEL-ANALYZER')?.evidence?.[0]?.rows ?? [];
            const a = await runAssessment({ connector, customer: { name: '-', environment: '-', preparedBy: '-', criticalServices: [] }, pillars: ['metrics'], deployment: 'helm' });
            const now = (a.findings.find((f) => f.ruleId === 'METRIC-LABEL-ANALYZER')?.evidence?.[0]?.rows ?? []);
            console.log('service\tseries before\tseries after');
            for (const r of now) {
                const p = prev.find((x) => x.service === r.service);
                console.log(`${r.service}\t${p?.series ?? '—'}\t${r.series}`);
            }
            return;
        }
        // --config values.yaml | --config helm=values.yaml --config ecs=ecs.yaml (or comma-separated); --deployment helm,ecs,ec2
        const cfgArgs = o.config ? String(o.config).split(',').filter(Boolean) : [];
        const configsIn = {};
        for (const c of cfgArgs) {
            const m = /^(helm|kubernetes|eks|ecs|ec2|standalone)=(.+)$/.exec(c);
            const dep = m ? { kubernetes: 'helm', eks: 'helm' }[m[1]] ?? m[1] : undefined;
            const txt = readFileSync(m ? m[2] : c, 'utf8');
            configsIn[dep ?? parseConfig(txt).deploymentGuess ?? 'helm'] = txt;
        }
        const depList = o.deployment ? String(o.deployment).split(',').map((x) => ({ kubernetes: 'helm', eks: 'helm' }[x] ?? x)) : (Object.keys(configsIn).length ? Object.keys(configsIn) : ['helm']);
        const configText = configsIn[depList[0]] ?? '';
        const parsed = parseConfig(configText);
        const deployment = depList[0];
        console.log(`${BRAND.name} · ${o.demo ? 'demo data' : `team ${team.name} (${team.region})`} · ${parsed.label}`);
        const latest = await resolveLatest().catch(() => null);
        let collectorCurrent = o["otel-version"] ?? parsed.collectorVersion;
        const chartCurrent = o['chart-version'] ?? parsed.chartVersion;
        if (!collectorCurrent && chartCurrent && deployment === 'helm') {
            try {
                collectorCurrent = (collectorForChart((await fetchText(CHART_CHANGELOG, 'chart-CHANGELOG.md')).text, chartCurrent) ?? undefined);
            }
            catch { /* offline */ }
        }
        const versions = {
            helmChart: deployment === 'helm' ? { current: chartCurrent ?? latest?.chart ?? undefined, latest: latest?.chart ?? undefined, checkedAt: latest?.checkedAt, source: chartCurrent ? (o['chart-version'] ? 'user' : 'detected') : 'assumed-latest' } : undefined,
            collector: { current: collectorCurrent ?? latest?.collector ?? undefined, latest: latest?.collector ?? undefined, distribution: o.distribution ?? parsed.distribution ?? 'otelcol-contrib', checkedAt: latest?.checkedAt, source: collectorCurrent ? (o['otel-version'] ? 'user' : 'detected') : 'assumed-latest' },
        };
        if (latest)
            console.log(`Latest Helm chart: ${latest.chart} · Latest OTel Collector: ${latest.collector} · checked ${latest.checkedAt.slice(0, 10)}`);
        const pillars = String(o.pillars ?? 'universal,logs,traces,metrics').split(',').map((s) => s.trim());
        const a = await runAssessment({
            connector, deployment, configText, versions, deployments: depList, configs: configsIn, versionsBy: Object.fromEntries(depList.map((d) => { const p = parseConfig(configsIn[d] ?? ''); const coll = o['otel-version'] ?? p.collectorVersion; return [d, d === deployment ? versions : { helmChart: d === 'helm' ? { current: p.chartVersion ?? latest?.chart ?? undefined, latest: latest?.chart ?? undefined, source: p.chartVersion ? 'detected' : 'assumed-latest' } : undefined, collector: { current: coll ?? latest?.collector ?? undefined, latest: latest?.collector ?? undefined, source: coll ? 'detected' : 'assumed-latest' } }]; })), pillars: pillars.includes('universal') ? pillars : ['universal', ...pillars],
            customer: { name: String(o.customer ?? 'Customer'), environment: String(o.env ?? 'production'), preparedBy: String(o['prepared-by'] ?? 'TAM'), criticalServices: o.critical ? String(o.critical).split(',') : [], nearRenewal: !!o['near-renewal'], teamCanVerify: !o['no-verify-team'], internalTerms: o['internal-terms'] ? String(o['internal-terms']).split(',') : [], audience: o.audience ? String(o.audience) : undefined },
            options: { windowHours: toMinutes(String(o.window ?? '24h')) / 60, dupWindowMinutes: toMinutes(/^\d+$/.test(String(o['dup-window'] ?? '')) ? `${o['dup-window']}m` : String(o['dup-window'] ?? '15m')), rowLimit: +(o['row-limit'] ?? 200), ...(o.investigate ? { investigate: { enabled: true, maxContributors: o.investigate === true ? 8 : +o.investigate, skills: { spanNames: !o['no-skills'], buckets: !o['no-skills'] }, vendor: o.vendor ? String(o.vendor) : undefined } } : {}), ...(o.from || o.to ? { range: { start: String(o.from ?? ''), end: String(o.to ?? new Date().toISOString()) } } : {}), spanMetric: String(o['span-metric'] ?? 'calls_total') },
            onProgress: (e) => { if (e.status === 'done' || e.status === 'failed' || e.status === 'skipped')
                console.log(`  ${e.status === 'done' ? '✓' : e.status === 'skipped' ? '–' : '✗'} ${e.title}${e.message ? ` — ${e.message}` : ''}`); },
        });
        if (o.state) {
            const st = JSON.parse(readFileSync(String(o.state), 'utf8'));
            for (const f of a.findings)
                Object.assign(f, st[f.ruleId] ?? {});
        }
        if (o.verify) {
            const ids = String(o.verify).split(',');
            for (const f of a.findings)
                if (ids.includes('all') ? f.verifyStatus === 'candidate' : ids.includes(f.id) || ids.includes(f.ruleId))
                    f.verifyStatus = 'verified';
        }
        for (const e of a.eligibility)
            console.log(`⚠ ${e}`);
        const res = await produceOutputs(a, { allowDraft: !!o['allow-draft'] });
        for (const [n, body] of Object.entries(res.files)) {
            const f = join(out, n);
            mkdirSync(dirname(f), { recursive: true });
            writeFileSync(f, body);
        } // per-type folders (kubernetes/, ecs/, …)
        if (o.zip) {
            const zn = `${reportBaseName(a.customer.name)}${o['allow-draft'] ? ' (draft)' : ''}.zip`;
            writeFileSync(join(out, zn), createZip(res.files));
            console.log(`Zip: ${join(out, zn)}`);
        }
        writeFileSync(join(out, 'assessment.json'), JSON.stringify({ ...a, config: { label: a.config.label, format: a.config.format, notes: a.config.notes } }, null, 2));
        if (rec) {
            const team = (await connector.listResources?.('alerts')) ? '' : '';
            writeFileSync(String(o.record), anonymise(JSON.stringify(rec.fx, null, 1), process.env.CXLENS_TEAM_SLUG));
            console.log(`Recorded fixture → ${o.record}`);
            void team;
        }
        console.log(`\n${a.findings.length} findings · ${a.gaps.length} adoption gaps · ${a.skipped.length} skipped`);
        for (const w of res.warnings)
            console.log(`note: ${w}`);
        if (res.customerIssues.length)
            console.log(`⚠ Customer report check: ${res.customerIssues.length} item(s) to review before sending: ${[...new Set(res.customerIssues.map((i) => i.kind))].join(', ')}`);
        console.log(`Wrote ${Object.keys(res.files).length + 1} files to ${out}`);
        return;
    }
    console.log(HELP);
    process.exitCode = 1;
}
main().catch((e) => { console.error(`${BRAND.cli}: ${e?.message ?? e}`); process.exit(1); });
//# sourceMappingURL=index.js.map