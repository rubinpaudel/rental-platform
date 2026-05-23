'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { getTranslator } from '@rental-platform/i18n';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Spinner,
} from '@rental-platform/ui';
import { authClient } from '@/lib/auth/auth-client';

const t = getTranslator();

const schema = z.object({
  email: z.string().email({ message: t('auth.validation.email.invalid') }),
});

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: '' },
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const { error } = await authClient.requestPasswordReset({
        email: value.email,
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
    <Card>
      <CardHeader>
        <CardTitle>{t('auth.forgotPassword.title')}</CardTitle>
        <CardDescription>{t('auth.forgotPassword.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sentTo ? (
          <Alert tone="success">
            {t('auth.forgotPassword.success', { email: sentTo })}
          </Alert>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
            className="space-y-4"
          >
            {serverError && <Alert tone="error">{serverError}</Alert>}

            <form.Field name="email">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name}>{t('auth.field.email')}</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    autoComplete="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={field.state.meta.errors.length > 0}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-danger">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Spinner />}
                  {t('auth.forgotPassword.submit')}
                </Button>
              )}
            </form.Subscribe>
          </form>
        )}
        <p className="text-center text-sm text-ink-soft">
          <Link
            href="/sign-in"
            className="font-medium text-accent underline-offset-4 hover:underline"
          >
            {t('auth.common.backToSignIn')}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
