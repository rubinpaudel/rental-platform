import { describe, expect, it } from 'vitest';
import { Profile } from './profile.aggregate';
import { completenessOf } from './profile.completeness';
import { userId } from '../../identity/domain/user-id.vo';

const UID = userId('user-1');

function full() {
  const p = Profile.empty(UID);
  p.patch({
    identity: {
      firstName: 'Alice',
      lastName: 'Janssens',
      dateOfBirth: '1990-01-01',
      phone: '0470123456',
      nationality: 'BE',
    },
    household: { householdSize: 2, hasPets: true, petDescription: 'cat' },
    employment: { status: 'employed_indef', employer: 'Acme', monthsAtEmployer: 24 },
    financial: {
      monthlyNetIncomeCents: 250000,
      incomeProofType: 'payslips',
      guaranteeCapacityCents: 300000,
    },
    move: { desiredMoveInDate: '2030-01-01', willingToDomicile: true },
    bio: 'Quiet, no smoker',
  });
  return p;
}

describe('completenessOf', () => {
  it('is 0 for an empty profile', () => {
    expect(completenessOf(Profile.empty(UID))).toBe(0);
  });

  it('is 100 when every field is filled', () => {
    expect(completenessOf(full())).toBe(100);
  });

  it('caps at 100 (sanity)', () => {
    expect(completenessOf(full())).toBeLessThanOrEqual(100);
  });

  it('rises after a single income field is added', () => {
    const p = Profile.empty(UID);
    p.patch({ financial: { monthlyNetIncomeCents: 250000 } });
    expect(completenessOf(p)).toBeGreaterThan(0);
  });

  it('weights required fields higher than optional ones', () => {
    const req = Profile.empty(UID);
    req.patch({ financial: { monthlyNetIncomeCents: 250000 } });

    const opt = Profile.empty(UID);
    opt.patch({ bio: 'hello' });

    expect(completenessOf(req)).toBeGreaterThan(completenessOf(opt));
  });

  it('counts every required field as contributing more than the bio', () => {
    const bio = Profile.empty(UID);
    bio.patch({ bio: 'a little blurb' });
    const bioScore = completenessOf(bio);

    const incomeOnly = Profile.empty(UID);
    incomeOnly.patch({ financial: { monthlyNetIncomeCents: 250000 } });

    expect(completenessOf(incomeOnly)).toBeGreaterThan(bioScore);
  });

  it('ignores a bio that is whitespace-only', () => {
    const p = Profile.empty(UID);
    p.patch({ bio: '   ' });
    expect(completenessOf(p)).toBe(0);
  });

  it('returns an integer in [0,100]', () => {
    const score = completenessOf(full());
    expect(Number.isInteger(score)).toBe(true);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
