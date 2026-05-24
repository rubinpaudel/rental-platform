import { Profile } from '../domain/profile.aggregate';
import type { ProfileRepo } from '../domain/profile.repo';
import type { ProfileAccessPort } from '../domain/profile-access.port';
import type {
  GetOwnProfileQuery,
  UpsertOwnProfileCommand,
  ReadTenantProfileQuery,
} from './commands';

export class ProfileNotFoundError extends Error {
  constructor() {
    super('Profile not found');
    this.name = 'ProfileNotFoundError';
  }
}

export class ProfileAccessDeniedError extends Error {
  constructor() {
    super('Access to this profile is not permitted');
    this.name = 'ProfileAccessDeniedError';
  }
}

export class ProfileService {
  constructor(
    private readonly repo: ProfileRepo,
    private readonly access: ProfileAccessPort,
  ) {}

  /** Creates an empty profile on first read. */
  async getOwn(query: GetOwnProfileQuery): Promise<Profile> {
    const existing = await this.repo.findByUser(query.userId);
    if (existing) return existing;

    const empty = Profile.empty(query.userId);
    await this.repo.upsert(empty);
    return empty;
  }

  async upsertOwn(cmd: UpsertOwnProfileCommand): Promise<Profile> {
    const profile =
      (await this.repo.findByUser(cmd.userId)) ?? Profile.empty(cmd.userId);

    if (cmd.mode === 'replace') {
      profile.replace(cmd.patch);
    } else {
      profile.patch(cmd.patch);
    }

    await this.repo.upsert(profile);
    return profile;
  }

  async readForLandlord(query: ReadTenantProfileQuery): Promise<Profile> {
    const allowed = await this.access.canMakelaarRead(
      query.landlordOrgId,
      query.tenantUserId,
    );
    if (!allowed) throw new ProfileAccessDeniedError();

    const profile = await this.repo.findByUser(query.tenantUserId);
    if (!profile) throw new ProfileNotFoundError();
    return profile;
  }
}
