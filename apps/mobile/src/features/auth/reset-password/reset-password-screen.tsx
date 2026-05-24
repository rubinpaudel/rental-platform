import { useState } from 'react';
import { View } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
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
import { resetPasswordSchema } from './reset-password.schema';

const t = getTranslator();

/**
 * Deep-link landing for the password-reset email. Mirrors the web app's
 * equivalent: read `token` from the URL, render the new-password form, on
 * success route back to sign-in.
 */
export function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { password: '' },
    validators: { onSubmit: resetPasswordSchema },
    onSubmit: async ({ value }) => {
      if (!token) return;
      setServerError(null);
      const { error } = await authClient.resetPassword({
        newPassword: value.password,
        token,
      });
      if (error) {
        setServerError(t('auth.resetPassword.error'));
        return;
      }
      router.replace('/sign-in');
    },
  });

  if (!token) {
    return (
      <ConversationalShell
        title={t('auth.resetPassword.invalid.title')}
        description={t('auth.resetPassword.invalid.description')}
      >
        <View>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-foreground underline"
          >
            {t('auth.resetPassword.invalid.cta')}
          </Link>
        </View>
      </ConversationalShell>
    );
  }

  return (
    <ConversationalShell
      title={t('auth.resetPassword.heading')}
      description={t('auth.resetPassword.subheading')}
      footer={
        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <Button
              isDisabled={isSubmitting}
              onPress={() => void form.handleSubmit()}
            >
              {isSubmitting ? (
                <Spinner />
              ) : (
                <Button.Label>{t('auth.resetPassword.submit')}</Button.Label>
              )}
            </Button>
          )}
        </form.Subscribe>
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

        <form.Field name="password">
          {(field) => {
            const error = field.state.meta.errors[0]?.message;
            return (
              <TextField isInvalid={!!error}>
                <Label>{t('auth.resetPassword.field.password')}</Label>
                <Input
                  autoCapitalize="none"
                  autoComplete="password-new"
                  textContentType="newPassword"
                  secureTextEntry
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                />
                <FieldError>{error}</FieldError>
              </TextField>
            );
          }}
        </form.Field>
      </View>
    </ConversationalShell>
  );
}
