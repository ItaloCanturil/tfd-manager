export class InvalidRouteDestinationError extends Error {
  constructor() {
    super("Route destination is required");
    this.name = "InvalidRouteDestinationError";
  }
}

export class InvalidRouteCapacityError extends Error {
  constructor() {
    super("Route default capacity must be greater than zero");
    this.name = "InvalidRouteCapacityError";
  }
}

export class InvalidRouteWeekdaysError extends Error {
  constructor() {
    super("Route fixed weekdays must be valid weekday numbers");
    this.name = "InvalidRouteWeekdaysError";
  }
}
