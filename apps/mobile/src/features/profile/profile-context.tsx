import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type {
  ProfileDto,
  ProfilePatch,
} from '@rental-platform/profile-schema';
import {
  fetchProfile,
  patchProfile,
  ProfileApiError,
} from '@/lib/api/profile';

// Single in-app cache of the tenant's profile. Mounted high in the
// (app) tree so the wizard and the section-edit screens share one
// fetched value; every PATCH returns the fresh DTO and we just swap it
// in, so the completeness ring updates within the same render the
// server acknowledges the change.

interface ProfileContextValue {
  profile: ProfileDto | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  applyPatch: (patch: ProfilePatch) => Promise<ProfileDto>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

interface ProviderProps {
  children: ReactNode;
  /**
   * When false (no signed-in tenant), the provider holds an empty state
   * and skips the initial fetch — the (auth) tree doesn't need the
   * profile. Flip to true once the session is known.
   */
  enabled: boolean;
}

export function ProfileProvider({ children, enabled }: ProviderProps) {
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);
  // Bumps every time the user pulls-to-refresh; useEffect listens.
  const [refreshTick, setRefreshTick] = useState(0);
  // Guard against late responses overwriting newer state (PATCH races
  // with a stale GET, signout invalidates an in-flight fetch).
  const generation = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setProfile(null);
      setError(null);
      setIsLoading(false);
      return;
    }
    const gen = ++generation.current;
    setIsLoading(true);
    setError(null);
    fetchProfile()
      .then((dto) => {
        if (gen !== generation.current) return;
        setProfile(dto);
      })
      .catch((err: unknown) => {
        if (gen !== generation.current) return;
        setError(
          err instanceof ProfileApiError
            ? err.friendly
            : 'Profiel kon niet worden geladen.',
        );
      })
      .finally(() => {
        if (gen !== generation.current) return;
        setIsLoading(false);
      });
  }, [enabled, refreshTick]);

  const refetch = useCallback(async () => {
    setRefreshTick((t) => t + 1);
  }, []);

  const applyPatch = useCallback(async (patch: ProfilePatch) => {
    // PATCH always returns the canonical DTO — we don't optimistically
    // update because the server normalises (trims names, formats phone
    // to E.164, etc.) and we want the wizard to display what it stored.
    const updated = await patchProfile(patch);
    generation.current += 1;
    setProfile(updated);
    return updated;
  }, []);

  const value = useMemo<ProfileContextValue>(
    () => ({ profile, isLoading, error, refetch, applyPatch }),
    [profile, isLoading, error, refetch, applyPatch],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('useProfile must be used inside <ProfileProvider>');
  }
  return ctx;
}
