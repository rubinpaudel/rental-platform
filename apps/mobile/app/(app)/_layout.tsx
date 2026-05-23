import { Stack } from 'expo-router';
import { useSession } from '@/lib/auth/auth-client';
import { userRoleOf } from '@/lib/auth/user-role';
import { TenantOnlyScreen } from '@/features/home/tenant-only-screen';

/**
 * Tenants-only gate. A signed-in landlord (shared device, role mismatch)
 * sees a "use the web app" screen instead of any tenant route. The auth
 * split in the root layout has already ensured a session exists by here.
 */
export default function AppLayout() {
  const { data: session } = useSession();
  if (userRoleOf(session?.user) === 'landlord') {
    return <TenantOnlyScreen />;
  }
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#ffffff' },
      }}
    />
  );
}
