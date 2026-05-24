import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { getTranslator } from '@rental-platform/i18n';
import { Button, Text } from 'heroui-native';
import { Screen } from '@/components/ui/screen';

const t = getTranslator();

/**
 * Unauthenticated entry. Top is intentionally empty; bottom holds the two
 * primary CTAs (Sign in / Create account) and a legal disclaimer. Each CTA
 * `router.push`-es a new frame onto the stack so the back button is wired
 * for free.
 */
export function WelcomeScreen() {
  const router = useRouter();
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }} />

        <View className="gap-3 pb-2">
          <Button onPress={() => router.push('/sign-in')}>
            <Button.Label>{t('auth.welcome.signIn')}</Button.Label>
          </Button>
          <Button variant="secondary" onPress={() => router.push('/sign-up')}>
            <Button.Label>{t('auth.welcome.createAccount')}</Button.Label>
          </Button>
          <Text type="body-xs" align="center" className="mt-2">
            {t('auth.welcome.disclaimer')}
          </Text>
        </View>
      </View>
    </Screen>
  );
}
