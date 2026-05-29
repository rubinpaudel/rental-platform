import {
  pgTable,
  text,
  integer,
  boolean,
  date,
  timestamp,
  jsonb,
  numeric,
  primaryKey,
  index,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

/**
 * Listings carry rich, structured property data. Fields are normalised
 * columns with CHECK constraints — not JSONB — so downstream contexts
 * (Discovery filters, public feed) can sort/filter on them directly.
 * Tri-state booleans (NULL = "not specified") follow the profile precedent.
 */
export const listings = pgTable(
  'listings',
  {
    // Identity
    id: text('id').primaryKey(),
    orgId: text('org_id').notNull(),
    createdBy: text('created_by').notNull(),

    // Marketing
    description: text('description').notNull(),

    // Address
    street: text('street').notNull(),
    number: text('number').notNull(),
    box: text('box'),
    postalCode: text('postal_code').notNull(),
    municipality: text('municipality').notNull(),
    region: text('region').notNull(),
    country: text('country').default('BE').notNull(),

    // Classification
    listingType: text('listing_type').notNull().default('rent'),
    propertyType: text('property_type').notNull(),
    leaseType: text('lease_type'),
    minLeaseMonths: integer('min_lease_months'),

    // Availability
    availableFrom: date('available_from'),
    availableImmediately: boolean('available_immediately'),
    viewingMode: text('viewing_mode'),

    // Pricing (cents)
    priceCents: integer('price_cents').notNull(),
    chargesCents: integer('charges_cents'),
    syndicCents: integer('syndic_cents'),
    depositCents: integer('deposit_cents'),
    agencyFeeCents: integer('agency_fee_cents'),
    includesUtilities: boolean('includes_utilities'),
    currency: text('currency').default('EUR').notNull(),

    // Building
    yearBuilt: integer('year_built'),
    floor: integer('floor'),
    totalFloors: integer('total_floors'),
    buildingCondition: text('building_condition'),
    facadeCount: integer('facade_count'),

    // Surface breakdown (m²)
    surfaceM2: integer('surface_m2').notNull(),
    livingRoomM2: integer('living_room_m2'),
    kitchenM2: integer('kitchen_m2'),
    terraceM2: integer('terrace_m2'),
    gardenM2: integer('garden_m2'),
    totalLandM2: integer('total_land_m2'),
    basementM2: integer('basement_m2'),

    // Room counts
    bedrooms: integer('bedrooms').notNull(),
    bathrooms: integer('bathrooms'),
    showerRooms: integer('shower_rooms'),
    toilets: integer('toilets'),
    hasOffice: boolean('has_office'),
    hasDressing: boolean('has_dressing'),
    hasLaundry: boolean('has_laundry'),

    // Exterior
    hasTerrace: boolean('has_terrace'),
    hasGarden: boolean('has_garden'),
    hasGarage: boolean('has_garage'),
    parkingSpots: integer('parking_spots'),
    orientation: text('orientation'),

    // Kitchen
    kitchenType: text('kitchen_type'),

    // Energy / heating
    heatingType: text('heating_type'),
    hasHeatPump: boolean('has_heat_pump'),
    hasSolarPanels: boolean('has_solar_panels'),
    hasThermalSolar: boolean('has_thermal_solar'),
    hasSharedBoiler: boolean('has_shared_boiler'),
    hasDoubleGlazing: boolean('has_double_glazing'),
    hasTripleGlazing: boolean('has_triple_glazing'),
    hasSeparateMeterElectricity: boolean('has_separate_meter_electricity'),
    hasSeparateMeterGas: boolean('has_separate_meter_gas'),
    hasSeparateMeterWater: boolean('has_separate_meter_water'),

    // Interior amenities
    hasElevator: boolean('has_elevator'),
    hasIntercom: boolean('has_intercom'),
    hasAlarm: boolean('has_alarm'),
    hasArmoredDoor: boolean('has_armored_door'),
    hasAirConditioning: boolean('has_air_conditioning'),
    hasInternetAvailable: boolean('has_internet_available'),
    hasCableTv: boolean('has_cable_tv'),
    hasVideoPhone: boolean('has_video_phone'),
    isAccessibleReducedMobility: boolean('is_accessible_reduced_mobility'),
    isFurnished: boolean('is_furnished'),

    // Pet & smoking policy
    allowsLargePets: boolean('allows_large_pets'),
    allowsSmallPets: boolean('allows_small_pets'),
    smokingAllowed: boolean('smoking_allowed'),

    // Marketing extras
    videoTourUrl: text('video_tour_url'),

    // Universal regulatory primitives (concept exists in every EU country;
    // values interpreted per country via the CountryInterpreter registry)
    epcLabel: text('epc_label'),
    primaryEnergyKwhM2: integer('primary_energy_kwh_m2'),
    co2EmissionKg: integer('co2_emission_kg'),
    isHeritageProtected: boolean('is_heritage_protected'),
    floodRiskLevel: text('flood_risk_level'),
    electricityInspectionValid: boolean('electricity_inspection_valid'),

    // Lifecycle
    status: text('status').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('listings_org_id_idx').on(table.orgId),
    index('listings_status_idx').on(table.status),
    index('listings_created_at_id_idx').on(table.createdAt, table.id),
    check(
      'listings_listing_type_chk',
      sql`${table.listingType} IN ('rent','sale','short_term','student')`,
    ),
    check(
      'listings_property_type_chk',
      sql`${table.propertyType} IN ('apartment','house','studio','loft','commercial','office','garage','land')`,
    ),
    check(
      'listings_lease_type_chk',
      sql`${table.leaseType} IS NULL OR ${table.leaseType} IN ('long_term_residential','short_term','student','commercial')`,
    ),
    check(
      'listings_min_lease_months_chk',
      sql`${table.minLeaseMonths} IS NULL OR (${table.minLeaseMonths} >= 1 AND ${table.minLeaseMonths} <= 360)`,
    ),
    check(
      'listings_viewing_mode_chk',
      sql`${table.viewingMode} IS NULL OR ${table.viewingMode} IN ('self_book','on_request','open_house')`,
    ),
    check('listings_price_cents_chk', sql`${table.priceCents} >= 0`),
    check(
      'listings_charges_cents_chk',
      sql`${table.chargesCents} IS NULL OR ${table.chargesCents} >= 0`,
    ),
    check(
      'listings_syndic_cents_chk',
      sql`${table.syndicCents} IS NULL OR ${table.syndicCents} >= 0`,
    ),
    check(
      'listings_deposit_cents_chk',
      sql`${table.depositCents} IS NULL OR ${table.depositCents} >= 0`,
    ),
    check(
      'listings_agency_fee_cents_chk',
      sql`${table.agencyFeeCents} IS NULL OR ${table.agencyFeeCents} >= 0`,
    ),
    check(
      'listings_year_built_chk',
      sql`${table.yearBuilt} IS NULL OR (${table.yearBuilt} >= 1000 AND ${table.yearBuilt} <= 2100)`,
    ),
    check(
      'listings_floor_chk',
      sql`${table.floor} IS NULL OR (${table.floor} >= -5 AND ${table.floor} <= 200)`,
    ),
    check(
      'listings_total_floors_chk',
      sql`${table.totalFloors} IS NULL OR (${table.totalFloors} >= 1 AND ${table.totalFloors} <= 200)`,
    ),
    check(
      'listings_building_condition_chk',
      sql`${table.buildingCondition} IS NULL OR ${table.buildingCondition} IN ('new','excellent','good','to_refresh','to_renovate')`,
    ),
    check(
      'listings_facade_count_chk',
      sql`${table.facadeCount} IS NULL OR (${table.facadeCount} >= 1 AND ${table.facadeCount} <= 4)`,
    ),
    check('listings_surface_m2_chk', sql`${table.surfaceM2} > 0`),
    check(
      'listings_living_room_m2_chk',
      sql`${table.livingRoomM2} IS NULL OR ${table.livingRoomM2} >= 0`,
    ),
    check(
      'listings_kitchen_m2_chk',
      sql`${table.kitchenM2} IS NULL OR ${table.kitchenM2} >= 0`,
    ),
    check(
      'listings_terrace_m2_chk',
      sql`${table.terraceM2} IS NULL OR ${table.terraceM2} >= 0`,
    ),
    check(
      'listings_garden_m2_chk',
      sql`${table.gardenM2} IS NULL OR ${table.gardenM2} >= 0`,
    ),
    check(
      'listings_total_land_m2_chk',
      sql`${table.totalLandM2} IS NULL OR ${table.totalLandM2} >= 0`,
    ),
    check(
      'listings_basement_m2_chk',
      sql`${table.basementM2} IS NULL OR ${table.basementM2} >= 0`,
    ),
    check('listings_bedrooms_chk', sql`${table.bedrooms} >= 0`),
    check(
      'listings_bathrooms_chk',
      sql`${table.bathrooms} IS NULL OR ${table.bathrooms} >= 0`,
    ),
    check(
      'listings_shower_rooms_chk',
      sql`${table.showerRooms} IS NULL OR ${table.showerRooms} >= 0`,
    ),
    check(
      'listings_toilets_chk',
      sql`${table.toilets} IS NULL OR ${table.toilets} >= 0`,
    ),
    check(
      'listings_parking_spots_chk',
      sql`${table.parkingSpots} IS NULL OR ${table.parkingSpots} >= 0`,
    ),
    check(
      'listings_orientation_chk',
      sql`${table.orientation} IS NULL OR ${table.orientation} IN ('N','NE','E','SE','S','SW','W','NW')`,
    ),
    check(
      'listings_kitchen_type_chk',
      sql`${table.kitchenType} IS NULL OR ${table.kitchenType} IN ('none','kitchenette','equipped','hyper_equipped','us_open','us_closed')`,
    ),
    check(
      'listings_heating_type_chk',
      sql`${table.heatingType} IS NULL OR ${table.heatingType} IN ('gas','electric','oil','wood','heat_pump','district_heating','other')`,
    ),
    check(
      'listings_epc_label_chk',
      sql`${table.epcLabel} IS NULL OR ${table.epcLabel} IN ('A++','A+','A','B','C','D','E','F','G')`,
    ),
    check(
      'listings_primary_energy_chk',
      sql`${table.primaryEnergyKwhM2} IS NULL OR ${table.primaryEnergyKwhM2} >= 0`,
    ),
    check(
      'listings_co2_emission_chk',
      sql`${table.co2EmissionKg} IS NULL OR ${table.co2EmissionKg} >= 0`,
    ),
    check(
      'listings_flood_risk_chk',
      sql`${table.floodRiskLevel} IS NULL OR ${table.floodRiskLevel} IN ('none','low','medium','high','effective')`,
    ),
    check(
      'listings_status_chk',
      sql`${table.status} IN ('draft','active','inactive','closed')`,
    ),
  ],
);

export const listingPhotos = pgTable(
  'listing_photos',
  {
    listingId: text('listing_id').notNull(),
    storageKey: text('storage_key').notNull(),
    ord: integer('ord').notNull(),
    alt: text('alt'),
  },
  (table) => [primaryKey({ columns: [table.listingId, table.storageKey] })],
);

/**
 * Rich regulatory detail per listing. Universal columns hold concepts that
 * exist in every EU country (certificates, urbanism, co-ownership); the
 * `country_extras` JSONB column is the typed escape hatch for the long tail
 * of country-only quirks (e.g. BE's `vlaamseMaatregelenregisterConsulted`).
 * Country-specific *interpretation* lives in `domain/country/<cc>.interpreter.ts`.
 */
export const listingCompliance = pgTable(
  'listing_compliance',
  {
    listingId: text('listing_id').primaryKey(),

    // Energy performance certificate detail (label + kWh primitives live on listings)
    epcUniqueCode: text('epc_unique_code'),
    yearlyTheoreticalEnergyKwh: integer('yearly_theoretical_energy_kwh'),

    // Renovation & certificates
    mandatoryRenovationWorks: boolean('mandatory_renovation_works'),
    asbestosCertificateAvailable: boolean('asbestos_certificate_available'),
    asBuiltAttest: boolean('as_built_attest'),
    fuelTankConformityCertificate: boolean('fuel_tank_conformity_certificate'),

    // Urbanism
    hasBuildingPermit: boolean('has_building_permit'),
    hasParcelPermit: boolean('has_parcel_permit'),
    hasPreemptiveRight: boolean('has_preemptive_right'),
    tenantPreemptiveRight: boolean('tenant_preemptive_right'),
    hasUrbanismViolationSummons: boolean('has_urbanism_violation_summons'),
    mostRecentUrbanismDesignation: text('most_recent_urbanism_designation'),

    // Co-ownership
    syndicusName: text('syndicus_name'),
    coOwnershipShare: numeric('co_ownership_share', { precision: 10, scale: 4 }),

    // Investment classification
    isRealEstateInvestment: boolean('is_real_estate_investment'),

    // Country-discriminated escape hatch (BeExtras | NlExtras | ...)
    countryExtras: jsonb('country_extras').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    check(
      'listing_compliance_co_ownership_share_chk',
      sql`${table.coOwnershipShare} IS NULL OR ${table.coOwnershipShare} >= 0`,
    ),
    check(
      'listing_compliance_yearly_energy_chk',
      sql`${table.yearlyTheoreticalEnergyKwh} IS NULL OR ${table.yearlyTheoreticalEnergyKwh} >= 0`,
    ),
  ],
);

/**
 * Optional per-room area annotations ("Slaapkamer 1: 13m²"). Counters on
 * `listings` are the primary surface for filtering; this table is for
 * landlords who want to publish granular per-room detail.
 */
export const listingRooms = pgTable(
  'listing_rooms',
  {
    id: text('id').primaryKey(),
    listingId: text('listing_id').notNull(),
    roomType: text('room_type').notNull(),
    label: text('label'),
    surfaceM2: integer('surface_m2'),
    ord: integer('ord').notNull(),
  },
  (table) => [
    index('listing_rooms_listing_id_idx').on(table.listingId, table.roomType, table.ord),
    check(
      'listing_rooms_room_type_chk',
      sql`${table.roomType} IN ('bedroom','bathroom','shower_room','living_room','dining_room','kitchen','office','dressing','laundry','cellar','attic','garage','terrace','garden')`,
    ),
    check(
      'listing_rooms_surface_m2_chk',
      sql`${table.surfaceM2} IS NULL OR ${table.surfaceM2} >= 0`,
    ),
    check('listing_rooms_ord_chk', sql`${table.ord} >= 0`),
  ],
);
