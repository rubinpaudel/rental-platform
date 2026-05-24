import type { OrganizationId } from '../../identity/domain/organization-id.vo';
import type { UserId } from '../../identity/domain/user-id.vo';
import type { ListingId } from '../domain/listing-id.vo';
import type { AddressInput } from '../domain/address.vo';
import type { ClassificationInput } from '../domain/classification.vo';
import type { AvailabilityInput } from '../domain/availability.vo';
import type { PricingInput } from '../domain/pricing.vo';
import type { SurfaceBreakdownInput } from '../domain/surface.vo';
import type { BuildingInput } from '../domain/building.vo';
import type { RoomCountsInput } from '../domain/room-counts.vo';
import type { ExteriorInput } from '../domain/exterior.vo';
import type { EnergyInput } from '../domain/energy.vo';
import type { InteriorAmenitiesInput } from '../domain/interior-amenities.vo';
import type { PetPolicyInput } from '../domain/pet-policy.vo';

export interface CreateListingCommand {
  orgId: OrganizationId;
  createdBy: UserId;
  description: string;
  address: AddressInput;
  classification: ClassificationInput;
  availability?: AvailabilityInput | undefined;
  pricing: PricingInput;
  surface: SurfaceBreakdownInput;
  roomCounts: RoomCountsInput;
  building?: BuildingInput | undefined;
  exterior?: ExteriorInput | undefined;
  energy?: EnergyInput | undefined;
  interior?: InteriorAmenitiesInput | undefined;
  petPolicy?: PetPolicyInput | undefined;
}

export interface UpdateListingCommand {
  id: ListingId;
  orgId: OrganizationId;
  description?: string | undefined;
  address?: AddressInput | undefined;
  classification?: ClassificationInput | undefined;
  availability?: AvailabilityInput | undefined;
  pricing?: PricingInput | undefined;
  surface?: SurfaceBreakdownInput | undefined;
  roomCounts?: RoomCountsInput | undefined;
  building?: BuildingInput | undefined;
  exterior?: ExteriorInput | undefined;
  energy?: EnergyInput | undefined;
  interior?: InteriorAmenitiesInput | undefined;
  petPolicy?: PetPolicyInput | undefined;
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

export interface AddRoomCommand {
  listingId: ListingId;
  orgId: OrganizationId;
  roomType: string;
  label?: string | null;
  surfaceM2?: number | null;
}

export interface UpdateRoomCommand {
  listingId: ListingId;
  orgId: OrganizationId;
  roomId: string;
  label?: string | null | undefined;
  surfaceM2?: number | null | undefined;
}

export interface RemoveRoomCommand {
  listingId: ListingId;
  orgId: OrganizationId;
  roomId: string;
}

export interface ReorderRoomsCommand {
  listingId: ListingId;
  orgId: OrganizationId;
  roomType: string;
  roomIds: string[];
}
