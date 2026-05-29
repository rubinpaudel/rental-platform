CREATE TABLE "postal_codes" (
	"country_code" text NOT NULL,
	"postal_code" text NOT NULL,
	"place" text NOT NULL,
	"place_normalized" text NOT NULL,
	"region" text,
	"state" text,
	"state_code" text,
	"province" text,
	"province_code" text,
	"community" text,
	"community_code" text,
	"latitude" double precision,
	"longitude" double precision,
	CONSTRAINT "postal_codes_country_code_postal_code_place_pk" PRIMARY KEY("country_code","postal_code","place")
);
--> statement-breakpoint
CREATE INDEX "postal_codes_country_normalized_idx" ON "postal_codes" USING btree ("country_code","place_normalized");