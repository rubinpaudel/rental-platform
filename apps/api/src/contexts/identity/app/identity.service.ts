import { Inject, Injectable } from '@nestjs/common';
import {
  IDENTITY_PORT,
  type IdentityPort,
  type IdentityUser,
} from '../domain/identity.port';
import type { UserId } from '../domain/user-id.vo';
import type { OrganizationId } from '../domain/organization-id.vo';

/**
 * Thin pass-through over IdentityPort. Exists so other contexts inject a
 * stable application service rather than the infra adapter directly.
 */
@Injectable()
export class IdentityService {
  constructor(@Inject(IDENTITY_PORT) private readonly identity: IdentityPort) {}

  getUser(id: UserId): Promise<IdentityUser | null> {
    return this.identity.getUser(id);
  }

  getActiveOrg(userId: UserId): Promise<OrganizationId | null> {
    return this.identity.getActiveOrg(userId);
  }

  listMembers(orgId: OrganizationId): Promise<UserId[]> {
    return this.identity.listMembers(orgId);
  }
}
