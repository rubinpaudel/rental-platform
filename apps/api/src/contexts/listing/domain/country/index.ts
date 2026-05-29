import { beInterpreter, type CountryInterpreter } from './be.interpreter';

/**
 * Registry mapping ISO 3166-1 alpha-2 country codes to per-country
 * interpreters. Adding a new country = one new interpreter file + one
 * line here.
 */
const interpreters: Record<string, CountryInterpreter> = {
  BE: beInterpreter,
};

export function getCountryInterpreter(countryCode: string): CountryInterpreter {
  const interpreter = interpreters[countryCode];
  if (!interpreter) {
    throw new Error(`No CountryInterpreter registered for country: ${countryCode}`);
  }
  return interpreter;
}

export function hasCountryInterpreter(countryCode: string): boolean {
  return countryCode in interpreters;
}
