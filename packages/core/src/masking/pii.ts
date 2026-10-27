/** Mask PII and secrets before anything is sent to an AI tool. Returns the exact text that will be sent. */
const RULES: [string, RegExp, string][] = [
  ['coralogix-keys', /\bcx[a-z]{1,3}_[A-Za-z0-9]{16,}\b/g, '<CX_KEY>'],
  ['jwt', /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g, '<JWT>'],
  ['bearer', /\b(Bearer|Basic)\s+[A-Za-z0-9\-._~+/]+=*/gi, '$1 <TOKEN>'],
  ['aws-keys', /\b(AKIA|ASIA)[A-Z0-9]{16}\b/g, '<AWS_KEY>'],
  ['secrets', /("?(?:password|passwd|secret|api[_-]?key|token|authorization)"?\s*[:=]\s*)"?[^",\s}]+"?/gi, '$1"<SECRET>"'],
  ['emails', /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '<EMAIL>'],
  ['ipv4', /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '<IP>'],
  ['ipv6', /\b(?:[0-9a-fA-F]{1,4}:){4,7}[0-9a-fA-F]{1,4}\b/g, '<IP>'],
  ['aws-account', /\b\d{12}\b/g, '<ACCOUNT_ID>'],
];
function luhn(s: string) { let sum = 0, alt = false; for (let i = s.length - 1; i >= 0; i--) { let n = +s[i]; if (alt) { n *= 2; if (n > 9) n -= 9; } sum += n; alt = !alt; } return sum % 10 === 0; }

export function maskText(raw: unknown): { masked: string; counts: Record<string, number> } {
  const input = typeof raw === 'string' ? raw : raw == null ? '' : String(raw);
  const counts: Record<string, number> = {};
  let out = input.replace(/\b(?:\d[ -]?){13,19}\b/g, (m) => { const d = m.replace(/\D/g, ''); if (d.length >= 13 && luhn(d)) { counts['card-numbers'] = (counts['card-numbers'] ?? 0) + 1; return '<CARD>'; } return m; });
  for (const [name, re, rep] of RULES) out = out.replace(re, (...args) => { counts[name] = (counts[name] ?? 0) + 1; return rep.replace('$1', String(args[1] ?? '')); });
  return { masked: out, counts };
}
