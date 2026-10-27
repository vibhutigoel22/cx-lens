# Internal summary template

Fill every bracketed placeholder from that run's actual data. Keep each section tight —
this is a Slack-postable internal summary, not a report.

---

**Current buckets ([N]):** [comma-separated live values + units] — live data shows [1-2] blind
spot(s): [one line per blind spot naming the % of traffic and the gap width, e.g. "~X% of traffic
sits in the unresolved A–B gap"].

**Matching [Vendor]'s percentiles:** [3-5 sentences from references/vendor-percentile-methods.md
for the named vendor — state the real mechanism, then the design implication in terms of bucket
spacing]. Omit this section entirely (with a one-line note why) if there's no comparison vendor.

**VictoriaMetrics histogram principle:** Valyala's article's core point: ad-hoc linear buckets rot
over time (ranges drift, gaps appear) and cause bad `histogram_quantile` estimates exactly where
the gaps are — which is precisely [reference the blind spot(s) named above]. His fix is a fixed
geometric progression (VM uses 18 buckets/decade at a 1.136x multiplier) so relative error stays
bounded everywhere and cross-service aggregation works, since every service shares the same
boundaries. We don't need 18-per-decade granularity for APM, but the same principle — consistent
~2x steps, no outlier gaps — is exactly what fixes the problem(s) above while keeping bucket count
flat.

**Proposed bucket set ([N] buckets — [same/fewer] cardinality than today):**
```yaml
histogram:
  explicit:
    buckets:
      - [value][unit]   # [reason: apdex T / apdex 4T / gap-fill / tail catch-all]
      ...
```
Why it covers everything: [1-2 sentences per requirement group — deadzone fill, step-ratio/DDSketch-
style bound, Apdex pairs, tail-gap fill, cardinality unchanged].

**Per-service latency profile (live, [window]):**

| service | <[X][unit] | p50 | p75 | p90 | p95 | p99 |
|---|---|---|---|---|---|---|
| [...] | | | | | | |

[1-2 sentences clustering services into shapes, e.g. "fast & tight", "fast with rare heavy tail",
"uniformly slower" — name which services fall in which cluster.]

**Cons of spanMetricsMulti vs. single preset:** [3-4 short bullets — cross-service aggregation
breakage, onboarding classification overhead, IaC/Terraform maintenance multiplication, tail
buckets usually needed everywhere anyway so cardinality savings don't materialize]. Only skip this
section if the customer has fewer than ~5 services sampled (not enough data to assess heterogeneity).

**Recommendation:** [one line — single unified preset unless a genuinely bimodal fleet was found].

---

## Worked example (Tango.me, Coralogix US3, vs. Datadog)

Current buckets (14): 0.0005, 1, 5, 10, 25, 50, 75, 100, 200, 500, 750, 1000, 2000, 5000 ms — live
data shows 2 blind spots: ~65-80% of traffic sits in the unresolved 0.0005–1ms gap, and p99 for
several services sits unresolved in the 200–500ms gap.

Matching Datadog's percentiles: Datadog doesn't use fixed-bucket histograms for
`trace.<service>.duration` at all — it uses DDSketch, a relative-error quantile sketch. That means
DD's p95/p99 have a roughly constant relative error (~1-2%) no matter where in the range the value
falls, because DDSketch bins logarithmically. Coralogix's OTel `spanmetrics` connector uses classic
Prometheus-style fixed buckets, so we can't replicate DDSketch exactly — but we can replicate its
behavior: give every bucket roughly the same relative width (e.g., ~2x from one boundary to the
next) instead of the current ad-hoc mix of 5x, 10x, and one 2000x jump. That's what makes
Coralogix's `histogram_quantile` output converge toward what Datadog reports, rather than diverging
in exactly the widest gaps (which is what's happening today at p50 and p99).

VictoriaMetrics histogram principle: Valyala's article's core point: ad-hoc linear buckets rot over
time (ranges drift, gaps appear) and cause bad `histogram_quantile` estimates exactly where the
gaps are — which is precisely Problem A (the biggest bucket gap sits exactly where most of the
traffic is) and B (the tail has a 300ms blind spot exactly where p99 lives). His fix is a fixed
geometric progression (VM uses 18 buckets/decade at a 1.136x multiplier) so relative error stays
bounded everywhere and cross-service aggregation works, since every service shares the same
boundaries. We don't need 18-per-decade granularity for APM, but the same principle — consistent
~2x steps, no outlier gaps — is exactly what fixes both problems above (A & B) while keeping
bucket count flat.

Proposed bucket set (14 buckets — same cardinality as today):
```yaml
histogram:
  explicit:
    buckets:
      - 0.5ms
      - 1ms
      - 2.5ms
      - 5ms
      - 10ms
      - 25ms
      - 50ms
      - 100ms   # Apdex T=100ms
      - 200ms   # Apdex T=200ms
      - 400ms   # Apdex 4×100ms
      - 500ms   # Apdex T=500ms
      - 800ms   # Apdex 4×200ms
      - 2000ms  # Apdex 4×500ms
      - 5000ms  # tail / timeout catch-all
```
Why it covers everything: fills the sub-1ms deadzone (0.5, 2.5ms) → fixes p50 resolution; keeps
~2x step ratio throughout → bounded relative error like DD's DDSketch; contains all 3 Apdex T/4T
pairs; fills the 200–500ms gap (400/800ms) → fixes p99 resolution; no bucket count increase → no
added cost.

Per-service latency profile (live, 1h):

| service | <1ms | p50 | p75 | p95 | p99 |
|---|---|---|---|---|---|
| stream | 79.7% | 0.63ms | 0.94ms | 4.9ms | 455ms |
| stream-kafka | 85.1% | 0.59ms | 0.88ms | 6.5ms | 583ms |
| streammanager | 61.7% | 0.81ms | 2.5ms | 4.7ms | 9.4ms |
| richfragment | 63.9% | 0.78ms | 2.3ms | 4.6ms | 5.7ms |
| acme | 63.8% | 0.78ms | 2.3ms | 4.6ms | 8.0ms |
| tcnnruleengine | 60.3% | 0.83ms | 3.1ms | 142ms | 407ms |
| pusher | 64.3% | 0.78ms | 20ms | 48ms | 124ms |
| chat-delivery | 52.0% | 0.96ms | 44ms | 158ms | 192ms |

Three shapes: fast & tight (streammanager/richfragment/acme), fast with rare heavy tail
(stream/stream-kafka — p99 spikes to 400-600ms despite fast p95), uniformly slower
(pusher/chat-delivery/tcnnruleengine — climbs from p75).

Cons of spanMetricsMulti vs. single preset: breaks cross-service `histogram_quantile` aggregation
(dashboards/SLO templates/alert templates); adds a service→bucket-group classification step for
every onboarding; multiplies Terraform maintenance (already tracking ~450 services + BUGV2-6584);
tail buckets are needed by nearly every service anyway, so cardinality savings don't really
materialize.

Recommendation: single unified preset (the 14-bucket set above). No spanMetricsMulti — the
tail-resolution need is universal, not segment-specific, so the trade-off doesn't pay off at
Tango's scale.
