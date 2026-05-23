'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { getTranslator } from '@rental-platform/i18n';
import { Alert, Button, Input, Label, Spinner } from '@rental-platform/ui';
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
        redirectTo: '/auth/reset-password',
      });
      if (error) {
        setServerError(t('auth.forgotPassword.error'));
        return;
      }
      setSentTo(value.email);
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-tight text-foreground">
        {t('auth.forgotPassword.title')}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t('auth.forgotPassword.description')}
      </p>

      <div className="mt-8 space-y-5">
        {sentTo ? (
          <Alert variant="success">
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
            {serverError && <Alert variant="destructive">{serverError}</Alert>}

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
                    <p className="text-sm text-destructive">
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
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/auth/sign-in"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {t('auth.common.backToSignIn')}
          </Link>
        </p>
      </div>
    </div>
  );
}
