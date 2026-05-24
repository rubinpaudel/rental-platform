import { describe, expect, it } from 'vitest';
import { Profile, BIO_MAX } from './profile.aggregate';
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

describe('Profile.completeness', () => {
  it('is 0 for an empty profile', () => {
    const p = Profile.empty(UID);
    expect(p.completeness()).toBe(0);
  });

  it('is 100 when every field is filled', () => {
    expect(full().completeness()).toBe(100);
  });

  it('caps at 100 (sanity)', () => {
    expect(full().completeness()).toBeLessThanOrEqual(100);
  });

  it('rises after a single income field is added', () => {
    const p = Profile.empty(UID);
    p.patch({ financial: { monthlyNetIncomeCents: 250000 } });
    expect(p.completeness()).toBeGreaterThan(0);
  });

  it('weights required fields higher than optional ones', () => {
    const req = Profile.empty(UID);
    req.patch({ financial: { monthlyNetIncomeCents: 250000 } });

    const opt = Profile.empty(UID);
    opt.patch({ bio: 'hello' });

    expect(req.completeness()).toBeGreaterThan(opt.completeness());
  });

  it('counts every required field as contributing more than the bio', () => {
    const bio = Profile.empty(UID);
    bio.patch({ bio: 'a little blurb' });
    const bioScore = bio.completeness();

    const incomeOnly = Profile.empty(UID);
    incomeOnly.patch({ financial: { monthlyNetIncomeCents: 250000 } });

    expect(incomeOnly.completeness()).toBeGreaterThan(bioScore);
  });

  it('ignores a bio that is whitespace-only', () => {
    const p = Profile.empty(UID);
    p.patch({ bio: '   ' });
    expect(p.completeness()).toBe(0);
  });

  it('returns an integer in [0,100]', () => {
    const p = full();
    const score = p.completeness();
    expect(Number.isInteger(score)).toBe(true);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe('Profile.patch', () => {
  it('persists partial updates without resetting other fields', () => {
    const p = Profile.empty(UID);
    p.patch({ identity: { firstName: 'Alice' } });
    p.patch({ identity: { lastName: 'Janssens' } });
    expect(p.identity.firstName).toBe('Alice');
    expect(p.identity.lastName).toBe('Janssens');
  });

  it('updates updatedAt on every patch', async () => {
    const p = Profile.empty(UID);
    const before = p.updatedAt;
    await new Promise((r) => setTimeout(r, 5));
    p.patch({ bio: 'hi' });
    expect(p.updatedAt.getTime()).toBeGreaterThan(before.getTime());
  });

  it('surfaces VO validation errors', () => {
    const p = Profile.empty(UID);
    expect(() => p.patch({ identity: { phone: 'nope' } })).toThrow(/Invalid Belgian phone/);
  });

  it('rejects bio over the limit', () => {
    const p = Profile.empty(UID);
    expect(() => p.patch({ bio: 'a'.repeat(BIO_MAX + 1) })).toThrow(/at most/);
  });

  it('keeps petDescription when re-patching only hasPets=true', () => {
    const p = Profile.empty(UID);
    p.patch({ household: { hasPets: true, petDescription: 'cat' } });
    p.patch({ household: { hasPets: true } });
    expect(p.household.petDescription).toBe('cat');
  });
});

describe('Profile.replace', () => {
  it('clears any field not present in the input', () => {
    const p = full();
    p.replace({ identity: { firstName: 'Bob' } });
    expect(p.identity.firstName).toBe('Bob');
    expect(p.identity.lastName).toBeNull();
    expect(p.household.householdSize).toBeNull();
    expect(p.bio).toBe('');
    expect(p.financial.monthlyNetIncomeCents).toBeNull();
  });
});

describe('Profile.empty', () => {
  it('produces a profile with completeness 0', () => {
    expect(Profile.empty(UID).completeness()).toBe(0);
  });
});
