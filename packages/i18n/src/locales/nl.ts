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
  'shell.nav.listings': 'Listings',
  'shell.nav.listings.private': 'Mijn verhuur',
  'shell.nav.inbox': 'Inbox',
  'shell.nav.calendar': 'Agenda',
  'shell.nav.settings': 'Instellingen',
  'shell.nav.team': 'Team',
  'shell.nav.coOwner': 'Mede-eigenaar',

  // Listings — index page.
  'listings.title': 'Listings',
  'listings.title.private': 'Mijn verhuur',
  'listings.new': 'Nieuwe listing',
  'listings.new.private': 'Mijn pand instellen',
  'listings.empty.title.agency': 'Voeg je eerste pand toe',
  'listings.empty.title.private': 'Verhuur jouw pand',
  'listings.empty.description.agency':
    'Maak je eerste listing aan om panden zichtbaar te maken voor huurders.',
  'listings.empty.description.private':
    'Maak je listing aan en bereik huurders in heel België.',
  'listings.empty.cta.agency': 'Voeg je eerste pand toe',
  'listings.empty.cta.private': 'Verhuur jouw pand',
  'listings.softLimit.warning':
    'Particuliere verhuurders kunnen post-MLP een limiet krijgen op het aantal listings.',

  // Listings table columns.
  'listings.table.title': 'Titel',
  'listings.table.address': 'Adres',
  'listings.table.status': 'Status',
  'listings.table.price': 'Prijs',
  'listings.table.views': 'Weergaves',
  'listings.table.applications': 'Aanvragen',
  'listings.table.updated': 'Bijgewerkt',
  'listings.table.actions': 'Acties',

  // Status labels.
  'listings.status.draft': 'Concept',
  'listings.status.active': 'Actief',
  'listings.status.inactive': 'Inactief',
  'listings.status.closed': 'Gesloten',

  // Listing row actions.
  'listings.action.activate': 'Activeer',
  'listings.action.deactivate': 'Deactiveer',
  'listings.action.edit': 'Bewerken',
  'listings.action.photos': 'Foto’s',
  'listings.action.delete': 'Sluiten',
  'listings.action.menu': 'Meer acties',

  // Form labels and steps.
  'listings.form.step.basics': 'Basis',
  'listings.form.step.address': 'Adres',
  'listings.form.step.photos': 'Foto’s',
  'listings.form.step.review': 'Overzicht',
  'listings.form.step.indicator': 'Stap {current} van {total}',

  'listings.form.field.title': 'Titel',
  'listings.form.field.title.placeholder': 'bv. Lichte 2-slaapkamer in centrum Gent',
  'listings.form.field.description': 'Beschrijving',
  'listings.form.field.description.placeholder':
    'Vertel huurders wat dit pand bijzonder maakt: ligging, indeling, ramen, terras…',
  'listings.form.field.price': 'Maandhuur (€)',
  'listings.form.field.surface': 'Oppervlakte (m²)',
  'listings.form.field.rooms': 'Aantal slaapkamers',
  'listings.form.field.street': 'Straat',
  'listings.form.field.number': 'Nummer',
  'listings.form.field.box': 'Bus (optioneel)',
  'listings.form.field.postalCode': 'Postcode',
  'listings.form.field.municipality': 'Gemeente',
  'listings.form.field.region': 'Gewest',

  // Validation.
  'listings.validation.title.required': 'Een titel is verplicht.',
  'listings.validation.description.required': 'Een beschrijving helpt huurders.',
  'listings.validation.price.invalid': 'Geef een geldige prijs in euro.',
  'listings.validation.surface.invalid': 'Geef een geldige oppervlakte in m².',
  'listings.validation.rooms.invalid': 'Geef een geldig aantal slaapkamers.',
  'listings.validation.street.required': 'Straat is verplicht.',
  'listings.validation.number.required': 'Huisnummer is verplicht.',
  'listings.validation.postalCode.invalid': 'Een Belgische postcode bestaat uit 4 cijfers.',
  'listings.validation.municipality.required': 'Gemeente is verplicht.',

  // Form actions.
  'listings.form.cancel': 'Annuleren',
  'listings.form.back': 'Terug',
  'listings.form.next': 'Volgende',
  'listings.form.create': 'Aanmaken',
  'listings.form.save': 'Opslaan',
  'listings.form.success.created': 'Listing aangemaakt.',
  'listings.form.success.saved': 'Wijzigingen opgeslagen.',
  'listings.form.error.generic': 'Opslaan mislukt. Probeer opnieuw.',

  // Region labels (matches backend domain enum).
  'listings.region.flanders': 'Vlaanderen',
  'listings.region.wallonia': 'Wallonië',
  'listings.region.brussels': 'Brussel',

  // Detail / view page.
  'listings.detail.notFound.title': 'Listing niet gevonden',
  'listings.detail.notFound.description':
    'Deze listing bestaat niet of hoort niet bij je actieve organisatie.',
  'listings.detail.notFound.cta': 'Terug naar listings',
  'listings.detail.activate': 'Publiceer',
  'listings.detail.deactivate': 'Verberg',
  'listings.detail.editPhotos': 'Foto’s bewerken',
  'listings.detail.section.basics': 'Algemene info',
  'listings.detail.section.address': 'Adres',

  // Photo manager.
  'listings.photos.title': 'Foto’s beheren',
  'listings.photos.subtitle': 'Sleep om de volgorde te wijzigen of voeg nieuwe foto’s toe.',
  'listings.photos.uploadCta': 'Foto’s uploaden',
  'listings.photos.dropHint': 'Sleep foto’s hierheen of klik om te kiezen',
  'listings.photos.uploading': 'Uploaden…',
  'listings.photos.retry': 'Probeer opnieuw',
  'listings.photos.remove': 'Verwijder',
  'listings.photos.empty.title': 'Nog geen foto’s',
  'listings.photos.empty.description':
    'Voeg minstens één foto toe voordat je de listing publiceert.',
  'listings.photos.cover': 'Cover',
  'listings.photos.reorderHint': 'Volgorde wordt automatisch opgeslagen.',
  'listings.photos.reorderSaving': 'Volgorde opslaan…',
  'listings.photos.reorderSaved': 'Volgorde opgeslagen.',
  'listings.photos.uploadError': 'Upload mislukt. Klik om opnieuw te proberen.',
  'listings.photos.done': 'Klaar',

  // New-listing flow (single-question-per-step layout).
  'listings.flow.saveExit': 'Bewaar & sluit',
  'listings.flow.questions': 'Vragen?',
  'listings.flow.propertyType.question': 'Wat past het best bij jouw plek?',
  'listings.flow.address.title': 'Bevestig je adres',
  'listings.flow.address.subtitle':
    'Zorg dat het adres exact klopt. Het wordt direct op je listing getoond zodat huurders je pand kunnen vinden.',
  'listings.flow.basics.title': 'Vertel ons wat over je pand',
  'listings.flow.basics.rooms.question': 'Hoeveel kamers heeft je pand?',
  'listings.flow.basics.surface.question': 'Hoe groot is je pand?',
  'listings.flow.basics.bedrooms': 'Slaapkamers',
  'listings.flow.basics.surface': 'Oppervlakte',
  'listings.flow.basics.surface.unit': 'm²',
  'listings.flow.description.title': 'Maak je beschrijving',
  'listings.flow.description.subtitle': 'Deel wat jouw pand bijzonder maakt.',
  'listings.flow.price.title': 'Stel je maandhuur in',
  'listings.flow.price.subtitle': 'Je kan dit later altijd aanpassen.',
  'listings.flow.submit.error': 'Aanmaken mislukt. Probeer opnieuw.',
  'listings.propertyType.bungalow': 'Bungalow',
  'listings.propertyType.landhuis': 'Landhuis',
  'listings.propertyType.appartement': 'Appartement',
  'listings.propertyType.villa': 'Villa',
  'listings.propertyType.kot': 'Kot',
  'listings.propertyType.penthouse': 'Penthouse',
  'listings.propertyType.serviceFlat': 'Serviceflat',
  'listings.propertyType.duplex': 'Duplex',
  'listings.propertyType.studio': 'Studio',
} as const;

export type Translations = typeof nl;
export type TranslationKey = keyof Translations;
