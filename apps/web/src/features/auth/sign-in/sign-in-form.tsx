'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { getTranslator } from '@rental-platform/i18n';
import { Alert, Button, Input, Label, Spinner } from '@rental-platform/ui';
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

        <form.Field name="password">
          {(field) => (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor={field.name}>{t('auth.field.password')}</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {t('auth.signIn.forgotPassword')}
                </Link>
              </div>
              <Input
                id={field.name}
                name={field.name}
                type="password"
                autoComplete="current-password"
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
