import { run, which } from './exec.js';
import { existsSync, readFileSync, writeFileSync, mkdirSync, chmodSync } from 'node:fs';
import { dirname } from 'node:path';
/** Development/test only (Linux CI has no Keychain): set CXLENS_DEV_SECRET_FILE to a path. Never used on a Mac unless set. */
const devFile = () => process.env.CXLENS_DEV_SECRET_FILE;
const devRead = (): Record<string, string> => { const f = devFile()!; return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {}; };
const devWrite = (o: Record<string, string>) => { const f = devFile()!; mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, JSON.stringify(o)); chmodSync(f, 0o600); };
/** macOS Keychain storage via /usr/bin/security. Secrets are never written to disk or logs by Lens. */
const SERVICE = 'com.coralogix.lens';
export const keychainAvailable = () => !!devFile() || (process.platform === 'darwin' && !!which('security'));
export async function setSecret(account: string, secret: string): Promise<void> {
  if (devFile()) { const o = devRead(); o[account] = secret; devWrite(o); return; }
  if (!keychainAvailable()) throw new Error('macOS Keychain is not available on this system. Use the cx profile store or the CX_API_KEY environment variable.');
  // -U updates if present. The secret is passed via argv to the system binary only (never logged).
  const r = await run('security', ['add-generic-password', '-U', '-s', SERVICE, '-a', account, '-w', secret]);
  if (r.code !== 0) throw new Error('Could not store the key in Keychain.');
}
export async function getSecret(account: string): Promise<string | null> {
  if (process.env.CX_API_KEY) return process.env.CX_API_KEY;
  if (devFile()) return devRead()[account] ?? null;
  if (!keychainAvailable()) return null;
  const r = await run('security', ['find-generic-password', '-s', SERVICE, '-a', account, '-w']);
  return r.code === 0 ? r.stdout.trim() : null;
}
export async function deleteSecret(account: string) { if (devFile()) { const o = devRead(); delete o[account]; devWrite(o); return; } if (keychainAvailable()) await run('security', ['delete-generic-password', '-s', SERVICE, '-a', account]); }
