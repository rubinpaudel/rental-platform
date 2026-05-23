import type { UserId } from '../../identity/domain/user-id.vo';
import type { RentalProfile } from './rental-profile.aggregate';

export interface RentalProfileRepo {
  findByUser(id: UserId): Promise<RentalProfile | null>;
  upsert(profile: RentalProfile): Promise<void>;
}

export const RENTAL_PROFILE_REPO = Symbol('RentalProfileRepo');
