import { useState } from 'react';
import { View } from 'react-native';
import { useForm } from '@tanstack/react-form';
import { getTranslator } from '@rental-platform/i18n';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
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
      // `callbackURL` is a relative path; the Better Auth Expo plugin
      // rewrites it to `plekje://(auth)/verify-email?token=...` so the
      // verification email lands back in this app.
      const { error } = await authClient.signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
        role: 'tenant',
        callbackURL: '/(auth)/verify-email',
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
      {serverError ? <Alert tone="error">{serverError}</Alert> : null}

      <form.Field name="name">
        {(field) => (
          <Field
            label={t('auth.signUp.field.name')}
            autoComplete="name"
            textContentType="name"
            value={field.state.value}
            onChangeText={field.handleChange}
            onBlur={field.handleBlur}
            error={field.state.meta.errors[0]?.message}
          />
        )}
      </form.Field>

      <form.Field name="email">
        {(field) => (
          <Field
            label={t('auth.field.email')}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            value={field.state.value}
            onChangeText={field.handleChange}
            onBlur={field.handleBlur}
            error={field.state.meta.errors[0]?.message}
          />
        )}
      </form.Field>

      <form.Field name="password">
        {(field) => (
          <Field
            label={t('auth.field.password')}
            autoCapitalize="none"
            autoComplete="password-new"
            textContentType="newPassword"
            secureTextEntry
            value={field.state.value}
            onChangeText={field.handleChange}
            onBlur={field.handleBlur}
            error={field.state.meta.errors[0]?.message}
          />
        )}
      </form.Field>

      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(isSubmitting) => (
          <Button loading={isSubmitting} onPress={() => void form.handleSubmit()}>
            {t('auth.signUp.submit')}
          </Button>
        )}
      </form.Subscribe>
    </View>
  );
}
