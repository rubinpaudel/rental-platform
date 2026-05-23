import { useState } from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';
import { getTranslator } from '@rental-platform/i18n';
import { Text } from 'heroui-native';
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
        <Text type="h4" weight="medium" className="tracking-tight">
          {t('auth.signUp.title')}
        </Text>
      </View>

      <View className="mt-8 gap-5">
        <SignUpForm onVerifyPending={setPendingEmail} />

        <View className="flex-row justify-center gap-1">
          <Text type="body-sm">
            {t('auth.signUp.haveAccount')}
          </Text>
          <Link
            href="/sign-in"
            className="text-sm font-medium text-foreground underline"
          >
            {t('auth.signUp.signInCta')}
          </Link>
        </View>
      </View>
    </AuthShell>
  );
}
