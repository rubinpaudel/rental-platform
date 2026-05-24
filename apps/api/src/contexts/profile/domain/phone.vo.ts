import { parsePhoneNumberFromString } from 'libphonenumber-js';

/**
 * Belgian phone number. Accepts E.164 (+32…), national (0…), and the 0032
 * international prefix; spaces, dashes, dots and slashes are tolerated.
 * Normalised on the way in to E.164. Non-Belgian numbers are rejected even
 * if they're syntactically valid in their own country.
 *
 * libphonenumber-js does the heavy lifting (area-code knowledge, mobile vs.
 * landline ranges, E.164 formatting); a small pre-check enforces an explicit
 * prefix so misformatted client input — bare digits, double trunk 0 — gets
 * surfaced as a 400 instead of being silently fixed up.
 */
export type Phone = string & { readonly __brand: 'Phone' };

const SEPARATORS = /[\s./-]/g;

export function phone(input: string): Phone {
  if (!input) throw new Error('Phone is required');

  const stripped = input.replace(SEPARATORS, '');
  if (!hasExpectedPrefix(stripped)) {
    throw new Error(`Invalid Belgian phone number: ${input}`);
  }

  const parsed = parsePhoneNumberFromString(stripped, 'BE');
  if (!parsed || !parsed.isValid() || parsed.country !== 'BE') {
    throw new Error(`Invalid Belgian phone number: ${input}`);
  }

  return parsed.format('E.164') as Phone;
}

function hasExpectedPrefix(stripped: string): boolean {
  // Must start with +32, 0032, or 0 — and rule out the "double trunk 0"
  // patterns (+320…, 00320…) that libphonenumber would silently normalise.
  if (stripped.startsWith('+320')) return false;
  if (stripped.startsWith('00320')) return false;
  return stripped.startsWith('+32') || stripped.startsWith('0032') || stripped.startsWith('0');
}
