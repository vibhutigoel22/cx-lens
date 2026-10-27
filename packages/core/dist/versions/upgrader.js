import { isMap, isScalar, isSeq, parseDocument, Scalar, YAMLSeq, visit } from 'yaml';
import { loadCatalogue, resolveSources } from '../rules/catalogue.js';
import { compareVersions, inRange } from './semver.js';
import { componentTypesUsed, parseConfig } from '../config/parse.js';
import { guardOutput, stripProtectedRemovals, isProtectedLabel, scanForProtectedRemovals } from '../guard/protected.js';
import { BRAND } from '../brand.js';
/** Parse "## vX.Y.Z" sections and their 🛑 Breaking changes items. */
export function parseChangelogBreaking(md, kind) {
    const out = [];
    const parts = md.split(/\n## /);
    for (const p of parts.slice(1)) {
        const head = p.split('\n')[0];
        const vm = head.match(/v0\.(\d+)\.(\d+)/g);
        if (!vm)
            continue;
        const version = vm.at(-1).replace(/^v/, '');
        const sec = p.match(/### 🛑 Breaking changes 🛑([\s\S]*?)(\n### |$)/);
        if (!sec)
            continue;
        for (const item of sec[1].split(/\n- /).slice(1)) {
            const comp = item.match(/^`([^`]+)`/)?.[1] ?? '';
            const text = item.split('\n')[0].replace(/^`[^`]+`:\s*/, '').trim();
            out.push({ version, component: comp, text: `${text}` + (kind === 'core' ? ' (core)' : '') });
        }
    }
    return out;
}
/** Chart CHANGELOG: "### vX" sections; keep lines marked Breaking / Note for upgraders. */
export function parseChartChangelog(md) {
    const out = [];
    for (const s of md.split(/\n### v/).slice(1)) {
        const version = s.split(/[\s/]/)[0];
        for (const line of s.split('\n'))
            if (/\[(Breaking|BREAKING)\]|Note for upgraders|breaking change/i.test(line))
                out.push({ version, text: line.replace(/^\s*-\s*/, '').trim() });
    }
    return out;
}
const prefixPath = (expr, ctxName) => {
    // add context prefix to bare paths: attributes, name, kind, status, body, severity_text, metric fields
    const bare = ['attributes', 'name', 'kind', 'status', 'body', 'severity_text', 'severity_number', 'trace_id', 'span_id', 'start_time_unix_nano', 'end_time_unix_nano', 'type', 'unit', 'description', 'value_double', 'value_int'];
    return expr.replace(/(^|[^\w."\]])((?:attributes|name|kind|status|body|severity_text|severity_number|trace_id|span_id|start_time_unix_nano|end_time_unix_nano|type|unit|description|value_double|value_int))\b(?!\s*\()/g, (m, pre, path) => (bare.includes(path) ? `${pre}${ctxName}.${path}` : m));
};
export function upgradeConfig(parsed, opts) {
    const cat = loadCatalogue();
    const doc = parseDocument(parsed.text, { merge: true });
    const changes = [];
    const used = componentTypesUsed(parsed);
    const from = opts.fromCollector ?? '0.0.0';
    const to = opts.toCollector;
    const src = (k) => resolveSources(cat, [k])[0]?.url ?? '';
    const comment = (node, msg) => { if (node)
        node.comment = ` Changed for v${to}: ${msg}`; };
    const covered = new Set();
    for (const fx of cat.upgradeFixes.fixes) {
        const comps = Array.isArray(fx.component) ? fx.component : [fx.component];
        if (!comps.some((c) => used.has(c)))
            continue;
        const applies = fx.deprecation ? compareVersions(to, fx.version) >= 0 : inRange(fx.version, from, to);
        if (!applies)
            continue;
        covered.add(`${fx.version}|${comps.join(',')}`);
        let hit = 0;
        const before = [], after = [];
        if (fx.kind === 'filter-legacy-to-conditions') {
            visit(doc, { Pair(_, pair) {
                    const k = String(pair.key?.value ?? '');
                    if (!k.startsWith('filter') || !isMap(pair.value))
                        return;
                    const body = pair.value;
                    const map = [['traces', 'span', 'trace_conditions', 'span'], ['traces', 'spanevent', 'trace_conditions', 'spanevent'], ['traces', 'resource', 'trace_conditions', 'resource'], ['logs', 'log_record', 'log_conditions', 'log'], ['logs', 'resource', 'log_conditions', 'resource'], ['metrics', 'metric', 'metric_conditions', 'metric'], ['metrics', 'datapoint', 'metric_conditions', 'datapoint'], ['metrics', 'resource', 'metric_conditions', 'resource']];
                    for (const sig of ['traces', 'logs', 'metrics']) {
                        const sub = body.get(sig, true);
                        if (!isMap(sub))
                            continue;
                        const conds = [];
                        let unknown = false;
                        for (const [s, inner, target, ctxName] of map)
                            if (s === sig) {
                                const seq = sub.get(inner, true);
                                if (isSeq(seq))
                                    for (const it of seq.items) {
                                        const v = String(it.value);
                                        conds.push(ctxName === 'resource' ? v : prefixPath(v, ctxName));
                                        before.push(`${sig}.${inner}: ${v}`);
                                    }
                            }
                        for (const p of sub.items)
                            if (!map.some(([s, i]) => s === sig && i === String(p.key?.value)))
                                unknown = true;
                        if (unknown || !conds.length)
                            continue;
                        body.delete(sig);
                        const seq = new YAMLSeq();
                        conds.forEach((c) => seq.items.push(new Scalar(c)));
                        const target = map.find(([s]) => s === sig)[2];
                        body.set(target, seq);
                        seq.commentBefore = ` Changed for v${to}: legacy ${sig}.* filter syntax is deprecated since v0.146.0; migrated to ${target} with context-prefixed paths (${src(fx.source)})`;
                        after.push(...conds.map((c) => `${target}: ${c}`));
                        hit++;
                    }
                } });
        }
        else if (fx.kind === 'rename-key') {
            visit(doc, { Pair(_, pair) { if (String(pair.key?.value) === fx.from) {
                    before.push(`${fx.from}: ${pair.value?.value}`);
                    pair.key = new Scalar(fx.to);
                    comment(pair.value, `${fx.from} renamed to ${fx.to} (${src(fx.source)})`);
                    after.push(`${fx.to}: ${pair.value?.value}`);
                    hit++;
                } } });
        }
        else if (fx.kind === 'ottl-rewrite') {
            const re = new RegExp(fx.pattern, 'g');
            visit(doc, { Scalar(_, s) { if (typeof s.value === 'string' && re.test(s.value)) {
                    before.push(s.value);
                    s.value = s.value.replace(new RegExp(fx.pattern, 'g'), fx.replace);
                    after.push(s.value);
                    comment(s, `${fx.change} (${src(fx.source)})`);
                    hit++;
                } } });
        }
        else if (fx.kind === 'pin-default') {
            visit(doc, { Pair(_, pair) {
                    const k = String(pair.key?.value ?? '');
                    if (comps.some((c) => k === c || k.startsWith(c + '/')) && isMap(pair.value) && !pair.value.has(fx.key) && /processors/.test('processors')) {
                        const s = new Scalar(fx.oldDefault);
                        s.comment = ` Changed for v${to}: default ${fx.key} changed to ignore; pinned to ${fx.oldDefault} to keep current behaviour (${src(fx.source)})`;
                        pair.value.set(fx.key, s);
                        before.push(`${k}: (no ${fx.key})`);
                        after.push(`${k}.${fx.key}: ${fx.oldDefault}`);
                        hit++;
                    }
                } });
        }
        else if (fx.kind === 'remove-key') {
            visit(doc, { Pair(_, pair) { if (String(pair.key?.value) === fx.key) {
                    before.push(`${fx.key}: ${pair.value?.value}`);
                    hit++;
                    return visit.REMOVE;
                } } });
        }
        else if (fx.kind === 'manual') {
            if (new RegExp(`\\b${fx.key}:`).test(parsed.text))
                changes.push({ version: fx.version, component: comps.join('/'), what: fx.change, status: 'Manual action needed', source: src(fx.source), explanation: `Your config sets \`${fx.key}\`. ${fx.change}` });
            continue;
        }
        if (!hit && fx.covers) {
            covered.add(`covers:${fx.covers}`);
            changes.push({ version: fx.version, component: comps.join('/'), what: fx.change, status: 'Not applicable', source: src(fx.source), explanation: `Every ${comps.join('/')} processor in your config already sets ${fx.key} explicitly, so behaviour does not change.` });
        }
        if (hit && fx.covers)
            covered.add(`covers:${fx.covers}`);
        if (hit)
            changes.push({ version: fx.version, component: comps.join('/'), what: fx.change, before: before.slice(0, 3).join('\n'), after: after.slice(0, 3).join('\n'), status: 'Auto-fixed', source: src(fx.source) });
    }
    // Everything else from official changelogs that touches a used component → Manual action needed.
    const aliases = cat.upgradeFixes.componentAliases;
    const usedAliases = [...used].flatMap((c) => aliases[c] ?? []);
    const scan = (items, srcKey) => {
        for (const it of items) {
            if (!inRange(it.version, from, to))
                continue;
            if (!usedAliases.some((a) => it.component.includes(a)))
                continue;
            if (/feature gate|Fix |metric units|telemetry|profiles proto/i.test(it.text) && !/default/i.test(it.text))
                continue; // gate promotions without config impact
            if ([...covered].some((c) => c.startsWith(it.version) || (c.startsWith('covers:') && it.text.includes(c.slice(7)))))
                continue;
            if (it.component.includes('pkg/ottl')) {
                const fns = [...it.text.matchAll(/`([A-Za-z_]+)`/g)].map((m) => m[1]);
                if (fns.length && !fns.some((f) => parsed.text.includes(f)))
                    continue;
            }
            changes.push({ version: it.version, component: it.component, what: it.text, status: 'Manual action needed', source: src(srcKey), explanation: 'Listed as a breaking change for a component in your config. Coralogix Lens does not auto-change this; read the entry and confirm whether your settings are affected.' });
        }
    };
    if (opts.contribMd)
        scan(parseChangelogBreaking(opts.contribMd, 'contrib'), 'otel-contrib-changelog');
    if (opts.coreMd)
        scan(parseChangelogBreaking(opts.coreMd, 'core'), 'otel-core-changelog');
    const relevant = (line) => {
        if (/\b(OBI|eBPF|ebpf)\b/.test(line))
            return /opentelemetry-ebpf-[a-z-]+:\s*\n\s*enabled:\s*true/.test(parsed.text);
        const keys = [...line.matchAll(/`([A-Za-z_.\/<>-]+)`/g)].map((m) => m[1].split(/[.\/]/)[0]).filter((k) => k.length > 3);
        return !keys.length || keys.some((k) => parsed.text.includes(k)) || /Coralogix exporter|spanmetrics|span metrics/i.test(line) && /spanMetrics|coralogix/i.test(parsed.text);
    };
    if (opts.chartMd && opts.fromChart && opts.toChart)
        for (const c of parseChartChangelog(opts.chartMd))
            if (inRange(c.version, opts.fromChart, opts.toChart) && relevant(c.text))
                changes.push({ version: c.version, component: 'otel-integration chart', what: c.text, status: 'Manual action needed', source: src('chart-changelog'), explanation: 'Chart release note for upgraders. Check whether it affects your values.' });
    // Recheck the custom reduceResourceAttributes denylist against the chart's current default list.
    const denylistRecheck = [];
    if (opts.chartReadme) {
        const sec = opts.chartReadme.split('# Filtering and reducing costs')[1]?.split('Kubernetes resource attributes')[0] ?? '';
        const current = [...sec.matchAll(/^- ([a-z0-9_.]+)/gm)].map((m) => m[1]);
        const snap = cat.universal.denylists.chartDefaultSnapshot.attributes;
        const added = current.filter((a) => !snap.includes(a)), removed = snap.filter((a) => !current.includes(a));
        for (const a of added)
            denylistRecheck.push(isProtectedLabel(a) ? `Chart default now also removes protected label ${a} — keep it OUT of the custom denylist.` : `Chart default added ${a}. Consider adding it to the custom denylist after verifying with the customer.`);
        for (const a of removed)
            denylistRecheck.push(`Chart default no longer removes ${a}. The custom denylist still does; confirm that is intended.`);
        if (!added.length && !removed.length && current.length)
            denylistRecheck.push(`Chart default denylist unchanged (${current.length} attributes); the custom protected-safe denylist is still current.`);
    }
    stripProtectedRemovals(doc);
    doc.commentBefore = ` Upgraded by ${BRAND.name} for collector v${to}${opts.toChart ? ` / chart ${opts.toChart}` : ''}. See breaking-changes.md.\n${doc.commentBefore ?? ''}`;
    const text = doc.toString({ lineWidth: 0 });
    guardOutput(text, scanForProtectedRemovals(parsed.text));
    changes.sort((a, b) => compareVersions(a.version, b.version));
    return { text, changes, from: { chart: opts.fromChart, collector: opts.fromCollector }, to: { chart: opts.toChart, collector: to }, denylistRecheck };
}
export function breakingChangesMarkdown(u) {
    const esc = (s) => (s ?? '').replace(/\|/g, '\\|').replace(/\n/g, '<br>');
    const lines = [`# Breaking changes: ${u.from.chart ? `chart ${u.from.chart} → ${u.to.chart}, ` : ''}collector ${u.from.collector ?? 'unknown'} → ${u.to.collector}`, '',
        `Auto-fixed: ${u.changes.filter((c) => c.status === 'Auto-fixed').length} · Manual action needed: ${u.changes.filter((c) => c.status === 'Manual action needed').length}`, '',
        '| Version | Component | What changed | Before | After | Status | Source |', '|---|---|---|---|---|---|---|',
        ...u.changes.map((c) => `| ${c.version} | ${esc(c.component)} | ${esc(c.what)}${c.explanation ? `<br>_${esc(c.explanation)}_` : ''} | ${esc(c.before) || '—'} | ${esc(c.after) || '—'} | ${c.status} | ${c.source} |`)];
    if (u.denylistRecheck.length)
        lines.push('', '## reduceResourceAttributes denylist recheck', '', ...u.denylistRecheck.map((d) => `- ${d}`));
    return lines.join('\n') + '\n';
}
export { parseConfig, isScalar };
//# sourceMappingURL=upgrader.js.map