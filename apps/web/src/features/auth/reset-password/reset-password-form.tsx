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
      router.replace('/sign-in');
    },
  });

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('auth.resetPassword.invalid.title')}</CardTitle>
          <CardDescription>
            {t('auth.resetPassword.invalid.description')}{' '}
            <Link
              href="/forgot-password"
              className="font-medium text-accent underline-offset-4 hover:underline"
            >
              {t('auth.resetPassword.invalid.cta')}
            </Link>
            .
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('auth.resetPassword.title')}</CardTitle>
        <CardDescription>{t('auth.resetPassword.description')}</CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <CardContent className="space-y-4">
          {serverError && <Alert tone="error">{serverError}</Alert>}

          <form.Field name="password">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>
                  {t('auth.resetPassword.field.password')}
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  autoComplete="new-password"
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
                {t('auth.resetPassword.submit')}
              </Button>
            )}
          </form.Subscribe>
        </CardContent>
      </form>
    </Card>
  );
}
