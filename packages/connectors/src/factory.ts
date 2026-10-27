import { CxCliAdapter, CxTeam } from './cx-cli.js';
import { MetricsApiAdapter } from './metrics-api.js';
import { ClaudeCliAdapter } from './claude-cli.js';
import { CompositeConnector } from './composite.js';
import { getSecret } from './keychain.js';
import { run } from './exec.js';

/**
 * Explicit key for the optional direct Metrics API fallback: CX_API_KEY env, or a key saved in Lens's own
 * Keychain entry ("Add a team"). Lens never reads cx's credential store; cx keeps using its own sign-in.
 */
export async function resolveKey(team: CxTeam): Promise<string | null> {
  return getSecret(team.keychainAccount ?? team.name);
}
export async function buildConnector(team: CxTeam, opts: { metrics?: boolean; claude?: boolean } = {}) {
  const key = () => resolveKey(team);
  // With a cx profile, cx authenticates itself; the key callback is only used for non-profile (env/Keychain) teams.
  const cx = new CxCliAdapter(team, key);
  const explicit = await key();
  const metrics = opts.metrics === false || !explicit ? undefined : new MetricsApiAdapter(team.region, key);
  const claude = opts.claude === false ? undefined : new ClaudeCliAdapter();
  const c = new CompositeConnector(cx, metrics, claude);
  // Optional exact metric usage: only when a DataAnalytics key was saved for this team.
  const { metricUsageFor } = await import('./metric-usage.js'); const mu = await metricUsageFor(team).catch(() => null); if (mu) c.metricUsage = mu;
  return c;
}
export { run };
