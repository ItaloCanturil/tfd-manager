export class InvalidRouteDestinationError extends Error {
  constructor() {
    super("Route destination is required");
    this.name = "InvalidRouteDestinationError";
  }
}
