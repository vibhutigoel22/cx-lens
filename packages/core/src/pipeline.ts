import type { Assessment } from './engine.js';
import { writeConfig } from './config/writer.js';
import { unifiedDiff } from './config/diff.js';
import { validateConfig } from './config/validate.js';
import { upgradeConfig, breakingChangesMarkdown, UpgradeResult } from './versions/upgrader.js';
import { fetchText, CONTRIB_CHANGELOG, CORE_CHANGELOG, CHART_CHANGELOG, CHART_README } from './versions/resolver.js';
import { buildReport } from './report/builder.js';
import { renderHtml, renderMarkdown } from './report/render.js';
import { checkCustomerSafe, scrubReport } from './report/scrub.js';
import { compareVersions } from './versions/semver.js';
import { loadChartSchema, validateHelmValues } from './config/helm-schema.js';
import { DEPLOYMENT_FOLDER, DEPLOYMENT_LABEL, type DeploymentType } from './types.js';

export interface Outputs {
  files: Record<string, string>; warnings: string[]; schemaChecks: { file: string; chart: string; errors: string[] }[]; reportNames: ReturnType<typeof reportFileNames>;
  upgrade: UpgradeResult | null; customerIssues: ReturnType<typeof checkCustomerSafe>;
}

/** Produce every export: optimized/upgraded config, diffs, breaking changes, TCO drafts, report.json/md/html (internal + customer). */
/** Safe, readable file name from the customer name (used for every report file). */
export function reportBaseName(customer: string): string {
  const n = (customer ?? '').replace(/[\\/:*?"<>|\u0000-\u001f]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/^\.+/, '').slice(0, 80);
  return n || 'Coralogix Lens report';
}
/** Report file names for a customer: "<Customer>.html", "<Customer> (internal).html", plus " (draft)" for draft exports. */
export function reportFileNames(customer: string, draft = false) {
  const b = reportBaseName(customer) + (draft ? ' (draft)' : ''); const i = `${reportBaseName(customer)} (internal${draft ? ', draft' : ''})`;
  return { customerHtml: `${b}.html`, customerMd: `${b}.md`, customerJson: `${b}.json`, internalHtml: `${i}.html`, internalMd: `${i}.md`, internalJson: `${i}.json` };
}

export async function produceOutputs(a: Assessment, opts: { allowDraft?: boolean; offline?: boolean } = {}): Promise<Outputs> {
  const files: Record<string, string> = {}; const warnings: string[] = [];
  const deps = a.deployments?.length ? a.deployments : [a.deployment]; const multi = deps.length > 1;
  const upgrades: (UpgradeResult & { deployment: DeploymentType })[] = []; const schemaChecks: Outputs['schemaChecks'] = [];
  // Same check helm runs: validate generated values against the target chart's own schema.
  const checkSchema = async (file: string, text: string, version?: string) => { if (!version || opts.offline) return; try { const cs = await loadChartSchema(version); const errors = validateHelmValues(text, cs); schemaChecks.push({ file, chart: version, errors }); for (const e of errors) warnings.push(`${file} does not pass the otel-integration ${version} schema: ${e}`); } catch (e) { warnings.push(`Could not check ${file} against the chart schema: ${(e as Error).message}`); } };
  for (const d of deps) {
    const cfg = (multi ? a.configs?.[d] : a.config) ?? a.config; const pre = multi ? `${DEPLOYMENT_FOLDER[d]}/` : ''; const tag = multi ? `${DEPLOYMENT_LABEL[d]}: ` : '';
    // Findings for this type, with this type's config change.
    const fs = a.findings.filter((f) => !f.deployments || f.deployments.includes(d)).map((f) => ({ ...f, change: f.changes?.[d] ?? (multi && f.changes ? undefined : f.change) }));
    const hasConfig = cfg.format === 'helm-values' || cfg.format === 'collector';
    const w = writeConfig(cfg, fs, { allowDraft: opts.allowDraft, deployment: d === 'helm' ? 'helm' : 'collector' });
    files[`${pre}optimized-config.yaml`] = w.text;
    if (d === 'helm') await checkSchema(`${pre}optimized-config.yaml`, w.text, ((multi ? a.versionsBy?.[d] : a.versions) ?? {}).helmChart?.current);
    if (hasConfig) { files[`${pre}original-config.yaml`] = cfg.text; files[`${pre}optimized-config.diff`] = unifiedDiff(cfg.text, w.text, 'original-config.yaml', 'optimized-config.yaml'); }
    warnings.push(...w.notes.map((n) => tag + n), ...w.skipped.filter((s) => !/status is/.test(s.reason)).map((s) => `${tag}${s.findingId}: ${s.reason}`));
    if (w.protectedRemoved.length) warnings.push(`${tag}Removed protected labels from existing denylists: ${w.protectedRemoved.join(', ')}`);
    const val = validateConfig(w.text, cfg.format === 'empty' ? 'snippet' : cfg.format);
    if (!val.yamlOk) warnings.push(`${tag}YAML check failed: ${val.yamlErrors.join('; ')}`);
    if (val.collector && 'skipped' in val.collector) warnings.push(tag + val.collector.skipped); else if (val.collector && !val.collector.ok) warnings.push(`${tag}otelcol validate failed: ${val.collector.output}`);
    const v = (multi ? a.versionsBy?.[d] : a.versions) ?? {}; const toC = v.collector?.latest;
    const outdated = (v.collector?.current && toC && compareVersions(v.collector.current, toC) < 0) || (v.helmChart?.current && v.helmChart.latest && compareVersions(v.helmChart.current, v.helmChart.latest) < 0);
    if (hasConfig && outdated && toC) {
      try {
        const get = async (u: string, n: string) => (opts.offline ? '' : (await fetchText(u, n)).text);
        const [contribMd, coreMd, chartMd, chartReadme] = await Promise.all([get(CONTRIB_CHANGELOG, 'contrib-CHANGELOG.md'), get(CORE_CHANGELOG, 'core-CHANGELOG.md'), d === 'helm' ? get(CHART_CHANGELOG, 'chart-CHANGELOG.md') : Promise.resolve(''), d === 'helm' ? get(CHART_README, 'chart-README.md') : Promise.resolve('')]);
        const up = upgradeConfig({ ...cfg, text: w.text }, { fromCollector: v.collector?.current, toCollector: toC, fromChart: v.helmChart?.current, toChart: v.helmChart?.latest, contribMd, coreMd, chartMd, chartReadme });
        upgrades.push({ ...up, deployment: d });
        files[`${pre}upgraded-config.yaml`] = up.text; if (d === 'helm') await checkSchema(`${pre}upgraded-config.yaml`, up.text, v.helmChart?.latest); files[`${pre}upgraded-config.diff`] = unifiedDiff(cfg.text, up.text, 'original-config.yaml', 'upgraded-config.yaml'); files[`${pre}breaking-changes.md`] = breakingChangesMarkdown(up);
      } catch (e) { warnings.push(`${tag}Upgrade analysis unavailable: ${(e as Error).message}`); }
    }
  }
  const upgrade: UpgradeResult | null = upgrades.find((u) => u.deployment === deps[0]) ?? upgrades[0] ?? null;
  const drafts = a.findings.flatMap((f) => (f.drafts ?? []).map((d) => ({ finding: f.id, ...d })));
  if (drafts.length) files['tco-policy-drafts.json'] = JSON.stringify({ note: 'DRAFTS ONLY — Coralogix Lens never creates policies. Review, then create with `cx tco create --from-file` or the UI.', drafts }, null, 2);
  const internal = buildReport(a, { audience: 'internal', upgrade, upgrades, draft: opts.allowDraft });
  let customer = buildReport(a, { audience: 'customer', upgrade, upgrades, includeUnverified: opts.allowDraft, draft: opts.allowDraft });
  customer = scrubReport(customer, a.customer.internalTerms);
  const cmd = renderMarkdown(customer);
  const issues = checkCustomerSafe(cmd, a.customer.internalTerms);
  const fn = reportFileNames(a.customer.name, !!opts.allowDraft);
  files[fn.internalJson] = JSON.stringify(internal, null, 2);
  files[fn.customerJson] = JSON.stringify(customer, null, 2);
  files[fn.internalMd] = renderMarkdown(internal); files[fn.internalHtml] = renderHtml(internal);
  files[fn.customerMd] = cmd; files[fn.customerHtml] = renderHtml(customer);
  if (a.artifacts.labelCsv) files[`${a.options.spanMetric}_ALL_SERVICES_unique_labels.csv`] = a.artifacts.labelCsv;
  return { files, warnings, schemaChecks, upgrade, customerIssues: issues, reportNames: fn };
}
