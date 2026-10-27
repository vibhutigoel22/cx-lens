# Vendor percentile mechanisms — read the relevant section only

Each APM vendor computes p50/p95/p99 differently. Getting this right matters because the
"match [vendor]'s percentiles" analysis lens (Step 4.2 of SKILL.md) should state the *correct*
mechanism for the customer's actual vendor — don't default to the Datadog/DDSketch explanation
for a different vendor.

## Datadog

`trace.<service>.duration` and APM latency percentiles are **not** computed from fixed-bucket
histograms at all. Datadog uses **DDSketch**, a mergeable quantile sketch with a *relative*-error
guarantee (typically ~1-2%) — the sketch bins values logarithmically, so accuracy is roughly
constant whether you're looking at p50 or p99.99, unlike fixed Prometheus-style buckets where
accuracy depends entirely on how wide the bucket is at that point in the range.

**Design implication for Coralogix buckets:** we can't replicate DDSketch exactly with explicit
buckets, but we can replicate its *behavior* — give every bucket boundary roughly the same
relative width (a consistent step ratio, e.g. ~2x) instead of an ad-hoc mix of narrow and huge
gaps. That converges `histogram_quantile` output toward what Datadog reports, rather than
diverging specifically in the widest gaps.

## New Relic

NRQL `percentile()` (rolled out July 2020) also uses a **logarithmic-scale, equal-width histogram**
— conceptually the same family as DDSketch. It guarantees ~3% relative error for any percentile
(0–100%) as long as the data's contrast ratio (max/min non-zero value) is within roughly
1,000–1,000,000x, which covers essentially all latency data. Distribution metric type in New Relic
uses the same algorithm.

**Design implication:** identical to Datadog's — aim for consistent relative bucket width
(~2x steps). The "match New Relic" and "match Datadog" write-ups are structurally the same
paragraph, just naming a different vendor and algorithm.

## Splunk Observability Cloud (SignalFx)

Splunk APM Monitoring MetricSets are **explicit fixed-bucket histograms** — the same mechanism
family as Coralogix/Prometheus classic histograms. `histogram_percentile()` in SignalFlow computes
percentiles via **linear interpolation between bucket boundaries**, exactly like PromQL's
`histogram_quantile`. Splunk currently supports only explicit bucket histograms (no
sketch/exponential equivalent as of this writing).

**Design implication — this is the one case where the DDSketch-style "geometric spacing" argument
does NOT directly apply the same way.** Since Splunk uses the identical linear-interpolation
mechanism as Coralogix, the strongest "match Splunk" lever isn't relative-error theory — it's
**literally aligning bucket boundary values** where Splunk's own bucket edges are known/configurable,
since both systems interpolate the same way and will agree exactly at shared boundaries. If Splunk's
bucket boundaries aren't known, fall back to the same VM geometric-spacing principle (Step 4.4) as
the next-best general-purpose fix, but don't claim it replicates a Splunk-specific mechanism the way
it does for Datadog/New Relic.

## Grafana Labs (Mimir / Prometheus-native)

Two cases:
- **Classic histograms** (explicit buckets, `_bucket`/`_sum`/`_count` series): identical mechanism
  to Coralogix's own OTel spanmetrics histograms — `histogram_quantile` with linear interpolation.
  There is no "matching" gap here; if the customer is comparing Coralogix to their own
  Prometheus/Mimir classic histograms, the fix is purely the VM geometric-spacing principle
  (Step 4.4), same as always.
- **Native histograms** (exponential schema, opt-in in Mimir/Prometheus 3.x+): buckets are
  generated automatically on a power-of-two exponential schema (schema -4 to +8; higher = finer
  resolution), and `histogram_quantile` uses **exponential interpolation** for these (linear only
  for the zero-bucket). This is functionally very close to what VM's own histogram library does
  and to DDSketch's logarithmic binning — same "constant relative error" property.

**Design implication:** if the customer has migrated to Mimir native histograms, note that they've
effectively already solved this problem on their own side — frame the Coralogix-side fix as
"bringing our explicit buckets to the same constant-relative-error property your native histograms
already have," which is a more accurate and more persuasive framing than comparing to Datadog.

## Dynatrace

Dynatrace's response-time percentiles are computed server-side from full-fidelity trace/span data
(not client-side fixed buckets), broadly similar in spirit to a sketch-based approach, but the
exact algorithm isn't publicly documented in the same detail as DDSketch. **Don't assert a specific
mechanism with confidence** — search Dynatrace's current documentation before writing the internal
lens if a customer names Dynatrace as the comparison vendor, and if nothing authoritative turns up,
state the general principle (server-side computation on high-fidelity data, not fixed buckets) with
appropriate hedging rather than inventing algorithm specifics.

## No vendor / Coralogix-only

If the customer isn't comparing against any external APM vendor, skip lens 4.2 entirely — say so
explicitly in the internal summary ("no vendor-parity requirement — skipping percentile-matching
analysis") rather than silently omitting it, so it's clear this wasn't an oversight. The VM
histogram-usability lens (4.4) still always applies regardless.
