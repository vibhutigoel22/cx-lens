import React from 'react';
import { combined, units, cx } from './ui';
/**
 * The one bold element: today's daily units, split into what stays, headroom already verified (emerald, savings)
 * and headroom still under review (purple). Overlapping findings are never added twice.
 */
export function ValueLens({ baseline, findings, compact }: { baseline: number | null; findings: any[]; compact?: boolean }) {
  const verified = combined(findings, (f) => f.verifyStatus === 'verified');
  const potential = combined(findings, (f) => f.verifyStatus !== 'rejected');
  const review = Math.max(0, potential - verified);
  const base = baseline ?? Math.max(potential * 1.5, 1);
  const pct = (v: number) => `${Math.min(100, (v / base) * 100)}%`;
  return (
    <section aria-label="Value lens" className={cx('hero', compact ? 'px-5 py-4' : 'px-6 py-5')}>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-rail-mute">Daily usage today</p>
          <p className="font-display text-[32px] font-semibold leading-none tabnum tracking-[-0.02em] mt-1.5">{baseline == null ? '—' : units(baseline)}<span className="ml-1 font-mono text-[13px] font-normal text-[#A78BFA]">units/day</span></p>
        </div>
        <dl className="flex gap-8 text-[13px]">
          <div><dt className="text-rail-mute flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[#10B981] shadow-[0_0_10px_rgba(16,185,129,.7)]" />Verified headroom</dt><dd className="font-display text-[21px] font-semibold tabnum text-[#34D399]">{units(verified)}</dd></div>
          <div><dt className="text-rail-mute flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm text-[#C084FC] hatch border border-[#C084FC]" />Still to review</dt><dd className="font-display text-[21px] font-semibold tabnum text-[#D8B4FE]">{units(review)}</dd></div>
          {baseline != null && <div><dt className="text-rail-mute">Share of today</dt><dd className="font-display text-[21px] font-semibold tabnum">{Math.round((potential / base) * 100)}%</dd></div>}
        </dl>
      </div>
      <div className="mt-4 flex h-3.5 w-full overflow-hidden rounded-full bg-white/[.07] ring-1 ring-inset ring-white/5" role="img" aria-label={`${units(verified)} units per day verified, ${units(review)} still to review, out of ${baseline == null ? 'unknown' : units(baseline)}`}>
        <div className="flex-1 bg-[linear-gradient(90deg,rgba(6,182,212,.18),rgba(6,182,212,.08))]" />
        <div className="lens-grow h-full text-[#C084FC] hatch bg-[#A855F7]/25" style={{ width: pct(review) }} />
        <div className="lens-grow h-full bg-[linear-gradient(90deg,#10B981,#34D399)] shadow-[0_0_14px_rgba(16,185,129,.6)]" style={{ width: pct(verified) }} />
      </div>
      {!compact && <p className="mt-2.5 text-[12.5px] text-rail-mute">The bar is today’s usage. The coloured end is quota the customer can free and reinvest. Estimates can vary by about ±20%.</p>}
    </section>
  );
}
