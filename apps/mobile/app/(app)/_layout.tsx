import { useEffect } from 'react';
import { View, type ViewProps } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useSession } from '@/lib/auth/auth-client';
import { userRoleOf } from '@/lib/auth/user-role';
import { TenantOnlyScreen } from '@/features/home/tenant-only-screen';
import { ProfileProvider, useProfile } from '@/features/profile/profile-context';
import { hasUnansweredRequired } from '@/features/profile/wizard/use-resume-step';

/**
 * Tenants-only gate. A signed-in landlord (shared device, role mismatch)
 * sees a "use the web app" screen instead of any tenant route. The auth
 * split in the root layout has already ensured a session exists by here.
 *
 * Wraps every tenant route in `ProfileProvider` so the home screen,
 * profile overview, and wizard share one cached DTO. `ProfileGate`
 * forces tenants with any unanswered required step into the wizard —
 * onboarding is not skippable, but they can navigate freely once the
 * minimum is on file.
 */
export default function AppLayout() {
  const { data: session } = useSession();
  const role = userRoleOf(session?.user);

  if (role === 'landlord') return <TenantOnlyScreen />;

  return (
    <ProfileProvider enabled={role === 'tenant'}>
      <ProfileGate>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#ffffff' },
          }}
        />
      </ProfileGate>
    </ProfileProvider>
  );
}

function ProfileGate({ children }: { children: ViewProps['children'] }) {
  const { profile, isLoading } = useProfile();
  const router = useRouter();
  const segments = useSegments();
  const inWizard = segments.some((s) => s === 'wizard');

  // Force-redirect into the wizard whenever a required step is still
  // unanswered AND the user isn't already there. The redirect happens
  // post-render via useEffect so navigation state has settled.
  useEffect(() => {
    if (isLoading || !profile) return;
    if (!inWizard && hasUnansweredRequired(profile)) {
      router.replace('/profile/wizard');
    }
  }, [isLoading, profile, inWizard, router]);

  // Until we know where the user belongs, render a page-coloured
  // backdrop — avoids a flash of the home screen for first-launch
  // tenants who are about to be punted into the wizard.
  const shouldHold =
    isLoading ||
    !profile ||
    (!inWizard && hasUnansweredRequired(profile));

  if (shouldHold) {
    return <View style={{ flex: 1, backgroundColor: '#ffffff' }} />;
  }
  return <>{children}</>;
}
