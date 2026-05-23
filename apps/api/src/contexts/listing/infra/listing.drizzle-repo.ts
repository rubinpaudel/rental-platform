import { eq, and, lt, or, desc, asc } from 'drizzle-orm';
import type { Database } from '@rental-platform/db';
import { listings, listingPhotos } from './schema';
import { Listing } from '../domain/listing.aggregate';
import { listingId } from '../domain/listing-id.vo';
import { address } from '../domain/address.vo';
import { price } from '../domain/price.vo';
import { surface } from '../domain/surface.vo';
import { photo } from '../domain/photo.vo';
import { listingStatus, type ListingStatus } from '../domain/listing-status.vo';
import type { ListingId } from '../domain/listing-id.vo';
import type { OrganizationId } from '../../identity/domain/organization-id.vo';
import type { UserId } from '../../identity/domain/user-id.vo';
import type { ListingRepo, PaginatedResult } from '../domain/listing.repo';

export class ListingDrizzleRepo implements ListingRepo {
  constructor(private readonly db: Database) {}

  async save(listing: Listing): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx
        .insert(listings)
        .values({
          id: listing.id,
          orgId: listing.orgId,
          createdBy: listing.createdBy,
          title: listing.title,
          description: listing.description,
          street: listing.address.street,
          number: listing.address.number,
          box: listing.address.box,
          postalCode: listing.address.postalCode,
          municipality: listing.address.municipality,
          region: listing.address.region,
          priceCents: listing.price.cents,
          currency: listing.price.currency,
          surfaceM2: listing.surface.m2,
          rooms: listing.rooms,
          status: listing.status,
          createdAt: listing.createdAt,
          updatedAt: listing.updatedAt,
        })
        .onConflictDoUpdate({
          target: listings.id,
          set: {
            title: listing.title,
            description: listing.description,
            street: listing.address.street,
            number: listing.address.number,
            box: listing.address.box,
            postalCode: listing.address.postalCode,
            municipality: listing.address.municipality,
            region: listing.address.region,
            priceCents: listing.price.cents,
            currency: listing.price.currency,
            surfaceM2: listing.surface.m2,
            rooms: listing.rooms,
            status: listing.status,
            updatedAt: listing.updatedAt,
          },
        });

      await tx.delete(listingPhotos).where(eq(listingPhotos.listingId, listing.id));

      if (listing.photos.length > 0) {
        await tx.insert(listingPhotos).values(
          listing.photos.map((p) => ({
            listingId: listing.id as string,
            storageKey: p.storageKey,
            ord: p.order,
            alt: p.alt,
          })),
        );
      }
    });
  }

  async findById(id: ListingId): Promise<Listing | null> {
    const rows = await this.db
      .select()
      .from(listings)
      .where(eq(listings.id, id))
      .limit(1);

    if (rows.length === 0) return null;
    return this.hydrate(rows[0]!);
  }

  async findByIdAndOrg(id: ListingId, orgId: OrganizationId): Promise<Listing | null> {
    const rows = await this.db
      .select()
      .from(listings)
      .where(and(eq(listings.id, id), eq(listings.orgId, orgId)))
      .limit(1);

    if (rows.length === 0) return null;
    return this.hydrate(rows[0]!);
  }

  async findActiveById(id: ListingId): Promise<Listing | null> {
    const rows = await this.db
      .select()
      .from(listings)
      .where(and(eq(listings.id, id), eq(listings.status, 'active')))
      .limit(1);

    if (rows.length === 0) return null;
    return this.hydrate(rows[0]!);
  }

  async listByOrg(
    orgId: OrganizationId,
    opts: { status?: ListingStatus; cursor?: string; limit: number },
  ): Promise<PaginatedResult<Listing>> {
    const conditions = [eq(listings.orgId, orgId)];
    if (opts.status) conditions.push(eq(listings.status, opts.status));
    if (opts.cursor) {
      const { createdAt, id } = decodeCursor(opts.cursor);
      conditions.push(
        or(
          lt(listings.createdAt, createdAt),
          and(eq(listings.createdAt, createdAt), lt(listings.id, id)),
        )!,
      );
    }

    const fetchLimit = opts.limit + 1;
    const rows = await this.db
      .select()
      .from(listings)
      .where(and(...conditions))
      .orderBy(desc(listings.createdAt), desc(listings.id))
      .limit(fetchLimit);

    const hasMore = rows.length > opts.limit;
    const resultRows = hasMore ? rows.slice(0, opts.limit) : rows;
    const items = await Promise.all(resultRows.map((r) => this.hydrate(r)));

    let nextCursor: string | null = null;
    if (hasMore) {
      const last = resultRows[resultRows.length - 1]!;
      nextCursor = encodeCursor(last.createdAt, last.id);
    }

    return { items, nextCursor };
  }

  async listPublicFeed(opts: {
    cursor?: string;
    limit: number;
  }): Promise<PaginatedResult<Listing>> {
    const conditions = [eq(listings.status, 'active')];
    if (opts.cursor) {
      const { createdAt, id } = decodeCursor(opts.cursor);
      conditions.push(
        or(
          lt(listings.createdAt, createdAt),
          and(eq(listings.createdAt, createdAt), lt(listings.id, id)),
        )!,
      );
    }

    const fetchLimit = opts.limit + 1;
    const rows = await this.db
      .select()
      .from(listings)
      .where(and(...conditions))
      .orderBy(desc(listings.createdAt), desc(listings.id))
      .limit(fetchLimit);

    const hasMore = rows.length > opts.limit;
    const resultRows = hasMore ? rows.slice(0, opts.limit) : rows;
    const items = await Promise.all(resultRows.map((r) => this.hydrate(r)));

    let nextCursor: string | null = null;
    if (hasMore) {
      const last = resultRows[resultRows.length - 1]!;
      nextCursor = encodeCursor(last.createdAt, last.id);
    }

    return { items, nextCursor };
  }

  private async hydrate(row: typeof listings.$inferSelect): Promise<Listing> {
    const photos = await this.db
      .select()
      .from(listingPhotos)
      .where(eq(listingPhotos.listingId, row.id))
      .orderBy(asc(listingPhotos.ord));

    return new Listing({
      id: listingId(row.id),
      orgId: row.orgId as OrganizationId,
      createdBy: row.createdBy as UserId,
      title: row.title,
      description: row.description,
      address: address({
        street: row.street,
        number: row.number,
        box: row.box,
        postalCode: row.postalCode,
        municipality: row.municipality,
      }),
      price: price(row.priceCents, row.currency),
      surface: surface(row.surfaceM2),
      rooms: row.rooms,
      status: listingStatus(row.status),
      photos: photos.map((p) => photo({ storageKey: p.storageKey, order: p.ord, alt: p.alt })),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}

function encodeCursor(createdAt: Date, id: string): string {
  return Buffer.from(JSON.stringify({ t: createdAt.toISOString(), i: id })).toString('base64url');
}

function decodeCursor(cursor: string): { createdAt: Date; id: string } {
  const parsed = JSON.parse(Buffer.from(cursor, 'base64url').toString()) as {
    t: string;
    i: string;
  };
  return { createdAt: new Date(parsed.t), id: parsed.i };
}
