CREATE TABLE "route_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"route_id" uuid NOT NULL,
	"label" text NOT NULL,
	"departure_time" time NOT NULL,
	"weekdays" integer[] NOT NULL,
	"default_capacity" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "trips" ADD COLUMN "route_schedule_id" uuid;--> statement-breakpoint
ALTER TABLE "route_schedules" ADD CONSTRAINT "route_schedules_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
INSERT INTO "route_schedules" (
	"route_id",
	"label",
	"departure_time",
	"weekdays",
	"default_capacity"
)
SELECT
	"id",
	'Padrao',
	'00:00',
	"fixed_weekdays",
	"default_capacity"
FROM "routes";--> statement-breakpoint
UPDATE "trips"
SET "route_schedule_id" = "route_schedules"."id"
FROM "route_schedules"
WHERE "trips"."route_id" = "route_schedules"."route_id";--> statement-breakpoint
ALTER TABLE "trips" ALTER COLUMN "route_schedule_id" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "route_schedules_route_idx" ON "route_schedules" USING btree ("route_id");--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_route_schedule_id_route_schedules_id_fk" FOREIGN KEY ("route_schedule_id") REFERENCES "public"."route_schedules"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "trips_schedule_departure_idx" ON "trips" USING btree ("route_schedule_id","departure_date");--> statement-breakpoint
ALTER TABLE "routes" DROP COLUMN "fixed_weekdays";--> statement-breakpoint
ALTER TABLE "routes" DROP COLUMN "default_capacity";
