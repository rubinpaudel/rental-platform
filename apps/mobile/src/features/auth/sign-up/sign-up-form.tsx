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
import { authClient } from '@/lib/auth/auth-client';
import { signUpSchema } from './sign-up.schema';

const t = getTranslator();

interface SignUpFormProps {
  /**
   * Called with the new account's email once the server has accepted the
   * signup and a verification email is on its way.
   */
  onVerifyPending: (email: string) => void;
}

export function SignUpForm({ onVerifyPending }: SignUpFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { name: '', email: '', password: '' },
    validators: { onSubmit: signUpSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);

      // `role: 'tenant'` is baked in — the mobile app is tenants-only and
      // never exposes a role picker. The server's user-create hook resolves
      // this to a personal (kind: 'private') organization invisibly. The
      // `callbackURL` MUST start with `/` so the Better Auth Expo client
      // rewrites it via `Linking.createURL(path)` → `plekje://verify-email`
      // (it only rewrites paths that start with `/`; bare strings pass
      // through unchanged and fail server-side trustedOrigins validation).
      // No route-group prefix — `(auth)` is URL-invisible in expo-router 6.
      const { error } = await authClient.signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
        role: 'tenant',
        callbackURL: '/verify-email',
      } as Parameters<typeof authClient.signUp.email>[0]);

      if (error) {
        setServerError(error.message ?? t('auth.signUp.error.generic'));
        return;
      }
      onVerifyPending(value.email);
    },
  });

  return (
    <View className="gap-5">
      {serverError ? (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>{serverError}</Alert.Description>
          </Alert.Content>
        </Alert>
      ) : null}

      <form.Field name="name">
        {(field) => {
          const error = field.state.meta.errors[0]?.message;
          return (
            <TextField isInvalid={!!error}>
              <Label>{t('auth.signUp.field.name')}</Label>
              <Input
                autoComplete="name"
                textContentType="name"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
              />
              <FieldError>{error}</FieldError>
            </TextField>
          );
        }}
      </form.Field>

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

      <form.Field name="password">
        {(field) => {
          const error = field.state.meta.errors[0]?.message;
          return (
            <TextField isInvalid={!!error}>
              <Label>{t('auth.field.password')}</Label>
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

      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(isSubmitting) => (
          <Button
            isDisabled={isSubmitting}
            onPress={() => void form.handleSubmit()}
          >
            {isSubmitting ? (
              <Spinner />
            ) : (
              <Button.Label>{t('auth.signUp.submit')}</Button.Label>
            )}
          </Button>
        )}
      </form.Subscribe>
    </View>
  );
}
