'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { getTranslator } from '@rental-platform/i18n';
import { Alert, Button, Spinner, StackedField } from '@rental-platform/ui';
import { authClient } from '@/lib/auth/auth-client';

const t = getTranslator();

const schema = z.object({
  email: z.string().email({ message: t('auth.validation.email.invalid') }),
  password: z.string().min(1, { message: t('auth.validation.password.required') }),
});

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get('redirectTo') || '/dashboard';

  // Server-returned error (invalid credentials / unverified email). Distinct
  // from per-field validation errors, which the form owns.
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onSubmit: schema },
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
      router.replace(redirectTo);
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-tight text-foreground">
        {t('auth.signIn.title')}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{t('auth.signIn.description')}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className="mt-8 space-y-5"
      >
        {serverError && <Alert variant="destructive">{serverError}</Alert>}

        <form.Field name="email">
          {(field) => (
            <StackedField
              bordered
              id={field.name}
              name={field.name}
              type="email"
              autoComplete="email"
              label={t('auth.field.email')}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.errors[0]?.message}
            />
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <StackedField
              bordered
              id={field.name}
              name={field.name}
              type="password"
              autoComplete="current-password"
              label={t('auth.field.password')}
              labelExtra={
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {t('auth.signIn.forgotPassword')}
                </Link>
              }
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.errors[0]?.message}
            />
          )}
        </form.Field>

        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              {t('auth.signIn.submit')}
            </Button>
          )}
        </form.Subscribe>

        <p className="text-center text-sm text-muted-foreground">
          {t('auth.signIn.noAccount')}{' '}
          <Link
            href="/auth/sign-up"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {t('auth.signIn.registerCta')}
          </Link>
        </p>
      </form>
    </div>
  );
}
