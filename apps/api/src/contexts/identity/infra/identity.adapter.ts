import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { Database } from '@rental-platform/db';
import { DATABASE } from '../../../db/db.module';
import type { IdentityPort, IdentityUser } from '../domain/identity.port';
import { userId, type UserId } from '../domain/user-id.vo';
import { organizationId, type OrganizationId } from '../domain/organization-id.vo';
import { userRole } from '../domain/user-role.vo';
import * as schema from './schema';

/**
 * The only implementation of IdentityPort. Reads Better-Auth-owned tables
 * directly (read-only) — writes always go through Better Auth's API.
 */
@Injectable()
export class IdentityAdapter implements IdentityPort {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async getUser(id: UserId): Promise<IdentityUser | null> {
    const [row] = await this.db
      .select({
        id: schema.user.id,
        role: schema.user.role,
        orgId: schema.member.organizationId,
      })
      .from(schema.user)
      .innerJoin(schema.member, eq(schema.member.userId, schema.user.id))
      .where(eq(schema.user.id, id))
      .limit(1);
    if (!row) return null;

    return { id: userId(row.id), role: userRole(row.role), orgId: organizationId(row.orgId) };
  }

  async getActiveOrg(uid: UserId): Promise<OrganizationId | null> {
    const [row] = await this.db
      .select({ orgId: schema.member.organizationId })
      .from(schema.member)
      .where(eq(schema.member.userId, uid))
      .limit(1);
    return row ? organizationId(row.orgId) : null;
  }

  async listMembers(orgId: OrganizationId): Promise<UserId[]> {
    const rows = await this.db
      .select({ userId: schema.member.userId })
      .from(schema.member)
      .where(eq(schema.member.organizationId, orgId));
    return rows.map((r) => userId(r.userId));
  }
}
