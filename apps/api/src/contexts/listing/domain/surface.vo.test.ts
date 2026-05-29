import { describe, expect, it } from 'vitest';
import { surface, surfaceBreakdown } from './surface.vo';

describe('surface', () => {
  it('round-trips a positive integer', () => {
    expect(surface(85)).toEqual({ m2: 85 });
  });

  it('rejects zero and negative', () => {
    expect(() => surface(0)).toThrow(/positive integer/);
    expect(() => surface(-1)).toThrow(/positive integer/);
  });

  it('rejects non-integers', () => {
    expect(() => surface(85.5)).toThrow(/positive integer/);
  });
});

describe('surfaceBreakdown', () => {
  it('parses minimal record (totalM2 only)', () => {
    expect(surfaceBreakdown({ totalM2: 85 })).toEqual({
      totalM2: 85,
      livingRoomM2: null,
      kitchenM2: null,
      terraceM2: null,
      gardenM2: null,
      totalLandM2: null,
      basementM2: null,
    });
  });

  it('round-trips a full record', () => {
    expect(
      surfaceBreakdown({
        totalM2: 92,
        livingRoomM2: 20,
        kitchenM2: 7,
        terraceM2: 5,
        gardenM2: 30,
        totalLandM2: 150,
        basementM2: 12,
      }),
    ).toEqual({
      totalM2: 92,
      livingRoomM2: 20,
      kitchenM2: 7,
      terraceM2: 5,
      gardenM2: 30,
      totalLandM2: 150,
      basementM2: 12,
    });
  });

  it('rejects non-positive totalM2', () => {
    expect(() => surfaceBreakdown({ totalM2: 0 })).toThrow(/positive integer/);
  });

  it('rejects negative auxiliary surfaces', () => {
    expect(() => surfaceBreakdown({ totalM2: 50, terraceM2: -1 })).toThrow(/non-negative/);
  });
});
