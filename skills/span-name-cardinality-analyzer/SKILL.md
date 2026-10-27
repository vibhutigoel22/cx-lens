---
name: span-name-cardinality-analyzer
description: >
  Use this skill whenever a Coralogix customer/team needs their live `span_name` cardinality on
  spanmetrics (calls_total / db_calls_total / compact_calls_total / etc.) analyzed to find which
  URL/path/query patterns are driving span metric cost. Triggers include "span_name cardinality",
  "analyze span names", "spanMetrics optimization", "reduce span metric cost", "high cardinality
  span_name", "find dynamic IDs in span names", or a request to produce span-name sanitization
  regex/OTTL patterns for a customer's values.yaml. Always use this skill even if the customer,
  Coralogix region (eu1/eu2/us3/ap1/ap2), or account differs from prior runs — the workflow and
  two-deliverable output format are meant to be reused verbatim across customers. Produces an
  internal findings table (source / unique span_names / % of total / example) plus a ready-to-send
  customer message with the OTTL config snippet and exact pipeline insertion point.
---

# Span Name Cardinality Analyzer

Finds which URL paths / span-name shapes are driving `span_name` label cardinality on a customer's
live spanmetrics, and produces the OTTL `replace_pattern` statements (plus exact pipeline
placement) to fix it. Vendor/team-agnostic — every run needs the customer's Coralogix
team/domain and API key; everything else follows the same fixed workflow.

**Hard rule carried over from a prior incident (Papaya):** never reuse another customer's regex
patterns. A customer correctly pushed back when we proposed patterns lifted from a different
division ("this service doesn't even exist in our division"). Every pattern in the output must be
derived from *this* customer's own queried span_name values, not copied from a previous run of
this skill.

## Step 0 — Gather run-specific inputs

Ask for these if not already given (single consolidated question):

1. **Coralogix team/domain**, e.g. `tangome-production.app.us3.coralogix.com`. Derive the region
   code from the domain (`us3`, `eu1`, `eu2`, `ap1`, `ap2`) and build the API base as
   `https://ng-api-http.<region>.coralogix.com/metrics/api/v1/query`.
2. **API key** (`cxup_...`) scoped for Metrics API read access. Test it immediately with a trivial
   query (Step 1) — if every query 500s or returns empty with no obvious reason, say the key likely
   lacks Metrics API scope rather than assuming there's no data.
3. Optionally: a prior Slack thread / doc with earlier sanitization attempts for this customer or
   a sibling division — useful context, but never copy its regex values verbatim (see hard rule
   above).

## Step 1 — Confirm connectivity and find the right metric(s)

```bash
curl -s --location --request POST 'https://ng-api-http.<region>.coralogix.com/metrics/api/v1/query' \
  --header 'Authorization: Bearer <API_KEY>' \
  --data-urlencode 'query=count by (__name__) ({__name__=~"calls_total|db_calls_total|compact_calls_total|db_compact_calls_total"})'
```

Spanmetrics-connector metric names follow the connector's `namespace` config: no namespace →
`calls_total`; `namespace: db` → `db_calls_total`; `namespace: compact` → `compact_calls_total`;
etc. If these names don't return data, list `__name__` values matching `.*calls.*` or
`.*duration.*` to find the customer's actual naming. Don't assume — the customer's config may
differ from every prior run.

## Step 2 — Measure total span_name cardinality per metric

For each `*_calls_total` metric found in Step 1:

```
count(count by (span_name) (<metric_name>))
```

Run this for all of them, not just the main one — connectors that used `exclude_dimensions:
[span.name]` (common on "compact" style connectors) will correctly show cardinality 1; that's a
sanity check, not a bug. Focus the rest of the analysis on whichever metric(s) show real
cardinality (typically the main, non-namespaced connector).

## Step 3 — Sample the distribution to find pattern categories

Pull both ends of the distribution — high-volume span_names AND the rare, one-off long tail. The
long tail is usually where the real cardinality driver hides (a single endpoint pattern generating
one span_name per request):

```
topk(100, count by (span_name) (<metric_name>))
bottomk(60, count by (span_name) (<metric_name>))
```

Eyeball the `bottomk` output for shapes like: random alphanumeric IDs after a fixed path prefix,
UUID/base64url tokens, hex-pair "shard" directories (`/xx/yy/`), or literal sharded SQL table
names (`comment_01_00`, `feed_05_00`). These are the categories to quantify next.

**Gotcha — bash brace expansion breaks regex quantifiers.** If you write `{3,}` or `{8}` inline in
a double-quoted curl command, bash's brace expansion mangles it before curl ever sees it (e.g.
`{3,}` silently becomes `3` + empty string). Either escape as `\{3,\}` or avoid quantifier braces
entirely by repeating the character class manually (e.g. `[0-9][0-9][0-9]+` for "3+ digits"). This
already cost a debugging cycle once — check for it if regex-based counts look implausibly low.

## Step 4 — Quantify each category and build the findings table

For each candidate pattern, get an exact count and compare to the Step 2 total:

```
count(count by (span_name) (<metric_name>{span_name=~"<candidate_regex>"}))
```

Iterate from the biggest suspected driver down. Stop refining once the categories account for
essentially all of the Step 2 total (a residual "other/misc" bucket of a few percent is fine and
should be reported as-is, not force-fit into a pattern).

Produce a table, sorted descending by unique span_name count:

| Source | Unique span_names | % of total | Example |
|---|---|---|---|
| ... | ... | ... | `...` |

## Step 5 — Check where sanitization currently happens in the pipeline

Before writing new regex, read the customer's values.yaml to determine:

- Is `presets.spanMetrics.enabled: true` with a `spanNameReplacePattern` list? → new patterns go
  there.
- Or is sanitization hand-rolled via custom OTTL `transform/*` processors in the traces pipeline
  (as with Tango)? → new patterns go into a new (or existing) `transform/*` processor, and **the
  processor order in `service.pipelines.traces.processors` matters**: if an existing processor
  already masks numeric IDs to a placeholder (e.g. a url-sanitizer or redaction processor turning
  `/12345/` into `/*/`), any new pattern targeting the *already-masked* shape must be inserted
  **after** that processor in the pipeline list, not before — otherwise it never sees the form it
  was written to match. Confirm this by comparing the raw regex target against what the Step 3/4
  query results actually showed (those are always the final, fully-processed span_name).

## Step 6 — Write the OTTL patterns

One `replace_pattern(name, "<regex>", "<replacement>")` statement per category that clears a
meaningful cardinality bar (a good default: categories that are individually >0.1% of total, or
that are cheap/safe catch-alls for future growth). Use capture groups (`$$1`, `$$2` — doubled `$`
if the values.yaml is Helm-templated, matching the customer's existing convention) to preserve any
part of the name worth keeping. Comment each statement with the % it addresses, taken directly
from the Step 4 table — never carry over a percentage from a different customer's run.

Recommend validating each regex at ottl.run against a handful of the real sampled span_names
before deploying.

## Step 7 — Write the two deliverables

### Internal findings summary (for the TAM/SE, not the customer)
1. One line: total span_name cardinality on the main metric, and which metric(s) it came from.
2. The findings table (Step 4).
3. Any risk flags worth surfacing — e.g. if total cardinality is in the same order of magnitude as
   the connector's `aggregation_cardinality_limit`, flag possible silent data drop, not just cost.
4. The OTTL snippet (Step 6) plus exact pipeline insertion point (Step 5).
5. Any categories intentionally left alone (too small, or already handled) and why.

### Customer-facing message (plain text, no markdown — for direct Slack copy-paste)
Keep it short:
1. One-line framing.
2. "Findings" line with the total cardinality number.
3. The table, plain text.
4. The values.yaml snippet, plain text, labeled with exactly which config key it goes under.
5. The pipeline placement, plain text, showing the full processor list with the new entry marked.

Do not add unsolicited commentary about "no changes needed on your side" or cost savings unless
asked — keep to what was requested. Ask the TAM before sending whether they want internal
commentary trimmed further or the message expanded.

## Notes on reuse across customers

- Every number, pattern, and example span_name must come from that customer's own Step 2-4 query
  results.
- The pipeline-placement check (Step 5) must be redone per customer — don't assume the same
  processor architecture (preset-based vs. custom OTTL) as a prior run.
- If the customer has no API key yet, or the key lacks scope, say so explicitly rather than
  guessing at cardinality from screenshots or memory.
