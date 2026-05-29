import type { OrganizationId } from '../../identity/domain/organization-id.vo';
import type { UserId } from '../../identity/domain/user-id.vo';
import type { ListingId } from '../domain/listing-id.vo';
import type { AddressInput } from '../domain/address.vo';
import type { ClassificationInput } from '../domain/classification.vo';
import type { AvailabilityInput } from '../domain/availability.vo';
import type { PricingInput } from '../domain/pricing.vo';

export interface CreateListingCommand {
  orgId: OrganizationId;
  createdBy: UserId;
  description: string;
  address: AddressInput;
  classification: ClassificationInput;
  availability?: AvailabilityInput | undefined;
  pricing: PricingInput;
  surfaceM2: number;
  bedrooms: number;
}

export interface UpdateListingCommand {
  id: ListingId;
  orgId: OrganizationId;
  description?: string | undefined;
  address?: AddressInput | undefined;
  classification?: ClassificationInput | undefined;
  availability?: AvailabilityInput | undefined;
  pricing?: PricingInput | undefined;
  surfaceM2?: number | undefined;
  bedrooms?: number | undefined;
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
