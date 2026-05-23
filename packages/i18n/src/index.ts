import { nl, type Translations, type TranslationKey } from './locales/nl';
import { fr } from './locales/fr';
import { en } from './locales/en';

export type { Translations, TranslationKey } from './locales/nl';
export { nl, fr, en };

export type Locale = 'nl' | 'fr' | 'en';

export const defaultLocale: Locale = 'nl';
export const locales: readonly Locale[] = ['nl', 'fr', 'en'] as const;

const tables: Record<Locale, Partial<Translations>> = { nl, fr, en };

export type Translator = (key: TranslationKey) => string;

/**
 * Sync key-lookup translator. Returns the value from the requested locale
 * if present, otherwise falls back to Dutch (the source of truth).
 *
 * The package intentionally doesn't ship interpolation, plurals, or async
 * loaders yet — that lands when we wire actual locale switching. For now
 * the contract is just: every user-visible string must be authored as a
 * key here, not a hard-coded literal in the UI.
 */
export function getTranslator(locale: Locale = defaultLocale): Translator {
  const primary = tables[locale];
  return (key) => primary[key] ?? nl[key];
}
