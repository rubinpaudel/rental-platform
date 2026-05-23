import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { getTranslator } from '@rental-platform/i18n';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
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
    router.replace('/(auth)/sign-in');
  }

  return (
    <Screen className="justify-between py-8">
      <View className="gap-3">
        <Text className="text-3xl font-medium tracking-tight">
          {t('home.tenant.greeting', { name })}
        </Text>
        <Text className="text-sm text-ink-soft">{t('home.tenant.body')}</Text>
      </View>

      <Button tone="ghost" loading={signingOut} onPress={() => void handleSignOut()}>
        {t('home.signOut')}
      </Button>
    </Screen>
  );
}
