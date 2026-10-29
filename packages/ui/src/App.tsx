import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Archive, Check, ClipboardCheck, Microscope, FolderOpen, RotateCcw, Save, Trash2, X, CircleAlert, CircleCheck, CircleDashed, CircleX, Cloud, Download, FileCode2, FileText, FlaskConical, KeyRound, Loader2, Plus, ShieldAlert, Sparkles, Terminal, Upload, Users } from 'lucide-react';
import { api, watchRun, download, downloadPost } from './api';
import { Button, Field, inputCls, Pill, Details, Empty, units, PHASE, PILLARS, cx, Term, combined, Skeleton, SkeletonRows, CodeBlock, DataValue, Stat, ThemeSwitch, useTheme } from './ui';
import { FocalTrack, STEPS } from './FocalTrack';
import { ValueLens } from './ValueLens';
import mark from './mark.png';
import { TierDistribution, LabelCardinality } from './Viz';
import { ConfigDiff } from './Diff';

type Pillar = 'universal' | 'logs' | 'traces' | 'metrics';
const REGIONS = ['eu1', 'eu2', 'us1', 'us2', 'us3', 'ap1', 'ap2', 'ap3', 'gov1'];
/** Average of the last 7 COMPLETE days (the day the usage was read on is still partial). */
const baselineOf = (run: any): number | null => { const today = (run?.usage?.fetchedAt ?? new Date().toISOString()).slice(0, 10); const d = (run?.usage?.days ?? []).filter((x: any) => x.date.slice(0, 10) < today).slice(-7); return d.length ? d.reduce((a: number, x: any) => a + x.totalUnits, 0) / d.length : null; };
type Dep = 'helm' | 'ecs' | 'ec2' | 'standalone';
type Cfg = { text: string; chartVersion: string; otelVersion: string; distribution: string; label: string };
const EMPTY_CFG: Cfg = { text: '', chartVersion: '', otelVersion: '', distribution: 'otelcol-contrib', label: '' };
const DEP_NAME: Record<string, string> = { helm: 'Kubernetes', ecs: 'ECS', ec2: 'EC2', standalone: 'Standalone' };
const DEP_OPTS: [Dep, string, string][] = [['helm', 'Kubernetes', 'EKS or any cluster, Coralogix Helm chart'], ['ecs', 'ECS', 'Amazon ECS'], ['ec2', 'EC2', 'Amazon EC2'], ['standalone', 'Standalone', 'Any other host']];
export type Windows = { windowHours: number; dupWindowMinutes: number; rowLimit: number; mode?: 'relative' | 'range'; start?: string; end?: string };
const DEFAULT_WINDOWS: Windows = { windowHours: 24, dupWindowMinutes: 15, rowLimit: 200 };
const winText = (h: number) => { if (h % 24 === 0 && h >= 48) return `${h / 24} days`; if (Number.isInteger(h)) return h === 1 ? '1 hour' : `${h} hours`; const m = Math.round(h * 60); return `${Math.floor(m / 60)} h ${m % 60} min`; };
/** datetime-local value (local time, no zone) <-> ISO UTC */
const pad = (n: number) => String(n).padStart(2, '0');
const toLocalInput = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
const localToIso = (v?: string) => (v ? new Date(v).toISOString() : '');
const fmtLocal = (v?: string) => (v ? new Date(v).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '');
/** Validate a custom range; returns an error sentence or null. */
function rangeError(w: Windows): string | null {
  if (w.mode !== 'range') return null;
  if (!w.start || !w.end) return 'Pick both a start and an end.';
  const s = new Date(w.start).getTime(), e = new Date(w.end).getTime();
  if (!Number.isFinite(s) || !Number.isFinite(e)) return 'Those dates are not valid.';
  if (e > Date.now() + 60e3) return 'The end is in the future. Pick a time that has already passed.';
  if (e <= s) return 'The start must be before the end.';
  if (e - s < 3600e3) return 'The range must be at least 1 hour long.';
  if (e - s > 168 * 3600e3) return 'The range can be at most 7 days long.';
  return null;
}
const rangeHours = (w: Windows) => (new Date(w.end!).getTime() - new Date(w.start!).getTime()) / 3600e3;
/** What the window covers, in words, for the sidebar and step text. */
const windowLabel = (w: Windows) => (w.mode === 'range' && !rangeError(w) ? `${fmtLocal(w.start)} to ${fmtLocal(w.end)}` : `the last ${winText(w.windowHours)}`);
/** Options sent to the engine. */
const winOptions = (w: Windows) => ({ dupWindowMinutes: w.dupWindowMinutes, rowLimit: w.rowLimit, ...(w.mode === 'range' ? { range: { start: localToIso(w.start), end: localToIso(w.end) } } : { windowHours: w.windowHours }) });

/** Step header: what this step does, in plain words. */
function StepHeader({ step, lead, children }: { step: number; lead: string; children?: React.ReactNode }) {
  return (
    <header className="mb-10">
      <p className="mb-2 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-refract"><span aria-hidden className="h-px w-6 bg-refract/70" />Step {step + 1} of {STEPS.length}</p>
      <h1 className="font-display text-[32px] font-semibold tracking-[-0.025em] text-ink leading-tight">{STEPS[step].title}</h1>
      <p className="mt-3 text-[16px] text-mute max-w-[64ch] leading-relaxed">{lead}</p>
      {children}
    </header>
  );
}
/** Sticky action bar: always names the next action. */
function ActionBar({ onBack, next, nextLabel, disabled, note, extra }: { onBack?: () => void; next?: () => void; nextLabel?: string; disabled?: boolean; note?: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-10 mt-12 border-t border-line bg-paper/85 backdrop-blur-xl px-10 py-4 flex items-center gap-4 shadow-[0_-12px_30px_-18px_rgba(0,0,0,0.6)]">
      {onBack && <Button kind="quiet" onClick={onBack} className="text-mute"><ArrowLeft size={16} />Back</Button>}
      <p className="flex-1 text-[13.5px] text-mute font-medium">{note}</p>
      {extra}
      {next && <Button kind="primary" size="lg" disabled={disabled} onClick={next}>{nextLabel}</Button>}
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0); const [maxReached, setMax] = useState(0);
  const go = (i: number) => { setStep(i); setMax((m) => Math.max(m, i)); document.getElementById('main')?.scrollTo({ top: 0 }); window.scrollTo({ top: 0 }); };
  const [versions, setVersions] = useState<any>(null);
  const [conn, setConn] = useState({ team: '', region: 'ap1', demo: false });
  const [customer, setCustomer] = useState({ name: '', environment: '', preparedBy: '', audience: '', criticalServices: [] as string[], nearRenewal: false, teamCanVerify: true, internalTerms: [] as string[] });
  const [deployments, setDeployments] = useState<Dep[]>(['helm']); const deployment = deployments[0];
  const [pillars, setPillars] = useState<Pillar[]>(['universal', 'logs', 'traces', 'metrics']);
  const [cfgs, setCfgs] = useState<Record<string, Cfg>>({}); const cfgOf = (d: string): Cfg => cfgs[d] ?? EMPTY_CFG;
  const [win, setWin] = useState<Windows>(DEFAULT_WINDOWS);
  const [inv, setInv] = useState<any>({ enabled: true, maxContributors: 8, skills: { spanNames: true, buckets: true }, vendor: 'none / Coralogix-only' });
  const [runId, setRunId] = useState<string | null>(null);
  const [run, setRun] = useState<any>(null);
  useEffect(() => { api('/api/versions').then(setVersions).catch(() => setVersions({ error: true })); }, []);
  const today = new Date().toISOString().slice(0, 10);

  // ---- Drafts: save the whole review at any stage, resume it later ----
  const [draftId, setDraftId] = useState<string | null>(null); const [savedAt, setSavedAt] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; tone?: 'bad' } | null>(null); const [confirmRestart, setConfirmRestart] = useState(false);
  const flash = (text: string, tone?: 'bad') => { setToast({ text, tone }); setTimeout(() => setToast(null), 2600); };
  const hasProgress = !!(customer.name || Object.values(cfgs).some((c) => c.text) || runId || step > 0 || conn.team || conn.demo);
  const snapshot = () => ({ step, maxReached, conn, customer, deployments, pillars, cfgs, win, inv, runId });
  const saveDraft = async (silent = false) => {
    const id = draftId ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    try { const r = await api<{ id: string; savedAt: string }>(`/api/drafts/${id}`, { method: 'PUT', body: JSON.stringify({ name: customer.name || 'Untitled review', step, state: snapshot() }) }); setDraftId(r.id); setSavedAt(r.savedAt); if (!silent) flash('Draft saved. Resume it any time from Connect.'); return true; }
    catch (e: any) { if (!silent) flash(`Could not save the draft: ${e.message}`, 'bad'); return false; }
  };
  // Once a draft exists, keep it current as the review moves on.
  useEffect(() => { if (draftId) void saveDraft(true); }, [step, runId]);
  useEffect(() => { const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); void saveDraft(); } }; addEventListener('keydown', h); return () => removeEventListener('keydown', h); });
  const resetAll = () => {
    setConn({ team: '', region: 'ap1', demo: false }); setCustomer({ name: '', environment: '', preparedBy: '', audience: '', criticalServices: [], nearRenewal: false, teamCanVerify: true, internalTerms: [] });
    setDeployments(['helm']); setPillars(['universal', 'logs', 'traces', 'metrics']); setCfgs({}); setWin(DEFAULT_WINDOWS); setInv({ enabled: true, maxContributors: 8, skills: { spanNames: true, buckets: true }, vendor: 'none / Coralogix-only' });
    setRunId(null); setRun(null); setDraftId(null); setSavedAt(null); setStep(0); setMax(0); setConfirmRestart(false); window.scrollTo({ top: 0 });
  };
  const restart = () => (hasProgress ? setConfirmRestart(true) : resetAll());
  const resume = async (id: string) => {
    try {
      const d = await api<any>(`/api/drafts/${id}`); const s = d.state ?? {};
      setConn(s.conn ?? { team: '', region: 'ap1', demo: false }); setCustomer({ ...customer, ...s.customer }); setDeployments(s.deployments ?? [s.deployment ?? 'helm']); setPillars(s.pillars ?? ['universal', 'logs', 'traces', 'metrics']); setCfgs(s.cfgs ?? (s.cfg ? { [s.deployment ?? 'helm']: { ...EMPTY_CFG, ...s.cfg } } : {})); setWin({ ...DEFAULT_WINDOWS, ...(s.win ?? {}) }); setInv({ enabled: true, maxContributors: 8, skills: { spanNames: true, buckets: true }, vendor: 'none / Coralogix-only', ...(s.inv ?? {}) });
      let st = Math.min(s.step ?? 0, 6); let r: any = null;
      if (s.runId) { r = await api(`/api/runs/${s.runId}`).catch(() => null); if (!r) { flash('The saved assessment is no longer available, so it will run again.', 'bad'); st = Math.min(st, 3); } }
      else st = Math.min(st, 3); // without a finished assessment, resume at the last input step
      setRunId(r ? s.runId : null); setRun(r); setDraftId(d.id); setSavedAt(d.savedAt); setMax(Math.max(st, Math.min(s.maxReached ?? st, r ? 6 : 3))); setStep(st);
      flash(`Resumed “${d.name}”.`);
    } catch (e: any) { flash(`Could not open the draft: ${e.message}`, 'bad'); }
  };

  const rootRef = useRef<HTMLDivElement>(null); const [theme, setTheme] = useTheme(rootRef);
  const potential = run ? combined(run.findings, (f) => f.verifyStatus !== 'rejected') : 0;
  const verifiedUnits = run ? combined(run.findings, (f) => f.verifyStatus === 'verified') : 0;
  const base = run ? baselineOf(run) : null;
  return (
    <div ref={rootRef} className="flex h-full min-h-0 flex-col">
      <header className="relative z-20 shrink-0 border-b border-rail-line bg-rail text-rail-ink">
        <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,223,186,.45),rgba(168,85,247,.4),transparent)]" />
        <div className="flex items-center gap-4 px-6 pt-3">
          <div className="flex items-center gap-3 min-w-0"><img src={mark} alt="" width={38} height={38} className="rounded-[10px] shadow-[0_0_18px_-4px_rgba(0,223,186,.55)]" />
            <div className="min-w-0"><div className="font-display text-[17px] font-semibold tracking-[-0.02em] leading-tight text-white">Coralogix Lens</div><div className="text-[12px] text-rail-mute truncate">Telemetry Health &amp; Value Review</div></div></div>
          {run && potential > 0 && <div className="hidden md:flex items-center gap-2 rounded-full border border-[#10B981]/40 bg-[#10B981]/10 px-3 py-1 text-[12.5px] shadow-[0_0_16px_-4px_rgba(16,185,129,.55)]" aria-label="Projected savings">
            <span aria-hidden className="pulse-dot text-[#34D399]" /><span className="text-rail-mute">Projected savings</span>
            <span className="font-semibold tabnum text-[#6EE7B7]">{units(potential * 30)} <span className="font-mono font-normal text-[#A78BFA]">units/month</span></span>
            {base ? <span className="tabnum text-rail-ink">· {Math.round((potential / base) * 100)}% of today</span> : null}
            {verifiedUnits > 0 && <span className="tabnum text-rail-mute">· {units(verifiedUnits * 30)} verified</span>}</div>}
          <div className="ml-auto flex items-center gap-2">
            <ThemeSwitch value={theme} onChange={setTheme} />
            {savedAt && <span className="hidden lg:inline text-[12px] text-rail-mute">Saved {new Date(savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
            <button onClick={() => void saveDraft()} title="Save draft (⌘S). Once saved, it keeps saving as you go." className="flex items-center gap-2 rounded-full border border-rail-line px-3 py-1.5 text-[13px] text-rail-ink hover:border-step-done/60 hover:bg-white/[.05] active:scale-[0.98] transition-all"><Save size={14} aria-hidden /><span>Save draft</span><kbd className="!bg-transparent !text-rail-mute !border-rail-line">⌘S</kbd></button>
            <button onClick={restart} className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] text-rail-mute hover:text-rail-ink hover:bg-white/[.05] transition-all"><RotateCcw size={14} aria-hidden /><span className="sr-only xl:not-sr-only">Start a new review</span></button>
          </div>
        </div>
        <div className="px-6 pb-3 pt-3"><FocalTrack step={step} maxReached={maxReached} onPick={go} /></div>
      </header>
      <main id="main" className="relative min-h-0 min-w-0 flex-1 overflow-y-auto px-10 pt-9">
        <div className={cx('mx-auto', step >= 5 ? 'max-w-[1180px]' : 'max-w-[920px]')}>
          {step === 0 && <Connect conn={conn} setConn={setConn} onNext={() => go(1)} onResume={resume} />}
          {step === 1 && <Customer c={customer} set={setCustomer} deployments={deployments} setDeployments={setDeployments} onBack={() => go(0)} onNext={() => go(2)} />}
          {step === 2 && <Pillars inv={inv} setInv={setInv} value={pillars} set={setPillars} onBack={() => go(1)} onNext={() => go(3)} />}
          {step === 3 && <ConfigStep win={win} setWin={setWin} deployments={deployments} cfgs={cfgs} setCfgs={setCfgs} versions={versions} onBack={() => go(2)} onNext={() => go(4)} />}
          {step === 4 && <Assess win={win} pillars={pillars} req={{ options: { ...winOptions(win), investigate: inv }, team: conn.team || undefined, region: conn.region, demo: conn.demo, customer, pillars, deployment, deployments, configs: Object.fromEntries(deployments.map((d) => [d, cfgOf(d).text])), versionsIn: Object.fromEntries(deployments.map((d) => [d, { chartVersion: cfgOf(d).chartVersion || undefined, otelVersion: cfgOf(d).otelVersion || undefined, distribution: cfgOf(d).distribution }])) }}
            onDone={(id, r) => { setRunId(id); setRun(r); }} run={run} onNext={() => go(5)} onBack={() => go(3)} />}
          {step === 5 && run && <Verify run={run} runId={runId!} setRun={setRun} onBack={() => go(4)} onNext={() => go(6)} />}
          {step === 6 && run && <Remediate run={run} runId={runId!} onBack={() => go(5)} onRestart={restart} />}
        </div>
      </main>
      <StatusBar conn={conn} customer={customer} step={step} deployments={deployments} cfgOf={cfgOf} win={win} versions={versions} today={today} />
      {toast && <div role="status" className={cx('fixed bottom-28 right-8 z-30 rounded-xl px-4 py-3 text-[13.5px] font-medium shadow-float', toast.tone === 'bad' ? 'bg-bad text-on-color' : 'border border-rail-line bg-rail text-rail-ink shadow-[0_0_24px_-6px_rgba(0,223,186,.5)]')}>{toast.text}</div>}
      {confirmRestart && <div className="fixed inset-0 z-40 grid place-items-center bg-black/60 p-6 backdrop-blur-sm" onClick={() => setConfirmRestart(false)}>
        <div role="dialog" aria-modal="true" aria-labelledby="restart-title" onClick={(e) => e.stopPropagation()} className="card w-full max-w-[460px] !bg-raised p-6 shadow-float">
          <div className="flex items-start justify-between gap-4"><h2 id="restart-title" className="text-[18px] font-bold tracking-tight">Start a new review?</h2><button aria-label="Close" onClick={() => setConfirmRestart(false)} className="text-mute hover:text-ink"><X size={18} /></button></div>
          <p className="mt-2 text-[14.5px] text-mute leading-relaxed">You’ll go back to Connect with everything cleared. {savedAt ? 'Your draft is saved, so you can resume this review later.' : 'Save this review as a draft first if you want to come back to it.'}</p>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <Button kind="quiet" onClick={() => setConfirmRestart(false)}>Cancel</Button>
            {!savedAt && <Button onClick={resetAll}>Start over without saving</Button>}
            <Button kind="primary" autoFocus onClick={async () => { if (await saveDraft(true)) { resetAll(); flash('Draft saved. Starting a new review.'); } }}>{savedAt ? 'Save and start over' : 'Save draft and start over'}</Button>
          </div>
        </div></div>}
    </div>
  );
}

/** Footer status bar (§6): connector status pill, what this review covers, and the latest versions. */
function StatusBar({ conn, customer, step, deployments, cfgOf, win, versions, today }: any) {
  const sep = <span aria-hidden className="text-line-strong">·</span>;
  return <footer className="shrink-0 border-t border-line bg-paper/90 px-6 py-2 text-[12px] text-mute backdrop-blur" aria-label="Status">
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {conn.demo ? <span className="inline-flex items-center gap-1.5 rounded-full border border-warn/40 bg-warn/10 px-2.5 py-0.5 font-medium text-warn"><span aria-hidden>○</span>Mock mode: demo data</span>
        : conn.team ? <span className="inline-flex items-center gap-1.5 rounded-full border border-ok/40 bg-ok/10 px-2.5 py-0.5 font-medium text-ok"><span aria-hidden className="pulse-dot" />Coralogix [{String(conn.region).toUpperCase()}] · {conn.team}</span>
        : <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5"><span aria-hidden>○</span>Not connected</span>}
      {customer.name && <><span className="font-medium text-ink">{customer.name}{customer.environment && <span className="font-normal text-mute"> ({customer.environment})</span>}</span></>}
      {step >= 3 && deployments.map((d: string) => <React.Fragment key={d}>{sep}<span>{DEP_NAME[d]}: {cfgOf(d).label || (cfgOf(d).text ? 'config added' : 'no config')}</span></React.Fragment>)}
      {step >= 3 && <>{sep}<span>Data from {windowLabel(win)}</span></>}
      <span className="ml-auto flex items-center gap-2">{versions && !versions.error ? <><span>Latest Helm chart <span className="font-mono text-ink">{versions.chart}</span></span>{sep}<span>Latest OTel Collector <span className="font-mono text-ink">{versions.collector ?? 'unknown'}</span></span>{sep}<span>{versions.checkedAt?.slice(0, 10) === today ? 'Checked today' : `Checked ${versions.checkedAt?.slice(0, 10)}${versions.offline ? ', offline' : ''}`}</span></>
        : versions?.error ? 'Could not check the latest versions.' : <span className="flex items-center gap-2" aria-label="Checking latest versions"><Skeleton className="h-2.5 w-24" /><Skeleton className="h-2.5 w-28" /></span>}</span>
    </div>
  </footer>;
}

function ToolRow({ icon: Icon, name, role, h, needTeam, optional }: any) {
  const state = needTeam ? 'idle' : !h ? 'loading' : h.ok ? 'ok' : 'bad';
  return <li className="flex items-start gap-3 py-3"><Icon size={18} className="mt-0.5 text-mute" aria-hidden />
    <div className="flex-1"><p className="text-[14px] font-medium">{name}</p><p className="text-[13px] text-mute">{role}</p>{state === 'bad' && <p className={cx('text-[12.5px] mt-1', optional ? 'text-mute' : 'text-bad')}>{optional ? 'Not installed. Everything else works without it; the duplicate-field check is then left for you to scope.' : h.detail}</p>}</div>
    {state === 'ok' ? <Pill tone="ok" icon={CircleCheck}>Ready</Pill> : state === 'bad' ? (optional ? <Pill>Not installed</Pill> : <Pill tone="bad" icon={CircleX}>Not available</Pill>) : state === 'loading' ? <span role="progressbar" aria-busy="true" aria-label="Checking"><Skeleton className="h-5 w-20 rounded-full" /></span> : <Pill>Pick a team first</Pill>}</li>;
}

function UsageKey({ team, region }: { team: string; region: string }) {
  const [data, setData] = useState<any>(null); const [adding, setAdding] = useState(false); const [label, setLabel] = useState(''); const [key, setKey] = useState('');
  const [msg, setMsg] = useState<{ t: string; ok: boolean } | null>(null); const [busy, setBusy] = useState(false);
  const load = () => api(`/api/usage-keys?team=${encodeURIComponent(team)}`).then((d) => { setData(d); if (!d.keys.length) setAdding(true); }).catch((e) => setMsg({ t: e.message, ok: false }));
  useEffect(() => { setMsg(null); setAdding(false); load(); }, [team]);
  const test = () => { setBusy(true); api(`/api/usage-keys/test?team=${encodeURIComponent(team)}&region=${region}`).then((r) => setMsg({ t: r.detail, ok: r.ok })).catch((e) => setMsg({ t: e.message, ok: false })).finally(() => setBusy(false)); };
  const select = (id: string | null) => api('/api/usage-keys/select', { method: 'PUT', body: JSON.stringify({ team, id }) }).then((d) => { setData((x: any) => ({ ...x, ...d })); setMsg(null); });
  const selected = data?.keys.find((k: any) => k.id === data.selected);
  return <div className="card p-4">
    <div className="flex items-start justify-between gap-4"><div><p className="text-[14.5px] font-semibold">Exact metric usage <span className="font-normal text-[13px] text-mute">(optional)</span></p><p className="text-[13px] text-mute">Units per metric and per label, as in Settings › Metrics Data. Needs a key with the DataAnalytics preset; without one, metric savings are estimated from series.</p></div>
      <span className="shrink-0 whitespace-nowrap">{selected ? (msg && !msg.ok ? <Pill tone="warn" icon={CircleAlert}>Key not working</Pill> : <Pill tone="ok" icon={CircleCheck}>Using a saved key</Pill>) : <Pill>Estimated</Pill>}</span></div>
    {!data && !msg && <SkeletonRows rows={2} label="Loading saved keys" className="mt-4" />}
    {data && <div className="mt-3 flex flex-wrap items-end gap-3">
      <Field label={`Key for ${team}`}><select aria-label="Saved metric usage key" className={cx(inputCls, 'min-w-[280px]')} value={adding ? '__add' : data.selected ?? ''} onChange={(e) => { const v = e.target.value; if (v === '__add') { setAdding(true); return; } setAdding(false); void select(v || null); }}>
        <option value="">None (estimate from series)</option>
        {data.keys.map((k: any) => <option key={k.id} value={k.id}>{k.label}{k.teams.length && !k.teams.includes(team) ? ` (also used by ${k.teams.join(', ')})` : ''}</option>)}
        <option value="__add">Add a new key…</option></select></Field>
      {selected && !adding && <Button onClick={test} disabled={busy}>{busy ? <><Loader2 size={15} className="animate-spin" />Testing…</> : 'Test key'}</Button>}
      {selected && !adding && <Button kind="quiet" onClick={() => api(`/api/usage-keys/${selected.id}`, { method: 'DELETE' }).then(load)}>Delete this key</Button>}
    </div>}
    {adding && <div className="mt-3 rounded-lg bg-sunk p-3 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3"><Field label="Name"><input className={inputCls} placeholder={`${team} – DataAnalytics`} value={label} onChange={(e) => setLabel(e.target.value)} /></Field><Field label="API key"><input type="password" autoComplete="off" className={inputCls} value={key} onChange={(e) => setKey(e.target.value)} /></Field></div>
      <p className="text-[12.5px] text-mute flex gap-1.5"><KeyRound size={13} className="mt-0.5 shrink-0" />Saved in the macOS Keychain. Lens keeps only the name, so next time you pick it from the list. Used only for the read-only Metric Usage API.</p>
      <div className="flex gap-2"><Button kind="primary" disabled={!key || busy} onClick={() => { setBusy(true); api('/api/usage-keys', { method: 'POST', body: JSON.stringify({ label: label || `${team} – DataAnalytics`, apiKey: key, team }) }).then(() => { setKey(''); setLabel(''); setAdding(false); return load(); }).then(test).catch((e) => { setMsg({ t: e.message, ok: false }); setBusy(false); }); }}>Save and use for {team}</Button>{data?.keys.length > 0 && <Button kind="quiet" onClick={() => setAdding(false)}>Cancel</Button>}</div>
    </div>}
    {msg && <p role="status" className={cx('mt-2 text-[13px]', msg.ok ? 'text-ok' : 'text-bad')}>{msg.t}</p>}
  </div>;
}

function Prereqs({ conn }: { conn: any }) {
  const [state, setState] = useState<any>(null); const [busy, setBusy] = useState(false);
  const runCheck = () => { setBusy(true); setState(null); api(`/api/prereqs${conn.team ? `?team=${conn.team}&region=${conn.region}` : ''}`).then(setState).catch((e) => setState({ error: e.message })).finally(() => setBusy(false)); };
  return <div className="mt-4">
    <Button onClick={runCheck} disabled={busy}>{busy ? <><Loader2 size={15} className="animate-spin" />Checking…</> : <><ClipboardCheck size={15} />Check prerequisites</>}</Button>
    {busy && <div className="mt-3 card p-4"><SkeletonRows rows={4} label="Checking prerequisites" /></div>}
    {state && !state.error && <div className="mt-3 card"><p className={cx('px-4 py-2.5 text-[13.5px] font-semibold border-b border-line', state.ok ? 'text-ok' : 'text-warn')}>{state.ok ? 'Ready: everything required is in place.' : 'Something required is missing.'}</p>
      <ul className="divide-y divide-line">{state.checks.map((c: any) => <li key={c.id} className="flex items-start gap-3 px-4 py-2.5 text-[13.5px]">{c.ok ? <CircleCheck size={16} className="mt-0.5 text-ok shrink-0" /> : c.required ? <CircleX size={16} className="mt-0.5 text-bad shrink-0" /> : <CircleDashed size={16} className="mt-0.5 text-mute shrink-0" />}
        <div className="flex-1 min-w-0"><p className="font-medium">{c.label.replace(' (optional, validates generated config)', ' (validates generated config)')}{!c.required && <span className="font-normal text-mute"> (optional)</span>}</p><p className="text-[12.5px] text-mute break-words">{c.detail}</p>{!c.ok && c.fix && <p className="mt-1 text-[12px] text-mute">Fix: <code className="rounded bg-sunk px-1.5 py-0.5 break-all">{c.fix}</code></p>}</div></li>)}</ul></div>}
    {state?.error && <p className="mt-2 text-[13px] text-bad">{state.error}</p>}
  </div>;
}

function Connect({ conn, setConn, onNext, onResume }: any) {
  const [drafts, setDrafts] = useState<any[] | null>(null);
  useEffect(() => { api<any[]>('/api/drafts').then(setDrafts).catch(() => setDrafts([])); }, []);
  const [teams, setTeams] = useState<any[] | null>(null); const [health, setHealth] = useState<any>(null); const [adding, setAdding] = useState(false); const [nt, setNt] = useState({ name: '', region: 'ap1', apiKey: '' }); const [err, setErr] = useState('');
  useEffect(() => { api('/api/teams').then(setTeams).catch(() => setTeams([])); }, []);
  useEffect(() => { setHealth(null); api(`/api/health${conn.team ? `?team=${conn.team}&region=${conn.region}` : ''}`).then(setHealth).catch((e) => setHealth({ error: e.message })); }, [conn.team, conn.region]);
  return <>
    <StepHeader step={0} lead="Choose the customer’s Coralogix team. Lens only reads data: it runs queries and usage reports, and never changes settings, policies or collectors." />
    <div className="grid lg:grid-cols-[1fr_340px] gap-6">
      <div className="space-y-4">
        <div className={cx('card p-5', conn.team && !conn.demo && '!border-refract/70 shadow-glow-cyan')}>
          <div className="flex items-center gap-2 mb-1"><Cloud size={18} className="text-refract" /><h2 className="text-[16px] font-semibold">Use a connected team</h2></div>
          <p className="text-[13.5px] text-mute mb-4">Teams come from your cx CLI profiles. Lens uses cx’s own sign-in, so it never needs your API key.</p>
          <div className="grid sm:grid-cols-[1fr_140px] gap-3">
            <Field label="Team">{teams === null ? <div className={cx(inputCls, 'flex h-[38px] items-center')}><span className="sr-only">Loading teams…</span><Skeleton className="h-2.5 w-36" /></div> : teams.length ? <select className={inputCls} value={conn.team} onChange={(e) => { const t = teams.find((x) => x.name === e.target.value); setConn({ ...conn, team: e.target.value, region: t?.region ?? conn.region, demo: false }); }}><option value="">Choose a team</option>{teams.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}</select> : <p className="text-[13.5px] text-mute py-2">No teams yet. Add one below.</p>}</Field>
            <Field label="Region"><select className={inputCls} value={conn.region} onChange={(e) => setConn({ ...conn, region: e.target.value })}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></Field>
          </div>
        </div>
        {conn.team && <UsageKey team={conn.team} region={conn.region} />}
        <div className="grid sm:grid-cols-2 gap-4">
          <button onClick={() => setAdding(!adding)} aria-expanded={adding} className={cx('card text-left p-5 transition-all hover:!border-refract/60 hover:-translate-y-px', adding && '!border-refract/70 shadow-glow-cyan')}><Plus size={18} className="text-refract" /><p className="mt-2 text-[15px] font-semibold">Add a team</p><p className="text-[13px] text-mute mt-1">Only if the team has no cx profile. Easiest: run <code className="font-mono text-[12px]">cx profiles add</code> in Terminal.</p></button>
          <button onClick={() => { setConn({ ...conn, demo: true, team: '' }); onNext(); }} className="card text-left p-5 transition-all hover:!border-prism/60 hover:shadow-glow-purple hover:-translate-y-px"><FlaskConical size={18} className="text-prism" /><p className="mt-2 text-[15px] font-semibold">Use demo data</p><p className="text-[13px] text-mute mt-1">Try the whole review with recorded, anonymised data.</p></button>
        </div>
        {adding && <div className="card !border-refract/60 p-5 space-y-3">
          <div className="grid sm:grid-cols-3 gap-3"><Field label="Name"><input className={inputCls} value={nt.name} onChange={(e) => setNt({ ...nt, name: e.target.value })} /></Field><Field label="Region"><select className={inputCls} value={nt.region} onChange={(e) => setNt({ ...nt, region: e.target.value })}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></Field><Field label="API key"><input type="password" autoComplete="off" className={inputCls} value={nt.apiKey} onChange={(e) => setNt({ ...nt, apiKey: e.target.value })} /></Field></div>
          <p className="text-[12.5px] text-mute flex items-center gap-1.5"><KeyRound size={13} />Stored in the Keychain only. Never written to disk or logs. Read access is enough.</p>
          {err && <p className="text-[13px] text-bad">{err}</p>}
          <Button kind="primary" disabled={!nt.name || !nt.apiKey} onClick={() => api('/api/teams', { method: 'POST', body: JSON.stringify(nt) }).then(() => { setConn({ team: nt.name, region: nt.region, demo: false }); setAdding(false); setNt({ name: '', region: 'ap1', apiKey: '' }); }).catch((e) => setErr(e.message))}>Save team</Button>
        </div>}
      </div>
      <aside className="card px-5 py-2 self-start"><h2 className="text-[14px] font-semibold pt-3">What Lens uses on this Mac</h2>
        <ul className="divide-y divide-line">
          <ToolRow icon={Terminal} name="cx CLI" role="Runs read-only log, trace and metric queries and usage reports, using its own sign-in" h={health?.cx} />
          <ToolRow optional icon={Sparkles} name="claude CLI" role="Investigate mode: analyses masked live samples. Use Check prerequisites to confirm it is signed in." h={health?.claude} />
        </ul><Prereqs conn={conn} /><div className="pb-4" /></aside>
    </div>
    {!!drafts?.length && <section className="mt-8" aria-labelledby="drafts-title">
      <h2 id="drafts-title" className="text-[16px] font-semibold flex items-center gap-2"><FolderOpen size={17} className="text-refract" />Saved drafts</h2>
      <p className="text-[13.5px] text-mute mt-1">Pick up where you left off. Drafts stay on this Mac and never contain API keys.</p>
      <ul className="mt-3 grid sm:grid-cols-2 gap-3">{drafts.map((d) => <li key={d.id} className="flex items-center gap-3 card px-4 py-3">
        <div className="flex-1 min-w-0"><p className="text-[14.5px] font-semibold truncate">{d.name}</p><p className="text-[12.5px] text-mute">Step {d.step + 1}: {STEPS[Math.min(d.step, 6)].title}{d.demo ? ', demo data' : d.team ? `, ${d.team}` : ''}. Saved {new Date(d.savedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p></div>
        <Button onClick={() => onResume(d.id)}>Resume</Button>
        <button aria-label={`Delete draft ${d.name}`} onClick={() => api(`/api/drafts/${d.id}`, { method: 'DELETE' }).then(() => setDrafts(drafts.filter((x) => x.id !== d.id)))} className="rounded-lg p-2 text-mute hover:text-bad hover:bg-sunk"><Trash2 size={16} /></button>
      </li>)}</ul>
    </section>}
    <ActionBar next={onNext} nextLabel="Continue to customer details" disabled={!conn.team} note={conn.team ? `Connected to ${conn.team}.` : 'Choose a team, or use demo data.'} />
  </>;
}

function Tags({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [t, setT] = useState('');
  const add = () => { const v = t.split(',').map((s) => s.trim()).filter(Boolean); if (v.length) onChange([...new Set([...value, ...v])]); setT(''); };
  return <div className={cx(inputCls, 'flex flex-wrap gap-1.5 items-center')}>{value.map((v) => <span key={v} className="inline-flex items-center gap-1 rounded-md bg-refract-soft text-refract px-2 py-0.5 text-[13px] font-medium">{v}<button aria-label={`Remove ${v}`} className="opacity-70 hover:opacity-100" onClick={() => onChange(value.filter((x) => x !== v))}>×</button></span>)}
    <input className="flex-1 min-w-[140px] bg-transparent outline-none" value={t} placeholder={value.length ? '' : placeholder} onChange={(e) => setT(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }} onBlur={add} /></div>;
}

function Customer({ c, set, deployments, setDeployments, onBack, onNext }: any) {
  return <>
    <StepHeader step={1} lead="Tell Lens who the review is for. These details appear on the report, and the critical services decide which traces are always kept." />
    <div className="space-y-7 max-w-[720px]">
      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Customer name"><input className={inputCls} value={c.name} onChange={(e) => set({ ...c, name: e.target.value })} /></Field>
        <Field label="Environment"><input className={inputCls} placeholder="production" value={c.environment} onChange={(e) => set({ ...c, environment: e.target.value })} /></Field>
        <Field label="Prepared by"><input className={inputCls} value={c.preparedBy} onChange={(e) => set({ ...c, preparedBy: e.target.value })} /></Field>
      </div>
      <fieldset><legend className="text-[13.5px] font-medium mb-1">How do they run the OpenTelemetry Collector?</legend><p className="text-[12.5px] text-mute mb-2">Select every type they use. You can add a config for each one in the next steps.</p>
        <div className="grid sm:grid-cols-4 gap-2">{DEP_OPTS.map(([v, l, s]) => { const on = deployments.includes(v); return (
          <label key={v} className={cx('relative cursor-pointer rounded-xl border bg-surface/70 px-3 py-2.5 transition-all', on ? 'border-refract/70 shadow-glow-cyan' : 'border-line hover:border-line-strong')}><input type="checkbox" className="sr-only" checked={on} onChange={() => setDeployments(on ? (deployments.length > 1 ? deployments.filter((x: string) => x !== v) : deployments) : [...deployments, v])} /><span className="flex items-center justify-between"><span className="block text-[14px] font-medium">{l}</span><span aria-hidden className={cx('grid h-4 w-4 place-items-center rounded border', on ? 'bg-refract border-refract text-on-color' : 'border-line')}>{on && <Check size={12} strokeWidth={3} />}</span></span><span className="block text-[12.5px] text-mute">{s}</span></label>); })}</div>
        {deployments.length > 1 && <p className="mt-2 text-[12.5px] text-mute">Data checks run once for the whole team, so savings are never counted twice. Config checks and generated configs are done per type.</p>}</fieldset>
      <Field label="Leadership slide is for" hint="Shown above the one-slide summary at the top of the report. Leave empty for “leadership”."><input className={inputCls} placeholder="the CTO and co-founders" value={c.audience} onChange={(e) => set({ ...c, audience: e.target.value })} /></Field>
      <Field label="Critical services" hint="Errors from these services are always kept by tail sampling, and their internal spans are never dropped. Press Enter after each name."><Tags value={c.criticalServices} onChange={(v) => set({ ...c, criticalServices: v })} placeholder="checkout, payment" /></Field>
      <Field label="Names to keep out of the customer report" hint="People, team names or project names. Links, account IDs and API keys are removed automatically."><Tags value={c.internalTerms} onChange={(v) => set({ ...c, internalTerms: v })} placeholder="Optional" /></Field>
      <div className="card p-4 space-y-2.5 text-[14px]">
        <p className="text-[13.5px] font-medium">Before you start</p>
        <label className="flex gap-2.5 items-start"><input type="checkbox" className="mt-1" checked={c.nearRenewal} onChange={(e) => set({ ...c, nearRenewal: e.target.checked })} /><span>The customer is close to renewal</span></label>
        <label className="flex gap-2.5 items-start"><input type="checkbox" className="mt-1" checked={c.teamCanVerify} onChange={(e) => set({ ...c, teamCanVerify: e.target.checked })} /><span>The customer’s team can join the Verify step</span></label>
        {(c.nearRenewal || !c.teamCanVerify) && <div role="note" className="flex gap-2 rounded-lg bg-warnbg px-3 py-2.5 text-[13.5px] text-warn"><CircleAlert size={16} className="mt-0.5 shrink-0" /><div>{c.nearRenewal && <p>Talk to the account owner before sharing this review.</p>}{!c.teamCanVerify && <p>Without the customer in Verify, changes can break their dashboards or alerts. You can still run the assessment.</p>}</div></div>}
      </div>
    </div>
    <ActionBar onBack={onBack} next={onNext} nextLabel="Continue to pillars" disabled={!c.name} note={c.name ? undefined : 'Add the customer name to continue.'} />
  </>;
}

const PILLAR_INFO: Record<Pillar, { body: string; checks: string[] }> = {
  universal: { body: 'Pipeline-wide fixes that help every signal at once.', checks: ['Unused resource attributes', 'Memory protection and batching', 'Kubernetes metadata allowlist', 'Protected labels'] },
  logs: { body: 'Where log volume comes from, and what nobody reads.', checks: ['Heavy attributes', 'Split multi-line logs', 'Duplicates and low-value logs', 'TCO tier fit'] },
  traces: { body: 'Keep the traces that explain problems; sample the rest.', checks: ['Tail sampling', 'Health checks and probes', 'Internal spans', 'Span metrics first'] },
  metrics: { body: 'Series that grow without adding insight.', checks: ['High-churn labels', 'Span names per service', 'Unused metrics', 'Scrape intervals'] },
};
function Pillars({ value, set, onBack, onNext, inv, setInv }: any) {
  return <>
    <StepHeader step={2} lead="Choose what to review. Universal always runs first, because pipeline fixes change the numbers for every other pillar." />
    <div className="grid sm:grid-cols-2 gap-4">{(Object.keys(PILLAR_INFO) as Pillar[]).map((p) => { const on = value.includes(p) || p === 'universal'; const P = PILLARS[p]; return (
      <button key={p} aria-pressed={on} disabled={p === 'universal'} onClick={() => set(on ? value.filter((x: Pillar) => x !== p) : [...value, p])} style={on ? { borderColor: P.color, boxShadow: `0 0 26px -14px ${P.color}` } : undefined}
        className={cx('card text-left p-5 transition-all', !on && 'hover:!border-line-strong', p === 'universal' && 'cursor-default')}>
        <span aria-hidden className={cx('absolute inset-x-0 top-0 h-1', on ? P.bg : 'bg-transparent')} />
        <div className="flex items-start justify-between"><span className={cx('grid h-10 w-10 place-items-center rounded-lg', on ? `${P.bg} text-on-color` : 'bg-sunk text-mute')}><P.icon size={20} /></span>
          <span className={cx('grid h-6 w-6 place-items-center rounded-full border-2', on ? `${P.border} ${P.bg} text-on-color` : 'border-line')}>{on && <Check size={14} strokeWidth={3} />}</span></div>
        <p className="mt-3 text-[17px] font-semibold">{P.name}{p === 'universal' && <span className="ml-2 text-[12.5px] font-medium text-universal">Always runs first</span>}</p>
        <p className="text-[13.5px] text-mute mt-1">{PILLAR_INFO[p].body}</p>
        <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[13px]">{PILLAR_INFO[p].checks.map((c) => <li key={c} className="flex gap-1.5"><span className={cx('mt-[7px] h-1.5 w-1.5 rounded-full shrink-0', P.bg)} />{c}</li>)}</ul>
      </button>); })}</div>
    <section aria-labelledby="inv-title" className={cx('mt-6 card p-5', inv.enabled && '!border-prism/60 shadow-glow-purple')}>
      <div className="flex items-start gap-4">
        <span className={cx('grid h-10 w-10 shrink-0 place-items-center rounded-lg', inv.enabled ? 'bg-prism text-on-color' : 'bg-sunk text-mute')}><Microscope size={20} /></span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3"><h2 id="inv-title" className="text-[17px] font-semibold">Investigate with Claude</h2><span className="text-[12.5px] text-mute">Recommended</span>
            <label className="ml-auto flex items-center gap-2 text-[13.5px] font-medium"><input type="checkbox" checked={inv.enabled} onChange={(e) => setInv({ ...inv, enabled: e.target.checked })} />Turn on</label></div>
          <p className="text-[13.5px] text-mute mt-1 max-w-[72ch]">Goes beyond the playbook checks. Lens finds what drives the most volume: log patterns, span operations, and the metrics and labels behind series cardinality. It pulls live samples with cx and asks Claude what each one is and how to optimise it. Lens then checks every suggestion against real data, simulates the change, and works out the saving from official rates.</p>
          {inv.enabled && <div className="mt-3 flex flex-wrap items-center gap-3 text-[13.5px]"><span className="font-medium">Contributors to analyse</span>
            <div role="radiogroup" aria-label="Contributors to analyse" className="inline-flex rounded-lg border border-line bg-sunk p-1 gap-1">{[5, 8, 12].map((n) => <button key={n} role="radio" aria-checked={inv.maxContributors === n} onClick={() => setInv({ ...inv, maxContributors: n })} className={cx('rounded-md px-3 py-1 font-medium', inv.maxContributors === n ? 'bg-raised shadow-sm ring-1 ring-prism/40' : 'text-mute')}>{n === 8 ? '8 (default)' : n}</button>)}</div>
            <span className="text-[12.5px] text-mute">More contributors take longer. A typical run takes 1–3 minutes.</span></div>}
          {inv.enabled && <div className="mt-4 rounded-lg bg-sunk px-4 py-3"><p className="text-[13.5px] font-medium">TAM skills for metrics <span className="font-normal text-mute">(from the playbook’s AI Skills tab; run when Metrics is selected)</span></p>
            <div className="mt-2 grid gap-2 text-[13.5px]">
              <label className="flex gap-2 items-start"><input type="checkbox" className="mt-1" checked={inv.skills?.spanNames !== false} onChange={(e) => setInv({ ...inv, skills: { ...inv.skills, spanNames: e.target.checked } })} /><span><span className="font-medium">span-name-cardinality-analyzer</span><span className="text-mute">: finds IDs and query strings in span names and writes the sanitisation patterns. Lens tests them on every real span name.</span></span></label>
              <label className="flex gap-2 items-start"><input type="checkbox" className="mt-1" checked={inv.skills?.buckets !== false} onChange={(e) => setInv({ ...inv, skills: { ...inv.skills, buckets: e.target.checked } })} /><span><span className="font-medium">span-metrics-bucket-optimizer</span><span className="text-mute">: proposes histogram buckets from the live latency distribution. Lens computes the percentiles and the series change.</span></span></label>
              {inv.skills?.buckets !== false && <label className="flex flex-wrap items-center gap-2 pl-6"><span className="text-mute">Vendor the customer compares against</span><select className="rounded-lg border border-line bg-surface px-2 py-1" value={inv.vendor} onChange={(e) => setInv({ ...inv, vendor: e.target.value })}>{['none / Coralogix-only', 'Datadog', 'New Relic', 'Splunk Observability', 'Grafana (Mimir/Prometheus)', 'Dynatrace'].map((v) => <option key={v}>{v}</option>)}</select></label>}
            </div><p className="mt-2 text-[12px] text-mute">Lens collects the data each skill needs through cx, so no API key is shared and Claude runs with tools off.</p></div>}
          {inv.enabled && <p className="mt-3 text-[12.5px] text-mute flex gap-1.5"><KeyRound size={13} className="mt-0.5 shrink-0" />Samples are masked on this Mac (emails, IPs, tokens, keys, card numbers) before they go to Claude through the claude CLI. Claude runs with tools switched off and nothing is saved as a session. The masked samples appear on each finding, exactly as sent.</p>}
        </div></div>
    </section>
    <ActionBar onBack={onBack} next={onNext} nextLabel="Continue to config" note={`${new Set(['universal', ...value]).size} of 4 pillars selected.`} />
  </>;
}

const VOLUME_OPTS: [number, string, string][] = [[1, '1 hour', 'Quickest, but misses daily patterns'], [6, '6 hours', ''], [24, '24 hours (default)', 'Recommended: one full daily cycle'], [72, '3 days', ''], [168, '7 days', 'Includes weekly patterns; slowest']];
const DUP_OPTS: [number, string][] = [[5, '5 min'], [15, '15 min (default)'], [30, '30 min'], [60, '60 min']];
const ROW_OPTS = [100, 200, 500, 1000];
function Segmented({ label, value, options, onChange }: { label: string; value: number; options: [number, string][]; onChange: (v: number) => void }) {
  return <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap rounded-lg border border-line bg-sunk p-1 gap-1">{options.map(([v, l]) =>
    <button key={v} role="radio" aria-checked={value === v} onClick={() => onChange(v)} className={cx('rounded-md px-3 py-1.5 text-[13.5px] font-medium transition-all', value === v ? 'bg-raised text-ink shadow-sm ring-1 ring-refract/40' : 'text-mute hover:text-ink')}>{l}</button>)}</div>;
}
function WindowSettings({ win, setWin }: { win: Windows; setWin: (w: Windows) => void }) {
  const mode = win.mode ?? 'relative'; const err = rangeError(win);
  const hint = VOLUME_OPTS.find(([v]) => v === win.windowHours)?.[2];
  const changed = mode !== 'relative' || win.windowHours !== DEFAULT_WINDOWS.windowHours || win.dupWindowMinutes !== DEFAULT_WINDOWS.dupWindowMinutes || win.rowLimit !== DEFAULT_WINDOWS.rowLimit;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date(); const nowInput = toLocalInput(now);
  const preset = (s: Date, e: Date) => setWin({ ...win, mode: 'range', start: toLocalInput(s), end: toLocalInput(e) });
  const midnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const toRange = () => { const e = new Date(Math.floor(now.getTime() / 3600e3) * 3600e3); preset(new Date(e.getTime() - win.windowHours * 3600e3), e); };
  return <section className="mt-10" aria-labelledby="win-title">
    <div className="flex items-baseline justify-between gap-4"><h2 id="win-title" className="text-[16px] font-semibold">Analysis window</h2>{changed && <Button kind="quiet" onClick={() => setWin(DEFAULT_WINDOWS)}>Reset to defaults</Button>}</div>
    <p className="text-[13.5px] text-mute mt-1 max-w-[68ch]">How much data the checks look at. Whatever you choose, results are converted to a per-day figure. Usage numbers always use the last 7 complete days, leaving out today because it is still in progress.</p>
    <p className="text-[13px] mt-2 mb-4"><span className="font-medium">Defaults:</span> <span className="text-mute">last 24 hours for volume checks, 15 minutes for duplicate checks, 200 rows per query.</span></p>
    <div className="card divide-y divide-line">
      <div className="p-4 grid md:grid-cols-[220px_1fr] gap-3 items-start"><div><p className="text-[14px] font-medium">Volume checks</p><p className="text-[12.5px] text-mute">Attribute sizes, noisy logs, spans, metric series</p></div>
        <div>
          <div role="radiogroup" aria-label="Time range" className="grid sm:grid-cols-2 gap-2 max-w-[600px]">
            {([['relative', 'Recent period', 'From 1 hour to 7 days, up to now'], ['range', 'Specific dates', 'A start and end you choose, up to 7 days']] as const).map(([m, l, s]) => { const on = mode === m; return (
              <button key={m} type="button" role="radio" aria-checked={on} onClick={() => (m === 'range' && mode !== 'range' ? (win.start && win.end ? setWin({ ...win, mode: 'range' }) : toRange()) : setWin({ ...win, mode: m }))}
                className={cx('flex items-start gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-all', on ? 'border-refract bg-refract-soft' : 'border-line hover:border-mute')}>
                <span aria-hidden className={cx('mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border-2', on ? 'border-refract' : 'border-line')}>{on && <span className="h-2 w-2 rounded-full bg-refract" />}</span>
                <span><span className="block text-[14px] font-medium">{l}</span><span className="block text-[12.5px] text-mute">{s}</span></span></button>); })}
          </div>
          <div className="mt-3 max-w-[600px] rounded-lg border border-line bg-paper px-4 py-3.5">
          {mode === 'relative' ? <>
            <p className="text-[12.5px] font-medium text-mute mb-2">Look back over the last</p>
            <Segmented label="Volume checks window" value={win.windowHours} options={VOLUME_OPTS.map(([v, l]) => [v, l])} onChange={(v) => setWin({ ...win, mode: 'relative', windowHours: v })} />
            {hint && <p className="mt-2 text-[12.5px] text-mute">{hint}</p>}
            {win.windowHours > 24 && <p className="mt-1 text-[12.5px] text-warn">Longer windows scan more data, so queries take longer and may hit Coralogix query limits on very large accounts.</p>}
          </> : <>
            <div className="grid sm:grid-cols-2 gap-3 max-w-[560px]">
              <Field label="Start"><input type="datetime-local" className={inputCls} value={win.start ?? ''} max={win.end || nowInput} onChange={(e) => setWin({ ...win, start: e.target.value })} /></Field>
              <Field label="End"><input type="datetime-local" className={inputCls} value={win.end ?? ''} max={nowInput} onChange={(e) => setWin({ ...win, end: e.target.value })} /></Field>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-[12.5px]"><span className="text-mute py-1">Quick picks:</span>
              {([['Yesterday', () => preset(new Date(midnight(now).getTime() - 864e5), midnight(now))], ['Last 7 full days', () => preset(new Date(midnight(now).getTime() - 7 * 864e5), midnight(now))], ['Same 24 h last week', () => { const e = new Date(Math.floor(now.getTime() / 3600e3) * 3600e3 - 7 * 864e5); preset(new Date(e.getTime() - 864e5), e); }]] as [string, () => void][]).map(([l, f]) => <button key={l} onClick={f} className="rounded-full border border-line px-2.5 py-1 hover:border-refract hover:text-refract">{l}</button>)}
            </div>
            <p className={cx('mt-2 text-[12.5px]', err ? 'text-bad' : 'text-mute')} role={err ? 'alert' : undefined}>{err ?? `${winText(rangeHours(win))} in your time zone (${tz}): ${localToIso(win.start).slice(0, 16).replace('T', ' ')} to ${localToIso(win.end).slice(0, 16).replace('T', ' ')} UTC. Between 1 hour and 7 days; the end must be in the past.`}</p>
          </>}
          </div>
        </div></div>
      <div className="p-4 grid md:grid-cols-[220px_1fr] gap-3 items-start"><div><p className="text-[14px] font-medium">Duplicate checks</p><p className="text-[12.5px] text-mute">Logs shipped more than once</p></div>
        <div><Segmented label="Duplicate checks window" value={win.dupWindowMinutes} options={DUP_OPTS} onChange={(v) => setWin({ ...win, dupWindowMinutes: v })} /><p className="mt-2 text-[12.5px] text-mute">{mode === 'range' ? 'Uses the final minutes of your custom range' : 'A short window keeps this fast'}; the count is scaled up to a day.</p></div></div>
      <div className="p-4 grid md:grid-cols-[220px_1fr] gap-3 items-start"><div><p className="text-[14px] font-medium">Rows per query</p><p className="text-[12.5px] text-mute">Upper limit on results returned</p></div>
        <div><Segmented label="Rows per query" value={win.rowLimit} options={ROW_OPTS.map((v) => [v, v === 200 ? '200 (default)' : String(v)])} onChange={(v) => setWin({ ...win, rowLimit: v })} /><p className="mt-2 text-[12.5px] text-mute">Totals are computed inside each query, so this mostly limits how many items (services, templates) are listed.</p></div></div>
    </div>
  </section>;
}
function VersionBox({ label, cur, latest, onChange, placeholder }: any) {
  const behind = (() => { if (!cur || !latest) return null; const a = cur.split('.').map(Number), b = latest.split('.').map(Number); if (a.some(isNaN)) return null; return a[0] === b[0] && a[1] === b[1] ? b[2] - a[2] : (b[1] - a[1]) * 1000; })();
  return <div className="card p-4"><p className="text-[13.5px] font-medium">{label}</p>
    <div className="mt-2 flex items-center gap-3"><input aria-label={`${label} in use`} className={cx(inputCls, 'w-32 tabnum')} placeholder={placeholder} value={cur} onChange={(e) => onChange(e.target.value)} /><span className="text-mute text-[13px] whitespace-nowrap">in use</span><span className="text-mute">→</span><span className="tabnum text-[14px] font-medium">{latest ?? '…'}</span><span className="text-mute text-[13px]">latest</span></div>
    <div className="mt-2.5">{!cur ? <Pill>Not set: the report assumes the latest</Pill> : behind === 0 ? <Pill tone="ok" icon={CircleCheck}>Up to date</Pill> : behind && behind > 0 && behind < 1000 ? <Pill tone="warn" icon={CircleAlert}>{behind} versions behind</Pill> : <Pill tone="warn" icon={CircleAlert}>Behind the latest</Pill>}</div></div>;
}
function Slot({ dep, cfg, set, versions }: { dep: Dep; cfg: Cfg; set: (c: Cfg | ((cur: Cfg) => Cfg)) => void; versions: any }) {
  const [det, setDet] = useState<any>(null); const [drag, setDrag] = useState(false); const [paste, setPaste] = useState(false);
  useEffect(() => { const tm = setTimeout(() => api('/api/config/detect', { method: 'POST', body: JSON.stringify({ text: cfg.text }) }).then((d) => { setDet(d); set((cur) => ({ ...cur, label: cur.text ? d.label : '', chartVersion: cur.chartVersion || d.chartVersion || '', otelVersion: cur.otelVersion || d.collectorVersion || '' })); }).catch(() => {}), 300); return () => clearTimeout(tm); }, [cfg.text]);
  const onFile = (f: File) => f.text().then((x) => set({ ...cfg, text: x }));
  // Mismatch: a Helm values file in the ECS slot, a collector config in the Kubernetes slot, ECS vs EC2.
  const mismatch = cfg.text && det && det.format !== 'empty' ? (dep === 'helm' && det.format !== 'helm-values' ? 'This looks like a collector config, not Coralogix Helm values.' : dep !== 'helm' && det.format === 'helm-values' ? `This looks like Coralogix Helm values, not a ${DEP_NAME[dep]} collector config.` : dep !== 'helm' && det.deployment && det.deployment !== dep && det.deployment !== 'standalone' ? `This looks like a ${DEP_NAME[det.deployment]} config.` : '') : '';
  return <section className="card" aria-label={`${DEP_NAME[dep]} config`}>
    <div className="flex items-center gap-3 border-b border-line px-5 py-3"><h2 className="flex-1 text-[16px] font-semibold">{DEP_NAME[dep]}</h2>{cfg.text ? <span className="text-[13px] text-mute">We detected: <b className="text-ink">{det?.label ?? '…'}</b></span> : <span className="text-[13px] text-mute">Optional</span>}{cfg.text && <Button kind="quiet" onClick={() => { set({ ...cfg, text: '', label: '' }); setPaste(false); }}>Remove</Button>}</div>
    <div className="p-5">
      {!cfg.text && !paste ? <div><label onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
        className={cx('flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-7 text-center cursor-pointer', drag ? 'border-refract bg-refract-soft' : 'border-line hover:border-refract')}>
        <Upload size={22} className="text-refract" /><span className="mt-2 text-[14.5px] font-semibold">Drop the {dep === 'helm' ? 'values.yaml' : `${DEP_NAME[dep]} collector config`}</span><span className="mt-1 text-[13px] text-mute">or click to choose a file</span>
        <input type="file" aria-label={`Choose a ${DEP_NAME[dep]} config file`} accept=".yaml,.yml,.conf,.txt" className="sr-only" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} /></label>
        <p className="mt-2 text-center"><button type="button" onClick={() => setPaste(true)} className="text-[13.5px] text-refract hover:underline" aria-label={`Paste the ${DEP_NAME[dep]} config instead`}>Paste it instead</button></p></div>
      : <textarea aria-label={`Paste ${DEP_NAME[dep]} configuration`} spellCheck={false} className="block w-full rounded-lg border border-line bg-paper px-3 py-2 font-mono text-[12.5px] h-44 outline-none resize-y" placeholder="Paste YAML here" value={cfg.text} onChange={(e) => set({ ...cfg, text: e.target.value })} />}
      {mismatch && <p role="alert" className="mt-2 flex gap-2 text-[13px] text-warn"><CircleAlert size={15} className="mt-0.5 shrink-0" />{mismatch} Check it is in the right slot.</p>}
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        {dep === 'helm' && <VersionBox label="Coralogix Helm chart" cur={cfg.chartVersion} latest={versions?.chart} onChange={(v: string) => set({ ...cfg, chartVersion: v })} placeholder={versions?.chart} />}
        <VersionBox label="OpenTelemetry Collector" cur={cfg.otelVersion} latest={versions?.collector} onChange={(v: string) => set({ ...cfg, otelVersion: v })} placeholder="0.98.0" />
        {dep !== 'helm' && <Field label="Distribution" hint="otelcol-contrib is recommended."><select className={inputCls} value={cfg.distribution} onChange={(e) => set({ ...cfg, distribution: e.target.value })}><option>otelcol-contrib</option><option>otelcol</option></select></Field>}
      </div>
    </div></section>;
}
function ConfigStep({ deployments, cfgs, setCfgs, versions, onBack, onNext, win, setWin }: any) {
  return <>
    <StepHeader step={3} lead={deployments.length > 1 ? 'Add a config for each deployment type, if you have them. Lens edits each one in place, keeping comments and structure, and writes a separate optimised (and, if needed, upgraded) config per type. Any slot can stay empty.' : 'Optional. Add the customer’s values.yaml or collector config and Lens will edit it in place, keeping their comments and structure. Without one, it still runs and writes fresh snippets.'} />
    <div className="space-y-5">{deployments.map((d: Dep) => <Slot key={d} dep={d} versions={versions} cfg={cfgs[d] ?? EMPTY_CFG} set={(c: any) => setCfgs((x: any) => ({ ...x, [d]: typeof c === 'function' ? c(x[d] ?? EMPTY_CFG) : c }))} />)}</div>
    <p className="mt-3 text-[13px] text-mute">Lens always recommends the latest chart and collector. If a type is behind, it also writes an upgraded config for it and lists every breaking change.</p>
    <WindowSettings win={win} setWin={setWin} />
    <ActionBar onBack={onBack} next={onNext} nextLabel="Run the assessment" disabled={!!rangeError(win)} note={rangeError(win) ? `Fix the custom range first: ${rangeError(win)}` : 'Nothing is changed in the customer’s environment.'} />
  </>;
}

function Assess({ req, pillars, onDone, run, onNext, onBack, win }: { req: any; pillars: Pillar[]; win: Windows; onDone: (id: string, run: any) => void; run: any; onNext: () => void; onBack: () => void }) {
  const [events, setEvents] = useState<Record<string, any>>({}); const [err, setErr] = useState(''); const [done, setDone] = useState(!!run); const started = useRef(!!run);
  useEffect(() => { if (started.current) return; started.current = true;
    api('/api/runs', { method: 'POST', body: JSON.stringify(req) }).then(({ id }) => { let finished = false;
      const handle = (m: any) => {
        if (m.type === 'progress') setEvents((e) => ({ ...e, [m.checkId]: { ...e[m.checkId], ...m } }));
        if (m.type === 'done' && !finished) { finished = true; stop(); clearInterval(poll); api(`/api/runs/${id}`).then((r) => { onDone(id, r); setDone(true); }); }
        if (m.type === 'error') { finished = true; setErr(m.message); stop(); clearInterval(poll); } };
      const stop = watchRun(id, handle);
      const poll = setInterval(() => { if (!finished) api<any[]>(`/api/runs/${id}/events`).then((ms) => ms.forEach(handle)).catch(() => {}); }, 2000);
    }).catch((e) => setErr(e.message)); }, []);
  const list = Object.values(events).filter((e: any) => e.checkId && e.checkId !== 'gaps' && e.checkId !== 'FINISHING' && e.checkId !== 'LABELS') as any[];
  const fin = (events as any).FINISHING;
  const groupOf = (id: string): Pillar => id.startsWith('UNI') ? 'universal' : id.startsWith('LOG') ? 'logs' : id.startsWith('SPAN') ? 'traces' : 'metrics';
  const invEv = list.find((e) => e.checkId === 'INVESTIGATE');
  const finished = list.filter((e) => ['done', 'skipped', 'failed'].includes(e.status)).length;
  // Never show 100% until the run has really finished: label analysis and final steps run after the listed checks.
  const pct = done ? 100 : list.length ? Math.min(97, Math.round((finished / list.length) * 100)) : 4;
  const found = run?.findings?.length ?? list.reduce((a, e) => a + (+(e.message?.match(/^(\d+) finding/)?.[1] ?? 0)), 0);
  const statusIcon = (s: string, msg?: string) => s === 'done' && /finding/.test(msg ?? '') ? <CircleAlert size={17} className="text-refract" /> : s === 'done' ? <CircleCheck size={17} className="text-ok" /> : s === 'running' ? <Loader2 size={17} className="text-prism animate-spin" /> : s === 'failed' ? <CircleX size={17} className="text-bad" /> : s === 'skipped' ? <CircleDashed size={17} className="text-mute" /> : <CircleDashed size={17} className="text-line" />;
  return <>
    <StepHeader step={4} lead={`Lens is running the playbook’s discovery queries over ${win.mode === 'range' ? `data from ${windowLabel(win)}` : `the last ${winText(win.windowHours)} of data`}, one check at a time. Each check either finds something to improve, finds nothing, or is skipped with a reason.`} />
    {err ? <div className="rounded-xl border border-bad/40 bg-surface px-5 py-4"><p className="text-bad font-medium">The assessment stopped: {err}</p><p className="text-mute text-[13.5px] mt-1">Check the team in Connect, then run it again.</p></div> :
    <div className="hero px-6 py-5">
      <div className="flex items-end justify-between gap-6"><div><p className="text-[13px] text-rail-mute">{done ? 'Assessment complete' : finished === list.length && list.length ? `Finishing up${fin?.message ? `: ${fin.message}` : '…'}` : 'Running checks'}</p><p className="font-display text-[28px] font-semibold tabnum leading-none mt-1">{pct}%</p></div>
        <dl className="flex gap-8 text-[13px] text-right"><div><dt className="text-rail-mute">Checks finished</dt><dd className="text-[20px] font-semibold tabnum">{finished}/{list.length || '…'}</dd></div><div><dt className="text-rail-mute">{done ? 'Findings' : 'Findings so far'}</dt><dd className="text-[20px] font-semibold tabnum">{found}</dd></div></dl></div>
      <div className="mt-4 h-2 rounded-full bg-white/[.07] overflow-hidden"><div className="h-full rounded-full bg-[linear-gradient(90deg,#06B6D4,#00DFBA)] shadow-[0_0_14px_rgba(0,223,186,.7)] lens-grow" style={{ width: `${pct}%` }} /></div>
    </div>}
    {invEv && <section className="mt-6 card !border-prism/60 shadow-glow-purple px-5 py-4" aria-live="polite"><div className="flex items-center gap-3"><Microscope size={18} className="text-prism" /><h2 className="text-[15px] font-semibold flex-1">Investigate with Claude</h2>{invEv.status === 'running' ? <Loader2 size={17} className="text-prism animate-spin" /> : invEv.status === 'done' ? <CircleCheck size={17} className="text-ok" /> : <CircleAlert size={17} className="text-p2" />}</div><p className="mt-1 text-[13.5px] text-mute">{invEv.message ?? 'Waiting for the playbook checks to finish'}</p></section>}
    <div className="mt-6 grid md:grid-cols-2 gap-4">{(['universal', 'logs', 'traces', 'metrics'] as Pillar[]).filter((p) => p === 'universal' || pillars.includes(p)).map((p) => { const P = PILLARS[p]; const items = list.filter((e) => e.checkId !== 'INVESTIGATE' && groupOf(e.checkId) === p); return (
      <section key={p} className="card overflow-hidden"><h2 className="flex items-center gap-2 border-b border-line px-4 py-2.5 text-[14.5px] font-semibold"><span className={cx('grid h-6 w-6 place-items-center rounded-md text-on-color', P.bg)}><P.icon size={14} /></span>{P.name}<span className="ml-auto text-[12.5px] font-normal text-mute">{items.filter((e) => e.status !== 'waiting' && e.status !== 'running').length} of {items.length}</span></h2>
        <ul aria-live="polite">{items.length ? items.map((e) => <li key={e.checkId} className="flex items-start gap-2.5 px-4 py-2 text-[13.5px] border-b border-line last:border-0"><span className="mt-0.5" aria-label={/finding/.test(e.message ?? '') ? 'Found something to improve' : e.status}>{statusIcon(e.status, e.message)}</span><span className="flex-1"><span className={cx(e.status === 'waiting' && 'text-mute')}>{e.title}</span>{e.message && e.status !== 'running' && <span className={cx('block text-[12.5px]', /finding/.test(e.message) ? 'text-refract font-medium' : 'text-mute')}>{e.message === 'Nothing to improve' ? 'Already in good shape' : /finding/.test(e.message) ? `Found ${e.message.match(/^\d+/)?.[0] ?? ''} thing${/^1 /.test(e.message) ? '' : 's'} to improve` : e.message}</span>}</span></li>) : <li className="px-4 py-3"><SkeletonRows rows={3} label="Waiting to start" /></li>}</ul></section>); })}</div>
    <ActionBar onBack={done ? undefined : onBack} next={onNext} disabled={!done} nextLabel={done ? `Review ${run?.findings?.length ?? 0} findings` : 'Working…'} note={done ? 'Next, go through each finding with the customer.' : 'Read-only. You can watch each check finish.'} />
  </>;
}

const VSTAT = [{ v: 'verified', l: 'Verified', k: 'v', icon: CircleCheck, on: 'bg-ok text-on-color border-ok shadow-glow-emerald' }, { v: 'needs-scoping', l: 'Needs scoping', k: 's', icon: CircleDashed, on: 'bg-p2 text-on-color border-p2' }, { v: 'rejected', l: 'Rejected', k: 'r', icon: CircleX, on: 'bg-bad text-on-color border-bad' }] as const;
const PROG: Record<string, string> = { 'not-started': 'Not started', 'in-progress': 'In progress', done: 'Done', pending: 'Pending' };
/** High-cardinality or churn impact badge for a metric finding, from the label inventory. */
const cardKind = (f: any, inv: any): 'high-cardinality' | 'churn' | null => {
  if (f.ruleId === 'METRIC-HIGH-CHURN') return 'churn';
  const m = /^INV:label:(.+)$/.exec(f.ruleId ?? ''); const k = m ? inv?.rows?.find((r: any) => r.name === m[1])?.kind : null;
  return k === 'high-cardinality' || k === 'churn' ? k : null;
};
const savingsText = (f: any) => f.savings.kind === 'units' ? `${units(f.savings.unitsPerDay)} units/day` : f.savings.kind === 'needs-scoping' ? 'To be sized' : f.savings.kind === 'severity-only' ? 'Better error signal' : 'Health fix';

function Verify({ run, runId, setRun, onBack, onNext }: any) {
  const [sel, setSel] = useState(0); const [checks, setChecks] = useState<Record<string, boolean>>({}); const [fp, setFp] = useState<string>('all'); const [fs, setFs] = useState<string>('all');
  const findings = run.findings as any[];
  const shown = findings.filter((f) => (fp === 'all' || f.pillar === fp) && (fs === 'all' || (fs === 'open' ? f.verifyStatus === 'candidate' : f.verifyStatus === fs)));
  const f = shown[Math.min(sel, shown.length - 1)];
  const max = Math.max(...findings.map((x) => x.savings.unitsPerDay ?? 0), 0.0001);
  const [saveErr, setSaveErr] = useState('');
  const patch = (x: any, body: any) => api(`/api/runs/${runId}/findings/${encodeURIComponent(x.ruleId)}`, { method: 'PATCH', body: JSON.stringify(body) }).then((nf) => { setSaveErr(''); setRun((r: any) => ({ ...r, findings: r.findings.map((y: any) => (y.ruleId === nf.ruleId ? nf : y)) })); }).catch((e) => setSaveErr(`Could not save that decision: ${e.message}`));
  useEffect(() => { const h = (e: KeyboardEvent) => { const t = (e.target as HTMLElement).tagName; if (t === 'INPUT' || t === 'SELECT' || t === 'TEXTAREA') return; if (e.key === 'j' || e.key === 'ArrowDown') { e.preventDefault(); setSel((i) => Math.min(shown.length - 1, i + 1)); } if (e.key === 'k' || e.key === 'ArrowUp') { e.preventDefault(); setSel((i) => Math.max(0, i - 1)); } const s = VSTAT.find((x) => x.k === e.key); if (s && f) patch(f, { verifyStatus: s.v }); }; addEventListener('keydown', h); return () => removeEventListener('keydown', h); }, [sel, run, fp, fs]);
  const counts = findings.reduce((a: any, x: any) => ({ ...a, [x.verifyStatus]: (a[x.verifyStatus] ?? 0) + 1 }), {});
  const reviewed = findings.length - (counts.candidate ?? 0);
  const P = f ? PILLARS[f.pillar] : null; const ph = f ? PHASE[f.phase as 1 | 2 | 3] : null;
  const query = f?.evidence?.find((e: any) => e.text && e.text !== 'skill');
  return <>
    <StepHeader step={5} lead="Go through each finding with the customer. Mark it Verified when they agree, Needs scoping when more information is needed, or Rejected if they rely on that data. Only Verified findings go into the customer report and the generated config." />
    {saveErr && <div role="alert" className="mb-3 rounded-xl bg-warnbg px-4 py-3 text-[13.5px] text-warn">{saveErr}</div>}
    {run.notes?.length > 0 && <Details summary={`Checks that found no data (${run.notes.length})`}><ul className="space-y-1 text-[13.5px] list-disc pl-5">{run.notes.map((n: string) => <li key={n}>{n}</li>)}</ul></Details>}
    {run.notes?.length > 0 && <div className="mb-3" />}
    {run.eligibility?.map((e: string) => <div key={e} className="mb-3 flex gap-2 rounded-xl bg-warnbg px-4 py-3 text-[13.5px] text-warn"><CircleAlert size={16} className="mt-0.5 shrink-0" />{e}</div>)}
    <ValueLens baseline={baselineOf(run)} findings={findings} />
    {(run.usage?.days?.length > 0 || run.labelInventory?.rows?.length > 0) && <div className={cx('mt-4 grid items-start gap-4', run.usage?.days?.length > 0 && run.labelInventory?.rows?.length > 0 && '2xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]')}>
      <TierDistribution run={run} />
      {run.labelInventory?.rows?.length > 0 && <LabelCardinality inventory={run.labelInventory} />}
    </div>}
    <div className="mt-5 flex flex-wrap items-center gap-2 text-[13px]">
      <span className="mr-1 font-medium"><span className="tabnum">{reviewed}</span> of {findings.length} reviewed</span>
      <span className="text-ok">{counts.verified ?? 0} verified</span><span className="text-p2">{counts['needs-scoping'] ?? 0} need scoping</span><span className="text-bad">{counts.rejected ?? 0} rejected</span>
      <span className="ml-auto flex flex-wrap gap-1.5">{['all', 'universal', 'logs', 'traces', 'metrics'].map((p) => <button key={p} aria-pressed={fp === p} onClick={() => { setFp(p); setSel(0); }} className={cx('rounded-full border px-3 py-1', fp === p ? 'border-refract bg-refract text-on-refract shadow-glow-cyan' : 'border-line bg-surface/70 hover:border-line-strong')}>{p === 'all' ? 'All pillars' : PILLARS[p].name}</button>)}
        <select aria-label="Filter by status" value={fs} onChange={(e) => { setFs(e.target.value); setSel(0); }} className="rounded-full border border-line bg-surface/70 px-3 py-1"><option value="all">Any status</option><option value="open">To review</option><option value="verified">Verified</option><option value="needs-scoping">Needs scoping</option><option value="rejected">Rejected</option></select></span>
    </div>
    {!findings.length ? <div className="mt-4"><Empty title="No findings: this environment already follows the playbook for the selected pillars." next="Try adding a config or more pillars." /></div> :
    <div className="mt-3 grid lg:grid-cols-[380px_1fr] gap-4 items-start">
      <ol className="card overflow-hidden lg:sticky lg:top-4 max-h-[70vh] overflow-y-auto" aria-label="Findings">
        {shown.map((x, i) => { const XP = PILLARS[x.pillar]; const st = VSTAT.find((s) => s.v === x.verifyStatus); return (
          <li key={x.ruleId}><button onClick={() => setSel(i)} aria-current={i === sel} className={cx('w-full text-left flex gap-3 px-3.5 py-3 border-b border-line', i === sel ? 'bg-refract-soft/80 shadow-[inset_2px_0_0_var(--refract)]' : 'hover:bg-sunk')}>
            <span aria-hidden className={cx('w-1 self-stretch rounded-full', XP.bg)} />
            <span className="flex-1 min-w-0"><span className="flex items-center gap-2 text-[12px] text-mute"><span className="tabnum">{x.id}</span><span className={PHASE[x.phase as 1 | 2 | 3].cls}>Phase {x.phase}</span>{x.priority === 'high' && <ShieldAlert size={13} className="text-warn" aria-label="Protected label" />}{x.source === 'investigate' && <span className="inline-flex items-center gap-1 text-prism"><Microscope size={12} aria-hidden />Live data</span>}{(() => { const k = cardKind(x, run.labelInventory); return k ? <span className={cx('inline-flex items-center gap-1 rounded-full border px-1.5 py-px text-[11px] font-medium', k === 'churn' ? 'border-warn/40 bg-warn/10 text-warn' : 'border-bad/40 bg-bad/10 text-bad')}><span aria-hidden className="pulse-dot !h-1.5 !w-1.5" />{k === 'churn' ? 'Churn' : 'High cardinality'}</span> : null; })()}</span>
              <span className="block text-[14px] font-medium leading-snug mt-0.5">{x.title}</span>
              <span className="mt-1.5 flex items-center gap-2"><span className="h-1.5 flex-1 rounded-full bg-sunk overflow-hidden"><span className={cx('block h-full rounded-full', XP.bg)} style={{ width: `${((x.savings.unitsPerDay ?? 0) / max) * 100}%` }} /></span><span className="text-[12px] tabnum text-mute w-24 text-right">{savingsText(x)}</span></span></span>
            <span className="mt-0.5">{st ? <st.icon size={17} className={x.verifyStatus === 'verified' ? 'text-ok' : x.verifyStatus === 'rejected' ? 'text-bad' : 'text-p2'} aria-label={st.l} /> : <span className="block h-[17px] w-[17px] rounded-full border-2 border-line" aria-label="To review" />}</span>
          </button></li>); })}
        {!shown.length && <li className="px-4 py-6 text-[13.5px] text-mute">No findings match these filters.</li>}
      </ol>
      {f && P && ph && <article className="card overflow-hidden" aria-label={f.title}>
        {f.priority === 'high' && <div role="alert" className="flex gap-2 bg-warnbg px-5 py-2.5 text-[13.5px] text-warn font-medium"><ShieldAlert size={16} className="mt-0.5" />Protected label warning: Infrastructure Explorer depends on these attributes.</div>}
        <div className="px-6 pt-5 pb-6">
          <div className="flex flex-wrap items-center gap-2"><span className={cx('inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[12.5px] font-medium text-on-color', P.bg)}><P.icon size={13} />{P.name}</span><span className={cx('rounded-md px-2 py-0.5 text-[12.5px] font-medium', ph.soft, ph.cls)}>Phase {f.phase}: {ph.name}</span><span className="text-[12.5px] text-mute tabnum">{f.id}</span>{f.source === 'investigate' && <span className="inline-flex items-center gap-1 rounded-md bg-prism/10 px-2 py-0.5 text-[12.5px] font-medium text-prism"><Microscope size={13} />Found in live data</span>}</div>
          <h2 className="mt-2 font-display text-[22px] font-semibold tracking-[-0.01em] leading-snug">{f.title}</h2>
          <div className="mt-4 grid sm:grid-cols-3 gap-px rounded-lg overflow-hidden bg-line border border-line text-[13px]">
            <div className="bg-surface px-4 py-3"><p className="text-mute">Estimated impact</p><p className="mt-0.5 text-[17px] font-semibold tabnum">{savingsText(f)}</p></div>
            <div className="bg-surface px-4 py-3"><p className="text-mute">Effort</p><p className="mt-0.5 text-[15px] font-medium capitalize">{f.effort.replace('-', ' to ')}</p></div>
            <div className="bg-surface px-4 py-3"><p className="text-mute">Who makes the change</p><p className="mt-0.5 text-[15px] font-medium">{f.owner}</p></div>
          </div>
          <h3 className="mt-5 text-[14px] font-semibold">What’s happening</h3>
          <p className="mt-1 text-[15px] leading-relaxed max-w-[70ch]">{f.plain}</p>
          {f.observedVolume && <p className="mt-2 text-[13.5px] text-mute">Seen in the data: {f.observedVolume}</p>}
          {f.display?.samples?.items?.length > 0 && <div className="mt-5"><h3 className="text-[14px] font-semibold">{f.display.samples.label}{f.display.samples.items.some((i: any) => i.after !== undefined) && ': before and after the change'}</h3>
            <div className="mt-2 space-y-2">{f.display.samples.items.slice(0, 3).map((s: any, i: number) => <div key={i} className={cx('grid gap-px rounded-lg overflow-hidden border border-line bg-line', s.after !== undefined && 'md:grid-cols-2')}>
              <pre className={cx('p-3 text-[12px] font-mono whitespace-pre-wrap break-words max-h-48 overflow-auto', s.after !== undefined ? 'diff-del' : 'bg-sunk')}><span className={cx('block text-[11px] font-sans font-semibold mb-1', s.after !== undefined ? 'text-bad' : 'text-mute')}>{s.after !== undefined ? 'Before' : `Sample ${i + 1}`}</span>{s.before}</pre>
              {s.after !== undefined && <pre className="diff-add p-3 text-[12px] font-mono whitespace-pre-wrap break-words max-h-48 overflow-auto"><span className="block text-[11px] font-sans font-semibold text-ok mb-1">After</span>{s.after}</pre>}</div>)}</div>
            {f.display.samples.afterNote && <p className="mt-1.5 text-[12.5px] text-mute">{f.display.samples.afterNote}</p>}</div>}
          {f.source === 'investigate' && f.display?.bars?.items?.length > 0 && <div className="mt-4"><h3 className="text-[14px] font-semibold">{f.display.bars.label}</h3><ul className="mt-2 space-y-1.5">{f.display.bars.items.map((b: any) => { const mx = Math.max(...f.display.bars.items.map((x: any) => x.value), 1e-9); return <li key={b.name} className="grid grid-cols-[minmax(120px,220px)_1fr_auto] items-center gap-3 text-[13px]"><span className="font-mono text-[12px] truncate syn-key" title={b.name}>{b.name}</span><span className="h-2 rounded-full bg-sunk overflow-hidden"><span className="block h-full rounded-full bg-[linear-gradient(90deg,#06B6D4,#A855F7)]" style={{ width: `${(b.value / mx) * 100}%` }} /></span><span className="text-[12.5px]"><DataValue v={b.text} /></span></li>; })}</ul></div>}
          {f.source === 'investigate' && f.display?.table?.rows?.length > 0 && <div className="mt-4 overflow-x-auto rounded-lg border border-line"><table className="w-full text-[12.5px]"><caption className="text-left px-3 py-2 font-semibold text-[13.5px] bg-sunk/70">{f.display.table.summary}</caption><thead className="text-mute"><tr>{f.display.table.headers.map((h: string) => <th key={h} className="text-left px-3 py-1.5 font-medium">{h}</th>)}</tr></thead><tbody>{f.display.table.rows.map((r: any[], i: number) => <tr key={i} className="border-t border-line">{r.map((c, k) => <td key={k} className="px-3 py-1.5 tabnum"><DataValue v={c} as={k === 0 ? 'key' : 'auto'} /></td>)}</tr>)}</tbody></table></div>}
          {f.display?.validation && <div className={cx('mt-4 rounded-lg px-4 py-3 text-[13.5px]', f.display.validation.ok ? 'bg-ok/10' : 'bg-warnbg')}><p className={cx('font-semibold flex items-center gap-1.5', f.display.validation.ok ? 'text-ok' : 'text-warn')}>{f.display.validation.ok ? <CircleCheck size={15} /> : <CircleAlert size={15} />}{f.display.validation.ok ? 'Validated against live data' : 'Not validated'}</p><p className="mt-1">{f.display.validation.result}</p><code className="mt-1.5 block rounded-md bg-sunk/70 px-2 py-1 font-mono text-[11.5px] syn-key break-all">{f.display.validation.query}</code></div>}
          {f.display?.impact?.length > 0 && <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-lg overflow-hidden border border-line bg-line">{f.display.impact.map((i: any, k: number) => <div key={k} className="bg-surface px-3 py-2.5"><p className="text-[12px] text-mute">{i.label}</p><p className={cx('text-[14.5px] font-semibold tabnum', k === f.display.impact.length - 1 && 'text-ok')}>{i.value}</p></div>)}</div>}
          {f.source === 'investigate' && f.change?.snippet && <div className="mt-4"><h3 className="text-[14px] font-semibold">{f.change.snippet.startsWith('#') ? 'Change at the source' : 'Proposed transform'}</h3><CodeBlock className="mt-2" code={f.change.snippet} lang={f.change.snippet.startsWith('#') ? 'text' : 'yaml'} fileName={`${f.id}-change`} label="Proposed transform" /></div>}
          <h3 className="mt-5 text-[14px] font-semibold">What to do</h3>
          <p className="mt-1 text-[15px] leading-relaxed max-w-[70ch]">{f.nextStep}</p>
          {!!f.verifyChecklist.length && <div className="mt-5 rounded-lg bg-sunk px-4 py-3.5"><h3 className="text-[14px] font-semibold flex items-center gap-2"><Users size={16} />Verify with the customer</h3>
            {f.verifyChecklist.map((q: string) => { const k = f.ruleId + q; return <label key={k} className="flex gap-2.5 items-start text-[14px] py-1"><input type="checkbox" className="mt-1" checked={!!checks[k]} onChange={(e) => setChecks({ ...checks, [k]: e.target.checked })} />{q}</label>; })}</div>}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {VSTAT.map((s) => <button key={s.v} aria-pressed={f.verifyStatus === s.v} onClick={() => patch(f, { verifyStatus: s.v })} className={cx('inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[14px] font-medium', f.verifyStatus === s.v ? s.on : 'border-line-strong/70 hover:bg-sunk')}><s.icon size={16} />{s.l}<kbd className="ml-1 text-mute">{s.k}</kbd></button>)}
            <label className="ml-auto flex items-center gap-2 text-[13px] text-mute">Progress<select className="rounded-lg border border-line bg-surface px-2 py-1.5 text-[13px] text-ink" value={f.progress} onChange={(e) => patch(f, { progress: e.target.value })}>{Object.entries(PROG).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
          </div>
          <div className="mt-6 space-y-2">
            {(f.detail || f.caveats.length > 0) && <Details summary="Details and caveats">{f.detail && <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed">{f.detail}</p>}{f.caveats.map((c: string) => <p key={c} className="mt-2 text-[13.5px] flex gap-2"><CircleAlert size={14} className="mt-0.5 shrink-0 text-p2" />{c}</p>)}</Details>}
            <Details summary="How the estimate was worked out"><p className="text-[13.5px] leading-relaxed">{f.savings.basis}</p>{query && <><p className="mt-3 text-[12.5px] text-mute">Discovery query, {query.start ? `run over ${fmtLocal(query.start)} to ${fmtLocal(query.end)}` : `last ${query.window}`}{query.error ? '' : `, ${query.rows?.length ?? 0} rows`}</p><CodeBlock className="mt-1" code={query.text} lang="text" maxH="max-h-56" label="Discovery query" />{query.error && <p className="text-[12.5px] text-bad mt-1">{query.error.slice(0, 200)}</p>}</>}</Details>
            {f.change?.snippet && <Details summary="Proposed config change"><CodeBlock code={f.change.snippet} fileName={`${f.id}-config`} label="Proposed config change" /></Details>}
            <Details summary={`Sources (${f.sources.length})`}><ul className="text-[13.5px] space-y-1">{f.sources.map((s: any, k: number) => <li key={k}>{s.url ? <a className="text-refract hover:underline" href={s.url} target="_blank" rel="noreferrer">{s.title}</a> : s.title}{s.internal && <span className="text-mute"> (internal)</span>}</li>)}</ul></Details>
          </div>
        </div>
      </article>}
    </div>}
    {!!run.gaps?.length && <section className="mt-8"><h2 className="text-[17px] font-semibold flex items-center gap-2"><Sparkles size={17} className="text-prism" />Where freed quota could go</h2><p className="text-[13.5px] text-mute mt-1">Adoption gaps and expansion ideas. These are not savings.</p>
      <ul className="mt-3 grid sm:grid-cols-2 gap-3">{run.gaps.map((g: any) => <li key={g.area} className="card px-4 py-3"><p className="text-[14.5px] font-semibold">{g.area}</p><p className="text-[13.5px] text-mute mt-0.5">{g.detail}</p><p className="text-[13.5px] mt-1.5">{g.opportunity}</p></li>)}</ul></section>}
    <ActionBar onBack={onBack} next={onNext} nextLabel="Continue to remediation" note={<>Keys: <kbd>j</kbd> <kbd>k</kbd> move, <kbd>v</kbd> verified, <kbd>s</kbd> needs scoping, <kbd>r</kbd> rejected.</>} />
  </>;
}

const FILE_INFO: Record<string, [string, string]> = {
  'report.customer.html': ['customer', 'Customer report, ready to share or print to PDF'], 'report.customer.md': ['customer', 'Customer report as Markdown'], 'report.json': ['customer', 'Customer report data (JSON Schema 1.0)'],
  'report.internal.html': ['tam', 'Internal report with queries, evidence and sources'], 'report.internal.md': ['tam', 'Internal report as Markdown'], 'report.internal.json': ['tam', 'Internal report data'],
  'optimized-config.yaml': ['config', 'Their config on the current version, with Verified changes'], 'optimized-config.diff': ['config', 'What changed, line by line'], 'original-config.yaml': ['config', 'Backup of the config you added'],
  'upgraded-config.yaml': ['config', 'Config moved to the latest version'], 'upgraded-config.diff': ['config', 'Changes for the upgrade'], 'breaking-changes.md': ['config', 'Every breaking change and what to do'],
  'tco-policy-drafts.json': ['tam', 'TCO policy drafts (never created automatically)'],
};
function fileInfo(full: string, rn?: Record<string, string>): [string, string] {
  const parts = full.split('/'); const n = parts.at(-1)!; const folder = parts.length > 1 ? `${DEP_NAME[{ kubernetes: 'helm' }[parts[0] as 'kubernetes'] ?? parts[0]] ?? parts[0]}: ` : '';
  const base = fileInfoBase(n, rn); return [base[0], folder + base[1]];
}
function fileInfoBase(n: string, rn?: Record<string, string>): [string, string] {
  if (rn) {
    if (n === rn.customerHtml) return ['customer', 'Customer report, ready to share or print to PDF'];
    if (n === rn.customerMd) return ['customer', 'Customer report as Markdown'];
    if (n === rn.customerJson) return ['customer', 'Customer report data (JSON Schema 1.0)'];
    if (n === rn.internalHtml) return ['tam', 'Internal report with queries, evidence and sources'];
    if (n === rn.internalMd) return ['tam', 'Internal report as Markdown'];
    if (n === rn.internalJson) return ['tam', 'Internal report data'];
  }
  return FILE_INFO[n] ?? (n.endsWith('.csv') ? ['tam', 'Metrics Label Analyzer export'] : ['tam', 'Data export']);
}
function Remediate({ run, runId, onBack, onRestart }: any) {
  const [zipBusy, setZipBusy] = useState<'' | 'final' | 'draft'>('');
  const zip = (draft: boolean) => { setZipBusy(draft ? 'draft' : 'final'); setErr(''); downloadPost(`/api/runs/${runId}/bundle`, { draft }, `${run.customer?.name || 'report'}${draft ? ' (draft)' : ''}.zip`).catch((e) => setErr(e.message)).finally(() => setZipBusy('')); };
  const [tab, setTab] = useState<'plan' | 'config' | 'upgrade' | 'export'>('plan');
  const [report, setReport] = useState<any>(null); const [sel, setSel] = useState<string[]>(run.findings.filter((f: any) => f.verifyStatus === 'verified' && f.change?.ops?.length).map((f: any) => f.ruleId));
  const deps: string[] = run.deployments?.length ? run.deployments : [run.deployment]; const [dep, setDep] = useState<string>(deps[0]);
  const [preview, setPreview] = useState<any>(null); const [outs, setOuts] = useState<any>(null); const [draft, setDraft] = useState(false); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  useEffect(() => { api(`/api/runs/${runId}/report?audience=internal`).then(setReport); }, [runId]);
  useEffect(() => { api(`/api/runs/${runId}/preview`, { method: 'POST', body: JSON.stringify({ selected: sel, deployment: dep }) }).then(setPreview).catch((e) => setPreview({ error: e.message })); }, [sel.join(), dep]);
  const changeable = run.findings.filter((f: any) => f.change?.ops?.length);
  const exportAll = () => { setBusy(true); setErr(''); api(`/api/runs/${runId}/outputs`, { method: 'POST', body: JSON.stringify({ allowDraft: draft }) }).then(setOuts).catch((e) => setErr(e.message)).finally(() => setBusy(false)); };
  if (!report) return <><StepHeader step={6} lead="Building the roadmap from the findings you verified…" /><div className="grid md:grid-cols-3 gap-4" role="progressbar" aria-busy="true" aria-label="Building the roadmap">{[1, 2, 3].map((i) => <div key={i} className="card p-5 space-y-3"><Skeleton className="h-3 w-16" /><Skeleton className="h-5 w-40" /><Skeleton className="h-8 w-28" /><SkeletonRows rows={3} label="" /></div>)}</div></>;
  const changed = preview?.rows?.filter((r: any) => r.kind !== 'same').length ?? 0;
  const base = report.summary.currentUnitsPerDay;
  const tabs = [['plan', 'Phased roadmap'], ['config', 'Config changes'], ...(report.upgrade ? [['upgrade', 'Upgrade']] : []), ['export', 'Export']] as [typeof tab, string][];
  const verified = run.findings.filter((f: any) => f.verifyStatus === 'verified').length;
  return <>
    <StepHeader step={6} lead="Here is the plan. Changes are grouped by effort, so the team can start with quick, config-only wins while bigger changes are scheduled. Then review the config changes and export the reports." />
    <ValueLens baseline={baselineOf(run)} findings={run.findings} compact />
    <div role="tablist" aria-label="Remediation" className="mt-6 inline-flex gap-1 rounded-full border border-line bg-surface/70 p-1">{tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cx('rounded-full px-4 py-1.5 text-[13.5px] font-medium transition-all', tab === k ? 'bg-refract text-on-refract shadow-glow-cyan' : 'text-mute hover:text-ink')}>{l}</button>)}</div>
    <div className="mt-6">
    {tab === 'plan' && <section aria-label="Phased roadmap"><h2 className="sr-only">Phased roadmap</h2>
      <ol className="grid md:grid-cols-3 gap-4">{report.roadmap.map((p: any) => { const ph = PHASE[p.phase as 1 | 2 | 3]; const fs = report.findings.filter((f: any) => f.phase === p.phase); return (
        <li key={p.phase} className="card overflow-hidden"><div className={cx('h-1.5', ph.bg)} />
          <div className="p-5"><p className={cx('text-[13px] font-semibold', ph.cls)}>Phase {p.phase}</p><p className="text-[18px] font-semibold mt-0.5">{ph.name}</p><p className="text-[13px] text-mute">{ph.long}. Usually {ph.when.toLowerCase()}.</p>
            <p className="mt-4 text-[13px] text-mute">Total saved after this phase</p><p className="font-display text-[26px] font-semibold tabnum leading-tight">{units(p.cumulativeUnitsPerDay)}<span className="text-[13px] font-normal text-mute"> units/day</span></p>
            {base && <div className="mt-2 h-1.5 rounded-full bg-sunk overflow-hidden"><div className={cx('h-full', ph.bg)} style={{ width: `${Math.min(100, (p.cumulativeUnitsPerDay / base) * 100)}%` }} /></div>}
            <ul className="mt-4 space-y-1.5 text-[13.5px]">{fs.length ? fs.map((f: any) => <li key={f.id} className="flex gap-2"><span className={cx('mt-1.5 h-2 w-2 rounded-full shrink-0', PILLARS[f.pillar].bg)} /><span className="flex-1">{f.title}</span><span className="tabnum text-mute text-[12.5px]">{f.savings.kind === 'units' ? units(f.savings.unitsPerDay) : '—'}</span></li>) : <li className="text-mute">Nothing in this phase.</li>}</ul></div></li>); })}</ol>
      {report.combined.largest && <p className="mt-4 text-[14px] max-w-[80ch]">The largest single saving is <b>{report.combined.largest.title.toLowerCase()}</b> ({units(report.combined.largest.unitsPerDay)} units/day){(() => { const ph = report.findings.find((x: any) => x.id === report.combined.largest.id)?.phase; return ph > 1 ? `, and it sits in Phase ${ph} because it needs more coordination, not because it matters less.` : '.'; })()} Start Phase 1 now: those changes carry almost no risk.</p>}
      {report.overlaps.map((o: any) => <p key={o.ids.join()} className="mt-3 flex gap-2 rounded-lg border border-line bg-surface px-4 py-3 text-[13.5px]"><CircleAlert size={16} className="mt-0.5 shrink-0 text-p2" />{o.note}</p>)}
      {report.trend?.length > 1 && <Trend trend={report.trend} />}
    </section>}
    {tab === 'config' && <section>
      <p className="text-[14px] text-mute max-w-[70ch]">Tick a finding to see its change. Verified findings are ticked for you. The <Term t="protected labels" /> check runs on every preview, and the customer’s comments and structure are kept.</p>
      {!changeable.length ? <div className="mt-4"><Empty title="No findings carry config changes." /></div> : <div className="flex flex-wrap gap-2 my-4">{changeable.map((f: any) => <label key={f.ruleId} className={cx('flex gap-2 items-center rounded-lg border px-3 py-1.5 text-[13.5px] cursor-pointer', sel.includes(f.ruleId) ? 'border-refract bg-refract-soft' : 'border-line bg-surface')}><input type="checkbox" checked={sel.includes(f.ruleId)} onChange={(e) => setSel(e.target.checked ? [...sel, f.ruleId] : sel.filter((x) => x !== f.ruleId))} /><span className={cx('h-2 w-2 rounded-full', PILLARS[f.pillar].bg)} />{f.title}{f.verifyStatus !== 'verified' && <span className="text-mute">(not verified)</span>}</label>)}</div>}
      {deps.length > 1 && <div role="radiogroup" aria-label="Deployment type" className="mb-3 inline-flex rounded-lg border border-line bg-sunk p-1 gap-1">{deps.map((d) => <button key={d} role="radio" aria-checked={dep === d} onClick={() => setDep(d)} className={cx('rounded-md px-3 py-1.5 text-[13.5px] font-medium', dep === d ? 'bg-raised shadow-sm ring-1 ring-refract/40' : 'text-mute')}>{DEP_NAME[d]}{run.configs?.[d]?.format === 'empty' || !run.configs?.[d]?.text ? ' (snippets)' : ''}</button>)}</div>}
      {preview?.error && <p className="text-bad text-[13.5px]">{preview.error}</p>}
      {preview?.notes?.map((n: string) => <p key={n} className="mb-2 flex gap-2 text-[13.5px] text-warn"><CircleAlert size={15} className="mt-0.5 shrink-0" />{n}</p>)}
      {preview?.rows && <ConfigDiff rows={preview.rows} changed={changed} fileBase={deps.length > 1 ? `${DEP_NAME[dep].toLowerCase()}-optimized-config` : 'optimized-config'} />}
    </section>}
    {tab === 'upgrade' && report.upgrade && <section>
      <div className="grid sm:grid-cols-3 gap-4"><Stat label="Moving to" value={<span className="text-[18px]">{report.upgrade.to.chart ? `Chart ${report.upgrade.to.chart}, ` : ''}collector {report.upgrade.to.collector}</span>} hint={`From ${report.upgrade.from.chart ? `chart ${report.upgrade.from.chart}, ` : ''}collector ${report.upgrade.from.collector ?? 'unknown'}`} /><Stat label="Fixed automatically" value={report.versionStatus.autoFixed} tone="ok" hint="Renamed keys, moved settings, removed options" /><Stat label="Need a decision" value={report.versionStatus.manual} tone="prism" hint="Explained in plain English below" /></div>
      <div className="mt-4 overflow-x-auto card"><table className="w-full text-[13px]"><thead className="bg-sunk text-mute text-left"><tr><th className="px-4 py-2 font-medium">Version</th><th className="px-4 font-medium">Component</th><th className="px-4 font-medium">What changed</th><th className="px-4 font-medium">Status</th></tr></thead><tbody>{report.upgrade.changes.map((c: any, i: number) => <tr key={i} className="border-t border-line align-top"><td className="px-4 py-2.5 tabnum">{c.version}</td><td className="px-4 py-2.5">{c.component}</td><td className="px-4 py-2.5 max-w-[60ch]">{c.what}{c.explanation && <span className="block text-mute mt-0.5">{c.explanation}</span>}</td><td className="px-4 py-2.5 whitespace-nowrap">{c.status === 'Auto-fixed' ? <Pill tone="ok">Fixed</Pill> : c.status === 'Not applicable' ? <Pill>Not needed</Pill> : <Pill tone="warn">Decide</Pill>}</td></tr>)}</tbody></table></div>
      <h3 className="mt-6 text-[15px] font-semibold">How to upgrade safely</h3><ol className="mt-2 list-decimal pl-5 space-y-1 text-[14px]">{report.upgrade.steps.map((s: string) => <li key={s}>{s}</li>)}</ol>
    </section>}
    {tab === 'export' && <section>
      <div className="card p-5">
        <p className="text-[14px]">{verified} verified finding{verified === 1 ? '' : 's'} will go into the customer report and the generated config.</p>
        <label className="mt-3 flex gap-2.5 items-start text-[14px]"><input type="checkbox" className="mt-1" checked={draft} onChange={(e) => setDraft(e.target.checked)} /><span>Also include findings that aren’t verified yet. Outputs get a DRAFT watermark.</span></label>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button kind="primary" size="lg" disabled={!!zipBusy} onClick={() => zip(false)}>{zipBusy === 'final' ? <><Loader2 size={16} className="animate-spin" />Preparing…</> : <><Archive size={16} />Download all reports (.zip)</>}</Button>
          <Button size="lg" disabled={!!zipBusy} onClick={() => zip(true)}>{zipBusy === 'draft' ? <><Loader2 size={16} className="animate-spin" />Preparing…</> : <><Archive size={16} />Download all as draft (.zip)</>}</Button>
        </div>
        <p className="mt-2 text-[12.5px] text-mute">Each zip holds every report and config, named after {run.customer?.name || 'the customer'}. The draft version includes unverified findings and marks every report DRAFT.</p>
        <Button className="mt-4" disabled={busy} onClick={exportAll}>{busy ? <><Loader2 size={16} className="animate-spin" />Generating…</> : <><Download size={16} />Or pick individual files</>}</Button>
        {err && <p className="mt-2 text-bad text-[13.5px]">{err}</p>}
      </div>
      {outs && <div className="mt-5 space-y-4">
        {outs.customerIssues?.length > 0 ? <div className="flex gap-2 rounded-xl bg-warnbg px-4 py-3 text-[13.5px] text-warn"><CircleAlert size={16} className="mt-0.5" /><span><b>Check before sending:</b> the customer report still contains {[...new Set(outs.customerIssues.map((i: any) => i.kind))].join(', ')}.</span></div> : <div className="flex gap-2 rounded-xl bg-ok/10 px-4 py-3 text-[13.5px] text-ok"><CircleCheck size={16} className="mt-0.5" />Customer report check passed: no internal names, links, account IDs or keys found.</div>}
        {[['customer', 'For the customer'], ['config', 'Config files'], ['tam', 'For you (internal)']].map(([g, l]) => { const files = Object.keys(outs.files).filter((n) => (fileInfo(n, outs.reportNames)[0]) === g).sort(); return files.length ? <div key={g}><h3 className="text-[14px] font-semibold mb-2">{l}</h3><ul className="grid sm:grid-cols-2 gap-2">{files.map((n) => <li key={n}><button onClick={() => download(n, outs.files[n])} className="w-full flex items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3 text-left hover:border-refract"><FileText size={18} className="text-refract shrink-0" /><span className="flex-1 min-w-0"><span className="block text-[13.5px] font-medium truncate">{n}</span><span className="block text-[12.5px] text-mute">{fileInfo(n, outs.reportNames)[1]}</span></span><Download size={16} className="text-mute" aria-label="Download" /></button></li>)}</ul></div> : null; })}
        {outs.warnings.length > 0 && <Details summary={`Notes (${outs.warnings.length})`}>{outs.warnings.map((w: string) => <p key={w} className="text-[13px] text-mute mt-1">{w}</p>)}</Details>}
      </div>}
    </section>}
    </div>
    <ActionBar onBack={onBack} extra={<Button onClick={onRestart}><RotateCcw size={15} />Start a new review</Button>} next={tab !== 'export' ? () => setTab(tabs[tabs.findIndex(([k]) => k === tab) + 1][0]) : undefined} nextLabel={tab === 'plan' ? 'Review config changes' : tab === 'config' && report.upgrade ? 'Review the upgrade' : 'Go to export'} note={tab === 'export' ? 'Re-run the assessment after Phase 1 to confirm the savings.' : undefined} />
  </>;
}

function Trend({ trend }: { trend: any[] }) {
  const W = 760, H = 180, L = 36, B = 24; const max = Math.max(...trend.map((t) => t.total), 0.001);
  const x = (i: number) => L + (i * (W - L - 8)) / Math.max(1, trend.length - 1); const y = (v: number) => H - B - (v / max) * (H - B - 12);
  const line = (k: string) => trend.map((t, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(t[k]).toFixed(1)}`).join(' ');
  const series = [['total', 'All data', 'var(--ink)'], ['logs', 'Logs', 'var(--logs)'], ['traces', 'Traces', 'var(--traces)'], ['metrics', 'Metrics', 'var(--metrics)']];
  return <figure className="mt-8 card p-5"><figcaption className="flex flex-wrap items-baseline justify-between gap-2"><span className="text-[15px] font-semibold">Usage, last {trend.length} days</span><span className="flex gap-4 text-[12.5px] text-mute">{series.map(([k, l, c]) => <span key={k} className="flex items-center gap-1.5"><span className="h-0.5 w-4" style={{ background: c }} />{l}</span>)}</span></figcaption>
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full h-auto" role="img" aria-label="Units per day over time by pillar">{[0, 0.5, 1].map((f) => <g key={f}><line x1={L} x2={W - 8} y1={y(max * f)} y2={y(max * f)} stroke="var(--line)" /><text x={L - 6} y={y(max * f) + 4} textAnchor="end" fontSize="11" fill="var(--mute)">{(max * f).toFixed(1)}</text></g>)}
      {series.map(([k, , c]) => <path key={k} d={line(k)} fill="none" stroke={c} strokeWidth={k === 'total' ? 2.2 : 1.6} strokeLinejoin="round" />)}
      <text x={L} y={H - 6} fontSize="11" fill="var(--mute)">{trend[0].date.slice(0, 10)}</text><text x={W - 8} y={H - 6} fontSize="11" fill="var(--mute)" textAnchor="end">{trend.at(-1).date.slice(0, 10)}</text></svg>
    <p className="text-[12.5px] text-mute mt-1">Units per day.</p></figure>;
}
