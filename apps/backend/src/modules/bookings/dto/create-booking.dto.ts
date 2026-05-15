import type { NewBooking } from "../bookings.type";

export type CreateBookingDto = Pick<
  NewBooking,
  "patientId" | "tripId" | "finalDestination" | "appointmentDate"
> &
  Partial<
    Pick<
      NewBooking,
      "hasCompanion" | "companionName" | "companionSus" | "companionCpf"
    >
  >;
