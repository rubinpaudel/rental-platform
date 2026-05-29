// keep in sync with listings_epc_label_chk
export const EPC_LABELS = ['A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;
export type EpcLabel = (typeof EPC_LABELS)[number];

// keep in sync with listings_flood_risk_chk
export const FLOOD_RISK_LEVELS = ['none', 'low', 'medium', 'high', 'effective'] as const;
export type FloodRiskLevel = (typeof FLOOD_RISK_LEVELS)[number];

/**
 * Universal regulatory primitives — these live on the `listings` wide table.
 * Their *concept* is shared across all countries; the *interpretation* of a
 * value (e.g. what `primaryEnergyKwhM2 = 79` means for the EPC label) is
 * resolved by the country interpreter registry.
 */
export interface RegulatoryPrimitives {
  readonly epcLabel: EpcLabel | null;
  readonly primaryEnergyKwhM2: number | null;
  readonly co2EmissionKg: number | null;
  readonly isHeritageProtected: boolean | null;
  readonly floodRiskLevel: FloodRiskLevel | null;
  readonly electricityInspectionValid: boolean | null;
}

export interface RegulatoryInput {
  epcLabel?: string | null;
  primaryEnergyKwhM2?: number | null;
  co2EmissionKg?: number | null;
  isHeritageProtected?: boolean | null;
  floodRiskLevel?: string | null;
  electricityInspectionValid?: boolean | null;
}

export interface ComplianceInput {
  epcUniqueCode?: string | null;
  yearlyTheoreticalEnergyKwh?: number | null;
  mandatoryRenovationWorks?: boolean | null;
  asbestosCertificateAvailable?: boolean | null;
  asBuiltAttest?: boolean | null;
  fuelTankConformityCertificate?: boolean | null;
  hasBuildingPermit?: boolean | null;
  hasParcelPermit?: boolean | null;
  hasPreemptiveRight?: boolean | null;
  tenantPreemptiveRight?: boolean | null;
  hasUrbanismViolationSummons?: boolean | null;
  mostRecentUrbanismDesignation?: string | null;
  syndicusName?: string | null;
  coOwnershipShare?: number | null;
  isRealEstateInvestment?: boolean | null;
  /** Country-specific extras; shape varies per `country` of the listing's address. */
  countryExtras?: Record<string, unknown>;
}

export function regulatoryPrimitives(input: RegulatoryInput): RegulatoryPrimitives {
  const epc = input.epcLabel ?? null;
  if (epc !== null && !EPC_LABELS.includes(epc as EpcLabel)) {
    throw new Error(`Invalid epcLabel: ${epc}`);
  }
  const flood = input.floodRiskLevel ?? null;
  if (flood !== null && !FLOOD_RISK_LEVELS.includes(flood as FloodRiskLevel)) {
    throw new Error(`Invalid floodRiskLevel: ${flood}`);
  }
  if (
    input.primaryEnergyKwhM2 !== null &&
    input.primaryEnergyKwhM2 !== undefined &&
    (!Number.isInteger(input.primaryEnergyKwhM2) || input.primaryEnergyKwhM2 < 0)
  ) {
    throw new Error('primaryEnergyKwhM2 must be a non-negative integer');
  }
  if (
    input.co2EmissionKg !== null &&
    input.co2EmissionKg !== undefined &&
    (!Number.isInteger(input.co2EmissionKg) || input.co2EmissionKg < 0)
  ) {
    throw new Error('co2EmissionKg must be a non-negative integer');
  }
  return {
    epcLabel: epc as EpcLabel | null,
    primaryEnergyKwhM2: input.primaryEnergyKwhM2 ?? null,
    co2EmissionKg: input.co2EmissionKg ?? null,
    isHeritageProtected: input.isHeritageProtected ?? null,
    floodRiskLevel: flood as FloodRiskLevel | null,
    electricityInspectionValid: input.electricityInspectionValid ?? null,
  };
}

export const EMPTY_REGULATORY_PRIMITIVES: RegulatoryPrimitives = {
  epcLabel: null,
  primaryEnergyKwhM2: null,
  co2EmissionKg: null,
  isHeritageProtected: null,
  floodRiskLevel: null,
  electricityInspectionValid: null,
};

/** Country-specific quirks stored in `listing_compliance.country_extras` JSONB. */
export type CountryExtras =
  | { country: 'BE'; vlaamseMaatregelenregisterConsulted: boolean | null };
// Future: | { country: 'NL'; ... }
// Future: | { country: 'FR'; ... }

/**
 * Rich regulatory detail (1:1 with a listing) — universal columns common
 * to every EU jurisdiction plus a country-discriminated `countryExtras`.
 */
export interface Compliance {
  readonly epcUniqueCode: string | null;
  readonly yearlyTheoreticalEnergyKwh: number | null;
  readonly mandatoryRenovationWorks: boolean | null;
  readonly asbestosCertificateAvailable: boolean | null;
  readonly asBuiltAttest: boolean | null;
  readonly fuelTankConformityCertificate: boolean | null;
  readonly hasBuildingPermit: boolean | null;
  readonly hasParcelPermit: boolean | null;
  readonly hasPreemptiveRight: boolean | null;
  readonly tenantPreemptiveRight: boolean | null;
  readonly hasUrbanismViolationSummons: boolean | null;
  readonly mostRecentUrbanismDesignation: string | null;
  readonly syndicusName: string | null;
  readonly coOwnershipShare: number | null;
  readonly isRealEstateInvestment: boolean | null;
  readonly countryExtras: CountryExtras;
}

export const EMPTY_COMPLIANCE: Compliance = {
  epcUniqueCode: null,
  yearlyTheoreticalEnergyKwh: null,
  mandatoryRenovationWorks: null,
  asbestosCertificateAvailable: null,
  asBuiltAttest: null,
  fuelTankConformityCertificate: null,
  hasBuildingPermit: null,
  hasParcelPermit: null,
  hasPreemptiveRight: null,
  tenantPreemptiveRight: null,
  hasUrbanismViolationSummons: null,
  mostRecentUrbanismDesignation: null,
  syndicusName: null,
  coOwnershipShare: null,
  isRealEstateInvestment: null,
  countryExtras: { country: 'BE', vlaamseMaatregelenregisterConsulted: null },
};
