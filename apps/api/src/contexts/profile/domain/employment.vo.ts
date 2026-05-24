export const EMPLOYMENT_STATUSES = [
  'employed_indef',
  'employed_fixed',
  'self_employed',
  'student',
  'unemployed',
  'retired',
] as const;

export type EmploymentStatus = (typeof EMPLOYMENT_STATUSES)[number];

export function isEmploymentStatus(value: unknown): value is EmploymentStatus {
  return (
    typeof value === 'string' && (EMPLOYMENT_STATUSES as readonly string[]).includes(value)
  );
}

export function employmentStatus(value: unknown): EmploymentStatus {
  if (!isEmploymentStatus(value)) {
    throw new Error(`Invalid employmentStatus: ${String(value)}`);
  }
  return value;
}

const EMPLOYER_MAX = 200;

export interface Employment {
  readonly status: EmploymentStatus | null;
  readonly employer: string | null;
  readonly monthsAtEmployer: number | null;
}

export const EMPTY_EMPLOYMENT: Employment = {
  status: null,
  employer: null,
  monthsAtEmployer: null,
};

export interface EmploymentInput {
  status?: EmploymentStatus | string | null;
  employer?: string | null;
  monthsAtEmployer?: number | null;
}

export function employment(input: EmploymentInput): Employment {
  const status = input.status == null || input.status === '' ? null : employmentStatus(input.status);
  const employer = normaliseEmployer(input.employer);
  const monthsAtEmployer = normaliseMonths(input.monthsAtEmployer);

  return { status, employer, monthsAtEmployer };
}

function normaliseEmployer(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  if (trimmed === '') return null;
  if (trimmed.length > EMPLOYER_MAX) {
    throw new Error(`employer must be at most ${EMPLOYER_MAX} characters`);
  }
  return trimmed;
}

function normaliseMonths(value: number | null | undefined): number | null {
  if (value == null) return null;
  if (!Number.isInteger(value) || value < 0 || value > 1200) {
    throw new Error('monthsAtEmployer must be an integer between 0 and 1200');
  }
  return value;
}
