// Thin re-export of the shared wire schema. The schema itself lives in
// `@rental-platform/profile-schema` so the Expo mobile wizard can validate
// against the exact same shape it PATCHes the API with.
//
// Semantic validation (enum membership, E.164 phone, ISO date round-trip,
// name length, …) still happens in the domain value objects — see
// ../domain/*.vo.ts. This schema only enforces structure and strict keys.

export {
  profilePatchSchema as profileInputSchema,
  type ProfilePatch as ProfileInput,
} from '@rental-platform/profile-schema';
