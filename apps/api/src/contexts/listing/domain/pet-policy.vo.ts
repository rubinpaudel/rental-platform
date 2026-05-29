export interface PetPolicy {
  readonly allowsLargePets: boolean | null;
  readonly allowsSmallPets: boolean | null;
  readonly smokingAllowed: boolean | null;
}

export interface PetPolicyInput {
  allowsLargePets?: boolean | null;
  allowsSmallPets?: boolean | null;
  smokingAllowed?: boolean | null;
}

export function petPolicy(input: PetPolicyInput): PetPolicy {
  return {
    allowsLargePets: input.allowsLargePets ?? null,
    allowsSmallPets: input.allowsSmallPets ?? null,
    smokingAllowed: input.smokingAllowed ?? null,
  };
}

export const EMPTY_PET_POLICY: PetPolicy = {
  allowsLargePets: null,
  allowsSmallPets: null,
  smokingAllowed: null,
};
