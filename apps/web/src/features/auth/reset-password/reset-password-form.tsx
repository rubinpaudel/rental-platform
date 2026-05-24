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
  password: z.string().min(8, { message: t('auth.validation.password.tooShort') }),
});

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token');

  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { password: '' },
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      if (!token) return;
      setServerError(null);
      const { error } = await authClient.resetPassword({
        newPassword: value.password,
        token,
      });
      if (error) {
        setServerError(t('auth.resetPassword.error'));
        return;
      }
      router.replace('/auth/sign-in');
    },
  });

  if (!token) {
    return (
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-foreground">
          {t('auth.resetPassword.invalid.title')}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('auth.resetPassword.invalid.description')}{' '}
          <Link
            href="/auth/forgot-password"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {t('auth.resetPassword.invalid.cta')}
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-tight text-foreground">
        {t('auth.resetPassword.title')}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t('auth.resetPassword.description')}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className="mt-8 space-y-4"
      >
        {serverError && <Alert variant="destructive">{serverError}</Alert>}

        <form.Field name="password">
          {(field) => (
            <StackedField
              bordered
              id={field.name}
              name={field.name}
              type="password"
              autoComplete="new-password"
              label={t('auth.resetPassword.field.password')}
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
              {t('auth.resetPassword.submit')}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
