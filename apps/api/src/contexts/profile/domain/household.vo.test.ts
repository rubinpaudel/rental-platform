import { describe, expect, it } from 'vitest';
import { household, EMPTY_HOUSEHOLD } from './household.vo';

describe('household', () => {
  it('returns empty for empty input', () => {
    expect(household({})).toEqual(EMPTY_HOUSEHOLD);
  });

  it('accepts a valid household size', () => {
    expect(household({ householdSize: 3 }).householdSize).toBe(3);
  });

  it('rejects non-integer household size', () => {
    expect(() => household({ householdSize: 1.5 })).toThrow(/between 1 and 20/);
  });

  it('rejects out-of-range household size', () => {
    expect(() => household({ householdSize: 0 })).toThrow(/between 1 and 20/);
    expect(() => household({ householdSize: 21 })).toThrow(/between 1 and 20/);
  });

  it('coerces hasPets to boolean', () => {
    expect(household({ hasPets: true }).hasPets).toBe(true);
    expect(household({ hasPets: false }).hasPets).toBe(false);
  });

  it('allows petDescription when hasPets is true', () => {
    expect(
      household({ hasPets: true, petDescription: 'one cat, very lazy' }).petDescription,
    ).toBe('one cat, very lazy');
  });

  it('allows petDescription when hasPets is null (caller deferred)', () => {
    expect(household({ petDescription: 'dog' }).petDescription).toBe('dog');
  });

  it('rejects petDescription when hasPets is explicitly false', () => {
    expect(() => household({ hasPets: false, petDescription: 'dog' })).toThrow(
      /cannot be set/,
    );
  });

  it('trims petDescription and rejects too-long', () => {
    expect(household({ petDescription: '  cat  ' }).petDescription).toBe('cat');
    expect(() => household({ petDescription: 'a'.repeat(501) })).toThrow(/at most/);
  });
});
