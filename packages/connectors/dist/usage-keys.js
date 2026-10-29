import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { deleteSecret, getSecret, setSecret } from './keychain.js';
const file = () => join(process.env.CXLENS_HOME ?? join(homedir(), '.cxlens'), 'usage-keys.json');
const read = () => { try {
    return existsSync(file()) ? JSON.parse(readFileSync(file(), 'utf8')) : { keys: [], teams: {} };
}
catch {
    return { keys: [], teams: {} };
} };
const write = (i) => { mkdirSync(join(file(), '..'), { recursive: true }); writeFileSync(file(), JSON.stringify(i, null, 2)); };
const account = (id) => `metric-usage:${id}`;
export function listUsageKeys(team) { const i = read(); return { keys: i.keys.map((k) => ({ ...k, teams: Object.entries(i.teams).filter(([, v]) => v === k.id).map(([t]) => t) })), selected: team ? i.teams[team] ?? null : null }; }
export async function addUsageKey(label, secret, team) {
    const i = read();
    const clean = label.trim().slice(0, 80) || 'Metric usage key';
    if (i.keys.some((k) => k.label.toLowerCase() === clean.toLowerCase()))
        throw new Error(`A key named “${clean}” already exists. Choose another name or delete the old one.`);
    const e = { id: randomUUID().slice(0, 8), label: clean, createdAt: new Date().toISOString() };
    await setSecret(account(e.id), secret);
    i.keys.push(e);
    if (team)
        i.teams[team] = e.id;
    write(i);
    return e;
}
export function selectUsageKey(team, id) { const i = read(); if (id && !i.keys.some((k) => k.id === id))
    throw new Error('That key no longer exists.'); if (id)
    i.teams[team] = id;
else
    delete i.teams[team]; write(i); }
export async function removeUsageKey(id) { const i = read(); await deleteSecret(account(id)).catch(() => { }); i.keys = i.keys.filter((k) => k.id !== id); for (const [t, v] of Object.entries(i.teams))
    if (v === id)
        delete i.teams[t]; write(i); }
/** Key for a team: CXLENS_USAGE_KEY, else the key chosen for the team, else the older per-team Keychain entry. */
export async function resolveUsageKey(team) {
    if (process.env.CXLENS_USAGE_KEY)
        return process.env.CXLENS_USAGE_KEY;
    const id = read().teams[team];
    if (id) {
        const s = await getSecret(account(id)).catch(() => null);
        if (s)
            return s;
    }
    return getSecret(`${team}:metric-usage`).catch(() => null);
}
//# sourceMappingURL=usage-keys.js.map