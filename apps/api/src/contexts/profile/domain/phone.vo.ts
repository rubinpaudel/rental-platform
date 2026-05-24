/**
 * Belgian phone number. Accepts E.164 (+324XXXXXXXX, +323XXXXXXXX,
 * +322XXXXXXX) and national (04XXXXXXXX, 03XXXXXXXX, 02XXXXXXX) formats,
 * with spaces / dashes / dots / slashes stripped. Normalised on the way in
 * to E.164.
 */
export type Phone = string & { readonly __brand: 'Phone' };

const SEPARATORS = /[\s./-]/g;

export function phone(input: string): Phone {
  if (!input) throw new Error('Phone is required');
  const stripped = input.replace(SEPARATORS, '');

  let normalised: string;
  if (stripped.startsWith('+32')) {
    normalised = stripped;
  } else if (stripped.startsWith('0032')) {
    normalised = '+32' + stripped.slice(4);
  } else if (stripped.startsWith('0')) {
    normalised = '+32' + stripped.slice(1);
  } else {
    throw new Error(`Invalid Belgian phone number: ${input}`);
  }

  // After normalisation: +32 followed by 8 (landline +322) or 9 digits.
  if (!/^\+32[1-9]\d{7,8}$/.test(normalised)) {
    throw new Error(`Invalid Belgian phone number: ${input}`);
  }

  return normalised as Phone;
}
