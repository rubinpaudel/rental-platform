import { pgTable, text, integer, timestamp, primaryKey, index } from 'drizzle-orm/pg-core';

export const listings = pgTable(
  'listings',
  {
    id: text('id').primaryKey(),
    orgId: text('org_id').notNull(),
    createdBy: text('created_by').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    street: text('street').notNull(),
    number: text('number').notNull(),
    box: text('box'),
    postalCode: text('postal_code').notNull(),
    municipality: text('municipality').notNull(),
    region: text('region').notNull(),
    country: text('country').default('BE').notNull(),
    priceCents: integer('price_cents').notNull(),
    currency: text('currency').default('EUR').notNull(),
    surfaceM2: integer('surface_m2').notNull(),
    rooms: integer('rooms').notNull(),
    status: text('status').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('listings_org_id_idx').on(table.orgId),
    index('listings_status_idx').on(table.status),
    index('listings_created_at_id_idx').on(table.createdAt, table.id),
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
