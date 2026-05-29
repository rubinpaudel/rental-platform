import type { Region } from '@/lib/listings/types';
import { BE_POSTAL_CODES } from './data';
import { inferRegion } from './region';

let cachedMap: Map<string, string> | null = null;

function map(): Map<string, string> {
  if (cachedMap) return cachedMap;
  const m = new Map<string, string>();
  // Earlier entries win — the data file lists the canonical municipality
  // before any deelgemeenten that share the same postal code.
  for (const [code, name] of BE_POSTAL_CODES) {
    if (!m.has(code)) m.set(code, name);
  }
  cachedMap = m;
  return m;
}

export interface PostalLookup {
  municipality: string | null;
  region: Region | null;
}

/**
 * Look up the canonical municipality + region for a BE postal code. Region
 * inference works for any 4-digit code (matches backend); municipality only
 * resolves when the code is in the curated table.
 *
 * Callers should treat both fields as hints: the user can override the
 * municipality if they live in a deelgemeente we haven't catalogued, and the
 * backend re-validates region from postal code on submit.
 */
export function lookupBePostal(postalCode: string): PostalLookup {
  return {
    municipality: map().get(postalCode) ?? null,
    region: inferRegion(postalCode),
  };
}
