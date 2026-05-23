import { describe, expect, it } from 'vitest';
import {
  RentalProfileAccessDeniedError,
  RentalProfileNotFoundError,
  RentalProfileService,
} from './rental-profile.service';
import { RentalProfile } from '../domain/rental-profile.aggregate';
import type { RentalProfileRepo } from '../domain/rental-profile.repo';
import type { RentalProfileAccessPort } from '../domain/rental-profile-access.port';
import { userId } from '../../identity/domain/user-id.vo';
import { organizationId } from '../../identity/domain/organization-id.vo';

class InMemoryRepo implements RentalProfileRepo {
  private byUser = new Map<string, RentalProfile>();

  async findByUser(id: string) {
    return this.byUser.get(id) ?? null;
  }

  async upsert(p: RentalProfile) {
    this.byUser.set(p.userId, p);
  }
}

class DenyAccess implements RentalProfileAccessPort {
  async canMakelaarRead() {
    return false;
  }
}

class AllowAccess implements RentalProfileAccessPort {
  async canMakelaarRead() {
    return true;
  }
}

const UID = userId('tenant-1');
const ORG = organizationId('org-1');

describe('RentalProfileService.getOwn', () => {
  it('creates an empty profile on first read', async () => {
    const repo = new InMemoryRepo();
    const svc = new RentalProfileService(repo, new DenyAccess());

    const profile = await svc.getOwn({ userId: UID });
    expect(profile.userId).toBe(UID);
    expect(profile.completeness()).toBe(0);

    const again = await repo.findByUser(UID);
    expect(again).not.toBeNull();
  });

  it('returns the existing profile on subsequent reads', async () => {
    const repo = new InMemoryRepo();
    const svc = new RentalProfileService(repo, new DenyAccess());

    const first = await svc.getOwn({ userId: UID });
    first.patch({ bio: 'hi' });
    await repo.upsert(first);

    const second = await svc.getOwn({ userId: UID });
    expect(second.bio).toBe('hi');
  });
});

describe('RentalProfileService.upsertOwn', () => {
  it('applies a patch and bumps completeness', async () => {
    const repo = new InMemoryRepo();
    const svc = new RentalProfileService(repo, new DenyAccess());

    const before = await svc.upsertOwn({
      userId: UID,
      mode: 'patch',
      patch: { financial: { monthlyNetIncomeCents: 250000 } },
    });
    expect(before.completeness()).toBeGreaterThan(0);
    expect(before.financial.monthlyNetIncomeCents).toBe(250000);
  });

  it('replace clears unspecified fields', async () => {
    const repo = new InMemoryRepo();
    const svc = new RentalProfileService(repo, new DenyAccess());

    await svc.upsertOwn({
      userId: UID,
      mode: 'patch',
      patch: { identity: { firstName: 'Alice' }, bio: 'hi' },
    });

    const replaced = await svc.upsertOwn({
      userId: UID,
      mode: 'replace',
      patch: { identity: { firstName: 'Bob' } },
    });
    expect(replaced.identity.firstName).toBe('Bob');
    expect(replaced.bio).toBe('');
  });
});

describe('RentalProfileService.readForLandlord', () => {
  it('denies when the access port denies (v5 stub)', async () => {
    const repo = new InMemoryRepo();
    const svc = new RentalProfileService(repo, new DenyAccess());
    await svc.getOwn({ userId: UID });

    await expect(
      svc.readForLandlord({ tenantUserId: UID, landlordOrgId: ORG }),
    ).rejects.toBeInstanceOf(RentalProfileAccessDeniedError);
  });

  it('allows when the access port allows but the profile must exist', async () => {
    const repo = new InMemoryRepo();
    const svc = new RentalProfileService(repo, new AllowAccess());

    await expect(
      svc.readForLandlord({ tenantUserId: UID, landlordOrgId: ORG }),
    ).rejects.toBeInstanceOf(RentalProfileNotFoundError);
  });

  it('returns the profile when allowed and present', async () => {
    const repo = new InMemoryRepo();
    const svc = new RentalProfileService(repo, new AllowAccess());
    await svc.getOwn({ userId: UID });

    const profile = await svc.readForLandlord({ tenantUserId: UID, landlordOrgId: ORG });
    expect(profile.userId).toBe(UID);
  });
});
