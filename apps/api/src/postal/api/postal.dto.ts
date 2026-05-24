import type { Country } from '../domain/country';

export interface PostalCityDto {
  country: Country;
  postalCode: string;
  municipality: string;
  /** Country-specific region (BE → flanders/wallonia/brussels). */
  region: string | null;
  province: string | null;
  latitude: number | null;
  longitude: number | null;
}
