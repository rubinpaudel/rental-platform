import { describe, expect, it } from 'vitest';
import type { ProfileDto } from './dto.types';
import {
  STEPS,
  STEPS_BY_ID,
  STEP_IDS,
  defaultsForStep,
  isStepAnswered,
  isStepApplicable,
  nameStepSchema,
  petsStepSchema,
  skipPatch,
  stepInputSchemas,
  stepToPatch,
} from './steps';

const emptyDto: ProfileDto = {
  userId: 'u_1',
  identity: {
    firstName: null,
    lastName: null,
    dateOfBirth: null,
    phone: null,
    nationality: null,
  },
  household: { householdSize: null, hasPets: null, petDescription: null },
  employment: { status: null, employer: null, monthsAtEmployer: null },
  financial: {
    monthlyNetIncomeCents: null,
    incomeProofType: null,
    guaranteeCapacityCents: null,
  },
  move: { desiredMoveInDate: null, willingToDomicile: null },
  bio: '',
  completeness: 0,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('step registry shape', () => {
  it('lists every step id exactly once', () => {
    const ids = STEPS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([...STEP_IDS]);
  });

  it('exposes a schema for every step id', () => {
    for (const id of STEP_IDS) {
      expect(stepInputSchemas[id]).toBeDefined();
    }
  });

  it('indexes steps by id', () => {
    for (const step of STEPS) {
      expect(STEPS_BY_ID[step.id]).toBe(step);
    }
  });
});

describe('step input schemas', () => {
  it('nameStep requires both first and last name', () => {
    expect(nameStepSchema.safeParse({ firstName: 'Ada', lastName: 'L' }).success).toBe(true);
    expect(nameStepSchema.safeParse({ firstName: '', lastName: 'L' }).success).toBe(false);
    expect(nameStepSchema.safeParse({ firstName: 'Ada', lastName: '' }).success).toBe(false);
  });

  it('petsStep allows true+description and false+no-description', () => {
    expect(
      petsStepSchema.safeParse({ hasPets: true, petDescription: 'Two cats' }).success,
    ).toBe(true);
    expect(petsStepSchema.safeParse({ hasPets: false }).success).toBe(true);
  });

  it('petsStep rejects false+description as inconsistent', () => {
    const result = petsStepSchema.safeParse({
      hasPets: false,
      petDescription: 'Two cats',
    });
    expect(result.success).toBe(false);
  });
});

describe('stepToPatch / skipPatch', () => {
  it('targets exactly the changed section per step', () => {
    expect(stepToPatch('name', { firstName: 'Ada', lastName: 'L' })).toEqual({
      identity: { firstName: 'Ada', lastName: 'L' },
    });
    expect(stepToPatch('income', { monthlyNetIncomeCents: 250_000 })).toEqual({
      financial: { monthlyNetIncomeCents: 250_000 },
    });
    expect(stepToPatch('bio', { bio: 'Hallo' })).toEqual({ bio: 'Hallo' });
  });

  it('skipPatch nulls the fields the step owns', () => {
    expect(skipPatch('phone')).toEqual({ identity: { phone: null } });
    expect(skipPatch('pets')).toEqual({
      household: { hasPets: null, petDescription: null },
    });
    expect(skipPatch('bio')).toEqual({ bio: null });
  });
});

describe('isStepAnswered', () => {
  it('returns false for every step on an empty profile', () => {
    for (const step of STEPS) {
      expect(isStepAnswered(step, emptyDto)).toBe(false);
    }
  });

  it('returns true once the step’s primary fields are populated', () => {
    const dto: ProfileDto = {
      ...emptyDto,
      identity: { ...emptyDto.identity, firstName: 'Ada', lastName: 'L' },
    };
    expect(isStepAnswered(STEPS_BY_ID.name, dto)).toBe(true);
    expect(isStepAnswered(STEPS_BY_ID['date-of-birth'], dto)).toBe(false);
  });

  it('treats hasPets:false as answered (the user said "no")', () => {
    const dto: ProfileDto = {
      ...emptyDto,
      household: { ...emptyDto.household, hasPets: false },
    };
    expect(isStepAnswered(STEPS_BY_ID.pets, dto)).toBe(true);
  });
});

describe('isStepApplicable', () => {
  it('hides the employer step for unemployed / student / retired profiles', () => {
    const dto: ProfileDto = {
      ...emptyDto,
      employment: { ...emptyDto.employment, status: 'student' },
    };
    expect(isStepApplicable(STEPS_BY_ID.employer, dto)).toBe(false);
  });

  it('shows the employer step for employed_indef', () => {
    const dto: ProfileDto = {
      ...emptyDto,
      employment: { ...emptyDto.employment, status: 'employed_indef' },
    };
    expect(isStepApplicable(STEPS_BY_ID.employer, dto)).toBe(true);
  });

  it('keeps non-conditional steps applicable regardless of state', () => {
    expect(isStepApplicable(STEPS_BY_ID.name, emptyDto)).toBe(true);
    expect(isStepApplicable(STEPS_BY_ID.bio, emptyDto)).toBe(true);
  });
});

describe('defaultsForStep', () => {
  it('uses sensible blanks for an empty profile', () => {
    expect(defaultsForStep('name', emptyDto)).toEqual({
      firstName: '',
      lastName: '',
    });
    expect(defaultsForStep('household-size', emptyDto)).toEqual({
      householdSize: 1,
    });
  });

  it('pre-fills from the profile when values are present', () => {
    const dto: ProfileDto = {
      ...emptyDto,
      identity: { ...emptyDto.identity, firstName: 'Ada', lastName: 'L' },
    };
    expect(defaultsForStep('name', dto)).toEqual({
      firstName: 'Ada',
      lastName: 'L',
    });
  });
});
