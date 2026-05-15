import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const tripStatus = pgEnum("trip_status", ["ACTIVE", "CANCELED"]);

export const bookingStatus = pgEnum("booking_status", [
  "CONFIRMED",
  "ABSENT",
  "CANCELED",
]);

export const userRole = pgEnum("user_role", [
  "COORDINATOR",
  "RECEPTIONIST",
  "TRANSPORT",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
};

export const routes = pgTable("routes", {
  id: uuid("id").primaryKey().defaultRandom(),
  destination: text("destination").notNull(),
  fixedWeekdays: integer("fixed_weekdays").array().notNull(),
  defaultCapacity: integer("default_capacity").notNull(),
  ...timestamps,
});

export const trips = pgTable(
  "trips",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    routeId: uuid("route_id")
      .notNull()
      .references(() => routes.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    notes: text("notes"),
    departureDate: date("departure_date").notNull(),
    capacity: integer("capacity").notNull(),
    status: tripStatus("status").notNull().default("ACTIVE"),
    ...timestamps,
  },
  (table) => [
    index("trips_route_departure_idx").on(table.routeId, table.departureDate),
  ],
);

export const patients = pgTable("patients", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  cpf: text("cpf").notNull().unique(),
  susCard: text("sus_card").notNull().unique(),
  birthDate: date("birth_date").notNull(),
  rg: text("rg").notNull(),
  phone: text("phone").notNull(),
  ...timestamps,
});

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "restrict" }),
    tripId: uuid("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "restrict" }),
    finalDestination: text("final_destination").notNull(),
    appointmentDate: date("appointment_date").notNull(),
    hasCompanion: boolean("has_companion").notNull().default(false),
    companionName: text("companion_name"),
    companionSus: text("companion_sus"),
    companionCpf: text("companion_cpf"),
    status: bookingStatus("status").notNull().default("CONFIRMED"),
    ...timestamps,
  },
  (table) => [
    index("bookings_patient_idx").on(table.patientId),
    index("bookings_trip_status_idx").on(table.tripId, table.status),
  ],
);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps,
});
