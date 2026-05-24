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
