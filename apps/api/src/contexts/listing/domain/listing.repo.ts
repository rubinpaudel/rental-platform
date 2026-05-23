import type { Listing } from './listing.aggregate';
import type { ListingId } from './listing-id.vo';
import type { OrganizationId } from '../../identity/domain/organization-id.vo';
import type { ListingStatus } from './listing-status.vo';

export interface PaginationCursor {
  createdAt: Date;
  id: string;
}

export interface PaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
}

export interface ListingRepo {
  save(listing: Listing): Promise<void>;
  findById(id: ListingId): Promise<Listing | null>;
  findByIdAndOrg(id: ListingId, orgId: OrganizationId): Promise<Listing | null>;
  listByOrg(
    orgId: OrganizationId,
    opts: { status?: ListingStatus | undefined; cursor?: string | undefined; limit: number },
  ): Promise<PaginatedResult<Listing>>;
  listPublicFeed(opts: { cursor?: string | undefined; limit: number }): Promise<PaginatedResult<Listing>>;
  findActiveById(id: ListingId): Promise<Listing | null>;
}

export const LISTING_REPO = Symbol('ListingRepo');
