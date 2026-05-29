-- Universal regulatory primitives on listings (concept exists in every EU country)
ALTER TABLE "listings" ADD COLUMN "epc_label" text;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "primary_energy_kwh_m2" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "co2_emission_kg" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "is_heritage_protected" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "flood_risk_level" text;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "electricity_inspection_valid" boolean;--> statement-breakpoint

ALTER TABLE "listings" ADD CONSTRAINT "listings_epc_label_chk" CHECK ("listings"."epc_label" IS NULL OR "listings"."epc_label" IN ('A++','A+','A','B','C','D','E','F','G'));--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_primary_energy_chk" CHECK ("listings"."primary_energy_kwh_m2" IS NULL OR "listings"."primary_energy_kwh_m2" >= 0);--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_co2_emission_chk" CHECK ("listings"."co2_emission_kg" IS NULL OR "listings"."co2_emission_kg" >= 0);--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_flood_risk_chk" CHECK ("listings"."flood_risk_level" IS NULL OR "listings"."flood_risk_level" IN ('none','low','medium','high','effective'));--> statement-breakpoint

-- listing_compliance: 1:1 with listings, universal columns + country_extras jsonb escape hatch
CREATE TABLE "listing_compliance" (
	"listing_id" text PRIMARY KEY NOT NULL,
	"epc_unique_code" text,
	"yearly_theoretical_energy_kwh" integer,
	"mandatory_renovation_works" boolean,
	"asbestos_certificate_available" boolean,
	"as_built_attest" boolean,
	"fuel_tank_conformity_certificate" boolean,
	"has_building_permit" boolean,
	"has_parcel_permit" boolean,
	"has_preemptive_right" boolean,
	"tenant_preemptive_right" boolean,
	"has_urbanism_violation_summons" boolean,
	"most_recent_urbanism_designation" text,
	"syndicus_name" text,
	"co_ownership_share" numeric(10, 4),
	"is_real_estate_investment" boolean,
	"country_extras" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "listing_compliance_co_ownership_share_chk" CHECK ("listing_compliance"."co_ownership_share" IS NULL OR "listing_compliance"."co_ownership_share" >= 0),
	CONSTRAINT "listing_compliance_yearly_energy_chk" CHECK ("listing_compliance"."yearly_theoretical_energy_kwh" IS NULL OR "listing_compliance"."yearly_theoretical_energy_kwh" >= 0)
);
