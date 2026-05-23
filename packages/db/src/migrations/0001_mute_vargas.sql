CREATE TABLE "listing_photos" (
	"listing_id" text NOT NULL,
	"storage_key" text NOT NULL,
	"ord" integer NOT NULL,
	"alt" text,
	CONSTRAINT "listing_photos_listing_id_storage_key_pk" PRIMARY KEY("listing_id","storage_key")
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"created_by" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"street" text NOT NULL,
	"number" text NOT NULL,
	"box" text,
	"postal_code" text NOT NULL,
	"municipality" text NOT NULL,
	"region" text NOT NULL,
	"price_cents" integer NOT NULL,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"surface_m2" integer NOT NULL,
	"rooms" integer NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "listings_org_id_idx" ON "listings" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "listings_status_idx" ON "listings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "listings_created_at_id_idx" ON "listings" USING btree ("created_at","id");