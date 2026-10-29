import React, { useEffect, useState } from 'react';
import { Copy, Check, FileDown, GitPullRequestArrow } from 'lucide-react';
import { parseDocument } from 'yaml';
import { cx } from './ui';
import { download } from './api';
import { afterText, unifiedPatch, type DiffRow } from './patch';

/**
 * Two-column split diff (§4): removed lines on a soft crimson background, optimised additions on soft teal,
 * with line numbers. A floating action pill switches the view (split diff, or the new config as YAML or JSON),
 * copies it, and exports the new config or a patch that `git apply` accepts (ready for a pull request).
 */
export function ConfigDiff({ rows, fileBase, changed }: { rows: DiffRow[]; fileBase: string; changed: number }) {
  const [view, setView] = useState<'split' | 'yaml' | 'json'>('split'); const [copied, setCopied] = useState(false);
  useEffect(() => { if (!copied) return; const t = setTimeout(() => setCopied(false), 1500); return () => clearTimeout(t); }, [copied]);
  const yaml = afterText(rows);
  const json = (() => { try { const d = parseDocument(yaml); return d.errors.length ? null : JSON.stringify(d.toJSON(), null, 2); } catch { return null; } })();
  const patch = unifiedPatch(rows, `${fileBase}.yaml`);
  const text = view === 'json' && json ? json : view === 'split' ? patch : yaml;
  const copy = () => navigator.clipboard?.writeText(text).then(() => setCopied(true)).catch(() => {});
  const btn = 'flex items-center gap-1 rounded-full px-2.5 py-1 text-mute hover:text-ink';
  return <div className="card !overflow-visible">
    <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-2.5 text-[12.5px]">
      <span className="font-medium">{view === 'split' ? <><span className="text-mute">Current config</span> <span aria-hidden className="text-mute">→</span> With changes</> : `New config as ${view.toUpperCase()}`}</span>
      <span className="text-mute tabnum">{changed} changed lines</span>
      <div role="toolbar" aria-label="Config change actions" className="ml-auto flex flex-wrap items-center gap-0.5 rounded-full border border-line-strong/70 bg-raised/90 p-0.5 text-[11.5px] shadow-soft">
        {([['split', 'Diff'], ['yaml', 'YAML'], ['json', 'JSON']] as const).map(([v, l]) => <button key={v} type="button" aria-pressed={view === v} disabled={v === 'json' && !json} onClick={() => setView(v)} className={cx('rounded-full px-2.5 py-1 font-mono font-medium disabled:opacity-40', view === v ? 'bg-refract text-on-refract' : 'text-mute hover:text-ink')}>{l}</button>)}
        <span aria-hidden className="mx-1 h-4 w-px bg-line-strong" />
        <button type="button" onClick={copy} className={btn} aria-label={view === 'split' ? 'Copy the patch' : `Copy the new config as ${view.toUpperCase()}`}>{copied ? <><Check size={12} className="text-ok" />Copied</> : <><Copy size={12} />Copy</>}</button>
        <button type="button" onClick={() => download(view === 'json' && json ? `${fileBase}.json` : `${fileBase}.yaml`, view === 'json' && json ? json : yaml)} className={btn}><FileDown size={12} />Export {view === 'json' ? 'JSON' : 'YAML'}</button>
        <button type="button" disabled={!patch} onClick={() => download(`${fileBase}.diff`, patch)} className={cx(btn, 'disabled:opacity-40')} title="A unified diff you can apply with git apply and open as a pull request"><GitPullRequestArrow size={12} />Export patch</button>
      </div>
    </div>
    {view === 'split'
      ? <div className="max-h-[520px] overflow-auto rounded-b-2xl font-mono text-[11.5px] leading-[1.6]" role="table" aria-label="Config diff">
          {rows.map((r, i) => <div key={i} role="row" className="grid grid-cols-2">
            <div role="cell" title={r.left} className={cx('flex min-w-0', r.kind === 'del' && 'diff-del')}>
              <span aria-hidden className="w-10 shrink-0 select-none pr-2 text-right text-mute/60 tabnum">{r.ln ?? ''}</span>
              <span aria-hidden className={cx('w-4 shrink-0 select-none', r.kind === 'del' ? 'text-bad' : 'text-transparent')}>−</span>
              <span className={cx('min-w-0 overflow-hidden text-ellipsis whitespace-pre pr-2', r.kind === 'same' ? 'text-mute' : 'text-ink')}>{r.left ?? ''}</span></div>
            <div role="cell" title={r.right} className={cx('flex min-w-0 border-l border-line', r.kind === 'add' && 'diff-add')}>
              <span aria-hidden className="w-10 shrink-0 select-none pr-2 text-right text-mute/60 tabnum">{r.rn ?? ''}</span>
              <span aria-hidden className={cx('w-4 shrink-0 select-none', r.kind === 'add' ? 'text-ok' : 'text-transparent')}>+</span>
              <span className={cx('min-w-0 overflow-hidden text-ellipsis whitespace-pre pr-2', r.kind === 'same' ? 'text-mute' : 'text-ink')}>{r.right ?? ''}</span></div>
          </div>)}
        </div>
      : <pre className="max-h-[520px] overflow-auto rounded-b-2xl p-4 font-mono text-[12px] leading-relaxed text-syn-val">{text}</pre>}
  </div>;
}
