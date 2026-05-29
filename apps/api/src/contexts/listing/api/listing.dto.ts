import type { Listing } from '../domain/listing.aggregate';
import type { PaginatedResult } from '../domain/listing.repo';
import { getCountryInterpreter, hasCountryInterpreter } from '../domain/country';

function displayLabel(listing: Listing): string {
  return `${listing.classification.propertyType} in ${listing.address.municipality}, ${listing.address.postalCode}`;
}

function addressDto(listing: Listing) {
  return {
    street: listing.address.street,
    number: listing.address.number,
    box: listing.address.box,
    postalCode: listing.address.postalCode,
    municipality: listing.address.municipality,
    region: listing.address.region,
    country: listing.address.country,
  };
}

function pricingDto(listing: Listing) {
  return {
    priceCents: listing.pricing.priceCents,
    chargesCents: listing.pricing.chargesCents,
    syndicCents: listing.pricing.syndicCents,
    depositCents: listing.pricing.depositCents,
    agencyFeeCents: listing.pricing.agencyFeeCents,
    includesUtilities: listing.pricing.includesUtilities,
    currency: listing.pricing.currency,
  };
}

function classificationDto(listing: Listing) {
  return {
    listingType: listing.classification.listingType,
    propertyType: listing.classification.propertyType,
    leaseType: listing.classification.leaseType,
    minLeaseMonths: listing.classification.minLeaseMonths,
  };
}

function availabilityDto(listing: Listing) {
  return {
    availableFrom: listing.availability.availableFrom,
    availableImmediately: listing.availability.availableImmediately,
    viewingMode: listing.availability.viewingMode,
  };
}

function surfaceDto(listing: Listing) {
  return {
    totalM2: listing.surface.totalM2,
    livingRoomM2: listing.surface.livingRoomM2,
    kitchenM2: listing.surface.kitchenM2,
    terraceM2: listing.surface.terraceM2,
    gardenM2: listing.surface.gardenM2,
    totalLandM2: listing.surface.totalLandM2,
    basementM2: listing.surface.basementM2,
  };
}

function buildingDto(listing: Listing) {
  return {
    yearBuilt: listing.building.yearBuilt,
    floor: listing.building.floor,
    totalFloors: listing.building.totalFloors,
    condition: listing.building.condition,
    facadeCount: listing.building.facadeCount,
  };
}

function roomCountsDto(listing: Listing) {
  return {
    bedrooms: listing.roomCounts.bedrooms,
    bathrooms: listing.roomCounts.bathrooms,
    showerRooms: listing.roomCounts.showerRooms,
    toilets: listing.roomCounts.toilets,
    hasOffice: listing.roomCounts.hasOffice,
    hasDressing: listing.roomCounts.hasDressing,
    hasLaundry: listing.roomCounts.hasLaundry,
  };
}

function exteriorDto(listing: Listing) {
  return {
    hasTerrace: listing.exterior.hasTerrace,
    hasGarden: listing.exterior.hasGarden,
    hasGarage: listing.exterior.hasGarage,
    parkingSpots: listing.exterior.parkingSpots,
    orientation: listing.exterior.orientation,
  };
}

function photosDto(listing: Listing) {
  return listing.photos.map((p) => ({
    storageKey: p.storageKey,
    order: p.order,
    alt: p.alt,
  }));
}

function energyDto(listing: Listing) {
  return {
    heatingType: listing.energy.heatingType,
    hasHeatPump: listing.energy.hasHeatPump,
    hasSolarPanels: listing.energy.hasSolarPanels,
    hasThermalSolar: listing.energy.hasThermalSolar,
    hasSharedBoiler: listing.energy.hasSharedBoiler,
    hasDoubleGlazing: listing.energy.hasDoubleGlazing,
    hasTripleGlazing: listing.energy.hasTripleGlazing,
    hasSeparateMeterElectricity: listing.energy.hasSeparateMeterElectricity,
    hasSeparateMeterGas: listing.energy.hasSeparateMeterGas,
    hasSeparateMeterWater: listing.energy.hasSeparateMeterWater,
  };
}

function interiorDto(listing: Listing) {
  return {
    kitchenType: listing.interior.kitchenType,
    hasElevator: listing.interior.hasElevator,
    hasIntercom: listing.interior.hasIntercom,
    hasAlarm: listing.interior.hasAlarm,
    hasArmoredDoor: listing.interior.hasArmoredDoor,
    hasAirConditioning: listing.interior.hasAirConditioning,
    hasInternetAvailable: listing.interior.hasInternetAvailable,
    hasCableTv: listing.interior.hasCableTv,
    hasVideoPhone: listing.interior.hasVideoPhone,
    isAccessibleReducedMobility: listing.interior.isAccessibleReducedMobility,
    isFurnished: listing.interior.isFurnished,
    videoTourUrl: listing.interior.videoTourUrl,
  };
}

function petPolicyDto(listing: Listing) {
  return {
    allowsLargePets: listing.petPolicy.allowsLargePets,
    allowsSmallPets: listing.petPolicy.allowsSmallPets,
    smokingAllowed: listing.petPolicy.smokingAllowed,
  };
}

function regulatoryDto(listing: Listing) {
  return {
    epcLabel: listing.regulatory.epcLabel,
    primaryEnergyKwhM2: listing.regulatory.primaryEnergyKwhM2,
    co2EmissionKg: listing.regulatory.co2EmissionKg,
    isHeritageProtected: listing.regulatory.isHeritageProtected,
    floodRiskLevel: listing.regulatory.floodRiskLevel,
    electricityInspectionValid: listing.regulatory.electricityInspectionValid,
  };
}

function complianceDto(listing: Listing) {
  return {
    epcUniqueCode: listing.compliance.epcUniqueCode,
    yearlyTheoreticalEnergyKwh: listing.compliance.yearlyTheoreticalEnergyKwh,
    mandatoryRenovationWorks: listing.compliance.mandatoryRenovationWorks,
    asbestosCertificateAvailable: listing.compliance.asbestosCertificateAvailable,
    asBuiltAttest: listing.compliance.asBuiltAttest,
    fuelTankConformityCertificate: listing.compliance.fuelTankConformityCertificate,
    hasBuildingPermit: listing.compliance.hasBuildingPermit,
    hasParcelPermit: listing.compliance.hasParcelPermit,
    hasPreemptiveRight: listing.compliance.hasPreemptiveRight,
    tenantPreemptiveRight: listing.compliance.tenantPreemptiveRight,
    hasUrbanismViolationSummons: listing.compliance.hasUrbanismViolationSummons,
    mostRecentUrbanismDesignation: listing.compliance.mostRecentUrbanismDesignation,
    syndicusName: listing.compliance.syndicusName,
    coOwnershipShare: listing.compliance.coOwnershipShare,
    isRealEstateInvestment: listing.compliance.isRealEstateInvestment,
    countryExtras: listing.compliance.countryExtras,
  };
}

/** Derived per-country labels (e.g. EPC label inferred from kWh/m²). */
function displayLabelsDto(listing: Listing) {
  if (!hasCountryInterpreter(listing.address.country)) return null;
  const interpreter = getCountryInterpreter(listing.address.country);
  return {
    inferredEpcLabel: interpreter.inferEpcLabel(listing.regulatory.primaryEnergyKwhM2),
  };
}

function roomsDto(listing: Listing) {
  return listing.rooms
    .slice()
    .sort((a, b) => {
      if (a.roomType !== b.roomType) return a.roomType.localeCompare(b.roomType);
      return a.order - b.order;
    })
    .map((r) => ({
      id: r.id,
      roomType: r.roomType,
      label: r.label,
      surfaceM2: r.surfaceM2,
      order: r.order,
    }));
}

/** Lightweight shape for feed/list views: enough to render a listing card. */
export function toListingSummaryDto(listing: Listing) {
  return {
    id: listing.id,
    orgId: listing.orgId,
    displayLabel: displayLabel(listing),
    description: listing.description,
    address: addressDto(listing),
    classification: classificationDto(listing),
    pricing: pricingDto(listing),
    surface: { totalM2: listing.surface.totalM2 },
    bedrooms: listing.roomCounts.bedrooms,
    bathrooms: listing.roomCounts.bathrooms,
    status: listing.status,
    coverPhoto: listing.photos[0]
      ? { storageKey: listing.photos[0].storageKey, alt: listing.photos[0].alt }
      : null,
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
  };
}

/** Full shape for detail/edit views. */
export function toListingDetailDto(listing: Listing) {
  return {
    id: listing.id,
    orgId: listing.orgId,
    createdBy: listing.createdBy,
    displayLabel: displayLabel(listing),
    description: listing.description,
    address: addressDto(listing),
    classification: classificationDto(listing),
    availability: availabilityDto(listing),
    pricing: pricingDto(listing),
    surface: surfaceDto(listing),
    building: buildingDto(listing),
    roomCounts: roomCountsDto(listing),
    exterior: exteriorDto(listing),
    energy: energyDto(listing),
    interior: interiorDto(listing),
    petPolicy: petPolicyDto(listing),
    regulatory: regulatoryDto(listing),
    compliance: complianceDto(listing),
    displayLabels: displayLabelsDto(listing),
    status: listing.status,
    photos: photosDto(listing),
    rooms: roomsDto(listing),
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
  };
}

/** Public-facing detail (strips org/creator identifiers). */
export function toPublicListingDto(listing: Listing) {
  return {
    id: listing.id,
    displayLabel: displayLabel(listing),
    description: listing.description,
    address: addressDto(listing),
    classification: classificationDto(listing),
    availability: availabilityDto(listing),
    pricing: pricingDto(listing),
    surface: surfaceDto(listing),
    building: buildingDto(listing),
    roomCounts: roomCountsDto(listing),
    exterior: exteriorDto(listing),
    energy: energyDto(listing),
    interior: interiorDto(listing),
    petPolicy: petPolicyDto(listing),
    regulatory: regulatoryDto(listing),
    compliance: complianceDto(listing),
    displayLabels: displayLabelsDto(listing),
    photos: photosDto(listing),
    rooms: roomsDto(listing),
    createdAt: listing.createdAt.toISOString(),
  };
}

export function toPaginatedDto<T>(
  result: PaginatedResult<T>,
  mapper: (item: T) => unknown,
) {
  return {
    items: result.items.map(mapper),
    nextCursor: result.nextCursor,
  };
}
