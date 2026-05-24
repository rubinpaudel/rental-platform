import type { ProfileDto, StepId } from '@rental-platform/profile-schema';
import { getTranslator } from '@rental-platform/i18n';

const t = getTranslator();

// User-facing display of a step's current answer on the overview. Each
// formatter returns either the human string OR `null` to render the
// universal "—" placeholder for unanswered fields. Keeps overview row
// code small (no per-step value plumbing in the cards).

export type StepDisplay = string | null;

export function stepDisplayValue(
  step: StepId,
  profile: ProfileDto,
): StepDisplay {
  switch (step) {
    case 'name': {
      const { firstName, lastName } = profile.identity;
      if (!firstName && !lastName) return null;
      return [firstName, lastName].filter(Boolean).join(' ');
    }
    case 'date-of-birth':
      return formatISO(profile.identity.dateOfBirth);
    case 'phone':
      return profile.identity.phone;
    case 'nationality':
      return profile.identity.nationality;
    case 'household-size': {
      const n = profile.household.householdSize;
      return n == null ? null : `${n} ${n === 1 ? 'persoon' : 'personen'}`;
    }
    case 'pets': {
      const has = profile.household.hasPets;
      if (has == null) return null;
      if (!has) return t('profile.wizard.step.pets.no');
      return profile.household.petDescription
        ? `${t('profile.wizard.step.pets.yes')} · ${profile.household.petDescription}`
        : t('profile.wizard.step.pets.yes');
    }
    case 'employment-status': {
      const s = profile.employment.status;
      return s ? t(`profile.wizard.step.employment-status.option.${s}`) : null;
    }
    case 'employer':
      return profile.employment.employer;
    case 'income':
      return formatCents(profile.financial.monthlyNetIncomeCents);
    case 'income-proof': {
      const p = profile.financial.incomeProofType;
      return p ? t(`profile.wizard.step.income-proof.option.${p}`) : null;
    }
    case 'guarantee':
      return formatCents(profile.financial.guaranteeCapacityCents);
    case 'move-date':
      return formatISO(profile.move.desiredMoveInDate);
    case 'domicile': {
      const w = profile.move.willingToDomicile;
      if (w == null) return null;
      return w
        ? t('profile.wizard.step.domicile.yes')
        : t('profile.wizard.step.domicile.no');
    }
    case 'bio': {
      const bio = profile.bio.trim();
      if (!bio) return null;
      return bio.length > 60 ? `${bio.slice(0, 57)}…` : bio;
    }
  }
}

function formatISO(iso: string | null): StepDisplay {
  if (!iso) return null;
  // ISO yyyy-MM-dd → dd/MM/yyyy without round-tripping through Date
  // (avoids timezone drift on the wire).
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function formatCents(cents: number | null): StepDisplay {
  if (cents == null) return null;
  const euros = cents / 100;
  // BE locale uses comma decimals + space thousands. Intl is fine in
  // Hermes; passes through to react-native's polyfill.
  const formatted = new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(euros);
  return formatted;
}
