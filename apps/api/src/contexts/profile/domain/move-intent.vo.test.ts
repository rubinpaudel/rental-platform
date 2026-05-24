import { describe, expect, it } from 'vitest';
import { moveIntent, EMPTY_MOVE_INTENT } from './move-intent.vo';

describe('moveIntent', () => {
  it('returns empty for empty input', () => {
    expect(moveIntent({})).toEqual(EMPTY_MOVE_INTENT);
  });

  it('accepts a valid future move-in date', () => {
    expect(moveIntent({ desiredMoveInDate: '2030-01-01' }).desiredMoveInDate).toBe(
      '2030-01-01',
    );
  });

  it('rejects malformed date', () => {
    expect(() => moveIntent({ desiredMoveInDate: '01/01/2030' })).toThrow(/YYYY-MM-DD/);
  });

  it('rejects calendar-invalid date', () => {
    expect(() => moveIntent({ desiredMoveInDate: '2030-02-30' })).toThrow(/valid calendar/);
  });

  it('coerces willingToDomicile to boolean', () => {
    expect(moveIntent({ willingToDomicile: true }).willingToDomicile).toBe(true);
    expect(moveIntent({ willingToDomicile: false }).willingToDomicile).toBe(false);
  });
});
