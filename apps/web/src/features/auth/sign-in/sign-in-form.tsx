'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
    <Card>
      <CardHeader>
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ink-faint">
          {t('auth.signIn.eyebrow')}
        </p>
        <CardTitle>{t('auth.signIn.title')}</CardTitle>
        <CardDescription>{t('auth.signIn.description')}</CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <CardContent className="space-y-5">
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

          <form.Field name="password">
            {(field) => (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor={field.name}>{t('auth.field.password')}</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-ink-soft transition-colors hover:text-ink"
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
                {t('auth.signIn.submit')}
              </Button>
            )}
          </form.Subscribe>

          <p className="text-center text-sm text-ink-soft">
            {t('auth.signIn.noAccount')}{' '}
            <Link
              href="/sign-up"
              className="font-medium text-accent underline-offset-4 hover:underline"
            >
              {t('auth.signIn.registerCta')}
            </Link>
          </p>
        </CardContent>
      </form>
    </Card>
  );
}
