import { pgTable, text, doublePrecision, primaryKey, index } from 'drizzle-orm/pg-core';

/**
 * Reference table for postal-code → municipality lookups. Populated by the
 * seed script (`packages/db/scripts/seed-postal.ts`) from per-country JSON
 * datasets — one row per (country, postal code, place) triple, since
 * postcodes routinely cover multiple deelgemeenten / sub-localities.
 *
 * `place_normalized` is lowercased + accent-stripped at seed time so name
 * search can use a btree text_pattern_ops index for prefix queries
 * (`WHERE place_normalized LIKE $1 || '%'`).
 *
 * `region` is a country-specific administrative label — for BE it's
 * `flanders | wallonia | brussels`, derived from the postcode by
 * `inferBeRegion`. The dataset's own `state_code` is kept verbatim in
 * `state_code` for traceability.
 */
export const postalCodes = pgTable(
  'postal_codes',
  {
    countryCode: text('country_code').notNull(),
    postalCode: text('postal_code').notNull(),
    place: text('place').notNull(),
    placeNormalized: text('place_normalized').notNull(),
    region: text('region'),
    state: text('state'),
    stateCode: text('state_code'),
    province: text('province'),
    provinceCode: text('province_code'),
    community: text('community'),
    communityCode: text('community_code'),
    latitude: doublePrecision('latitude'),
    longitude: doublePrecision('longitude'),
  },
  (table) => [
    primaryKey({ columns: [table.countryCode, table.postalCode, table.place] }),
    // Lookup by postcode: covered by the primary key prefix.
    // Prefix search by name: needs text_pattern_ops to use btree for LIKE.
    // The hand-written 0003 migration creates that with the right opclass.
    index('postal_codes_country_normalized_idx').on(table.countryCode, table.placeNormalized),
  ],
);

export type PostalCodeRow = typeof postalCodes.$inferSelect;
