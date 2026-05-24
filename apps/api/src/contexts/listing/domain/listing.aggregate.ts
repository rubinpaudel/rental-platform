import type { ListingId } from './listing-id.vo';
import type { OrganizationId } from '../../identity/domain/organization-id.vo';
import type { UserId } from '../../identity/domain/user-id.vo';
import type { Address, AddressInput } from './address.vo';
import { address } from './address.vo';
import type { Pricing, PricingInput } from './pricing.vo';
import { pricing } from './pricing.vo';
import type { SurfaceBreakdown, SurfaceBreakdownInput } from './surface.vo';
import { surfaceBreakdown } from './surface.vo';
import type { Classification, ClassificationInput } from './classification.vo';
import { classification } from './classification.vo';
import type { Availability, AvailabilityInput } from './availability.vo';
import { availability } from './availability.vo';
import type { BuildingProfile, BuildingInput } from './building.vo';
import { buildingProfile } from './building.vo';
import type { RoomCounts, RoomCountsInput } from './room-counts.vo';
import { roomCounts } from './room-counts.vo';
import type { Exterior, ExteriorInput } from './exterior.vo';
import { exterior } from './exterior.vo';
import type { RoomDetail } from './room-detail.vo';
import { roomDetail } from './room-detail.vo';
import type { ListingStatus } from './listing-status.vo';
import type { Photo } from './photo.vo';
import { photo } from './photo.vo';
import type { ListingEvent } from './listing.events';

const MAX_PHOTOS = 20;
const MAX_ROOMS = 40;

export interface ListingProps {
  id: ListingId;
  orgId: OrganizationId;
  createdBy: UserId;
  description: string;
  address: Address;
  classification: Classification;
  availability: Availability;
  pricing: Pricing;
  surface: SurfaceBreakdown;
  building: BuildingProfile;
  roomCounts: RoomCounts;
  exterior: Exterior;
  status: ListingStatus;
  photos: Photo[];
  rooms: RoomDetail[];
  createdAt: Date;
  updatedAt: Date;
}

export class Listing {
  readonly id: ListingId;
  readonly orgId: OrganizationId;
  readonly createdBy: UserId;
  description: string;
  address: Address;
  classification: Classification;
  availability: Availability;
  pricing: Pricing;
  surface: SurfaceBreakdown;
  building: BuildingProfile;
  roomCounts: RoomCounts;
  exterior: Exterior;
  status: ListingStatus;
  photos: Photo[];
  rooms: RoomDetail[];
  createdAt: Date;
  updatedAt: Date;

  private readonly events: ListingEvent[] = [];

  constructor(props: ListingProps) {
    this.id = props.id;
    this.orgId = props.orgId;
    this.createdBy = props.createdBy;
    this.description = props.description;
    this.address = props.address;
    this.classification = props.classification;
    this.availability = props.availability;
    this.pricing = props.pricing;
    this.surface = props.surface;
    this.building = props.building;
    this.roomCounts = props.roomCounts;
    this.exterior = props.exterior;
    this.status = props.status;
    this.photos = [...props.photos];
    this.rooms = [...props.rooms];
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  patch(input: {
    description?: string | undefined;
    address?: AddressInput | undefined;
    classification?: ClassificationInput | undefined;
    availability?: AvailabilityInput | undefined;
    pricing?: PricingInput | undefined;
    surface?: SurfaceBreakdownInput | undefined;
    building?: BuildingInput | undefined;
    roomCounts?: RoomCountsInput | undefined;
    exterior?: ExteriorInput | undefined;
  }): void {
    if (input.description !== undefined) this.description = input.description;
    if (input.address) this.address = address(input.address);
    if (input.classification) this.classification = classification(input.classification);
    if (input.availability) this.availability = availability(input.availability);
    if (input.pricing) this.pricing = pricing(input.pricing);
    if (input.surface) this.surface = surfaceBreakdown(input.surface);
    if (input.building) this.building = buildingProfile(input.building);
    if (input.roomCounts) this.roomCounts = roomCounts(input.roomCounts);
    if (input.exterior) this.exterior = exterior(input.exterior);
    this.updatedAt = new Date();
  }

  activate(): void {
    if (this.status === 'closed') throw new Error('Cannot activate a closed listing');
    this.status = 'active';
    this.updatedAt = new Date();
    this.events.push({ type: 'ListingActivated', listingId: this.id, occurredAt: this.updatedAt });
  }

  deactivate(): void {
    if (this.status === 'closed') throw new Error('Cannot deactivate a closed listing');
    this.status = 'inactive';
    this.updatedAt = new Date();
    this.events.push({
      type: 'ListingDeactivated',
      listingId: this.id,
      occurredAt: this.updatedAt,
    });
  }

  close(): void {
    this.status = 'closed';
    this.updatedAt = new Date();
    this.events.push({ type: 'ListingClosed', listingId: this.id, occurredAt: this.updatedAt });
  }

  addPhoto(storageKey: string, alt: string | null): void {
    if (this.photos.length >= MAX_PHOTOS) {
      throw new Error(`Maximum ${MAX_PHOTOS} photos allowed`);
    }
    if (this.photos.some((p) => p.storageKey === storageKey)) {
      throw new Error('Photo with this storage key already exists');
    }
    const nextOrder = this.photos.length > 0 ? Math.max(...this.photos.map((p) => p.order)) + 1 : 0;
    this.photos.push(photo({ storageKey, order: nextOrder, alt }));
    this.updatedAt = new Date();
  }

  removePhoto(storageKey: string): void {
    const idx = this.photos.findIndex((p) => p.storageKey === storageKey);
    if (idx === -1) throw new Error('Photo not found');
    this.photos.splice(idx, 1);
    this.photos.forEach((p, i) => {
      (this.photos[i] as { order: number }).order = i;
    });
    this.updatedAt = new Date();
  }

  reorderPhotos(storageKeys: string[]): void {
    if (storageKeys.length !== this.photos.length) {
      throw new Error('Must provide all existing storage keys');
    }
    const byKey = new Map(this.photos.map((p) => [p.storageKey, p]));
    for (const key of storageKeys) {
      if (!byKey.has(key)) throw new Error(`Unknown storage key: ${key}`);
    }
    this.photos = storageKeys.map((key, i) =>
      photo({ storageKey: key, order: i, alt: byKey.get(key)!.alt }),
    );
    this.updatedAt = new Date();
  }

  addRoom(input: { id: string; roomType: string; label: string | null; surfaceM2: number | null }): void {
    if (this.rooms.length >= MAX_ROOMS) {
      throw new Error(`Maximum ${MAX_ROOMS} rooms allowed`);
    }
    if (this.rooms.some((r) => r.id === input.id)) {
      throw new Error('Room with this id already exists');
    }
    const sameType = this.rooms.filter((r) => r.roomType === input.roomType);
    const nextOrder = sameType.length > 0 ? Math.max(...sameType.map((r) => r.order)) + 1 : 0;
    this.rooms.push(
      roomDetail({
        id: input.id,
        roomType: input.roomType,
        label: input.label,
        surfaceM2: input.surfaceM2,
        order: nextOrder,
      }),
    );
    this.updatedAt = new Date();
  }

  updateRoom(input: {
    id: string;
    label?: string | null | undefined;
    surfaceM2?: number | null | undefined;
  }): void {
    const idx = this.rooms.findIndex((r) => r.id === input.id);
    if (idx === -1) throw new Error('Room not found');
    const current = this.rooms[idx]!;
    this.rooms[idx] = roomDetail({
      id: current.id,
      roomType: current.roomType,
      label: input.label === undefined ? current.label : input.label,
      surfaceM2: input.surfaceM2 === undefined ? current.surfaceM2 : input.surfaceM2,
      order: current.order,
    });
    this.updatedAt = new Date();
  }

  removeRoom(id: string): void {
    const idx = this.rooms.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Room not found');
    const removed = this.rooms[idx]!;
    this.rooms.splice(idx, 1);
    // Re-index orders within the same roomType to stay contiguous from 0.
    const sameType = this.rooms.filter((r) => r.roomType === removed.roomType);
    sameType
      .sort((a, b) => a.order - b.order)
      .forEach((r, i) => {
        (r as { order: number }).order = i;
      });
    this.updatedAt = new Date();
  }

  reorderRooms(roomType: string, ids: string[]): void {
    const sameType = this.rooms.filter((r) => r.roomType === roomType);
    if (ids.length !== sameType.length) {
      throw new Error('Must provide all existing room ids for this roomType');
    }
    const byId = new Map(sameType.map((r) => [r.id, r]));
    for (const id of ids) {
      if (!byId.has(id)) throw new Error(`Unknown room id: ${id}`);
    }
    ids.forEach((id, i) => {
      const room = byId.get(id)!;
      (room as { order: number }).order = i;
    });
    this.updatedAt = new Date();
  }

  pullEvents(): ListingEvent[] {
    return this.events.splice(0);
  }
}
