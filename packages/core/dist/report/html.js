import { windowPhrase, utcText } from './builder.js';
import { BRAND } from '../brand.js';
import { REPORT_CSS, SLIDE_CSS, CORALOGIX_LOGO, FONT_LINKS } from './template-assets.js';
import { LENS_MARK_DATA_URI } from './brand-mark.js';
/** Coralogix Lens mark next to the product name (generated from brand/logo.png by scripts/build-icons.mjs). */
const LENS_MARK = `<img class="lens-mark" src="${LENS_MARK_DATA_URI}" alt="" width="22" height="22">`;
const LENS_MARK_CSS = '.brandline .prod{display:inline-flex;align-items:center;gap:8px}.lens-mark{width:22px;height:22px;border-radius:6px;flex:none}';
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Escape, then turn `inline code` into <code>. */
const rich = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2">$1</a>');
const u = (v) => (v == null ? 'TBD' : v >= 10 ? `~${v.toFixed(1)}` : `~${v.toFixed(v >= 1 ? 2 : 3)}`);
const n1 = (v) => v.toLocaleString('en-US', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const day = (iso, year = true) => { const d = new Date(iso.slice(0, 10) + 'T00:00:00Z'); return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}${year ? ` ${d.getUTCFullYear()}` : ''}`; };
const anchor = (id) => id.toLowerCase();
const PILLAR = { universal: ['Universal', 'p-universal'], logs: ['Logs', 'p-logs'], traces: ['Traces', 'p-traces'], metrics: ['Metrics', 'p-metrics'] };
const EFFORT = { low: ['Low', 'e-low'], medium: ['Medium', 'e-med'], 'medium-high': ['Medium–High', 'e-high'], high: ['High', 'e-high'] };
const STATUS = { 'not-started': ['Not started', 's-todo'], 'in-progress': ['In progress', 's-progress'], done: ['Done', 's-done'], pending: ['Pending scoping', 's-pending'] };
const VERIFY = { verified: 'Verified', rejected: 'Rejected', 'needs-scoping': 'Needs scoping', candidate: 'Candidate' };
const PHASE_NAME = { 1: 'Quick wins', 2: 'Coordinated changes', 3: 'Strategic' };
const listJoin = (a) => (a.length <= 1 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a.at(-1)}`);
/** Plain-language glossary: explained the first time each term appears in prose. */
function glossary() {
    const terms = [
        [/\btail sampling\b/i, ' (deciding which traces to keep after the whole trace is seen)'],
        [/\bcollector\b/i, ' (the OpenTelemetry agent that ships telemetry to Coralogix)'],
        [/\bspan metrics\b/i, ' (request, error and latency metrics generated from traces)'],
        [/\bTCO tier\b/, ' (the storage priority, High, Medium or Low, that sets the price per GB)'],
    ];
    const used = new Set();
    return (text) => { let out = text; terms.forEach(([re, add], i) => { if (used.has(i))
        return; const m = out.match(re); if (m && m.index !== undefined) {
        used.add(i);
        out = out.slice(0, m.index + m[0].length) + add + out.slice(m.index + m[0].length);
    } }); return out; };
}
function savingCell(f, max) {
    if (f.savings.kind === 'units')
        return `<div class="sv"><strong>${u(f.savings.unitsPerDay)}</strong><span class="sv-bar"><i style="width:${Math.max(1.5, ((f.savings.unitsPerDay ?? 0) / (max || 1)) * 100).toFixed(1)}%"></i></span></div>`;
    const t = f.savings.kind === 'needs-scoping' ? 'TBD, needs scoping' : f.savings.kind === 'severity-only' ? 'Severity fix only' : f.savings.kind === 'not-covered' ? 'Not covered by official guidance' : 'No unit change';
    return `<div class="sv"><span class="muted">${t}</span></div>`;
}
function savingHead(f) {
    if (f.savings.kind === 'units')
        return `<div class="f-saving"><b>${u(f.savings.unitsPerDay)}</b><span>units/day</span></div>`;
    const [b, s] = f.savings.kind === 'needs-scoping' ? ['TBD', 'needs scoping'] : f.savings.kind === 'severity-only' ? ['Severity', 'fix only'] : f.savings.kind === 'not-covered' ? ['Not covered', 'by official guidance'] : ['No change', 'to units'];
    return `<div class="f-saving tbd"><b>${b}</b><span>${s}</span></div>`;
}
const codeBlock = (label, body) => `<div class="code"><div class="code-head"><span>${esc(label)}</span><button type="button" class="copy" aria-label="Copy ${esc(label.toLowerCase())}">Copy</button></div><pre><code>${esc(body)}</code></pre></div>`;
function trendSection(r) {
    const t = r.trend;
    if (t.length < 2)
        return '';
    const W = 900, H = 260, L = 48, R = 884, B = 226, T = 22;
    const max = Math.max(...t.map((x) => x.total), 0.001);
    const step = (() => { const raw = max / 6; const p = 10 ** Math.floor(Math.log10(raw)); return [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= raw); })();
    const top = Math.ceil(max / step) * step;
    const x = (i) => L + (i * (R - L)) / (t.length - 1);
    const y = (v) => B - (v / top) * (B - T);
    const partial = t.at(-1).date.slice(0, 10) === r.header.date;
    const grid = [];
    for (let v = 0; v <= top + 1e-9; v += step)
        grid.push(`<line x1="${L}" x2="${R}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" class="grid"/><text x="${L - 8}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end">${+v.toFixed(2)}</text>`);
    const series = [['total', 'var(--fg)', 2.4], ['logs', 'var(--c-logs)', 1.8], ['traces', 'var(--c-traces)', 1.8], ['metrics', 'var(--c-metrics)', 1.8]];
    const lines = series.map(([k, c, w]) => {
        const full = t.map((p, i) => `${x(i).toFixed(1)},${y(p[k]).toFixed(1)}`);
        const solid = partial ? full.slice(0, -1) : full;
        return `<polyline fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" points="${solid.join(' ')}"/>` + (partial ? `\n<polyline fill="none" stroke="${c}" stroke-width="${w}" stroke-dasharray="3 4" opacity=".6" points="${full.slice(-2).join(' ')}"/>` : '');
    }).join('\n');
    const done = partial ? t.slice(0, -1) : t;
    const mn = Math.min(...done.map((p) => p.total)), mx = Math.max(...done.map((p) => p.total));
    const share = (k) => (done.reduce((a, p) => a + p[k], 0) / Math.max(1e-9, done.reduce((a, p) => a + p.total, 0))) * 100;
    const sh = ['logs', 'traces', 'metrics'].map((k) => [k, share(k)]).sort((a, b) => b[1] - a[1]);
    const sub = `Total units per day range between about ${n1(mn)} and ${n1(mx)}. ${sh[0][0][0].toUpperCase() + sh[0][0].slice(1)} make up about ${sh[0][1].toFixed(0)}%, ${sh[1][0]} ${sh[1][1].toFixed(0)}% and ${sh[2][0]} ${sh[2][1].toFixed(0)}%.`;
    const xl = [0, Math.floor((t.length - 1) / 2), t.length - 1].map((i) => `<text x="${x(i).toFixed(1)}" y="${H - 10}" text-anchor="${i === 0 ? 'start' : i === t.length - 1 ? 'end' : 'middle'}">${day(t[i].date, false)}</text>`).join('');
    return `<section id="trend">
<h2>Usage trend, last ${t.length} days</h2>
<p class="sec-sub">${esc(sub)}</p>
<div class="chart"><div class="legend"><span><i style="background:var(--fg)"></i>Total</span><span><i style="background:var(--c-logs)"></i>Logs</span><span><i style="background:var(--c-traces)"></i>Traces</span><span><i style="background:var(--c-metrics)"></i>Metrics</span></div><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(`Units per day over the last ${t.length} days. ${sub}`)}">
${grid.join('\n')}
${lines}
${xl}</svg>
<p class="chart-cap">Units per day by data type, generated from usage data.${partial ? ` The last point (${day(t.at(-1).date, false)}) is the current day and is still partial.` : ''}</p>
<details class="how"><summary>Show daily figures</summary><div class="tbl"><table><thead><tr><th>Date</th><th>Total</th><th>Logs</th><th>Traces</th><th>Metrics</th></tr></thead><tbody>${t.map((p) => `<tr><td>${p.date.slice(0, 10)}</td><td>${p.total.toFixed(2)}</td><td>${p.logs.toFixed(2)}</td><td>${p.traces.toFixed(2)}</td><td>${p.metrics.toFixed(2)}</td></tr>`).join('')}</tbody></table></div></details>
</div>
</section>`;
}
function findingArticle(f, r, gl) {
    const internal = r.audience === 'internal';
    const d = f.display ?? {};
    const meta = [`<div class="meta-item"><span>Effort</span><b>${EFFORT[f.effort]?.[0] ?? esc(f.effort)}</b></div>`, `<div class="meta-item"><span>Owner</span><b>${esc(f.owner)}</b></div>`];
    if (f.overlapsWithIds.length)
        meta.push(`<div class="meta-item"><span>Overlaps with</span><b>${f.overlapsWithIds.map((i) => `<a href="#${anchor(i)}">${esc(i)}</a>`).join(', ')}</b></div>`);
    if (f.deployments && r.deploymentRows.length > 1)
        meta.push(`<div class="meta-item"><span>Applies to</span><b>${f.deployments.map((d) => DLABEL[d] ?? d).join(', ')}</b></div>`);
    if (internal)
        meta.push(`<div class="meta-item"><span>Verify status</span><b class="vs vs-${f.verifyStatus}">${VERIFY[f.verifyStatus]}</b></div>`);
    const parts = [];
    parts.push(`<p class="why">${rich(gl(f.plain))}</p>`);
    if (d.chips?.items.length)
        parts.push(`<div class="chips-wrap"><span class="chips-label">${esc(d.chips.label)}</span><div class="chips">${d.chips.items.map((c) => `<code class="chip">${esc(c)}</code>`).join('')}</div></div>`);
    if (d.policy)
        parts.push(`<div class="policy"><span class="chips-label">Policy order</span><ol>${d.policy.items.map((p) => `<li><b>${esc(p.label)}</b> ${esc(p.text)}</li>`).join('')}</ol>${d.policy.kept ? `<div class="policy-kept">Estimated kept share <b>${esc(d.policy.kept)}</b></div>` : ''}</div>`);
    for (const nt of d.notes ?? [])
        parts.push(`<div class="note ${nt.kind === 'warn' ? 'n-warn' : 'n-info'}">${rich(nt.text)}</div>`);
    if (!d.chips && !d.bars && !d.table && !d.policy && f.detail && !(f.observedVolume && f.detail.startsWith(f.observedVolume)))
        parts.push(`<div class="note n-info">${rich(f.detail).replace(/\n/g, '<br>')}</div>`);
    const kv = [];
    if (f.observedVolume)
        kv.push(`<div class="kv"><span>Observed volume</span><p>${esc(f.observedVolume)}</p></div>`);
    if (f.savings.gbPerDay != null && f.savings.kind === 'units')
        kv.push(`<div class="kv"><span>Volume affected</span><p>${f.savings.gbPerDay >= 1 ? `${f.savings.gbPerDay.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} GB/day` : `${(f.savings.gbPerDay * 1000).toFixed(1)} MB/day`}</p></div>`);
    if (kv.length)
        parts.push(`<div class="kv-grid">${kv.join('')}</div>`);
    if (d.samples?.items.length) {
        const hasAfter = d.samples.items.some((i) => i.after !== undefined);
        parts.push(`<div class="samples"><div class="samples-head"><span>${esc(d.samples.label)}</span><span>${hasAfter ? 'Before → after the proposed change' : `${d.samples.items.length} record${d.samples.items.length > 1 ? 's' : ''}`}</span></div>${d.samples.items.slice(0, 3).map((s) => `<div class="pair${s.after === undefined ? ' single' : ''}"><pre class="b"><span class="lbl">${hasAfter ? 'Before' : 'Sample'}</span>${esc(s.before)}</pre>${s.after !== undefined ? `<pre class="a"><span class="lbl">After</span>${esc(s.after)}</pre>` : ''}</div>`).join('')}</div>${d.samples.afterNote ? `<p class="muted" style="font-size:13px;margin:-6px 0 12px">${esc(d.samples.afterNote)}</p>` : ''}`);
    }
    if (d.validation)
        parts.push(`<div class="validated${d.validation.ok ? '' : ' no'}"><b>${d.validation.ok ? 'Validated against live data' : 'Not validated'}</b>${esc(d.validation.result)}<br><code>${esc(d.validation.query)}</code></div>`);
    if (d.impact?.length)
        parts.push(`<div class="impact">${d.impact.map((i) => `<div><span>${esc(i.label)}</span><b>${esc(i.value)}</b></div>`).join('')}</div>`);
    if (d.bars?.items.length) {
        const mx = Math.max(...d.bars.items.map((b) => b.value), 1e-9);
        parts.push(`<div class="sub">${esc(d.bars.label)}</div><ol class="barlist">${d.bars.items.map((b) => `<li><span class="bl-name" title="${esc(b.name)}">${esc(b.name)}</span><span class="bl-bar"><i style="width:${((b.value / mx) * 100).toFixed(1)}%"></i></span><span class="bl-val">${esc(b.text)}</span></li>`).join('')}</ol>`);
    }
    if (d.table?.rows.length)
        parts.push(`<details class="how"><summary>${esc(d.table.summary)}</summary><div class="tbl"><table><thead><tr>${d.table.headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${d.table.rows.map((row) => `<tr>${row.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`);
    if (d.steps?.length)
        parts.push(`<ol class="steps">${d.steps.map((s) => `<li>${rich(s).replace(/(Settings(?: &gt; [A-Z][\w ]+)+)/g, (m) => `<b>${m.replace(/ &gt; /g, ' › ')}</b>`)}</li>`).join('')}</ol>`);
    if (f.savings.basis && f.savings.kind !== 'none-units')
        parts.push(`<details class="how"><summary>How this was estimated</summary><p>${rich(f.savings.basis)}</p></details>`);
    const q = f.evidence.find((e) => e.language === 'dataprime' && e.text && e.text !== 'skill');
    if (f.source === 'investigate' && d.validation) {
        const pl = f.pillar === 'traces' ? 'spans' : 'logs';
        const w = r.analysis.range ? '' : ` last ${r.analysis.windowHours}h`;
        parts.push(codeBlock('DataPrime query to see these records in Coralogix', `source ${pl}${w} | ${d.validation.query} | limit 50`));
    }
    else if (q)
        parts.push(q.start && q.end
            ? codeBlock(`DataPrime query, run over ${utcText(q.start)} to ${utcText(q.end)}`, `source ${q.pillar === 'traces' ? 'spans' : 'logs'} | ${q.text.replace(/^source (logs|spans) \| /, '')}`)
            : codeBlock('DataPrime query', `source ${q.pillar === 'traces' ? 'spans' : 'logs'} last ${q.window} | ${q.text.replace(/^source (logs|spans) \| /, '')}`));
    const perDep = f.changes ? Object.entries(f.changes).filter(([, c]) => c?.snippet?.trim()) : [];
    if (perDep.length > 1)
        for (const [d, c] of perDep)
            parts.push(codeBlock(`Collector config (${DLABEL[d] ?? d})`, c.snippet.trim()));
    else if (f.change?.snippet?.trim())
        parts.push(codeBlock(f.source === 'investigate' ? (f.change.snippet.startsWith('#') ? 'Change at the source' : 'Proposed transform (collector config)') : 'Collector config', f.change.snippet.trim()));
    for (const c of f.caveats)
        parts.push(`<div class="note n-info">${rich(c)}</div>`);
    parts.push(`<div class="next"><span>Next step</span><p>${rich(f.nextStep)}</p></div>`);
    const refs = f.sources.filter((s) => s.url && (internal || !s.internal));
    if (refs.length)
        parts.push(`<div class="refs"><span>References</span>${refs.map((s) => `<a href="${esc(s.url)}">${esc(s.title)}${s.internal ? ' (internal)' : ''}</a>`).join('')}</div>`);
    return `<article class="finding ph${f.phase}" id="${anchor(f.id)}">
<header class="f-head"><div class="f-id"><span class="f-no">${f.rank}</span><span class="fid">${esc(f.id)}</span>${f.source === 'investigate' ? '<span class="src-live">Found in live data</span>' : ''}</div><h4>${esc(f.title)}</h4>
${savingHead(f)}</header>
<div class="f-meta">${meta.join('')}</div>
${parts.join('\n')}
</article>`;
}
const DLABEL = { helm: 'Kubernetes', ecs: 'ECS', ec2: 'EC2', standalone: 'Standalone' };
const PCOLOR = { metrics: '#c98a00', traces: '#7a62e6', logs: '#0e9aa7' };
const PNAME = { metrics: 'Metrics', traces: 'Traces', logs: 'Logs' };
const n1x = (v) => (v >= 100 ? v.toFixed(1) : v >= 10 ? v.toFixed(1) : v.toFixed(v >= 1 ? 1 : 2));
const approx = (v) => `~${v >= 1000 ? Math.round(v / (v >= 10000 ? 100 : 10)) * (v >= 10000 ? 100 : 10) : v >= 100 ? Math.round(v / 10) * 10 : v >= 10 ? v.toFixed(0) : v.toFixed(1)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
/** One-slide leadership summary (16:9, presentable full screen). */
function leadershipSlide(r) {
    const L = r.leadership;
    const who = esc(r.header.customer);
    const range = L.baselineFrom && L.baselineTo ? `${day(L.baselineFrom, false).replace(/ \w+$/, '')}–${day(L.baselineTo)}` : '';
    const bars = L.pillars.map((p) => {
        const pct = p.units ? Math.min(100, (p.saving / p.units) * 100) : 0;
        const zero = p.saving <= 0;
        return `<div class="pl${zero ? ' zero' : ''}" style="--pc:${PCOLOR[p.pillar]}"><div class="pl-name">${PNAME[p.pillar]}<em>${n1x(p.units)}/day</em></div><div class="pl-bar" role="img" aria-label="${PNAME[p.pillar]}: ${zero ? 'no savings identified yet' : `about ${Math.round(pct)} percent saved`}">${zero ? '' : `<i style="width:${pct.toFixed(1)}%${pct < 2 ? ';min-width:3px' : ''}"></i>`}</div><div class="pl-val">${zero ? '0<em>not yet reduced</em>' : `−${n1x(p.saving)}<em>−${pct >= 1 ? Math.round(pct) : pct.toFixed(1)}% of ${p.pillar}</em>`}</div></div>`;
    }).join('\n   ');
    const qw = L.quickWinShare;
    const tiles = [`<div><b>${approx(L.perMonth)}</b><span>units saved per month</span></div>`, `<div><b>${approx(L.perYear)}</b><span>units saved per year</span></div>`,
        qw !== null ? `<div><b>${Math.round(qw * 100)}%</b><span>from config-only quick wins${Math.round(qw * 100) === 100 ? ', no app code changes' : ''}</span></div>` : ''].join('\n    ');
    const next = L.nextPrize ? `<p class="sl-next"><b>Next prize:</b> ${PNAME[L.nextPrize.pillar].toLowerCase()} ${L.nextPrize.pillar === 'metrics' ? 'are' : 'are'} ${Math.round(L.nextPrize.share)}% of daily units and ${L.nextPrize.savedShare <= 0 ? 'have no savings booked yet' : `have only ${L.nextPrize.savedShare.toFixed(1)}% savings found so far`}.${L.nextPrize.driver ? ` Biggest driver: <b style="color:inherit">${esc(L.nextPrize.driver.label)}</b> (${L.nextPrize.driver.unique.toLocaleString('en-US')} values${L.nextPrize.driver.share !== undefined ? `, ${L.nextPrize.driver.share.toFixed(0)}% of metric usage` : ''}).` : ' They are the focus of the next review.'}</p>` : '';
    return `<section id="exec-slide" aria-labelledby="exec-slide-title">
<div class="slide-bar">
 <div><h2 id="exec-slide-title">Leadership summary</h2><p>One slide for ${esc(L.audience)}. Savings shown in Coralogix units only.</p></div>
 <button class="present" type="button" id="present-btn">Present full screen</button>
</div>
<div class="slide-stage" id="slide-stage">
<div class="slide" role="group" aria-label="Savings summary slide">
 <button class="slide-x" type="button" id="slide-exit">Exit (Esc)</button>
 <div class="slide-in">
  <div class="sl-top"><span><b>${who}</b> observability savings plan</span><span>${r.draft ? '<span class="sl-draft">Draft, not yet verified</span> · ' : ''}Coralogix units, ${day(r.header.date)}</span></div>

  <div class="sl-left">
   <p class="sl-kick">Units we can stop spending every day</p>
   <p class="sl-big">${approx(L.saving)}<small>units/day</small></p>
   ${L.baseline !== null ? `<p class="sl-from">${n1x(L.baseline)} → ~${n1x(L.after)} units/day <span>(−${L.pct >= 1 ? L.pct.toFixed(1) : L.pct.toFixed(2)}%)</span></p>` : ''}
   <div class="sl-tiles">
    ${tiles}
   </div>
  </div>

  <div class="sl-right">
   <p class="sl-h">Share cut from each data type</p>
   ${bars}
   ${L.pipelineWide > 0 ? `<p class="sl-h" style="margin:.4cqw 0 0;font-weight:500">Plus ${approx(L.pipelineWide)} units/day across all data types (pipeline-wide changes)</p>` : ''}
   <ul class="drivers" aria-label="Savings by change">
    ${L.top.map((t) => `<li><span>${esc(t.title)}</span><b>${approx(t.unitsPerDay)}</b></li>`).join('\n    ')}
   </ul>
   ${next}
  </div>

  <div class="sl-foot"><span>${range ? `Baseline: average of ${range}. ` : ''}Estimates can vary by about ±20%; per-change figures are rounded.</span><span>Savings are confirmed only after ${who} verifies each change.</span></div>
 </div>
</div>
</div>
</section>`;
}
export function renderReportHtml(r) {
    const internal = r.audience === 'internal';
    const gl = glossary();
    const base = r.summary.currentUnitsPerDay;
    const real = r.combined.realistic;
    const pct = r.combined.realisticPct;
    const fs = r.findings;
    const maxU = Math.max(0, ...fs.map((f) => f.savings.unitsPerDay ?? 0));
    const pillars = [...new Set(fs.map((f) => PILLAR[f.pillar][0].toLowerCase()))];
    const nav = [['exec-slide', 'Leadership summary'], ['technical', 'Technical details'], ['roadmap', 'Roadmap'], ['opportunities', 'Opportunities'], ...(r.trend.length > 1 ? [['trend', 'Usage trend']] : []), ...(r.upgrade || r.upgrades.length ? [['upgrade', 'Upgrade']] : []), ...(r.labels && r.labels.rows.length ? [['labels', 'Labels']] : []), ['findings', 'Findings'], ...(r.gaps.length ? [['adoption', 'Expansion']] : []), ['next', 'Next steps'], ...(internal ? [['internal', 'Internal']] : [])];
    const env = r.header.environment && r.header.environment !== r.header.customer ? `${r.header.customer}, ${r.header.environment}` : r.header.customer;
    const kept = base != null ? Math.max(0, base - real) : null;
    const keepPct = base ? Math.max(8, Math.min(100, (kept / base) * 100)) : 100;
    const header = `<header class="top"><div class="wrap">
 <div class="bar"><div class="brandline">${CORALOGIX_LOGO}<span class="prod">${LENS_MARK}${esc(BRAND.short)}</span></div>${internal ? '<span class="internal-tag">Internal: not for customer distribution</span>' : ''}${r.draft ? '<span class="draft">Draft: includes findings not yet verified with your team</span>' : ''}</div>
 <h1>Telemetry health &amp; value review</h1>
 <p class="lede">A ranked view of where ${esc(r.header.customer)}’s observability spend is driven, and a phased plan to send cleaner telemetry without losing visibility into what matters.</p>
 <div class="facts"><div><span>Environment</span><b>${esc(env)}</b></div><div><span>Report date</span><b>${day(r.header.date)}</b></div><div><span>Prepared by</span><b>${esc(r.header.preparedBy)}</b></div></div>
</div></header>
<nav class="toc" aria-label="Report sections"><div class="wrap">
${nav.map(([id, l]) => `<a href="#${id}">${l}</a>`).join('')}
</div></nav>`;
    const summary = `<div class="part" id="technical"><span>Part 2</span><h2>Technical details</h2><p>How the savings were found and validated, the phased plan, every finding with its evidence and config change, and what to do next.</p></div>
<section id="summary">
<div class="stats">
 <div class="stat"><span>Current daily consumption</span><b>${base == null ? '—' : n1(base)}</b><em>units/day</em></div>
 <div class="stat"><span>Identified savings</span><b>${u(r.summary.identifiedUnitsPerDay)}</b><em>units/day</em></div>
 <div class="stat"><span>Quick wins (Phase 1)</span><b>${u(r.summary.phase1.unitsPerDay)}</b><em>units/day, ${r.summary.phase1.count} finding${r.summary.phase1.count === 1 ? '' : 's'}</em></div>
 <div class="stat"><span>Findings pending scoping</span><b>${r.summary.pendingScoping}</b><em>finding${r.summary.pendingScoping === 1 ? '' : 's'}</em></div>
</div>
${internal && r.eligibility.length ? r.eligibility.map((e) => `<div class="callout warn"><span class="ic">!</span><p>${esc(e)}</p></div>`).join('') : ''}
<div class="intro" style="margin-top:40px;grid-template-columns:1fr">
 <div><h2>What this report covers</h2>
 <p>${esc(r.intro.split('. Savings are shown')[0])}.</p>
 <p>Freed quota can be reinvested in new services, signals and features.</p></div>
</div>
</section>`;
    const vs = r.versionStatus;
    const verCard = (label, v) => {
        if (!v)
            return '';
        const cur = v.current ?? 'unknown';
        const up = !v.latest || cur === v.latest;
        return `<div class="ver"><div><span>${label}</span><b>${esc(cur)}</b></div>${up ? '<span class="ok">Latest</span>' : `<span class="behind">Latest is ${esc(v.latest)}</span>`}</div>`;
    };
    const roadmap = `<section id="roadmap">
<h2>Phased roadmap</h2>
<p class="sec-sub">Findings are grouped by effort, not by size, so the largest saving can sit in Phase 2.</p>
<div class="road">
${r.roadmap.map((p) => `<div class="phase ph${p.phase}"><span class="pn">Phase ${p.phase}</span><h4>${PHASE_NAME[p.phase]}</h4><p>${esc(gl(p.goal))}.</p>
  <dl><dt>Timeframe</dt><dd>${esc(p.timeframe)}</dd><dt>Effort</dt><dd>${esc(p.effort)}</dd></dl>
  <div class="cum">Cumulative savings<b>${u(p.cumulativeUnitsPerDay)} units/day</b><div class="track"><i style="width:${real > 0 ? Math.min(100, (p.cumulativeUnitsPerDay / real) * 100).toFixed(0) : 0}%"></i></div></div></div>`).join('\n')}
</div>
<div class="callout"><span class="ic">✓</span><p><b>Recommendation:</b> start Phase 1 now. These changes carry essentially no risk. Use the early wins to schedule Phases 2 and 3.</p></div>
${r.deploymentRows.length > 1 ? `<h3>Version status by deployment type</h3>
<div class="tbl"><table><thead><tr><th>Deployment</th><th>Config</th><th>Helm chart</th><th>OTel Collector</th></tr></thead><tbody>${r.deploymentRows.map((d) => `<tr><td><b>${esc(d.label)}</b></td><td>${esc(d.config)}</td><td>${d.helmChart ? `${esc(d.helmChart.current ?? 'unknown')}${d.helmChart.latest && d.helmChart.current !== d.helmChart.latest ? ` <span class="behind">latest ${esc(d.helmChart.latest)}</span>` : ' <span class="ok">Latest</span>'}` : '—'}</td><td>${d.collector ? `${esc(d.collector.current ?? 'unknown')}${d.collector.latest && d.collector.current !== d.collector.latest ? ` <span class="behind">latest ${esc(d.collector.latest)}</span>` : ' <span class="ok">Latest</span>'}` : '—'}</td></tr>`).join('')}</tbody></table></div>${r.platformSplit?.length ? `<h3>Volume by deployment type</h3><p class="ver-foot">From the <code>cloud.platform</code> resource attribute on logs and spans.</p><div class="tbl"><table><thead><tr><th>Data</th><th>Deployment</th><th>Share</th></tr></thead><tbody>${r.platformSplit.map((s) => `<tr><td>${s.pillar === 'logs' ? 'Logs' : 'Traces'}</td><td>${esc(s.deployment)}</td><td>${(s.share * 100).toFixed(1)}%</td></tr>`).join('')}</tbody></table></div>` : ''}` : vs ? `<h3>Version status</h3>
<div class="versions">
${verCard('otel-integration Helm chart', vs.helmChart)}
${verCard('OpenTelemetry Collector', vs.collector)}
</div>
<p class="ver-foot">Breaking changes found: <b>${vs.breakingFound}</b> (auto-fixed ${vs.autoFixed}, manual ${vs.manual}).${vs.assumedLatest ? ' No version was given, so the latest was assumed.' : ''}${vs.checkedAt ? ` Checked ${day(vs.checkedAt)}.` : ''}</p>` : ''}
</section>`;
    const numWord = (n) => ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'][n] ?? String(n);
    const overlapCallout = (o) => { const i = o.note.indexOf(' overlap: '); const ids = [...o.ids].sort(); return `<div class="callout warn"><span class="ic">!</span><p><b>${esc(listJoin(ids))} overlap:</b> ${esc(i >= 0 ? o.note.slice(i + 10) : o.note)}</p></div>`; };
    const largest = r.combined.largest;
    const opportunities = `<section id="opportunities">
<h2>Ranked optimization opportunities</h2>
<p class="sec-sub">${numWord(fs.length)} finding${fs.length === 1 ? '' : 's'}${pillars.length ? ` across ${listJoin(pillars)}` : ''}. Select an ID to jump to its details.</p>
<div class="tbl"><table class="rank"><thead><tr><th>#</th><th>ID</th><th>Optimization</th><th>Pillar</th><th>Est. savings / day</th><th>Effort</th><th>Phase</th><th>Status</th></tr></thead><tbody>${fs.map((f) => `<tr><td class="num">${f.rank}</td><td><a class="fid" href="#${anchor(f.id)}">${esc(f.id)}</a></td><td><div class="rk-title">${esc(f.title)}</div><div class="rk-vol">${esc(f.observedVolume ?? '—')}</div></td><td><span class="pill ${PILLAR[f.pillar][1]}">${PILLAR[f.pillar][0]}</span></td><td>${savingCell(f, maxU)}</td><td><span class="pill ${EFFORT[f.effort]?.[1] ?? 'e-low'}">${EFFORT[f.effort]?.[0] ?? esc(f.effort)}</span></td><td><span class="phase-dot ph${f.phase}">${f.phase}</span></td><td><span class="status ${STATUS[f.progress][1]}">${STATUS[f.progress][0]}</span>${internal ? `<div><span class="vs vs-${f.verifyStatus}">${VERIFY[f.verifyStatus]}</span></div>` : ''}</td></tr>`).join('')}</tbody></table></div>
${r.overlaps.map(overlapCallout).join('\n')}

<h3>Combined potential</h3>
<div class="combo">
 <div><span>All Phase 1 quick wins combined, up to</span><b>${u(r.combined.phase1)}</b> <em>units/day</em></div>
 ${largest ? `<div><span>${esc(largest.id)} alone (${esc(largest.title.charAt(0).toLowerCase() + largest.title.slice(1))}), up to</span><b>${u(largest.unitsPerDay)}</b> <em>units/day</em></div>` : '<div><span>Largest single finding</span><b>—</b></div>'}
 <div class="total"><span>Realistic combined total, all phases</span><b>${u(real)}</b> <em>units/day${pct != null ? `, ~${pct.toFixed(0)}% below today` : ''}</em></div>
</div>
<p class="ver-foot"><b>Disclaimer:</b> ${esc(r.combined.disclaimer.replace('This is', 'this is'))}</p>
</section>`;
    const KIND = { 'high-cardinality': 'High cardinality', churn: 'Churn (IDs)', constant: 'Same value everywhere', normal: '' };
    const labelsSec = r.labels && r.labels.rows.length ? `<section id="labels">
<h2>Top cardinality and usage labels</h2>
<p class="sec-sub">${r.labels.source === 'usage-api' ? `Exact usage per label from the Coralogix Metric Usage API${r.labels.date ? ` for ${day(r.labels.date)}` : ''}.` : 'Measured with PromQL through the cx CLI; usage shown as series (add a DataAnalytics key for exact units).'} ${internal ? 'Each tested fix links to its finding.' : 'Tested fixes link to their findings; a fix marked “pending verification” is not yet agreed with your team.'}</p>
<div class="tbl"><table><thead><tr><th>Label</th><th>Metrics</th><th>Unique values</th><th>${r.labels.source === 'usage-api' ? 'Units/day</th><th>% of metric usage' : 'Series'}</th><th>Flag</th><th>Tested fix</th></tr></thead><tbody>${r.labels.rows.map((l) => `<tr><td><code>${esc(l.name)}</code></td><td>${l.metricCount?.toLocaleString('en-US') ?? '—'}</td><td>${l.unique.toLocaleString('en-US')}</td>${r.labels.source === 'usage-api' ? `<td>${(l.units ?? 0).toFixed(2)}</td><td>${((l.fraction ?? 0) * 100).toFixed(2)}%</td>` : `<td>${(l.series ?? 0).toLocaleString('en-US')}</td>`}<td>${l.locked ? `<span class="muted">${l.locked === 'protected' ? 'Protected' : 'Needed by Coralogix'}</span>` : KIND[l.kind] ? `<span class="pill p-metrics">${KIND[l.kind]}</span>` : ''}</td><td>${l.fix ? (l.fix.findingId ? `<a href="#${anchor(l.fix.findingId)}">${esc(l.fix.text)}</a>` : `${esc(l.fix.text)} <span class="muted">(pending verification)</span>`) : ''}</td></tr>`).join('')}</tbody></table></div>
</section>` : '';
    const notesSec = r.checkNotes.length ? `<section id="checks"><h2>Checks that found no data</h2><p class="sec-sub">These checks ran but had nothing to work with, so they produced no findings.</p><ul>${r.checkNotes.map((n) => `<li>${rich(n)}</li>`).join('')}</ul></section>` : '';
    const up = r.upgrade;
    const upgrade = r.upgrades.length > 1 ? `<section id="upgrade"><h2>Upgrade</h2><p class="sec-sub">Each deployment type is upgraded from its own config. Clear changes are fixed in that type’s <code>upgraded-config.yaml</code> (<b>Fixed</b>); everything else needs a decision (<b>Decide</b>).</p>${r.upgrades.map((u) => `<h3>${esc(u.label)}: ${u.from.chart ? `chart ${esc(u.from.chart)} → ${esc(u.to.chart ?? '')}, ` : ''}collector ${esc(u.from.collector ?? 'unknown')} → ${esc(u.to.collector)}</h3><div class="tbl"><table><thead><tr><th>Version</th><th>Component</th><th>What changed</th><th>Status</th></tr></thead><tbody>${u.changes.map((c) => `<tr><td>${esc(c.version)}</td><td>${esc(c.component)}</td><td>${rich(c.what)}${c.explanation ? `<div class="up-why">${rich(c.explanation)}</div>` : ''}</td><td><span class="${c.status === 'Auto-fixed' ? 'st-auto' : c.status === 'Not applicable' ? 'st-na' : 'st-manual'}">${c.status === 'Auto-fixed' ? 'Fixed' : c.status === 'Not applicable' ? 'Not needed' : 'Decide'}</span></td></tr>`).join('')}</tbody></table></div>`).join('')}${up ? `<h3>Safe upgrade steps</h3><ol class="steps">${up.steps.map((s) => `<li>${rich(s)}</li>`).join('')}</ol>` : ''}</section>` : up ? `<section id="upgrade">
<h2>Upgrade</h2>
<p class="sec-sub">From ${up.from.chart ? `chart ${esc(up.from.chart)} and ` : ''}collector ${esc(up.from.collector ?? 'unknown')} to ${up.to.chart ? `chart ${esc(up.to.chart)} and ` : ''}collector ${esc(up.to.collector)}. Clear changes are fixed in <code>upgraded-config.yaml</code> (<b>Fixed</b>). Everything else is listed with an explanation and needs a decision (<b>Decide</b>).</p>
<div class="tbl"><table><thead><tr><th>Version</th><th>Component</th><th>What changed</th><th>Status</th></tr></thead><tbody>${[...up.changes].sort((a, b) => (a.component === 'otel-integration chart' ? 0 : 1) - (b.component === 'otel-integration chart' ? 0 : 1)).map((c) => `<tr><td>${esc(c.version)}</td><td>${esc(c.component)}</td><td>${rich(c.what)}${c.explanation ? `<div class="up-why">${rich(c.explanation)}</div>` : ''}</td><td><span class="${c.status === 'Auto-fixed' ? 'st-auto' : c.status === 'Not applicable' ? 'st-na' : 'st-manual'}">${c.status === 'Auto-fixed' ? 'Fixed' : c.status === 'Not applicable' ? 'Not needed' : 'Decide'}</span></td></tr>`).join('')}</tbody></table></div>
${up.denylistRecheck.map((d) => `<div class="note n-info">${rich(d)}</div>`).join('')}
<h3>Safe upgrade steps</h3>
<ol class="steps">${up.steps.map((s) => `<li>${rich(s)}</li>`).join('')}</ol>
</section>` : '';
    const findings = `<section id="findings">
<h2>Detailed findings</h2>
<p class="sec-sub">Each finding includes what we saw, the query to reproduce it, the config change and a single next step.</p>
${[1, 2, 3].map((ph) => { const list = fs.filter((f) => f.phase === ph); return list.length ? `<div class="phase-head ph${ph}"><span class="tag">Phase ${ph}</span><h3>${PHASE_NAME[ph]}</h3></div>\n${list.map((f) => findingArticle(f, r, gl)).join('')}` : ''; }).join('\n')}
${fs.length ? '' : '<p class="muted">No findings to report for the selected pillars.</p>'}
</section>`;
    const gaps = r.gaps.length ? `<section id="adoption">
<h2>Adoption gaps and expansion opportunities</h2>
<p class="sec-sub">Where ${esc(r.header.customer)} could get more from Coralogix with the quota freed up above.</p>
<div class="gaps">
${r.gaps.map((g) => ` <div class="gap"><h4>${esc(g.area === 'RUM' ? 'Real User Monitoring' : g.area)}</h4><p class="saw">${esc(g.detail)}</p><p class="opp">${esc(g.opportunity)}</p></div>`).join('\n')}
</div>
${real > 0 ? `<div class="reinvest"><b>${u(real)}</b><p>units/day of headroom${pct != null ? ` (${pct.toFixed(0)}% of today’s usage)` : ''} could be reinvested, for example in tracing for uninstrumented services, RUM, profiling or SLOs.</p></div>` : ''}
</section>` : '';
    const next = `<section id="next">
<h2>Next steps</h2>
<p class="sec-sub">This report is meant to be revisited, not a one-time snapshot. Once Phase 1 is live, re-run the assessment and update the status column.</p>
<ol class="timeline">
${r.nextSteps.map((s) => ` <li><time>${day(s.byWhen, false)}</time><span class="dot"></span><div class="card"><div class="who">${esc(s.owner)}</div><p class="what">${esc(s.action)}</p></div></li>`).join('\n')}
</ol>
</section>`;
    const appendix = internal && r.internal ? `<section id="internal">
<h2>Internal appendix</h2>
<p class="sec-sub">Run details and sources. This section is never included in the customer-ready report.</p>
<div class="appendix">
<div class="kv-grid"><div class="kv"><span>Connector</span><p>${esc(r.internal.connector)}</p></div><div class="kv"><span>Rule catalogue</span><p>v${esc(r.internal.rulesVersion)}</p></div><div class="kv"><span>Config</span><p>${esc(r.internal.configLabel)}</p></div><div class="kv"><span>Analysis window</span><p>${windowPhrase(r.analysis).replace(/^the l/, 'L')}; duplicates ${r.analysis.dupWindowMinutes} min; usage ${r.analysis.usageDays} complete days${r.analysis.partialDayExcluded ? ' (today excluded as partial)' : ''}</p></div><div class="kv"><span>Run</span><p>${esc(r.internal.startedAt.replace('T', ' ').slice(0, 16))} to ${esc(r.internal.finishedAt.slice(11, 16))} UTC</p></div></div>
${r.internal.configNotes.length ? `<span class="sub">Config notes</span><ul>${r.internal.configNotes.map((n) => `<li>${rich(n)}</li>`).join('')}</ul>` : ''}
${r.internal.skipped.length ? `<span class="sub" style="margin-top:14px">Skipped checks</span><ul>${r.internal.skipped.map((s) => `<li><b>${esc(s.id)}</b>: ${rich(s.reason)}</li>`).join('')}</ul>` : ''}
<details class="how"><summary>All sources used by the rule catalogue (${r.internal.sources.length})</summary><ul>${r.internal.sources.map((s) => `<li>${s.url ? `<a href="${esc(s.url)}">${esc(s.title)}</a>` : esc(s.title)}${s.internal ? ' (internal)' : ''}</li>`).join('')}</ul></details>
</div>
</section>` : '';
    const footer = `<footer><div class="wrap">${CORALOGIX_LOGO}<span>${esc(BRAND.name)} · ${internal ? 'Internal review for' : 'Prepared for'} ${esc(r.header.customer)} · ${day(r.header.date)}</span></div></footer>`;
    const script = `<script>
document.querySelectorAll('.copy').forEach(b=>b.addEventListener('click',async()=>{
 const t=b.closest('.code').querySelector('code').innerText;
 try{await navigator.clipboard.writeText(t);b.textContent='Copied'}catch(e){
  const r=document.createRange();r.selectNodeContents(b.closest('.code').querySelector('code'));const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selected'}
 setTimeout(()=>b.textContent='Copy',1600)}));
(()=>{const st=document.getElementById('slide-stage'),b=document.getElementById('present-btn'),x=document.getElementById('slide-exit');
if(!st||!b)return;if(!st.requestFullscreen){b.hidden=true;return}
b.addEventListener('click',()=>st.requestFullscreen().catch(()=>{}));
x.addEventListener('click',()=>document.exitFullscreen&&document.exitFullscreen());})();
</script>`;
    return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(BRAND.name)} — ${esc(r.header.customer)} telemetry health and value review${internal ? ' (internal)' : ''}</title>
${FONT_LINKS}
<style>
${REPORT_CSS}
${LENS_MARK_CSS}
${SLIDE_CSS}
</style>
</head>
<body>
${header}
<main class="wrap">

${leadershipSlide(r)}

${summary}

${roadmap}

${opportunities}

${trendSection(r)}

${upgrade}

${labelsSec}

${findings}

${internal ? notesSec : ''}

${gaps}

${next}

${appendix}
</main>
${footer}
${script}
</body></html>
`;
}
//# sourceMappingURL=html.js.map