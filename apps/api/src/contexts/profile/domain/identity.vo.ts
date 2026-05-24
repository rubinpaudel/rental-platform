import type { Phone } from './phone.vo';
import { phone } from './phone.vo';

const NAME_MAX = 100;
const NATIONALITY_RE = /^[A-Z]{2}$/;

export interface Identity {
  readonly firstName: string | null;
  readonly lastName: string | null;
  readonly dateOfBirth: string | null;
  readonly phone: Phone | null;
  readonly nationality: string | null;
}

export const EMPTY_IDENTITY: Identity = {
  firstName: null,
  lastName: null,
  dateOfBirth: null,
  phone: null,
  nationality: null,
};

export interface IdentityInput {
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  phone?: string | null;
  nationality?: string | null;
}

export function identity(input: IdentityInput): Identity {
  const firstName = normaliseName(input.firstName, 'firstName');
  const lastName = normaliseName(input.lastName, 'lastName');
  const dateOfBirth = normaliseDob(input.dateOfBirth);
  const phoneValue = input.phone == null || input.phone === '' ? null : phone(input.phone);
  const nationality = normaliseNationality(input.nationality);

  return { firstName, lastName, dateOfBirth, phone: phoneValue, nationality };
}

function normaliseName(value: string | null | undefined, field: string): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  if (trimmed === '') return null;
  if (trimmed.length > NAME_MAX) {
    throw new Error(`${field} must be at most ${NAME_MAX} characters`);
  }
  return trimmed;
}

function normaliseDob(value: string | null | undefined): string | null {
  if (value == null || value === '') return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('dateOfBirth must be ISO date YYYY-MM-DD');
  }
  const date = new Date(value + 'T00:00:00Z');
  if (Number.isNaN(date.getTime())) {
    throw new Error('dateOfBirth must be a valid calendar date');
  }
  if (value !== date.toISOString().slice(0, 10)) {
    throw new Error('dateOfBirth must be a valid calendar date');
  }
  const today = new Date();
  if (date.getTime() > today.getTime()) {
    throw new Error('dateOfBirth cannot be in the future');
  }
  const age = today.getUTCFullYear() - date.getUTCFullYear();
  if (age > 120) {
    throw new Error('dateOfBirth is too far in the past');
  }
  return value;
}

function normaliseNationality(value: string | null | undefined): string | null {
  if (value == null || value === '') return null;
  const upper = value.toUpperCase();
  if (!NATIONALITY_RE.test(upper)) {
    throw new Error('nationality must be an ISO 3166-1 alpha-2 country code');
  }
  return upper;
}
