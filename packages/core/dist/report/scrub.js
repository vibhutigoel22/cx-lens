const PATTERNS = [
    ['notion-link', /https?:\/\/(?:app\.|www\.)?notion\.(?:so|com)\/[^\s)"'<]+/gi],
    ['slack-link', /(?:slackMessage:\/\/|https?:\/\/[a-z0-9-]+\.slack\.com\/)[^\s)"'<]+/gi],
    ['gong-link', /https?:\/\/[a-z0-9-]+\.app\.gong\.io\/[^\s)"'<]+/gi],
    ['google-drive', /https?:\/\/(?:drive|docs)\.google\.com\/[^\s)"'<]+/gi],
    ['account-id', /\b\d{12}\b/g],
    ['company-id', /"companyId":\s*\d+/g],
    ['api-key', /\bcx[a-z]{1,3}_[A-Za-z0-9]{16,}\b/g],
    ['team-host', /\b[a-z0-9-]+\.app\.(?:coralogix\.(?:in|us|com)|eu2\.coralogix\.com|coralogixsg\.com|cx498\.coralogix\.com|ap3\.coralogix\.com)\b/gi],
    ['worked-example', /🔶|JFPSL/g],
];
/** Find anything that must not reach a customer. */
export function checkCustomerSafe(text, internalTerms = []) {
    const issues = [];
    for (const [kind, re] of PATTERNS)
        for (const m of text.matchAll(re))
            issues.push({ kind, match: m[0], where: text.slice(Math.max(0, m.index - 30), m.index + m[0].length + 10) });
    for (const t of internalTerms.filter((x) => x.trim().length > 2)) {
        const re = new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        for (const m of text.matchAll(re))
            issues.push({ kind: 'internal-name', match: m[0], where: text.slice(Math.max(0, m.index - 30), m.index + 40) });
    }
    return issues;
}
/** Redact what can be redacted automatically (links, IDs, keys, internal terms). */
export function scrubText(text, internalTerms = []) {
    let out = text;
    for (const [kind, re] of PATTERNS)
        out = out.replace(re, kind === 'worked-example' ? '' : kind === 'account-id' ? '<account>' : kind === 'team-host' ? '<team>.coralogix' : '');
    for (const t of internalTerms.filter((x) => x.trim().length > 2))
        out = out.replace(new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '<internal>');
    return out;
}
export function scrubReport(r, internalTerms = []) {
    // Clean text values only. Running the patterns over serialised JSON corrupted numbers (a value with 12 digits after the
    // decimal point matched the account-ID rule) and could rewrite field names that matched an internal term.
    const walk = (v) => (typeof v === 'string' ? scrubText(v, internalTerms) : Array.isArray(v) ? v.map(walk) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)])) : v);
    return walk(r);
}
//# sourceMappingURL=scrub.js.map