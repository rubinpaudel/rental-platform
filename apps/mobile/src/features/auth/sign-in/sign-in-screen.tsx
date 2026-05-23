import { useState } from 'react';
import { View } from 'react-native';
import { Link, useRouter } from 'expo-router';
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
import { signInSchema } from './sign-in.schema';

const t = getTranslator();

export function SignInScreen() {
  const router = useRouter();
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
      router.replace('/');
    },
  });

  return (
    <ConversationalShell
      title={t('auth.signIn.heading')}
      description={t('auth.signIn.subheading')}
      footer={
        <View className="gap-3">
          <form.Subscribe selector={(s) => s.isSubmitting}>
            {(isSubmitting) => (
              <Button
                isDisabled={isSubmitting}
                onPress={() => void form.handleSubmit()}
              >
                {isSubmitting ? (
                  <Spinner />
                ) : (
                  <Button.Label>{t('auth.signIn.submit')}</Button.Label>
                )}
              </Button>
            )}
          </form.Subscribe>
          <Link
            href="/forgot-password"
            className="text-center text-sm text-foreground"
          >
            {t('auth.signIn.forgotPassword')}
          </Link>
        </View>
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
                  autoComplete="password"
                  textContentType="password"
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
