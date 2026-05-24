import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { getTranslator } from '@rental-platform/i18n';
import { Button, Spinner, Text } from 'heroui-native';
import { Screen } from '@/components/ui/screen';
import { authClient, useSession } from '@/lib/auth/auth-client';

const t = getTranslator();

export function HomeScreen() {
  const router = useRouter();
  const { data: session } = useSession();
  const [signingOut, setSigningOut] = useState(false);

  const name = session?.user?.name ?? '';

  async function handleSignOut() {
    setSigningOut(true);
    await authClient.signOut();
    router.replace('/welcome');
  }

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'space-between', paddingVertical: 16 }}>
        <View className="gap-2 pt-4">
          <Text type="h2" weight="bold" className="tracking-tight">
            {t('home.tenant.greeting', { name })}
          </Text>
          <Text type="body-sm">{t('home.tenant.body')}</Text>
        </View>

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
    </Screen>
  );
}
