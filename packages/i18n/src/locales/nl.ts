// Dutch is the source of truth: this object's shape defines the set of
// translation keys (see `Translations` in ../index.ts). Other locales are
// typed as Partial<Translations> and fall back to nl when a key is missing.

export const nl = {
  // App shell — used for <html> metadata and the home placeholder.
  'app.title': 'Huurplatform — Verhuurder',
  'app.description': 'Beheer je verhuur als makelaar of private eigenaar.',

  'home.heading': 'Huurplatform — Verhuurder',
  'home.body': 'Scaffold klaar. Auth-flows en dashboard komen in vervolg-PRs.',
} as const;

export type Translations = typeof nl;
export type TranslationKey = keyof Translations;
