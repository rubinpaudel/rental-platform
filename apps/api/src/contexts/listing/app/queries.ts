import type { OrganizationId } from '../../identity/domain/organization-id.vo';
import type { ListingId } from '../domain/listing-id.vo';
import type { ListingStatus } from '../domain/listing-status.vo';

export interface GetListingQuery {
  id: ListingId;
  orgId: OrganizationId;
}

export interface ListMyOrgListingsQuery {
  orgId: OrganizationId;
  status?: ListingStatus | undefined;
  cursor?: string | undefined;
  limit: number;
}

export interface ListPublicFeedQuery {
  cursor?: string | undefined;
  limit: number;
}

export interface GetPublicListingQuery {
  id: ListingId;
}
