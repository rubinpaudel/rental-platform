import { describe, expect, it } from 'vitest';
import { exterior, EMPTY_EXTERIOR } from './exterior.vo';

describe('exterior', () => {
  it('returns empty for empty input', () => {
    expect(exterior({})).toEqual(EMPTY_EXTERIOR);
  });

  it('round-trips a full record', () => {
    expect(
      exterior({
        hasTerrace: true,
        hasGarden: false,
        hasGarage: true,
        parkingSpots: 2,
        orientation: 'S',
      }),
    ).toEqual({
      hasTerrace: true,
      hasGarden: false,
      hasGarage: true,
      parkingSpots: 2,
      orientation: 'S',
    });
  });

  it('rejects negative parkingSpots', () => {
    expect(() => exterior({ parkingSpots: -1 })).toThrow(/non-negative/);
  });

  it('rejects unknown orientation', () => {
    expect(() => exterior({ orientation: 'NNE' })).toThrow(/Invalid orientation/);
  });
});
