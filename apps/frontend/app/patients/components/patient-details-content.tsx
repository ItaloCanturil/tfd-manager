import type { Booking, Patient, Trip } from "../../lib/tfd-api";
import { PatientBookingsGrid } from "./patient-bookings-grid";
import { PatientHeader } from "./patient-header";
import { PatientOverviewCard } from "./patient-overview-card";
import { PatientQuickActions } from "./patient-quick-actions";

export function PatientDetailsContent({
  bookings,
  onCreateBooking,
  onEditPatient,
  patient,
  trips,
}: {
  bookings: Booking[];
  onCreateBooking: () => void;
  onEditPatient: () => void;
  patient: Patient;
  trips: Trip[];
}) {
  return (
    <section className="overflow-hidden rounded-[calc(var(--radius)*5)] border border-border/70 bg-card/95 shadow-sm backdrop-blur">
      <PatientHeader
        bookingCount={bookings.length}
        onCreateBooking={onCreateBooking}
        onEditPatient={onEditPatient}
        patient={patient}
      />

      <div className="grid gap-6 px-6 py-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <PatientOverviewCard patient={patient} />
          <PatientBookingsGrid bookings={bookings} trips={trips} />
        </div>

        <PatientQuickActions
          onCreateBooking={onCreateBooking}
          onEditPatient={onEditPatient}
        />
      </div>
    </section>
  );
}
