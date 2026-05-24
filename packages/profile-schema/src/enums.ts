// Mirrors the server-side value objects:
//   apps/api/src/contexts/profile/domain/employment.vo.ts
//   apps/api/src/contexts/profile/domain/financial.vo.ts
//
// These literal arrays are the source of truth for both the wire schema
// (PATCH /me/profile validates against them) and the mobile selector UIs
// (segmented controls iterate them). Keep in sync with the VOs above.

export const EMPLOYMENT_STATUSES = [
  'employed_indef',
  'employed_fixed',
  'self_employed',
  'student',
  'unemployed',
  'retired',
] as const;
export type EmploymentStatus = (typeof EMPLOYMENT_STATUSES)[number];

export const INCOME_PROOF_TYPES = [
  'payslips',
  'tax_assessment',
  'accountant_statement',
  'other',
] as const;
export type IncomeProofType = (typeof INCOME_PROOF_TYPES)[number];

// Employment statuses where employer/months-at-employer make sense.
// Self-employed people can fill an employer (their own company name); the
// remaining statuses don't have one to report.
export const EMPLOYMENT_STATUSES_WITH_EMPLOYER: readonly EmploymentStatus[] = [
  'employed_indef',
  'employed_fixed',
  'self_employed',
] as const;

export function statusAllowsEmployer(
  status: EmploymentStatus | null | undefined,
): boolean {
  return status != null && EMPLOYMENT_STATUSES_WITH_EMPLOYER.includes(status);
}
