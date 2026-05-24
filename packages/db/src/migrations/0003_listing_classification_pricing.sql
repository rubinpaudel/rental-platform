-- Drop legacy `title` column; listing display labels are now derived from
-- propertyType + municipality + postalCode.
ALTER TABLE "listings" DROP COLUMN "title";--> statement-breakpoint

-- Rename `rooms` (overloaded integer) to `bedrooms` (semantic).
ALTER TABLE "listings" RENAME COLUMN "rooms" TO "bedrooms";--> statement-breakpoint

-- Classification
ALTER TABLE "listings" ADD COLUMN "listing_type" text DEFAULT 'rent' NOT NULL;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "property_type" text DEFAULT 'apartment' NOT NULL;--> statement-breakpoint
ALTER TABLE "listings" ALTER COLUMN "property_type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "lease_type" text;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "min_lease_months" integer;--> statement-breakpoint

-- Availability
ALTER TABLE "listings" ADD COLUMN "available_from" date;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "available_immediately" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "viewing_mode" text;--> statement-breakpoint

-- Pricing breakdown
ALTER TABLE "listings" ADD COLUMN "charges_cents" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "syndic_cents" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "deposit_cents" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "agency_fee_cents" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "includes_utilities" boolean;--> statement-breakpoint

-- CHECK constraints
ALTER TABLE "listings" ADD CONSTRAINT "listings_listing_type_chk" CHECK ("listings"."listing_type" IN ('rent','sale','short_term','student'));--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_property_type_chk" CHECK ("listings"."property_type" IN ('apartment','house','studio','loft','commercial','office','garage','land'));--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_lease_type_chk" CHECK ("listings"."lease_type" IS NULL OR "listings"."lease_type" IN ('residential_9y','short_term','student','commercial'));--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_min_lease_months_chk" CHECK ("listings"."min_lease_months" IS NULL OR ("listings"."min_lease_months" >= 1 AND "listings"."min_lease_months" <= 360));--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_viewing_mode_chk" CHECK ("listings"."viewing_mode" IS NULL OR "listings"."viewing_mode" IN ('self_book','on_request','open_house'));--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_price_cents_chk" CHECK ("listings"."price_cents" >= 0);--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_charges_cents_chk" CHECK ("listings"."charges_cents" IS NULL OR "listings"."charges_cents" >= 0);--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_syndic_cents_chk" CHECK ("listings"."syndic_cents" IS NULL OR "listings"."syndic_cents" >= 0);--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_deposit_cents_chk" CHECK ("listings"."deposit_cents" IS NULL OR "listings"."deposit_cents" >= 0);--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_agency_fee_cents_chk" CHECK ("listings"."agency_fee_cents" IS NULL OR "listings"."agency_fee_cents" >= 0);--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_surface_m2_chk" CHECK ("listings"."surface_m2" > 0);--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_bedrooms_chk" CHECK ("listings"."bedrooms" >= 0);--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_status_chk" CHECK ("listings"."status" IN ('draft','active','inactive','closed'));
