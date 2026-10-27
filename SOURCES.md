# Sources

Coralogix Lens uses only these sources (brief §2). Every finding carries its sources; internal sources are shown only in the internal report. Anything not covered by them is reported as **"Not covered by official guidance"**. The machine-readable registry is `packages/rules/sources.yaml`. Checked on **2026-10-23**.

## Playbook (internal)

| Source | Used by |
|---|---|
| Telemetry Health & Value Review – TAM Playbook (Universal, Logs, Traces, Metrics, AI Skills tabs) — status **WIP**, last updated 2026-09-03 | All rules (`packages/rules/*.yaml`, `playbookSection` on every rule), protected labels, method, eligibility |
| Executive Summary – Optimization (report template) | Report builder (`packages/core/src/report/*`), phase definitions, overlap note, ±20% disclaimer, LOG-SEVERITY / SPAN-LIBRARIES patterns. The 🔶 worked example is never used; the scrubber also blocks it. |
| Tail Sampling for Traces – full reference | SPAN-SAMPLING, SPAN-LOW-PRIORITY policy shapes |

## Coralogix (official)

| Page | Used by |
|---|---|
| [How usage is measured](https://coralogix.com/docs/user-guides/account-management/organization-management/usage-and-quota/how-usage-is-measured/) · [Data usage](https://coralogix.com/docs/user-guides/account-management/payment-and-billing/data-usage/) | `rules/units.yaml`, units calculator. Logs 0.75/0.32/0.12 (blocked 0.08), traces 0.5/0.25/0.1 units/GB by tier, metrics 30 GB = 1 unit. Cross-checked against live `cx usage daily`. |
| [Coralogix domain](https://coralogix.com/docs/user-guides/account-management/account-settings/coralogix-domain/) | `rules/domains.yaml`, MetricsApiAdapter |
| [cx CLI](https://coralogix.com/docs/external/cx-cli/) · [Advanced configuration](https://coralogix.com/docs/external/cx-cli/documents/configuration) · [cx-cli GitHub](https://github.com/coralogix/cx-cli) | CxCliAdapter (commands discovered from `cx schema`; `--read-only` on every call). Credentials: OAuth tokens or API key, stored in the OS keyring (`os-store`, default on macOS) or the profile TOML (`file`). The docs do not name the keyring entry, so Lens does not read it: metrics run through `cx metrics query` (PromQL) instead, which matched the Metrics API exactly on a live team (233 series, 28 label combinations for one service). |
| [otel-integration README – Filtering and reducing costs](https://github.com/coralogix/telemetry-shippers/tree/master/otel-integration/k8s-helm#filtering-and-reducing-costs) · [values.yaml](https://github.com/coralogix/telemetry-shippers/blob/master/otel-integration/k8s-helm/values.yaml) | UNI-REDUCE-RESOURCE-ATTRS, LOG-ATTR-REDUCTION, METRIC-HIGH-CHURN, METRIC-SPAN-SANITIZATION, denylist recheck |
| [otel-integration CHANGELOG](https://github.com/coralogix/telemetry-shippers/blob/master/otel-integration/CHANGELOG.md) · Helm repo `https://cgx.jfrog.io/artifactory/coralogix-charts-virtual/index.yaml` | Version resolver, chart → collector mapping, chart upgrade notes |
| [Filtering and reducing costs (EKS)](https://coralogix.com/docs/external/telemetry-shippers/otel-integration/k8s-helm/kubernetes-observability/filtering-and-reducing-costs/) | UNI-REDUCE-RESOURCE-ATTRS |
| [AWS ECS-EC2 OTel integration](https://coralogix.com/docs/opentelemetry/aws-ecs-ec2/ecs-ec2-integration/) | METRIC-HEAVY-RESOURCE, non-Helm transform/reduce |
| [TCO Optimizer](https://coralogix.com/docs/user-guides/account-management/tco-optimizer/) · [Traces](https://coralogix.com/docs/user-guides/account-management/tco-optimizer/traces/) | LOG-TCO-FIT, SPAN-SPANMETRICS-TCO, policy drafts (shape taken from a live `cx tco get` response) |
| [Metrics Usage Analyzer](https://coralogix.com/docs/user-guides/account-management/payment-and-billing/metrics-usage-analyzer/) · [Metrics Cost Optimizer](https://coralogix.com/docs/user-guides/account-management/payment-and-billing/metrics-optimization/) | METRIC-UNUSED |
| [Scrape interval](https://coralogix.com/docs/user-guides/account-management/payment-and-billing/optimize-metrics-costs-in-coralogix-by-adjusting-your-scrape-interval/) | METRIC-SCRAPE-INTERVAL |
| [Span metrics cardinality limits](https://coralogix.com/docs/user-guides/apm/getting-started/span-metrics-cardinality-limits/) | METRIC-LABEL-ANALYZER, METRIC-CARDINALITY-LIMIT |
| [GCP](https://coralogix.com/docs/integrations/gcp/gcp-infrastructure-explorer/) / [Azure](https://coralogix.com/docs/integrations/azure/azure-infrastructure-explorer/) Infrastructure Explorer · [APM on EC2](https://coralogix.com/docs/integrations/aws/apm-amazon-ec2/) · [AWS resource enrichment](https://coralogix.com/docs/user-guides/data-transformation/enrichments/aws-resource-enrichment/) | `protected-labels.yaml`, UNI-PROTECTED-LABEL-REMOVED |
| DataPrime reference (via `cx dataprime show` / `cx docs`) | Every query (validated by compiling and running it live) |
| [Events2Metrics](https://coralogix.com/docs/user-guides/monitoring-and-insights/events2metrics/) | Adoption gaps, SPAN-SPANMETRICS-TCO note |

## Claude Code CLI (Investigate mode)

| Source | Used by |
|---|---|
| `claude --help` (Claude Code 2.1.310): `-p/--print`, `--output-format json`, `--json-schema`, `--tools ""`, `--no-session-persistence`, prompt on stdin; errors returned as `{ "is_error": true, "result": "Not logged in · Please run /login" }` | ClaudeCliAdapter (`ask`, `selfTest`). Claude never produces the numbers: Lens measures volume with cx and applies official unit rates. |

## Coralogix Metric Usage API

| Source | Used by |
|---|---|
| [Metric usage API](https://coralogix.com/docs/developer-portal/apis/data-management/metrics-usage-api/) (gRPC `com.coralogix.metrics.metric_usages.UsageService`: `GetLabelUsages`, `GetMetricUsages`, `GetMetricUsagesByLabel`; DataAnalytics preset) | Label inventory and exact per-label / per-metric units. Verified live: the sort field is `USAGE` (the docs show `BYTES_VOLUME`, which the API rejects), and the last complete UTC day is used. The deprecated Metrics Cardinality API is not used. |
| [Data Usage Query API](https://coralogix.com/docs/api-reference/v5/data-usage-query-service/) via `cx usage capabilities` | Checked: breaks usage down by pillar, priority, application, subsystem and service, but not by metric or label. |
| `cloud.platform` and `k8s.cluster.name` resource attributes | Volume split per deployment type. Verified live: EKS nodes report `cloud.platform = aws_ec2`, so a cluster name means Kubernetes. |

## TAM skills (playbook › AI Skills, internal)

| Skill | Used by |
|---|---|
| `span-name-cardinality-analyzer` (bundled in `skills/`) | Investigate › metrics. Its method is applied by Claude to data Lens collects through cx. The skill’s rule against reusing other customers’ patterns is passed through. |
| `span-metrics-bucket-optimizer` (bundled with its vendor-percentile references) | Investigate › metrics. Bucket distribution collected through cx; percentiles computed by Lens; bucket key `histogram.explicit.buckets` checked in the spanmetrics connector README. |

PromQL behaviour relied on (verified live through `cx metrics query`): `*_over_time` functions drop `__name__`, so metrics are ranked with an instant query and measured per metric over the window. `count(count without (label) (count_over_time(metric[w])))` gives the exact series count after dropping a label.

## OpenTelemetry (official)

| README / CHANGELOG | Used by |
|---|---|
| contrib: [groupbyattrs](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/groupbyattrsprocessor) (beta) | UNI-GROUPBYATTRS |
| contrib: [k8sattributes](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/k8sattributesprocessor) | UNI-K8SATTR-ALLOWLIST |
| core: [memory_limiter](https://github.com/open-telemetry/opentelemetry-collector/tree/main/processor/memorylimiterprocessor), [batch](https://github.com/open-telemetry/opentelemetry-collector/tree/main/processor/batchprocessor) | UNI-MEMLIMIT-BATCH |
| core: [configgrpc](https://github.com/open-telemetry/opentelemetry-collector/blob/main/config/configgrpc/README.md), [otlpexporter](https://github.com/open-telemetry/opentelemetry-collector/tree/main/exporter/otlpexporter) | UNI-OTLP-COMPRESSION |
| contrib: [filter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor) | LOG-LOW-VALUE, SPAN-HEALTH, SPAN-INTERNAL, METRIC-FILTER-UNUSED, upgrader |
| contrib: [transform](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/transformprocessor), [OTTL span context](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/pkg/ottl/contexts/ottlspan/README.md) | LOG-DUP-KEYS, SPAN-HEAVY-VALUES, METRIC-SPAN-ATTRS, transform/reduce |
| contrib: [logdedup](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/logdedupprocessor) (alpha) | LOG-DEDUP |
| contrib: [filelog receiver – multiline](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/filelogreceiver) | LOG-MULTILINE |
| contrib: [tail_sampling](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/tailsamplingprocessor) (beta) | SPAN-SAMPLING |
| contrib: [redaction](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/redactionprocessor) (traces beta; logs/metrics alpha) | METRIC-REDACTION |
| contrib: [spanmetrics connector](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/connector/spanmetricsconnector) | METRIC-CARDINALITY-LIMIT, upgrader |
| contrib: [probabilistic_sampler](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/probabilisticsamplerprocessor) | METRIC-NO-PROB-SAMPLER |
| [contrib CHANGELOG](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/CHANGELOG.md) · [core CHANGELOG](https://github.com/open-telemetry/opentelemetry-collector/blob/main/CHANGELOG.md) · [releases](https://github.com/open-telemetry/opentelemetry-collector-releases/releases) | `rules/upgrade-fixes.yaml`, upgrader (parsed live), version resolver |

Not used: `cardinality_guardian` and other processors outside opentelemetry-collector-contrib (playbook mentions it as an example of what not to recommend).

## Playbook vs official docs — differences found

Where they disagree, the official docs win. Each item is also commented in code or rules.

| # | Playbook says | Official source says | What Lens does |
|---|---|---|---|
| 1 | "multiline processor" | Multiline is configured on the **filelog receiver**, with exactly one of `line_start_pattern` / `line_end_pattern` | Writes `receivers.filelog.multiline.line_start_pattern` (`rules/logs.yaml`, LOG-MULTILINE) |
| 2 | `logdedup` with `cache_size`, `mode: exact` | Options are `interval`, `conditions`, `log_count_attribute`, `include_fields`, `exclude_fields`, `timezone`, `metadata_keys`, `metadata_cardinality_limit`; stability **alpha** | Emits only documented options and shows the stability level |
| 3 | `tailsampling` and `tail_sampling` | Component name is `tail_sampling` | Uses `tail_sampling` |
| 4 | OTTL `attributes["span.kind"] == "internal"` | Span kind is `kind` (int) / `kind.string` with values like `Internal` | Uses `kind.string == "Internal"` (prefixed `span.` for ≥ 0.146) |
| 5 | Filter examples use `traces: span:` | Deprecated since contrib **v0.146.0**; use `trace_conditions` with `span.`-prefixed paths | Writer is version-aware; upgrader migrates legacy syntax |
| 6 | Metrics tab lists signals directly under `reduceResourceAttributes` | Chart README: `denylist: { metrics, traces, logs }` (custom list replaces the default) | Uses the `denylist:` structure. Note: the README's own sample block has misaligned indentation; values.yaml and the Universal tab confirm the structure. |
| 7 | Logs tab nests `reduceLogAttributes` under `logsCollection` | Chart README: top-level preset `presets.reduceLogAttributes` | Writes the top-level preset on the agent |
| 8 | Universal › groupbyattrs first code block | It is a `k8sattributes` extract example | Used as the allowlisting example (UNI-K8SATTR-ALLOWLIST) |
| 9 | `url_sanitizer` / `db_sanitizer` | Present in the current redaction README (traces beta) | Used; caveat to fall back to transform + `replace_pattern` if a customer's collector rejects them |
| 10 | DataPrime `byteLength($d.resource.attributes:json)` | `json` is not a DataPrime cast type (compile error, verified live) | Sizes per attribute with `byteLength($d.resource.attributes['k']:string)` |
| 11 | `$d.subsystemname` | Subsystem is a label: `$l.subsystemname` | Corrected |
| 12 | Cost query starts with `create …` and no source | Needs `source logs`; untyped `search.byteLength()` fails | Rewritten with `source logs`, explicit cast, and GB output (units come from official tier rates) |
| 13 | `filter $d.logId_count > 1` | Aggregate alias is top-level after `groupby` | `filter logId_count > 1`; extra aggregated total query added |
| 14 | `filter byteLength($d:string) > 32000` | Casting the whole object to string yields null, so the filter never matches (verified live) | Uses body size (playbook Toolkit 5 form) |
| 15 | `startsWith('at ':string)` | Literal needs no cast | Corrected |
| 16 | `[...].arrayContains($d.body)` | Needs `:string` cast | Corrected |
| 17 | (Implied) `in [...]` style list checks | DataPrime has no `in [...]`; use `arrayContains` | Used in SPAN-HEALTH |
| 18 | `matches('…')` | `matches` requires a regex literal `/…/` | Corrected |
| 19 | `replace_pattern((` snippet | Malformed OTTL | Fixed statement in `rules/traces.yaml` |
| 20 | "Exporter without compression → enable gzip" | otlpexporter: **gzip is the default** | Only explicit `compression: none` is a finding; reported as egress-only (no unit change) |
| 21 | Chart "latest version 0.0.356" | Helm repo resolves **0.0.362** (2026-10-23) | Resolved at runtime; 0.0.356 is offline fallback only |
| 22a | Metrics Label Analyzer script calls the Metrics API with an API key | `cx metrics query` gives the same results with cx's own sign-in | Built-in analyzer uses `count_over_time(metric{…}[24h])` through cx; direct API only as explicit-key fallback |
| 22 | Metrics Label Analyzer `api.{DOMAIN}.coralogix.com` | Domain list: `ap1.coralogix.com` etc. | Region → `api.<domain>/metrics/api/v1` from `domains.yaml` (verified live on AP1) |
| 23 | Span-metric overflow label `otel_metric_overflow` | Connector sets `otel.metric.overflow="true"` (shown as `otel_metric_overflow` in Prometheus naming) | Both named in the explanation |
| 24 | Chart default denylist | Includes `cloud.*`, `host.image.id`, `host.type`, `azure.*`, `gcp.*` | Lens never relies on the default; a preset enabled without a custom list is a high-priority protected-label finding |

## Known limits of the official guidance

- **TCO trace policy service filter**: the draft's `spanRules.serviceRule` mirrors the `applicationRule` shape returned by the API. No public schema was found, so drafts say to run `cx tco test` before creating.
- **Helm pipelines**: whether user-listed `service.pipelines.*.processors` merge with preset-generated processors is not documented in the chart README. Lens adds a comment and asks the TAM to confirm with `helm template`.
- **Metrics savings in units** for label/series reductions are not derivable from official rates without Metrics Usage Analyzer data, so they are reported as *Needs scoping*.
