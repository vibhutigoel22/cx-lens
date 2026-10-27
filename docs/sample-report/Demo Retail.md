# Coralogix Lens — Telemetry Health & Value Review

> 📅 **2026-10-26** · **Environment:** Demo Retail (`production`) · **Prepared by:** A. TAM, Coralogix TAM

## Leadership summary

_One slide for the CTO and co-founders. Savings shown in Coralogix units (Coralogix’s billing measure: 1 unit = $1.50 of usage, priced per GB by data type and tier) only._

**~2.5 units/day** we can stop spending (6.9 → ~4.4 units/day, −36.6%): about 76 units a month and 922 a year, 65% from config-only quick wins.

| Data type | Units/day today | Saving/day |
|---|---|---|
| Metrics | 3.3 | −0.4 (13%) |
| Traces | 1.8 | −1.8 (99%) |
| Logs | 1.8 | −0.1 (7%) |

**Largest changes:**

- Keep errors and slow traces, sample healthy traffic: ~1.8 units/day
- Re-tune span metrics (request, error and latency metrics generated from traces) histogram buckets (TAM skill: span-metrics-bucket-optimizer): ~0.3 units/day
- Remove unused resource attributes on every collector (the OpenTelemetry agent that ships telemetry to Coralogix): ~0.2 units/day
- Remove heavy, unused log attributes: ~0.1 units/day

---

# Technical details

## 🔍 What is this report?

This report gives the Demo Retail engineering and leadership teams a clear, ranked view of where observability spend is driven, and a phased plan to send cleaner telemetry without losing visibility into what matters. Savings are shown in Coralogix units per day; freed quota can be reinvested in new services, signals and features.

## 📊 Top-line summary

| Metric | Value |
|---|---|
| Current daily unit consumption | **6.9 units/day** |
| Total identified savings potential | **~2.53 units/day (~37%)** |
| Quick wins available (Phase 1, no app changes) | **20 findings · ~1.65 units/day** |
| Findings pending scoping | **0 findings** |

_Based on the last 24 hours of data (duplicate checks: last 15 minutes, scaled to a day) and the average of the last 7 complete days of usage (2026-10-19 to 2026-10-25)._

## 🗺 Phased roadmap

Findings are grouped by **effort**, not by size, so the largest saving can sit in Phase 2.

| Phase | Goal | Typical timeframe | Effort | Cumulative savings |
|---|---|---|---|---|
| 🟢 **Phase 1 – Quick Wins** | Config-only changes with no app code involvement | 1–2 weeks | Low | **~1.65 units/day** |
| 🟡 **Phase 2 – Coordinated Changes** | Helm upgrade, collector redeploy, or light cross-team review | 2–4 weeks | Medium | **~2.51 units/day** |
| 🟠 **Phase 3 – Strategic** | App code changes or architectural decisions | 1 quarter | Medium–High | **~2.53 units/day** |

> 💡 **Recommendation:** Start Phase 1 now — these changes carry essentially no risk. Use the early wins to schedule Phases 2 and 3.

## 🔄 Version status

| Component | Current | Latest |
|---|---|---|
| otel-integration Helm chart | 0.0.300 | 0.0.362 |
| OpenTelemetry Collector | 0.147.0 | 0.163.2 |

Breaking changes found: **16** (auto-fixed 3, manual 12). Checked 2026-10-26.

## 🏆 Ranked optimization opportunities

| # | ID | Pillar | Optimization | Volume | Est. savings / day | Effort | Phase | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | UNI-1 | ⚙️ Universal | Kubernetes: Protected label is being removed ⚠️ | 16 protected label(s) removed | No unit change | 🟢 Low | 1 | 🔴 Not started |
| 2 | UNI-2 | ⚙️ Universal | ECS: Protected label is being removed ⚠️ | 1 protected label(s) removed | No unit change | 🟢 Low | 1 | 🔴 Not started |
| 3 | SPAN-1 | 🔍 Traces | Alert on span metrics and keep raw traces in the Low tier | 7.36 GB/day of traces in Medium tier | **~1.10 units** | 🟢 Low | 1 | 🔴 Not started |
| 4 | SPAN-2 | 🔍 Traces | Drop internal spans in non-critical services (keep errors) | 370.6K INTERNAL spans/day in non-critical services (17.3% of spans) | **~0.318 units** | 🟢 Low | 1 | 🔴 Not started |
| 5 | LOG-1 | 📖 Logs | Join multi-line logs into single entries | 76.7K near-empty fragments/day | **~0.099 units** | 🟢 Low | 1 | 🔴 Not started |
| 6 | LOG-2 | 📖 Logs | Remove heavy, unused log attributes | log.file.path 91.6 MB/day · log.iostream 15.0 MB/day · logtag 5.8 MB/day · time 28.2 MB/day | **~0.092 units** | 🟢 Low | 1 | 🔴 Not started |
| 7 | METRIC-1 | 📉 Metrics | Remove process_pid from process_cpu_utilization_1 | process_cpu_utilization_1: 15.6K series now, 15.4K over the window | **~0.048 units** | 🟢 Low | 1 | 🔴 Not started |
| 8 | METRIC-2 | 📉 Metrics | Remove k8s_pod_name from metrics | k8s_pod_name: 39 unique values on 514 metrics, 2.5% of metric usage | **~0.026 units** | 🟢 Low | 1 | 🔴 Not started |
| 9 | METRIC-3 | 📉 Metrics | Remove process_command_line from metrics | process_command_line: 9.0K unique values on 83 metrics, 1.6% of metric usage | **~0.021 units** | 🟢 Low | 1 | 🔴 Not started |
| 10 | METRIC-4 | 📉 Metrics | Remove process_pid from process_cpu_time_total | process_cpu_time_total: 43.1K series now, 42.1K over the window | **~0.020 units** | 🟢 Low | 1 | 🔴 Not started |
| 11 | LOG-3 | 📖 Logs | Drop load-generator redirect access logs | default/frontend-proxy: 98.3K logs/day, 27.6 MB body text | **~0.009 units** | 🟢 Low | 1 | 🔴 Not started |
| 12 | LOG-4 | 📖 Logs | Strip trace IDs written into the log text | default/product-reviews: 56.6K logs/day, 25.7 MB body text | **~0.005 units** | 🟢 Low | 1 | 🔴 Not started |
| 13 | LOG-5 | 📖 Logs | Truncate full LLM prompts and tool responses | default/product-reviews: 2.5K logs/day, 4.7 MB body text | **~0.002 units** | 🟢 Low | 1 | 🔴 Not started |
| 14 | LOG-6 | 📖 Logs | Truncate full LLM prompts and tool responses | default/llm: 2.5K logs/day, 4.5 MB body text | **~0.002 units** | 🟢 Low | 1 | 🔴 Not started |
| 15 | UNI-3 | ⚙️ Universal | ECS: Compact repeated resource blocks with groupbyattrs | Pipelines without groupbyattrs: traces, metrics, logs | No unit change | 🟢 Low | 1 | 🔴 Not started |
| 16 | UNI-4 | ⚙️ Universal | ECS: Add memory_limiter first and batch last in every pipeline | collector/traces: no memory_limiter; collector/metrics: no memory_limiter; collector/metrics: batch is not last; collector/logs: no memory_limiter | No unit change | 🟢 Low | 1 | 🔴 Not started |
| 17 | UNI-5 | ⚙️ Universal | Kubernetes: Compress exported data | Compression disabled on opentelemetry-agent/otlp/coralogix | No unit change | 🟢 Low | 1 | 🔴 Not started |
| 18 | METRIC-5 | 📉 Metrics | Kubernetes: Set a sensible span metrics cardinality limit | — | No unit change | 🟢 Low | 1 | 🔴 Not started |
| 19 | METRIC-6 | 📉 Metrics | ECS: Set a sensible span metrics cardinality limit | — | No unit change | 🟢 Low | 1 | 🔴 Not started |
| 20 | METRIC-7 | 📉 Metrics | ECS: probabilistic_sampler cannot sample metrics | — | No unit change | 🟢 Low | 1 | 🔴 Not started |
| 21 | SPAN-3 | 🔍 Traces | Keep errors and slow traces, sample healthy traffic | 2.15M spans/day ingested at 100% · 0.28% error spans | **~1.82 units** | 🟡 Medium | 2 | 🔴 Not started |
| 22 | METRIC-18 | 📉 Metrics | Re-tune span metrics histogram buckets (TAM skill: span-metrics-bucket-optimizer) | duration_ms_bucket: 11 buckets today across 8 top services | **~0.292 units** | 🟡 Medium | 2 | 🔴 Not started |
| 23 | UNI-6 | ⚙️ Universal | Remove unused resource attributes on every collector | 2 removable attributes on logs, 12 on spans (~0.550 GB/day) | **~0.172 units** | 🟡 Medium | 2 | 🔴 Not started |
| 24 | UNI-7 | ⚙️ Universal | Kubernetes: Upgrade to the latest Helm chart / collector | Helm chart 0.0.300 → 0.0.362 | No unit change | 🟡 Medium | 2 | 🔴 Not started |
| 25 | UNI-8 | ⚙️ Universal | ECS: Upgrade to the latest Helm chart / collector | Collector 0.98.0 → 0.163.2 | No unit change | 🟡 Medium | 2 | 🔴 Not started |
| 26 | LOG-9 | 📖 Logs | Stop collecting Kafka logs twice | default/kafka: 19.0K logs/day, 3.5 MB body text | **~0.013 units** | 🟠 Medium–High | 3 | 🔴 Not started |

> ⚠️ SPAN-1, SPAN-2, SPAN-3 overlap: they act on some of the same data, so do not add their savings. The combined total counts only the largest, SPAN-3. Apply the simpler change first if you like; SPAN-3 still delivers most of the saving on its own.

## 💰 Combined potential

| Scenario | Est. savings / day |
|---|---|
| SPAN-3 (Keep errors and slow traces, sample healthy traffic) alone | Up to **~1.82 units** |
| All Phase 1 (Quick Wins) combined | Up to **~1.65 units** |
| **Realistic combined total (all phases)** | **~2.53 units/day — ~37% reduction from today** |

> ⚠️ **Disclaimer:** This is the TAM's best-effort calculation and can vary by about ±20%.

## 📈 Usage trend — last 30 days

| Date | Total | Logs | Traces | Metrics |
|---|---|---|---|---|
| 2026-09-27 | 7.21 | 2.37 | 1.84 | 3.00 |
| 2026-09-28 | 7.18 | 2.34 | 1.81 | 3.02 |
| 2026-09-29 | 7.19 | 2.34 | 1.82 | 3.02 |
| 2026-09-30 | 7.22 | 2.35 | 1.82 | 3.05 |
| 2026-10-01 | 7.23 | 2.35 | 1.84 | 3.04 |
| 2026-10-02 | 7.26 | 2.36 | 1.85 | 3.05 |
| 2026-10-03 | 7.22 | 2.32 | 1.83 | 3.06 |
| 2026-10-04 | 7.25 | 2.35 | 1.84 | 3.05 |
| 2026-10-05 | 7.27 | 2.34 | 1.85 | 3.08 |
| 2026-10-06 | 7.30 | 2.36 | 1.84 | 3.09 |
| 2026-10-07 | 7.27 | 2.34 | 1.84 | 3.09 |
| 2026-10-08 | 7.02 | 2.04 | 1.84 | 3.14 |
| 2026-10-09 | 7.59 | 2.36 | 1.98 | 3.24 |
| 2026-10-10 | 6.85 | 1.82 | 1.84 | 3.18 |
| 2026-10-11 | 6.83 | 1.80 | 1.84 | 3.18 |
| 2026-10-12 | 6.81 | 1.79 | 1.83 | 3.19 |
| 2026-10-13 | 6.86 | 1.80 | 1.85 | 3.20 |
| 2026-10-14 | 6.87 | 1.81 | 1.84 | 3.21 |
| 2026-10-15 | 6.84 | 1.80 | 1.84 | 3.20 |
| 2026-10-16 | 6.86 | 1.81 | 1.84 | 3.20 |
| 2026-10-17 | 6.87 | 1.81 | 1.84 | 3.23 |
| 2026-10-18 | 6.87 | 1.80 | 1.83 | 3.24 |
| 2026-10-19 | 6.86 | 1.80 | 1.83 | 3.23 |
| 2026-10-20 | 6.89 | 1.80 | 1.84 | 3.26 |
| 2026-10-21 | 6.93 | 1.83 | 1.85 | 3.26 |
| 2026-10-22 | 6.89 | 1.81 | 1.83 | 3.25 |
| 2026-10-23 | 6.94 | 1.83 | 1.85 | 3.25 |
| 2026-10-24 | 6.89 | 1.80 | 1.83 | 3.26 |
| 2026-10-25 | 6.96 | 1.85 | 1.86 | 3.25 |
| 2026-10-26 | 3.61 | 0.96 | 0.96 | 1.69 |

## 🏷 Top cardinality and usage labels

_Exact usage from the Metric Usage API for 2026-10-25._

| Label | Metrics | Unique values | Units/day | % of metric usage | Flag |
|---|---|---|---|---|---|
| `host_name` | 575 | 6 | 0.15 | 4.53% | Protected |
| `k8s_node_name` | 558 | 3 | 0.13 | 4.11% |  |
| `cx_otel_integration_name` | 567 | 1 | 0.12 | 3.76% | constant |
| `deployment_environment_name` | 575 | 1 | 0.11 | 3.32% | constant |
| `k8s_cluster_name` | 577 | 1 | 0.09 | 2.83% | Needed |
| `cx_subsystem_name` | 614 | 36 | 0.08 | 2.58% | Needed |
| `cloud_availability_zone` | 527 | 2 | 0.08 | 2.58% | Protected |
| `host_image_id` | 527 | 1 | 0.08 | 2.58% | Protected |
| `k8s_pod_name` | 514 | 39 | 0.08 | 2.49% | churn |
| `cx_application_name` | 614 | 7 | 0.08 | 2.42% | Needed |
| `os_description` | 283 | 6 | 0.08 | 2.37% |  |
| `cloud_account_id` | 562 | 1 | 0.07 | 2.19% | Protected |
| `host_id` | 567 | 5 | 0.07 | 2.11% | Protected |
| `service_namespace` | 399 | 1 | 0.07 | 2.11% | constant |
| `status_code` | 16 | 3 | 0.06 | 1.91% | Needed |

## 🔬 Detailed findings

### 🟢 Phase 1 – Quick Wins

#### 1. UNI-1 · Kubernetes: Protected label is being removed

**No unit change/day · Effort: Low · Owner: DevOps**

The current configuration deletes an attribute that Infrastructure Explorer and AWS enrichment rely on. Infrastructure views can break or show gaps.

> cloud.region — denylist at opentelemetry-agent.presets.reduceResourceAttributes.denylist.metrics
> cloud.region — denylist at opentelemetry-agent.presets.reduceResourceAttributes.denylist.logs
> azure.resourcegroup.name — denylist at opentelemetry-cluster-collector.presets.reduceResourceAttributes (chart default denylist)
> azure.vm.name — denylist at opentelemetry-cluster-collector.presets.reduceResourceAttributes (chart default denylist)
> azure.vm.scaleset.name — denylist at opentelemetry-cluster-collector.presets.reduceResourceAttributes (chart default denylist)
> azure.vm.size — denylist at opentelemetry-cluster-collector.presets.reduceResourceAttributes (chart default denylist)
> cloud.account.id — denylist at opentelemetry-cluster-collector.presets.reduceResourceAttributes (chart default denylist)
> cloud.availability_zone — denylist at opentelemetry-cluster-collector.presets.reduceResourceAttributes (chart default denylist)
> cloud.platform — denylist at opentelemetry-cluster-collector.presets.reduceResourceAttributes (chart default denylist)
> cloud.provider — denylist at opentelemetry-cluster-collector.presets.reduceResourceAttributes (chart default denylist)
> cloud.region — denylist at opentelemetry-cluster-collector.presets.reduceResourceAttributes (chart default denylist)
> gcp.cloud_run.job.execution — denylist at opentelemetry-cluster-collector.presets.reduceResourceAttributes (chart default denylist)
> gcp.cloud_run.job.task_index — denylist at opentelemetry-cluster-collector.presets.reduceResourceAttributes (chart default denylist)
> gcp.gce.instance_group_manager.name — denylist at opentelemetry-cluster-collector.presets.reduceResourceAttributes (chart default denylist)
> gcp.gce.instance_group_manager.region — denylist at opentelemetry-cluster-collector.presets.reduceResourceAttributes (chart default denylist)
> gcp.gce.instance_group_manager.zone — denylist at opentelemetry-cluster-collector.presets.reduceResourceAttributes (chart default denylist)
> host.image.id — denylist at opentelemetry-cluster-collector.presets.reduceResourceAttributes (chart default denylist)
> host.type — denylist at opentelemetry-cluster-collector.presets.reduceResourceAttributes (chart default denylist)

**Observed volume:** 16 protected label(s) removed

**Config change:**

```yaml
opentelemetry-cluster-collector:
  presets:
    reduceResourceAttributes:
      enabled: true
      pipelines:
        - metrics
        - traces
        - logs
      denylist:
        metrics: &a1
          - container.id
          - cx.otel_integration.name
          - faas.id
          - faas.instance
          - faas.name
          - faas.version
          - k8s.cronjob.uid
          - k8s.daemonset.uid
          - k8s.deployment.uid
          - k8s.hpa.uid
          - k8s.job.uid
          - k8s.namespace.uid
          - k8s.node.uid
          - k8s.pod.start_time
          - k8s.pod.uid
          - k8s.replicaset.uid
          - k8s.statefulset.uid
          - os.type
          - os.version
          - process.command
          - process.command_line
          - process.command_args
          - process.executable.name
          - process.executable.path
          - process.owner
          - process.pid
          - process.parent_pid
          - process.runtime.description
          - process.runtime.name
          - process.runtime.version
          - net.host.name
          - net.host.port
          - telemetry.distro.name
          - telemetry.distro.version
          - telemetry.sdk.language
          - telemetry.sdk.name
          - telemetry.sdk.version
        logs: *a1
        traces:
          - container.id
          - cx.otel_integration.name
          - faas.id
          - faas.instance
          - faas.name
          - faas.version
          - k8s.cronjob.uid
          - k8s.daemonset.uid
          - k8s.deployment.uid
          - k8s.hpa.uid
          - k8s.job.uid
          - k8s.namespace.uid
          - k8s.node.uid
          - k8s.pod.start_time
          - k8s.pod.uid
          - k8s.replicaset.uid
          - k8s.statefulset.uid
          - os.type
          - os.version
          - process.command
          - process.command_line
          - process.command_args
          - process.executable.name
          - process.executable.path
          - process.owner
          - process.pid
          - process.parent_pid
          - process.runtime.description
          - process.runtime.name
          - process.runtime.version
          - net.host.name
          - net.host.port
```

**Next step:** Stop removing these attributes. The generated config writes a protected-safe denylist and strips protected labels from existing lists.

_References: [Coralogix docs – GCP Infrastructure Explorer](https://coralogix.com/docs/integrations/gcp/gcp-infrastructure-explorer/) · [otel-integration Helm chart README – Filtering and reducing costs](https://github.com/coralogix/telemetry-shippers/tree/master/otel-integration/k8s-helm#filtering-and-reducing-costs)_

#### 2. UNI-2 · ECS: Protected label is being removed

**No unit change/day · Effort: Low · Owner: DevOps**

The current configuration deletes an attribute that Infrastructure Explorer and AWS enrichment rely on. Infrastructure views can break or show gaps.

> host.name — attributes-delete at processors.resource/drop

**Observed volume:** 1 protected label(s) removed

**Next step:** Stop removing these attributes. The generated config writes a protected-safe denylist and strips protected labels from existing lists.

_References: [Coralogix docs – GCP Infrastructure Explorer](https://coralogix.com/docs/integrations/gcp/gcp-infrastructure-explorer/) · [otel-integration Helm chart README – Filtering and reducing costs](https://github.com/coralogix/telemetry-shippers/tree/master/otel-integration/k8s-helm#filtering-and-reducing-costs)_

#### 3. SPAN-1 · Alert on span metrics and keep raw traces in the Low tier

**~1.10 units/day · Effort: Low · Owner: DevOps**

Dashboards and alerts work best on span metrics. Raw traces are only needed for investigation, and Low-tier traces stay searchable.

**Observed volume:** 7.36 GB/day of traces in Medium tier

**Volume affected:** 7.36 GB/day. _How this was estimated:_ GB/day per tier × (current tier rate − Low tier rate 0.1), official rates.

**Overlaps with:** SPAN-3

> 📌 The spanRules.serviceRule field in the draft mirrors the applicationRule shape returned by the API; run `cx tco test` on the draft before creating.
> 📌 Low-tier traces remain searchable.
> 📌 Create two complementary policies (service is X / service is not X) because the TCO tracing UI cannot select all services in one policy.
> 📌 For high-volume, low-value traces, consider Events2Metrics.

**Next step:** Confirm alerts and dashboards use span metrics, then create the two complementary TCO trace policies (service is X / service is not X).

_References: [Coralogix docs – TCO Optimizer (Traces)](https://coralogix.com/docs/user-guides/account-management/tco-optimizer/traces/) · [Coralogix docs – How usage is measured](https://coralogix.com/docs/user-guides/account-management/organization-management/usage-and-quota/how-usage-is-measured/) · [Coralogix docs – Events2Metrics](https://coralogix.com/docs/user-guides/monitoring-and-insights/events2metrics/)_

#### 4. SPAN-2 · Drop internal spans in non-critical services (keep errors)

**~0.318 units/day · Effort: Low · Owner: DevOps**

Internal spans describe steps inside one service. In non-critical services they are rarely needed and can make up a large share of each trace.

> Services: frontend, load-generator, flagd, email, quote, ad, product-reviews, recommendation.

```sql
source spans last 24h | filter $d.tags['span.kind']:string == 'internal' | groupby $l.serviceName aggregate count() as spans | orderby spans desc
```

**Observed volume:** 370.6K INTERNAL spans/day in non-critical services (17.3% of spans)

**Volume affected:** 1.27 GB/day. _How this was estimated:_ Upper bound: all INTERNAL spans in non-critical services (error spans are kept, so slightly less) (17.3% of spans) × 7.36 GB/day of traces, at the customer's blended traces rate over the last 7 complete days (0.250 units/GB, from official tier rates). Assumes average span size.

**Config change:**

```yaml
processors:
  filter/drop-internal-noncritical:
    error_mode: ignore
    trace_conditions:
      - span.kind.string == "Internal" and span.status.code != STATUS_CODE_ERROR
        and (resource.attributes["service.name"] == "frontend" or
        resource.attributes["service.name"] == "load-generator" or
        resource.attributes["service.name"] == "flagd" or
        resource.attributes["service.name"] == "email" or
        resource.attributes["service.name"] == "quote" or
        resource.attributes["service.name"] == "ad" or
        resource.attributes["service.name"] == "product-reviews" or
        resource.attributes["service.name"] == "recommendation")
```

**Overlaps with:** SPAN-3

> 📌 Span kind in OTTL is `kind.string == "Internal"` (ottlspan README); the playbook's attributes["span.kind"] form is corrected.

**Next step:** Drop INTERNAL spans that are not errors in the listed non-critical services.

_References: [OTTL span context README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/pkg/ottl/contexts/ottlspan/README.md) · [filterprocessor README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor)_

#### 5. LOG-1 · Join multi-line logs into single entries

**~0.099 units/day · Effort: Low · Owner: DevOps**

Stack traces and pretty-printed JSON are split into one log per line. Each fragment is billed and none is useful alone.

> Top fragments: "    }", "{", "      ],", "}", "  }", "  },". The fragments are pieces of pretty-printed JSON, so an event starts with a line beginning `{`. In OpenTelemetry this is configured on the filelog receiver, not a processor.

```sql
source logs last 24h | filter length($d.body:string) < 10 | groupby $d.body:string as log_body aggregate count() as occurrence_count, sum(byteLength($d.body:string)) as body_bytes | orderby occurrence_count desc
```

**Observed volume:** 76.7K near-empty fragments/day

**Volume affected:** 151.8 MB/day. _How this was estimated:_ Each fragment is a separate record carrying full metadata. Saving ≈ fragments × (average billed bytes per log 1983 B − fragment body), since the merged text is kept, at the customer's blended logs rate over the last 7 complete days (0.651 units/GB, from official tier rates).

**Config change:**

```yaml
receivers:
  filelog:
    multiline:
      line_start_pattern: ^\{
```

> 📌 The regex must match the first line of each event for these services; confirm with a sample before rollout.
> 📌 Better still: log JSON on a single line in the application.
> 📌 Shown for reference. Investigate findings cover the same log data, so this estimate is not added to the combined total.

**Next step:** Set `multiline.line_start_pattern` on the filelog receiver so each event starts at its first line (timestamp, or `{` for pretty-printed JSON).

_References: [filelogreceiver README – multiline (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/filelogreceiver#multiline-configuration)_

#### 6. LOG-2 · Remove heavy, unused log attributes

**~0.092 units/day · Effort: Low · Owner: DevOps**

Some attributes are attached to every log but never searched. They add size, and size is what units are charged on.

> Measured attribute payload: log.file.path: 91.64 MB/day, log.iostream: 14.96 MB/day, logtag: 5.82 MB/day, time: 28.16 MB/day.

```sql
source logs last 24h | create search from $d.attributes['log.file.path'] | filter search != null | create byte_length from byteLength(search:string) | aggregate avg(byte_length) as avg_bytes_size, count() as log_count | create gb_usage from ((avg_bytes_size * log_count) / 1000 / 1000 / 1000)
```

**Observed volume:** log.file.path 91.6 MB/day · log.iostream 15.0 MB/day · logtag 5.8 MB/day · time 28.2 MB/day

**Volume affected:** 140.6 MB/day. _How this was estimated:_ (avg value bytes + key bytes) × logs per day for each attribute, at the customer's blended logs rate over the last 7 complete days (0.651 units/GB, from official tier rates).

**Config change:**

```yaml
opentelemetry-agent:
  presets:
    reduceLogAttributes:
      enabled: true
```

**Next step:** Enable the reduceLogAttributes preset (top-level preset, applied on the agent). No application change.

_References: [otel-integration Helm chart README – Filtering and reducing costs](https://github.com/coralogix/telemetry-shippers/tree/master/otel-integration/k8s-helm#filtering-and-reducing-costs)_

#### 7. METRIC-1 · Remove process_pid from process_cpu_utilization_1

**~0.048 units/day · Effort: Low · Owner: DevOps**

Host-metrics process scraper series, one per running process. Every restart creates new series under a new process ID, so series pile up over the day without adding insight.

> Evidence: process_pid has 2600 distinct values

**See these records in Coralogix:**

```sql
source logs last 24h | count(count without (process_pid) (count_over_time(process_cpu_utilization_1[1440m]))) | limit 50
```

**Observed volume:** process_cpu_utilization_1: 15.6K series now, 15.4K over the window

**Live series (masked), before → after:**

```text
process_cpu_utilization_1{process_pid="3853", cx_subsystem_name="integration", host_id="i-0demo0000000000", cloud_region="ap-south-1", cx_application_name="otel", process_command="/usr/bin/containerd-shim-runc-v2", host_type="t3.medium", …}
```
→
```text
process_cpu_utilization_1{cx_subsystem_name="integration", host_id="i-0demo0000000000", cloud_region="ap-south-1", cx_application_name="otel", process_command="/usr/bin/containerd-shim-runc-v2", host_type="t3.medium", …}
```
```text
process_cpu_utilization_1{process_pid="1825", host_type="t3.medium", k8s_cluster_name="eks-demo-01", os_type="linux", cloud_provider="aws", deployment_environment_name="demo-prod", cloud_availability_zone="ap-south-1b", …}
```
→
```text
process_cpu_utilization_1{host_type="t3.medium", k8s_cluster_name="eks-demo-01", os_type="linux", cloud_provider="aws", deployment_environment_name="demo-prod", cloud_availability_zone="ap-south-1b", …}
```
```text
process_cpu_utilization_1{process_pid="34", cloud_availability_zone="ap-south-1a", cloud_platform="aws_ec2", cloud_region="ap-south-1", os_type="linux", cx_subsystem_name="integration", cx_application_name="otel", …}
```
→
```text
process_cpu_utilization_1{cloud_availability_zone="ap-south-1a", cloud_platform="aws_ec2", cloud_region="ap-south-1", os_type="linux", cx_subsystem_name="integration", cx_application_name="otel", …}
```

**Validated against live data:** 15.4K series over the window → 3.0K after the change (12.5K fewer, 6.48% of all metric series). Not referenced by alerts or recording rules.

```sql
count(count without (process_pid) (count_over_time(process_cpu_utilization_1[1440m])))
```

| Series now (window) | After the change | Share of metric series | Estimated saving |
|---|---|---|---|
| 15.4K | 3.0K | 6.48% | 0.048 units/day |

**Volume affected:** 6.32 GB/day. _How this was estimated:_ process_cpu_utilization_1 uses 0.060 units/day (Metric Usage API); 12.5K of its 15.4K series removed, assuming usage falls in proportion.

**Config change:**

```yaml
processors:
  transform/lens_metric_2:
    error_mode: ignore
    metric_statements:
      - context: datapoint
        statements:
          - delete_key(resource.attributes, "process.pid")
```

> 📌 Claude’s confidence: medium.

**Next step:** Drop the process ID on the agent, or limit the process scraper to the processes you alert on.

_References: [transformprocessor README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/transformprocessor) · [filterprocessor README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor) · [spanmetricsconnector README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/connector/spanmetricsconnector) · [Coralogix docs – Span metrics cardinality limits](https://coralogix.com/docs/user-guides/apm/getting-started/span-metrics-cardinality-limits/) · [Coralogix docs – How usage is measured](https://coralogix.com/docs/user-guides/account-management/organization-management/usage-and-quota/how-usage-is-measured/)_

#### 8. METRIC-2 · Remove k8s_pod_name from metrics

**~0.026 units/day · Effort: Low · Owner: DevOps**

k8s_pod_name changes on every restart. Each restart creates new series.

**See these records in Coralogix:**

```sql
source logs last 24h | count(count without (k8s_pod_name) (count_over_time({k8s_pod_name!=""}[1440m]))) | limit 50
```

**Observed volume:** k8s_pod_name: 39 unique values on 514 metrics, 2.5% of metric usage

**Real label values (masked), before → after:**

```text
k8s_pod_name="accounting-d7f678565-lqnf4"
```
→
```text
(label removed)
```
```text
k8s_pod_name="ad-97745dbf6-tvcxc"
```
→
```text
(label removed)
```
```text
k8s_pod_name="aws-node-2mmvn"
```
→
```text
(label removed)
```

**Validated against live data:** Series carrying k8s_pod_name over the window: 19.6K → 13.3K without it (32.3% fewer).

```sql
count(count without (k8s_pod_name) (count_over_time({k8s_pod_name!=""}[1440m])))
```

| Distinct values | Estimated saving |
|---|---|
| 39 → 13.3K | 0.026 units/day |

**Config change:**

```yaml
processors:
  transform/lens_label_k8s_pod_name:
    error_mode: ignore
    metric_statements:
      - context: resource
        statements:
          - delete_key(resource.attributes, "k8s.pod.name")
```

> 📌 Claude’s confidence: medium.

**Next step:** Drop it on the agent.

_References: [transformprocessor README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/transformprocessor) · [spanmetricsconnector README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/connector/spanmetricsconnector) · [Coralogix docs – Metrics Usage Analyzer](https://coralogix.com/docs/user-guides/account-management/payment-and-billing/metrics-usage-analyzer/) · [Coralogix docs – Span metrics cardinality limits](https://coralogix.com/docs/user-guides/apm/getting-started/span-metrics-cardinality-limits/)_

#### 9. METRIC-3 · Remove process_command_line from metrics

**~0.021 units/day · Effort: Low · Owner: DevOps**

process_command_line changes on every restart. Each restart creates new series.

**See these records in Coralogix:**

```sql
source logs last 24h | count(count without (process_command_line) (count_over_time({process_command_line!=""}[1440m]))) | limit 50
```

**Observed volume:** process_command_line: 9.0K unique values on 83 metrics, 1.6% of metric usage

**Real label values (masked), before → after:**

```text
process_command_line="./aws-k8s-agent"
```
→
```text
(label removed)
```
```text
process_command_line="./cart"
```
→
```text
(label removed)
```
```text
process_command_line="./checkout"
```
→
```text
(label removed)
```

**Validated against live data:** Series carrying process_command_line over the window: 95.6K → 56.2K without it (41.3% fewer).

```sql
count(count without (process_command_line) (count_over_time({process_command_line!=""}[1440m])))
```

| Distinct values | Estimated saving |
|---|---|
| 9.0K → 56.2K | 0.021 units/day |

**Config change:**

```yaml
processors:
  transform/lens_label_process_command_line:
    error_mode: ignore
    metric_statements:
      - context: resource
        statements:
          - delete_key(resource.attributes, "process.command.line")
```

> 📌 Claude’s confidence: medium.

**Next step:** Drop it on the agent.

_References: [transformprocessor README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/transformprocessor) · [spanmetricsconnector README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/connector/spanmetricsconnector) · [Coralogix docs – Metrics Usage Analyzer](https://coralogix.com/docs/user-guides/account-management/payment-and-billing/metrics-usage-analyzer/) · [Coralogix docs – Span metrics cardinality limits](https://coralogix.com/docs/user-guides/apm/getting-started/span-metrics-cardinality-limits/)_

#### 10. METRIC-4 · Remove process_pid from process_cpu_time_total

**~0.020 units/day · Effort: Low · Owner: DevOps**

Host-metrics process scraper series, one per running process. Every restart creates new series under a new process ID, so series pile up over the day without adding insight.

> Evidence: process_pid has 11300 distinct values

**See these records in Coralogix:**

```sql
source logs last 24h | count(count without (process_pid) (count_over_time(process_cpu_time_total[1440m]))) | limit 50
```

**Observed volume:** process_cpu_time_total: 43.1K series now, 42.1K over the window

**Live series (masked), before → after:**

```text
process_cpu_time_total{process_pid="75", cloud_provider="aws", deployment_environment_name="demo-prod", host_type="t3.medium", cx_otel_integration_name="coralogix-integration-helm", host_name="ip-10-0-0-2.ap-south-1.compute.internal", cloud_availability_zone="ap-south-1a", …}
```
→
```text
process_cpu_time_total{cloud_provider="aws", deployment_environment_name="demo-prod", host_type="t3.medium", cx_otel_integration_name="coralogix-integration-helm", host_name="ip-10-0-0-2.ap-south-1.compute.internal", cloud_availability_zone="ap-south-1a", …}
```
```text
process_cpu_time_total{process_pid="6", process_executable_name="kworker/R-sync_wq", deployment_environment_name="demo-prod", k8s_node_name="ip-10-0-0-3.ap-south-1.compute.internal", process_parent_pid="2", host_image_id="ami-0demo000000000", cloud_account_id="<ACCOUNT_ID>", …}
```
→
```text
process_cpu_time_total{process_executable_name="kworker/R-sync_wq", deployment_environment_name="demo-prod", k8s_node_name="ip-10-0-0-3.ap-south-1.compute.internal", process_parent_pid="2", host_image_id="ami-0demo000000000", cloud_account_id="<ACCOUNT_ID>", …}
```
```text
process_cpu_time_total{process_pid="4", cloud_platform="aws_ec2", cx_otel_integration_name="coralogix-integration-helm", cloud_account_id="<ACCOUNT_ID>", cloud_region="ap-south-1", cx_application_name="otel", cx_subsystem_name="integration", …}
```
→
```text
process_cpu_time_total{cloud_platform="aws_ec2", cx_otel_integration_name="coralogix-integration-helm", cloud_account_id="<ACCOUNT_ID>", cloud_region="ap-south-1", cx_application_name="otel", cx_subsystem_name="integration", …}
```

**Validated against live data:** 42.1K series over the window → 28.8K after the change (13.2K fewer, 6.89% of all metric series). Not referenced by alerts or recording rules.

```sql
count(count without (process_pid) (count_over_time(process_cpu_time_total[1440m])))
```

| Series now (window) | After the change | Share of metric series | Estimated saving |
|---|---|---|---|
| 42.1K | 28.8K | 6.89% | 0.020 units/day |

**Volume affected:** 6.72 GB/day. _How this was estimated:_ process_cpu_time_total uses 0.063 units/day (Metric Usage API); 13.2K of its 42.1K series removed, assuming usage falls in proportion.

**Config change:**

```yaml
processors:
  transform/lens_metric_1:
    error_mode: ignore
    metric_statements:
      - context: datapoint
        statements:
          - delete_key(resource.attributes, "process.pid")
```

> 📌 Claude’s confidence: medium.

**Next step:** Drop the process ID on the agent, or limit the process scraper to the processes you alert on.

_References: [transformprocessor README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/transformprocessor) · [filterprocessor README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor) · [spanmetricsconnector README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/connector/spanmetricsconnector) · [Coralogix docs – Span metrics cardinality limits](https://coralogix.com/docs/user-guides/apm/getting-started/span-metrics-cardinality-limits/) · [Coralogix docs – How usage is measured](https://coralogix.com/docs/user-guides/account-management/organization-management/usage-and-quota/how-usage-is-measured/)_

#### 11. LOG-3 · Drop load-generator redirect access logs

**~0.009 units/day · Effort: Low · Owner: DevOps**

Envoy access logs for synthetic requests from a python-requests load generator that get a 308 redirect. Synthetic redirect traffic is logged on every request but never helps an investigation.

> Evidence: "python-requests/2.32.5" · " 308 - via_upstream"

**See these records in Coralogix:**

```sql
source logs last 24h | filter $d.body:string.contains('python-requests') && $d.body:string.contains('" 308 ') | limit 50
```

**Observed volume:** default/frontend-proxy: 98.3K logs/day, 27.6 MB body text

**Live samples of the records this change affects (masked), before → after:**

```text
[2026-10-26T12:24:41.316Z] "GET /api/data/?contextKeys=binoculars HTTP/1.1" 308 - via_upstream - "-" 0 32 1 1 "-" "python-requests/2.32.5" "e203789c-8075-96a8-9c82-dbc997797dca" "frontend-proxy:8080" "<IP>:8080" frontend <IP>:35500 <IP>:8080 <IP>:59046 - -

```
→
```text
(record dropped by the filter)
```
```text
[2026-10-26T12:24:47.965Z] "GET /api/data/?contextKeys=books HTTP/1.1" 308 - via_upstream - "-" 0 27 1 0 "-" "python-requests/2.32.5" "3f2cf03e-8298-9d4d-9018-fce46504a1a3" "frontend-proxy:8080" "<IP>:8080" frontend <IP>:35500 <IP>:8080 <IP>:59058 - -

```
→
```text
(record dropped by the filter)
```
```text
[2026-10-26T12:25:02.832Z] "GET /api/data/?contextKeys=binoculars HTTP/1.1" 308 - via_upstream - "-" 0 32 1 0 "-" "python-requests/2.32.5" "44048777-5ead-9537-9e38-7732d1db78a1" "frontend-proxy:8080" "<IP>:8080" frontend <IP>:35500 <IP>:8080 <IP>:59046 - -

```
→
```text
(record dropped by the filter)
```

**Validated against live data:** Matches 7.3K logs/day (2.1 MB of body text), 7% of this pattern. No error records match.

```sql
filter $d.body:string.contains('python-requests') && $d.body:string.contains('" 308 ')
```

| Affected per day | Data removed | Rate used | Estimated saving |
|---|---|---|---|
| 7.3K logs | 14.5 MB/day | 0.651 units/GB | 0.009 units/day |

**Volume affected:** 14.5 MB/day. _How this was estimated:_ 7.3K matching logs/day × 1983 B average billed size per log, at the customer's blended logs rate over the last 7 complete days (0.651 units/GB, from official tier rates).

**Config change:**

```yaml
processors:
  filter/lens_log_1:
    error_mode: ignore
    log_conditions:
      - IsMatch(log.body, "python-requests") and IsMatch(log.body, "\" 308 ") and log.severity_number < SEVERITY_NUMBER_ERROR
```

> 📌 OTTL checked by Lens (allowed functions, quoting, protected labels). Run otelcol-contrib validate before rollout.
> 📌 Claude’s confidence: high.

**Next step:** Confirm the load generator is not used for synthetic monitoring, then add the filter on the agent.

_References: [transformprocessor README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/transformprocessor) · [filterprocessor README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor) · [Coralogix docs – DataPrime language reference](https://coralogix.com/docs/dataprime/) · [Coralogix docs – How usage is measured](https://coralogix.com/docs/user-guides/account-management/organization-management/usage-and-quota/how-usage-is-measured/)_

#### 12. LOG-4 · Strip trace IDs written into the log text

**~0.005 units/day · Effort: Low · Owner: DevOps**

Python service logs that write trace_id, span_id and service name into the message text. The same IDs already travel as OpenTelemetry trace context, so the text copy is paid for twice on every line.

> Evidence: [trace_id=… span_id=… resource.service.name=product-reviews trace_sampled=True]

**See these records in Coralogix:**

```sql
source logs last 24h | filter $d.body:string.contains('[trace_id=') && $d.body:string.contains('trace_sampled=') | limit 50
```

**Observed volume:** default/product-reviews: 56.6K logs/day, 25.7 MB body text

**Live samples (masked), before → after:**

```text
2026-10-26 06:48:29,714 INFO [main] [product_reviews_server.py:104] [trace_id=e73109a16b30def641c35d7394d86a90 span_id=a5910831a3bca6a1 resource.service.name=product-reviews trace_sampled=True] - Receive AskProductAIAssistant for product id:9SIQT8TOJO, question: Can you summarize the product reviews?
```
→
```text
2026-10-26 06:48:29,714 INFO [main] [product_reviews_server.py:104] - Receive AskProductAIAssistant for product id:9SIQT8TOJO, question: Can you summarize the product reviews?
```
```text
2026-10-26 06:48:29,715 INFO [main] [product_reviews_server.py:165] [trace_id=e73109a16b30def641c35d7394d86a90 span_id=8e014830a0839498 resource.service.name=product-reviews trace_sampled=True] - llmRateLimitError feature flag: False
```
→
```text
2026-10-26 06:48:29,715 INFO [main] [product_reviews_server.py:165] - llmRateLimitError feature flag: False
```
```text
2026-10-26 06:48:29,735 INFO [httpx] [_client.py:1025] [trace_id=e73109a16b30def641c35d7394d86a90 span_id=90d3ed6b363c0abf resource.service.name=product-reviews trace_sampled=True] - HTTP Request: POST http://llm:8000/v1/chat/completions "HTTP/1.1 200 OK"
```
→
```text
2026-10-26 06:48:29,735 INFO [httpx] [_client.py:1025] - HTTP Request: POST http://llm:8000/v1/chat/completions "HTTP/1.1 200 OK"
```
_After: the replace_pattern regex applied by Lens to these exact samples._

**Validated against live data:** Matches 63.9K logs/day (27.9 MB of body text), 100% of this pattern. No error records match.

```sql
filter $d.body:string.contains('[trace_id=') && $d.body:string.contains('trace_sampled=')
```

| Affected per day | Data removed | Rate used | Estimated saving |
|---|---|---|---|
| 63.9K logs | 8.0 MB/day | 0.651 units/GB | 0.005 units/day |

**Volume affected:** 8.0 MB/day. _How this was estimated:_ 126 B removed per log (measured on the live samples) × 63.9K matching logs/day, at the customer's blended logs rate over the last 7 complete days (0.651 units/GB, from official tier rates).

**Config change:**

```yaml
processors:
  transform/lens_log_2:
    error_mode: ignore
    log_statements:
      - context: log
        statements:
          - replace_pattern(body, "\\[trace_id=[0-9a-f]+ span_id=[0-9a-f]+ resource\\.service\\.name=[^ \\]]+ trace_sampled=[A-Za-z]+\\] ", "")
```

> 📌 OTTL checked by Lens (allowed functions, quoting, protected labels). Run otelcol-contrib validate before rollout.
> 📌 Claude’s confidence: high.

**Next step:** Remove the trace fields from the Python logging format, or apply this transform on the agent.

_References: [transformprocessor README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/transformprocessor) · [filterprocessor README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor) · [Coralogix docs – DataPrime language reference](https://coralogix.com/docs/dataprime/) · [Coralogix docs – How usage is measured](https://coralogix.com/docs/user-guides/account-management/organization-management/usage-and-quota/how-usage-is-measured/)_

#### 13. LOG-5 · Truncate full LLM prompts and tool responses

**~0.002 units/day · Effort: Low · Owner: DevOps**

Debug logs that include whole LLM system prompts and tool outputs. Each record is large and contains user content. The first part is enough to see what was called.

> Evidence: Invoking the LLM with the following messages: '[{'role': 'system'…

**See these records in Coralogix:**

```sql
source logs last 24h | filter $d.body:string.startsWith('Invoking the LLM') | limit 50
```

**Observed volume:** default/product-reviews: 2.5K logs/day, 4.7 MB body text

**Live samples (masked), before → after:**

```text
Invoking the LLM with the following messages: '[{'role': 'system', 'content': "You are a helpful assistant that answers related to a specific product. Use tools as needed to fetch the product reviews and product information. Keep the response brief with no more than 1-2 sentences. If you don't know the answer, just say you don't know."}, {'role': 'user', 'content': 'Answer the following question about product ID:L9ECAV7KIM: Can you summarize the product reviews?'}, ChatCompletionMessage(content='requesting a tool call', refusal=None, role='assistant', annotations=None, audio=None, function_cal… [+1227 chars]
```
→
```text
Invoking the LLM with the following messages: '[{'role': 'system', 'content': "You are a helpful assistant that answers related to a specific product. Use tools as needed to fetch the product reviews and product information. Keep the response brief with no more than 1-2 sentences. If you don't know the answer, just say you don't know."}, {'role': 'user', 'content': 'Answer the following question about product ID:L9ECAV7KIM: Can you summarize the product reviews?'}, ChatCompletionMessage(content='requesting 
```
```text
Invoking the LLM with the following messages: '[{'role': 'system', 'content': "You are a helpful assistant that answers related to a specific product. Use tools as needed to fetch the product reviews and product information. Keep the response brief with no more than 1-2 sentences. If you don't know the answer, just say you don't know."}, {'role': 'user', 'content': 'Answer the following question about product ID:LS4PSXUNUM: Can you summarize the product reviews?'}, ChatCompletionMessage(content='requesting a tool call', refusal=None, role='assistant', annotations=None, audio=None, function_cal… [+1297 chars]
```
→
```text
Invoking the LLM with the following messages: '[{'role': 'system', 'content': "You are a helpful assistant that answers related to a specific product. Use tools as needed to fetch the product reviews and product information. Keep the response brief with no more than 1-2 sentences. If you don't know the answer, just say you don't know."}, {'role': 'user', 'content': 'Answer the following question about product ID:LS4PSXUNUM: Can you summarize the product reviews?'}, ChatCompletionMessage(content='requesting 
```
```text
Invoking the LLM with the following messages: '[{'role': 'system', 'content': "You are a helpful assistant that answers related to a specific product. Use tools as needed to fetch the product reviews and product information. Keep the response brief with no more than 1-2 sentences. If you don't know the answer, just say you don't know."}, {'role': 'user', 'content': 'Answer the following question about product ID:9SIQT8TOJO: Can you summarize the product reviews?'}, ChatCompletionMessage(content='requesting a tool call', refusal=None, role='assistant', annotations=None, audio=None, function_cal… [+1295 chars]
```
→
```text
Invoking the LLM with the following messages: '[{'role': 'system', 'content': "You are a helpful assistant that answers related to a specific product. Use tools as needed to fetch the product reviews and product information. Keep the response brief with no more than 1-2 sentences. If you don't know the answer, just say you don't know."}, {'role': 'user', 'content': 'Answer the following question about product ID:9SIQT8TOJO: Can you summarize the product reviews?'}, ChatCompletionMessage(content='requesting 
```
_After: truncated to 512 characters._

**Validated against live data:** Matches 2.5K logs/day (4.7 MB of body text), 100% of this pattern. No error records match.

```sql
filter $d.body:string.startsWith('Invoking the LLM')
```

| Affected per day | Data removed | Rate used | Estimated saving |
|---|---|---|---|
| 2.5K logs | 3.4 MB/day | 0.651 units/GB | 0.002 units/day |

**Volume affected:** 3.4 MB/day. _How this was estimated:_ 2.5K logs/day longer than 512 characters lose 1379 B each on average (measured), at the customer's blended logs rate over the last 7 complete days (0.651 units/GB, from official tier rates).

**Config change:**

```yaml
processors:
  transform/lens_log_3:
    error_mode: ignore
    log_statements:
      - context: log
        statements:
          - set(body, Substring(body, 0, 512)) where Len(body) > 512
```

> 📌 OTTL checked by Lens (allowed functions, quoting, protected labels). Run otelcol-contrib validate before rollout.
> 📌 Claude’s confidence: medium.

**Next step:** Log model, token counts and latency instead of full content; review with the privacy owner.

_References: [transformprocessor README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/transformprocessor) · [filterprocessor README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor) · [Coralogix docs – DataPrime language reference](https://coralogix.com/docs/dataprime/) · [Coralogix docs – How usage is measured](https://coralogix.com/docs/user-guides/account-management/organization-management/usage-and-quota/how-usage-is-measured/)_

#### 14. LOG-6 · Truncate full LLM prompts and tool responses

**~0.002 units/day · Effort: Low · Owner: DevOps**

Debug logs that include whole LLM system prompts and tool outputs. Each record is large and contains user content. The first part is enough to see what was called.

> Evidence: Invoking the LLM with the following messages: '[{'role': 'system'…

**See these records in Coralogix:**

```sql
source logs last 24h | filter $d.body:string.contains('Received a chat completion request') | limit 50
```

**Observed volume:** default/llm: 2.5K logs/day, 4.5 MB body text

**Live samples (masked), before → after:**

```text
[2026-10-26 04:06:18,472] INFO in app: Received a chat completion request: '[{'role': 'system', 'content': "You are a helpful assistant that answers related to a specific product. Use tools as needed to fetch the product reviews and product information. Keep the response brief with no more than 1-2 sentences. If you don't know the answer, just say you don't know."}, {'role': 'user', 'content': 'Answer the following question about product ID:0PUK6V6EV0: Can you summarize the product reviews?'}, {'content': 'requesting a tool call', 'role': 'assistant', 'tool_calls': [{'id': 'call', 'function': … [+1195 chars]
```
→
```text
[2026-10-26 04:06:18,472] INFO in app: Received a chat completion request: '[{'role': 'system', 'content': "You are a helpful assistant that answers related to a specific product. Use tools as needed to fetch the product reviews and product information. Keep the response brief with no more than 1-2 sentences. If you don't know the answer, just say you don't know."}, {'role': 'user', 'content': 'Answer the following question about product ID:0PUK6V6EV0: Can you summarize the product reviews?'}, {'content': '
```
```text
[2026-10-26 04:06:09,729] INFO in app: Received a chat completion request: '[{'role': 'system', 'content': "You are a helpful assistant that answers related to a specific product. Use tools as needed to fetch the product reviews and product information. Keep the response brief with no more than 1-2 sentences. If you don't know the answer, just say you don't know."}, {'role': 'user', 'content': 'Answer the following question about product ID:0PUK6V6EV0: Can you summarize the product reviews?'}, {'content': 'requesting a tool call', 'role': 'assistant', 'tool_calls': [{'id': 'call', 'function': … [+1195 chars]
```
→
```text
[2026-10-26 04:06:09,729] INFO in app: Received a chat completion request: '[{'role': 'system', 'content': "You are a helpful assistant that answers related to a specific product. Use tools as needed to fetch the product reviews and product information. Keep the response brief with no more than 1-2 sentences. If you don't know the answer, just say you don't know."}, {'role': 'user', 'content': 'Answer the following question about product ID:0PUK6V6EV0: Can you summarize the product reviews?'}, {'content': '
```
```text
[2026-10-26 04:06:02,953] INFO in app: Received a chat completion request: '[{'role': 'system', 'content': "You are a helpful assistant that answers related to a specific product. Use tools as needed to fetch the product reviews and product information. Keep the response brief with no more than 1-2 sentences. If you don't know the answer, just say you don't know."}, {'role': 'user', 'content': 'Answer the following question about product ID:L9ECAV7KIM: Can you summarize the product reviews?'}, {'content': 'requesting a tool call', 'role': 'assistant', 'tool_calls': [{'id': 'call', 'function': … [+1150 chars]
```
→
```text
[2026-10-26 04:06:02,953] INFO in app: Received a chat completion request: '[{'role': 'system', 'content': "You are a helpful assistant that answers related to a specific product. Use tools as needed to fetch the product reviews and product information. Keep the response brief with no more than 1-2 sentences. If you don't know the answer, just say you don't know."}, {'role': 'user', 'content': 'Answer the following question about product ID:L9ECAV7KIM: Can you summarize the product reviews?'}, {'content': '
```
_After: truncated to 512 characters._

**Validated against live data:** Matches 5.0K logs/day (5.7 MB of body text), 100% of this pattern. No error records match.

```sql
filter $d.body:string.contains('Received a chat completion request')
```

| Affected per day | Data removed | Rate used | Estimated saving |
|---|---|---|---|
| 5.0K logs | 3.2 MB/day | 0.651 units/GB | 0.002 units/day |

**Volume affected:** 3.2 MB/day. _How this was estimated:_ 2.5K logs/day longer than 512 characters lose 1302 B each on average (measured), at the customer's blended logs rate over the last 7 complete days (0.651 units/GB, from official tier rates).

**Config change:**

```yaml
processors:
  transform/lens_log_4:
    error_mode: ignore
    log_statements:
      - context: log
        statements:
          - set(body, Substring(body, 0, 512)) where Len(body) > 512
```

> 📌 OTTL checked by Lens (allowed functions, quoting, protected labels). Run otelcol-contrib validate before rollout.
> 📌 Claude’s confidence: medium.

**Next step:** Log model, token counts and latency instead of full content; review with the privacy owner.

_References: [transformprocessor README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/transformprocessor) · [filterprocessor README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor) · [Coralogix docs – DataPrime language reference](https://coralogix.com/docs/dataprime/) · [Coralogix docs – How usage is measured](https://coralogix.com/docs/user-guides/account-management/organization-management/usage-and-quota/how-usage-is-measured/)_

#### 15. UNI-3 · ECS: Compact repeated resource blocks with groupbyattrs

**No unit change/day · Effort: Low · Owner: DevOps**

Some shippers repeat the full resource header on every batch. Compacting them makes requests smaller and the collector more efficient.

> Receivers like Fluent Bit-style forwarders and Prometheus scrapes repeat the resource header on every batch. Pipelines: traces, metrics, logs.

**Observed volume:** Pipelines without groupbyattrs: traces, metrics, logs

**Config change:**

```yaml
processors:
  groupbyattrs:
    keys: []
```

> 📌 Efficiency lever: smaller requests and less memory, not a unit saving.

**Next step:** Add groupbyattrs (keys: []) immediately before batch in the listed pipelines.

_References: [groupbyattrsprocessor README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/groupbyattrsprocessor)_

#### 16. UNI-4 · ECS: Add memory_limiter first and batch last in every pipeline

**No unit change/day · Effort: Low · Owner: DevOps**

A collector that runs out of memory drops everything during the outage. memory_limiter protects it, and batch sends data efficiently.

> collector/traces: no memory_limiter
> collector/metrics: no memory_limiter
> collector/metrics: batch is not last
> collector/logs: no memory_limiter

**Observed volume:** collector/traces: no memory_limiter; collector/metrics: no memory_limiter; collector/metrics: batch is not last; collector/logs: no memory_limiter

**Config change:**

```yaml
processors:
  memory_limiter:
    check_interval: 5s
    limit_percentage: 80
    spike_limit_percentage: 25
  batch:
    send_batch_size: 8192
    timeout: 5s
```

**Next step:** Put memory_limiter first and batch last in every pipeline.

_References: [memorylimiterprocessor README (core)](https://github.com/open-telemetry/opentelemetry-collector/tree/main/processor/memorylimiterprocessor) · [batchprocessor README (core)](https://github.com/open-telemetry/opentelemetry-collector/tree/main/processor/batchprocessor)_

#### 17. UNI-5 · Kubernetes: Compress exported data

**No unit change/day · Effort: Low · Owner: DevOps**

Compression reduces network egress. It does not change Coralogix units, because units are measured on data size before compression.

**Observed volume:** Compression disabled on opentelemetry-agent/otlp/coralogix

> 📌 Saves network egress only; Coralogix units are measured before compression.

**Next step:** Remove `compression: none` (gzip is the OTLP default) or set zstd.

_References: [configgrpc README – compression (core)](https://github.com/open-telemetry/opentelemetry-collector/blob/main/config/configgrpc/README.md)_

#### 18. METRIC-5 · Kubernetes: Set a sensible span metrics cardinality limit

**No unit change/day · Effort: Low · Owner: DevOps**

The span metrics connector can cap unique label combinations. Extra ones fold into one overflow series (otel.metric.overflow="true").

> spanmetrics: uses deprecated dimensions_cache_size

> 📌 Fix cardinality upstream first, then set the limit near the steady-state series count. Raising the limit only delays the problem and costs collector memory.
> 📌 dimensions_cache_size is deprecated in favour of aggregation_cardinality_limit (spanmetricsconnector README).

**Next step:** Fix cardinality upstream first, then set aggregation_cardinality_limit near the steady-state series count. New combinations beyond the limit fold into one series with otel.metric.overflow="true".

_References: [spanmetricsconnector README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/connector/spanmetricsconnector) · [Coralogix docs – Span metrics cardinality limits](https://coralogix.com/docs/user-guides/apm/getting-started/span-metrics-cardinality-limits/)_

#### 19. METRIC-6 · ECS: Set a sensible span metrics cardinality limit

**No unit change/day · Effort: Low · Owner: DevOps**

The span metrics connector can cap unique label combinations. Extra ones fold into one overflow series (otel.metric.overflow="true").

> spanmetrics: uses deprecated dimensions_cache_size

> 📌 Fix cardinality upstream first, then set the limit near the steady-state series count. Raising the limit only delays the problem and costs collector memory.
> 📌 dimensions_cache_size is deprecated in favour of aggregation_cardinality_limit (spanmetricsconnector README).

**Next step:** Fix cardinality upstream first, then set aggregation_cardinality_limit near the steady-state series count. New combinations beyond the limit fold into one series with otel.metric.overflow="true".

_References: [spanmetricsconnector README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/connector/spanmetricsconnector) · [Coralogix docs – Span metrics cardinality limits](https://coralogix.com/docs/user-guides/apm/getting-started/span-metrics-cardinality-limits/)_

#### 20. METRIC-7 · ECS: probabilistic_sampler cannot sample metrics

**No unit change/day · Effort: Low · Owner: DevOps**

The probabilistic sampler supports traces and logs only. For metrics, use deterministic filtering or SDK-level sampling.

**Next step:** Remove probabilistic_sampler from metrics pipelines; use deterministic OTTL filtering or SDK-level sampling.

_References: [probabilisticsamplerprocessor README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/probabilisticsamplerprocessor)_

### 🟡 Phase 2 – Coordinated Changes

#### 21. SPAN-3 · Keep errors and slow traces, sample healthy traffic

**~1.82 units/day · Effort: Medium · Owner: DevOps**

Every request creates a trace, and most of them look the same. tail sampling (deciding which traces to keep after the whole trace is seen) keeps the traces that explain problems and stores only a small sample of healthy ones.

> Policy order: errors (critical services 100%, others 1%), slow traces over 500 ms, then 1% of OK/UNSET. Estimated kept share: 1.0%.

```sql
source spans last 24h | groupby $d.tags['otel.status_code']:string as status aggregate count() as spans
```

**Observed volume:** 2.15M spans/day ingested at 100% · 0.28% error spans

**Volume affected:** 7.29 GB/day. _How this was estimated:_ Spans not kept by the policies (99.0% of spans) × 7.36 GB/day of traces, at the customer's blended traces rate over the last 7 complete days (0.250 units/GB, from official tier rates). Assumes average span size.

**Config change:**

```yaml
processors:
  tail_sampling:
    decision_wait: 10s
    num_traces: 50000
    policies:
      - name: keep-critical-errors-100pct
        type: and
        and:
          and_sub_policy:
            - name: svc
              type: string_attribute
              string_attribute:
                key: service.name
                values:
                  - checkout
                  - payment
            - name: err
              type: status_code
              status_code:
                status_codes:
                  - ERROR
      - name: keep-errors-1pct
        type: and
        and:
          and_sub_policy:
            - name: err
              type: status_code
              status_code:
                status_codes:
                  - ERROR
            - name: prob
              type: probabilistic
              probabilistic:
                sampling_percentage: 1
      - name: keep-slow
        type: latency
        latency:
          threshold_ms: 500
      - name: keep-nonerror-1pct
        type: and
        and:
          and_sub_policy:
            - name: nonerror
              type: status_code
              status_code:
                status_codes:
                  - OK
                  - UNSET
            - name: prob
              type: probabilistic
              probabilistic:
                sampling_percentage: 1
```

**Overlaps with:** SPAN-2

> 📌 Upper-bound estimate: traces with an error keep all their spans, and slow traces are kept too, so the real saving is somewhat lower. Validate in non-prod first.
> 📌 Keep span metrics for everything; sampling only reduces raw traces.

**Next step:** Add the tail_sampling processor on the gateway (all spans of a trace must reach the same collector), validate in non-prod, then roll out with a Helm upgrade.

_References: [tailsamplingprocessor README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/tailsamplingprocessor)_

#### 22. METRIC-18 · Re-tune span metrics histogram buckets (TAM skill: span-metrics-bucket-optimizer)

**~0.292 units/day · Effort: Medium · Owner: DevOps**

Most requests finish under 50 ms, so fine buckets below 10 ms add series without improving p95 or p99. Nine buckets keep p50, p95 and p99 accurate for the top services and remove the rarely used 2000 and 5000 ms bounds.

**See these records in Coralogix:**

```sql
source logs last 24h | sum by (le) (increase(duration_ms_bucket{service_name="…"}[1440m])) | limit 50
```

**Observed volume:** duration_ms_bucket: 11 buckets today across 8 top services

**Buckets: today and proposed, before → after:**

```text
Today (ms): 1, 4, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000
```
→
```text
Proposed (ms): 5, 10, 25, 50, 100, 250, 500, 1000, 2500 (Apdex 250 ms)
```

**Validated against live data:** 11 buckets today → 9 proposed. duration_ms_bucket: 8.7K series → about 7.2K.

```sql
sum by (le) (increase(duration_ms_bucket{service_name="…"}[1440m]))
```

| Buckets | Histogram series | Estimated saving |
|---|---|---|
| 11 → 9 | 8.7K → ~7.2K | 0.292 units/day |

**Volume affected:** 733.0 MB/day. _How this was estimated:_ duration_ms_bucket uses 1.753 units/day (Metric Usage API); 11 → 9 buckets removes about 1.4K of its 8.7K series, assuming usage falls in proportion.

**Config change:**

```yaml
connectors:
  spanmetrics:
    histogram:
      explicit:
        buckets:
          - 5ms
          - 10ms
          - 25ms
          - 50ms
          - 100ms
          - 250ms
          - 500ms
          - 1000ms
          - 2500ms
# Helm: set the same buckets on the chart’s span metrics preset (chart README › Span metrics).
```

> 📌 Vendor compared against: Datadog.
> 📌 Percentiles are interpolated by Lens from live bucket counts (as histogram_quantile does).

**Next step:** Apply in non-production, compare p95/p99 against today for one week, then roll out.

_References: [spanmetricsconnector README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/connector/spanmetricsconnector) · [Coralogix docs – Span metrics cardinality limits](https://coralogix.com/docs/user-guides/apm/getting-started/span-metrics-cardinality-limits/)_

#### 23. UNI-6 · Remove unused resource attributes on every collector

**~0.172 units/day · Effort: Medium · Owner: DevOps**

Every log line, span and metric carries the same block of resource metadata. Short-lived IDs and SDK details in that block are rarely queried but are paid for on every record.

> Attributes found on records: cx.otel_integration.name, os.type, container.id, process.command_line, process.command_args, process.executable.name, process.executable.path, process.owner, process.pid, process.runtime.description, process.runtime.name, process.runtime.version. Current state: agent custom-denylist, cluster-collector default-denylist, gateway disabled. A custom denylist replaces the chart default, so the full protected-safe list from the playbook is written (traces keep telemetry.*).

```sql
source logs last 1h | limit 20
```

**Observed volume:** 2 removable attributes on logs, 12 on spans (~0.550 GB/day)

**Volume affected:** 550.4 MB/day. _How this was estimated:_ Sum over present attributes of (avg value bytes + key bytes) × records per day, at the customer's blended logs rate over the last 7 complete days (0.651 units/GB, from official tier rates) for logs and the customer's blended traces rate over the last 7 complete days (0.250 units/GB, from official tier rates) for spans.

**Config change:**

```yaml
opentelemetry-cluster-collector:
  presets:
    reduceResourceAttributes:
      enabled: true
      pipelines:
        - metrics
        - traces
        - logs
      denylist:
        metrics: &a1
          - container.id
          - cx.otel_integration.name
          - faas.id
          - faas.instance
          - faas.name
          - faas.version
          - k8s.cronjob.uid
          - k8s.daemonset.uid
          - k8s.deployment.uid
          - k8s.hpa.uid
          - k8s.job.uid
          - k8s.namespace.uid
          - k8s.node.uid
          - k8s.pod.start_time
          - k8s.pod.uid
          - k8s.replicaset.uid
          - k8s.statefulset.uid
          - os.type
          - os.version
          - process.command
          - process.command_line
          - process.command_args
          - process.executable.name
          - process.executable.path
          - process.owner
          - process.pid
          - process.parent_pid
          - process.runtime.description
          - process.runtime.name
          - process.runtime.version
          - net.host.name
          - net.host.port
          - telemetry.distro.name
          - telemetry.distro.version
          - telemetry.sdk.language
          - telemetry.sdk.name
          - telemetry.sdk.version
        logs: *a1
        traces:
          - container.id
          - cx.otel_integration.name
          - faas.id
          - faas.instance
          - faas.name
          - faas.version
          - k8s.cronjob.uid
          - k8s.daemonset.uid
          - k8s.deployment.uid
          - k8s.hpa.uid
          - k8s.job.uid
          - k8s.namespace.uid
          - k8s.node.uid
          - k8s.pod.start_time
          - k8s.pod.uid
          - k8s.replicaset.uid
          - k8s.statefulset.uid
          - os.type
          - os.version
          - process.command
          - process.command_line
          - process.command_args
          - process.executable.name
          - process.executable.path
          - process.owner
          - process.pid
          - process.parent_pid
          - process.runtime.description
          - process.runtime.name
          - process.runtime.version
          - net.host.name
          - net.host.port
```

> 📌 Recheck the custom denylist against the chart README "Filtering and reducing costs" section on every chart upgrade, because the default list can change.
> 📌 Metric series saving is not converted to units here; see the METRIC high-churn finding for series counts.

**Next step:** Enable reduceResourceAttributes with the protected-safe custom denylist on cluster-collector, agent and gateway, then roll out with a Helm upgrade.

_References: [otel-integration Helm chart README – Filtering and reducing costs](https://github.com/coralogix/telemetry-shippers/tree/master/otel-integration/k8s-helm#filtering-and-reducing-costs) · [Coralogix docs – Filtering and reducing costs (EKS)](https://coralogix.com/docs/external/telemetry-shippers/otel-integration/k8s-helm/kubernetes-observability/filtering-and-reducing-costs/)_

#### 24. UNI-7 · Kubernetes: Upgrade to the latest Helm chart / collector

**No unit change/day · Effort: Medium · Owner: DevOps**

Newer releases fix bugs and add the presets used in this review. Upgrading first keeps every later change simple.

> Helm chart 0.0.300 → 0.0.362. See the Upgrade section for breaking changes.

**Observed volume:** Helm chart 0.0.300 → 0.0.362

**Next step:** Upgrade in non-production first using upgraded-config.yaml, keep the current values as the rollback, then promote.

_References: [otel-integration CHANGELOG](https://github.com/coralogix/telemetry-shippers/blob/master/otel-integration/CHANGELOG.md) · [opentelemetry-collector-contrib CHANGELOG](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/CHANGELOG.md) · [opentelemetry-collector CHANGELOG](https://github.com/open-telemetry/opentelemetry-collector/blob/main/CHANGELOG.md)_

#### 25. UNI-8 · ECS: Upgrade to the latest Helm chart / collector

**No unit change/day · Effort: Medium · Owner: DevOps**

Newer releases fix bugs and add the presets used in this review. Upgrading first keeps every later change simple.

> Collector 0.98.0 → 0.163.2. See the Upgrade section for breaking changes.

**Observed volume:** Collector 0.98.0 → 0.163.2

**Next step:** Upgrade in non-production first using upgraded-config.yaml, keep the current values as the rollback, then promote.

_References: [otel-integration CHANGELOG](https://github.com/coralogix/telemetry-shippers/blob/master/otel-integration/CHANGELOG.md) · [opentelemetry-collector-contrib CHANGELOG](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/CHANGELOG.md) · [opentelemetry-collector CHANGELOG](https://github.com/open-telemetry/opentelemetry-collector/blob/main/CHANGELOG.md)_

### 🟠 Phase 3 – Strategic

#### 26. LOG-9 · Stop collecting Kafka logs twice

**~0.013 units/day · Effort: Medium–High · Owner: App Team**

Kafka segment-roll messages that also arrive with a timestamp prefix under another pattern. Each event is stored and billed twice.

> Evidence: Same message appears with and without "[2026-… ] INFO" prefix

**See these records in Coralogix:**

```sql
source logs last 24h | filter $l.subsystemname == 'kafka' && $d.body:string.startsWith('[LocalLog') | limit 50
```

**Observed volume:** default/kafka: 19.0K logs/day, 3.5 MB body text

**Live samples of the records this change affects (masked):**

```text
[LocalLog partition=__cluster_metadata-0, dir=/tmp/kafka-logs] Rolled new log segment at offset 19095698 in 1 ms.
```
```text
[LocalLog partition=__cluster_metadata-0, dir=/tmp/kafka-logs] Deleting segment files LogSegment(baseOffset=19095368, size=2160, lastModifiedTime=1792951021198, largestRecordTimestamp=1792951021185)
```
```text
[LocalLog partition=__cluster_metadata-0, dir=/tmp/kafka-logs] Deleting segment files LogSegment(baseOffset=19095398, size=2160, lastModifiedTime=1792951036209, largestRecordTimestamp=1792951036189),LogSegment(baseOffset=19095428, size=2160, lastModifiedTime=1792951051209, largestRecordTimestamp=1792951051192)
```

**Validated against live data:** Matches 10.2K logs/day (1.7 MB of body text), 53% of this pattern. No error records match.

```sql
filter $l.subsystemname == 'kafka' && $d.body:string.startsWith('[LocalLog')
```

| Affected per day | Data removed | Rate used | Estimated saving |
|---|---|---|---|
| 10.2K logs | 20.2 MB/day | 0.651 units/GB | 0.013 units/day |

**Volume affected:** 20.2 MB/day. _How this was estimated:_ 10.2K matching logs/day × 1983 B average billed size per log, at the customer's blended logs rate over the last 7 complete days (0.651 units/GB, from official tier rates).

**Config change:**

```yaml
# Change at the source (application or shipper):
# Collect Kafka logs from one source only (container stdout or the log file, not both).
```

> 📌 Claude’s confidence: medium.

**Next step:** Check the agent’s filelog include paths and the container log collection for Kafka.

_References: [transformprocessor README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/transformprocessor) · [filterprocessor README (contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor) · [Coralogix docs – DataPrime language reference](https://coralogix.com/docs/dataprime/) · [Coralogix docs – How usage is measured](https://coralogix.com/docs/user-guides/account-management/organization-management/usage-and-quota/how-usage-is-measured/)_

## ⬆️ Upgrade

From chart 0.0.300 / collector 0.147.0 to chart 0.0.362 / collector 0.163.2.

| Version | Component | What changed | Status |
|---|---|---|---|
| 0.0.308 | otel-integration chart | [Breaking] Enable byte-sized batching for the Coralogix exporter sending queue by default. The collector can now consume more memory. See the [Coralogix exporter sending queue and batching](https://github.com/coralogix/telemetry-shippers/blob/master/otel-integration/k8s-helm/README.md#coralogix-exporter-sending-queue-and-batching) documentation for details. | Manual action needed |
| 0.0.310 | otel-integration chart | [Breaking] Enable database sanitization for spans by default when span metrics are generated. See the [About span metrics](https://github.com/coralogix/telemetry-shippers/blob/master/otel-integration/k8s-helm/README.md#about-span-metrics) documentation for details. | Manual action needed |
| 0.0.317 | otel-integration chart | [Breaking] Fix `spanMetricsMulti` to apply the same extra dimensions (including `errorTracking` fallback from `presets.spanMetrics`) to all spanmetrics connectors, and skip auto-added status code dimensions when they are already listed in `extraDimensions`. | Manual action needed |
| 0.0.317 | otel-integration chart | [Breaking] Fix `spanmetrics/default` and routed `spanmetrics/<index>` connectors to match single `spanMetrics` compatibility defaults by setting `add_resource_attributes: true` and `histogram.unit: ms`, required for APM span metrics. | Manual action needed |
| 0.0.339 | otel-integration chart | [Change] Note for upgraders: server-side Redis and Memcached measurements now report `db.server.operation.duration` instead of `db.client.operation.duration` | Manual action needed |
| 0.0.345 | otel-integration chart | [Fix] Note for upgraders: v0.13.0 fixes a group of memory-safety bugs in the socket-layer context propagation. The header injector no longer acts on a leftover message buffer, which could write a `traceparent` into the middle of a TLS stream and reset the instrumented connection; message-buffer reads are bounded by the mapped data window, so a failed pull no longer copies adjacent kernel memory into span payloads, and sends of 8 KiB or more are captured again. Installs running `presets.contextPropagation` should take this image | Manual action needed |
| 0.0.345 | otel-integration chart | [Change] Note for upgraders: `service.name` and `service.namespace` are no longer default metric attributes. They remain resource attributes, so the OTLP metrics this chart exports still carry the service identity and the Coralogix pipeline is unaffected. Prometheus scrapers lose the `service_name` / `service_namespace` labels on application metric series; restore them with `config.data.attributes.extra_group_attributes.app: [service.name, service.namespace]`, or join through `target_info` | Manual action needed |
| 0.0.345 | otel-integration chart | [Change] Note for upgraders: Go runtime metric probes now require the `application_runtime` feature. The `presets.runtimeMetrics` preset already adds it, so a default install keeps Go runtime metrics; installs that configure `metrics.features` by hand must include it | Manual action needed |
| 0.0.345 | otel-integration chart | [Change] Note for upgraders: `error.type` values are unified across spans and metrics, and TCP client/server roles are classified by the local port, which corrects previously swapped roles for same-namespace clients | Manual action needed |
| 0.0.358 | otel-integration chart | [Change] Note for upgraders: `service.peer.name`, `http.request.body.size`, `http.response.body.size` and `obi.http.response.observed` are now opt-in span attributes. The chart's default `config.data.attributes.select.traces.include: ['*']` keeps selecting them; installs that override that selection must include them explicitly, e.g. `service.peer.name` for service-graph generation | Manual action needed |
| 0.0.358 | otel-integration chart | [Change] Note for upgraders: with `metrics.features` including `application` or `application_red`, HTTP duration and body-size metrics now carry `error.type` on failed requests, which recreates the existing series in Prometheus. The `application_host` feature and its `traces_host_info` metric are removed | Manual action needed |
| 0.100.0 | spanmetrics | dimensions_cache_size is deprecated; use aggregation_cardinality_limit. | Auto-fixed |
| 0.146.0 | filter | Legacy traces.span / logs.log_record / metrics.metric\|datapoint (and resource) are deprecated; use <signal>_conditions with context-prefixed paths. | Auto-fixed |
| 0.150.0 | pkg/ottl | Return errors when OTTL context accessors receive values of the wrong type (part 2) (#40198) | Manual action needed |
| 0.153.0 | filter/transform | Default top-level error_mode changed from propagate to ignore (beta in 0.153.0, stable in 0.157.0). Pinned to the old value to keep current behaviour; remove the pin to adopt the new default. | Not applicable |
| 0.161.0 | ottl | pkg/ottl: removed deprecated Base64Decode converter; use Decode with base64 encoding. | Auto-fixed |

**Manual actions:**

- v0.0.308 otel-integration chart: Chart release note for upgraders. Check whether it affects your values.
- v0.0.310 otel-integration chart: Chart release note for upgraders. Check whether it affects your values.
- v0.0.317 otel-integration chart: Chart release note for upgraders. Check whether it affects your values.
- v0.0.317 otel-integration chart: Chart release note for upgraders. Check whether it affects your values.
- v0.0.339 otel-integration chart: Chart release note for upgraders. Check whether it affects your values.
- v0.0.345 otel-integration chart: Chart release note for upgraders. Check whether it affects your values.
- v0.0.345 otel-integration chart: Chart release note for upgraders. Check whether it affects your values.
- v0.0.345 otel-integration chart: Chart release note for upgraders. Check whether it affects your values.
- v0.0.345 otel-integration chart: Chart release note for upgraders. Check whether it affects your values.
- v0.0.358 otel-integration chart: Chart release note for upgraders. Check whether it affects your values.
- v0.0.358 otel-integration chart: Chart release note for upgraders. Check whether it affects your values.
- v0.150.0 pkg/ottl: Listed as a breaking change for a component in your config. Coralogix Lens does not auto-change this; read the entry and confirm whether your settings are affected.

**Denylist recheck:**

- Chart default denylist unchanged (53 attributes); the custom protected-safe denylist is still current.

**Safe upgrade steps:**

1. Test the upgrade in a non-production cluster first.
2. Keep the current values file as the rollback (helm rollback to the previous revision).
3. Use upgraded-config.yaml for the upgrade; use optimized-config.yaml if you must stay on the current version for now.
4. Resolve every “Manual action needed” row before production.
5. Promote to production during a change window and watch collector logs and data usage for 24 hours.

## 🚀 Adoption gaps and expansion opportunities

| Area | What we saw | Opportunity |
|---|---|---|
| RUM | No session-recording usage in the last day. | Real User Monitoring would connect front-end experience to back-end traces. |
| Continuous profiling | No profiling usage. | Profiling can explain CPU hot spots found during investigations. |

About 2.5 units/day of headroom (37% of today's usage) could be reinvested — for example in tracing for uninstrumented services, RUM, profiling or SLOs.

## ✅ Next steps

| Owner | Action | By when |
|---|---|---|
| Customer DevOps | Review and approve the Phase 1 changes and config diff | 2026-11-02 |
| Coralogix TAM | Re-run the assessment to confirm Phase 1 savings, then update the status column | 2026-11-16 |
| Customer DevOps | Schedule the Phase 2 Helm upgrade / collector redeploy (non-prod first) | 2026-11-23 |

> Once Phase 1 is live, re-run the assessment and update the Status column — this report is meant to be revisited, not a one-time snapshot.
