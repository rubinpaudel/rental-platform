import { useState } from 'react';
import { View } from 'react-native';
import { useForm } from '@tanstack/react-form';
import { getTranslator } from '@rental-platform/i18n';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { authClient } from '@/lib/auth/auth-client';
import { forgotPasswordSchema } from './forgot-password.schema';

const t = getTranslator();

interface ForgotPasswordFormProps {
  onSent: (email: string) => void;
}

export function ForgotPasswordForm({ onSent }: ForgotPasswordFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: '' },
    validators: { onSubmit: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const { error } = await authClient.requestPasswordReset({
        email: value.email,
        // Relative redirect — Better Auth's Expo plugin rewrites this into
        // a `plekje://...` deep link when the email is built server-side.
        redirectTo: '/(auth)/reset-password',
      });
      if (error) {
        setServerError(t('auth.forgotPassword.error'));
        return;
      }
      onSent(value.email);
    },
  });

  return (
    <View className="gap-5">
      {serverError ? <Alert tone="error">{serverError}</Alert> : null}

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

      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(isSubmitting) => (
          <Button loading={isSubmitting} onPress={() => void form.handleSubmit()}>
            {t('auth.forgotPassword.submit')}
          </Button>
        )}
      </form.Subscribe>
    </View>
  );
}
