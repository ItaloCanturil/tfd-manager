export class InvalidRouteScheduleCapacityError extends Error {
  constructor() {
    super("Route schedule capacity must be greater than zero");
    this.name = "InvalidRouteScheduleCapacityError";
  }
}

export class InvalidRouteScheduleLabelError extends Error {
  constructor() {
    super("Route schedule label is required");
    this.name = "InvalidRouteScheduleLabelError";
  }
}

export class InvalidRouteScheduleTimeError extends Error {
  constructor() {
    super("Route schedule departure time must use HH:mm format");
    this.name = "InvalidRouteScheduleTimeError";
  }
}

export class InvalidRouteScheduleWeekdaysError extends Error {
  constructor() {
    super("Route schedule weekdays must contain values from 0 to 6");
    this.name = "InvalidRouteScheduleWeekdaysError";
  }
}
