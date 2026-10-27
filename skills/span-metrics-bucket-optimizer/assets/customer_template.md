# Customer-facing message template

No markup beyond what's shown (plain text, Slack-paste-ready). No mention of spanMetricsMulti.
Avoid vendor-mechanism jargon (DDSketch, sketch algorithm names, etc.) unless the customer's own
team has already used that vocabulary in prior conversation — describe *behavior*, not algorithm
names, by default.

---

Hi team, following up on the histogram bucket discussion — here's our final recommendation.

We analyzed real span latency data across your top services alongside your Apdex thresholds,
[Vendor] comparison goals, and general histogram best practices, and put together an updated
bucket set that improves accuracy without increasing your metric costs ([same/fewer] number of
buckets than today):

[comma-separated proposed bucket list, plain values]

One thing worth understanding on the [Vendor] comparison: [plain-language description of how
Vendor computes percentiles, translated from references/vendor-percentile-methods.md — behavior
only, e.g. "doesn't actually use fixed buckets... stays roughly equally accurate no matter how
large or small the value is"]. Our OTel-based histogram buckets can't replicate that exactly, but
by spacing every bucket boundary about 2x apart instead of the uneven jumps in the current setup,
we get much closer to matching what [Vendor] reports at every percentile, instead of drifting
apart specifically at the widest gaps — which is what's happening today.

[If relevant/available: a short plain-language paragraph on the general histogram-bucket-spacing
principle — ad-hoc buckets create gaps that get worse over time as traffic patterns shift; a
consistent step size keeps every percentile estimate reliable and lets buckets be compared across
services.]

Why this is better than the current set:
- [bullet: resolves lower-range deadzone]
- [bullet: closes tail-percentile gap]
- [bullet: Apdex threshold + 4x-threshold coverage, if applicable]
- [bullet: no added metrics cost, if cardinality unchanged]

We'd recommend deploying this across all clusters and re-validating the latency alerts and Apdex
scores against it afterward. Let us know if you'd like to schedule that rollout.

---

## Worked example (Tango.me, vs. Datadog)

Hi team, following up on the histogram bucket discussion — here's our final recommendation.

We analyzed real span latency data across your top services alongside your Apdex thresholds,
Datadog comparison goals and general histogram best practices, and put together an updated bucket
set that improves accuracy without increasing your metric costs (same number of buckets as today):

0.5ms, 1ms, 2.5ms, 5ms, 10ms, 25ms, 50ms, 100ms, 200ms, 400ms, 500ms, 800ms, 2000ms, 5000ms

One thing worth understanding on the Datadog comparison: Datadog doesn't actually use fixed
buckets to calculate its p95/p99 — it uses a sketch-based method that stays roughly equally
accurate no matter how large or small the latency value is. Our OTel-based histogram buckets can't
replicate that exactly, but by spacing every bucket boundary about 2x apart instead of the uneven
jumps in the current setup, we get much closer to matching what Datadog reports at every
percentile, instead of drifting apart specifically at the widest gaps — which is what's happening
today.

It's the same idea behind a general histogram best-practice we followed here: ad-hoc bucket
spacing tends to work fine at first, then rot over time as traffic patterns shift and gaps open up
in exactly the ranges that matter most. Keeping a consistent spacing between every boundary avoids
that drift and also means the buckets stay comparable across all your services.

Why this is better than the current set:
- Adds resolution below 1ms, where the majority of your fast calls live — the current setup has
  no visibility there.
- Adds a 400ms and 800ms boundary, closing a gap that was hiding your p99 latency for several
  services.
- Includes both your Apdex threshold and 4x-threshold values (100/200/500ms and their 4x
  equivalents), so Apdex scoring will be accurate.
- Keeps the same bucket count as today, so no added metrics cost.

We'd recommend deploying this across all clusters and re-validating the latency alerts and Apdex
scores against it afterward. Let us know if you'd like to schedule that rollout.
