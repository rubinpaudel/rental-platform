declare const brand: unique symbol;

/** Opaque identifier for a listing. */
export type ListingId = string & { readonly [brand]: 'ListingId' };

export function listingId(value: string): ListingId {
  if (!value) throw new Error('ListingId cannot be empty');
  return value as ListingId;
}
