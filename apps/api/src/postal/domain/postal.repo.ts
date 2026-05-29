import type { Country } from './country';
import type { PostalCityDto } from '../api/postal.dto';

export interface PostalRepo {
  /** All rows for `(country, postalCode)`. Empty array if unknown. */
  findByPostalCode(country: Country, postalCode: string): Promise<PostalCityDto[]>;
  /**
   * Name-based search. `query` is lowercased + accent-stripped before the
   * SQL prefix match. Starts-with hits rank above contains hits; results
   * capped at `limit`.
   */
  search(country: Country, query: string, limit: number): Promise<PostalCityDto[]>;
}

export const POSTAL_REPO = Symbol('PostalRepo');
