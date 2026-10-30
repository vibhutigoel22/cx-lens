import { Document, isMap, isSeq, Pair, parseDocument, Scalar, visit, YAMLMap, YAMLSeq } from 'yaml';
import type { ConfigOp, Finding, HelmComponent, SignalType } from '../types.js';
import { guardOutput, isProtectedLabel, ProtectedLabelError, stripProtectedRemovals, scanForProtectedRemovals } from '../guard/protected.js';
import { HELM_COMPONENTS, ParsedConfig, parseConfig } from './parse.js';
import { BRAND } from '../brand.js';

export interface WriteResult {
  text: string; applied: { findingId: string; summary: string }[]; skipped: { findingId: string; reason: string }[];
  protectedRemoved: string[]; notes: string[]; draft: boolean;
}

const tag = (f: Finding) => `${BRAND.name} ${f.id}: ${f.change?.summary ?? f.title}${f.sources[0]?.url ? ` (source: ${f.sources.find((s) => !s.internal)?.url ?? f.sources[0].url})` : ''}`;

/** Refuse any op that would delete a protected label, before touching the document. */
function checkOp(op: ConfigOp): void {
  const keys: string[] = [];
  const collect = (v: unknown) => {
    if (typeof v === 'string') { for (const m of v.matchAll(/delete_key\(\s*(?:resource\.)?attributes\s*,\s*"([^"]+)"/g)) keys.push(m[1]); }
    else if (Array.isArray(v)) v.forEach(collect);
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { if (k === 'denylist') { const lists = Array.isArray(x) ? [x] : Object.values(x as object); for (const l of lists) if (Array.isArray(l)) keys.push(...l.map(String)); } else if (k === 'attributes' && Array.isArray(x)) { for (const a of x as any[]) if (a?.action === 'delete') keys.push(a.key); } collect(x); }
  };
  collect((op as any).value ?? (op as any).body);
  const bad = keys.filter(isProtectedLabel);
  if (bad.length) throw new ProtectedLabelError(`Config writer refused to emit removal of protected label(s): ${bad.join(', ')}`, bad);
}

function ensureMap(doc: Document, path: (string | number)[]): YAMLMap {
  let node = doc.getIn(path, true);
  if (!isMap(node)) { doc.setIn(path, new YAMLMap()); node = doc.getIn(path, true); }
  return node as YAMLMap;
}

function insertProcessor(seq: YAMLSeq, name: string, position: string) {
  const names = seq.items.map((i: any) => String(i?.value ?? i));
  if (names.includes(name)) {
    // Fix order for the pipeline baseline: memory_limiter first, batch last.
    const i = names.indexOf(name);
    if (position === 'last' && i !== names.length - 1) { const [it] = seq.items.splice(i, 1); seq.items.push(it); return true; }
    if (position === 'first' && i !== 0) { const [it] = seq.items.splice(i, 1); seq.items.unshift(it); return true; }
    return false;
  }
  const idx = (n: string) => names.findIndex((x) => x === n || x.startsWith(n + '/'));
  let at = names.length;
  const batch = idx('batch');
  if (position === 'first') at = 0;
  else if (position === 'last') at = names.length;
  else if (position === 'before-sampling') { const ts = idx('tail_sampling'); at = ts >= 0 ? ts : batch >= 0 ? batch : names.length; }
  else { at = batch >= 0 ? batch : names.length; if (position === 'middle') { const ml = idx('memory_limiter'); if (ml >= 0 && at <= ml) at = ml + 1; } }
  seq.items.splice(at, 0, new Scalar(name));
  return true;
}

let appliedOnce = new Set<string>();
function applyOp(doc: Document, op: ConfigOp, f: Finding, parsed: ParsedConfig, notes: string[]): string {
  checkOp(op);
  const helm = parsed.format === 'helm-values' || (parsed.format === 'empty' && (op.kind === 'helmPreset' || !!(op as any).helmComponents));
  switch (op.kind) {
    case 'helmPreset': {
      // Two findings can carry the same preset (e.g. protected-label fix + reduceResourceAttributes); apply once.
      const key = `preset:${op.preset}:${op.components.join(',')}`;
      if (appliedOnce.has(key)) return `presets.${op.preset} (already applied)`;
      appliedOnce.add(key);
      let first: any = null;
      // The anchor must precede its aliases in document order: anchor on the component that appears first.
      const top = isMap(doc.contents) ? (doc.contents as YAMLMap).items.map((p: any) => String(p.key?.value ?? p.key)) : [];
      const comps = [...op.components].sort((a, b) => (top.indexOf(a) < 0 ? 1e9 : top.indexOf(a)) - (top.indexOf(b) < 0 ? 1e9 : top.indexOf(b)));
      comps.forEach((c, i) => {
        const pp = op.preset.split('.'); ensureMap(doc, [c, 'presets', ...pp.slice(0, -1)]);
        if (i === 0 || !op.anchor) {
          // metrics/logs share one denylist list (as in the playbook) → readable anchor name via anchorPrefix
          const node = doc.createNode(op.value, { anchorPrefix: 'cx_denylist_metrics_logs' }) as YAMLMap;
          if (op.anchor) node.anchor = op.anchor;
          node.commentBefore = ` ${tag(f)}`;
          doc.setIn([c, 'presets', ...pp], node); first = node;
        } else {
          doc.setIn([c, 'presets', ...pp], doc.createAlias(first, op.anchor));
        }
      });
      return `presets.${op.preset} on ${comps.join(', ')}`;
    }
    case 'processor': {
      const comps: (HelmComponent | null)[] = helm ? (op.helmComponents ?? ['opentelemetry-agent']) : [null];
      for (const c of comps) {
        const base = c ? [c, 'config'] : [];
        if (c && doc.getIn([c, 'enabled']) === false) notes.push(`${c} is disabled (enabled: false) in these values, but ${op.name} is placed there. ${op.name === 'tail_sampling' ? 'Tail sampling needs every span of a trace on one collector: enable the gateway, or move the processor.' : 'Enable the component or move the processor.'}`);
        const procs = ensureMap(doc, [...base, 'processors']);
        if (op.body && !procs.has(op.name)) { const n = doc.createNode(op.body); (n as any).commentBefore = ` ${tag(f)}`; procs.set(op.name, n); }
        const pipes = doc.getIn([...base, 'service', 'pipelines'], true);
        const sigPipes: string[] = isMap(pipes) ? (pipes.items as Pair<any, any>[]).map((p) => String(p.key?.value ?? p.key)).filter((k) => op.signals.some((s) => k === s || k.startsWith(s + '/'))) : [];
        const targets = sigPipes.length ? sigPipes : op.signals;
        for (const p of targets) {
          let seq = doc.getIn([...base, 'service', 'pipelines', p, 'processors'], true);
          if (!isSeq(seq)) {
            doc.setIn([...base, 'service', 'pipelines', p, 'processors'], new YAMLSeq()); seq = doc.getIn([...base, 'service', 'pipelines', p, 'processors'], true);
            if (c) { (seq as YAMLSeq).commentBefore = ` ${BRAND.name}: the chart adds its preset processors to this list. Run \`helm template\` to confirm the final order before deploying.`; notes.push(`${c}: created service.pipelines.${p}.processors — confirm final order with \`helm template\`.`); }
          }
          insertProcessor(seq as YAMLSeq, op.name, op.position);
        }
      }
      return `processors.${op.name} in ${op.signals.join('/')} pipelines${helm ? ` (${comps.join(', ')})` : ''}`;
    }
    case 'exporterSetting': {
      const roots: (string[])[] = helm ? HELM_COMPONENTS.map((c) => [c, 'config']) : [[]];
      let n = 0;
      for (const base of roots) {
        const ex = doc.getIn([...base, 'exporters'], true);
        if (!isMap(ex)) continue;
        for (const p of ex.items as Pair<any, any>[]) {
          const name = String(p.key?.value ?? p.key);
          if (!op.exporterPrefix.some((x) => name === x || name.startsWith(x + '/'))) continue;
          if (!isMap(p.value)) p.value = new YAMLMap();
          if ((p.value as YAMLMap).has(op.key)) continue;
          const s = new Scalar(op.value); s.comment = ` ${tag(f)}`; (p.value as YAMLMap).set(op.key, s); n++;
        }
      }
      return n ? `${op.key}: ${String(op.value)} on ${n} exporter(s)` : '';
    }
    case 'receiverSetting': {
      const roots: (string[])[] = helm ? HELM_COMPONENTS.map((c) => [c, 'config']) : [[]];
      let n = 0;
      for (const base of roots) {
        const rx = doc.getIn([...base, 'receivers'], true);
        if (!isMap(rx)) continue;
        for (const p of rx.items as Pair<any, any>[]) {
          const name = String(p.key?.value ?? p.key);
          if (!(name === op.receiverPrefix || name.startsWith(op.receiverPrefix + '/'))) continue;
          const existing = doc.getIn([...base, 'receivers', name, ...op.path.slice(0, -1)]) as any;
          if (existing && (existing.line_start_pattern || existing.line_end_pattern)) continue; // exactly one allowed
          const s = doc.createNode(op.value); (s as any).comment = ` ${tag(f)}`;
          doc.setIn([...base, 'receivers', name, ...op.path], s); n++;
        }
      }
      return n ? `${op.path.join('.')} on ${n} ${op.receiverPrefix} receiver(s)` : '';
    }
    case 'connectorSetting': {
      const comps = helm ? (op.helmComponents ?? ['opentelemetry-agent']) : [null];
      for (const c of comps) {
        const base = c ? [c, 'config'] : [];
        const node = doc.createNode(op.value); (node as any).comment = ` ${tag(f)}`;
        doc.setIn([...base, 'connectors', op.connector, op.key], node);
      }
      return `connectors.${op.connector}.${op.key}`;
    }
  }
}

/**
 * Apply findings' config changes. Only Verified findings are applied unless allowDraft is set,
 * in which case the output carries a DRAFT watermark.
 */
export function writeConfig(parsed: ParsedConfig, findings: Finding[], opts: { allowDraft?: boolean; deployment?: 'helm' | 'collector' } = {}): WriteResult {
  const doc = parsed.format === 'helm-values' || parsed.format === 'collector' ? parseDocument(parsed.text, { merge: true }) : new Document({});
  const work: ParsedConfig = parsed.format === 'empty' || parsed.format === 'other' ? { ...parsed, format: opts.deployment === 'collector' ? 'collector' : 'empty' } : parsed;
  const applied: WriteResult['applied'] = []; const skipped: WriteResult['skipped'] = []; const notes: string[] = [];
  let draft = false; appliedOnce = new Set();
  for (const f of findings) {
    if (!f.change || !f.change.ops.length) continue;
    if (f.verifyStatus !== 'verified') {
      if (!opts.allowDraft || f.verifyStatus === 'rejected') { skipped.push({ findingId: f.id, reason: `status is ${f.verifyStatus}` }); continue; }
      draft = true;
    }
    try {
      const parts = f.change.ops.map((op) => applyOp(doc, op, f, work, notes)).filter(Boolean);
      if (parts.length) applied.push({ findingId: f.id, summary: parts.join('; ') }); else skipped.push({ findingId: f.id, reason: 'nothing to change in this config' });
    } catch (e) {
      skipped.push({ findingId: f.id, reason: (e as Error).message });
    }
  }
  // Repair: earlier Lens versions (following the chart README) wrote presets.reduceLogAttributes, which the chart
  // schema rejects. Move it to presets.logsCollection.reduceLogAttributes, where the chart reads it.
  if (parsed.format === 'helm-values' || parsed.format === 'empty') for (const c of HELM_COMPONENTS) {
    const bad = doc.getIn([c, 'presets', 'reduceLogAttributes'], true); if (!bad) continue;
    doc.deleteIn([c, 'presets', 'reduceLogAttributes']); ensureMap(doc, [c, 'presets', 'logsCollection']);
    if (!doc.hasIn([c, 'presets', 'logsCollection', 'reduceLogAttributes'])) { (bad as any).commentBefore = ` ${BRAND.name}: moved here from presets.reduceLogAttributes, which the chart schema rejects (values.schema.json: presets.logsCollection.reduceLogAttributes).`; doc.setIn([c, 'presets', 'logsCollection', 'reduceLogAttributes'], bad); }
    notes.push(`${c}: moved presets.reduceLogAttributes to presets.logsCollection.reduceLogAttributes (the chart schema rejects the old place).`);
  }
  // Repair: earlier Lens versions added config.processors.batch with send_batch_size 8192 to Helm values. The chart's batch
  // preset (send_batch_max_size 2048) merges into it and the collector refuses to start. Remove Lens-added blocks.
  if (parsed.format === 'helm-values') for (const c of HELM_COMPONENTS) {
    const b: any = doc.getIn([c, 'config', 'processors', 'batch'], true);
    if (b && String(b.commentBefore ?? '').includes(BRAND.name) && !doc.hasIn([c, 'config', 'processors', 'batch', 'send_batch_max_size'])) { doc.deleteIn([c, 'config', 'processors', 'batch']); { const pm: any = doc.getIn([c, 'config', 'processors'], true); if (pm && Array.isArray(pm.items) && !pm.items.length) doc.deleteIn([c, 'config', 'processors']); } notes.push(`${c}: removed the batch block an earlier Lens version added; the chart’s batch preset provides batch (send_batch_size 1024, send_batch_max_size 2048).`); }
  }
  const protectedRemoved = stripProtectedRemovals(doc);
  if (draft) doc.commentBefore = ` DRAFT — generated by ${BRAND.name} from findings that are not all Verified. Do not deploy without TAM + customer verification.\n${doc.commentBefore ?? ''}`;
  const text = doc.toString({ lineWidth: 0 });
  guardOutput(text, parsed.format === 'helm-values' || parsed.format === 'collector' ? scanForProtectedRemovals(parsed.text) : []); // final protected-label gate
  return { text, applied, skipped, protectedRemoved, notes, draft };
}

export function reparse(text: string) { return parseConfig(text); }
export type { SignalType };
