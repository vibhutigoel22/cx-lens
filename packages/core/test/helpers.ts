import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { MockAdapter } from '../../connectors/src/mock.js';
import type { Finding } from '../src/types.js';
export const root = join(__dirname, '../../..');
export const fixture = (p: string) => readFileSync(join(root, 'fixtures', p), 'utf8');
export const demo = () => MockAdapter.fromFile(join(root, 'fixtures/demo.json'));
export const customer = { name: 'Acme', environment: 'prod', preparedBy: 'TAM', criticalServices: ['checkout', 'payment'] };
export const empty = (): MockAdapter => new MockAdapter({ recordedAt: new Date().toISOString(), source: 'test', queries: {}, usage: null, labels: {}, series: {}, resources: {} });
export function f(partial: Partial<Finding> & { ruleId: string }): Finding {
  return { id: partial.ruleId, pillar: 'traces', title: partial.ruleId, plain: '', evidence: [], savings: { kind: 'units', unitsPerDay: 1, gbPerDay: 1, basis: '' }, phase: 1, effort: 'low', owner: 'DevOps', verifyChecklist: [], verifyStatus: 'verified', progress: 'not-started', overlapsWith: [], caveats: [], nextStep: '', sources: [], ...partial } as Finding;
}
