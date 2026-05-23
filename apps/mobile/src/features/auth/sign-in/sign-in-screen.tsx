import { Linking, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { getTranslator } from '@rental-platform/i18n';
import { AuthShell } from '@/features/shell/auth-shell';
import { Text } from '@/components/ui/text';
import { SignInForm } from './sign-in-form';

const t = getTranslator();

const WEB_APP_URL = 'https://app.plekje.eu';

export function SignInScreen() {
  const router = useRouter();
  return (
    <AuthShell>
      <View className="gap-2">
        <Text className="text-2xl font-medium tracking-tight">
          {t('auth.signIn.title')}
        </Text>
        <Text className="text-sm text-ink-soft">{t('auth.signIn.description')}</Text>
      </View>

      <View className="mt-8 gap-5">
        <SignInForm onSuccess={() => router.replace('/(app)')} />

        <Link
          href="/(auth)/forgot-password"
          className="text-center text-sm text-ink-soft"
        >
          {t('auth.signIn.forgotPassword')}
        </Link>

        <View className="flex-row justify-center gap-1">
          <Text className="text-sm text-ink-soft">{t('auth.signIn.noAccount')}</Text>
          <Link
            href="/(auth)/sign-up"
            className="text-sm font-medium text-ink underline"
          >
            {t('auth.signIn.registerCta')}
          </Link>
        </View>

        {/* Discreet landlord notice — link only, no in-app browser. */}
        <Text
          accessibilityRole="link"
          onPress={() => void Linking.openURL(WEB_APP_URL)}
          className="mt-6 text-center text-xs text-ink-faint"
        >
          {t('auth.signIn.landlordHint')}
        </Text>
      </View>
    </AuthShell>
  );
}
