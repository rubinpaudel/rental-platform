'use client';

import { useState } from 'react';
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
import type { OrgKind } from '@/lib/org-kind';

const t = getTranslator();

// Two schemas because `organizationName` is required only for agency. The
// alternative — one schema with a `kind` discriminator and `.refine()` — works
// but spreads the conditional across more places; splitting keeps each
// schema short and the resolver picks based on `kind` at render time.
const baseShape = {
  name: z.string().min(1, { message: t('auth.validation.name.required') }),
  email: z.string().email({ message: t('auth.validation.email.invalid') }),
  password: z.string().min(8, { message: t('auth.validation.password.tooShort') }),
};

const agencySchema = z.object({
  ...baseShape,
  organizationName: z
    .string()
    .trim()
    .min(1, { message: t('auth.signUp.error.orgNameMissing') }),
});

const privateSchema = z.object({ ...baseShape, organizationName: z.string() });

type AgencyValues = z.infer<typeof agencySchema>;
type PrivateValues = z.infer<typeof privateSchema>;
type Values = AgencyValues | PrivateValues;

export function AccountDetailsStep({
  kind,
  onBack,
}: {
  kind: OrgKind;
  onBack: () => void;
}) {
  const router = useRouter();
  const redirectTo = useSearchParams().get('redirectTo') || '/dashboard';

  const [serverError, setServerError] = useState<string | null>(null);
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      organizationName: '',
    } as Values,
    validators: { onSubmit: kind === 'agency' ? agencySchema : privateSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const { error: signUpError } = await authClient.signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
        // Read by the v1 user-create hook to set the org kind atomically.
        role: 'landlord',
        orgKind: kind,
        ...(kind === 'agency'
          ? { organizationName: value.organizationName.trim() }
          : {}),
        callbackURL: `${window.location.origin}/verify-email`,
      } as Parameters<typeof authClient.signUp.email>[0]);

      if (signUpError) {
        setServerError(signUpError.message ?? t('auth.signUp.error.generic'));
        return;
      }

      // requireEmailVerification=false (dev) → already signed in; otherwise
      // user must click the verification link first.
      const { data: session } = await authClient.getSession();
      if (session) {
        router.replace(redirectTo);
      } else {
        setVerifyEmail(value.email);
      }
    },
  });

  if (verifyEmail) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('auth.signUp.verifyPending.title')}</CardTitle>
          <CardDescription>
            {t('auth.signUp.verifyPending.description', { email: verifyEmail })}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('auth.signUp.details.title')}</CardTitle>
        <CardDescription>
          {kind === 'agency'
            ? t('auth.signUp.details.subtitle.agency')
            : t('auth.signUp.details.subtitle.private')}
        </CardDescription>
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

          <form.Field name="name">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>{t('auth.signUp.field.name')}</Label>
                <Input
                  id={field.name}
                  name={field.name}
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

          {kind === 'agency' && (
            <form.Field name="organizationName">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name}>
                    {t('auth.signUp.field.orgName')}
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
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
          )}

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
                <Label htmlFor={field.name}>{t('auth.field.password')}</Label>
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
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onBack}
                  disabled={isSubmitting}
                >
                  {t('auth.common.back')}
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting && <Spinner />}
                  {t('auth.signUp.submit')}
                </Button>
              </div>
            )}
          </form.Subscribe>
        </CardContent>
      </form>
    </Card>
  );
}
