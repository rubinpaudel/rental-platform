import { nl, type Translations, type TranslationKey } from './locales/nl';
import { fr } from './locales/fr';
import { en } from './locales/en';

export type { Translations, TranslationKey } from './locales/nl';
export { nl, fr, en };

export type Locale = 'nl' | 'fr' | 'en';

export const defaultLocale: Locale = 'nl';
export const locales: readonly Locale[] = ['nl', 'fr', 'en'] as const;

const tables: Record<Locale, Partial<Translations>> = { nl, fr, en };

export type TranslationParams = Record<string, string | number>;
export type Translator = (key: TranslationKey, params?: TranslationParams) => string;

/**
 * Sync key-lookup translator. Returns the value from the requested locale
 * if present, otherwise falls back to Dutch (the source of truth).
 *
 * Placeholder support is intentionally minimal: `{name}` tokens in a
 * translation string are replaced from the `params` object. No plurals,
 * no ICU, no async loaders — those land when we wire actual locale
 * switching. The contract this package establishes is the convention:
 * every user-visible string is authored as a key here, not a hard-coded
 * literal in the UI.
 */
export function getTranslator(locale: Locale = defaultLocale): Translator {
  const primary = tables[locale];
  return (key, params) => {
    const template = primary[key] ?? nl[key];
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (_, name: string) => {
      const value = params[name];
      return value === undefined ? `{${name}}` : String(value);
    });
  };
}
