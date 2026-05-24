import type { UserId } from '../../identity/domain/user-id.vo';
import type { Profile } from './profile.aggregate';

export interface ProfileRepo {
  findByUser(id: UserId): Promise<Profile | null>;
  upsert(profile: Profile): Promise<void>;
}

export const PROFILE_REPO = Symbol('ProfileRepo');
