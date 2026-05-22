import { InvalidTripDepartureDateError } from "./trip.errors";

export type TripProps = {
  id?: string;
  routeId: string;
  routeScheduleId: string;
  name?: string;
  notes?: string | null;
  departureDate: string;
  capacity: number;
  status?: "ACTIVE" | "CANCELED";
};

export class TripEntity {
  private constructor(private readonly props: RequiredTripProps) {}

  static create(props: TripProps): TripEntity {
    if (!props.departureDate) {
      throw new InvalidTripDepartureDateError();
    }

    const name = props.name?.trim() || formatTripDefaultName(props.departureDate);

    return new TripEntity({
      ...props,
      name,
      notes: props.notes ?? null,
      status: props.status ?? "ACTIVE",
    });
  }

  toObject(): RequiredTripProps {
    return { ...this.props };
  }
}

type RequiredTripProps = Omit<TripProps, "name" | "notes" | "status"> & {
  name: string;
  notes: string | null;
  status: "ACTIVE" | "CANCELED";
};

function formatTripDefaultName(departureDate: string): string {
  const date = new Date(`${departureDate}T00:00:00`);
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

  return formattedDate.replace(
    / de ([a-z])/,
    (_, firstLetter: string) => ` de ${firstLetter.toUpperCase()}`,
  );
}

