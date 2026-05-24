import { Stack } from 'expo-router';

/**
 * Stack wrapper for the profile sub-tree. ProfileProvider lives one
 * level up in `(app)/_layout.tsx` so home and other tenant tabs share
 * the same cached DTO.
 */
export default function ProfileLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
