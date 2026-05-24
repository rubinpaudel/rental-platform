import 'server-only';
import { apiGet, ApiError } from './server-fetch';
import type { Listing, ListingPage } from './types';

export async function listMyListings(): Promise<ListingPage> {
  return apiGet<ListingPage>('/listings');
}

/**
 * Returns the listing or `null` when the v3 API replies 404. The 404 covers
 * both "doesn't exist" and "exists but belongs to another org", which keeps
 * tenancy boundaries opaque to the caller — exactly what we want.
 */
export async function getListingOrNull(id: string): Promise<Listing | null> {
  try {
    return await apiGet<Listing>(`/listings/${encodeURIComponent(id)}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}
