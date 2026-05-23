import { useState } from 'react';
import { View } from 'react-native';
import { useForm } from '@tanstack/react-form';
import { getTranslator } from '@rental-platform/i18n';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { authClient } from '@/lib/auth/auth-client';
import { signInSchema } from './sign-in.schema';

const t = getTranslator();

interface SignInFormProps {
  onSuccess: () => void;
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  // Server-returned error (invalid credentials / unverified email). Per-field
  // validation errors are owned by the form itself.
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onSubmit: signInSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const { error } = await authClient.signIn.email(value);
      if (error) {
        setServerError(
          error.status === 403
            ? t('auth.signIn.error.unverified')
            : t('auth.signIn.error.invalid'),
        );
        return;
      }
      onSuccess();
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

      <form.Field name="password">
        {(field) => (
          <Field
            label={t('auth.field.password')}
            autoCapitalize="none"
            autoComplete="password"
            textContentType="password"
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
            {t('auth.signIn.submit')}
          </Button>
        )}
      </form.Subscribe>
    </View>
  );
}
