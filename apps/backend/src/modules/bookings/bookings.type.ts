import type { bookings, patients, trips } from "../../db/schema";

export type Booking = typeof bookings.$inferSelect;

export type NewBooking = typeof bookings.$inferInsert;

export type BookingID = Booking["id"];

export type BookingStatus = Booking["status"];

export type UpdateBooking = Partial<
  Omit<NewBooking, "id" | "patientId" | "tripId" | "createdAt" | "updatedAt">
>;

export type Patient = typeof patients.$inferSelect;

export type PatientID = Patient["id"];

export type Trip = typeof trips.$inferSelect;

export type TripID = Trip["id"];
