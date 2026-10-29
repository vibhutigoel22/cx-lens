import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { randomBytes, randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, unlinkSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer, WebSocket } from 'ws';
import { BRAND, runAssessment, produceOutputs, createZip, reportBaseName, resolveLatest, parseConfig, writeConfig, diffLines, buildReport, scrubReport, type Assessment, type Pillar, type DeploymentType } from '@cx-lens/core';
import { buildConnector, metricUsageFor, usageKeyAccount, listUsageKeys, addUsageKey, selectUsageKey, removeUsageKey, MockAdapter, CxCliAdapter, ClaudeCliAdapter, resolveKey, setSecret, keychainAvailable, which } from '@cx-lens/connectors';
import { openapi } from './openapi.js';

const here = dirname(fileURLToPath(import.meta.url));
const RUNS = join(process.env.CXLENS_HOME ?? join(homedir(), '.cxlens'), 'runs'); mkdirSync(RUNS, { recursive: true });
const DRAFTS = join(process.env.CXLENS_HOME ?? join(homedir(), '.cxlens'), 'drafts'); mkdirSync(DRAFTS, { recursive: true });
const SAFE_ID = /^[\w-]{1,64}$/;
/** Drafts never hold secrets: strip anything that looks like a key before saving. */
const stripSecrets = (d: any) => { const c = JSON.parse(JSON.stringify(d ?? {})); if (c.newTeam) delete c.newTeam; if (c.conn) delete c.conn.apiKey; return c; };
const TOKEN = process.env.CXLENS_TOKEN ?? randomBytes(24).toString('hex');
const runs = new Map<string, Assessment>();
const upgrades = new Map<string, any>();
const subs = new Map<string, Set<WebSocket>>();
const history = new Map<string, any[]>(); // replay for late subscribers (fast demo runs finish before the socket connects)
const emit = (id: string, msg: any) => { (history.get(id) ?? history.set(id, []).get(id)!).push(msg); for (const ws of subs.get(id) ?? []) ws.send(JSON.stringify(msg)); };
const uiDir = [process.env.CXLENS_UI_DIR, join(here, '../../ui/dist')].find((d) => d && existsSync(join(d, 'index.html')));
const demoFixture = [join(here, '../../../fixtures/demo.json'), join(process.cwd(), 'fixtures/demo.json')].find(existsSync);

const save = (id: string, a: Assessment) => { runs.set(id, a); writeFileSync(join(RUNS, `${id}.json`), JSON.stringify({ ...a, config: { ...a.config, doc: undefined }, configs: Object.fromEntries(Object.entries(a.configs ?? {}).map(([d, c]) => [d, { ...c, doc: undefined }])) })); };
const load = (id: string): Assessment | null => { if (runs.has(id)) return runs.get(id)!; const p = join(RUNS, `${id}.json`); if (!existsSync(p)) return null; const a = JSON.parse(readFileSync(p, 'utf8')); a.config = parseConfig(a.config.text ?? ''); a.configs = Object.fromEntries(Object.entries(a.configs ?? {}).map(([d, c]: [string, any]) => [d, parseConfig(c?.text ?? '')])); a.deployments ??= [a.deployment]; runs.set(id, a); return a; };
const body = (req: IncomingMessage): Promise<any> => new Promise((res, rej) => { let d = ''; req.on('data', (c) => { d += c; if (d.length > 20e6) req.destroy(); }); req.on('end', () => { try { res(d ? JSON.parse(d) : {}); } catch (e) { rej(e); } }); });
const send = (res: ServerResponse, code: number, data: unknown) => { res.writeHead(code, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(JSON.stringify(data)); };
const MIME: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.woff2': 'font/woff2' };

async function connectorFor(b: any) {
  if (b.demo) return MockAdapter.fromFile(demoFixture!);
  const team = { name: b.team ?? 'default', region: b.region ?? 'ap1', profile: b.team };
  return buildConnector(team);
}

async function handle(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? '/', 'http://127.0.0.1'); const p = url.pathname;
  if (!p.startsWith('/api/')) {
    if (!uiDir) { res.writeHead(200, { 'content-type': 'text/plain' }); res.end(`${BRAND.name} API is running. Build the UI with npm run build.`); return; }
    const f = join(uiDir, p === '/' ? 'index.html' : p.replace(/\.\./g, '')); const file = existsSync(f) && !f.endsWith('/') ? f : join(uiDir, 'index.html');
    let data: string | Buffer = readFileSync(file);
    if (file.endsWith('index.html')) data = data.toString().replace('</head>', `<meta name="cxlens-token" content="${TOKEN}"></head>`);
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream', 'x-content-type-options': 'nosniff' }); res.end(data); return;
  }
  if (p === '/api/openapi.json') return send(res, 200, openapi);
  if (req.headers['x-cxlens-token'] !== TOKEN) return send(res, 401, { error: 'Missing or wrong X-CxLens-Token.' });
  try {
    if (p === '/api/health') {
      const team = { name: url.searchParams.get('team') ?? 'default', region: url.searchParams.get('region') ?? 'ap1', profile: url.searchParams.get('team') ?? undefined };
      const cxa = new CxCliAdapter(team, () => resolveKey(team));
      const [cx, claude] = await Promise.all([cxa.healthCheck(), new ClaudeCliAdapter().healthCheck()]);
      // Metrics run through `cx metrics query`, so they share cx's sign-in. No separate key is needed.
      const metrics = cx.ok ? (cxa.has('metrics') ? { ok: true, detail: 'Through cx (PromQL)' } : { ok: false, detail: 'This cx version has no `metrics` command. Update cx.' }) : { ok: false, detail: 'Needs cx.' };
      return send(res, 200, { cx, claude, metrics, helm: !!which('helm'), otelcol: !!(which('otelcol-contrib') || which('otelcol')), keychain: keychainAvailable() });
    }
    // Saved Metric Usage API keys: names and team assignments only; the keys stay in the Keychain.
    if (p === '/api/usage-keys' && req.method === 'GET') return send(res, 200, { ...listUsageKeys(url.searchParams.get('team') ?? undefined), keychain: keychainAvailable() });
    if (p === '/api/usage-keys' && req.method === 'POST') { const b = await body(req); if (!b.label || !b.apiKey) return send(res, 400, { error: 'A name and a key are required.' }); const e = await addUsageKey(String(b.label), String(b.apiKey), b.team ? String(b.team) : undefined); return send(res, 201, e); }
    if (p === '/api/usage-keys/select' && req.method === 'PUT') { const b = await body(req); selectUsageKey(String(b.team), b.id ?? null); return send(res, 200, listUsageKeys(String(b.team))); }
    if (p === '/api/usage-keys/test' && req.method === 'GET') { const team = { name: url.searchParams.get('team') ?? '', region: url.searchParams.get('region') ?? 'ap1' }; const mu = await metricUsageFor(team).catch((e) => { throw e; }); return send(res, 200, mu ? await mu.healthCheck() : { ok: false, detail: 'No key selected for this team.' }); }
    const uk = p.match(/^\/api\/usage-keys\/([\w-]+)$/); if (uk && req.method === 'DELETE') { await removeUsageKey(uk[1]); return send(res, 200, { deleted: uk[1] }); }
    if (p === '/api/prereqs') {
      const team = { name: url.searchParams.get('team') ?? 'default', region: url.searchParams.get('region') ?? 'ap1', profile: url.searchParams.get('team') ?? undefined };
      const checks: { id: string; label: string; ok: boolean; required: boolean; detail: string; fix?: string }[] = [];
      const cxa = new CxCliAdapter(team, () => resolveKey(team)); const cxInstalled = !!which('cx');
      checks.push({ id: 'cx', label: 'cx CLI installed', ok: cxInstalled, required: true, detail: cxInstalled ? 'Found on PATH' : 'Not found', fix: 'brew install coralogix/tap/cx' });
      if (cxInstalled && team.profile) {
        const h = await cxa.healthCheck(); checks.push({ id: 'cx-team', label: `Read access to ${team.profile}`, ok: h.ok, required: true, detail: h.detail, fix: `cx profiles add ${team.profile} --region ${team.region}` });
        checks.push({ id: 'cx-metrics', label: 'Metrics queries through cx', ok: h.ok && cxa.has('metrics'), required: true, detail: cxa.has('metrics') ? 'cx metrics query available' : 'Update cx', fix: 'brew upgrade cx' });
      } else checks.push({ id: 'cx-team', label: 'Coralogix team selected', ok: false, required: true, detail: 'Pick a team first, or use demo data' });
      const cl = new ClaudeCliAdapter(); const st = await cl.selfTest();
      checks.push({ id: 'claude', label: 'claude CLI signed in (for Investigate)', ok: st.ok, required: false, detail: st.detail, fix: cl.available() ? 'claude' : 'npm install -g @anthropic-ai/claude-code' });
      if (team.profile) { const mu = await metricUsageFor(team).catch(() => null); const h = mu ? await mu.healthCheck() : null;
        checks.push({ id: 'metric-usage', label: 'Exact metric usage (Metric Usage API)', ok: !!h?.ok, required: false, detail: h ? h.detail : 'No DataAnalytics key saved: label and metric savings are estimated from series', fix: 'Add a key with the DataAnalytics preset under “Exact metric usage” on Connect' }); }
      const lat = await resolveLatest().catch(() => null);
      checks.push({ id: 'versions', label: 'Latest Helm chart and collector versions', ok: !!lat && !lat.offline, required: false, detail: lat ? `chart ${lat.chart}, collector ${lat.collector ?? 'unknown'}${lat.fromCache ? ' (cached)' : ''}` : 'Could not reach the Helm repo or GitHub' });
      checks.push({ id: 'otelcol', label: 'otelcol-contrib (optional, validates generated config)', ok: !!(which('otelcol-contrib') || which('otelcol')), required: false, detail: which('otelcol-contrib') ? 'Found' : 'Not found: OTTL is checked by Lens instead', fix: 'Download otelcol-contrib for macOS from github.com/open-telemetry/opentelemetry-collector-releases/releases (darwin_arm64 or darwin_amd64), unpack it, and move it to /usr/local/bin' });
      return send(res, 200, { ok: checks.filter((c) => c.required).every((c) => c.ok), checks });
    }
    if (p === '/api/versions') return send(res, 200, await resolveLatest(url.searchParams.get('refresh') === 'true'));
    if (p === '/api/teams' && req.method === 'GET') { const cx = new CxCliAdapter({ name: '-', region: 'ap1' }); return send(res, 200, which('cx') ? await cx.listTeams() : []); }
    if (p === '/api/teams' && req.method === 'POST') { const b = await body(req); if (!b.name || !b.apiKey) return send(res, 400, { error: 'name and apiKey are required' }); await setSecret(b.kind === 'metric-usage' ? usageKeyAccount(b.name) : b.name, b.apiKey); return send(res, 201, { name: b.name, region: b.region, kind: b.kind ?? 'team' }); }
    if (p === '/api/config/detect') { const b = await body(req); const c = parseConfig(b.text ?? ''); return send(res, 200, { format: c.format, label: c.label, chartVersion: c.chartVersion, collectorVersion: c.collectorVersion, distribution: c.distribution, deployment: c.deploymentGuess, notes: c.notes }); }
    // Drafts: save the whole review at any stage, resume later.
    if (p === '/api/drafts' && req.method === 'GET') return send(res, 200, readdirSync(DRAFTS).filter((f) => f.endsWith('.json')).map((f) => { try { const d = JSON.parse(readFileSync(join(DRAFTS, f), 'utf8')); return { id: d.id, name: d.name, step: d.step, savedAt: d.savedAt, runId: d.state?.runId ?? null, demo: !!d.state?.conn?.demo, team: d.state?.conn?.team ?? '' }; } catch { return null; } }).filter(Boolean).sort((a: any, b: any) => String(b.savedAt).localeCompare(String(a.savedAt))));
    const dm = p.match(/^\/api\/drafts\/([\w-]+)$/);
    if (dm) {
      if (!SAFE_ID.test(dm[1])) return send(res, 400, { error: 'Bad draft id' });
      const f = join(DRAFTS, `${dm[1]}.json`);
      if (req.method === 'GET') return existsSync(f) ? send(res, 200, JSON.parse(readFileSync(f, 'utf8'))) : send(res, 404, { error: 'Draft not found. It may have been deleted.' });
      if (req.method === 'DELETE') { if (existsSync(f)) unlinkSync(f); return send(res, 200, { deleted: dm[1] }); }
      if (req.method === 'PUT') { const b = await body(req); const d = { id: dm[1], name: String(b.name || 'Untitled review').slice(0, 120), step: +b.step || 0, savedAt: new Date().toISOString(), state: stripSecrets(b.state) }; writeFileSync(f, JSON.stringify(d, null, 2)); return send(res, 200, { id: d.id, savedAt: d.savedAt }); }
    }
    if (p === '/api/runs' && req.method === 'GET') return send(res, 200, readdirSync(RUNS).filter((f) => f.endsWith('.json')).map((f) => { const a = JSON.parse(readFileSync(join(RUNS, f), 'utf8')); return { id: f.slice(0, -5), customer: a.customer?.name, environment: a.customer?.environment, finishedAt: a.finishedAt, findings: a.findings?.length }; }).sort((a, b) => String(b.finishedAt).localeCompare(String(a.finishedAt))));
    if (p === '/api/runs' && req.method === 'POST') {
      const b = await body(req); const id = randomUUID().slice(0, 8);
      const latest = await resolveLatest().catch(() => null);
      // Several deployment types: { deployments: ['helm','ecs'], configs: { helm: '…', ecs: '…' }, versionsIn: { helm: { chartVersion }, ecs: { otelVersion, distribution } } }
      const deps: DeploymentType[] = (b.deployments?.length ? b.deployments : [b.deployment ?? parseConfig(b.configText ?? '').deploymentGuess ?? 'helm']) as DeploymentType[];
      const configs: Record<string, string> = b.configs ?? { [deps[0]]: b.configText ?? '' };
      const versionsBy: Record<string, any> = {};
      for (const d of deps) { const parsed = parseConfig(configs[d] ?? ''); const vi = b.versionsIn?.[d] ?? (d === deps[0] ? { chartVersion: b.chartVersion, otelVersion: b.otelVersion, distribution: b.distribution } : {});
        const chart = vi.chartVersion || parsed.chartVersion, coll = vi.otelVersion || parsed.collectorVersion;
        versionsBy[d] = { helmChart: d === 'helm' ? { current: chart ?? latest?.chart ?? undefined, latest: latest?.chart ?? undefined, checkedAt: latest?.checkedAt, source: chart ? (vi.chartVersion ? 'user' : 'detected') : 'assumed-latest' } : undefined,
          collector: { current: coll ?? latest?.collector ?? undefined, latest: latest?.collector ?? undefined, checkedAt: latest?.checkedAt, distribution: vi.distribution ?? parsed.distribution ?? 'otelcol-contrib', source: coll ? (vi.otelVersion ? 'user' : 'detected') : 'assumed-latest' } }; }
      const deployment = deps[0]; const versions = versionsBy[deployment];
      send(res, 202, { id });
      const connector = await connectorFor(b);
      const pillars = (b.pillars as Pillar[]).includes('universal') ? b.pillars : ['universal', ...b.pillars];
      runAssessment({ connector, customer: { preparedBy: 'TAM', criticalServices: [], ...b.customer }, pillars, deployment, deployments: deps, configs, versionsBy, configText: configs[deployment], versions, options: b.options,
        onProgress: (e) => emit(id, { type: 'progress', ...e }) })
        .then((a) => { save(id, a); emit(id, { type: 'done', id }); })
        .catch((e) => emit(id, { type: 'error', message: String(e?.message ?? e) }));
      return;
    }
    const m = p.match(/^\/api\/runs\/([\w-]+)(\/.*)?$/);
    if (m) {
      if (m[2] === '/events' && !runs.has(m[1])) return send(res, 200, history.get(m[1]) ?? []);
      const a = load(m[1]); if (!a) return send(res, 404, { error: 'Run not found. It may have been deleted.' });
      const rest = m[2] ?? '';
      if (!rest) return send(res, 200, { ...a, config: { format: a.config.format, label: a.config.label, notes: a.config.notes, text: a.config.text }, configs: Object.fromEntries(Object.entries(a.configs ?? {}).map(([d, c]) => [d, { format: c!.format, label: c!.label, text: c!.text }])) });
      const fm = rest.match(/^\/findings\/(.+)$/);
      // Investigate IDs contain ':' and spaces (INV:span:svc::op), so the id is URL-encoded by the client.
      if (fm && req.method === 'PATCH') { const fid = decodeURIComponent(fm[1]); const b = await body(req); const f = a.findings.find((x) => x.ruleId === fid || x.id === fid); if (!f) return send(res, 404, { error: 'Finding not found' }); if (b.verifyStatus) f.verifyStatus = b.verifyStatus; if (b.progress) f.progress = b.progress; save(m[1], a); return send(res, 200, f); }
      if (rest === '/preview') { const b = await body(req); const sel = new Set<string>(b.selected ?? []); const d = (b.deployment ?? a.deployment) as DeploymentType; const multi = (a.deployments ?? []).length > 1;
        const cfg = (multi ? a.configs?.[d] : a.config) ?? a.config;
        const fs = a.findings.filter((f) => !f.deployments || f.deployments.includes(d)).map((f) => ({ ...f, change: f.changes?.[d] ?? (multi && f.changes ? undefined : f.change), verifyStatus: sel.has(f.ruleId) ? ('verified' as const) : ('rejected' as const) }));
        try { const w = writeConfig(cfg, fs, { deployment: d === 'helm' ? 'helm' : 'collector' }); return send(res, 200, { deployment: d, text: w.text, rows: diffLines(cfg.text ?? '', w.text), applied: w.applied, skipped: w.skipped, notes: w.notes, protectedRemoved: w.protectedRemoved }); }
        catch (e) { return send(res, 422, { error: (e as Error).message }); } }
      if (rest === '/bundle') {
        // Everything in one zip, named after the customer. draft=true watermarks every report and includes unverified findings.
        const b = await body(req); const draft = !!b.draft; const o = await produceOutputs(a, { allowDraft: draft });
        if (a.artifacts?.labelCsv) o.files[`${a.options.spanMetric}_ALL_SERVICES_unique_labels.csv`] = a.artifacts.labelCsv;
        const folder = `${reportBaseName(a.customer.name)}${draft ? ' (draft)' : ''} ${new Date().toISOString().slice(0, 10)}`;
        const zip = createZip(Object.fromEntries(Object.entries(o.files).map(([n, c]) => [`${folder}/${n}`, c])));
        const fname = `${reportBaseName(a.customer.name)}${draft ? ' (draft)' : ''}.zip`;
        res.writeHead(200, { 'content-type': 'application/zip', 'content-length': zip.length, 'content-disposition': `attachment; filename="${fname.replace(/"/g, '')}"; filename*=UTF-8''${encodeURIComponent(fname)}`, 'cache-control': 'no-store' });
        res.end(zip); return;
      }
      if (rest === '/outputs') { const b = await body(req); const o = await produceOutputs(a, { allowDraft: !!b.allowDraft }); if (a.artifacts?.labelCsv) o.files['labels.csv'] = a.artifacts.labelCsv; return send(res, 200, o); }
      if (rest === '/events') return send(res, 200, history.get(m[1]) ?? [{ type: 'done', id: m[1] }]);
      if (rest === '/report') { const aud = url.searchParams.get('audience') === 'customer' ? 'customer' : 'internal';
        if (!upgrades.has(m[1])) upgrades.set(m[1], (await produceOutputs(a, {}).catch(() => null))?.upgrade ?? null);
        let r = buildReport(a, { audience: aud, upgrade: upgrades.get(m[1]), includeUnverified: url.searchParams.get('draft') === 'true' }); if (aud === 'customer') r = scrubReport(r, a.customer.internalTerms); return send(res, 200, r); }
    }
    return send(res, 404, { error: `No route for ${req.method} ${p}` });
  } catch (e) { return send(res, 500, { error: String((e as Error).message ?? e) }); }
}

export function start(port = +(process.env.CXLENS_PORT ?? 4319)) {
  const server = createServer((q, r) => void handle(q, r));
  const wss = new WebSocketServer({ noServer: true });
  server.on('upgrade', (req, sock, head) => {
    const u = new URL(req.url ?? '/', 'http://127.0.0.1');
    if (u.pathname !== '/ws' || u.searchParams.get('token') !== TOKEN) { sock.destroy(); return; }
    wss.handleUpgrade(req, sock, head, (ws) => { const id = u.searchParams.get('run') ?? ''; if (!subs.has(id)) subs.set(id, new Set()); subs.get(id)!.add(ws); for (const m of history.get(id) ?? []) ws.send(JSON.stringify(m)); ws.on('close', () => subs.get(id)?.delete(ws)); });
  });
  server.listen(port, '127.0.0.1', () => { console.log(`${BRAND.name} API on http://127.0.0.1:${port}  (token required; UI ${uiDir ? 'served' : 'not built'})`); if (process.env.CXLENS_PRINT_TOKEN) console.log(`token=${TOKEN}`); });
  return server;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) start();
