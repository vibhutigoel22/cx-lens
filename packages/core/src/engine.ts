import type { AnalyzerPlugin, AnalyzerContext, AssessOptions, Detection } from './analyzers/base.js';
import { DEFAULT_OPTIONS, windowHours } from './analyzers/base.js';
import { universalPlugins } from './analyzers/universal.js';
import { logsPlugins } from './analyzers/logs.js';
import { tracesPlugins } from './analyzers/traces.js';
import { metricsPlugins } from './analyzers/metrics.js';
import { detectGaps } from './analyzers/gaps.js';
import { investigate } from './investigate/index.js';
import { investigateMetrics } from './investigate/metrics.js';
import { runSpanNameSkill, runBucketSkill } from './investigate/skills.js';
import { labelInventory, investigateLabels, type LabelInventory } from './investigate/labels.js';
import { loadCatalogue, Catalogue } from './rules/catalogue.js';
import { parseConfig, ParsedConfig } from './config/parse.js';
import type { AdoptionGap, Connector, CustomerContext, DeploymentType, Finding, Pillar, ProgressEvent, QueryEvidence, UsageStats, VersionInfo } from './types.js';
import { DEPLOYMENT_LABEL } from './types.js';

export interface AssessInput {
  connector: Connector; customer: CustomerContext; pillars: Pillar[]; deployment: DeploymentType;
  configText?: string; versions?: VersionInfo; options?: Partial<AssessOptions>;
  extraPlugins?: AnalyzerPlugin[]; onProgress?: (e: ProgressEvent) => void;
  /** Several deployment types at once (e.g. EKS + ECS + EC2), each with its own optional config and versions. The first is the primary. */
  deployments?: DeploymentType[]; configs?: Partial<Record<DeploymentType, string>>; versionsBy?: Partial<Record<DeploymentType, VersionInfo>>;
}
/** Checks that read a collector config: run once per deployment type. Everything else reads Coralogix data: run once. */
export const CONFIG_RULES = new Set(['UNI-GROUPBYATTRS', 'UNI-K8SATTR-ALLOWLIST', 'UNI-MEMLIMIT-BATCH', 'UNI-OTLP-COMPRESSION', 'UNI-PROTECTED-LABEL-REMOVED', 'UNI-UPGRADE', 'METRIC-CARDINALITY-LIMIT', 'METRIC-NO-PROB-SAMPLER', 'METRIC-SCRAPE-INTERVAL', 'METRIC-SPAN-SANITIZATION']);
export interface Assessment {
  findings: Finding[]; gaps: AdoptionGap[]; usage: UsageStats | null; config: ParsedConfig; versions: VersionInfo;
  progress: ProgressEvent[]; skipped: { id: string; reason: string }[]; eligibility: string[]; options: AssessOptions;
  deployment: DeploymentType; deployments: DeploymentType[]; configs: Partial<Record<DeploymentType, ParsedConfig>>; versionsBy: Partial<Record<DeploymentType, VersionInfo>>;
  platformSplit?: { pillar: 'logs' | 'traces'; deployment: string; share: number }[];
  pillars: Pillar[]; customer: CustomerContext; startedAt: string; finishedAt: string; connectorId: string;
  artifacts: { labelCsv?: string };
  /** Metric labels ranked by usage (Metric Usage API or PromQL). */
  labelInventory?: LabelInventory;
  /** Checks that found no data or were skipped, in plain words, shown in the reports and the app. */
  notes: string[];
}

export function allPlugins(cat: Catalogue = loadCatalogue()): AnalyzerPlugin[] {
  return [...universalPlugins(cat), ...logsPlugins(cat), ...tracesPlugins(cat), ...metricsPlugins(cat)];
}

const PREFIX: Record<Pillar, string> = { universal: 'UNI', logs: 'LOG', traces: 'SPAN', metrics: 'METRIC' };
const FIXED_IDS = new Set(['UNI-UPGRADE']);

export async function runAssessment(input: AssessInput): Promise<Assessment> {
  const cat = loadCatalogue();
  const opts: AssessOptions = { ...DEFAULT_OPTIONS, ...input.options, sampling: { ...DEFAULT_OPTIONS.sampling, ...(input.options?.sampling ?? {}) } };
  // Keep windows and limits in safe ranges: 1 h to 7 days for volume checks, 1 to 60 min for duplicate checks.
  const clamp = (v: unknown, lo: number, hi: number, d: number) => { const n = Math.round(Number(v)); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d; };
  if (opts.range) {
    const s = Date.parse(opts.range.start), e = Date.parse(opts.range.end);
    if (!Number.isFinite(s) || !Number.isFinite(e)) throw new Error('The custom range needs a valid start and end date and time.');
    if (e > Date.now() + 5 * 60e3) throw new Error('The custom range ends in the future. Pick an end time that has already passed.');
    if (e - s < 3600e3) throw new Error('The custom range must be at least 1 hour long.');
    if (e - s > 168 * 3600e3) throw new Error('The custom range can be at most 7 days long.');
    opts.range = { start: new Date(s).toISOString(), end: new Date(e).toISOString() };
    opts.windowHours = (e - s) / 3600e3; // exact length, used to scale results to a day
  }
  if (!opts.range) opts.windowHours = clamp(opts.windowHours, 1, 168, 24); opts.dupWindowMinutes = clamp(opts.dupWindowMinutes, 1, 60, 15); opts.rowLimit = clamp(opts.rowLimit, 10, 2000, 200);
  const deps: DeploymentType[] = input.deployments?.length ? [...new Set(input.deployments)] : [input.deployment];
  const primary = deps[0]; input = { ...input, deployment: primary, configText: input.configs?.[primary] ?? input.configText, versions: input.versionsBy?.[primary] ?? input.versions };
  const configs: Partial<Record<DeploymentType, ParsedConfig>> = Object.fromEntries(deps.map((d) => [d, parseConfig((d === primary ? input.configText : input.configs?.[d]) ?? '')]));
  const versionsBy: Partial<Record<DeploymentType, VersionInfo>> = Object.fromEntries(deps.map((d) => [d, (d === primary ? input.versions : input.versionsBy?.[d]) ?? {}]));
  const config = configs[primary]!;
  const progress: ProgressEvent[] = [];
  const emit = (e: ProgressEvent) => { e = Object.fromEntries(Object.entries(e).filter(([, v]) => v !== undefined)) as ProgressEvent; const i = progress.findIndex((p) => p.checkId === e.checkId); if (i >= 0) progress[i] = { ...progress[i], ...e }; else progress.push(e); input.onProgress?.(e); };
  const startedAt = new Date().toISOString();
  const usage = await input.connector.getUsageStats(30).catch(() => null);
  const cache = new Map<string, Promise<QueryEvidence>>();
  let current = '';
  const ctx: AnalyzerContext = {
    connector: input.connector, cat, config, deployment: input.deployment, versions: input.versions ?? {}, usage, customer: input.customer, opts, shared: new Map(),
    progress: (e) => emit({ checkId: e.checkId ?? current, title: e.title, status: e.status, message: e.message, query: e.query }),
    query(ruleId, queryId, params = {}, rawKeys = []) {
      const r = cat.rules[ruleId]; const def = [...(r?.detect?.queries ?? []), ...((r as any)?.detectQueries ?? [])].find((q: any) => q.id === queryId);
      if (!def) return Promise.resolve({ id: queryId, language: 'dataprime', pillar: 'logs', text: '', window: '24h', limit: 0, error: `Query ${ruleId}/${queryId} not in catalogue` } as QueryEvidence);
      let text: string = def.dataprime; for (const [k, v] of Object.entries(params)) text = text.split(`{${k}}`).join(rawKeys.includes(k) ? v : v.replace(/'/g, "\\'"));
      const isDup = /m$/.test(def.window) && windowHours(def.window) <= 1 && /dup/.test(queryId);
      let window = isDup ? `${opts.dupWindowMinutes}m` : def.window === '24h' ? `${opts.windowHours}h` : def.window;
      // Exact range: volume checks cover the whole range; short checks (duplicates, samples) use its final minutes.
      let start: string | undefined, end: string | undefined;
      if (opts.range) {
        end = opts.range.end;
        const mins = isDup ? opts.dupWindowMinutes : def.window === '24h' ? Math.round(opts.windowHours * 60) : windowHours(def.window) * 60;
        window = `${mins}m`; start = new Date(Date.parse(end) - mins * 60e3).toISOString();
        if (!isDup && def.window === '24h') start = opts.range.start;
      }
      // Which data to query: the query's own pillar, else the pillar of the catalogue file the rule lives in.
      const pillar = def.pillar === 'traces' || (!def.pillar && r?.pillar === 'traces') ? 'traces' : 'logs';
      const req = { id: `${ruleId}/${queryId}`, language: 'dataprime' as const, pillar: pillar as 'logs' | 'traces', text, window, limit: Math.min(def.limit ?? 50, opts.rowLimit), ...(start ? { start, end } : {}) };
      const key = `${pillar}|${start ?? ''}|${window}|${req.limit}|${text}`;
      if (!cache.has(key)) { emit({ checkId: current, title: current, status: 'running', query: text }); cache.set(key, input.connector.runQuery(req).catch((e) => ({ ...req, error: String(e?.message ?? e) }))); }
      return cache.get(key)!;
    },
  };

  const eligibility: string[] = [];
  if (input.customer.nearRenewal) eligibility.push('The customer is close to renewal. Coordinate with the account owner before sharing this review.');
  if (input.customer.teamCanVerify === false) eligibility.push('The customer team cannot take part in the Verify step. Unverified changes can break dashboards, alerts or platform features.');

  const multi = deps.length > 1;
  const ctxFor = (d: DeploymentType): AnalyzerContext => ({ ...ctx, config: configs[d]!, deployment: d, versions: versionsBy[d] ?? {} });
  const plugins = [...allPlugins(cat), ...(input.extraPlugins ?? [])].filter((p) => input.pillars.includes(p.pillar) && p.deploymentTypes.some((d) => deps.includes(d)));
  const order: Pillar[] = ['universal', 'logs', 'traces', 'metrics'];
  plugins.sort((a, b) => order.indexOf(a.pillar) - order.indexOf(b.pillar));
  for (const p of plugins) emit({ checkId: p.id, title: p.title, status: 'waiting' });

  const raw: Finding[] = []; const skipped: Assessment['skipped'] = [];
  for (const p of plugins) {
    current = p.id; emit({ checkId: p.id, title: p.title, status: 'running' });
    try {
      const applies = deps.filter((d) => p.deploymentTypes.includes(d));
      // Config checks: once per deployment type with that type's config. Data checks: once, with a config change per type.
      const runs: { c: AnalyzerContext; dep?: DeploymentType }[] = multi && CONFIG_RULES.has(p.id) ? applies.map((d) => ({ c: ctxFor(d), dep: d })) : [{ c: applies.includes(primary) ? ctx : ctxFor(applies[0]) }];
      let liveCount = 0; let reason: string | undefined; const liveDets: Detection[] = [];
      for (const run of runs) {
        const det = await p.detect(run.c);
        const list = (Array.isArray(det) ? det : det ? [det] : []) as Detection[];
        const live = list.filter((d) => d.applicable); if (!live.length) { reason ??= list.find((d) => d.skippedReason)?.skippedReason; continue; }
        for (const d of live) {
          const f = toFinding(p, d, run.c, cat);
          if (run.dep) { f.deployments = [run.dep]; f.ruleId = `${p.id}@${run.dep}`; f.title = `${DEPLOYMENT_LABEL[run.dep]}: ${f.title}`; }
          else if (multi) { f.deployments = applies; f.changes = Object.fromEntries(applies.map((dep) => [dep, p.generateConfigPatch(d, ctxFor(dep))]).filter(([, ch]) => ch)); }
          raw.push(f); liveCount++; liveDets.push(d);
        }
      }
      if (!liveCount) { if (reason) skipped.push({ id: p.id, reason }); emit({ checkId: p.id, title: p.title, status: reason ? 'skipped' : 'done', message: reason ?? 'Nothing to improve' }); continue; }
      const live = liveDets;
      const failed = live.flatMap((d) => d.evidence).filter((e) => e?.error);
      emit({ checkId: p.id, title: p.title, status: 'done', message: `${live.length} finding${live.length > 1 ? 's' : ''}${failed.length ? ` (${failed.length} query error${failed.length > 1 ? 's' : ''})` : ''}` });
    } catch (e) {
      skipped.push({ id: p.id, reason: (e as Error).message }); emit({ checkId: p.id, title: p.title, status: 'failed', message: (e as Error).message });
    }
  }
  // Investigate mode: live samples + Claude analysis, every suggestion validated by Lens with real data.
  const investigateNotes: string[] = [];
  let inventory: LabelInventory | undefined; let labelsDone = false;
  if (input.pillars.includes('metrics') && input.connector.promql) { try { current = 'LABELS'; inventory = await labelInventory(ctx); } catch (e) { investigateNotes.push(`Label inventory failed: ${(e as Error).message}`); } }
  if (opts.investigate?.enabled && input.connector.askAI) {
    current = 'INVESTIGATE'; emit({ checkId: 'INVESTIGATE', title: 'Investigate with Claude', status: 'running' });
    const found: Finding[] = []; const max = Math.min(15, Math.max(3, opts.investigate.maxContributors || 8));
    try {
      if (input.pillars.includes('logs') || input.pillars.includes('traces')) {
        const inv = await investigate(ctx, { enabled: true, maxContributors: max });
        found.push(...inv.findings.filter((f) => input.pillars.includes(f.pillar))); investigateNotes.push(...inv.notes);
      }
      if (input.pillars.includes('metrics')) {
        const mi = await investigateMetrics(ctx, Math.min(8, max)); found.push(...mi.findings); investigateNotes.push(...mi.notes);
        if (inventory) { const li = await investigateLabels(ctx, inventory).catch((e) => ({ findings: [], notes: [`Label analysis failed: ${(e as Error).message}`] })); found.push(...li.findings); investigateNotes.push(...li.notes); labelsDone = true; }
        const sk = opts.investigate.skills ?? { spanNames: true, buckets: true };
        if (sk.spanNames !== false) { const r = await runSpanNameSkill(ctx, mi.totalSeries).catch((e) => ({ note: `span-name skill failed: ${(e as Error).message}` })); if ('note' in r) investigateNotes.push(r.note); else found.push(r); }
        if (sk.buckets !== false) { const r = await runBucketSkill(ctx, opts.investigate.vendor || 'none / Coralogix-only', mi.totalSeries, mi.top).catch((e) => ({ note: `bucket skill failed: ${(e as Error).message}` })); if ('note' in r) investigateNotes.push(r.note); else found.push(r); }
      }
      raw.push(...found);
      // Playbook rules that act on the same data stay visible but out of the combined total.
      if (found.some((f) => f.pillar === 'logs' && f.savings.kind === 'units')) for (const f of raw) if (['LOG-LOW-VALUE', 'LOG-MULTILINE', 'LOG-DEDUP', 'LOG-SEVERITY'].includes(f.ruleId) && f.savings.kind === 'units') { f.countedInTotal = false; f.caveats.push('Shown for reference. Investigate findings cover the same log data, so this estimate is not added to the combined total.'); }
      const v = found.filter((f) => f.savings.kind === 'units').length;
      emit({ checkId: 'INVESTIGATE', title: 'Investigate with Claude', status: found.length || !investigateNotes.length ? 'done' : 'skipped', message: found.length ? `${found.length} finding${found.length > 1 ? 's' : ''} (${v} with a validated saving)` : investigateNotes[0] });
      if (!found.length && investigateNotes.length) skipped.push({ id: 'INVESTIGATE', reason: investigateNotes[0] });
    } catch (e) { skipped.push({ id: 'INVESTIGATE', reason: (e as Error).message }); emit({ checkId: 'INVESTIGATE', title: 'Investigate with Claude', status: 'failed', message: `Investigate stopped: ${(e as Error).message}. The rest of the review continues.` }); }
  } else if (opts.investigate?.enabled) skipped.push({ id: 'INVESTIGATE', reason: 'Investigate mode needs the claude CLI. It was not available, so only the playbook checks ran.' });
  // Label fixes need no Claude for well-known shapes: run them whenever metrics were reviewed.
  if (inventory && !labelsDone && input.pillars.includes('metrics')) { emit({ checkId: 'FINISHING', title: 'Finishing up', status: 'running', message: 'Analysing metric labels (this can take a few minutes on large accounts)' }); try { const li = await investigateLabels({ ...ctx, progress: (e) => emit({ checkId: 'FINISHING', title: 'Finishing up', status: 'running', message: e.message }) }, inventory); raw.push(...li.findings); investigateNotes.push(...li.notes); } catch (e) { investigateNotes.push(`Label analysis failed: ${(e as Error).message}`); } }
  let platformSplit: Assessment['platformSplit'];
  if (multi) { try { const PL: Record<string, string> = { aws_eks: 'Kubernetes', aws_ecs: 'ECS', aws_ec2: 'EC2', gcp_kubernetes_engine: 'Kubernetes', azure_aks: 'Kubernetes' }; platformSplit = [];
    for (const [rid, pil] of [['LOG-BASELINE', 'logs'], ['SPAN-BASELINE', 'traces']] as const) { const e = await ctx.query(rid, 'by-platform'); const rs = (e.rows ?? []) as any[]; const tot = rs.reduce((x, r) => x + Number(r.n ?? 0), 0) || 1;
      // Kubernetes nodes on AWS report cloud.platform = aws_ec2, so a k8s cluster name wins over the platform.
      const agg = new Map<string, number>(); for (const r of rs) { const dep = r.cluster ? 'Kubernetes' : PL[String(r.platform)] ?? (r.platform ? String(r.platform) : 'Not tagged'); agg.set(dep, (agg.get(dep) ?? 0) + Number(r.n ?? 0)); }
      for (const [dep, n] of [...agg].sort((x, y) => y[1] - x[1])) platformSplit.push({ pillar: pil, deployment: dep, share: n / tot }); } } catch { platformSplit = undefined; } }
  emit({ checkId: 'FINISHING', title: 'Finishing up', status: 'running', message: 'Checking adoption gaps and preparing results' });
  current = 'gaps';
  const gaps = input.pillars.length ? await detectGaps(ctx).catch(() => []) : [];
  const findings = assignIds(raw);
  emit({ checkId: 'FINISHING', title: 'Finishing up', status: 'done', message: 'Done' });
  const la: any = ctx.shared.get('labels');
  const artifacts = la ? { labelCsv: la.csv.map((r: string[]) => r.map((c) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(',')).join('\n') + '\n' } : {};
  if (ctx.shared.get('spanMetricsMissing')) investigateNotes.push(`No span metrics found: no metric carries a span_name label, so span-metric checks had no data.`);
  for (const s of skipped) if (!investigateNotes.some((n) => n === s.reason)) investigateNotes.push(`${s.id}: ${s.reason}`);
  return { deployments: deps, configs, versionsBy, platformSplit, labelInventory: inventory, notes: investigateNotes, artifacts, findings, gaps, usage, config, versions: input.versions ?? {}, progress, skipped, eligibility, options: opts, deployment: input.deployment, pillars: input.pillars, customer: input.customer, startedAt, finishedAt: new Date().toISOString(), connectorId: input.connector.id };
}

function toFinding(p: AnalyzerPlugin, d: Detection, ctx: AnalyzerContext, cat: Catalogue): Finding {
  const rec = p.recommend(d, ctx); const rule = cat.rules[p.id];
  const savings = p.estimateSavings(d, ctx);
  const change = p.generateConfigPatch(d, ctx);
  return {
    id: p.id, ruleId: p.id, pillar: p.pillar, title: rec.title ?? p.title, plain: rec.plain ?? rule?.plain ?? p.title, detail: rec.detail,
    evidence: d.evidence.filter(Boolean), observedVolume: d.observedVolume, savings, phase: d.phaseOverride ?? p.defaultPhase, effort: p.defaultEffort, owner: p.owner,
    priority: d.priority ?? (rule?.priority === 'high' ? 'high' : 'normal'), verifyChecklist: p.verifyChecklist,
    verifyStatus: d.forceStatus ?? (savings.kind === 'needs-scoping' ? 'needs-scoping' : 'candidate'),
    progress: savings.kind === 'needs-scoping' ? 'pending' : 'not-started', overlapsWith: p.overlapsWith, change,
    caveats: [...(rec.caveats ?? []), ...(rule?.notes ?? [])], nextStep: rec.nextStep, sources: p.sources, drafts: rec.drafts, display: rec.display,
  };
}

/** Order by phase, then savings; number per pillar (LOG-1, SPAN-1 …). UNI-UPGRADE keeps its fixed id. */
export function assignIds(fs: Finding[]): Finding[] {
  const sorted = [...fs].sort((a, b) => a.phase - b.phase || (b.priority === 'high' ? 1 : 0) - (a.priority === 'high' ? 1 : 0) || (b.savings.unitsPerDay ?? -1) - (a.savings.unitsPerDay ?? -1));
  const n: Record<string, number> = {};
  for (const f of sorted) { if (FIXED_IDS.has(f.ruleId)) { f.id = f.ruleId; continue; } const px = PREFIX[f.pillar]; n[px] = (n[px] ?? 0) + 1; f.id = `${px}-${n[px]}`; }
  // translate overlapsWith (rule ids) to display ids for the report, keeping rule ids for logic
  return sorted;
}
