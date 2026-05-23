import type { ListingId } from './listing-id.vo';

export interface ListingActivated {
  readonly type: 'ListingActivated';
  readonly listingId: ListingId;
  readonly occurredAt: Date;
}

export interface ListingDeactivated {
  readonly type: 'ListingDeactivated';
  readonly listingId: ListingId;
  readonly occurredAt: Date;
}

export interface ListingClosed {
  readonly type: 'ListingClosed';
  readonly listingId: ListingId;
  readonly occurredAt: Date;
}

export type ListingEvent = ListingActivated | ListingDeactivated | ListingClosed;
