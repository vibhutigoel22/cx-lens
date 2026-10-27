import type { Report } from './builder.js';
import { fmtGb, fmtUnits } from '../units/calculator.js';
import { renderReportHtml } from './html.js';
import { analysisSentence, utcText } from './builder.js';

const PHASE_ICON: Record<number, string> = { 1: '🟢', 2: '🟡', 3: '🟠' };
const PILLAR: Record<string, string> = { universal: '⚙️ Universal', logs: '📖 Logs', traces: '🔍 Traces', metrics: '📉 Metrics' };
const STATUS: Record<string, string> = { 'not-started': '🔴 Not started', 'in-progress': '🟡 In progress', done: '🟢 Done', pending: '⚪ Pending' };
const EFFORT: Record<string, string> = { low: '🟢 Low', medium: '🟡 Medium', 'medium-high': '🟠 Medium–High', high: '🟠 High' };
const savingsCell = (f: Report['findings'][0]) => f.savings.kind === 'units' ? `**${fmtUnits(f.savings.unitsPerDay)} units**` : f.savings.kind === 'needs-scoping' ? 'TBD — needs scoping' : f.savings.kind === 'severity-only' ? 'Severity fix only' : f.savings.kind === 'not-covered' ? 'Not covered by official guidance' : 'No unit change';
const esc = (s: unknown) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

/** Glossary: explain technical terms the first time they appear. */
const GLOSSARY: [RegExp, string][] = [
  [/\bunits\b/, 'units (Coralogix’s billing measure: 1 unit = $1.50 of usage, priced per GB by data type and tier)'],
  [/\bTCO tier\b/, 'TCO tier (the storage priority — High, Medium or Low — that sets the price per GB)'],
  [/\btail sampling\b/i, 'tail sampling (deciding which traces to keep after the whole trace is seen)'],
  [/\bspan metrics\b/i, 'span metrics (request, error and latency metrics generated from traces)'],
  [/\bcollector\b/, 'collector (the OpenTelemetry agent that ships telemetry to Coralogix)'],
];
function glossify(md: string) { for (const [re, rep] of GLOSSARY) { let done = false; md = md.replace(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'), (m) => (done ? m : ((done = true), rep))); } return md; }

export function renderMarkdown(r: Report): string {
  const L: string[] = [];
  if (r.draft) L.push('> ⚠️ **DRAFT** — includes findings not yet verified with your team.', '');
  L.push(`# ${r.product} — Telemetry Health & Value Review`, '', `> 📅 **${r.header.date}** · **Environment:** ${r.header.customer} (\`${r.header.environment}\`) · **Prepared by:** ${r.header.preparedBy}`, '');
  if (r.eligibility.length && r.audience === 'internal') L.push(...r.eligibility.map((e) => `> ⚠️ ${e}`), '');
  { const S = r.leadership; const nm: Record<string, string> = { metrics: 'Metrics', traces: 'Traces', logs: 'Logs' };
    L.push(`## Leadership summary`, '', `_One slide for ${S.audience}. Savings shown in Coralogix units only._`, '',
      `**~${S.saving.toFixed(1)} units/day** we can stop spending${S.baseline !== null ? ` (${S.baseline.toFixed(1)} → ~${S.after!.toFixed(1)} units/day, −${S.pct!.toFixed(1)}%)` : ''}: about ${Math.round(S.perMonth).toLocaleString('en-US')} units a month and ${Math.round(S.perYear).toLocaleString('en-US')} a year${S.quickWinShare !== null ? `, ${Math.round(S.quickWinShare * 100)}% from config-only quick wins` : ''}.`, '',
      '| Data type | Units/day today | Saving/day |', '|---|---|---|', ...S.pillars.map((p) => `| ${nm[p.pillar]} | ${p.units.toFixed(1)} | ${p.saving > 0 ? `−${p.saving.toFixed(1)} (${p.units ? Math.round((p.saving / p.units) * 100) : 0}%)` : 'not yet reduced'} |`), '',
      ...(S.top.length ? ['**Largest changes:**', '', ...S.top.map((x) => `- ${x.title}: ~${x.unitsPerDay.toFixed(1)} units/day`), ''] : []),
      ...(S.nextPrize ? [`**Next prize:** ${nm[S.nextPrize.pillar].toLowerCase()} are ${Math.round(S.nextPrize.share)}% of daily units and ${S.nextPrize.savedShare <= 0 ? 'have no savings booked yet' : `have only ${S.nextPrize.savedShare.toFixed(1)}% savings found so far`}.`, ''] : []),
      '---', '', '# Technical details', ''); }
  L.push('## 🔍 What is this report?', '', r.intro, '');
  L.push('## 📊 Top-line summary', '', '| Metric | Value |', '|---|---|',
    `| Current daily unit consumption | **${r.summary.currentUnitsPerDay === null ? 'Not available' : `${r.summary.currentUnitsPerDay.toFixed(1)} units/day`}** |`,
    `| Total identified savings potential | **${fmtUnits(r.summary.identifiedUnitsPerDay)} units/day${r.summary.identifiedPct !== null ? ` (~${r.summary.identifiedPct.toFixed(0)}%)` : ''}** |`,
    `| Quick wins available (Phase 1, no app changes) | **${r.summary.phase1.count} findings · ${fmtUnits(r.summary.phase1.unitsPerDay)} units/day** |`,
    `| Findings pending scoping | **${r.summary.pendingScoping} findings** |`, '', `_${analysisSentence(r)}_`, '');
  L.push('## 🗺 Phased roadmap', '', 'Findings are grouped by **effort**, not by size, so the largest saving can sit in Phase 2.', '', '| Phase | Goal | Typical timeframe | Effort | Cumulative savings |', '|---|---|---|---|---|',
    ...r.roadmap.map((p) => `| ${PHASE_ICON[p.phase]} **${p.name}** | ${p.goal} | ${p.timeframe} | ${p.effort} | **${fmtUnits(p.cumulativeUnitsPerDay)} units/day** |`), '',
    '> 💡 **Recommendation:** Start Phase 1 now — these changes carry essentially no risk. Use the early wins to schedule Phases 2 and 3.', '');
  if (r.versionStatus) {
    const vs = r.versionStatus; L.push('## 🔄 Version status', '', '| Component | Current | Latest |', '|---|---|---|');
    if (vs.helmChart) L.push(`| otel-integration Helm chart | ${vs.helmChart.current ?? 'unknown'} | ${vs.helmChart.latest ?? '—'} |`);
    if (vs.collector) L.push(`| OpenTelemetry Collector | ${vs.collector.current ?? 'unknown'} | ${vs.collector.latest ?? '—'} |`);
    L.push('', `Breaking changes found: **${vs.breakingFound}** (auto-fixed ${vs.autoFixed}, manual ${vs.manual}).${vs.assumedLatest ? ' No version was given, so the latest was assumed.' : ''}${vs.checkedAt ? ` Checked ${vs.checkedAt.slice(0, 10)}.` : ''}`, '');
  }
  L.push('## 🏆 Ranked optimization opportunities', '', '| # | ID | Pillar | Optimization | Volume | Est. savings / day | Effort | Phase | Status |', '|---|---|---|---|---|---|---|---|---|',
    ...r.findings.map((f) => `| ${f.rank} | ${f.id} | ${PILLAR[f.pillar]} | ${esc(f.title)}${f.priority === 'high' ? ' ⚠️' : ''} | ${esc(f.observedVolume ?? '—')} | ${savingsCell(f)} | ${EFFORT[f.effort]} | ${f.phase} | ${STATUS[f.progress]} |`), '');
  for (const o of r.overlaps) L.push(`> ⚠️ ${o.note}`, '');
  L.push('## 💰 Combined potential', '', '| Scenario | Est. savings / day |', '|---|---|',
    ...(r.combined.largest ? [`| ${r.combined.largest.id} (${esc(r.combined.largest.title)}) alone | Up to **${fmtUnits(r.combined.largest.unitsPerDay)} units** |`] : []),
    `| All Phase 1 (Quick Wins) combined | Up to **${fmtUnits(r.combined.phase1)} units** |`,
    `| **Realistic combined total (all phases)** | **${fmtUnits(r.combined.realistic)} units/day${r.combined.realisticPct !== null ? ` — ~${r.combined.realisticPct.toFixed(0)}% reduction from today` : ''}** |`, '', `> ⚠️ **Disclaimer:** ${r.combined.disclaimer}`, '');
  if (r.trend.length) {
    L.push('## 📈 Usage trend — last 30 days', '', '| Date | Total | Logs | Traces | Metrics |', '|---|---|---|---|---|', ...r.trend.map((t) => `| ${t.date.slice(0, 10)} | ${t.total.toFixed(2)} | ${t.logs.toFixed(2)} | ${t.traces.toFixed(2)} | ${t.metrics.toFixed(2)} |`), '');
  }
  if (r.labels && r.labels.rows.length) { const api = r.labels.source === 'usage-api'; L.push('## 🏷 Top cardinality and usage labels', '', api ? `_Exact usage from the Metric Usage API${r.labels.date ? ` for ${r.labels.date}` : ''}._` : '_Measured with PromQL; add a DataAnalytics key for exact units._', '', `| Label | Metrics | Unique values | ${api ? 'Units/day | % of metric usage' : 'Series'} | Flag |`, `|---|---|---|${api ? '---|---' : '---'}|---|`, ...r.labels.rows.map((l) => `| \`${l.name}\` | ${l.metricCount ?? '—'} | ${l.unique.toLocaleString('en-US')} | ${api ? `${(l.units ?? 0).toFixed(2)} | ${((l.fraction ?? 0) * 100).toFixed(2)}%` : (l.series ?? 0).toLocaleString('en-US')} | ${l.locked ? (l.locked === 'protected' ? 'Protected' : 'Needed') : l.kind === 'normal' ? '' : l.kind} |`), ''); }
  L.push('## 🔬 Detailed findings', '');
  for (const ph of [1, 2, 3] as const) {
    const fs = r.findings.filter((f) => f.phase === ph); if (!fs.length) continue;
    L.push(`### ${PHASE_ICON[ph]} ${r.roadmap[ph - 1].name}`, '');
    for (const f of fs) {
      L.push(`#### ${f.rank}. ${f.id} · ${f.title}`, '', `**${savingsCell(f).replace(/\*\*/g, '')}/day · Effort: ${EFFORT[f.effort].slice(3)} · Owner: ${f.owner}**`, '', f.plain, '');
      if (f.detail) L.push(f.detail.split('\n').map((x) => (x ? `> ${x}` : '>')).join('\n'), '');
      const q = f.evidence.find((e) => e.text && e.language === 'dataprime');
      if (f.source === 'investigate' && f.display?.validation) L.push('**See these records in Coralogix:**', '', '```sql', `source ${f.pillar === 'traces' ? 'spans' : 'logs'}${r.analysis.range ? '' : ` last ${r.analysis.windowHours}h`} | ${f.display.validation.query} | limit 50`, '```', '');
      else if (q) L.push(...(q.start && q.end ? [`_Run over ${utcText(q.start)} to ${utcText(q.end)}_`, '', '```sql', `source ${q.pillar === 'traces' ? 'spans' : 'logs'} | ${q.text.replace(/^source (logs|spans) \| /, '')}`] : ['```sql', `source ${q.pillar === 'traces' ? 'spans' : 'logs'} last ${q.window} | ${q.text.replace(/^source (logs|spans) \| /, '')}`]), '```', '');
      if (f.observedVolume) L.push(`**Observed volume:** ${f.observedVolume}`, '');
      const ds = f.display?.samples; if (ds?.items.length) { L.push(`**${ds.label}${ds.items.some((i) => i.after !== undefined) ? ', before → after' : ''}:**`, ''); for (const s of ds.items.slice(0, 3)) { L.push('```text', s.before, '```'); if (s.after !== undefined) L.push('→', '```text', s.after, '```'); } if (ds.afterNote) L.push(`_${ds.afterNote}_`); L.push(''); }
      const dv = f.display?.validation; if (dv) L.push(`**${dv.ok ? 'Validated against live data' : 'Not validated'}:** ${dv.result}`, '', '```sql', dv.query, '```', '');
      const di = f.display?.impact; if (di?.length) L.push('| ' + di.map((i) => i.label).join(' | ') + ' |', '|' + di.map(() => '---').join('|') + '|', '| ' + di.map((i) => i.value).join(' | ') + ' |', '');
      if (f.savings.gbPerDay !== null) L.push(`**Volume affected:** ${fmtGb(f.savings.gbPerDay)}/day. _How this was estimated:_ ${f.savings.basis}`, '');
      if (f.change?.snippet) L.push('**Config change:**', '', '```yaml', f.change.snippet.trim(), '```', '');
      if (f.overlapsWithIds.length) L.push(`**Overlaps with:** ${f.overlapsWithIds.join(', ')}`, '');
      for (const c of f.caveats) L.push(`> 📌 ${c}`);
      if (f.caveats.length) L.push('');
      L.push(`**Next step:** ${f.nextStep}`, '');
      if (r.audience === 'internal') { L.push(`_Verify status: ${f.verifyStatus}. Sources: ${f.sources.map((s) => (s.url ? `[${s.title}](${s.url})` : s.title)).join(' · ')}_`, ''); }
      else if (f.sources.length) L.push(`_References: ${f.sources.filter((s) => s.url).map((s) => `[${s.title}](${s.url})`).join(' · ')}_`, '');
    }
  }
  if (r.upgrade) {
    const u = r.upgrade; L.push('## ⬆️ Upgrade', '', `From ${u.from.chart ? `chart ${u.from.chart} / ` : ''}collector ${u.from.collector ?? 'unknown'} to ${u.to.chart ? `chart ${u.to.chart} / ` : ''}collector ${u.to.collector}.`, '',
      '| Version | Component | What changed | Status |', '|---|---|---|---|', ...u.changes.map((c) => `| ${c.version} | ${esc(c.component)} | ${esc(c.what)} | ${c.status} |`), '');
    const man = u.changes.filter((c) => c.status === 'Manual action needed');
    if (man.length) L.push('**Manual actions:**', '', ...man.map((c) => `- v${c.version} ${c.component}: ${c.explanation ?? c.what}`), '');
    if (u.denylistRecheck.length) L.push('**Denylist recheck:**', '', ...u.denylistRecheck.map((d) => `- ${d}`), '');
    L.push('**Safe upgrade steps:**', '', ...u.steps.map((s, i) => `${i + 1}. ${s}`), '');
  }
  if (r.gaps.length) L.push('## 🚀 Adoption gaps and expansion opportunities', '', '| Area | What we saw | Opportunity |', '|---|---|---|', ...r.gaps.map((g) => `| ${g.area} | ${esc(g.detail)} | ${esc(g.opportunity)} |`), '', r.headroom, '');
  L.push('## ✅ Next steps', '', '| Owner | Action | By when |', '|---|---|---|', ...r.nextSteps.map((n) => `| ${n.owner} | ${n.action} | ${n.byWhen} |`), '',
    '> Once Phase 1 is live, re-run the assessment and update the Status column — this report is meant to be revisited, not a one-time snapshot.', '');
  if (r.internal && r.checkNotes.length) L.push('### Checks that found no data', '', ...r.checkNotes.map((n) => `- ${n}`), '');
  if (r.internal) L.push('---', '', '### Internal appendix', '', `Connector: ${r.internal.connector} · Rules v${r.internal.rulesVersion} · Config: ${r.internal.configLabel} · Run ${r.internal.startedAt} → ${r.internal.finishedAt}`, '', ...r.internal.skipped.map((s) => `- Skipped ${s.id}: ${s.reason}`), '');
  return glossify(L.join('\n'));
}

/** HTML in the approved report design (see html.ts). Used for customer-ready and internal reports. */
export function renderHtml(r: Report): string { return renderReportHtml(r); }

function trendSvg(t: Report['trend']): string {
  const W = 900, H = 220, P = 36; const max = Math.max(...t.map((x) => x.total), 0.001);
  const line = (k: 'total' | 'logs' | 'traces' | 'metrics') => t.map((x, i) => `${(P + (i * (W - 2 * P)) / Math.max(1, t.length - 1)).toFixed(1)},${(H - P - (x[k] / max) * (H - 2 * P)).toFixed(1)}`).join(' ');
  const colors = { total: 'var(--fg)', logs: '#0e7c86', traces: '#6b4fd8', metrics: '#c98a00' } as const;
  return `<figure><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Units per day, last ${t.length} days"><line x1="${P}" y1="${H - P}" x2="${W - P}" y2="${H - P}" stroke="var(--line)"/>${(['total', 'logs', 'traces', 'metrics'] as const).map((k) => `<polyline fill="none" stroke="${colors[k]}" stroke-width="${k === 'total' ? 2.2 : 1.6}" points="${line(k)}"/>`).join('')}<text x="${P}" y="18">${max.toFixed(2)} units/day</text><text x="${P}" y="${H - 10}">${t[0].date.slice(0, 10)}</text><text x="${W - P - 70}" y="${H - 10}">${t.at(-1)!.date.slice(0, 10)}</text>${(['total', 'logs', 'traces', 'metrics'] as const).map((k, i) => `<text x="${W - P - 280 + i * 70}" y="18" style="fill:${colors[k]}">● ${k}</text>`).join('')}</svg><figcaption style="color:var(--mut);font-size:13px">Overall, logs, traces and metrics units per day, generated from usage data.</figcaption></figure>`;
}

/** Tiny Markdown → HTML for our own controlled output (headings, tables, quotes, code, lists, bold, links). */
export function mdToHtml(md: string): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inline = (s: string) => esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/_([^_]+)_/g, '<em>$1</em>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2">$1</a>').replace(/&lt;br&gt;/g, '<br>');
  const lines = md.split('\n'); const out: string[] = []; let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (l.startsWith('```')) { const buf: string[] = []; i++; while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++]); i++; out.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`); continue; }
    if (/^#{1,4} /.test(l)) { const n = l.match(/^#+/)![0].length; out.push(`<h${n}>${inline(l.slice(n + 1))}</h${n}>`); i++; continue; }
    if (l.startsWith('|')) { const rows: string[] = []; while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]); const cells = (r: string) => r.slice(1, -1).split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));
      out.push(`<table><thead><tr>${cells(rows[0]).map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.slice(2).map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`); continue; }
    if (l.startsWith('>')) { const buf: string[] = []; while (i < lines.length && lines[i].startsWith('>')) buf.push(lines[i++].replace(/^> ?/, '')); out.push(`<blockquote>${buf.map(inline).join('<br>')}</blockquote>`); continue; }
    if (/^(- |\d+\. )/.test(l)) { const ord = /^\d/.test(l); const buf: string[] = []; while (i < lines.length && /^(- |\d+\. )/.test(lines[i])) buf.push(lines[i++].replace(/^(- |\d+\. )/, '')); out.push(`<${ord ? 'ol' : 'ul'}>${buf.map((b) => `<li>${inline(b)}</li>`).join('')}</${ord ? 'ol' : 'ul'}>`); continue; }
    if (l.trim() === '---') { out.push('<hr>'); i++; continue; }
    if (l.trim()) out.push(`<p>${inline(l)}</p>`); i++;
  }
  return out.join('\n');
}
