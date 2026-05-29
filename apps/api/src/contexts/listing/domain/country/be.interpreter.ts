import type { CountryExtras } from '../compliance.vo';

/** BE-specific shape of the `country_extras` JSONB payload. */
export interface BeExtras {
  vlaamseMaatregelenregisterConsulted: boolean | null;
}

export const EMPTY_BE_EXTRAS: BeExtras = {
  vlaamseMaatregelenregisterConsulted: null,
};

/**
 * Parse a raw JSON value coming from the DB (or an API payload) into a
 * typed BE extras struct. Unknown keys are ignored; missing keys default to
 * null. This is the boundary that protects the domain from drift.
 */
export function parseBeExtras(raw: unknown): BeExtras {
  if (raw == null || typeof raw !== 'object') return EMPTY_BE_EXTRAS;
  const obj = raw as Record<string, unknown>;
  const v = obj['vlaamseMaatregelenregisterConsulted'];
  return {
    vlaamseMaatregelenregisterConsulted: typeof v === 'boolean' ? v : null,
  };
}

export function serializeBeExtras(extras: BeExtras): Record<string, unknown> {
  return {
    vlaamseMaatregelenregisterConsulted: extras.vlaamseMaatregelenregisterConsulted,
  };
}

/**
 * BE EPC label thresholds (Vlaanderen residential, simplified).
 * Returns the label that a given kWh/m² maps to, or null if not enough info.
 */
export function inferBeEpcLabel(primaryEnergyKwhM2: number | null): string | null {
  if (primaryEnergyKwhM2 === null) return null;
  if (primaryEnergyKwhM2 <= 0) return 'A++';
  if (primaryEnergyKwhM2 <= 100) return 'A+';
  if (primaryEnergyKwhM2 <= 150) return 'A';
  if (primaryEnergyKwhM2 <= 200) return 'B';
  if (primaryEnergyKwhM2 <= 300) return 'C';
  if (primaryEnergyKwhM2 <= 400) return 'D';
  if (primaryEnergyKwhM2 <= 500) return 'E';
  if (primaryEnergyKwhM2 <= 700) return 'F';
  return 'G';
}

export const beInterpreter = {
  country: 'BE' as const,
  parseExtras: (raw: unknown): CountryExtras => ({
    country: 'BE',
    ...parseBeExtras(raw),
  }),
  serializeExtras: (extras: CountryExtras): Record<string, unknown> => {
    if (extras.country !== 'BE') {
      throw new Error(`BE interpreter received non-BE extras: ${extras.country}`);
    }
    return serializeBeExtras(extras);
  },
  inferEpcLabel: inferBeEpcLabel,
};

export type CountryInterpreter = typeof beInterpreter;
