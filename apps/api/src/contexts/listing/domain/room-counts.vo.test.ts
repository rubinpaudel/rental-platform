import { describe, expect, it } from 'vitest';
import { roomCounts } from './room-counts.vo';

describe('roomCounts', () => {
  it('parses a minimal record (only bedrooms)', () => {
    expect(roomCounts({ bedrooms: 2 })).toEqual({
      bedrooms: 2,
      bathrooms: null,
      showerRooms: null,
      toilets: null,
      hasOffice: null,
      hasDressing: null,
      hasLaundry: null,
    });
  });

  it('round-trips a full record', () => {
    expect(
      roomCounts({
        bedrooms: 3,
        bathrooms: 1,
        showerRooms: 1,
        toilets: 2,
        hasOffice: true,
        hasDressing: false,
        hasLaundry: true,
      }),
    ).toEqual({
      bedrooms: 3,
      bathrooms: 1,
      showerRooms: 1,
      toilets: 2,
      hasOffice: true,
      hasDressing: false,
      hasLaundry: true,
    });
  });

  it('rejects negative bedrooms', () => {
    expect(() => roomCounts({ bedrooms: -1 })).toThrow(/non-negative/);
  });

  it('rejects non-integer bedrooms', () => {
    expect(() => roomCounts({ bedrooms: 1.5 })).toThrow(/non-negative integer/);
  });

  it('rejects negative auxiliary counts', () => {
    expect(() => roomCounts({ bedrooms: 1, bathrooms: -1 })).toThrow(/non-negative/);
    expect(() => roomCounts({ bedrooms: 1, toilets: -1 })).toThrow(/non-negative/);
  });
});
