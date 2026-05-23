export const LISTING_STATUSES = ['draft', 'active', 'inactive', 'closed'] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

export function listingStatus(value: unknown): ListingStatus {
  if (typeof value !== 'string' || !LISTING_STATUSES.includes(value as ListingStatus)) {
    throw new Error(`Invalid listing status: ${String(value)}`);
  }
  return value as ListingStatus;
}
