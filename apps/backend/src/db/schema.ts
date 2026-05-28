import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
  uniqueIndex,
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
  ...timestamps,
});

export const routeSchedules = pgTable(
  "route_schedules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    routeId: uuid("route_id")
      .notNull()
      .references(() => routes.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    departureTime: time("departure_time").notNull(),
    weekdays: integer("weekdays").array().notNull(),
    defaultCapacity: integer("default_capacity").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (table) => [index("route_schedules_route_idx").on(table.routeId)],
);

export const trips = pgTable(
  "trips",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    routeId: uuid("route_id")
      .notNull()
      .references(() => routes.id, { onDelete: "restrict" }),
    routeScheduleId: uuid("route_schedule_id")
      .notNull()
      .references(() => routeSchedules.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    notes: text("notes"),
    departureDate: date("departure_date").notNull(),
    capacity: integer("capacity").notNull(),
    status: tripStatus("status").notNull().default("ACTIVE"),
    ...timestamps,
  },
  (table) => [
    index("trips_route_departure_idx").on(table.routeId, table.departureDate),
    index("trips_schedule_departure_idx").on(
      table.routeScheduleId,
      table.departureDate,
    ),
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
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps,
});

export const tickets = pgTable(
  "tickets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull(),
    status: text("status").notNull(),
    serviceId: uuid("service_id").notNull(),
    roomId: uuid("room_id"),
    patientId: uuid("patient_id").references(() => patients.id, {
      onDelete: "restrict",
    }),
    issuedAt: timestamp("issued_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("tickets_code_unique").on(table.code),
    index("tickets_service_status_issued_idx").on(
      table.serviceId,
      table.status,
      table.issuedAt,
    ),
    index("tickets_room_idx").on(table.roomId),
    index("tickets_patient_idx").on(table.patientId),
  ],
);

export const ticketCalls = pgTable(
  "ticket_calls",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ticketId: uuid("ticket_id")
      .notNull()
      .references(() => tickets.id, { onDelete: "cascade" }),
    callNumber: integer("call_number").notNull(),
    roomId: uuid("room_id").notNull(),
    calledByUserId: uuid("called_by_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    calledAt: timestamp("called_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (table) => [
    index("ticket_calls_ticket_idx").on(table.ticketId),
    index("ticket_calls_room_idx").on(table.roomId),
    index("ticket_calls_called_by_user_idx").on(table.calledByUserId),
    uniqueIndex("ticket_calls_ticket_call_number_unique").on(
      table.ticketId,
      table.callNumber,
    ),
  ],
);

export const ticketDailyCounters = pgTable(
  "ticket_daily_counters",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceId: uuid("service_id").notNull(),
    counterDate: date("counter_date").notNull(),
    lastNumber: integer("last_number").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("ticket_daily_counters_service_date_unique").on(
      table.serviceId,
      table.counterDate,
    ),
    index("ticket_daily_counters_date_idx").on(table.counterDate),
  ],
);
