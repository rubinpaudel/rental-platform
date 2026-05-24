import { z } from 'zod';
import { getTranslator } from '@rental-platform/i18n';
import type { ListingUpsertBody } from '@/lib/listings/types';

const t = getTranslator();

/**
 * Form-shape values are strings so the inputs can hold incomplete input
 * (e.g. an empty number field). Coercion to the API payload happens in
 * `toUpsertBody` below, after the schema validates each field.
 */
export interface ListingFormValues {
  title: string;
  description: string;
  priceEur: string;
  surfaceM2: string;
  rooms: string;
  street: string;
  number: string;
  box: string;
  postalCode: string;
  municipality: string;
}

export const EMPTY_LISTING_FORM_VALUES: ListingFormValues = {
  title: '',
  description: '',
  priceEur: '',
  surfaceM2: '',
  rooms: '',
  street: '',
  number: '',
  box: '',
  postalCode: '',
  municipality: '',
};

const positiveInt = (msg: string) =>
  z
    .string()
    .refine((v) => /^\d+$/.test(v) && Number(v) > 0, { message: msg });

export const listingFormSchema = z.object({
  title: z.string().min(1, { message: t('listings.validation.title.required') }),
  description: z
    .string()
    .min(1, { message: t('listings.validation.description.required') }),
  priceEur: positiveInt(t('listings.validation.price.invalid')),
  surfaceM2: positiveInt(t('listings.validation.surface.invalid')),
  rooms: positiveInt(t('listings.validation.rooms.invalid')),
  street: z.string().min(1, { message: t('listings.validation.street.required') }),
  number: z.string().min(1, { message: t('listings.validation.number.required') }),
  box: z.string(),
  postalCode: z
    .string()
    .regex(/^\d{4}$/, { message: t('listings.validation.postalCode.invalid') }),
  municipality: z
    .string()
    .min(1, { message: t('listings.validation.municipality.required') }),
});

/**
 * Step grouping — used both by the stepper UI and to validate fields per
 * step (so "Next" only advances when the current step is clean).
 */
export const FORM_STEPS = ['basics', 'address'] as const;
export type FormStep = (typeof FORM_STEPS)[number];

export const FIELDS_PER_STEP: Record<FormStep, ReadonlyArray<keyof ListingFormValues>> = {
  basics: ['title', 'description', 'priceEur', 'surfaceM2', 'rooms'],
  address: ['street', 'number', 'box', 'postalCode', 'municipality'],
};

export function toUpsertBody(values: ListingFormValues): ListingUpsertBody {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    priceCents: Number(values.priceEur) * 100,
    surfaceM2: Number(values.surfaceM2),
    rooms: Number(values.rooms),
    address: {
      street: values.street.trim(),
      number: values.number.trim(),
      box: values.box.trim() ? values.box.trim() : null,
      postalCode: values.postalCode,
      municipality: values.municipality.trim(),
    },
  };
}

export function fromListing(listing: {
  title: string;
  description: string;
  price: { cents: number };
  surface: { m2: number };
  rooms: number;
  address: {
    street: string;
    number: string;
    box: string | null;
    postalCode: string;
    municipality: string;
  };
}): ListingFormValues {
  return {
    title: listing.title,
    description: listing.description,
    priceEur: String(Math.round(listing.price.cents / 100)),
    surfaceM2: String(listing.surface.m2),
    rooms: String(listing.rooms),
    street: listing.address.street,
    number: listing.address.number,
    box: listing.address.box ?? '',
    postalCode: listing.address.postalCode,
    municipality: listing.address.municipality,
  };
}
