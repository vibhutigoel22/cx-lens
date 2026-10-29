import React from 'react';
import { Check } from 'lucide-react';
import { cx } from './ui';
export const STEPS = [
  { title: 'Connect', hint: 'Pick the Coralogix team' },
  { title: 'Customer context', hint: 'Who this review is for' },
  { title: 'Choose pillars', hint: 'What to look at' },
  { title: 'Config and versions', hint: 'Optional collector config' },
  { title: 'Run assessment', hint: 'Read-only discovery' },
  { title: 'Verify findings', hint: 'Decide with the customer' },
  { title: 'Remediate and report', hint: 'Plan, config, exports' },
] as const;
/**
 * The workflow track (§2): one connected, pill-shaped segmented bar.
 *   Completed: dimmed cyan text with a small teal check circle.
 *   Active: a capsule with a gradient border and a soft glow.
 *   Future: muted slate.
 * Narrow windows show numbers only for the steps that are not active.
 */
export function FocalTrack({ step, maxReached, onPick }: { step: number; maxReached: number; onPick: (i: number) => void }) {
  return (
    <nav aria-label="Review steps" className="no-scrollbar overflow-x-auto">
      <ol className="flex min-w-max items-center rounded-full border border-rail-line bg-white/[.025] p-1">
        {STEPS.map((s, i) => {
          const done = i < step, active = i === step, reachable = i <= maxReached;
          const dot = <span aria-hidden className={cx('grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-semibold tabnum',
            done ? 'border border-step-done/60 bg-step-done/15 text-step-done' : active ? 'bg-[linear-gradient(135deg,#00DFBA,#06B6D4)] text-[#04121A]' : 'border border-rail-line text-step-future')}>{done ? <Check size={11} strokeWidth={3} /> : i + 1}</span>;
          const label = <span className={cx('whitespace-nowrap text-[13px] leading-none', active ? 'font-semibold text-white' : done ? 'text-step-done/90' : 'text-step-future', !active && 'hidden xl:inline')}>{s.title}</span>;
          return (
            <li key={s.title} className="flex items-center">
              {i > 0 && <span aria-hidden className={cx('mx-0.5 h-px w-3 xl:w-4', i <= step ? 'bg-step-done/50' : 'bg-rail-line')} />}
              {active
                ? <span className="rounded-full bg-[linear-gradient(135deg,rgba(0,223,186,.9),rgba(168,85,247,.85))] p-px shadow-[0_0_18px_-4px_rgba(0,223,186,.6)]">
                    <button onClick={() => onPick(i)} aria-current="step" title={s.hint} className="flex items-center gap-2 rounded-full bg-rail px-3 py-1.5">{dot}{label}</button></span>
                : <button disabled={!reachable} onClick={() => onPick(i)} title={`${s.title}: ${s.hint}`} aria-label={`Step ${i + 1}: ${s.title}${done ? ' (done)' : ''}`}
                    className={cx('flex items-center gap-2 rounded-full px-2.5 py-1.5 transition-colors', reachable ? 'hover:bg-white/[.06]' : 'cursor-default opacity-70')}>{dot}{label}</button>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
