import { randomUUID } from 'node:crypto';
import { Listing } from '../domain/listing.aggregate';
import { listingId } from '../domain/listing-id.vo';
import { address } from '../domain/address.vo';
import { pricing } from '../domain/pricing.vo';
import { surfaceBreakdown } from '../domain/surface.vo';
import { classification } from '../domain/classification.vo';
import { availability } from '../domain/availability.vo';
import { buildingProfile, EMPTY_BUILDING_PROFILE } from '../domain/building.vo';
import { roomCounts } from '../domain/room-counts.vo';
import { exterior, EMPTY_EXTERIOR } from '../domain/exterior.vo';
import { energyProfile, EMPTY_ENERGY_PROFILE } from '../domain/energy.vo';
import { interiorAmenities, EMPTY_INTERIOR_AMENITIES } from '../domain/interior-amenities.vo';
import { petPolicy, EMPTY_PET_POLICY } from '../domain/pet-policy.vo';
import {
  regulatoryPrimitives,
  EMPTY_REGULATORY_PRIMITIVES,
  EMPTY_COMPLIANCE,
  type Compliance,
  type ComplianceInput,
} from '../domain/compliance.vo';
import { getCountryInterpreter } from '../domain/country';
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
  AddRoomCommand,
  UpdateRoomCommand,
  RemoveRoomCommand,
  ReorderRoomsCommand,
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
    const listing = new Listing({
      id: listingId(randomUUID()),
      orgId: cmd.orgId,
      createdBy: cmd.createdBy,
      description: cmd.description,
      address: address(cmd.address),
      classification: classification(cmd.classification),
      availability: availability(cmd.availability ?? {}),
      pricing: pricing(cmd.pricing),
      surface: surfaceBreakdown(cmd.surface),
      building: cmd.building ? buildingProfile(cmd.building) : EMPTY_BUILDING_PROFILE,
      roomCounts: roomCounts(cmd.roomCounts),
      exterior: cmd.exterior ? exterior(cmd.exterior) : EMPTY_EXTERIOR,
      energy: cmd.energy ? energyProfile(cmd.energy) : EMPTY_ENERGY_PROFILE,
      interior: cmd.interior ? interiorAmenities(cmd.interior) : EMPTY_INTERIOR_AMENITIES,
      petPolicy: cmd.petPolicy ? petPolicy(cmd.petPolicy) : EMPTY_PET_POLICY,
      regulatory: cmd.regulatory ? regulatoryPrimitives(cmd.regulatory) : EMPTY_REGULATORY_PRIMITIVES,
      compliance: buildCompliance(cmd.address.country ?? 'BE', cmd.compliance),
      status: 'draft',
      photos: [],
      rooms: [],
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
      surface: cmd.surface,
      roomCounts: cmd.roomCounts,
      building: cmd.building,
      exterior: cmd.exterior,
      energy: cmd.energy,
      interior: cmd.interior,
      petPolicy: cmd.petPolicy,
      regulatory: cmd.regulatory,
      compliance: cmd.compliance ? buildCompliance(listing.address.country, cmd.compliance) : undefined,
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

  async addRoom(cmd: AddRoomCommand): Promise<Listing> {
    const listing = await this.repo.findByIdAndOrg(cmd.listingId, cmd.orgId);
    if (!listing) throw new ListingNotFoundError();
    listing.addRoom({
      id: randomUUID(),
      roomType: cmd.roomType,
      label: cmd.label ?? null,
      surfaceM2: cmd.surfaceM2 ?? null,
    });
    await this.repo.save(listing);
    return listing;
  }

  async updateRoom(cmd: UpdateRoomCommand): Promise<Listing> {
    const listing = await this.repo.findByIdAndOrg(cmd.listingId, cmd.orgId);
    if (!listing) throw new ListingNotFoundError();
    listing.updateRoom({
      id: cmd.roomId,
      label: cmd.label,
      surfaceM2: cmd.surfaceM2,
    });
    await this.repo.save(listing);
    return listing;
  }

  async removeRoom(cmd: RemoveRoomCommand): Promise<void> {
    const listing = await this.repo.findByIdAndOrg(cmd.listingId, cmd.orgId);
    if (!listing) throw new ListingNotFoundError();
    listing.removeRoom(cmd.roomId);
    await this.repo.save(listing);
  }

  async reorderRooms(cmd: ReorderRoomsCommand): Promise<void> {
    const listing = await this.repo.findByIdAndOrg(cmd.listingId, cmd.orgId);
    if (!listing) throw new ListingNotFoundError();
    listing.reorderRooms(cmd.roomType, cmd.roomIds);
    await this.repo.save(listing);
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

function buildCompliance(country: string, input: ComplianceInput | undefined): Compliance {
  const interpreter = getCountryInterpreter(country);
  const countryExtras = interpreter.parseExtras(input?.countryExtras ?? {});
  if (!input) {
    return { ...EMPTY_COMPLIANCE, countryExtras };
  }
  return {
    epcUniqueCode: input.epcUniqueCode ?? null,
    yearlyTheoreticalEnergyKwh: input.yearlyTheoreticalEnergyKwh ?? null,
    mandatoryRenovationWorks: input.mandatoryRenovationWorks ?? null,
    asbestosCertificateAvailable: input.asbestosCertificateAvailable ?? null,
    asBuiltAttest: input.asBuiltAttest ?? null,
    fuelTankConformityCertificate: input.fuelTankConformityCertificate ?? null,
    hasBuildingPermit: input.hasBuildingPermit ?? null,
    hasParcelPermit: input.hasParcelPermit ?? null,
    hasPreemptiveRight: input.hasPreemptiveRight ?? null,
    tenantPreemptiveRight: input.tenantPreemptiveRight ?? null,
    hasUrbanismViolationSummons: input.hasUrbanismViolationSummons ?? null,
    mostRecentUrbanismDesignation: input.mostRecentUrbanismDesignation ?? null,
    syndicusName: input.syndicusName ?? null,
    coOwnershipShare: input.coOwnershipShare ?? null,
    isRealEstateInvestment: input.isRealEstateInvestment ?? null,
    countryExtras,
  };
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
