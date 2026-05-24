import { useState } from 'react';
import { View } from 'react-native';
import { getTranslator } from '@rental-platform/i18n';
import { Alert, Button, Spinner, Text } from 'heroui-native';
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
      callbackURL: '/verify-email',
    });
    setState(error ? 'failed' : 'sent');
  }

  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text type="h4" weight="medium" className="tracking-tight">
          {t('auth.signUp.verifyPending.title')}
        </Text>
        <Text type="body-sm">
          {t('auth.signUp.verifyPending.description', { email })}
        </Text>
      </View>

      {state === 'sent' ? (
        <Alert status="success">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>
              {t('auth.signUp.verifyPending.resendSuccess', { email })}
            </Alert.Description>
          </Alert.Content>
        </Alert>
      ) : null}
      {state === 'failed' ? (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>
              {t('auth.signUp.verifyPending.resendError')}
            </Alert.Description>
          </Alert.Content>
        </Alert>
      ) : null}

      <Button
        variant="ghost"
        isDisabled={state === 'sending'}
        onPress={() => void handleResend()}
      >
        {state === 'sending' ? (
          <Spinner />
        ) : (
          <Button.Label>{t('auth.signUp.verifyPending.resend')}</Button.Label>
        )}
      </Button>
    </View>
  );
}
