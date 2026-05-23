import { useState } from 'react';
import { View } from 'react-native';
import { useForm } from '@tanstack/react-form';
import { getTranslator } from '@rental-platform/i18n';
import {
  Alert,
  Button,
  FieldError,
  Input,
  Label,
  Spinner,
  TextField,
} from 'heroui-native';
import { ConversationalShell } from '@/features/shell/conversational-shell';
import { authClient } from '@/lib/auth/auth-client';
import { forgotPasswordSchema } from './forgot-password.schema';

const t = getTranslator();

export function ForgotPasswordScreen() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: '' },
    validators: { onSubmit: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const { error } = await authClient.requestPasswordReset({
        email: value.email,
        // Relative redirect — Better Auth's Expo plugin rewrites this into
        // a `plekje://...` deep link when the email is built server-side.
        redirectTo: '/reset-password',
      });
      if (error) {
        setServerError(t('auth.forgotPassword.error'));
        return;
      }
      setSentTo(value.email);
    },
  });

  return (
    <ConversationalShell
      title={t('auth.forgotPassword.heading')}
      description={t('auth.forgotPassword.subheading')}
      footer={
        sentTo ? null : (
          <form.Subscribe selector={(s) => s.isSubmitting}>
            {(isSubmitting) => (
              <Button
                isDisabled={isSubmitting}
                onPress={() => void form.handleSubmit()}
              >
                {isSubmitting ? (
                  <Spinner />
                ) : (
                  <Button.Label>{t('auth.forgotPassword.submit')}</Button.Label>
                )}
              </Button>
            )}
          </form.Subscribe>
        )
      }
    >
      <View className="gap-5">
        {serverError ? (
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>{serverError}</Alert.Description>
            </Alert.Content>
          </Alert>
        ) : null}

        {sentTo ? (
          <Alert status="success">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>
                {t('auth.forgotPassword.success', { email: sentTo })}
              </Alert.Description>
            </Alert.Content>
          </Alert>
        ) : (
          <form.Field name="email">
            {(field) => {
              const error = field.state.meta.errors[0]?.message;
              return (
                <TextField isInvalid={!!error}>
                  <Label>{t('auth.field.email')}</Label>
                  <Input
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                  />
                  <FieldError>{error}</FieldError>
                </TextField>
              );
            }}
          </form.Field>
        )}
      </View>
    </ConversationalShell>
  );
}
