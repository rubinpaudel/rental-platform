import { View } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { getTranslator } from '@rental-platform/i18n';
import { Text } from '@/components/ui/text';
import { AuthShell } from '@/features/shell/auth-shell';
import { ResetPasswordForm } from './reset-password-form';

const t = getTranslator();

/**
 * Deep-link landing for the password reset email. Mirrors the web app's
 * equivalent: read `token` from the URL, render the new-password form, on
 * success route back to sign-in.
 */
export function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();

  if (!token) {
    return (
      <AuthShell>
        <View className="gap-2">
          <Text className="text-2xl font-medium tracking-tight">
            {t('auth.resetPassword.invalid.title')}
          </Text>
          <Text className="text-sm text-ink-soft">
            {t('auth.resetPassword.invalid.description')}{' '}
            <Link
              href="/(auth)/forgot-password"
              className="font-medium text-ink underline"
            >
              {t('auth.resetPassword.invalid.cta')}
            </Link>
          </Text>
        </View>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <View className="gap-2">
        <Text className="text-2xl font-medium tracking-tight">
          {t('auth.resetPassword.title')}
        </Text>
        <Text className="text-sm text-ink-soft">
          {t('auth.resetPassword.description')}
        </Text>
      </View>
      <View className="mt-8">
        <ResetPasswordForm
          token={token}
          onSuccess={() => router.replace('/(auth)/sign-in')}
        />
      </View>
    </AuthShell>
  );
}
