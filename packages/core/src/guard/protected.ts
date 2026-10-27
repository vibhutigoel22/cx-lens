import { Document, isMap, isScalar, isSeq, parseDocument, visit, YAMLSeq } from 'yaml';
import { loadCatalogue } from '../rules/catalogue.js';

export interface ProtectedViolation { key: string; location: string; how: 'denylist' | 'delete_key' | 'attributes-delete' | 'keep_keys-omits' | 'delete_matching_keys' }

export function isProtectedLabel(key: string): boolean {
  const p = loadCatalogue().protected;
  const k = key.trim();
  return p.exact.includes(k) || p.prefixes.some((x) => k.startsWith(x));
}
export function protectedList(): string[] { const p = loadCatalogue().protected; return [...p.exact, ...p.prefixes.map((x) => x + '*')]; }

export class ProtectedLabelError extends Error { constructor(msg: string, public keys: string[]) { super(msg); this.name = 'ProtectedLabelError'; } }

/** Throws if any value in `keys` is protected. Used by every config-writer path. */
export function assertNotProtected(keys: string[], context: string): void {
  const bad = keys.filter(isProtectedLabel);
  if (bad.length) throw new ProtectedLabelError(`Refusing to remove protected label(s) ${bad.join(', ')} (${context}). Infrastructure Explorer depends on them.`, bad);
}

const DELETE_KEY_RE = /delete_key\(\s*(?:resource\.)?attributes\s*,\s*"([^"]+)"\s*\)/g;
const DELETE_MATCHING_RE = /delete_matching_keys\(\s*(?:resource\.)?attributes\s*,\s*"([^"]+)"\s*\)/g;

/** Find every way a config removes a protected label. Works on Helm values and plain collector configs. */
export function scanForProtectedRemovals(doc: Document | string): ProtectedViolation[] {
  const d = typeof doc === 'string' ? parseDocument(doc, { merge: true }) : doc;
  const js = d.toJS({ maxAliasCount: -1 }) ?? {};
  const out: ProtectedViolation[] = [];
  const walk = (node: any, path: string[]) => {
    if (Array.isArray(node)) {
      if (path.at(-1) === 'denylist') for (const k of node) if (typeof k === 'string' && isProtectedLabel(k)) out.push({ key: k, location: path.join('.'), how: 'denylist' });
      node.forEach((n, i) => walk(n, [...path, String(i)])); return;
    }
    if (node && typeof node === 'object') {
      if (path.at(-1) === 'denylist') for (const [sig, list] of Object.entries(node)) if (Array.isArray(list)) for (const k of list) if (typeof k === 'string' && isProtectedLabel(k)) out.push({ key: k, location: [...path, sig].join('.'), how: 'denylist' });
      if (Array.isArray(node.attributes) && /^(attributes|resource)(\/|$)/.test(path.at(-1) ?? '')) {
        for (const a of node.attributes) if (a?.action === 'delete' && typeof a.key === 'string' && isProtectedLabel(a.key)) out.push({ key: a.key, location: path.join('.'), how: 'attributes-delete' });
      }
      for (const [k, v] of Object.entries(node)) walk(v, [...path, k]);
      return;
    }
    if (typeof node === 'string') {
      for (const m of node.matchAll(DELETE_KEY_RE)) if (isProtectedLabel(m[1])) out.push({ key: m[1], location: path.join('.'), how: 'delete_key' });
      for (const m of node.matchAll(DELETE_MATCHING_RE)) {
        let re: RegExp | null = null; try { re = new RegExp(m[1]); } catch { /* invalid regex */ }
        if (re) for (const p of protectedList()) { const probe = p.replace('*', 'x'); if (re.test(probe)) out.push({ key: probe, location: path.join('.'), how: 'delete_matching_keys' }); }
      }
      const kk = node.match(/keep_keys\(\s*resource\.attributes\s*,\s*\[([^\]]*)\]/);
      if (kk) {
        const kept = [...kk[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
        for (const p of loadCatalogue().protected.exact) if (!kept.includes(p)) out.push({ key: p, location: path.join('.'), how: 'keep_keys-omits' });
      }
    }
  };
  walk(js, []);
  const seen = new Set<string>();
  return out.filter((v) => { const s = `${v.key}|${v.location}|${v.how}`; if (seen.has(s)) return false; seen.add(s); return true; });
}

/** Remove protected labels from every denylist in the document, leaving a comment. Returns removed keys. */
export function stripProtectedFromDenylists(doc: Document): string[] {
  const removed: string[] = [];
  visit(doc, {
    Pair(_, pair) {
      if (!isScalar(pair.key) || pair.key.value !== 'denylist') return;
      const handle = (seq: YAMLSeq) => {
        const here: string[] = [];
        seq.items = seq.items.filter((it) => { const v = isScalar(it) ? String(it.value) : ''; if (isProtectedLabel(v)) { here.push(v); return false; } return true; });
        if (here.length) { removed.push(...here); seq.commentBefore = ` Coralogix Lens: removed protected label(s) ${here.join(', ')} from this denylist. Infrastructure Explorer, the APM Infrastructure tab and AWS enrichment depend on them.`; }
      };
      if (isSeq(pair.value)) handle(pair.value);
      else if (isMap(pair.value)) for (const it of pair.value.items) if (isSeq(it.value)) handle(it.value);
    },
  });
  return removed;
}

/** Remove existing delete_key statements and attributes/resource delete actions that target protected labels. */
export function stripProtectedRemovals(doc: Document): string[] {
  const removed = stripProtectedFromDenylists(doc);
  visit(doc, {
    Seq(_, seq: any) {
      const here: string[] = [];
      seq.items = seq.items.filter((it: any) => {
        if (isScalar(it) && typeof it.value === 'string') { const m = [...it.value.matchAll(DELETE_KEY_RE)].find((x) => isProtectedLabel(x[1])); if (m) { here.push(m[1]); return false; } }
        if (isMap(it) && it.get('action') === 'delete' && typeof it.get('key') === 'string' && isProtectedLabel(String(it.get('key')))) { here.push(String(it.get('key'))); return false; }
        return true;
      });
      if (here.length) { removed.push(...here); seq.commentBefore = `${seq.commentBefore ?? ''} Coralogix Lens: removed deletion of protected label(s) ${here.join(', ')} (Infrastructure Explorer depends on them).`; }
    },
  });
  return removed;
}

/** Final gate on any generated output. Throws if the output still removes a protected label.
 *  `preexisting` lets un-fixable patterns already in the customer's config (keep_keys / regex deletes) pass;
 *  they are reported as a high-priority finding instead. */
export function guardOutput(yamlText: string, preexisting: ProtectedViolation[] = []): void {
  const sig = (x: ProtectedViolation) => `${x.key}|${x.how}`;
  const ok = new Set(preexisting.filter((x) => x.how === 'keep_keys-omits' || x.how === 'delete_matching_keys').map(sig));
  const v = scanForProtectedRemovals(yamlText).filter((x) => !ok.has(sig(x)));
  if (v.length) throw new ProtectedLabelError(`Generated config would remove protected label(s): ${v.map((x) => `${x.key} @ ${x.location}`).join('; ')}`, v.map((x) => x.key));
}
