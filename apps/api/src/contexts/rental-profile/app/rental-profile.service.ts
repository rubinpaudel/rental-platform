import { RentalProfile } from '../domain/rental-profile.aggregate';
import type { RentalProfileRepo } from '../domain/rental-profile.repo';
import type { RentalProfileAccessPort } from '../domain/rental-profile-access.port';
import type {
  GetOwnProfileQuery,
  UpsertOwnProfileCommand,
  ReadTenantProfileQuery,
} from './commands';

export class RentalProfileNotFoundError extends Error {
  constructor() {
    super('Rental profile not found');
    this.name = 'RentalProfileNotFoundError';
  }
}

export class RentalProfileAccessDeniedError extends Error {
  constructor() {
    super('Access to this rental profile is not permitted');
    this.name = 'RentalProfileAccessDeniedError';
  }
}

export class RentalProfileService {
  constructor(
    private readonly repo: RentalProfileRepo,
    private readonly access: RentalProfileAccessPort,
  ) {}

  /** Creates an empty profile on first read. */
  async getOwn(query: GetOwnProfileQuery): Promise<RentalProfile> {
    const existing = await this.repo.findByUser(query.userId);
    if (existing) return existing;

    const empty = RentalProfile.empty(query.userId);
    await this.repo.upsert(empty);
    return empty;
  }

  async upsertOwn(cmd: UpsertOwnProfileCommand): Promise<RentalProfile> {
    const profile =
      (await this.repo.findByUser(cmd.userId)) ?? RentalProfile.empty(cmd.userId);

    if (cmd.mode === 'replace') {
      profile.replace(cmd.patch);
    } else {
      profile.patch(cmd.patch);
    }

    await this.repo.upsert(profile);
    return profile;
  }

  async readForLandlord(query: ReadTenantProfileQuery): Promise<RentalProfile> {
    const allowed = await this.access.canMakelaarRead(
      query.landlordOrgId,
      query.tenantUserId,
    );
    if (!allowed) throw new RentalProfileAccessDeniedError();

    const profile = await this.repo.findByUser(query.tenantUserId);
    if (!profile) throw new RentalProfileNotFoundError();
    return profile;
  }
}
