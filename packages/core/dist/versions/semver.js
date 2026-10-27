export function parseVersion(v) { return v.replace(/^v/, '').split(/[.-]/).slice(0, 3).map((x) => parseInt(x, 10) || 0); }
export function compareVersions(a, b) { const A = parseVersion(a), B = parseVersion(b); for (let i = 0; i < 3; i++)
    if ((A[i] ?? 0) !== (B[i] ?? 0))
        return (A[i] ?? 0) - (B[i] ?? 0); return 0; }
export const inRange = (v, fromExclusive, toInclusive) => compareVersions(v, fromExclusive) > 0 && compareVersions(v, toInclusive) <= 0;
//# sourceMappingURL=semver.js.map