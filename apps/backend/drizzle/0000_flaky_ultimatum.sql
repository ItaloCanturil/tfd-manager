CREATE TYPE "public"."booking_status" AS ENUM('CONFIRMED', 'ABSENT', 'CANCELED');--> statement-breakpoint
CREATE TYPE "public"."trip_status" AS ENUM('ACTIVE', 'CANCELED');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"trip_id" uuid NOT NULL,
	"appointment_date" date NOT NULL,
	"has_companion" boolean DEFAULT false NOT NULL,
	"companion_name" text,
	"companion_sus" text,
	"companion_cpf" text,
	"status" "booking_status" DEFAULT 'CONFIRMED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"cpf" text NOT NULL,
	"sus_card" text NOT NULL,
	"birth_date" date NOT NULL,
	"rg" text NOT NULL,
	"phone" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "patients_cpf_unique" UNIQUE("cpf"),
	CONSTRAINT "patients_sus_card_unique" UNIQUE("sus_card")
);
--> statement-breakpoint
CREATE TABLE "routes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"destination" text NOT NULL,
	"fixed_weekdays" integer[] NOT NULL,
	"default_capacity" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"route_id" uuid NOT NULL,
	"name" text NOT NULL,
	"notes" text,
	"departure_date" date NOT NULL,
	"capacity" integer NOT NULL,
	"status" "trip_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookings_patient_idx" ON "bookings" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "bookings_trip_status_idx" ON "bookings" USING btree ("trip_id","status");--> statement-breakpoint
CREATE INDEX "trips_route_departure_idx" ON "trips" USING btree ("route_id","departure_date");
