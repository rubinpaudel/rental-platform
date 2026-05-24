import { API_URL } from '@/lib/api';

/**
 * Country codes the postal API currently supports. Defaults to BE for the
 * Belgian rental market; widening the union here keeps call sites lean.
 */
export type PostalCountry = 'BE';
const DEFAULT_COUNTRY: PostalCountry = 'BE';

export interface PostalCity {
  country: PostalCountry;
  postalCode: string;
  municipality: string;
  /** Country-specific region (BE → flanders/wallonia/brussels). Null when unknown. */
  region: string | null;
  province: string | null;
  latitude: number | null;
  longitude: number | null;
}

/**
 * All cities the API has for a given postcode in the requested country.
 * Empty array when the postcode isn't in the dataset or the input is empty.
 * The lookup endpoint is `Cache-Control: immutable`, so the browser dedupes
 * repeat lookups while the user types.
 */
export async function lookupPostal(
  postalCode: string,
  country: PostalCountry = DEFAULT_COUNTRY,
): Promise<PostalCity[]> {
  const trimmed = postalCode.trim();
  if (!trimmed) return [];
  const url = `${API_URL}/postal/lookup?country=${country}&postalCode=${encodeURIComponent(trimmed)}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  return (await res.json()) as PostalCity[];
}

/**
 * Name-based search for autocomplete. Substring match on municipality name
 * (case- and accent-insensitive); cities whose name starts with the query
 * rank first. Empty array for queries shorter than 2 characters.
 */
export async function searchPostal(
  query: string,
  options: { country?: PostalCountry; limit?: number } = {},
): Promise<PostalCity[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const country = options.country ?? DEFAULT_COUNTRY;
  const limit = options.limit ?? 20;
  const url = `${API_URL}/postal/search?country=${country}&q=${encodeURIComponent(q)}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  return (await res.json()) as PostalCity[];
}
