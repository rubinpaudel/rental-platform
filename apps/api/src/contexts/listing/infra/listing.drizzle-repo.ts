import { eq, and, lt, or, desc, asc } from 'drizzle-orm';
import type { Database } from '@rental-platform/db';
import { listings, listingPhotos, listingRooms, listingCompliance } from './schema';
import { Listing } from '../domain/listing.aggregate';
import { listingId } from '../domain/listing-id.vo';
import { address } from '../domain/address.vo';
import { pricing } from '../domain/pricing.vo';
import { surfaceBreakdown } from '../domain/surface.vo';
import { classification } from '../domain/classification.vo';
import { availability } from '../domain/availability.vo';
import { buildingProfile } from '../domain/building.vo';
import { roomCounts } from '../domain/room-counts.vo';
import { exterior } from '../domain/exterior.vo';
import { energyProfile } from '../domain/energy.vo';
import { interiorAmenities } from '../domain/interior-amenities.vo';
import { petPolicy } from '../domain/pet-policy.vo';
import { regulatoryPrimitives, EMPTY_COMPLIANCE, type Compliance, type CountryExtras } from '../domain/compliance.vo';
import { getCountryInterpreter } from '../domain/country';
import { roomDetail } from '../domain/room-detail.vo';
import { photo } from '../domain/photo.vo';
import { listingStatus, type ListingStatus } from '../domain/listing-status.vo';
import type { ListingId } from '../domain/listing-id.vo';
import type { OrganizationId } from '../../identity/domain/organization-id.vo';
import type { UserId } from '../../identity/domain/user-id.vo';
import type { ListingRepo, PaginatedResult } from '../domain/listing.repo';

export class ListingDrizzleRepo implements ListingRepo {
  constructor(private readonly db: Database) {}

  async save(listing: Listing): Promise<void> {
    const row = toRow(listing);
    await this.db.transaction(async (tx) => {
      await tx
        .insert(listings)
        .values(row)
        .onConflictDoUpdate({
          target: listings.id,
          set: toUpdateSet(listing),
        });

      await tx.delete(listingPhotos).where(eq(listingPhotos.listingId, listing.id));
      if (listing.photos.length > 0) {
        await tx.insert(listingPhotos).values(
          listing.photos.map((p) => ({
            listingId: listing.id as string,
            storageKey: p.storageKey,
            ord: p.order,
            alt: p.alt,
          })),
        );
      }

      await tx.delete(listingRooms).where(eq(listingRooms.listingId, listing.id));
      if (listing.rooms.length > 0) {
        await tx.insert(listingRooms).values(
          listing.rooms.map((r) => ({
            id: r.id,
            listingId: listing.id as string,
            roomType: r.roomType,
            label: r.label,
            surfaceM2: r.surfaceM2,
            ord: r.order,
          })),
        );
      }

      const complianceRow = toComplianceRow(listing.id, listing.address.country, listing.compliance);
      await tx
        .insert(listingCompliance)
        .values(complianceRow)
        .onConflictDoUpdate({
          target: listingCompliance.listingId,
          set: complianceRowUpdateSet(complianceRow),
        });
    });
  }

  async findById(id: ListingId): Promise<Listing | null> {
    const rows = await this.db.select().from(listings).where(eq(listings.id, id)).limit(1);
    if (rows.length === 0) return null;
    return this.hydrate(rows[0]!);
  }

  async findByIdAndOrg(id: ListingId, orgId: OrganizationId): Promise<Listing | null> {
    const rows = await this.db
      .select()
      .from(listings)
      .where(and(eq(listings.id, id), eq(listings.orgId, orgId)))
      .limit(1);

    if (rows.length === 0) return null;
    return this.hydrate(rows[0]!);
  }

  async findActiveById(id: ListingId): Promise<Listing | null> {
    const rows = await this.db
      .select()
      .from(listings)
      .where(and(eq(listings.id, id), eq(listings.status, 'active')))
      .limit(1);

    if (rows.length === 0) return null;
    return this.hydrate(rows[0]!);
  }

  async listByOrg(
    orgId: OrganizationId,
    opts: { status?: ListingStatus; cursor?: string; limit: number },
  ): Promise<PaginatedResult<Listing>> {
    const conditions = [eq(listings.orgId, orgId)];
    if (opts.status) conditions.push(eq(listings.status, opts.status));
    if (opts.cursor) {
      const { createdAt, id } = decodeCursor(opts.cursor);
      conditions.push(
        or(
          lt(listings.createdAt, createdAt),
          and(eq(listings.createdAt, createdAt), lt(listings.id, id)),
        )!,
      );
    }

    const fetchLimit = opts.limit + 1;
    const rows = await this.db
      .select()
      .from(listings)
      .where(and(...conditions))
      .orderBy(desc(listings.createdAt), desc(listings.id))
      .limit(fetchLimit);

    const hasMore = rows.length > opts.limit;
    const resultRows = hasMore ? rows.slice(0, opts.limit) : rows;
    const items = await Promise.all(resultRows.map((r) => this.hydrate(r)));

    let nextCursor: string | null = null;
    if (hasMore) {
      const last = resultRows[resultRows.length - 1]!;
      nextCursor = encodeCursor(last.createdAt, last.id);
    }

    return { items, nextCursor };
  }

  async listPublicFeed(opts: {
    cursor?: string;
    limit: number;
  }): Promise<PaginatedResult<Listing>> {
    const conditions = [eq(listings.status, 'active')];
    if (opts.cursor) {
      const { createdAt, id } = decodeCursor(opts.cursor);
      conditions.push(
        or(
          lt(listings.createdAt, createdAt),
          and(eq(listings.createdAt, createdAt), lt(listings.id, id)),
        )!,
      );
    }

    const fetchLimit = opts.limit + 1;
    const rows = await this.db
      .select()
      .from(listings)
      .where(and(...conditions))
      .orderBy(desc(listings.createdAt), desc(listings.id))
      .limit(fetchLimit);

    const hasMore = rows.length > opts.limit;
    const resultRows = hasMore ? rows.slice(0, opts.limit) : rows;
    const items = await Promise.all(resultRows.map((r) => this.hydrate(r)));

    let nextCursor: string | null = null;
    if (hasMore) {
      const last = resultRows[resultRows.length - 1]!;
      nextCursor = encodeCursor(last.createdAt, last.id);
    }

    return { items, nextCursor };
  }

  private async hydrate(row: typeof listings.$inferSelect): Promise<Listing> {
    const [photos, rooms, complianceRows] = await Promise.all([
      this.db
        .select()
        .from(listingPhotos)
        .where(eq(listingPhotos.listingId, row.id))
        .orderBy(asc(listingPhotos.ord)),
      this.db
        .select()
        .from(listingRooms)
        .where(eq(listingRooms.listingId, row.id))
        .orderBy(asc(listingRooms.roomType), asc(listingRooms.ord)),
      this.db
        .select()
        .from(listingCompliance)
        .where(eq(listingCompliance.listingId, row.id))
        .limit(1),
    ]);

    const compliance = complianceRows[0]
      ? hydrateCompliance(complianceRows[0], row.country)
      : { ...EMPTY_COMPLIANCE, countryExtras: defaultCountryExtras(row.country) };

    return new Listing({
      id: listingId(row.id),
      orgId: row.orgId as OrganizationId,
      createdBy: row.createdBy as UserId,
      description: row.description,
      address: address({
        street: row.street,
        number: row.number,
        box: row.box,
        postalCode: row.postalCode,
        municipality: row.municipality,
        country: row.country,
      }),
      classification: classification({
        listingType: row.listingType,
        propertyType: row.propertyType,
        leaseType: row.leaseType,
        minLeaseMonths: row.minLeaseMonths,
      }),
      availability: availability({
        availableFrom: row.availableFrom,
        availableImmediately: row.availableImmediately,
        viewingMode: row.viewingMode,
      }),
      pricing: pricing({
        priceCents: row.priceCents,
        chargesCents: row.chargesCents,
        syndicCents: row.syndicCents,
        depositCents: row.depositCents,
        agencyFeeCents: row.agencyFeeCents,
        includesUtilities: row.includesUtilities,
        currency: row.currency,
      }),
      surface: surfaceBreakdown({
        totalM2: row.surfaceM2,
        livingRoomM2: row.livingRoomM2,
        kitchenM2: row.kitchenM2,
        terraceM2: row.terraceM2,
        gardenM2: row.gardenM2,
        totalLandM2: row.totalLandM2,
        basementM2: row.basementM2,
      }),
      building: buildingProfile({
        yearBuilt: row.yearBuilt,
        floor: row.floor,
        totalFloors: row.totalFloors,
        condition: row.buildingCondition,
        facadeCount: row.facadeCount,
      }),
      roomCounts: roomCounts({
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
        showerRooms: row.showerRooms,
        toilets: row.toilets,
        hasOffice: row.hasOffice,
        hasDressing: row.hasDressing,
        hasLaundry: row.hasLaundry,
      }),
      exterior: exterior({
        hasTerrace: row.hasTerrace,
        hasGarden: row.hasGarden,
        hasGarage: row.hasGarage,
        parkingSpots: row.parkingSpots,
        orientation: row.orientation,
      }),
      energy: energyProfile({
        heatingType: row.heatingType,
        hasHeatPump: row.hasHeatPump,
        hasSolarPanels: row.hasSolarPanels,
        hasThermalSolar: row.hasThermalSolar,
        hasSharedBoiler: row.hasSharedBoiler,
        hasDoubleGlazing: row.hasDoubleGlazing,
        hasTripleGlazing: row.hasTripleGlazing,
        hasSeparateMeterElectricity: row.hasSeparateMeterElectricity,
        hasSeparateMeterGas: row.hasSeparateMeterGas,
        hasSeparateMeterWater: row.hasSeparateMeterWater,
      }),
      interior: interiorAmenities({
        kitchenType: row.kitchenType,
        hasElevator: row.hasElevator,
        hasIntercom: row.hasIntercom,
        hasAlarm: row.hasAlarm,
        hasArmoredDoor: row.hasArmoredDoor,
        hasAirConditioning: row.hasAirConditioning,
        hasInternetAvailable: row.hasInternetAvailable,
        hasCableTv: row.hasCableTv,
        hasVideoPhone: row.hasVideoPhone,
        isAccessibleReducedMobility: row.isAccessibleReducedMobility,
        isFurnished: row.isFurnished,
        videoTourUrl: row.videoTourUrl,
      }),
      petPolicy: petPolicy({
        allowsLargePets: row.allowsLargePets,
        allowsSmallPets: row.allowsSmallPets,
        smokingAllowed: row.smokingAllowed,
      }),
      regulatory: regulatoryPrimitives({
        epcLabel: row.epcLabel,
        primaryEnergyKwhM2: row.primaryEnergyKwhM2,
        co2EmissionKg: row.co2EmissionKg,
        isHeritageProtected: row.isHeritageProtected,
        floodRiskLevel: row.floodRiskLevel,
        electricityInspectionValid: row.electricityInspectionValid,
      }),
      compliance,
      status: listingStatus(row.status),
      photos: photos.map((p) => photo({ storageKey: p.storageKey, order: p.ord, alt: p.alt })),
      rooms: rooms.map((r) =>
        roomDetail({
          id: r.id,
          roomType: r.roomType,
          label: r.label,
          surfaceM2: r.surfaceM2,
          order: r.ord,
        }),
      ),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}

function toRow(listing: Listing): typeof listings.$inferInsert {
  return {
    id: listing.id,
    orgId: listing.orgId,
    createdBy: listing.createdBy,
    description: listing.description,
    street: listing.address.street,
    number: listing.address.number,
    box: listing.address.box,
    postalCode: listing.address.postalCode,
    municipality: listing.address.municipality,
    region: listing.address.region,
    country: listing.address.country,
    listingType: listing.classification.listingType,
    propertyType: listing.classification.propertyType,
    leaseType: listing.classification.leaseType,
    minLeaseMonths: listing.classification.minLeaseMonths,
    availableFrom: listing.availability.availableFrom,
    availableImmediately: listing.availability.availableImmediately,
    viewingMode: listing.availability.viewingMode,
    priceCents: listing.pricing.priceCents,
    chargesCents: listing.pricing.chargesCents,
    syndicCents: listing.pricing.syndicCents,
    depositCents: listing.pricing.depositCents,
    agencyFeeCents: listing.pricing.agencyFeeCents,
    includesUtilities: listing.pricing.includesUtilities,
    currency: listing.pricing.currency,
    yearBuilt: listing.building.yearBuilt,
    floor: listing.building.floor,
    totalFloors: listing.building.totalFloors,
    buildingCondition: listing.building.condition,
    facadeCount: listing.building.facadeCount,
    surfaceM2: listing.surface.totalM2,
    livingRoomM2: listing.surface.livingRoomM2,
    kitchenM2: listing.surface.kitchenM2,
    terraceM2: listing.surface.terraceM2,
    gardenM2: listing.surface.gardenM2,
    totalLandM2: listing.surface.totalLandM2,
    basementM2: listing.surface.basementM2,
    bedrooms: listing.roomCounts.bedrooms,
    bathrooms: listing.roomCounts.bathrooms,
    showerRooms: listing.roomCounts.showerRooms,
    toilets: listing.roomCounts.toilets,
    hasOffice: listing.roomCounts.hasOffice,
    hasDressing: listing.roomCounts.hasDressing,
    hasLaundry: listing.roomCounts.hasLaundry,
    hasTerrace: listing.exterior.hasTerrace,
    hasGarden: listing.exterior.hasGarden,
    hasGarage: listing.exterior.hasGarage,
    parkingSpots: listing.exterior.parkingSpots,
    orientation: listing.exterior.orientation,
    kitchenType: listing.interior.kitchenType,
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
    allowsLargePets: listing.petPolicy.allowsLargePets,
    allowsSmallPets: listing.petPolicy.allowsSmallPets,
    smokingAllowed: listing.petPolicy.smokingAllowed,
    epcLabel: listing.regulatory.epcLabel,
    primaryEnergyKwhM2: listing.regulatory.primaryEnergyKwhM2,
    co2EmissionKg: listing.regulatory.co2EmissionKg,
    isHeritageProtected: listing.regulatory.isHeritageProtected,
    floodRiskLevel: listing.regulatory.floodRiskLevel,
    electricityInspectionValid: listing.regulatory.electricityInspectionValid,
    status: listing.status,
    createdAt: listing.createdAt,
    updatedAt: listing.updatedAt,
  };
}

function toUpdateSet(listing: Listing) {
  const row = toRow(listing);
  const set: Partial<typeof listings.$inferInsert> = { ...row };
  delete set.id;
  delete set.orgId;
  delete set.createdBy;
  delete set.createdAt;
  return set;
}

function toComplianceRow(
  listingId: string,
  country: string,
  compliance: Compliance,
): typeof listingCompliance.$inferInsert {
  const interpreter = getCountryInterpreter(country);
  return {
    listingId,
    epcUniqueCode: compliance.epcUniqueCode,
    yearlyTheoreticalEnergyKwh: compliance.yearlyTheoreticalEnergyKwh,
    mandatoryRenovationWorks: compliance.mandatoryRenovationWorks,
    asbestosCertificateAvailable: compliance.asbestosCertificateAvailable,
    asBuiltAttest: compliance.asBuiltAttest,
    fuelTankConformityCertificate: compliance.fuelTankConformityCertificate,
    hasBuildingPermit: compliance.hasBuildingPermit,
    hasParcelPermit: compliance.hasParcelPermit,
    hasPreemptiveRight: compliance.hasPreemptiveRight,
    tenantPreemptiveRight: compliance.tenantPreemptiveRight,
    hasUrbanismViolationSummons: compliance.hasUrbanismViolationSummons,
    mostRecentUrbanismDesignation: compliance.mostRecentUrbanismDesignation,
    syndicusName: compliance.syndicusName,
    coOwnershipShare:
      compliance.coOwnershipShare === null ? null : String(compliance.coOwnershipShare),
    isRealEstateInvestment: compliance.isRealEstateInvestment,
    countryExtras: interpreter.serializeExtras(compliance.countryExtras),
  };
}

function complianceRowUpdateSet(row: typeof listingCompliance.$inferInsert) {
  const set: Partial<typeof listingCompliance.$inferInsert> = { ...row };
  delete set.listingId;
  return set;
}

function hydrateCompliance(
  row: typeof listingCompliance.$inferSelect,
  country: string,
): Compliance {
  const interpreter = getCountryInterpreter(country);
  return {
    epcUniqueCode: row.epcUniqueCode,
    yearlyTheoreticalEnergyKwh: row.yearlyTheoreticalEnergyKwh,
    mandatoryRenovationWorks: row.mandatoryRenovationWorks,
    asbestosCertificateAvailable: row.asbestosCertificateAvailable,
    asBuiltAttest: row.asBuiltAttest,
    fuelTankConformityCertificate: row.fuelTankConformityCertificate,
    hasBuildingPermit: row.hasBuildingPermit,
    hasParcelPermit: row.hasParcelPermit,
    hasPreemptiveRight: row.hasPreemptiveRight,
    tenantPreemptiveRight: row.tenantPreemptiveRight,
    hasUrbanismViolationSummons: row.hasUrbanismViolationSummons,
    mostRecentUrbanismDesignation: row.mostRecentUrbanismDesignation,
    syndicusName: row.syndicusName,
    coOwnershipShare: row.coOwnershipShare === null ? null : Number(row.coOwnershipShare),
    isRealEstateInvestment: row.isRealEstateInvestment,
    countryExtras: interpreter.parseExtras(row.countryExtras),
  };
}

function defaultCountryExtras(country: string): CountryExtras {
  const interpreter = getCountryInterpreter(country);
  return interpreter.parseExtras({});
}

function encodeCursor(createdAt: Date, id: string): string {
  return Buffer.from(JSON.stringify({ t: createdAt.toISOString(), i: id })).toString('base64url');
}

function decodeCursor(cursor: string): { createdAt: Date; id: string } {
  const parsed = JSON.parse(Buffer.from(cursor, 'base64url').toString()) as {
    t: string;
    i: string;
  };
  return { createdAt: new Date(parsed.t), id: parsed.i };
}
