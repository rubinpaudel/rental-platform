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
import type { RegulatoryInput, ComplianceInput } from '../domain/compliance.vo';

export interface CreateListingBody {
  description: string;
  address: AddressInput;
  classification: ClassificationInput;
  availability?: AvailabilityInput;
  pricing: PricingInput;
  surface: SurfaceBreakdownInput;
  roomCounts: RoomCountsInput;
  building?: BuildingInput;
  exterior?: ExteriorInput;
  energy?: EnergyInput;
  interior?: InteriorAmenitiesInput;
  petPolicy?: PetPolicyInput;
  regulatory?: RegulatoryInput;
  compliance?: ComplianceInput;
}

export interface UpdateListingBody {
  description?: string;
  address?: AddressInput;
  classification?: ClassificationInput;
  availability?: AvailabilityInput;
  pricing?: PricingInput;
  surface?: SurfaceBreakdownInput;
  roomCounts?: RoomCountsInput;
  building?: BuildingInput;
  exterior?: ExteriorInput;
  energy?: EnergyInput;
  interior?: InteriorAmenitiesInput;
  petPolicy?: PetPolicyInput;
  regulatory?: RegulatoryInput;
  compliance?: ComplianceInput;
}

export interface PresignPhotoBody {
  filename: string;
  contentType: string;
}

export interface AddPhotoBody {
  storageKey: string;
  alt?: string;
}

export interface ReorderPhotosBody {
  storageKeys: string[];
}

export interface AddRoomBody {
  roomType: string;
  label?: string | null;
  surfaceM2?: number | null;
}

export interface UpdateRoomBody {
  label?: string | null;
  surfaceM2?: number | null;
}

export interface ReorderRoomsBody {
  roomType: string;
  roomIds: string[];
}
