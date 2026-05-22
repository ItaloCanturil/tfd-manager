import type { Booking, Patient, Route, RouteSchedule, Trip } from "../../lib/tfd-api";
import { TripHeader } from "./trip-header";
import { TripPatientsList } from "./trip-patients-list";
import { TripSidebar } from "./trip-sidebar";

export function TripDetailsContent({
  bookings,
  patients,
  route,
  schedule,
  trip,
}: {
  bookings: Booking[];
  patients: Patient[];
  route: Route | null;
  schedule: RouteSchedule | null;
  trip: Trip;
}) {
  const patientById = new Map(patients.map((patient) => [patient.id, patient]));
  const rows = bookings.map((booking) => ({
    booking,
    patient: patientById.get(booking.patientId) ?? null,
  }));
  const reservedSeats = countReservedSeats(bookings);
  const availableSeats = Math.max(trip.capacity - reservedSeats, 0);

  return (
    <section className="overflow-hidden rounded-[calc(var(--radius)*5)] border border-border/70 bg-card/95 shadow-sm backdrop-blur">
      <TripHeader
        availableSeats={availableSeats}
        reservedSeats={reservedSeats}
        route={route}
        schedule={schedule}
        trip={trip}
      />

      <div className="grid gap-6 px-6 py-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <TripPatientsList rows={rows} />
        <TripSidebar
          availableSeats={availableSeats}
          reservedSeats={reservedSeats}
          route={route}
          schedule={schedule}
          trip={trip}
        />
      </div>
    </section>
  );
}

function countReservedSeats(bookings: Booking[]) {
  return bookings
    .filter((booking) => booking.status === "CONFIRMED")
    .reduce((sum, booking) => sum + (booking.hasCompanion ? 2 : 1), 0);
}
