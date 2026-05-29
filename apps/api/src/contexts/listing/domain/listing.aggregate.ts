import type { ListingId } from './listing-id.vo';
import type { OrganizationId } from '../../identity/domain/organization-id.vo';
import type { UserId } from '../../identity/domain/user-id.vo';
import type { Address, AddressInput } from './address.vo';
import { address } from './address.vo';
import type { Pricing, PricingInput } from './pricing.vo';
import { pricing } from './pricing.vo';
import type { Surface } from './surface.vo';
import { surface } from './surface.vo';
import type { Classification, ClassificationInput } from './classification.vo';
import { classification } from './classification.vo';
import type { Availability, AvailabilityInput } from './availability.vo';
import { availability } from './availability.vo';
import type { ListingStatus } from './listing-status.vo';
import type { Photo } from './photo.vo';
import { photo } from './photo.vo';
import type { ListingEvent } from './listing.events';

const MAX_PHOTOS = 20;

function assertBedrooms(value: number): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error('bedrooms must be a non-negative integer');
  }
}

export interface ListingProps {
  id: ListingId;
  orgId: OrganizationId;
  createdBy: UserId;
  description: string;
  address: Address;
  classification: Classification;
  availability: Availability;
  pricing: Pricing;
  surface: Surface;
  bedrooms: number;
  status: ListingStatus;
  photos: Photo[];
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
  surface: Surface;
  bedrooms: number;
  status: ListingStatus;
  photos: Photo[];
  createdAt: Date;
  updatedAt: Date;

  private readonly events: ListingEvent[] = [];

  constructor(props: ListingProps) {
    assertBedrooms(props.bedrooms);
    this.id = props.id;
    this.orgId = props.orgId;
    this.createdBy = props.createdBy;
    this.description = props.description;
    this.address = props.address;
    this.classification = props.classification;
    this.availability = props.availability;
    this.pricing = props.pricing;
    this.surface = props.surface;
    this.bedrooms = props.bedrooms;
    this.status = props.status;
    this.photos = [...props.photos];
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  patch(input: {
    description?: string | undefined;
    address?: AddressInput | undefined;
    classification?: ClassificationInput | undefined;
    availability?: AvailabilityInput | undefined;
    pricing?: PricingInput | undefined;
    surfaceM2?: number | undefined;
    bedrooms?: number | undefined;
  }): void {
    if (input.description !== undefined) this.description = input.description;
    if (input.address) this.address = address(input.address);
    if (input.classification) this.classification = classification(input.classification);
    if (input.availability) this.availability = availability(input.availability);
    if (input.pricing) this.pricing = pricing(input.pricing);
    if (input.surfaceM2 !== undefined) this.surface = surface(input.surfaceM2);
    if (input.bedrooms !== undefined) {
      assertBedrooms(input.bedrooms);
      this.bedrooms = input.bedrooms;
    }
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

  pullEvents(): ListingEvent[] {
    return this.events.splice(0);
  }
}
