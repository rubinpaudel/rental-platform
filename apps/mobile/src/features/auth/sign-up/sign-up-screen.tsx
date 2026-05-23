import { useState } from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';
import { getTranslator } from '@rental-platform/i18n';
import { Text } from '@/components/ui/text';
import { AuthShell } from '@/features/shell/auth-shell';
import { SignUpForm } from './sign-up-form';
import { VerifyPendingView } from './verify-pending-view';

const t = getTranslator();

export function SignUpScreen() {
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  if (pendingEmail) {
    return (
      <AuthShell>
        <VerifyPendingView email={pendingEmail} />
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <View className="gap-2">
        <Text className="text-2xl font-medium tracking-tight">
          {t('auth.signUp.title')}
        </Text>
        <Text className="text-sm text-ink-soft">
          {t('auth.signUp.mobile.description')}
        </Text>
      </View>

      <View className="mt-8 gap-5">
        <SignUpForm onVerifyPending={setPendingEmail} />

        <View className="flex-row justify-center gap-1">
          <Text className="text-sm text-ink-soft">
            {t('auth.signUp.haveAccount')}
          </Text>
          <Link
            href="/(auth)/sign-in"
            className="text-sm font-medium text-ink underline"
          >
            {t('auth.signUp.signInCta')}
          </Link>
        </View>
      </View>
    </AuthShell>
  );
}
