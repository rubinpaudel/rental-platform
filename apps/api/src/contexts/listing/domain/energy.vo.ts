// keep in sync with listings_heating_type_chk
export const HEATING_TYPES = [
  'gas',
  'electric',
  'oil',
  'wood',
  'heat_pump',
  'district_heating',
  'other',
] as const;
export type HeatingType = (typeof HEATING_TYPES)[number];

export interface EnergyProfile {
  readonly heatingType: HeatingType | null;
  readonly hasHeatPump: boolean | null;
  readonly hasSolarPanels: boolean | null;
  readonly hasThermalSolar: boolean | null;
  readonly hasSharedBoiler: boolean | null;
  readonly hasDoubleGlazing: boolean | null;
  readonly hasTripleGlazing: boolean | null;
  readonly hasSeparateMeterElectricity: boolean | null;
  readonly hasSeparateMeterGas: boolean | null;
  readonly hasSeparateMeterWater: boolean | null;
}

export interface EnergyInput {
  heatingType?: string | null;
  hasHeatPump?: boolean | null;
  hasSolarPanels?: boolean | null;
  hasThermalSolar?: boolean | null;
  hasSharedBoiler?: boolean | null;
  hasDoubleGlazing?: boolean | null;
  hasTripleGlazing?: boolean | null;
  hasSeparateMeterElectricity?: boolean | null;
  hasSeparateMeterGas?: boolean | null;
  hasSeparateMeterWater?: boolean | null;
}

export function energyProfile(input: EnergyInput): EnergyProfile {
  const heating = input.heatingType ?? null;
  if (heating !== null && !HEATING_TYPES.includes(heating as HeatingType)) {
    throw new Error(`Invalid heatingType: ${heating}`);
  }
  return {
    heatingType: heating as HeatingType | null,
    hasHeatPump: input.hasHeatPump ?? null,
    hasSolarPanels: input.hasSolarPanels ?? null,
    hasThermalSolar: input.hasThermalSolar ?? null,
    hasSharedBoiler: input.hasSharedBoiler ?? null,
    hasDoubleGlazing: input.hasDoubleGlazing ?? null,
    hasTripleGlazing: input.hasTripleGlazing ?? null,
    hasSeparateMeterElectricity: input.hasSeparateMeterElectricity ?? null,
    hasSeparateMeterGas: input.hasSeparateMeterGas ?? null,
    hasSeparateMeterWater: input.hasSeparateMeterWater ?? null,
  };
}

export const EMPTY_ENERGY_PROFILE: EnergyProfile = {
  heatingType: null,
  hasHeatPump: null,
  hasSolarPanels: null,
  hasThermalSolar: null,
  hasSharedBoiler: null,
  hasDoubleGlazing: null,
  hasTripleGlazing: null,
  hasSeparateMeterElectricity: null,
  hasSeparateMeterGas: null,
  hasSeparateMeterWater: null,
};
