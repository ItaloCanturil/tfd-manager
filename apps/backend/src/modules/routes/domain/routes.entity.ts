import {
  InvalidRouteCapacityError,
  InvalidRouteDestinationError,
  InvalidRouteWeekdaysError,
} from "./routes.errors";

export type RouteProps = {
  id?: string;
  destination: string;
  defaultCapacity: number;
  fixedWeekdays: number[];
};

export class RouteEntity {
  private constructor(private readonly props: RequiredRouteProps) {}

  static create(props: RouteProps): RouteEntity {
    const destination = props.destination?.trim();

    if (!destination) {
      throw new InvalidRouteDestinationError();
    }

    if (props.defaultCapacity <= 0) {
      throw new InvalidRouteCapacityError();
    }

    if (!areValidWeekdays(props.fixedWeekdays)) {
      throw new InvalidRouteWeekdaysError();
    }

    return new RouteEntity({
      ...props,
      destination,
      fixedWeekdays: [...new Set(props.fixedWeekdays)].sort((a, b) => a - b),
    });
  }

  toObject(): RequiredRouteProps {
    return { ...this.props };
  }
}

type RequiredRouteProps = RouteProps;

function areValidWeekdays(weekdays: number[]): boolean {
  return (
    weekdays.length > 0 &&
    weekdays.every(
      (weekday) => Number.isInteger(weekday) && weekday >= 0 && weekday <= 6,
    )
  );
}
