import {
  pgTable,
  text,
  integer,
  boolean,
  date,
  timestamp,
  primaryKey,
  index,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

/**
 * Listings carry rich, structured property data. Fields are normalised
 * columns with CHECK constraints — not JSONB — so downstream contexts
 * (Discovery filters, public feed) can sort/filter on them directly.
 * Tri-state booleans (NULL = "not specified") follow the profile precedent.
 */
export const listings = pgTable(
  'listings',
  {
    // Identity
    id: text('id').primaryKey(),
    orgId: text('org_id').notNull(),
    createdBy: text('created_by').notNull(),

    // Marketing
    description: text('description').notNull(),

    // Address
    street: text('street').notNull(),
    number: text('number').notNull(),
    box: text('box'),
    postalCode: text('postal_code').notNull(),
    municipality: text('municipality').notNull(),
    region: text('region').notNull(),
    country: text('country').default('BE').notNull(),

    // Classification
    listingType: text('listing_type').notNull().default('rent'),
    propertyType: text('property_type').notNull(),
    leaseType: text('lease_type'),
    minLeaseMonths: integer('min_lease_months'),

    // Availability
    availableFrom: date('available_from'),
    availableImmediately: boolean('available_immediately'),
    viewingMode: text('viewing_mode'),

    // Pricing (cents)
    priceCents: integer('price_cents').notNull(),
    chargesCents: integer('charges_cents'),
    syndicCents: integer('syndic_cents'),
    depositCents: integer('deposit_cents'),
    agencyFeeCents: integer('agency_fee_cents'),
    includesUtilities: boolean('includes_utilities'),
    currency: text('currency').default('EUR').notNull(),

    // Surface (m²)
    surfaceM2: integer('surface_m2').notNull(),

    // Room counts
    bedrooms: integer('bedrooms').notNull(),

    // Lifecycle
    status: text('status').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('listings_org_id_idx').on(table.orgId),
    index('listings_status_idx').on(table.status),
    index('listings_created_at_id_idx').on(table.createdAt, table.id),
    check(
      'listings_listing_type_chk',
      sql`${table.listingType} IN ('rent','sale','short_term','student')`,
    ),
    check(
      'listings_property_type_chk',
      sql`${table.propertyType} IN ('apartment','house','studio','loft','commercial','office','garage','land')`,
    ),
    check(
      'listings_lease_type_chk',
      sql`${table.leaseType} IS NULL OR ${table.leaseType} IN ('long_term_residential','short_term','student','commercial')`,
    ),
    check(
      'listings_min_lease_months_chk',
      sql`${table.minLeaseMonths} IS NULL OR (${table.minLeaseMonths} >= 1 AND ${table.minLeaseMonths} <= 360)`,
    ),
    check(
      'listings_viewing_mode_chk',
      sql`${table.viewingMode} IS NULL OR ${table.viewingMode} IN ('self_book','on_request','open_house')`,
    ),
    check('listings_price_cents_chk', sql`${table.priceCents} >= 0`),
    check(
      'listings_charges_cents_chk',
      sql`${table.chargesCents} IS NULL OR ${table.chargesCents} >= 0`,
    ),
    check(
      'listings_syndic_cents_chk',
      sql`${table.syndicCents} IS NULL OR ${table.syndicCents} >= 0`,
    ),
    check(
      'listings_deposit_cents_chk',
      sql`${table.depositCents} IS NULL OR ${table.depositCents} >= 0`,
    ),
    check(
      'listings_agency_fee_cents_chk',
      sql`${table.agencyFeeCents} IS NULL OR ${table.agencyFeeCents} >= 0`,
    ),
    check('listings_surface_m2_chk', sql`${table.surfaceM2} > 0`),
    check('listings_bedrooms_chk', sql`${table.bedrooms} >= 0`),
    check(
      'listings_status_chk',
      sql`${table.status} IN ('draft','active','inactive','closed')`,
    ),
  ],
);

export const listingPhotos = pgTable(
  'listing_photos',
  {
    listingId: text('listing_id').notNull(),
    storageKey: text('storage_key').notNull(),
    ord: integer('ord').notNull(),
    alt: text('alt'),
  },
  (table) => [primaryKey({ columns: [table.listingId, table.storageKey] })],
);
