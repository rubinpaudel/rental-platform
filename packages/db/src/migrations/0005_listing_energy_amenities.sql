-- Kitchen
ALTER TABLE "listings" ADD COLUMN "kitchen_type" text;--> statement-breakpoint

-- Energy / heating
ALTER TABLE "listings" ADD COLUMN "heating_type" text;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_heat_pump" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_solar_panels" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_thermal_solar" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_shared_boiler" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_double_glazing" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_triple_glazing" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_separate_meter_electricity" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_separate_meter_gas" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_separate_meter_water" boolean;--> statement-breakpoint

-- Interior amenities
ALTER TABLE "listings" ADD COLUMN "has_elevator" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_intercom" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_alarm" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_armored_door" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_air_conditioning" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_internet_available" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_cable_tv" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_video_phone" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "is_accessible_reduced_mobility" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "is_furnished" boolean;--> statement-breakpoint

-- Pet & smoking policy
ALTER TABLE "listings" ADD COLUMN "allows_large_pets" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "allows_small_pets" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "smoking_allowed" boolean;--> statement-breakpoint

-- Marketing extras
ALTER TABLE "listings" ADD COLUMN "video_tour_url" text;--> statement-breakpoint

-- CHECK constraints
ALTER TABLE "listings" ADD CONSTRAINT "listings_kitchen_type_chk" CHECK ("listings"."kitchen_type" IS NULL OR "listings"."kitchen_type" IN ('none','kitchenette','equipped','hyper_equipped','us_open','us_closed'));--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_heating_type_chk" CHECK ("listings"."heating_type" IS NULL OR "listings"."heating_type" IN ('gas','electric','oil','wood','heat_pump','district_heating','other'));
