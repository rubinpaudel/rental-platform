import { useState } from 'react';
import { Linking, View } from 'react-native';
import { useRouter } from 'expo-router';
import { getTranslator } from '@rental-platform/i18n';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth/auth-client';

const t = getTranslator();

const WEB_APP_URL = 'https://app.plekje.eu';

/**
 * Shown when a signed-in landlord somehow reaches the mobile app (shared
 * device, account-role mismatch). The mobile app is tenants-only by spec;
 * the only paths out are opening the web app or signing out.
 */
export function TenantOnlyScreen() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await authClient.signOut();
    router.replace('/(auth)/sign-in');
  }

  return (
    <Screen className="justify-between py-8">
      <View className="gap-3 pt-12">
        <Text className="text-3xl font-medium tracking-tight">
          {t('home.landlord.title')}
        </Text>
        <Text className="text-sm text-ink-soft">{t('home.landlord.body')}</Text>
      </View>

      <View className="gap-3">
        <Button onPress={() => void Linking.openURL(WEB_APP_URL)}>
          {t('home.landlord.openWebApp')}
        </Button>
        <Button
          tone="ghost"
          loading={signingOut}
          onPress={() => void handleSignOut()}
        >
          {t('home.signOut')}
        </Button>
      </View>
    </Screen>
  );
}
