import {
  InvalidRouteScheduleCapacityError,
  InvalidRouteScheduleLabelError,
  InvalidRouteScheduleTimeError,
  InvalidRouteScheduleWeekdaysError,
} from "./route-schedules.errors";

export type RouteScheduleProps = {
  defaultCapacity: number;
  departureTime: string;
  id?: string;
  isActive?: boolean;
  label: string;
  routeId: string;
  weekdays: number[];
};

export class RouteScheduleEntity {
  private constructor(private readonly props: RequiredRouteScheduleProps) {}

  static create(props: RouteScheduleProps): RouteScheduleEntity {
    const label = props.label?.trim();

    if (!label) {
      throw new InvalidRouteScheduleLabelError();
    }

    if (!isValidTime(props.departureTime)) {
      throw new InvalidRouteScheduleTimeError();
    }

    if (props.defaultCapacity <= 0) {
      throw new InvalidRouteScheduleCapacityError();
    }

    if (!areValidWeekdays(props.weekdays)) {
      throw new InvalidRouteScheduleWeekdaysError();
    }

    return new RouteScheduleEntity({
      ...props,
      isActive: props.isActive ?? true,
      label,
      weekdays: [...new Set(props.weekdays)].sort((a, b) => a - b),
    });
  }

  toObject(): RequiredRouteScheduleProps {
    return { ...this.props };
  }
}

type RequiredRouteScheduleProps = Omit<RouteScheduleProps, "isActive"> & {
  isActive: boolean;
};

function areValidWeekdays(weekdays: number[]): boolean {
  return (
    weekdays.length > 0 &&
    weekdays.every(
      (weekday) => Number.isInteger(weekday) && weekday >= 0 && weekday <= 6,
    )
  );
}

function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}
