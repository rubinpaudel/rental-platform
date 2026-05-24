import { randomUUID } from 'node:crypto';
import { Listing } from '../domain/listing.aggregate';
import { listingId } from '../domain/listing-id.vo';
import { address } from '../domain/address.vo';
import { pricing } from '../domain/pricing.vo';
import { surface } from '../domain/surface.vo';
import { classification } from '../domain/classification.vo';
import { availability } from '../domain/availability.vo';
import type { ListingRepo } from '../domain/listing.repo';
import type { StoragePort } from '@rental-platform/storage';
import type {
  CreateListingCommand,
  UpdateListingCommand,
  ActivateListingCommand,
  DeactivateListingCommand,
  DeleteListingCommand,
  AddPhotoCommand,
  RemovePhotoCommand,
  ReorderPhotosCommand,
  PresignPhotoUploadCommand,
} from './commands';
import type {
  GetListingQuery,
  ListMyOrgListingsQuery,
  ListPublicFeedQuery,
  GetPublicListingQuery,
} from './queries';
import type { PaginatedResult } from '../domain/listing.repo';

export class ListingService {
  constructor(
    private readonly repo: ListingRepo,
    private readonly storage: StoragePort,
  ) {}

  async create(cmd: CreateListingCommand): Promise<Listing> {
    const now = new Date();
    if (!Number.isInteger(cmd.bedrooms) || cmd.bedrooms < 0) {
      throw new Error('bedrooms must be a non-negative integer');
    }
    const listing = new Listing({
      id: listingId(randomUUID()),
      orgId: cmd.orgId,
      createdBy: cmd.createdBy,
      description: cmd.description,
      address: address(cmd.address),
      classification: classification(cmd.classification),
      availability: availability(cmd.availability ?? {}),
      pricing: pricing(cmd.pricing),
      surface: surface(cmd.surfaceM2),
      bedrooms: cmd.bedrooms,
      status: 'draft',
      photos: [],
      createdAt: now,
      updatedAt: now,
    });
    await this.repo.save(listing);
    return listing;
  }

  async update(cmd: UpdateListingCommand): Promise<Listing> {
    const listing = await this.repo.findByIdAndOrg(cmd.id, cmd.orgId);
    if (!listing) throw new ListingNotFoundError();
    if (listing.status === 'closed') throw new ListingClosedError();

    listing.patch({
      description: cmd.description,
      address: cmd.address,
      classification: cmd.classification,
      availability: cmd.availability,
      pricing: cmd.pricing,
      surfaceM2: cmd.surfaceM2,
      bedrooms: cmd.bedrooms,
    });

    await this.repo.save(listing);
    return listing;
  }

  async activate(cmd: ActivateListingCommand): Promise<void> {
    const listing = await this.repo.findByIdAndOrg(cmd.id, cmd.orgId);
    if (!listing) throw new ListingNotFoundError();
    listing.activate();
    await this.repo.save(listing);
  }

  async deactivate(cmd: DeactivateListingCommand): Promise<void> {
    const listing = await this.repo.findByIdAndOrg(cmd.id, cmd.orgId);
    if (!listing) throw new ListingNotFoundError();
    listing.deactivate();
    await this.repo.save(listing);
  }

  async delete(cmd: DeleteListingCommand): Promise<void> {
    const listing = await this.repo.findByIdAndOrg(cmd.id, cmd.orgId);
    if (!listing) throw new ListingNotFoundError();
    listing.close();
    await this.repo.save(listing);
  }

  async addPhoto(cmd: AddPhotoCommand): Promise<void> {
    const listing = await this.repo.findByIdAndOrg(cmd.listingId, cmd.orgId);
    if (!listing) throw new ListingNotFoundError();
    listing.addPhoto(cmd.storageKey, cmd.alt);
    await this.repo.save(listing);
  }

  async removePhoto(cmd: RemovePhotoCommand): Promise<void> {
    const listing = await this.repo.findByIdAndOrg(cmd.listingId, cmd.orgId);
    if (!listing) throw new ListingNotFoundError();
    listing.removePhoto(cmd.storageKey);
    await this.repo.save(listing);
  }

  async reorderPhotos(cmd: ReorderPhotosCommand): Promise<void> {
    const listing = await this.repo.findByIdAndOrg(cmd.listingId, cmd.orgId);
    if (!listing) throw new ListingNotFoundError();
    listing.reorderPhotos(cmd.storageKeys);
    await this.repo.save(listing);
  }

  async presignPhotoUpload(
    cmd: PresignPhotoUploadCommand,
  ): Promise<{ url: string; storageKey: string }> {
    const listing = await this.repo.findByIdAndOrg(cmd.listingId, cmd.orgId);
    if (!listing) throw new ListingNotFoundError();

    const ext = cmd.filename.includes('.') ? cmd.filename.split('.').pop() : 'bin';
    const storageKey = `listings/${listing.orgId}/${listing.id}/${randomUUID()}.${ext}`;
    const url = await this.storage.getSignedUrl(storageKey, 'put', 900);
    return { url, storageKey };
  }

  async getListing(query: GetListingQuery): Promise<Listing> {
    const listing = await this.repo.findByIdAndOrg(query.id, query.orgId);
    if (!listing) throw new ListingNotFoundError();
    return listing;
  }

  async listMyOrgListings(query: ListMyOrgListingsQuery): Promise<PaginatedResult<Listing>> {
    return this.repo.listByOrg(query.orgId, {
      status: query.status,
      cursor: query.cursor,
      limit: query.limit,
    });
  }

  async listPublicFeed(query: ListPublicFeedQuery): Promise<PaginatedResult<Listing>> {
    return this.repo.listPublicFeed({ cursor: query.cursor, limit: query.limit });
  }

  async getPublicListing(query: GetPublicListingQuery): Promise<Listing> {
    const listing = await this.repo.findActiveById(query.id);
    if (!listing) throw new ListingNotFoundError();
    return listing;
  }
}

export class ListingNotFoundError extends Error {
  constructor() {
    super('Listing not found');
    this.name = 'ListingNotFoundError';
  }
}

export class ListingClosedError extends Error {
  constructor() {
    super('Cannot modify a closed listing');
    this.name = 'ListingClosedError';
  }
}
