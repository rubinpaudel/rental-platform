import type { OrganizationId } from '../../identity/domain/organization-id.vo';
import type { UserId } from '../../identity/domain/user-id.vo';

/**
 * Forward-declared port for the gated read. v5 ships the always-deny stub;
 * v9 (Applications context) replaces it with a check that an Application
 * exists from the tenant to a listing owned by the landlord's org.
 */
export interface RentalProfileAccessPort {
  canMakelaarRead(landlordOrgId: OrganizationId, tenantUserId: UserId): Promise<boolean>;
}

export const RENTAL_PROFILE_ACCESS_PORT = Symbol('RentalProfileAccessPort');
