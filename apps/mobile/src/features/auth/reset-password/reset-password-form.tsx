import { useState } from 'react';
import { View } from 'react-native';
import { useForm } from '@tanstack/react-form';
import { getTranslator } from '@rental-platform/i18n';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { authClient } from '@/lib/auth/auth-client';
import { resetPasswordSchema } from './reset-password.schema';

const t = getTranslator();

interface ResetPasswordFormProps {
  token: string;
  onSuccess: () => void;
}

export function ResetPasswordForm({ token, onSuccess }: ResetPasswordFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { password: '' },
    validators: { onSubmit: resetPasswordSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const { error } = await authClient.resetPassword({
        newPassword: value.password,
        token,
      });
      if (error) {
        setServerError(t('auth.resetPassword.error'));
        return;
      }
      onSuccess();
    },
  });

  return (
    <View className="gap-5">
      {serverError ? <Alert tone="error">{serverError}</Alert> : null}

      <form.Field name="password">
        {(field) => (
          <Field
            label={t('auth.resetPassword.field.password')}
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
            {t('auth.resetPassword.submit')}
          </Button>
        )}
      </form.Subscribe>
    </View>
  );
}
