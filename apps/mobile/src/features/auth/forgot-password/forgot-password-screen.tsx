import { useState } from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';
import { getTranslator } from '@rental-platform/i18n';
import { Alert } from '@/components/ui/alert';
import { Text } from '@/components/ui/text';
import { AuthShell } from '@/features/shell/auth-shell';
import { ForgotPasswordForm } from './forgot-password-form';

const t = getTranslator();

export function ForgotPasswordScreen() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  return (
    <AuthShell>
      <View className="gap-2">
        <Text className="text-2xl font-medium tracking-tight">
          {t('auth.forgotPassword.title')}
        </Text>
        <Text className="text-sm text-ink-soft">
          {t('auth.forgotPassword.description')}
        </Text>
      </View>

      <View className="mt-8 gap-5">
        {sentTo ? (
          <Alert tone="success">
            {t('auth.forgotPassword.success', { email: sentTo })}
          </Alert>
        ) : (
          <ForgotPasswordForm onSent={setSentTo} />
        )}

        <Link
          href="/(auth)/sign-in"
          className="text-center text-sm font-medium text-ink underline"
        >
          {t('auth.common.backToSignIn')}
        </Link>
      </View>
    </AuthShell>
  );
}
