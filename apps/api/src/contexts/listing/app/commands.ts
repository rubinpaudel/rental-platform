import type { OrganizationId } from '../../identity/domain/organization-id.vo';
import type { UserId } from '../../identity/domain/user-id.vo';
import type { ListingId } from '../domain/listing-id.vo';

export interface CreateListingCommand {
  orgId: OrganizationId;
  createdBy: UserId;
  title: string;
  description: string;
  address: {
    street: string;
    number: string;
    box?: string | null;
    postalCode: string;
    municipality: string;
  };
  priceCents: number;
  surfaceM2: number;
  rooms: number;
}

export interface UpdateListingCommand {
  id: ListingId;
  orgId: OrganizationId;
  title?: string;
  description?: string;
  address?: {
    street: string;
    number: string;
    box?: string | null;
    postalCode: string;
    municipality: string;
  };
  priceCents?: number;
  surfaceM2?: number;
  rooms?: number;
}

export interface ActivateListingCommand {
  id: ListingId;
  orgId: OrganizationId;
}

export interface DeactivateListingCommand {
  id: ListingId;
  orgId: OrganizationId;
}

export interface DeleteListingCommand {
  id: ListingId;
  orgId: OrganizationId;
}

export interface AddPhotoCommand {
  listingId: ListingId;
  orgId: OrganizationId;
  storageKey: string;
  alt: string | null;
}

export interface RemovePhotoCommand {
  listingId: ListingId;
  orgId: OrganizationId;
  storageKey: string;
}

export interface ReorderPhotosCommand {
  listingId: ListingId;
  orgId: OrganizationId;
  storageKeys: string[];
}

export interface PresignPhotoUploadCommand {
  listingId: ListingId;
  orgId: OrganizationId;
  filename: string;
  contentType: string;
}
