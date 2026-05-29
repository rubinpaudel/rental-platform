import type { AddressInput } from '../domain/address.vo';
import type { ClassificationInput } from '../domain/classification.vo';
import type { AvailabilityInput } from '../domain/availability.vo';
import type { PricingInput } from '../domain/pricing.vo';

export interface CreateListingBody {
  description: string;
  address: AddressInput;
  classification: ClassificationInput;
  availability?: AvailabilityInput;
  pricing: PricingInput;
  surfaceM2: number;
  bedrooms: number;
}

export interface UpdateListingBody {
  description?: string;
  address?: AddressInput;
  classification?: ClassificationInput;
  availability?: AvailabilityInput;
  pricing?: PricingInput;
  surfaceM2?: number;
  bedrooms?: number;
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
