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

  // Auth brand panel ((auth)/layout.tsx). Headline is split into three parts
  // because the middle word renders italic; word-order swaps in other
  // locales should be handled by editing the parts, not by hand-merging.
  'auth.layout.eyebrow': 'Verhuurbeheer',
  'auth.layout.headline.lead': 'Eén plek voor je',
  'auth.layout.headline.emphasis': 'volledige',
  'auth.layout.headline.tail': 'verhuur.',
  'auth.layout.subhead':
    'Of je nu een makelaarskantoor runt of je eigen pand verhuurt — beheer panden, kandidaten en je team vanuit één rustige werkomgeving.',
  'auth.layout.tag.agency': 'Makelaars',
  'auth.layout.tag.private': 'Private eigenaars',

  // Shared across the auth flows.
  'auth.field.email': 'E-mailadres',
  'auth.field.password': 'Wachtwoord',
  'auth.common.back': 'Terug',
  'auth.common.backToSignIn': 'Terug naar inloggen',

  // Validation messages — surfaced inline next to fields, so they should
  // read like full sentences.
  'auth.validation.email.invalid': 'Voer een geldig e-mailadres in.',
  'auth.validation.password.tooShort': 'Wachtwoord moet minstens 8 tekens lang zijn.',
  'auth.validation.password.required': 'Wachtwoord is verplicht.',
  'auth.validation.name.required': 'Naam is verplicht.',

  // Sign-in.
  'auth.signIn.eyebrow': 'Welkom terug',
  'auth.signIn.title': 'Inloggen',
  'auth.signIn.description': 'Meld je aan om verder te gaan met je verhuurbeheer.',
  'auth.signIn.forgotPassword': 'Wachtwoord vergeten?',
  'auth.signIn.submit': 'Inloggen',
  'auth.signIn.noAccount': 'Nog geen account?',
  'auth.signIn.registerCta': 'Registreren',
  'auth.signIn.error.invalid': 'Onjuist e-mailadres of wachtwoord.',
  'auth.signIn.error.unverified':
    'Verifieer eerst je e-mailadres via de link in je inbox.',

  // Sign-up — step 1 (kind picker).
  'auth.signUp.stepIndicator.kind': 'Stap 1 van 2',
  'auth.signUp.title': 'Account aanmaken',
  'auth.signUp.kindDescription':
    'Hoe verhuur je? Deze keuze bepaalt je werkomgeving en kan later niet gewijzigd worden.',
  'auth.signUp.kind.agency.title': 'Ik ben een makelaar',
  'auth.signUp.kind.agency.description':
    'Een kantoor met meerdere agenten. Nodig je team uit.',
  'auth.signUp.kind.private.title': 'Ik verhuur mijn eigen pand',
  'auth.signUp.kind.private.description':
    'Een private eigenaar. Optioneel één mede-eigenaar.',

  // Sign-up — step 2 (details).
  'auth.signUp.details.title': 'Accountgegevens',
  'auth.signUp.details.subtitle.agency': 'Makelaarskantoor',
  'auth.signUp.details.subtitle.private': 'Private verhuur',
  'auth.signUp.field.name': 'Je naam',
  'auth.signUp.field.orgName': 'Naam makelaarskantoor',
  'auth.signUp.error.orgNameMissing': 'Geef de naam van je makelaarskantoor op.',
  'auth.signUp.error.generic': 'Registratie mislukt. Probeer opnieuw.',
  'auth.signUp.submit': 'Account aanmaken',

  // Sign-up — verify-pending state shown when emailVerification is required.
  'auth.signUp.verifyPending.title': 'Controleer je inbox',
  'auth.signUp.verifyPending.description':
    'We hebben een verificatielink gestuurd naar {email}. Klik erop om je account te activeren.',

  // Sign-up footer (cross-link to sign-in).
  'auth.signUp.haveAccount': 'Al een account?',
  'auth.signUp.signInCta': 'Inloggen',

  // Verify-email landing page.
  'auth.verifyEmail.title.working': 'E-mail verifiëren',
  'auth.verifyEmail.title.failed': 'Verificatie mislukt',
  'auth.verifyEmail.description.working':
    'Een ogenblik geduld terwijl we je account activeren…',
  'auth.verifyEmail.description.failed':
    'Deze verificatielink is ongeldig of verlopen.',

  // Forgot-password.
  'auth.forgotPassword.title': 'Wachtwoord vergeten',
  'auth.forgotPassword.description':
    'We sturen je een link om een nieuw wachtwoord in te stellen.',
  'auth.forgotPassword.submit': 'Stuur reset-link',
  'auth.forgotPassword.error': 'Er ging iets mis. Probeer het opnieuw.',
  'auth.forgotPassword.success':
    'Als er een account bestaat voor {email}, is er een reset-link verstuurd.',

  // Reset-password.
  'auth.resetPassword.title': 'Nieuw wachtwoord',
  'auth.resetPassword.description': 'Kies een nieuw wachtwoord voor je account.',
  'auth.resetPassword.field.password': 'Nieuw wachtwoord',
  'auth.resetPassword.submit': 'Wachtwoord opslaan',
  'auth.resetPassword.error':
    'Deze link is verlopen of ongeldig. Vraag een nieuwe aan.',
  'auth.resetPassword.invalid.title': 'Ongeldige link',
  'auth.resetPassword.invalid.description': 'Deze reset-link is ongeldig.',
  'auth.resetPassword.invalid.cta': 'Vraag een nieuwe aan',
} as const;

export type Translations = typeof nl;
export type TranslationKey = keyof Translations;
