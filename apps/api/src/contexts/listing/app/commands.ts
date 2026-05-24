import type { OrganizationId } from '../../identity/domain/organization-id.vo';
import type { UserId } from '../../identity/domain/user-id.vo';
import type { ListingId } from '../domain/listing-id.vo';

export interface AddressInput {
  street: string;
  number: string;
  box?: string | null;
  postalCode: string;
  municipality: string;
}

export interface ClassificationInput {
  listingType: string;
  propertyType: string;
  leaseType?: string | null;
  minLeaseMonths?: number | null;
}

export interface AvailabilityInput {
  availableFrom?: string | null;
  availableImmediately?: boolean | null;
  viewingMode?: string | null;
}

export interface PricingInput {
  priceCents: number;
  chargesCents?: number | null;
  syndicCents?: number | null;
  depositCents?: number | null;
  agencyFeeCents?: number | null;
  includesUtilities?: boolean | null;
  currency?: string;
}

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
