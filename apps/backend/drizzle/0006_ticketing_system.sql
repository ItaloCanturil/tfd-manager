CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"status" text NOT NULL,
	"service_id" uuid NOT NULL,
	"room_id" uuid,
	"patient_id" uuid,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_calls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_id" uuid NOT NULL,
	"call_number" integer NOT NULL,
	"room_id" uuid NOT NULL,
	"called_by_user_id" uuid NOT NULL,
	"called_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_daily_counters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"counter_date" date NOT NULL,
	"last_number" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_calls" ADD CONSTRAINT "ticket_calls_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_calls" ADD CONSTRAINT "ticket_calls_called_by_user_id_users_id_fk" FOREIGN KEY ("called_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "tickets_code_unique" ON "tickets" USING btree ("code");--> statement-breakpoint
CREATE INDEX "tickets_service_status_issued_idx" ON "tickets" USING btree ("service_id","status","issued_at");--> statement-breakpoint
CREATE INDEX "tickets_room_idx" ON "tickets" USING btree ("room_id");--> statement-breakpoint
CREATE INDEX "tickets_patient_idx" ON "tickets" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "ticket_calls_ticket_idx" ON "ticket_calls" USING btree ("ticket_id");--> statement-breakpoint
CREATE INDEX "ticket_calls_room_idx" ON "ticket_calls" USING btree ("room_id");--> statement-breakpoint
CREATE INDEX "ticket_calls_called_by_user_idx" ON "ticket_calls" USING btree ("called_by_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ticket_calls_ticket_call_number_unique" ON "ticket_calls" USING btree ("ticket_id","call_number");--> statement-breakpoint
CREATE UNIQUE INDEX "ticket_daily_counters_service_date_unique" ON "ticket_daily_counters" USING btree ("service_id","counter_date");--> statement-breakpoint
CREATE INDEX "ticket_daily_counters_date_idx" ON "ticket_daily_counters" USING btree ("counter_date");
