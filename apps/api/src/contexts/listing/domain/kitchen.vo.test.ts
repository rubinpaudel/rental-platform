import { describe, expect, it } from 'vitest';
import { kitchenType, KITCHEN_TYPES } from './kitchen.vo';

describe('kitchenType', () => {
  it('accepts every documented type', () => {
    for (const t of KITCHEN_TYPES) {
      expect(kitchenType(t)).toBe(t);
    }
  });

  it('rejects unknown type', () => {
    expect(() => kitchenType('industrial')).toThrow(/Invalid kitchenType/);
  });

  it('rejects non-string', () => {
    expect(() => kitchenType(123)).toThrow(/Invalid kitchenType/);
  });
});
