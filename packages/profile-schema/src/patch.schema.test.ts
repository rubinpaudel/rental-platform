import { describe, expect, it } from 'vitest';
import { profilePatchSchema } from './patch.schema';

describe('profilePatchSchema', () => {
  it('accepts an empty patch (no sections changed)', () => {
    expect(profilePatchSchema.parse({})).toEqual({});
  });

  it('accepts a single-section patch with nullable fields', () => {
    const input = { identity: { firstName: 'Ada', lastName: null } };
    expect(profilePatchSchema.parse(input)).toEqual(input);
  });

  it('accepts a multi-section patch combining numeric and boolean fields', () => {
    const input = {
      household: { householdSize: 3, hasPets: true },
      financial: { monthlyNetIncomeCents: 250_000 },
      bio: 'Hallo!',
    };
    expect(profilePatchSchema.parse(input)).toEqual(input);
  });

  it('rejects unknown top-level keys', () => {
    expect(() =>
      profilePatchSchema.parse({ identity: {}, bogus: true }),
    ).toThrow();
  });

  it('rejects unknown nested keys', () => {
    expect(() =>
      profilePatchSchema.parse({ identity: { firstName: 'A', smuggled: 1 } }),
    ).toThrow();
  });

  it('lets unknown enum strings through — server-side VOs catch them with field-aware messages', () => {
    // Deliberate: see comment on `employmentPatch` in patch.schema.ts. The
    // wizard's step schemas (steps.ts) enforce enum membership client-side.
    expect(
      profilePatchSchema.parse({ employment: { status: 'rich' } }),
    ).toEqual({ employment: { status: 'rich' } });
  });
});
