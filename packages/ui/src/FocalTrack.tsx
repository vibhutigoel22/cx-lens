import React from 'react';
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
/** Vertical step track on the dark rail. Each ring closes like an aperture as the review moves on. */
export function FocalTrack({ step, maxReached, onPick }: { step: number; maxReached: number; onPick: (i: number) => void }) {
  return (
    <nav aria-label="Review steps">
      <ol className="relative">
        {STEPS.map((s, i) => {
          const done = i < step, active = i === step, reachable = i <= maxReached;
          const C = 2 * Math.PI * 11; const fill = done ? 1 : active ? 0.6 : 0;
          return (
            <li key={s.title} className="relative">
              {i < STEPS.length - 1 && <span aria-hidden className={cx('absolute left-[19px] top-[38px] h-[calc(100%-26px)] w-px', done ? 'bg-refract' : 'bg-rail-line')} />}
              <button disabled={!reachable} onClick={() => onPick(i)} aria-current={active ? 'step' : undefined}
                className={cx('relative flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left', active ? 'bg-white/[.06]' : reachable ? 'hover:bg-white/[.04]' : 'opacity-50 cursor-default')}>
                <svg width="24" height="24" viewBox="0 0 26 26" className="mt-0.5 shrink-0" aria-hidden>
                  <circle cx="13" cy="13" r="11" fill="var(--rail)" stroke="var(--rail-line)" strokeWidth="2.5" />
                  <circle cx="13" cy="13" r="11" fill="none" stroke={done ? '#38BDF8' : '#A78BFA'} strokeWidth="2.5" strokeDasharray={C} strokeDashoffset={C * (1 - fill)} transform="rotate(-90 13 13)" strokeLinecap="round" style={{ transition: 'stroke-dashoffset .5s' }} />
                  {done ? <path d="M8.5 13.2l3 3 6-6.4" fill="none" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /> : <text x="13" y="17.2" textAnchor="middle" fontSize="11.5" fontWeight="600" fill={active ? '#fff' : '#8FB0B6'}>{i + 1}</text>}
                </svg>
                <span><span className={cx('block text-[14px] leading-tight', active ? 'text-white font-semibold' : 'text-rail-ink')}>{s.title}</span><span className="block text-[12.5px] text-rail-mute mt-0.5">{s.hint}</span></span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
