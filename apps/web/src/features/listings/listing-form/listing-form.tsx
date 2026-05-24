'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import { Alert, Button, Input, Spinner, Textarea } from '@rental-platform/ui';
import { getTranslator } from '@rental-platform/i18n';
import { createListing, updateListing } from '@/lib/listings/actions';
import { Field } from './field';
import { PostalCodeInput } from './postal-code-input';
import { RegionHint } from './region-hint';
import { ReviewSummary } from './review-summary';
import { Stepper, type StepperStep } from './stepper';
import {
  EMPTY_LISTING_FORM_VALUES,
  FIELDS_PER_STEP,
  FORM_STEPS,
  type FormStep,
  type ListingFormValues,
  listingFormSchema,
  toUpsertBody,
} from './schema';

const t = getTranslator();

export interface ListingFormProps {
  mode: 'create' | 'edit';
  listingId?: string;
  initialValues?: ListingFormValues;
}

/**
 * Multi-step listing form. In create mode the user walks basics → address →
 * review, and submission spawns a draft + redirect to the photos step. In
 * edit mode the same steps are reused; the submit button updates the listing
 * and stays put so the landlord can keep iterating.
 *
 * Field groups are inlined here on purpose: tanstack/react-form's typed
 * `form.Field` is hard to share across files without bringing in
 * `withForm` / `createFormHook`, and the form is small enough that a single
 * cohesive module reads more clearly than a fanout of step files.
 */
export function ListingForm({ mode, listingId, initialValues }: ListingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<FormStep>('basics');
  const [reviewing, setReviewing] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: initialValues ?? EMPTY_LISTING_FORM_VALUES,
    validators: { onSubmit: listingFormSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const body = toUpsertBody(value);
        if (mode === 'create') {
          // createListing redirects server-side on success — execution
          // never returns here when it succeeds.
          await createListing(body);
        } else {
          if (!listingId) throw new Error('listingId required in edit mode');
          await updateListing(listingId, body);
          setSaved(true);
          router.refresh();
        }
      } catch (e) {
        setServerError(e instanceof Error ? e.message : t('listings.form.error.generic'));
      }
    },
  });

  async function advance() {
    setServerError(null);
    setSaved(false);
    const fields = FIELDS_PER_STEP[step];
    const validations = await Promise.all(
      fields.map((name) => form.validateField(name, 'submit')),
    );
    const stepIsValid = validations.every((errors) => errors.length === 0);
    if (!stepIsValid) return;

    const nextIdx = FORM_STEPS.indexOf(step) + 1;
    if (nextIdx < FORM_STEPS.length) {
      setStep(FORM_STEPS[nextIdx]!);
    } else {
      setReviewing(true);
    }
  }

  function regress() {
    setServerError(null);
    setSaved(false);
    if (reviewing) {
      setReviewing(false);
      return;
    }
    const prevIdx = FORM_STEPS.indexOf(step) - 1;
    if (prevIdx >= 0) setStep(FORM_STEPS[prevIdx]!);
  }

  function stepperState(): { current: StepperStep; completed: StepperStep[] } {
    if (reviewing) return { current: 'review', completed: ['basics', 'address'] };
    if (step === 'basics') return { current: 'basics', completed: [] };
    return { current: 'address', completed: ['basics'] };
  }

  const isFirstStep = !reviewing && step === FORM_STEPS[0];
  const stepInfo = stepperState();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        startTransition(() => {
          void form.handleSubmit();
        });
      }}
      className="space-y-8"
    >
      {mode === 'create' && <Stepper current={stepInfo.current} completed={stepInfo.completed} />}

      {serverError && <Alert variant="destructive">{serverError}</Alert>}
      {saved && mode === 'edit' && !pending && (
        <Alert variant="success">{t('listings.form.success.saved')}</Alert>
      )}

      {reviewing ? (
        <form.Subscribe selector={(s) => s.values}>
          {(values) => <ReviewSummary values={values} />}
        </form.Subscribe>
      ) : step === 'basics' ? (
        <div className="space-y-5">
          <form.Field name="title">
            {(field) => (
              <Field
                id={field.name}
                label={t('listings.form.field.title')}
                error={field.state.meta.errors[0]?.message}
              >
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder={t('listings.form.field.title.placeholder')}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <Field
                id={field.name}
                label={t('listings.form.field.description')}
                error={field.state.meta.errors[0]?.message}
              >
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={4}
                  placeholder={t('listings.form.field.description.placeholder')}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
              </Field>
            )}
          </form.Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {(
              [
                ['priceEur', t('listings.form.field.price')],
                ['surfaceM2', t('listings.form.field.surface')],
                ['rooms', t('listings.form.field.rooms')],
              ] as const
            ).map(([name, label]) => (
              <form.Field key={name} name={name}>
                {(field) => (
                  <Field
                    id={field.name}
                    label={label}
                    error={field.state.meta.errors[0]?.message}
                  >
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      inputMode="numeric"
                      min={1}
                      step={1}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={field.state.meta.errors.length > 0}
                    />
                  </Field>
                )}
              </form.Field>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-[2fr_1fr_1fr]">
            {(
              [
                ['street', t('listings.form.field.street'), 'address-line1'],
                ['number', t('listings.form.field.number'), undefined],
                ['box', t('listings.form.field.box'), undefined],
              ] as const
            ).map(([name, label, autoComplete]) => (
              <form.Field key={name} name={name}>
                {(field) => (
                  <Field
                    id={field.name}
                    label={label}
                    error={field.state.meta.errors[0]?.message}
                  >
                    <Input
                      id={field.name}
                      name={field.name}
                      autoComplete={autoComplete}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={field.state.meta.errors.length > 0}
                    />
                  </Field>
                )}
              </form.Field>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_2fr]">
            <form.Field name="postalCode">
              {(field) => (
                <Field
                  id={field.name}
                  label={t('listings.form.field.postalCode')}
                  error={field.state.meta.errors[0]?.message}
                >
                  <PostalCodeInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    invalid={field.state.meta.errors.length > 0}
                    onValueChange={(change) => {
                      field.handleChange(change.postalCode);
                      if (change.municipality !== undefined) {
                        form.setFieldValue('municipality', change.municipality);
                      }
                    }}
                  />
                  <form.Subscribe selector={(s) => s.values.postalCode}>
                    {(code) => <RegionHint postalCode={code} />}
                  </form.Subscribe>
                </Field>
              )}
            </form.Field>

            <form.Field name="municipality">
              {(field) => (
                <Field
                  id={field.name}
                  label={t('listings.form.field.municipality')}
                  error={field.state.meta.errors[0]?.message}
                >
                  <Input
                    id={field.name}
                    name={field.name}
                    autoComplete="address-level2"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={field.state.meta.errors.length > 0}
                  />
                </Field>
              )}
            </form.Field>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <Button type="button" variant="ghost" onClick={() => router.back()} disabled={pending}>
          {t('listings.form.cancel')}
        </Button>

        <div className="flex items-center gap-2">
          {!isFirstStep && (
            <Button type="button" variant="outline" onClick={regress} disabled={pending}>
              {t('listings.form.back')}
            </Button>
          )}

          {reviewing ? (
            <Button type="submit" disabled={pending}>
              {pending && <Spinner className="size-4" />}
              {mode === 'create' ? t('listings.form.create') : t('listings.form.save')}
            </Button>
          ) : (
            <Button type="button" onClick={advance} disabled={pending}>
              {t('listings.form.next')}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
