import { InvalidRouteDepartureDateError } from "./routes.errors";

export type RouteProps = {
  id?: string;
  name: string;
  notes?: string;
  destination: string;
  defaultCapacity: number;
  fixedWeekDays: string[];
};

export class RouteEntity {
  private constructor(private readonly props: RequiredRouteProps) {}

  static create(props: RouteProps): RouteEntity {
    if (!props.departureDate) {
      throw new InvalidRouteDepartureDateError();
    }

    const name =
      props.name?.trim() || formatRouteDefaultName(props.departureDate);

    return new RouteEntity({
      ...props,
      name,
      notes: props.notes ?? null,
      status: props.status ?? "ACTIVE",
    });
  }

  toObject(): RequiredRouteProps {
    return { ...this.props };
  }
}

type RequiredRouteProps = Omit<RouteProps, "name" | "notes" | "status"> & {
  name: string;
  notes: string | null;
  status: "ACTIVE" | "CANCELED";
};

function formatRouteDefaultName(departureDate: string): string {
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
