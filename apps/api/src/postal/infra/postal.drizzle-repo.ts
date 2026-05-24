import { and, eq, sql } from 'drizzle-orm';
import type { Database } from '@rental-platform/db';
import type { Country } from '../domain/country';
import type { PostalRepo } from '../domain/postal.repo';
import type { PostalCityDto } from '../api/postal.dto';
import { postalCodes, type PostalCodeRow } from './schema';

export class PostalDrizzleRepo implements PostalRepo {
  constructor(private readonly db: Database) {}

  async findByPostalCode(country: Country, postalCode: string): Promise<PostalCityDto[]> {
    const rows = await this.db
      .select()
      .from(postalCodes)
      .where(and(eq(postalCodes.countryCode, country), eq(postalCodes.postalCode, postalCode)));
    return rows.map((r) => toDto(country, r));
  }

  async search(country: Country, query: string, limit: number): Promise<PostalCityDto[]> {
    const q = normalize(query);
    if (q.length < 2) return [];
    // Rank starts-with above contains, then alphabetical. LIKE `q%` is the
    // index-hitting predicate (text_pattern_ops); LIKE `%q%` falls back to a
    // seq scan but is fine at this scale (~3k rows per country today).
    const rows = await this.db
      .select()
      .from(postalCodes)
      .where(
        and(
          eq(postalCodes.countryCode, country),
          sql`${postalCodes.placeNormalized} LIKE ${'%' + q + '%'}`,
        ),
      )
      .orderBy(
        sql`CASE WHEN ${postalCodes.placeNormalized} LIKE ${q + '%'} THEN 0 ELSE 1 END`,
        postalCodes.placeNormalized,
      )
      .limit(limit);
    return rows.map((r) => toDto(country, r));
  }
}

function toDto(country: Country, r: PostalCodeRow): PostalCityDto {
  return {
    country,
    postalCode: r.postalCode,
    municipality: r.place,
    region: r.region,
    province: r.province,
    latitude: r.latitude,
    longitude: r.longitude,
  };
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}
