/**
 * Display formatters scoped to listings. Kept in their own module so both
 * RSC list/detail and client edit components can share a single source of
 * truth for currency, address, and date formatting.
 */
import type { ListingAddress } from '@/lib/listings/types';

const PRICE_FORMATTER = new Intl.NumberFormat('nl-BE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

export function formatPrice(cents: number): string {
  return PRICE_FORMATTER.format(cents / 100);
}

export function formatAddress(address: ListingAddress): string {
  const line1 = address.box
    ? `${address.street} ${address.number} bus ${address.box}`
    : `${address.street} ${address.number}`;
  return `${line1}, ${address.postalCode} ${address.municipality}`;
}

const DATE_FORMATTER = new Intl.DateTimeFormat('nl-BE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function formatDate(iso: string): string {
  return DATE_FORMATTER.format(new Date(iso));
}
