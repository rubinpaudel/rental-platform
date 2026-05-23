import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { getTranslator } from '@rental-platform/i18n';
import { Button, Spinner, Text } from 'heroui-native';
import { authClient } from '@/lib/auth/auth-client';

const t = getTranslator();

export default function Index() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await authClient.signOut();
    router.replace('/welcome');
  }

  return (
    <View className="flex-1 items-center justify-center gap-6 bg-background px-6">
      <Text type="h3" weight="medium" className="tracking-tight text-foreground">
        plekje
      </Text>
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
  );
}
