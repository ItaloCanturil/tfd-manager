import {
  InvalidBookingAppointmentDateError,
  InvalidBookingFinalDestinationError,
} from "./bookings.errors";

export type BookingProps = {
  id?: string;
  patientId: string;
  tripId: string;
  finalDestination: string;
  appointmentDate: string;
  hasCompanion?: boolean;
  companionName?: string | null;
  companionSus?: string | null;
  companionCpf?: string | null;
  status?: "CONFIRMED" | "ABSENT" | "CANCELED";
};

export class BookingEntity {
  private constructor(private readonly props: RequiredBookingProps) {}

  static create(props: BookingProps): BookingEntity {
    if (!props.appointmentDate) {
      throw new InvalidBookingAppointmentDateError();
    }

    const finalDestination = props.finalDestination.trim();

    if (!finalDestination) {
      throw new InvalidBookingFinalDestinationError();
    }

    return new BookingEntity({
      ...props,
      finalDestination,
      hasCompanion: props.hasCompanion ?? false,
      companionName: props.companionName ?? null,
      companionSus: props.companionSus ?? null,
      companionCpf: props.companionCpf ?? null,
      status: props.status ?? "CONFIRMED",
    });
  }

  toObject(): RequiredBookingProps {
    return { ...this.props };
  }
}

type RequiredBookingProps = Omit<
  BookingProps,
  "hasCompanion" | "companionName" | "companionSus" | "companionCpf" | "status"
> & {
  hasCompanion: boolean;
  companionName: string | null;
  companionSus: string | null;
  companionCpf: string | null;
  status: "CONFIRMED" | "ABSENT" | "CANCELED";
};
