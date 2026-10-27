export function diffLines(a, b) {
    const A = a.split('\n'), B = b.split('\n');
    const n = A.length, m = B.length;
    const W = m + 1;
    const dp = new Uint32Array((n + 1) * W);
    for (let i = n - 1; i >= 0; i--)
        for (let j = m - 1; j >= 0; j--)
            dp[i * W + j] = A[i] === B[j] ? dp[(i + 1) * W + j + 1] + 1 : Math.max(dp[(i + 1) * W + j], dp[i * W + j + 1]);
    const rows = [];
    let i = 0, j = 0;
    while (i < n && j < m) {
        if (A[i] === B[j]) {
            rows.push({ kind: 'same', left: A[i], right: B[j], ln: i + 1, rn: j + 1 });
            i++;
            j++;
        }
        else if (dp[(i + 1) * W + j] >= dp[i * W + j + 1]) {
            rows.push({ kind: 'del', left: A[i], ln: i + 1 });
            i++;
        }
        else {
            rows.push({ kind: 'add', right: B[j], rn: j + 1 });
            j++;
        }
    }
    while (i < n) {
        rows.push({ kind: 'del', left: A[i], ln: i + 1 });
        i++;
    }
    while (j < m) {
        rows.push({ kind: 'add', right: B[j], rn: j + 1 });
        j++;
    }
    return rows;
}
export function unifiedDiff(a, b, aName = 'original.yaml', bName = 'updated.yaml', ctx = 3) {
    const rows = diffLines(a, b);
    const out = [`--- ${aName}`, `+++ ${bName}`];
    const changed = rows.map((r, k) => (r.kind !== 'same' ? k : -1)).filter((k) => k >= 0);
    if (!changed.length)
        return out.join('\n') + '\n';
    let k = 0;
    while (k < changed.length) {
        let start = Math.max(0, changed[k] - ctx), end = Math.min(rows.length - 1, changed[k] + ctx);
        while (k + 1 < changed.length && changed[k + 1] - ctx <= end + 1) {
            k++;
            end = Math.min(rows.length - 1, changed[k] + ctx);
        }
        const hunk = rows.slice(start, end + 1);
        const l0 = hunk.find((r) => r.ln)?.ln ?? 1, r0 = hunk.find((r) => r.rn)?.rn ?? 1;
        out.push(`@@ -${l0},${hunk.filter((r) => r.kind !== 'add').length} +${r0},${hunk.filter((r) => r.kind !== 'del').length} @@`);
        for (const r of hunk)
            out.push(r.kind === 'same' ? ` ${r.left}` : r.kind === 'del' ? `-${r.left}` : `+${r.right}`);
        k++;
    }
    return out.join('\n') + '\n';
}
//# sourceMappingURL=diff.js.map