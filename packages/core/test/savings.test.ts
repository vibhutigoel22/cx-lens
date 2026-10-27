import { describe, it, expect } from 'vitest';
import { combinedSavings, overlapGroups, unitsPerGb, gbToUnits } from '../src/index.js';
import { f } from './helpers.js';

describe('units (official rates only)', () => {
  it('matches the Coralogix docs table', () => {
    expect(unitsPerGb('logs', 'high')).toBe(0.75); expect(unitsPerGb('logs', 'medium')).toBe(0.32); expect(unitsPerGb('logs', 'low')).toBe(0.12); expect(unitsPerGb('logs', 'blocked')).toBe(0.08);
    expect(unitsPerGb('traces', 'high')).toBe(0.5); expect(unitsPerGb('traces', 'medium')).toBe(0.25); expect(unitsPerGb('traces', 'low')).toBe(0.1);
    expect(gbToUnits(30, 'metrics')).toBeCloseTo(1, 6);
  });
  it('matches live-observed usage (2.8457725 GB high logs = 2.1343 units)', () => expect(gbToUnits(2.8457725, 'logs', 'high')).toBeCloseTo(2.1343293, 3));
});
describe('overlaps never double count', () => {
  const a = f({ id: 'SPAN-1', ruleId: 'SPAN-SAMPLING', savings: { kind: 'units', unitsPerDay: 250, gbPerDay: 1, basis: '' }, overlapsWith: ['SPAN-HEALTH'] });
  const b = f({ id: 'SPAN-2', ruleId: 'SPAN-HEALTH', savings: { kind: 'units', unitsPerDay: 13.1, gbPerDay: 1, basis: '' }, overlapsWith: ['SPAN-SAMPLING'] });
  const c = f({ id: 'LOG-1', ruleId: 'LOG-LOW-VALUE', pillar: 'logs', savings: { kind: 'units', unitsPerDay: 10.5, gbPerDay: 1, basis: '' } });
  it('template example: 250 + 13.1 counts as 250', () => { const r = combinedSavings([a, b, c], null); expect(r.total).toBeCloseTo(260.5); expect(r.groups).toHaveLength(1); expect(r.groups[0].note).toMatch(/do not add/); });
  it('overlap is symmetric even if declared one way', () => { const b2 = { ...b, overlapsWith: [] }; expect(combinedSavings([a, b2], null).total).toBe(250); });
  it('transitive groups collapse to the max', () => { const d = f({ id: 'SPAN-3', ruleId: 'SPAN-INTERNAL', savings: { kind: 'units', unitsPerDay: 40, gbPerDay: 1, basis: '' }, overlapsWith: ['SPAN-SAMPLING'] }); expect(combinedSavings([a, b, d], null).total).toBe(250); expect(overlapGroups([a, b, d])[0].ids.sort()).toEqual(['SPAN-1', 'SPAN-2', 'SPAN-3']); });
  it('never exceeds the baseline', () => expect(combinedSavings([a, c], 100).total).toBe(100));
});
