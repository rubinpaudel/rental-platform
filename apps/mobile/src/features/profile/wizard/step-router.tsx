import type { ReactElement } from 'react';
import type { StepId } from '@rental-platform/profile-schema';
import type { StepScreenProps } from './steps/step-screen.types';
import { NameStep } from './steps/name-step';
import { DateOfBirthStep } from './steps/date-of-birth-step';
import { PhoneStep } from './steps/phone-step';
import { NationalityStep } from './steps/nationality-step';
import { HouseholdSizeStep } from './steps/household-size-step';
import { PetsStep } from './steps/pets-step';
import { EmploymentStatusStep } from './steps/employment-status-step';
import { EmployerStep } from './steps/employer-step';
import { IncomeStep } from './steps/income-step';
import { IncomeProofStep } from './steps/income-proof-step';
import { GuaranteeStep } from './steps/guarantee-step';
import { MoveDateStep } from './steps/move-date-step';
import { DomicileStep } from './steps/domicile-step';
import { BioStep } from './steps/bio-step';

// Maps each step id to its component. Used by both the wizard route
// (`(app)/profile/wizard/[step].tsx`) and section-edit screens
// (PR 4 — same component, mode='edit'). Centralised here so adding a
// step is one entry plus one file.

type StepComponent = (props: StepScreenProps) => ReactElement | null;

export const STEP_COMPONENTS: Readonly<Record<StepId, StepComponent>> = {
  name: NameStep,
  'date-of-birth': DateOfBirthStep,
  phone: PhoneStep,
  nationality: NationalityStep,
  'household-size': HouseholdSizeStep,
  pets: PetsStep,
  'employment-status': EmploymentStatusStep,
  employer: EmployerStep,
  income: IncomeStep,
  'income-proof': IncomeProofStep,
  guarantee: GuaranteeStep,
  'move-date': MoveDateStep,
  domicile: DomicileStep,
  bio: BioStep,
};

export function renderStep(step: StepId, props: StepScreenProps) {
  const Component = STEP_COMPONENTS[step];
  return <Component {...props} />;
}
