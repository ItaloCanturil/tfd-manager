export class InvalidTripDepartureDateError extends Error {
  constructor() {
    super("Trip departure date is required");
    this.name = "InvalidTripDepartureDateError";
  }
}

