import type { UserId } from './user-id.vo';
import type { OrganizationId } from './organization-id.vo';
import type { UserRole } from './user-role.vo';

export interface IdentityUser {
  id: UserId;
  role: UserRole;
  orgId: OrganizationId;
}

/**
 * The only Identity contract other bounded contexts depend on. Nothing
 * outside this context touches Better Auth directly.
 */
export interface IdentityPort {
  getUser(id: UserId): Promise<IdentityUser | null>;
  getActiveOrg(userId: UserId): Promise<OrganizationId | null>;
  listMembers(orgId: OrganizationId): Promise<UserId[]>;
}

export const IDENTITY_PORT = Symbol('IdentityPort');
