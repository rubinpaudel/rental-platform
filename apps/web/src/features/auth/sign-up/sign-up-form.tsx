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
  Input,
  Label,
  Select,
  Spinner,
} from '@rental-platform/ui';
import { authClient } from '@/lib/auth/auth-client';
import { isOrgKind } from '@/lib/org-kind';

const t = getTranslator();

// Single schema covering both kinds. `kind` is typed as string so it pairs
// with the empty-string placeholder option; the refine narrows it to a
// real OrgKind, and the cross-field rule on organizationName fires only
// when kind === 'agency'.
const schema = z
  .object({
    kind: z.string().refine(isOrgKind, {
      message: t('auth.validation.kind.required'),
    }),
    name: z.string().min(1, { message: t('auth.validation.name.required') }),
    email: z.string().email({ message: t('auth.validation.email.invalid') }),
    password: z
      .string()
      .min(8, { message: t('auth.validation.password.tooShort') }),
    organizationName: z.string(),
  })
  .refine(
    (data) =>
      data.kind !== 'agency' || data.organizationName.trim().length > 0,
    {
      path: ['organizationName'],
      message: t('auth.signUp.error.orgNameMissing'),
    },
  );

export function SignUpForm() {
  const router = useRouter();
  const redirectTo = useSearchParams().get('redirectTo') || '/dashboard';

  const [serverError, setServerError] = useState<string | null>(null);
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      kind: '',
      name: '',
      email: '',
      password: '',
      organizationName: '',
    },
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      // Schema validation has already narrowed kind to a real OrgKind, but
      // TanStack Form hands us the raw form values — re-check at the boundary.
      if (!isOrgKind(value.kind)) return;
      setServerError(null);

      const { error: signUpError } = await authClient.signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
        // Read by the v1 user-create hook to set the org kind atomically.
        role: 'landlord',
        orgKind: value.kind,
        ...(value.kind === 'agency'
          ? { organizationName: value.organizationName.trim() }
          : {}),
        callbackURL: `${window.location.origin}/auth/verify-email`,
      } as Parameters<typeof authClient.signUp.email>[0]);

      if (signUpError) {
        setServerError(signUpError.message ?? t('auth.signUp.error.generic'));
        return;
      }

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
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-ink">
          {t('auth.signUp.verifyPending.title')}
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          {t('auth.signUp.verifyPending.description', { email: verifyEmail })}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-tight text-ink">
        {t('auth.signUp.title')}
      </h1>
      <p className="mt-2 text-sm text-ink-soft">{t('auth.signUp.description')}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className="mt-8 space-y-4"
      >
        {serverError && <Alert tone="error">{serverError}</Alert>}

        <form.Field name="kind">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>{t('auth.signUp.field.kind')}</Label>
              <Select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={field.state.meta.errors.length > 0}
              >
                <option value="" disabled>
                  {t('auth.signUp.field.kind.placeholder')}
                </option>
                <option value="agency">{t('auth.signUp.kind.agency.title')}</option>
                <option value="private">{t('auth.signUp.kind.private.title')}</option>
              </Select>
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-danger">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="name">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>{t('auth.signUp.field.name')}</Label>
              <Input
                id={field.name}
                name={field.name}
                autoComplete="name"
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

        <form.Subscribe selector={(s) => s.values.kind === 'agency'}>
          {(showOrgName) =>
            showOrgName ? (
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
            ) : null
          }
        </form.Subscribe>

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
                minLength={8}
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
              {t('auth.signUp.submit')}
            </Button>
          )}
        </form.Subscribe>

        <p className="text-center text-sm text-ink-soft">
          {t('auth.signUp.haveAccount')}{' '}
          <Link
            href="/auth/sign-in"
            className="font-medium text-ink underline-offset-4 hover:underline"
          >
            {t('auth.signUp.signInCta')}
          </Link>
        </p>
      </form>
    </div>
  );
}
