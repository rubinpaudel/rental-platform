// Dutch is the source of truth: this object's shape defines the set of
// translation keys (see `Translations` in ../index.ts). Other locales are
// typed as Partial<Translations> and fall back to nl when a key is missing.

export const nl = {
  // App shell — used for <html> metadata and the home placeholder.
  'app.title': 'Huurplatform — Verhuurder',
  'app.description': 'Beheer je verhuur als makelaar of private eigenaar.',

  'home.heading': 'Huurplatform — Verhuurder',
  'home.body': 'Scaffold klaar. Auth-flows en dashboard komen in vervolg-PRs.',

  // Org-kind-aware copy (lib/org-kind.ts). Agency = multi-agent makelaar,
  // private = single private landlord who may invite at most one co-owner.
  'orgKind.agency.invite': 'Nodig teamlid uit',
  'orgKind.agency.team': 'Beheer makelaars',
  'orgKind.agency.greeting': 'Welkom bij {orgName}',
  'orgKind.agency.badge': 'Agency',
  'orgKind.agency.listing': 'Nieuwe listing',

  'orgKind.private.invite': 'Nodig mede-eigenaar uit',
  'orgKind.private.team': 'Beheer mede-eigenaar',
  'orgKind.private.greeting': 'Jouw verhuur',
  'orgKind.private.badge': 'Private',
  'orgKind.private.listing': 'Verhuur jouw pand',
} as const;

export type Translations = typeof nl;
export type TranslationKey = keyof Translations;
