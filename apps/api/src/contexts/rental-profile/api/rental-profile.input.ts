import type { RentalProfilePatch } from '../domain/rental-profile.aggregate';

const TOP_LEVEL_KEYS = new Set([
  'identity',
  'household',
  'employment',
  'financial',
  'move',
  'bio',
]);

const IDENTITY_KEYS = new Set(['firstName', 'lastName', 'dateOfBirth', 'phone', 'nationality']);
const HOUSEHOLD_KEYS = new Set(['householdSize', 'hasPets', 'petDescription']);
const EMPLOYMENT_KEYS = new Set(['status', 'employer', 'monthsAtEmployer']);
const FINANCIAL_KEYS = new Set([
  'monthlyNetIncomeCents',
  'incomeProofType',
  'guaranteeCapacityCents',
]);
const MOVE_KEYS = new Set(['desiredMoveInDate', 'willingToDomicile']);

/**
 * Parses untrusted body input into a domain-shaped patch. Rejects unknown
 * fields rather than silently dropping them, so a misnamed key from a client
 * surfaces as a 400 instead of vanishing.
 */
export function parseRentalProfileInput(body: unknown): RentalProfilePatch {
  if (!isObject(body)) {
    throw new Error('Body must be a JSON object');
  }

  rejectUnknown(body, TOP_LEVEL_KEYS, '');

  const out: RentalProfilePatch = {};

  if ('identity' in body) out.identity = parseSection(body.identity, IDENTITY_KEYS, 'identity');
  if ('household' in body) out.household = parseSection(body.household, HOUSEHOLD_KEYS, 'household');
  if ('employment' in body)
    out.employment = parseSection(body.employment, EMPLOYMENT_KEYS, 'employment');
  if ('financial' in body)
    out.financial = parseSection(body.financial, FINANCIAL_KEYS, 'financial');
  if ('move' in body) out.move = parseSection(body.move, MOVE_KEYS, 'move');
  if ('bio' in body) {
    if (body.bio !== null && typeof body.bio !== 'string') {
      throw new Error('bio must be a string');
    }
    out.bio = body.bio;
  }

  return out;
}

function parseSection(
  value: unknown,
  allowed: Set<string>,
  path: string,
): Record<string, unknown> {
  if (!isObject(value)) {
    throw new Error(`${path} must be an object`);
  }
  rejectUnknown(value, allowed, path);
  return value;
}

function rejectUnknown(obj: Record<string, unknown>, allowed: Set<string>, path: string): void {
  for (const key of Object.keys(obj)) {
    if (!allowed.has(key)) {
      const prefix = path ? `${path}.` : '';
      throw new Error(`Unknown field: ${prefix}${key}`);
    }
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
