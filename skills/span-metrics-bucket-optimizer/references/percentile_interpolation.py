"""
Reusable percentile-interpolation helper for span-metrics-bucket-optimizer.

Given a Coralogix Metrics API result for `sum by (le) (duration_ms_bucket{service_name="..."})`,
compute p50/p75/p90/p95/p99 the same way PromQL's histogram_quantile does (linear interpolation
between the bucket boundary below the target and the bucket boundary at/above it).

Usage pattern (adapt the query/service loop to the customer's actual metric name and label,
per SKILL.md Step 2):

    import requests

    headers = {"Authorization": f"Bearer {api_key}"}
    base = f"https://api.{region}.coralogix.com/metrics/api/v1/query"

    def fetch_buckets(service_name, metric="duration_ms_bucket", label="service_name"):
        q = f'sum by (le) ({metric}{{{label}="{service_name}"}})'
        r = requests.get(base, headers=headers, params={"query": q}, timeout=25)
        r.raise_for_status()
        data = r.json()["data"]["result"]
        return {item["metric"]["le"]: float(item["value"][1]) for item in data}

    buckets = fetch_buckets("my-service")
    for q in (0.50, 0.75, 0.90, 0.95, 0.99):
        print(q, pct(buckets, q))
"""


def pct(buckets: dict, q: float) -> float:
    """
    buckets: dict mapping le-string -> cumulative count (must include "+Inf").
    q: target quantile, e.g. 0.95 for p95.
    Returns the interpolated boundary value in whatever unit the buckets are in (ms, s, etc).
    """
    items = sorted(
        ((float(le), v) for le, v in buckets.items() if le != "+Inf"),
        key=lambda x: x[0],
    )
    total = buckets["+Inf"]
    if total <= 0:
        raise ValueError("no samples in this histogram — check the query/label filter")
    target = q * total
    prev_le, prev_v = 0.0, 0.0
    for le, v in items:
        if v >= target:
            if v == prev_v:
                return le
            frac = (target - prev_v) / (v - prev_v)
            return prev_le + frac * (le - prev_le)
        prev_le, prev_v = le, v
    return items[-1][0]


def fraction_under(buckets: dict, boundary: float) -> float:
    """
    Fraction of total traffic at or under a given boundary value (e.g. fraction_under(buckets, 1.0)
    for "% of traffic under 1ms"). Useful for quickly spotting a deadzone: if the smallest non-zero
    boundary already captures 60-80% of traffic, that's the blind-spot signal from SKILL.md Step 3.
    """
    total = buckets["+Inf"]
    if total <= 0:
        return 0.0
    items = sorted(
        ((float(le), v) for le, v in buckets.items() if le != "+Inf"),
        key=lambda x: x[0],
    )
    for le, v in items:
        if le >= boundary:
            return v / total
    return 1.0


def summarize_service(name: str, buckets: dict) -> dict:
    """Convenience wrapper producing the row used in the per-service latency table."""
    smallest_boundary = min(float(le) for le in buckets if le != "+Inf")
    return {
        "service": name,
        f"<{smallest_boundary:g}": f"{fraction_under(buckets, smallest_boundary) * 100:.1f}%",
        "p50": pct(buckets, 0.50),
        "p75": pct(buckets, 0.75),
        "p90": pct(buckets, 0.90),
        "p95": pct(buckets, 0.95),
        "p99": pct(buckets, 0.99),
    }
