import { CxTeam } from './cx-cli.js';
import { CompositeConnector } from './composite.js';
import { run } from './exec.js';
/**
 * Explicit key for the optional direct Metrics API fallback: CX_API_KEY env, or a key saved in Lens's own
 * Keychain entry ("Add a team"). Lens never reads cx's credential store; cx keeps using its own sign-in.
 */
export declare function resolveKey(team: CxTeam): Promise<string | null>;
export declare function buildConnector(team: CxTeam, opts?: {
    metrics?: boolean;
    claude?: boolean;
}): Promise<CompositeConnector>;
export { run };
