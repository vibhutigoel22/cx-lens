---
name: span-metrics-bucket-optimizer
description: "Use this skill whenever a Coralogix customer/team needs their OTel spanmetrics histogram buckets analyzed or optimized — triggers include \"optimize buckets\", \"histogram buckets\", \"spanmetrics\", \"bucket configuration\", \"latency distribution analysis\", \"match Datadog/New Relic/Splunk/Grafana percentiles\", \"Apdex settings\", or \"should we use spanMetricsMulti\". Always use this skill for these requests even if the customer, vendor being compared against (Datadog, New Relic, Splunk, Grafana Labs/Mimir, Dynatrace, etc.), or Coralogix domain/region differs from prior runs — the workflow and output format are meant to be reused verbatim across customers. Produces two deliverables every time: an internal analysis summary and a customer-ready Slack message."
---

# Span Metrics Bucket Optimizer

Analyzes a customer's live OTel `spanmetrics` histogram configuration against their actual latency distribution, their APM vendor-of-comparison's percentile methodology, their Apdex thresholds, and the VictoriaMetrics histogram-usability principles — then proposes a minimal-cardinality bucket set and writes up both an internal summary and a customer-facing Slack message.

This skill is vendor-agnostic and team-agnostic. Every run needs three customer-specific inputs (gathered in Step 0) and otherwise follows the same fixed analytical framework.

## Step 0 — Gather run-specific inputs

Before starting, confirm (ask if not already given in the conversation):

1. **Coralogix team/domain** — e.g. `tangome-production.app.us3.coralogix.com`. Derive the API base as `https://api.<region>.coralogix.com` (e.g. `us3`, `eu1`, `eu2`, `ap1`, `ap2`). If unsure of the region code, ask or check the domain the customer gave you.
2. **API key** — a `cxup_...` key scoped for `metrics.data-api#high:ReadData` (Query Metrics permission preset). Test it early (Step 2) — if every query returns `outputRowCount: 0` or 500s, the key likely lacks Metrics API scope; say so rather than assuming there's no data.
3. **Vendor being compared against** — Datadog, New Relic, Splunk (Observability Cloud / SignalFx), Grafana Labs (Mimir/Prometheus-native), Dynatrace, or "none / Coralogix-only". Read `references/vendor-percentile-methods.md` for the relevant section — **do not assume DDSketch-style behavior applies to a non-Datadog vendor.** Each vendor has a genuinely different percentile mechanism and the write-up must reflect the right one.
4. Any customer-supplied Slack thread / doc with prior bucket-change history (optional but useful for Step 1).

If any of #1–#3 wasn't already provided, ask a single consolidated question before proceeding — don't guess a Coralogix region or assume a vendor.

## Step 1 — Read prior context (if available)

If the customer has a Slack thread, ticket, or doc discussing prior bucket changes, read it (via whatever tool is available — Slack MCP, web_fetch, uploaded doc). Extract:
- The currently-deployed bucket list (exact values + units)
- Any Apdex threshold(s) already in use or requested
- Any stated cardinality/cost constraints (customers frequently push back on bucket count — note this explicitly, it constrains the final answer to "same or fewer buckets than today")
- Any known problem reports (e.g. "alert shows spike but APM shows decrease" — this is a classic symptom of a bucket gap swallowing a percentile; keep an eye out for it)

## Step 2 — Pull the live bucket configuration and latency distribution

Use the Coralogix Metrics API (PromQL-compatible):
```
GET https://api.<region>.coralogix.com/metrics/api/v1/query?query=<PromQL>
Header: Authorization: Bearer <cx_api_key>
```

**2a. Discover the histogram metric name.** Span-metrics-connector histograms are usually named `duration_ms_bucket` (or `calls_duration_seconds_bucket`, `duration_seconds_bucket`, `compact_duration_ms_bucket` for compact span metric). If unsure, list metric names and grep for `duration`/`bucket`:
```
GET /metrics/api/v1/label/__name__/values
```

**2b. Find the top-volume services** (don't try to pull every service — cardinality will time out):
```
topk(8, sum by (service_name) (duration_ms_count))
```
8 services is a good default sample size; adjust up if the customer has few services or down if queries are timing out.

**2c. Pull the bucket histogram per service.** Always scope by `service_name` (or equivalent label) — an unscoped `duration_ms_bucket` query across a real customer's full label cardinality will time out or 500. Use a client-side timeout (~20-25s) and retry narrower if it fails:
```
sum by (le) (duration_ms_bucket{service_name="<svc>"})
```
This returns the **live deployed bucket boundaries** directly — don't assume you already know them from a prior doc; the config may have drifted (this happened in the Tango case: reply-thread proposal ≠ deployed state).

**2d. Compute percentiles per service.** From the cumulative bucket counts, interpolate p50/p75/p90/p95/p99 the same way `histogram_quantile` does (linear interpolation between the bucket below and at the target count). Script this in Python — see `references/percentile_interpolation.py` for the exact function to reuse. Also compute `% of traffic under smallest non-zero bucket` — this is the fastest way to spot the "biggest chunk of traffic sits in one unresolved bucket" problem.

## Step 3 — Diagnose the current bucket set

From the per-service percentile table, identify:
- **Blind spots**: any percentile boundary (p50/p95/p99) that falls inside a wide bucket gap with no boundary nearby. Call out the specific gap width (e.g. "2000x gap between 0.0005ms and 1ms").
- **Service shape clusters**: group services into archetypes — typically 3 show up:
  - *fast & tight* (all percentiles low, tight spread)
  - *fast with rare heavy tail* (p50–p95 low, p99 spikes — usually a downstream dependency)
  - *uniformly slower* (latency climbs steadily from p75 onward)
  This clustering directly feeds the spanMetricsMulti question in Step 5.

## Step 4 — Apply the four analytical lenses

Always cover all four, in this order, using the customer's real numbers from Step 2/3:

1. **Distribution vs. current buckets** — the blind-spot findings from Step 3.
2. **Matching the comparison vendor's percentiles** — pull the correct mechanism from `references/vendor-percentile-methods.md` for whichever vendor was named in Step 0. State the mechanism, then translate it into a bucket-design principle (for DDSketch-style vendors this is "~constant relative bucket width"; other vendors differ — read the reference file, don't default to the DDSketch explanation for a non-Datadog vendor).
3. **Apdex support** (if applicable) — every Apdex threshold T in use must have both T and 4×T as explicit bucket boundaries. List each T→4T pair required.
4. **VictoriaMetrics histogram-usability principle** — always include regardless of vendor (this is about Prometheus-style histogram mechanics, not the comparison vendor). Core points to hit: (a) ad-hoc linear buckets rot as traffic patterns drift and create blind gaps over time, (b) incompatible bucket sets across services/label combos break `histogram_quantile` aggregation (`sum(rate(...)) by (le)` across mismatched buckets returns garbage), (c) the fix is a consistent geometric step ratio (VM's own implementation uses 18 buckets/decade at a 1.136x multiplier; for a curated APM set, ~2x steps is the practical equivalent) so relative error stays bounded everywhere without needing dozens of buckets.

## Step 5 — Decide single preset vs. spanMetricsMulti

Compute this every time the customer has ≥5-6 services sampled; skip only if trivially small.

Check: does the tail-resolution requirement (Apdex 4T boundaries + any p99 blind spot) apply to services that otherwise look "fast" (the *fast-with-rare-heavy-tail* cluster from Step 3)? In every case observed so far, yes — meaning a single unified bucket set already has to span the full range for every service, and per-service bucket sets mostly can't drop the tail buckets without losing real signal.

Default recommendation is **single unified preset**, with these cons of `spanMetricsMulti` (state briefly, don't over-elaborate):
- Breaks cross-service `histogram_quantile` aggregation for any dashboard/SLO/alert template not scoped to one bucket-group (this is literally the VM article's Issue #3).
- Adds a service→bucket-group classification step to onboarding; misclassification reproduces the same blind-spot problem being fixed.
- Multiplies Terraform/IaC maintenance surface across bucket-groups on top of the customer's existing per-service alert/SLO management.
- Tail buckets are usually needed by nearly every service anyway, so the promised cardinality savings rarely materialize.

Only recommend `spanMetricsMulti` if the customer has a genuinely bimodal fleet where one whole cluster never needs tail buckets at all (rare) or has an explicit, already-stated cost driver that a single preset can't satisfy.

## Step 6 — Build the proposed bucket set

Rules, in priority order:
1. **Cardinality ceiling** = current bucket count (never propose more buckets than today unless the customer explicitly says cost isn't a constraint).
2. Include every Apdex T and 4×T value in use.
3. Fill any blind spot identified in Step 3 (typically: add 1-2 buckets low in the range to resolve the sub-1ms/sub-1-unit deadzone, add 1-2 buckets to close the widest mid/tail gap that swallows p99).
4. Keep consecutive-bucket step ratio roughly consistent (~2x is a good default) across the whole set — drop buckets that are redundant once the Apdex-driven and gap-filling buckets are in place (do the ratio math to check adjacent steps aren't >2.5-3x apart anywhere, except right at the very bottom or very top of the range).
5. Present as the actual OTel collector config block that would deploy it, e.g.:
```yaml
histogram:
  explicit:
    buckets:
      - <value>ms   # <reason: apdex T / apdex 4T / gap-fill / tail catch-all>
      ...
```

## Step 7 — Write the two deliverables

Always produce **both**, every run, in this order:

### Internal summary
Structure (see `assets/internal_template.md` for the exact skeleton):
1. Current buckets + identified blind spot(s), one line each with the real numbers.
2. "Matching [Vendor]'s percentiles" — the vendor-specific mechanism explanation from Step 4.2, 3-5 sentences.
3. "VictoriaMetrics histogram principle" — the Step 4.4 explanation, 3-5 sentences, explicitly tie it back to the same blind-spot problems named in point 1.
4. Proposed bucket set YAML + one-line-per-bucket-group rationale (not one line per bucket — group by "fills deadzone", "apdex pairs", "closes tail gap", "unchanged cardinality").
5. Per-service latency table + 3-shape clustering summary (short).
6. spanMetricsMulti cons (short bullet list) + recommendation (one line).

Keep this tight — bullet points and short paragraphs, not prose essays. This is for Mark/internal team consumption, not the customer.

### Customer-facing message
Structure (see `assets/customer_template.md`):
1. One-line framing ("following up on X — here's our recommendation").
2. The proposed bucket list (plain values, no YAML/internal jargon).
3. The vendor-percentile explanation in plain language — no "DDSketch"/mechanism-internals jargon unless the customer's own team clearly uses that vocabulary already (check the prior Slack thread from Step 1). Explain the *behavior* ("stays roughly equally accurate at any latency value") not the algorithm name, unless the customer is Datadog-savvy enough that naming it aids credibility.
4. The VictoriaMetrics principle in plain language — same rule, avoid internals unless the audience is technical (check Step 1 context for signals, e.g. if they've referenced PromQL/histogram_quantile themselves already).
5. Bullet list: "why this is better than the current set" — always include the "no added metric cost" point if cardinality is unchanged.
6. One-line next-step ask (deploy + re-validate alerts/Apdex).

**Never mention spanMetricsMulti to the customer** — that's an internal architectural decision, not something to surface externally unless they explicitly asked about it.

## Notes on reuse across customers

- Every number in both deliverables must come from that customer's actual Step 2 query results — never carry over a prior customer's percentiles, service names, or bucket values.
- The four analytical lenses (Step 4) and the VM principle are structurally fixed across runs; only the vendor-specific lens (4.2) and all the numbers change.
- If the customer has no APM vendor to compare against (Coralogix-only, or migrating away from all vendors), skip lens 4.2 entirely rather than forcing a comparison — say so explicitly in the internal summary ("no vendor-parity requirement — skipping percentile-matching analysis") so it's clear it wasn't missed.
- If a customer-provided screenshot/table of live data is pasted into the conversation instead of you querying it yourself (e.g. no API key given), use those numbers as-is but flag in the internal summary that they weren't independently queried.
