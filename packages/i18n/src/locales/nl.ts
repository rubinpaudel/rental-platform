// Dutch is the source of truth: this object's shape defines the set of
// translation keys (see `Translations` in ../index.ts). Other locales are
// typed as Partial<Translations> and fall back to nl when a key is missing.

export const nl = {
  // App shell — used for <html> metadata and the home placeholder.
  'app.title': 'plekje — Verhuurder',
  'app.description': 'Beheer je verhuur als makelaar of private eigenaar.',

  'home.heading': 'plekje — Verhuurder',
  'home.body': 'Scaffold klaar. Auth-flows en dashboard komen in vervolg-PRs.',

  // Mobile home (v2b). Empty home screen for tenants; real discovery UI
  // lands in v8. Used by `(app)/index.tsx` and `tenant-only-screen.tsx`.
  'home.tenant.greeting': 'Hoi {name}',
  'home.tenant.body':
    'Je bent ingelogd. Woningen ontdekken komt in een volgende update.',
  'home.signOut': 'Uitloggen',

  // Mobile guard: a signed-in landlord on the tenant app is told to use
  // the web instead. Shown by app/(app)/_layout when role !== 'tenant'.
  'home.landlord.title': 'Dit is de huurder-app',
  'home.landlord.body':
    'Verhuurder-tools zitten in de webapp. Open die in je browser of log uit.',
  'home.landlord.openWebApp': 'Webapp openen',

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

  // Shared across the auth flows.
  'auth.field.email': 'E-mailadres',
  'auth.field.password': 'Wachtwoord',
  'auth.common.backToSignIn': 'Terug naar inloggen',
  'auth.common.next': 'Volgende',

  // Mobile (v2b) welcome / landing screen. Empty above, two stacked CTAs +
  // disclaimer pinned to the bottom. Entry point for every unauthenticated
  // session on mobile; AuthSwitch redirects here when no session is found.
  'auth.welcome.signIn': 'Inloggen',
  'auth.welcome.createAccount': 'Account aanmaken',
  'auth.welcome.disclaimer':
    'Door verder te gaan ga je akkoord met onze algemene voorwaarden en het privacybeleid.',

  // Mobile (v2b) sign-in — conversational layout: title + description top,
  // form centered, "Next" button at the bottom.
  'auth.signIn.heading': 'Welkom terug',
  'auth.signIn.subheading': 'Voer je gegevens in om door te gaan.',

  // Mobile (v2b) forgot-password — conversational layout.
  'auth.forgotPassword.heading': 'Wachtwoord vergeten',
  'auth.forgotPassword.subheading':
    'Voer je e-mailadres in en we sturen je een link om een nieuw wachtwoord in te stellen.',

  // Mobile (v2b) reset-password — conversational layout.
  'auth.resetPassword.heading': 'Nieuw wachtwoord',
  'auth.resetPassword.subheading': 'Kies een nieuw wachtwoord voor je account.',

  // Validation messages — surfaced inline next to fields, so they should
  // read like full sentences.
  'auth.validation.email.invalid': 'Voer een geldig e-mailadres in.',
  'auth.validation.password.tooShort': 'Wachtwoord moet minstens 8 tekens lang zijn.',
  'auth.validation.password.required': 'Wachtwoord is verplicht.',
  'auth.validation.name.required': 'Naam is verplicht.',
  'auth.validation.kind.required': 'Kies een type.',

  // Sign-in.
  'auth.signIn.title': 'Inloggen',
  'auth.signIn.description': 'Meld je aan om verder te gaan met je verhuurbeheer.',
  'auth.signIn.forgotPassword': 'Wachtwoord vergeten?',
  'auth.signIn.submit': 'Inloggen',
  'auth.signIn.noAccount': 'Nog geen account?',
  'auth.signIn.registerCta': 'Registreren',
  'auth.signIn.error.invalid': 'Onjuist e-mailadres of wachtwoord.',
  'auth.signIn.error.unverified':
    'Verifieer eerst je e-mailadres via de link in je inbox.',
  // Mobile-only: discreet pointer to the landlord web app from the
  // tenant sign-in screen.
  'auth.signIn.landlordHint':
    'Verhuurder? Gebruik de webapp op app.plekje.eu',

  // Sign-up (single combined form).
  'auth.signUp.title': 'Account aanmaken',
  'auth.signUp.description':
    'Kies hoe je verhuurt en vul je gegevens in. Het type kan later niet gewijzigd worden.',
  'auth.signUp.field.kind': 'Type',
  'auth.signUp.field.kind.placeholder': 'Kies een type',
  'auth.signUp.kind.agency.title': 'Makelaar',
  'auth.signUp.kind.private.title': 'Particulier',
  'auth.signUp.field.name': 'Je naam',
  'auth.signUp.field.orgName': 'Naam makelaarskantoor',
  'auth.signUp.error.orgNameMissing': 'Geef de naam van je makelaarskantoor op.',
  'auth.signUp.error.generic': 'Registratie mislukt. Probeer opnieuw.',
  'auth.signUp.submit': 'Account aanmaken',

  // Sign-up — verify-pending state shown when emailVerification is required.
  'auth.signUp.verifyPending.title': 'Controleer je inbox',
  'auth.signUp.verifyPending.description':
    'We hebben een verificatielink gestuurd naar {email}. Klik erop om je account te activeren.',
  // Mobile-only: resend button + outcome on the verify-pending screen.
  'auth.signUp.verifyPending.resend': 'Opnieuw versturen',
  'auth.signUp.verifyPending.resendSuccess':
    'Verificatielink opnieuw verstuurd naar {email}.',
  'auth.signUp.verifyPending.resendError':
    'Versturen mislukt. Probeer het zo opnieuw.',

  // Mobile-only sign-up sub-copy: the role picker is hidden on mobile
  // (tenants-only), so the description differs from the web app.
  'auth.signUp.mobile.description':
    'Maak een account aan om woningen te ontdekken en je interesse te tonen.',

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

  // Accept-invitation flow (auth/accept-invitation/[token]).
  'acceptInvitation.title.signedOut': 'Je bent uitgenodigd',
  'acceptInvitation.description.signedOut':
    'Meld je aan of registreer om de uitnodiging te accepteren.',
  'acceptInvitation.title.signedIn': 'Uitnodiging accepteren',
  'acceptInvitation.description.signedIn':
    'Je bent ingelogd als {email}. Word lid van de organisatie.',
  'acceptInvitation.submit': 'Accepteer uitnodiging',
  'acceptInvitation.error.invalid': 'Deze uitnodiging is ongeldig of al gebruikt.',
  'acceptInvitation.error.generic':
    'Uitnodiging accepteren mislukt. Probeer opnieuw.',

  // Org switcher (features/org/org-switcher).
  'org.switcher.trigger': 'Wissel organisatie',
  'org.switcher.label': 'Organisaties',

  // App shell.
  'shell.signOut': 'Afmelden',

  // ─── Rental profile (v6 mobile) ─────────────────────────────────────
  // The "huurpaspoort" wizard + overview. One screen per question,
  // sticky "always" CTA at the bottom, server-backed resume.

  // Bottom tab labels (v6 mobile shell).
  'tabs.home': 'Home',
  'tabs.profile': 'Profiel',

  // Wizard chrome.
  'profile.wizard.cta.continue': 'Doorgaan',
  'profile.wizard.cta.skip': 'Sla over',
  'profile.wizard.cta.save': 'Opslaan',
  'profile.wizard.cta.finish': 'Klaar',
  'profile.wizard.loading': 'Bezig met laden…',
  'profile.wizard.error.network':
    'We konden je profiel niet ophalen. Controleer je verbinding.',
  'profile.wizard.error.generic': 'Er ging iets mis. Probeer het opnieuw.',
  'profile.wizard.finished.title': 'Klaar, dankjewel!',
  'profile.wizard.finished.description':
    'Je profiel is opgeslagen. Je kan altijd nog aanpassen vanuit je overzicht.',

  // Section labels (overview cards + edit-mode title).
  'profile.section.identity': 'Wie ben je',
  'profile.section.household': 'Huishouden',
  'profile.section.employment': 'Werk',
  'profile.section.financial': 'Financieel',
  'profile.section.move': 'Verhuizing',
  'profile.section.about': 'Over jezelf',

  // Step copy. Each step keeps a short title (the question) and a
  // one-line description (the "why") so users see why we're asking.
  'profile.wizard.step.name.title': 'Hoe heet je?',
  'profile.wizard.step.name.description':
    'We tonen je naam aan verhuurders bij elke aanvraag.',
  'profile.wizard.step.name.field.firstName': 'Voornaam',
  'profile.wizard.step.name.field.lastName': 'Achternaam',

  'profile.wizard.step.date-of-birth.title': 'Wanneer ben je geboren?',
  'profile.wizard.step.date-of-birth.description':
    'Verhuurders mogen wettelijk je leeftijd weten.',

  'profile.wizard.step.phone.title': 'Wat is je telefoonnummer?',
  'profile.wizard.step.phone.description':
    'Verhuurders gebruiken dit om bezichtigingen te plannen.',
  'profile.wizard.step.phone.field.phone': 'Telefoonnummer',

  'profile.wizard.step.nationality.title': 'Wat is je nationaliteit?',
  'profile.wizard.step.nationality.description':
    'Optioneel — verhuurders gebruiken dit alleen ter info.',
  'profile.wizard.step.nationality.placeholder': 'Kies een land',

  'profile.wizard.step.household-size.title':
    'Met hoeveel personen ga je wonen?',
  'profile.wizard.step.household-size.description':
    'Tel jezelf, partner, kinderen en eventuele huisgenoten mee.',
  'profile.wizard.step.household-size.field': 'Aantal personen',

  'profile.wizard.step.pets.title': 'Heb je huisdieren?',
  'profile.wizard.step.pets.description':
    'Sommige verhuurders staan geen huisdieren toe. Eerlijk zijn helpt.',
  'profile.wizard.step.pets.yes': 'Ja',
  'profile.wizard.step.pets.no': 'Nee',
  'profile.wizard.step.pets.field.description':
    'Welke huisdieren? (bv. "twee katten")',

  'profile.wizard.step.employment-status.title': 'Wat is je werksituatie?',
  'profile.wizard.step.employment-status.description':
    'Verhuurders kijken hiernaar om huurzekerheid in te schatten.',
  'profile.wizard.step.employment-status.option.employed_indef':
    'Vast contract',
  'profile.wizard.step.employment-status.option.employed_fixed':
    'Tijdelijk contract',
  'profile.wizard.step.employment-status.option.self_employed': 'Zelfstandig',
  'profile.wizard.step.employment-status.option.student': 'Student',
  'profile.wizard.step.employment-status.option.unemployed': 'Werkzoekend',
  'profile.wizard.step.employment-status.option.retired': 'Gepensioneerd',

  'profile.wizard.step.employer.title': 'Bij welke werkgever werk je?',
  'profile.wizard.step.employer.description':
    'Optioneel. Help verhuurders je situatie beter inschatten.',
  'profile.wizard.step.employer.field.employer': 'Naam werkgever',
  'profile.wizard.step.employer.field.months': 'Hoeveel maanden al?',

  'profile.wizard.step.income.title': 'Wat is je netto maandinkomen?',
  'profile.wizard.step.income.description':
    'Meestal moet je inkomen ongeveer drie keer de huur zijn.',
  'profile.wizard.step.income.field': 'Netto per maand (€)',

  'profile.wizard.step.income-proof.title':
    'Welk bewijs van inkomen kun je leveren?',
  'profile.wizard.step.income-proof.description':
    'Optioneel — pas later toevoegen kan ook.',
  'profile.wizard.step.income-proof.option.payslips': 'Loonbrieven',
  'profile.wizard.step.income-proof.option.tax_assessment': 'Aanslagbiljet',
  'profile.wizard.step.income-proof.option.accountant_statement':
    'Boekhoudersverklaring',
  'profile.wizard.step.income-proof.option.other': 'Iets anders',

  'profile.wizard.step.guarantee.title':
    'Welk bedrag kun je als huurwaarborg neerleggen?',
  'profile.wizard.step.guarantee.description':
    'Meestal twee tot drie maanden huur.',
  'profile.wizard.step.guarantee.field': 'Waarborg (€)',

  'profile.wizard.step.move-date.title': 'Wanneer wil je verhuizen?',
  'profile.wizard.step.move-date.description':
    'Optioneel — kies een richtdatum. Je kan dit altijd nog wijzigen.',

  'profile.wizard.step.domicile.title': 'Wil je je domicilie verplaatsen?',
  'profile.wizard.step.domicile.description':
    'Sommige verhuurders eisen dat je domicilie op het adres staat.',
  'profile.wizard.step.domicile.yes': 'Ja',
  'profile.wizard.step.domicile.no': 'Nee',

  'profile.wizard.step.bio.title': 'Vertel iets over jezelf',
  'profile.wizard.step.bio.description':
    'Een korte tekst helpt verhuurders je beter te leren kennen.',
  'profile.wizard.step.bio.field': 'Over jezelf',
  'profile.wizard.step.bio.placeholder':
    'Bv. wat je doet, of je rustig of sociaal bent, …',

  // Profile overview screen (lands in PR 4).
  'profile.overview.title': 'Je huurpaspoort',
  'profile.overview.completeness': '{pct}% compleet',
  'profile.overview.editCta': 'Aanpassen',
  'profile.overview.startWizardCta': 'Vul je profiel aan',
} as const;

export type Translations = typeof nl;
export type TranslationKey = keyof Translations;
