import { describe, expect, it } from 'vitest';
import {
  ProfileAccessDeniedError,
  ProfileNotFoundError,
  ProfileService,
} from './profile.service';
import type { Profile } from '../domain/profile.aggregate';
import { completenessOf } from '../domain/profile.completeness';
import type { ProfileRepo } from '../domain/profile.repo';
import type { ProfileAccessPort } from '../domain/profile-access.port';
import { userId } from '../../identity/domain/user-id.vo';
import { organizationId } from '../../identity/domain/organization-id.vo';

class InMemoryRepo implements ProfileRepo {
  private byUser = new Map<string, Profile>();

  async findByUser(id: string) {
    return this.byUser.get(id) ?? null;
  }

  async upsert(p: Profile) {
    this.byUser.set(p.userId, p);
  }
}

class DenyAccess implements ProfileAccessPort {
  async canRead() {
    return false;
  }
}

class AllowAccess implements ProfileAccessPort {
  async canRead() {
    return true;
  }
}

const UID = userId('tenant-1');
const ORG = organizationId('org-1');

describe('ProfileService.getOwn', () => {
  it('creates an empty profile on first read', async () => {
    const repo = new InMemoryRepo();
    const svc = new ProfileService(repo, new DenyAccess());

    const profile = await svc.getOwn({ userId: UID });
    expect(profile.userId).toBe(UID);
    expect(completenessOf(profile)).toBe(0);

    const again = await repo.findByUser(UID);
    expect(again).not.toBeNull();
  });

  it('returns the existing profile on subsequent reads', async () => {
    const repo = new InMemoryRepo();
    const svc = new ProfileService(repo, new DenyAccess());

    const first = await svc.getOwn({ userId: UID });
    first.patch({ bio: 'hi' });
    await repo.upsert(first);

    const second = await svc.getOwn({ userId: UID });
    expect(second.bio).toBe('hi');
  });
});

describe('ProfileService.upsertOwn', () => {
  it('applies a patch and bumps completeness', async () => {
    const repo = new InMemoryRepo();
    const svc = new ProfileService(repo, new DenyAccess());

    const before = await svc.upsertOwn({
      userId: UID,
      mode: 'patch',
      patch: { financial: { monthlyNetIncomeCents: 250000 } },
    });
    expect(completenessOf(before)).toBeGreaterThan(0);
    expect(before.financial.monthlyNetIncomeCents).toBe(250000);
  });

  it('replace clears unspecified fields', async () => {
    const repo = new InMemoryRepo();
    const svc = new ProfileService(repo, new DenyAccess());

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

describe('ProfileService.readForLandlord', () => {
  it('denies when the access port denies (v5 stub)', async () => {
    const repo = new InMemoryRepo();
    const svc = new ProfileService(repo, new DenyAccess());
    await svc.getOwn({ userId: UID });

    await expect(
      svc.readForLandlord({ tenantUserId: UID, landlordOrgId: ORG }),
    ).rejects.toBeInstanceOf(ProfileAccessDeniedError);
  });

  it('allows when the access port allows but the profile must exist', async () => {
    const repo = new InMemoryRepo();
    const svc = new ProfileService(repo, new AllowAccess());

    await expect(
      svc.readForLandlord({ tenantUserId: UID, landlordOrgId: ORG }),
    ).rejects.toBeInstanceOf(ProfileNotFoundError);
  });

  it('returns the profile when allowed and present', async () => {
    const repo = new InMemoryRepo();
    const svc = new ProfileService(repo, new AllowAccess());
    await svc.getOwn({ userId: UID });

    const profile = await svc.readForLandlord({ tenantUserId: UID, landlordOrgId: ORG });
    expect(profile.userId).toBe(UID);
  });
});
