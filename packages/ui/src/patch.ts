/** A row of the side-by-side config diff, as returned by the engine's diffLines(). */
export interface DiffRow { kind: 'same' | 'del' | 'add'; left?: string; right?: string; ln?: number; rn?: number }

/** The changed config (right-hand side) as text. */
export const afterText = (rows: DiffRow[]) => rows.filter((r) => r.kind !== 'del').map((r) => r.right ?? '').join('\n');

/**
 * Unified diff (git / patch format) with 3 lines of context, so the change can be applied with
 * `git apply` or `patch -p1` or opened as a pull request.
 */
export function unifiedPatch(all: DiffRow[], name: string, context = 3): string {
  // Text ending in a newline splits into a final empty "line" on both sides; it is not a real line in a patch.
  const last = all.at(-1); const rows = last && last.kind === 'same' && last.left === '' && last.right === '' ? all.slice(0, -1) : all;
  const changed = rows.flatMap((r, i) => (r.kind === 'same' ? [] : [i]));
  if (!changed.length) return '';
  const hunks: [number, number][] = [];
  let s = Math.max(0, changed[0] - context), e = Math.min(rows.length - 1, changed[0] + context);
  for (const i of changed.slice(1)) {
    if (i - context <= e + 1) e = Math.min(rows.length - 1, i + context);
    else { hunks.push([s, e]); s = Math.max(0, i - context); e = Math.min(rows.length - 1, i + context); }
  }
  hunks.push([s, e]);
  let out = `--- a/${name}\n+++ b/${name}\n`;
  for (const [hs, he] of hunks) {
    const seg = rows.slice(hs, he + 1); const before = rows.slice(0, hs);
    const oldLen = seg.filter((r) => r.kind !== 'add').length, newLen = seg.filter((r) => r.kind !== 'del').length;
    const oldBefore = before.filter((r) => r.kind !== 'add').length, newBefore = before.filter((r) => r.kind !== 'del').length;
    out += `@@ -${oldLen ? oldBefore + 1 : oldBefore},${oldLen} +${newLen ? newBefore + 1 : newBefore},${newLen} @@\n`;
    out += seg.map((r) => (r.kind === 'same' ? ` ${r.left ?? ''}` : r.kind === 'del' ? `-${r.left ?? ''}` : `+${r.right ?? ''}`)).join('\n') + '\n';
  }
  return out;
}
