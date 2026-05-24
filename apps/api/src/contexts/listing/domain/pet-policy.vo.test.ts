import { describe, expect, it } from 'vitest';
import { petPolicy, EMPTY_PET_POLICY } from './pet-policy.vo';

describe('petPolicy', () => {
  it('returns empty for empty input', () => {
    expect(petPolicy({})).toEqual(EMPTY_PET_POLICY);
  });

  it('round-trips a full record', () => {
    expect(
      petPolicy({ allowsLargePets: false, allowsSmallPets: true, smokingAllowed: false }),
    ).toEqual({
      allowsLargePets: false,
      allowsSmallPets: true,
      smokingAllowed: false,
    });
  });

  it('treats undefined as null', () => {
    expect(petPolicy({ allowsLargePets: true })).toEqual({
      allowsLargePets: true,
      allowsSmallPets: null,
      smokingAllowed: null,
    });
  });
});
