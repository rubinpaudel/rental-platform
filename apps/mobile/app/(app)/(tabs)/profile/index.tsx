import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Alert, Button, Spinner, Text } from 'heroui-native';
import { getTranslator } from '@rental-platform/i18n';
import { PROFILE_SECTIONS } from '@rental-platform/profile-schema';
import { Screen } from '@/components/ui/screen';
import { useProfile } from '@/features/profile/profile-context';
import { CompletenessRing } from '@/features/profile/overview/completeness-ring';
import { SectionGroup } from '@/features/profile/overview/section-group';
import { authClient } from '@/lib/auth/auth-client';

const t = getTranslator();

/**
 * Tenant profile overview — the "huurpaspoort" landing screen.
 *
 *   - Completeness ring + percent (server-computed).
 *   - One card per section listing every applicable step + its current
 *     value; tap a row to deep-link into that step's screen in
 *     edit-mode (PATCH on save, back to here).
 *   - "Vul je profiel aan" CTA shortcuts back into the wizard if any
 *     applicable step is still unanswered or skipped.
 *
 * Sign-out CTA stays at the bottom for the MLP-era shell — there's no
 * dedicated settings screen yet.
 */
export default function ProfileOverviewScreen() {
  const router = useRouter();
  const { profile, isLoading, error, refetch } = useProfile();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await authClient.signOut();
    router.replace('/welcome');
  }

  if (isLoading && !profile) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Spinner />
        </View>
      </Screen>
    );
  }

  if (error && !profile) {
    return (
      <Screen>
        <View className="gap-4 pt-8">
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>{error}</Alert.Description>
            </Alert.Content>
          </Alert>
          <Button onPress={() => void refetch()}>
            <Button.Label>{t('profile.wizard.cta.continue')}</Button.Label>
          </Button>
        </View>
      </Screen>
    );
  }

  if (!profile) return null;

  return (
    <Screen scroll>
      <View className="gap-6">
        <View className="items-center gap-2 pt-4">
          <CompletenessRing pct={profile.completeness} />
          <Text type="h2" weight="bold" className="tracking-tight">
            {t('profile.overview.title')}
          </Text>
          {profile.completeness < 100 ? (
            <Button
              variant="ghost"
              onPress={() => router.push('/profile/wizard')}
            >
              <Button.Label>{t('profile.overview.startWizardCta')}</Button.Label>
            </Button>
          ) : null}
        </View>

        <View className="gap-3">
          {PROFILE_SECTIONS.map((section) => (
            <SectionGroup key={section} section={section} profile={profile} />
          ))}
        </View>

        <Button
          variant="ghost"
          isDisabled={signingOut}
          onPress={() => void handleSignOut()}
        >
          {signingOut ? <Spinner /> : <Button.Label>{t('shell.signOut')}</Button.Label>}
        </Button>
      </View>
    </Screen>
  );
}
