import { useState } from 'react';
import { View } from 'react-native';
import { getTranslator } from '@rental-platform/i18n';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth/auth-client';

const t = getTranslator();

type ResendState = 'idle' | 'sending' | 'sent' | 'failed';

interface VerifyPendingViewProps {
  email: string;
}

/**
 * Shown after a successful signup while the user goes to their inbox for
 * the verification link. Includes a resend button per the v2b spec.
 */
export function VerifyPendingView({ email }: VerifyPendingViewProps) {
  const [state, setState] = useState<ResendState>('idle');

  async function handleResend() {
    setState('sending');
    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: '/(auth)/verify-email',
    });
    setState(error ? 'failed' : 'sent');
  }

  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="text-2xl font-medium tracking-tight">
          {t('auth.signUp.verifyPending.title')}
        </Text>
        <Text className="text-sm text-ink-soft">
          {t('auth.signUp.verifyPending.description', { email })}
        </Text>
      </View>

      {state === 'sent' ? (
        <Alert tone="success">
          {t('auth.signUp.verifyPending.resendSuccess', { email })}
        </Alert>
      ) : null}
      {state === 'failed' ? (
        <Alert tone="error">{t('auth.signUp.verifyPending.resendError')}</Alert>
      ) : null}

      <Button
        tone="ghost"
        loading={state === 'sending'}
        onPress={() => void handleResend()}
      >
        {t('auth.signUp.verifyPending.resend')}
      </Button>
    </View>
  );
}
