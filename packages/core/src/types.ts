export type Pillar = 'universal' | 'logs' | 'traces' | 'metrics';
export type DeploymentType = 'helm' | 'ecs' | 'ec2' | 'standalone';
export type Phase = 1 | 2 | 3;
export type Effort = 'low' | 'medium' | 'medium-high' | 'high';
export type Owner = 'DevOps' | 'App Team';
export type VerifyStatus = 'candidate' | 'verified' | 'rejected' | 'needs-scoping';
export type ProgressStatus = 'not-started' | 'in-progress' | 'done' | 'pending';
export type Tier = 'high' | 'medium' | 'low' | 'blocked' | 'default';
export type SignalType = 'logs' | 'traces' | 'metrics';

export interface SourceRef { title: string; url: string; internal?: boolean }

export interface QueryRequest {
  id: string;
  language: 'dataprime' | 'promql';
  pillar: 'logs' | 'traces';
  text: string;
  /** relative window like 24h / 15m (also used to scale results to a day) */
  window: string;
  limit: number;
  /** exact range (ISO 8601, UTC). When set, it is used instead of "last <window>". */
  start?: string; end?: string;
}
export interface QueryEvidence extends QueryRequest { rows?: Record<string, unknown>[]; error?: string; ms?: number }

export interface Savings {
  kind: 'units' | 'none-units' | 'needs-scoping' | 'severity-only' | 'not-covered';
  unitsPerDay: number | null;
  gbPerDay: number | null;
  /** plain-English explanation of how the number was derived */
  basis: string;
  pillar?: SignalType;
}

export interface ConfigChange {
  /** Human description of the change */
  summary: string;
  /** YAML snippet the TAM can read/copy */
  snippet: string;
  /** structured operations the writer applies */
  ops: ConfigOp[];
}

export type HelmComponent = 'opentelemetry-agent' | 'opentelemetry-cluster-collector' | 'opentelemetry-gateway';
export type ConfigOp =
  | { kind: 'helmPreset'; components: HelmComponent[]; preset: string; value: unknown; anchor?: string }
  | { kind: 'processor'; name: string; /** omitted: the processor already exists (e.g. the chart's batch preset); only its pipeline position is set */ body?: Record<string, unknown>; signals: SignalType[]; position: 'first' | 'middle' | 'before-batch' | 'last' | 'before-sampling'; helmComponents?: HelmComponent[] }
  | { kind: 'exporterSetting'; exporterPrefix: string[]; key: string; value: unknown }
  | { kind: 'receiverSetting'; receiverPrefix: string; path: string[]; value: unknown }
  | { kind: 'connectorSetting'; connector: string; key: string; value: unknown; helmComponents?: HelmComponent[] };

export interface Finding {
  id: string;            // e.g. LOG-3 (assigned at report time); ruleId is stable
  ruleId: string;
  pillar: Pillar;
  title: string;
  plain: string;         // 1–2 sentence plain English
  detail?: string;       // technical explanation (behind "Show details")
  evidence: QueryEvidence[];
  observedVolume?: string;
  savings: Savings;
  phase: Phase;
  effort: Effort;
  owner: Owner;
  priority?: 'high' | 'normal';
  verifyChecklist: string[];
  verifyStatus: VerifyStatus;
  progress: ProgressStatus;
  overlapsWith: string[];
  change?: ConfigChange;
  caveats: string[];
  nextStep: string;
  sources: SourceRef[];
  tags?: string[];
  /** Optional structured content for reports (chips, bar lists, tables, policy order, steps, notes). */
  display?: FindingDisplay;
  /** Deployment types this finding applies to (several when the customer runs EKS, ECS and EC2 together). */
  deployments?: DeploymentType[];
  /** Config change per deployment type, when they differ (Helm preset vs collector processor). */
  changes?: Partial<Record<DeploymentType, ConfigChange>>;
  /** false = shown with its estimate but left out of combined totals (e.g. a hygiene rule covered by an Investigate finding). */
  countedInTotal?: boolean;
  /** Investigate mode: produced from live data and Claude's analysis, then validated by Lens. */
  source?: 'rule' | 'investigate';
  drafts?: { kind: 'tco-log-policy' | 'tco-trace-policy' | 'e2m' | 'recording-rule'; name: string; json: unknown }[];
}

export interface FindingDisplay {
  chips?: { label: string; items: string[] };
  bars?: { label: string; items: { name: string; value: number; text: string }[] };
  table?: { summary: string; headers: string[]; rows: (string | number)[][] };
  policy?: { items: { label: string; text: string }[]; kept?: string };
  steps?: string[];
  notes?: { kind: 'info' | 'warn'; text: string }[];
  /** Live data samples (masked), with the result of the proposed change applied where Lens can simulate it. */
  samples?: { label: string; items: { before: string; after?: string }[]; afterNote?: string };
  /** How Lens checked the suggestion against real data. */
  validation?: { query: string; result: string; ok: boolean };
  /** Savings maths, step by step, in plain words. */
  impact?: { label: string; value: string }[];
}

export interface AdoptionGap { area: string; detail: string; opportunity: string; sources: SourceRef[] }

export interface UsageDay { date: string; byPillarTier: Record<string, { gb: number; units: number }>; totalUnits: number; totalGb: number }
export interface UsageStats { days: UsageDay[]; /** when the usage was read; a day dated today is still partial */ fetchedAt?: string }

export interface MetricSeriesRequest { metric: string; match?: Record<string, string>; window: string; /** evaluate at this time (ISO 8601) instead of now */ at?: string }

/** Connector adapters implement this; the core never touches the OS directly. */
export interface Connector {
  readonly id: string;
  healthCheck(): Promise<{ ok: boolean; detail: string; capabilities: string[] }>;
  listTeams(): Promise<{ name: string; region: string }[]>;
  runQuery(q: QueryRequest): Promise<QueryEvidence>;
  getUsageStats(days: number): Promise<UsageStats | null>;
  getLabelValues?(label: string, window: string, metric?: string, at?: string): Promise<string[]>;
  getMetricSeries?(req: MetricSeriesRequest): Promise<Record<string, string>[]>;
  /** PromQL instant query (evaluated at `at`, default now). Rows: { metric: labels, value: [ts, string] }. */
  promql?(expr: string, at?: string): Promise<{ metric: Record<string, string>; value: [number, string] }[]>;
  /** Optional exact metric usage (Coralogix Metric Usage API). */
  metricUsage?: MetricUsageClient;
  listResources?(kind: 'slos' | 'e2m' | 'tco' | 'alerts' | 'recording-rules'): Promise<unknown[] | null>;
  askAI?(prompt: string, maskedSample: string, opts?: { schema?: object; model?: string; timeoutMs?: number }): Promise<{ text: string; json?: unknown } | null>;
}

export interface CustomerContext {
  name: string;
  environment: string;
  preparedBy: string;
  criticalServices: string[];
  nearRenewal?: boolean;
  teamCanVerify?: boolean;
  /** extra names to strip from the customer-ready report (internal people, team slugs) */
  internalTerms?: string[];
  /** Who the leadership slide is for, e.g. "the CTO and co-founders". Default: leadership. */
  audience?: string;
}

export interface VersionInfo {
  helmChart?: { current?: string; latest?: string; checkedAt?: string; source: 'detected' | 'user' | 'assumed-latest' | 'unknown' };
  collector?: { current?: string; latest?: string; distribution?: 'otelcol' | 'otelcol-contrib'; checkedAt?: string; source: 'detected' | 'user' | 'assumed-latest' | 'unknown' };
}

export interface ProgressEvent { checkId: string; title: string; status: 'waiting' | 'running' | 'done' | 'skipped' | 'failed'; message?: string; query?: string }

export const DEPLOYMENT_LABEL: Record<DeploymentType, string> = { helm: 'Kubernetes', ecs: 'ECS', ec2: 'EC2', standalone: 'Standalone' };
export const DEPLOYMENT_FOLDER: Record<DeploymentType, string> = { helm: 'kubernetes', ecs: 'ecs', ec2: 'ec2', standalone: 'standalone' };
export interface MetricUsageRow { name: string; unique: number; bytes: number; units: number; fraction: number; metricCount?: number; variations?: number }
export interface MetricUsageDay { date?: { year: number; month: number; day: number }; totalUnits: number; totalBytes: number; totalSeries: number; rows: MetricUsageRow[] }
export interface MetricUsageClient { labels(length?: number): Promise<MetricUsageDay>; metrics(length?: number): Promise<MetricUsageDay>; metricsForLabel(label: string, length?: number): Promise<MetricUsageRow[]> }
