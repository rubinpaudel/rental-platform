import type { UserId } from '../../identity/domain/user-id.vo';
import type { OrganizationId } from '../../identity/domain/organization-id.vo';
import type { RentalProfilePatch } from '../domain/rental-profile.aggregate';

export interface GetOwnProfileQuery {
  userId: UserId;
}

export interface UpsertOwnProfileCommand {
  userId: UserId;
  patch: RentalProfilePatch;
  mode: 'replace' | 'patch';
}

export interface ReadTenantProfileQuery {
  tenantUserId: UserId;
  landlordOrgId: OrganizationId;
}
