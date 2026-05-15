import { Inject, Injectable } from "@nestjs/common";
import { and, asc, between, eq, ilike, inArray, sql } from "drizzle-orm";
import { DATABASE } from "../../db/db.constants";
import type { Database } from "../../db/db.type";
import { bookings, patients, routes, trips } from "../../db/schema";
import type { ReportBookingRow } from "./reports.type";

type ListPatientsByDestinationReportParams = {
  startDate: string;
  endDate: string;
  destination?: string;
  weekdays?: number[];
};

@Injectable()
export class ReportsRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  listPatientsByDestinationReport(
    params: ListPatientsByDestinationReportParams,
  ): Promise<ReportBookingRow[]> {
    const conditions = [
      between(trips.departureDate, params.startDate, params.endDate),
      eq(bookings.status, "CONFIRMED"),
      params.destination
        ? ilike(routes.destination, `%${params.destination}%`)
        : undefined,
      params.weekdays
        ? inArray(
            sql<number>`extract(dow from ${trips.departureDate})`,
            params.weekdays,
          )
        : undefined,
    ].filter((condition) => condition !== undefined);

    return this.db
      .select({
        bookingId: bookings.id,
        bookingStatus: bookings.status,
        appointmentDate: bookings.appointmentDate,
        finalDestination: bookings.finalDestination,
        hasCompanion: bookings.hasCompanion,
        companionName: bookings.companionName,
        companionSus: bookings.companionSus,
        companionCpf: bookings.companionCpf,
        patientId: patients.id,
        patientName: patients.name,
        patientCpf: patients.cpf,
        patientSusCard: patients.susCard,
        patientPhone: patients.phone,
        tripId: trips.id,
        tripName: trips.name,
        departureDate: trips.departureDate,
        routeId: routes.id,
        routeDestination: routes.destination,
      })
      .from(bookings)
      .innerJoin(patients, eq(bookings.patientId, patients.id))
      .innerJoin(trips, eq(bookings.tripId, trips.id))
      .innerJoin(routes, eq(trips.routeId, routes.id))
      .where(and(...conditions))
      .orderBy(
        asc(trips.departureDate),
        asc(routes.destination),
        asc(bookings.finalDestination),
        asc(patients.name),
      );
  }
}
