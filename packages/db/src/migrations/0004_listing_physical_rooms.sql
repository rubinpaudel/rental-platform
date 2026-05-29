-- Building section
ALTER TABLE "listings" ADD COLUMN "year_built" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "floor" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "total_floors" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "building_condition" text;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "facade_count" integer;--> statement-breakpoint

-- Surface breakdown
ALTER TABLE "listings" ADD COLUMN "living_room_m2" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "kitchen_m2" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "terrace_m2" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "garden_m2" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "total_land_m2" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "basement_m2" integer;--> statement-breakpoint

-- Room counts
ALTER TABLE "listings" ADD COLUMN "bathrooms" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "shower_rooms" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "toilets" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_office" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_dressing" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_laundry" boolean;--> statement-breakpoint

-- Exterior
ALTER TABLE "listings" ADD COLUMN "has_terrace" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_garden" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_garage" boolean;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "parking_spots" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "orientation" text;--> statement-breakpoint

-- CHECK constraints for the new columns
ALTER TABLE "listings" ADD CONSTRAINT "listings_year_built_chk" CHECK ("listings"."year_built" IS NULL OR ("listings"."year_built" >= 1000 AND "listings"."year_built" <= 2100));--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_floor_chk" CHECK ("listings"."floor" IS NULL OR ("listings"."floor" >= -5 AND "listings"."floor" <= 200));--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_total_floors_chk" CHECK ("listings"."total_floors" IS NULL OR ("listings"."total_floors" >= 1 AND "listings"."total_floors" <= 200));--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_building_condition_chk" CHECK ("listings"."building_condition" IS NULL OR "listings"."building_condition" IN ('new','excellent','good','to_refresh','to_renovate'));--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_facade_count_chk" CHECK ("listings"."facade_count" IS NULL OR ("listings"."facade_count" >= 1 AND "listings"."facade_count" <= 4));--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_living_room_m2_chk" CHECK ("listings"."living_room_m2" IS NULL OR "listings"."living_room_m2" >= 0);--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_kitchen_m2_chk" CHECK ("listings"."kitchen_m2" IS NULL OR "listings"."kitchen_m2" >= 0);--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_terrace_m2_chk" CHECK ("listings"."terrace_m2" IS NULL OR "listings"."terrace_m2" >= 0);--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_garden_m2_chk" CHECK ("listings"."garden_m2" IS NULL OR "listings"."garden_m2" >= 0);--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_total_land_m2_chk" CHECK ("listings"."total_land_m2" IS NULL OR "listings"."total_land_m2" >= 0);--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_basement_m2_chk" CHECK ("listings"."basement_m2" IS NULL OR "listings"."basement_m2" >= 0);--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_bathrooms_chk" CHECK ("listings"."bathrooms" IS NULL OR "listings"."bathrooms" >= 0);--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_shower_rooms_chk" CHECK ("listings"."shower_rooms" IS NULL OR "listings"."shower_rooms" >= 0);--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_toilets_chk" CHECK ("listings"."toilets" IS NULL OR "listings"."toilets" >= 0);--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_parking_spots_chk" CHECK ("listings"."parking_spots" IS NULL OR "listings"."parking_spots" >= 0);--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_orientation_chk" CHECK ("listings"."orientation" IS NULL OR "listings"."orientation" IN ('N','NE','E','SE','S','SW','W','NW'));--> statement-breakpoint

-- listing_rooms: optional per-room area annotations (1:many)
CREATE TABLE "listing_rooms" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"room_type" text NOT NULL,
	"label" text,
	"surface_m2" integer,
	"ord" integer NOT NULL,
	CONSTRAINT "listing_rooms_room_type_chk" CHECK ("listing_rooms"."room_type" IN ('bedroom','bathroom','shower_room','living_room','dining_room','kitchen','office','dressing','laundry','cellar','attic','garage','terrace','garden')),
	CONSTRAINT "listing_rooms_surface_m2_chk" CHECK ("listing_rooms"."surface_m2" IS NULL OR "listing_rooms"."surface_m2" >= 0),
	CONSTRAINT "listing_rooms_ord_chk" CHECK ("listing_rooms"."ord" >= 0)
);--> statement-breakpoint
CREATE INDEX "listing_rooms_listing_id_idx" ON "listing_rooms" USING btree ("listing_id","room_type","ord");
