import type { ListingId } from './listing-id.vo';
import type { OrganizationId } from '../../identity/domain/organization-id.vo';
import type { UserId } from '../../identity/domain/user-id.vo';
import type { Address } from './address.vo';
import type { Price } from './price.vo';
import type { Surface } from './surface.vo';
import type { ListingStatus } from './listing-status.vo';
import type { Photo } from './photo.vo';
import { photo } from './photo.vo';
import type { ListingEvent } from './listing.events';

const MAX_PHOTOS = 20;

export interface ListingProps {
  id: ListingId;
  orgId: OrganizationId;
  createdBy: UserId;
  title: string;
  description: string;
  address: Address;
  price: Price;
  surface: Surface;
  rooms: number;
  status: ListingStatus;
  photos: Photo[];
  createdAt: Date;
  updatedAt: Date;
}

export class Listing {
  readonly id: ListingId;
  readonly orgId: OrganizationId;
  readonly createdBy: UserId;
  title: string;
  description: string;
  address: Address;
  price: Price;
  surface: Surface;
  rooms: number;
  status: ListingStatus;
  photos: Photo[];
  createdAt: Date;
  updatedAt: Date;

  private readonly events: ListingEvent[] = [];

  constructor(props: ListingProps) {
    this.id = props.id;
    this.orgId = props.orgId;
    this.createdBy = props.createdBy;
    this.title = props.title;
    this.description = props.description;
    this.address = props.address;
    this.price = props.price;
    this.surface = props.surface;
    this.rooms = props.rooms;
    this.status = props.status;
    this.photos = [...props.photos];
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
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
