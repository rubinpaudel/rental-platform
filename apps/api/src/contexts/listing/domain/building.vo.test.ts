import { describe, expect, it } from 'vitest';
import { buildingProfile, EMPTY_BUILDING_PROFILE } from './building.vo';

describe('buildingProfile', () => {
  it('returns empty for empty input', () => {
    expect(buildingProfile({})).toEqual(EMPTY_BUILDING_PROFILE);
  });

  it('round-trips a full record', () => {
    expect(
      buildingProfile({
        yearBuilt: 2013,
        floor: 1,
        totalFloors: 3,
        condition: 'excellent',
        facadeCount: 2,
      }),
    ).toEqual({
      yearBuilt: 2013,
      floor: 1,
      totalFloors: 3,
      condition: 'excellent',
      facadeCount: 2,
    });
  });

  it('rejects out-of-range yearBuilt', () => {
    expect(() => buildingProfile({ yearBuilt: 999 })).toThrow(/between 1000 and 2100/);
    expect(() => buildingProfile({ yearBuilt: 2101 })).toThrow(/between 1000 and 2100/);
  });

  it('rejects out-of-range floor', () => {
    expect(() => buildingProfile({ floor: -6 })).toThrow(/between -5 and 200/);
    expect(() => buildingProfile({ floor: 201 })).toThrow(/between -5 and 200/);
  });

  it('rejects unknown condition', () => {
    expect(() => buildingProfile({ condition: 'pristine' })).toThrow(/Invalid building condition/);
  });

  it('rejects out-of-range facadeCount', () => {
    expect(() => buildingProfile({ facadeCount: 0 })).toThrow(/between 1 and 4/);
    expect(() => buildingProfile({ facadeCount: 5 })).toThrow(/between 1 and 4/);
  });
});
