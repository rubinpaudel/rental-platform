import { useState } from 'react';
import { Linking, View } from 'react-native';
import { useRouter } from 'expo-router';
import { getTranslator } from '@rental-platform/i18n';
import { Button, Spinner, Text } from 'heroui-native';
import { Screen } from '@/components/ui/screen';
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
    router.replace('/welcome');
  }

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'space-between', paddingVertical: 16 }}>
        <View className="gap-2 pt-12">
          <Text type="h2" weight="bold" className="tracking-tight">
            {t('home.landlord.title')}
          </Text>
          <Text type="body-sm">{t('home.landlord.body')}</Text>
        </View>

        <View className="gap-3">
          <Button onPress={() => void Linking.openURL(WEB_APP_URL)}>
            <Button.Label>{t('home.landlord.openWebApp')}</Button.Label>
          </Button>
          <Button
            variant="ghost"
            isDisabled={signingOut}
            onPress={() => void handleSignOut()}
          >
            {signingOut ? (
              <Spinner />
            ) : (
              <Button.Label>{t('home.signOut')}</Button.Label>
            )}
          </Button>
        </View>
      </View>
    </Screen>
  );
}
