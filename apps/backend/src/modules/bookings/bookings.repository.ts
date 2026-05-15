import { Inject, Injectable } from "@nestjs/common";
import { and, eq, sql } from "drizzle-orm";
import { DATABASE } from "../../db/db.constants";
import type { Database } from "../../db/db.type";
import { bookings, patients, trips } from "../../db/schema";
import type { ListBookingsDto } from "./dto/list-bookings.dto";
import type {
  Booking,
  BookingID,
  NewBooking,
  Patient,
  PatientID,
  Trip,
  TripID,
  UpdateBooking,
} from "./bookings.type";

@Injectable()
export class BookingsRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async findPatientById(id: PatientID): Promise<Patient | undefined> {
    return this.db.query.patients.findFirst({
      where: eq(patients.id, id),
    });
  }

  async findTripById(id: TripID): Promise<Trip | undefined> {
    return this.db.query.trips.findFirst({
      where: eq(trips.id, id),
    });
  }

  async findById(id: BookingID): Promise<Booking | undefined> {
    return this.db.query.bookings.findFirst({
      where: eq(bookings.id, id),
    });
  }

  async list(filters: ListBookingsDto): Promise<Booking[]> {
    const conditions = [
      filters.patientId ? eq(bookings.patientId, filters.patientId) : undefined,
      filters.tripId ? eq(bookings.tripId, filters.tripId) : undefined,
      filters.status ? eq(bookings.status, filters.status) : undefined,
    ].filter((condition) => condition !== undefined);

    return this.db
      .select()
      .from(bookings)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
  }

  async countReservedSeatsByTripId(tripId: TripID): Promise<number> {
    const [result] = await this.db
      .select({
        reservedSeats: sql<number>`coalesce(sum(case when ${bookings.hasCompanion} then 2 else 1 end), 0)`,
      })
      .from(bookings)
      .where(
        and(eq(bookings.tripId, tripId), eq(bookings.status, "CONFIRMED")),
      );

    return Number(result?.reservedSeats ?? 0);
  }

  async create(booking: NewBooking): Promise<Booking | undefined> {
    const [createdBooking] = await this.db
      .insert(bookings)
      .values(booking)
      .returning();

    return createdBooking;
  }

  async update(
    id: BookingID,
    data: UpdateBooking,
  ): Promise<Booking | undefined> {
    const [booking] = await this.db
      .update(bookings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();

    return booking;
  }
}
